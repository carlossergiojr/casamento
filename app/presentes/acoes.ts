"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { z } from "zod";
import { formatarValor, presenteLivre, presentes, presentesAbertos } from "@/lib/conteudo";
import { db, schema } from "@/lib/db";
import { dentroDoLimite, ipDaRequisicao, registrarTentativa } from "@/lib/limite";
import { criarPreferencia, jaPresenteado } from "@/lib/mercado-pago";

const { pagamentos } = schema;

const Entrada = z.object({
  presenteId: z.string().min(1).max(60),
  nome: z.string().trim().min(1).max(120),
  recado: z.string().trim().max(500).optional().default(""),
  /** Centavos; só conta na cota livre. */
  valor: z.number().int().optional(),
});

export type ResultadoPagamento = { ok: true; url: string } | { ok: false; erro: string };

/** Endereço do site para as voltas do checkout: SITE_URL ou o host da requisição. */
async function urlBase() {
  if (process.env.SITE_URL) return process.env.SITE_URL.replace(/\/$/, "");
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

/**
 * Começa o pagamento de um presente (specs/008): o preço sai da lista no servidor (na cota livre,
 * o valor escolhido, entre o mínimo e o máximo de `presenteLivre`), grava a intenção e devolve o checkout do MP.
 */
export async function iniciarPagamento(entrada: unknown): Promise<ResultadoPagamento> {
  if (!presentesAbertos) return { ok: false, erro: "A lista de presentes ainda não abriu." };
  const dados = Entrada.safeParse(entrada);
  if (!dados.success) return { ok: false, erro: "Confira seu nome." };
  const { presenteId, nome, recado } = dados.data;

  let titulo: string;
  let centavos: number;
  if (presenteId === presenteLivre.id) {
    centavos = dados.data.valor ?? 0;
    if (centavos < presenteLivre.minimo * 100) {
      return { ok: false, erro: `Escolha um valor a partir de ${formatarValor(presenteLivre.minimo * 100)}.` };
    }
    if (centavos > presenteLivre.maximo * 100) {
      return { ok: false, erro: `Para valores acima de ${formatarValor(presenteLivre.maximo * 100)}, fale direto com os noivos.` };
    }
    titulo = presenteLivre.nome;
  } else {
    const presente = presentes.find((p) => p.id === presenteId);
    if (!presente) return { ok: false, erro: "Presente não encontrado." };
    titulo = presente.nome;
    centavos = presente.valor;
  }

  const ip = await ipDaRequisicao();
  if (!(await dentroDoLimite("pagamento", ip, 10, 10))) {
    return { ok: false, erro: "Muitas tentativas seguidas. Espere alguns minutos e tente de novo." };
  }
  await registrarTentativa("pagamento", ip);

  try {
    if (presenteId !== presenteLivre.id && (await jaPresenteado(presenteId))) {
      return { ok: false, erro: "Alguém acabou de dar este presente. Que tal escolher outro?" };
    }
    const [linha] = await db
      .insert(pagamentos)
      .values({ presenteId, nome, recado, valor: centavos })
      .returning({ id: pagamentos.id });
    // Efeito externo fora de transação (constituição IV); se falhar, a linha fica "criado" e não conta como presente.
    const { preferencia, url } = await criarPreferencia({
      pagamentoId: linha.id,
      presenteId,
      titulo: `${titulo} · Casamento V & C`,
      centavos,
      nome,
      base: await urlBase(),
    });
    await db.update(pagamentos).set({ mpPreferencia: preferencia }).where(eq(pagamentos.id, linha.id));
    return { ok: true, url };
  } catch (e) {
    console.error("pagamento:", e);
    return { ok: false, erro: "Não deu para abrir o pagamento agora. Tente de novo em alguns minutos." };
  }
}
