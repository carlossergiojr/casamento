"use server";

import { and, eq, inArray } from "drizzle-orm";
import { z } from "zod";
import { normalizarCodigo, normalizarTexto } from "@/lib/codigo";
import { prazoEncerrado } from "@/lib/conteudo";
import { db, schema } from "@/lib/db";
import { dentroDoLimite, ipDaRequisicao, registrarTentativa } from "@/lib/limite";

const { convites, pessoas } = schema;

export type ResultadoBusca =
  | { ok: true; convites: { codigo: string; titular: string; quantas: number }[] | null }
  | { ok: false; erro: string };

const MUITAS = "Muitas tentativas seguidas. Espere alguns minutos e tente de novo.";

/** Busca por código exato ou parte do nome; devolve só o titular (specs/006 FR-007). */
export async function buscarConvite(termoBruto: unknown): Promise<ResultadoBusca> {
  const termo = z.string().max(80).safeParse(termoBruto);
  if (!termo.success) return { ok: true, convites: null };
  const texto = normalizarTexto(termo.data);
  if (texto.length < 3) return { ok: true, convites: null };

  const ip = await ipDaRequisicao();
  if (!(await dentroDoLimite("busca", ip, 30, 10))) return { ok: false, erro: MUITAS };
  await registrarTentativa("busca", ip);

  try {
    // ~50 convites: carregar e filtrar aqui é mais simples (e sem depender de unaccent no banco).
    const linhas = await db
      .select({ id: convites.id, codigo: convites.codigo, titular: convites.titular, nome: pessoas.nome })
      .from(convites)
      .leftJoin(pessoas, eq(pessoas.conviteId, convites.id));
    const porConvite = new Map<string, { codigo: string; titular: string; nomes: string[] }>();
    for (const l of linhas) {
      const c = porConvite.get(l.id) ?? { codigo: l.codigo, titular: l.titular, nomes: [] };
      if (l.nome) c.nomes.push(l.nome);
      porConvite.set(l.id, c);
    }
    const todos = [...porConvite.values()];
    const codigo = normalizarCodigo(termo.data);
    const exato = todos.filter((c) => c.codigo === codigo);
    const achados = exato.length
      ? exato
      : todos.filter((c) => [c.titular, ...c.nomes].some((n) => normalizarTexto(n).includes(texto)));
    return {
      ok: true,
      convites: achados.slice(0, 5).map((c) => ({ codigo: c.codigo, titular: c.titular, quantas: c.nomes.length })),
    };
  } catch {
    return { ok: false, erro: "Não deu para buscar agora. Tente de novo em alguns minutos." };
  }
}

const Resposta = z.object({
  codigo: z.string().min(1).max(40),
  respostas: z
    .array(z.object({ pessoaId: z.uuid(), resposta: z.enum(["vem", "nao-vem"]) }))
    .min(1)
    .max(30),
  restricao: z.string().trim().max(300).optional().default(""),
});

export type ResultadoResposta = { ok: true } | { ok: false; erro: string };

/** Grava a resposta do convite (specs/006 FR-008 a FR-010). */
export async function responderConvite(entrada: unknown): Promise<ResultadoResposta> {
  const dados = Resposta.safeParse(entrada);
  if (!dados.success) return { ok: false, erro: "Resposta incompleta. Marque Vou ou Não vou para cada pessoa." };
  if (prazoEncerrado()) return { ok: false, erro: "O prazo para responder terminou. Fale direto com os noivos." };

  const ip = await ipDaRequisicao();
  if (!(await dentroDoLimite("resposta", ip, 20, 10))) return { ok: false, erro: MUITAS };
  await registrarTentativa("resposta", ip);

  try {
    const codigo = normalizarCodigo(dados.data.codigo);
    const [convite] = await db.select({ id: convites.id }).from(convites).where(eq(convites.codigo, codigo));
    if (!convite) return { ok: false, erro: "Convite não encontrado." };

    const daLista = await db.select({ id: pessoas.id }).from(pessoas).where(eq(pessoas.conviteId, convite.id));
    const ids = new Set(daLista.map((p) => p.id));
    const enviados = new Set(dados.data.respostas.map((r) => r.pessoaId));
    if (ids.size !== enviados.size || [...ids].some((id) => !enviados.has(id))) {
      return { ok: false, erro: "A lista de pessoas mudou. Atualize a página e responda de novo." };
    }

    await db.transaction(async (tx) => {
      for (const resposta of ["vem", "nao-vem"] as const) {
        const alvo = dados.data.respostas.filter((r) => r.resposta === resposta).map((r) => r.pessoaId);
        if (alvo.length) {
          await tx
            .update(pessoas)
            .set({ resposta })
            .where(and(eq(pessoas.conviteId, convite.id), inArray(pessoas.id, alvo)));
        }
      }
      await tx
        .update(convites)
        .set({ restricao: dados.data.restricao, respondidoEm: new Date() })
        .where(eq(convites.id, convite.id));
    });
    return { ok: true };
  } catch {
    return { ok: false, erro: "Não deu para salvar agora. Tente de novo em alguns minutos." };
  }
}
