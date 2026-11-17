import "server-only";
import { and, eq } from "drizzle-orm";
import { db, schema } from "./db";

/**
 * Mercado Pago pelo Checkout Pro (specs/008): o site cria a preferência e manda o convidado para
 * a página do MP (Pix ou cartão); o status volta pelo webhook e pela volta do checkout. Dado de
 * cartão nunca passa por aqui. Só REST com o token (`MP_ACCESS_TOKEN`), sem SDK.
 */

const { pagamentos } = schema;
const API = "https://api.mercadopago.com";

function token() {
  const t = process.env.MP_ACCESS_TOKEN;
  if (!t) throw new Error("MP_ACCESS_TOKEN não configurado");
  return t;
}

type Preferencia = {
  pagamentoId: string;
  presenteId: string;
  titulo: string;
  centavos: number;
  nome: string;
  base: string;
};

/** Cria a preferência e devolve o endereço do checkout. A chave de idempotência é o nosso id. */
export async function criarPreferencia(p: Preferencia) {
  const voltar = `${p.base}/presentes/${p.presenteId}/obrigado/?ref=${p.pagamentoId}`;
  // O MP recusa auto_return e notification_url sem https (no localhost o convidado volta pelo botão).
  const https = p.base.startsWith("https://");
  const resposta = await fetch(`${API}/checkout/preferences`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token()}`,
      "Content-Type": "application/json",
      "X-Idempotency-Key": p.pagamentoId,
    },
    body: JSON.stringify({
      items: [
        { id: p.presenteId, title: p.titulo, quantity: 1, unit_price: p.centavos / 100, currency_id: "BRL" },
      ],
      payer: { name: p.nome },
      external_reference: p.pagamentoId,
      back_urls: { success: voltar, pending: voltar, failure: voltar },
      ...(https && { auto_return: "approved", notification_url: `${p.base}/api/mercado-pago/` }),
      // Pix e cartão; boleto fica de fora (leva dias e o presente ficaria "pendurado").
      payment_methods: { excluded_payment_types: [{ id: "ticket" }], installments: 12 },
      statement_descriptor: "CASAMENTO VC",
    }),
    cache: "no-store",
  });
  if (!resposta.ok) throw new Error(`MP preferência ${resposta.status}: ${await resposta.text()}`);
  const json = (await resposta.json()) as { id: string; init_point: string; sandbox_init_point?: string };
  return { preferencia: json.id, url: json.init_point };
}

type PagamentoMp = {
  id: number;
  status: string;
  external_reference: string | null;
  transaction_amount: number;
  date_approved: string | null;
};

/**
 * Busca o pagamento no MP (a fonte da verdade: o aviso do webhook só traz o id) e grava o status
 * na linha do `external_reference`. Idempotente: pode rodar quantas vezes vier o aviso.
 * Devolve a linha e o status anterior; quem chamou decide se revalida as páginas (o render da
 * página de volta não pode, só o webhook).
 */
export async function sincronizarPagamento(mpId: string) {
  if (!/^\d{1,20}$/.test(mpId)) return null;
  const resposta = await fetch(`${API}/v1/payments/${mpId}`, {
    headers: { Authorization: `Bearer ${token()}` },
    cache: "no-store",
  });
  if (!resposta.ok) throw new Error(`MP pagamento ${resposta.status}`);
  const mp = (await resposta.json()) as PagamentoMp;
  const ref = mp.external_reference ?? "";
  if (!/^[0-9a-f-]{36}$/.test(ref)) return null;

  const [linha] = await db.select().from(pagamentos).where(eq(pagamentos.id, ref));
  if (!linha) return null;
  // Já aprovado por outro pagamento da mesma preferência: uma tentativa recusada não desfaz.
  if (linha.status === "approved" && linha.mpPagamento && linha.mpPagamento !== String(mp.id)) {
    return { linha, antes: linha.status };
  }
  // O valor vem da preferência, mas confere: aprovado só se bate com o que o servidor decidiu.
  const status = mp.status === "approved" && Math.round(mp.transaction_amount * 100) !== linha.valor ? "divergente" : mp.status;
  if (linha.status === status && linha.mpPagamento === String(mp.id)) return { linha, antes: linha.status };

  const [nova] = await db
    .update(pagamentos)
    .set({
      status,
      mpPagamento: String(mp.id),
      pagoEm: status === "approved" ? new Date(mp.date_approved ?? Date.now()) : null,
    })
    .where(eq(pagamentos.id, ref))
    .returning();
  return { linha: nova, antes: linha.status };
}

/** Ids dos presentes já pagos. Sem banco (build local sem DATABASE_URL), nenhum. */
export async function lerPresenteados(): Promise<Set<string>> {
  try {
    const linhas = await db
      .selectDistinct({ id: pagamentos.presenteId })
      .from(pagamentos)
      .where(eq(pagamentos.status, "approved"));
    return new Set(linhas.map((l) => l.id));
  } catch (e) {
    console.error("presenteados:", e);
    return new Set();
  }
}

/** Já tem pagamento aprovado para este presente? */
export async function jaPresenteado(presenteId: string) {
  const [linha] = await db
    .select({ id: pagamentos.id })
    .from(pagamentos)
    .where(and(eq(pagamentos.presenteId, presenteId), eq(pagamentos.status, "approved")))
    .limit(1);
  return !!linha;
}
