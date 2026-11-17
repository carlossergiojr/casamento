import "server-only";
import { and, count, eq, gt, lt } from "drizzle-orm";
import { headers } from "next/headers";
import { db, schema } from "./db";

type Tipo = "senha" | "busca" | "resposta" | "pagamento";
const { tentativas } = schema;

/** IP de quem chamou (a Vercel preenche x-forwarded-for). */
export async function ipDaRequisicao() {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "local";
}

/** true se ainda cabe mais uma tentativa dentro da janela. */
export async function dentroDoLimite(tipo: Tipo, chave: string, max: number, minutos: number) {
  const desde = new Date(Date.now() - minutos * 60_000);
  // Faxina barata: o que tem mais de um dia não serve para nada.
  await db.delete(tentativas).where(lt(tentativas.criadaEm, new Date(Date.now() - 86_400_000)));
  const [{ n }] = await db
    .select({ n: count() })
    .from(tentativas)
    .where(and(eq(tentativas.tipo, tipo), eq(tentativas.chave, chave), gt(tentativas.criadaEm, desde)));
  return n < max;
}

export async function registrarTentativa(tipo: Tipo, chave: string) {
  await db.insert(tentativas).values({ tipo, chave });
}

export async function limparTentativas(tipo: Tipo, chave: string) {
  await db.delete(tentativas).where(and(eq(tentativas.tipo, tipo), eq(tentativas.chave, chave)));
}
