/**
 * Fonte da verdade do banco (constituição, princípio V). Mudou aqui → `npm run db:gerar` para
 * criar a migration em drizzle/, que a Vercel aplica no build. Ver specs/006/data-model.md.
 */
import { sql } from "drizzle-orm";
import {
  bigserial,
  boolean,
  date,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

const criadoEm = () => timestamp("criado_em", { withTimezone: true }).notNull().defaultNow();
const atualizadoEm = () =>
  timestamp("atualizado_em", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date());

export const convites = pgTable("convites", {
  id: uuid().primaryKey().defaultRandom(),
  /** Maiúsculas, sem espaços, 3–20 caracteres [A-Z0-9-]: o código impresso no QR. */
  codigo: text().notNull().unique(),
  titular: text().notNull(),
  telefone: text().notNull().default(""),
  lado: text({ enum: ["Victória", "Carlos", "Os dois"] }).notNull().default("Os dois"),
  obs: text().notNull().default(""),
  /** Do RSVP, até 300 caracteres. */
  restricao: text().notNull().default(""),
  respondidoEm: timestamp("respondido_em", { withTimezone: true }),
  criadoEm: criadoEm(),
  atualizadoEm: atualizadoEm(),
});

export const pessoas = pgTable(
  "pessoas",
  {
    id: uuid().primaryKey().defaultRandom(),
    conviteId: uuid("convite_id")
      .notNull()
      .references(() => convites.id, { onDelete: "cascade" }),
    nome: text().notNull(),
    ordem: integer().notNull(),
    resposta: text({ enum: ["pendente", "vem", "nao-vem"] }).notNull().default("pendente"),
  },
  (t) => [index("pessoas_convite_idx").on(t.conviteId)],
);

export const gastos = pgTable("gastos", {
  id: uuid().primaryKey().defaultRandom(),
  item: text().notNull(),
  fornecedor: text().notNull().default(""),
  /** Centavos. */
  previsto: integer().notNull().default(0),
  pago: integer().notNull().default(0),
  vencimento: date({ mode: "string" }),
  estimado: boolean().notNull().default(false),
  obs: text().notNull().default(""),
  ordem: integer().notNull(),
});

export const tarefas = pgTable("tarefas", {
  id: uuid().primaryKey().defaultRandom(),
  titulo: text().notNull(),
  nota: text().notNull().default(""),
  fase: text().notNull(),
  categoria: text().notNull().default(""),
  feita: boolean().notNull().default(false),
  urgente: boolean().notNull().default(false),
  ordem: integer().notNull(),
});

export const notas = pgTable("notas", {
  id: uuid().primaryKey().defaultRandom(),
  titulo: text().notNull().default(""),
  texto: text().notNull().default(""),
  ordem: integer().notNull(),
});

/**
 * Um presente que o convidado começou a pagar no Mercado Pago (specs/008). Nasce "criado" ao ir
 * para o checkout; o webhook e a volta do checkout gravam o status do MP ("approved",
 * "pending", "rejected"…). Presenteado = tem pagamento "approved".
 */
export const pagamentos = pgTable(
  "pagamentos",
  {
    id: uuid().primaryKey().defaultRandom(),
    /** Id do item em lib/conteudo.ts ("livre" = cota lua de mel). */
    presenteId: text("presente_id").notNull(),
    nome: text().notNull(),
    recado: text().notNull().default(""),
    /** Centavos, decidido no servidor (preço da lista ou valor da cota livre). */
    valor: integer().notNull(),
    status: text().notNull().default("criado"),
    mpPreferencia: text("mp_preferencia"),
    mpPagamento: text("mp_pagamento"),
    pagoEm: timestamp("pago_em", { withTimezone: true }),
    criadoEm: criadoEm(),
    atualizadoEm: atualizadoEm(),
  },
  (t) => [index("pagamentos_status_idx").on(t.status, t.presenteId)],
);

/** Para limitar senha errada e varredura de convites (specs/006 R6). */
export const tentativas = pgTable(
  "tentativas",
  {
    id: bigserial({ mode: "number" }).primaryKey(),
    chave: text().notNull(),
    tipo: text({ enum: ["senha", "busca", "resposta", "pagamento"] }).notNull(),
    criadaEm: timestamp("criada_em", { withTimezone: true }).notNull().default(sql`now()`),
  },
  (t) => [index("tentativas_idx").on(t.tipo, t.chave, t.criadaEm)],
);
