"use server";

import { and, eq, max, notInArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { codigoValido, gerarCodigo, normalizarCodigo } from "@/lib/codigo";
import { db, schema } from "@/lib/db";
import { dentroDoLimite, ipDaRequisicao, limparTentativas, registrarTentativa } from "@/lib/limite";
import type { DadosNoivos, Resultado } from "@/lib/noivos";
import { lerDadosNoivos } from "@/lib/noivos-servidor";
import { apagarSessao, criarSessao, senhaConfere, sessaoValida } from "@/lib/sessao";

const { convites, pessoas, gastos, tarefas, notas } = schema;

const SEM_SESSAO = { ok: false as const, erro: "sessao" };
const FALHOU = { ok: false as const, erro: "Não deu para salvar agora. Tente de novo." };

/** Toda ação dos noivos passa por aqui: sem sessão, nada é lido nem gravado (specs/006 FR-012). */
async function comSessao<T>(fazer: () => Promise<Resultado<T>>): Promise<Resultado<T>> {
  if (!(await sessaoValida())) return SEM_SESSAO;
  try {
    const r = await fazer();
    revalidatePath("/noivos");
    return r;
  } catch (e) {
    console.error("noivos:", e);
    return FALHOU;
  }
}

/* ───────────── Senha ───────────── */

export async function entrar(senha: unknown): Promise<Resultado> {
  const ip = await ipDaRequisicao();
  if (!(await dentroDoLimite("senha", ip, 5, 15))) {
    return { ok: false, erro: "Muitas tentativas. Tente de novo em 15 minutos." };
  }
  if (typeof senha !== "string" || !senhaConfere(senha)) {
    await registrarTentativa("senha", ip);
    return { ok: false, erro: "Senha incorreta." };
  }
  await limparTentativas("senha", ip);
  await criarSessao();
  revalidatePath("/noivos");
  return { ok: true };
}

export async function sair(): Promise<Resultado> {
  await apagarSessao();
  revalidatePath("/noivos");
  return { ok: true };
}

/* ───────────── Validação ───────────── */

const texto = (n: number) => z.string().trim().max(n);
const id = z.uuid();
const centavos = z.number().int().min(0).max(1_000_000_000);

const PessoaZ = z.object({ id, nome: texto(120).min(1), resposta: z.enum(["pendente", "vem", "nao-vem"]) });
const ConvidadoZ = z.object({
  id,
  codigo: z.string().max(40),
  titular: texto(120).min(1),
  pessoas: z.array(PessoaZ).min(1).max(30),
  telefone: texto(40),
  lado: z.enum(["Victória", "Carlos", "Os dois"]),
  obs: texto(1000),
  restricao: texto(1000),
});
const GastoZ = z.object({
  id,
  item: texto(120).min(1),
  fornecedor: texto(120),
  previsto: centavos,
  pago: centavos,
  vencimento: z.union([z.literal(""), z.iso.date()]),
  obs: texto(2000),
  estimado: z.boolean(),
});
const TarefaZ = z.object({
  id,
  titulo: texto(200).min(1),
  nota: texto(2000),
  fase: texto(120).min(1),
  categoria: texto(60),
  feita: z.boolean(),
  urgente: z.boolean(),
});
const NotaZ = z.object({ id, titulo: texto(200), texto: texto(20000) });

/** Próxima posição numa lista (novos itens vão para o fim). */
async function proximaOrdem(tabela: typeof gastos | typeof tarefas | typeof notas) {
  const [{ m }] = await db.select({ m: max(tabela.ordem) }).from(tabela);
  return (m ?? -1) + 1;
}

/* ───────────── Convites ───────────── */

export async function salvarConvite(entrada: unknown): Promise<Resultado<{ codigo: string }>> {
  const v = ConvidadoZ.safeParse(entrada);
  if (!v.success) return { ok: false, erro: "Confira o titular e as pessoas do convite." };
  const c = v.data;
  let codigo = normalizarCodigo(c.codigo);
  if (codigo && !codigoValido(codigo)) return { ok: false, erro: "Código: de 3 a 20 letras ou números." };

  return comSessao(async () => {
    const outro = codigo
      ? await db.select({ id: convites.id }).from(convites).where(eq(convites.codigo, codigo))
      : [];
    if (outro.some((x) => x.id !== c.id)) return { ok: false, erro: "Código já usado em outro convite." };
    if (!codigo) codigo = await codigoLivre();

    const campos = { codigo, titular: c.titular, telefone: c.telefone, lado: c.lado, obs: c.obs, restricao: c.restricao };
    await db.transaction(async (tx) => {
      await tx.insert(convites).values({ id: c.id, ...campos }).onConflictDoUpdate({ target: convites.id, set: campos });
      const ids = c.pessoas.map((p) => p.id);
      await tx.delete(pessoas).where(and(eq(pessoas.conviteId, c.id), notInArray(pessoas.id, ids)));
      for (const [ordem, p] of c.pessoas.entries()) {
        const linha = { conviteId: c.id, nome: p.nome, resposta: p.resposta, ordem };
        await tx.insert(pessoas).values({ id: p.id, ...linha }).onConflictDoUpdate({ target: pessoas.id, set: linha });
      }
    });
    return { ok: true, valor: { codigo } };
  });
}

async function codigoLivre() {
  for (;;) {
    const codigo = gerarCodigo();
    const [existe] = await db.select({ id: convites.id }).from(convites).where(eq(convites.codigo, codigo));
    if (!existe) return codigo;
  }
}

export async function apagarConvite(conviteId: unknown): Promise<Resultado> {
  const v = id.safeParse(conviteId);
  if (!v.success) return FALHOU;
  return comSessao(async () => {
    await db.delete(convites).where(eq(convites.id, v.data));
    return { ok: true };
  });
}

/* ───────────── Gastos, tarefas, notas ───────────── */

export async function salvarGasto(entrada: unknown): Promise<Resultado> {
  const v = GastoZ.safeParse(entrada);
  if (!v.success) return { ok: false, erro: "Confira o nome e os valores do gasto." };
  const { id: gid, vencimento, ...resto } = v.data;
  return comSessao(async () => {
    const campos = { ...resto, vencimento: vencimento || null };
    await db
      .insert(gastos)
      .values({ id: gid, ...campos, ordem: await proximaOrdem(gastos) })
      .onConflictDoUpdate({ target: gastos.id, set: campos });
    return { ok: true };
  });
}

export async function salvarTarefa(entrada: unknown): Promise<Resultado> {
  const v = TarefaZ.safeParse(entrada);
  if (!v.success) return { ok: false, erro: "Escreva o que precisa ser feito." };
  const { id: tid, ...campos } = v.data;
  return comSessao(async () => {
    await db
      .insert(tarefas)
      .values({ id: tid, ...campos, ordem: await proximaOrdem(tarefas) })
      .onConflictDoUpdate({ target: tarefas.id, set: campos });
    return { ok: true };
  });
}

export async function marcarTarefa(tarefaId: unknown, feita: unknown): Promise<Resultado> {
  const v = z.object({ id, feita: z.boolean() }).safeParse({ id: tarefaId, feita });
  if (!v.success) return FALHOU;
  return comSessao(async () => {
    await db.update(tarefas).set({ feita: v.data.feita }).where(eq(tarefas.id, v.data.id));
    return { ok: true };
  });
}

export async function salvarNota(entrada: unknown): Promise<Resultado> {
  const v = NotaZ.safeParse(entrada);
  if (!v.success) return { ok: false, erro: "Nota grande demais." };
  const { id: nid, ...campos } = v.data;
  return comSessao(async () => {
    await db
      .insert(notas)
      .values({ id: nid, ...campos, ordem: await proximaOrdem(notas) })
      .onConflictDoUpdate({ target: notas.id, set: campos });
    return { ok: true };
  });
}

const tabelas = { gasto: gastos, tarefa: tarefas, nota: notas } as const;

export async function apagar(tipo: keyof typeof tabelas, itemId: unknown): Promise<Resultado> {
  const v = id.safeParse(itemId);
  if (!v.success || !(tipo in tabelas)) return FALHOU;
  const tabela = tabelas[tipo];
  return comSessao(async () => {
    await db.delete(tabela).where(eq(tabela.id, v.data));
    return { ok: true };
  });
}

/* ───────────── Cópias (specs/006 US4) ───────────── */

/**
 * Aceita o arquivo de "Salvar cópia" de qualquer versão: o antigo (pessoas como nomes, resposta e
 * quantosVem no convite, ids curtos, sem tarefas/notas) e o novo (o que `exportarCopia` gera).
 */
// optional(): os arquivos antigos não têm todos os campos (ex.: estimado, codigo, restricao).
const campoLivre = () => z.unknown().optional();
const uuidOuNovo = campoLivre()
  .transform((x) => (typeof x === "string" && id.safeParse(x).success ? x : crypto.randomUUID()));
const str = campoLivre().transform((x) => (typeof x === "string" ? x : ""));
const bool = campoLivre().transform((x) => x === true);
const num = campoLivre().transform((x) => (typeof x === "number" && Number.isFinite(x) ? Math.max(0, Math.round(x)) : 0));
const RESPOSTAS = ["pendente", "vem", "nao-vem"] as const;
const resposta = campoLivre().transform((x) => (RESPOSTAS.includes(x as never) ? (x as (typeof RESPOSTAS)[number]) : "pendente"));

const ConvidadoCopia = z
  .object({
    id: uuidOuNovo,
    codigo: str,
    titular: str,
    pessoas: z.array(z.union([z.string(), z.object({ id: uuidOuNovo, nome: str, resposta })])).default([]),
    telefone: str,
    lado: campoLivre().transform((x) => (x === "Victória" || x === "Carlos" ? x : "Os dois") as "Victória" | "Carlos" | "Os dois"),
    obs: str,
    restricao: str,
    resposta,
    quantosVem: num,
  })
  .transform((c) => {
    const lista = c.pessoas.length ? c.pessoas : [c.titular];
    const pessoasConv = lista.map((p, i) =>
      typeof p === "string"
        ? {
            id: crypto.randomUUID(),
            nome: p,
            // Formato antigo: "vem" com quantosVem = n → as n primeiras vêm (specs/006 R8).
            resposta:
              c.resposta === "vem"
                ? i < (c.quantosVem || lista.length) ? ("vem" as const) : ("nao-vem" as const)
                : c.resposta,
          }
        : p,
    );
    return { ...c, pessoas: pessoasConv.filter((p) => p.nome.trim()) };
  });

const Copia = z.object({
  convidados: z.array(ConvidadoCopia).default([]),
  gastos: z
    .array(z.object({ id: uuidOuNovo, item: str, fornecedor: str, previsto: num, pago: num, vencimento: str, obs: str, estimado: bool }))
    .default([]),
  tarefas: z
    .array(z.object({ id: uuidOuNovo, titulo: str, nota: str, fase: str, categoria: str, feita: bool, urgente: bool }))
    .default([]),
  notas: z.array(z.object({ id: uuidOuNovo, titulo: str, texto: str })).default([]),
});

export async function importarCopia(conteudo: unknown): Promise<Resultado<{ convidados: number; gastos: number; tarefas: number; notas: number }>> {
  const bruto = typeof conteudo === "string" ? (() => { try { return JSON.parse(conteudo); } catch { return null; } })() : conteudo;
  if (!bruto || typeof bruto !== "object" || (bruto as { versao?: unknown }).versao !== 1) {
    return { ok: false, erro: "Esse arquivo não é uma cópia da área dos noivos." };
  }
  const v = Copia.safeParse(bruto);
  if (!v.success) return { ok: false, erro: "Esse arquivo não é uma cópia da área dos noivos." };
  const d = v.data;

  return comSessao(async () => {
    const usados = new Set<string>();
    await db.transaction(async (tx) => {
      await tx.delete(convites); // pessoas vão junto (cascade)
      await tx.delete(gastos);
      await tx.delete(tarefas);
      await tx.delete(notas);

      for (const c of d.convidados.filter((x) => x.titular.trim() || x.pessoas.length)) {
        let codigo = normalizarCodigo(c.codigo);
        if (!codigoValido(codigo) || usados.has(codigo)) do codigo = gerarCodigo(); while (usados.has(codigo));
        usados.add(codigo);
        const respondeu = c.pessoas.some((p) => p.resposta !== "pendente");
        await tx.insert(convites).values({
          id: c.id,
          codigo,
          titular: c.titular.trim() || c.pessoas[0]?.nome || "(sem nome)",
          telefone: c.telefone,
          lado: c.lado,
          obs: c.obs,
          restricao: c.restricao,
          respondidoEm: respondeu ? new Date() : null,
        });
        if (c.pessoas.length) {
          await tx.insert(pessoas).values(c.pessoas.map((p, ordem) => ({ id: p.id, conviteId: c.id, nome: p.nome, resposta: p.resposta, ordem })));
        }
      }
      const gs = d.gastos.filter((g) => g.item.trim());
      if (gs.length) {
        await tx.insert(gastos).values(
          gs.map((g, ordem) => ({ ...g, vencimento: /^\d{4}-\d{2}-\d{2}$/.test(g.vencimento) ? g.vencimento : null, ordem })),
        );
      }
      const ts = d.tarefas.filter((t) => t.titulo.trim());
      if (ts.length) await tx.insert(tarefas).values(ts.map((t, ordem) => ({ ...t, fase: t.fase || "Sem etapa", ordem })));
      if (d.notas.length) await tx.insert(notas).values(d.notas.map((n, ordem) => ({ ...n, ordem })));
    });
    return {
      ok: true,
      valor: { convidados: usados.size, gastos: d.gastos.length, tarefas: d.tarefas.length, notas: d.notas.length },
    };
  });
}

/**
 * Soma convites ao que já está no banco (ex.: a planilha dos QR), sem apagar nada: o código que
 * já existe é pulado. Aceita o mesmo formato da cópia (só `convidados` é lido).
 */
export async function adicionarConvites(
  conteudo: unknown,
): Promise<Resultado<{ adicionados: number; pulados: string[] }>> {
  const v = Copia.pick({ convidados: true }).safeParse(conteudo);
  if (!v.success) return { ok: false, erro: "Esse arquivo não tem convites." };
  const lista = v.data.convidados.filter((c) => c.titular.trim() || c.pessoas.length);
  if (!lista.length || lista.length > 500) return { ok: false, erro: "Esse arquivo não tem convites." };

  return comSessao(async () => {
    const existentes = new Set((await db.select({ codigo: convites.codigo }).from(convites)).map((x) => x.codigo));
    const pulados: string[] = [];
    let adicionados = 0;
    await db.transaction(async (tx) => {
      for (const c of lista) {
        let codigo = normalizarCodigo(c.codigo);
        if (codigo && existentes.has(codigo)) {
          pulados.push(codigo);
          continue;
        }
        if (!codigoValido(codigo)) do codigo = gerarCodigo(); while (existentes.has(codigo));
        existentes.add(codigo);
        const conviteId = crypto.randomUUID();
        await tx.insert(convites).values({
          id: conviteId,
          codigo,
          titular: (c.titular.trim() || c.pessoas[0]?.nome || "(sem nome)").slice(0, 120),
          telefone: c.telefone.slice(0, 40),
          lado: c.lado,
          obs: c.obs.slice(0, 1000),
        });
        const nomes = c.pessoas.slice(0, 30).map((p) => p.nome.trim().slice(0, 120)).filter(Boolean);
        if (nomes.length) {
          await tx.insert(pessoas).values(nomes.map((nome, ordem) => ({ conviteId, nome, ordem })));
        }
        adicionados++;
      }
    });
    return { ok: true, valor: { adicionados, pulados } };
  });
}

export async function exportarCopia():Promise<Resultado<DadosNoivos & { versao: 1 }>> {
  if (!(await sessaoValida())) return SEM_SESSAO;
  return { ok: true, valor: { versao: 1, ...(await lerDadosNoivos()) } };
}
