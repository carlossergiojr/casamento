import "server-only";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

/**
 * Um pool por instância do servidor (a Vercel reaproveita instâncias). Em desenvolvimento o
 * módulo recarrega a cada mudança; o globalThis evita abrir um pool novo a cada vez.
 */
const global = globalThis as unknown as { poolCavi?: Pool };
const pool =
  global.poolCavi ??
  new Pool({ connectionString: process.env.DATABASE_URL, max: 5, idleTimeoutMillis: 10_000 });
if (process.env.NODE_ENV !== "production") global.poolCavi = pool;

export const db = drizzle(pool, { schema, casing: "snake_case" });
export { schema };
