import "server-only";
import { asc } from "drizzle-orm";
import { db, schema } from "./db";
import type { DadosNoivos } from "./noivos";

const { convites, pessoas, gastos, tarefas, notas } = schema;

/** Tudo da área dos noivos. Só chamar depois de conferir a sessão. */
export async function lerDadosNoivos(): Promise<DadosNoivos> {
  const [cs, ps, gs, ts, ns] = await Promise.all([
    db.select().from(convites).orderBy(asc(convites.titular)),
    db.select().from(pessoas).orderBy(asc(pessoas.ordem)),
    db.select().from(gastos).orderBy(asc(gastos.ordem)),
    db.select().from(tarefas).orderBy(asc(tarefas.ordem)),
    db.select().from(notas).orderBy(asc(notas.ordem)),
  ]);
  return {
    convidados: cs.map((c) => ({
      id: c.id,
      codigo: c.codigo,
      titular: c.titular,
      telefone: c.telefone,
      lado: c.lado,
      obs: c.obs,
      restricao: c.restricao,
      respondidoEm: c.respondidoEm?.toISOString() ?? null,
      pessoas: ps.filter((p) => p.conviteId === c.id).map((p) => ({ id: p.id, nome: p.nome, resposta: p.resposta })),
    })),
    gastos: gs.map((g) => ({
      id: g.id,
      item: g.item,
      fornecedor: g.fornecedor,
      previsto: g.previsto,
      pago: g.pago,
      vencimento: g.vencimento ?? "",
      obs: g.obs,
      estimado: g.estimado,
    })),
    tarefas: ts.map(({ ordem: _ordem, ...t }) => t),
    notas: ns.map(({ ordem: _ordem, ...n }) => n),
  };
}
