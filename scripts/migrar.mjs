// Aplica as migrations de drizzle/ (constituição, princípio V). Roda antes do `next build`.
// Sem banco configurado (build local sem .env), só avisa.
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import pg from "pg";

try {
  process.loadEnvFile?.(".env.local");
} catch {}

const url = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
if (!url) {
  console.log("migrar: sem DATABASE_URL, nada a fazer.");
  process.exit(0);
}

const pool = new pg.Pool({ connectionString: url, max: 1 });
try {
  await migrate(drizzle(pool), { migrationsFolder: "drizzle" });
  console.log("migrar: banco em dia.");
} finally {
  await pool.end();
}
