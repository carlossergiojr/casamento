import "server-only";
import { asc, eq } from "drizzle-orm";
import { normalizarCodigo } from "./codigo";
import { db, schema } from "./db";

const { convites, pessoas } = schema;

/** O que o convidado pode ver do próprio convite (specs/006 contracts: nunca telefone/obs/lado). */
export type ConvitePublico = {
  codigo: string;
  titular: string;
  restricao: string;
  respondido: boolean;
  pessoas: { id: string; nome: string; resposta: "pendente" | "vem" | "nao-vem" }[];
};

export async function lerConvitePublico(codigoBruto: string): Promise<ConvitePublico | null> {
  const codigo = normalizarCodigo(codigoBruto);
  if (!codigo) return null;
  const [c] = await db
    .select({ id: convites.id, codigo: convites.codigo, titular: convites.titular, restricao: convites.restricao, respondidoEm: convites.respondidoEm })
    .from(convites)
    .where(eq(convites.codigo, codigo));
  if (!c) return null;
  const lista = await db
    .select({ id: pessoas.id, nome: pessoas.nome, resposta: pessoas.resposta })
    .from(pessoas)
    .where(eq(pessoas.conviteId, c.id))
    .orderBy(asc(pessoas.ordem));
  return { codigo: c.codigo, titular: c.titular, restricao: c.restricao, respondido: !!c.respondidoEm, pessoas: lista };
}
