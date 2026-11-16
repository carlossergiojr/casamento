// Convites de exemplo (CAVI01–03) para testar em desenvolvimento. Nunca rode em produção.
import pg from "pg";

try {
  process.loadEnvFile?.(".env.local");
} catch {}

const exemplos = [
  { codigo: "CAVI01", titular: "Maria Souza", pessoas: ["Maria Souza", "João Souza"] },
  { codigo: "CAVI02", titular: "Maria Clara Alves", pessoas: ["Maria Clara Alves"] },
  { codigo: "CAVI03", titular: "Família Lima", pessoas: ["Ana Lima", "Pedro Lima", "Sofia Lima"] },
];

const cliente = new pg.Client({ connectionString: process.env.DATABASE_URL });
await cliente.connect();
for (const c of exemplos) {
  const { rows } = await cliente.query(
    "insert into convites (codigo, titular) values ($1, $2) on conflict (codigo) do nothing returning id",
    [c.codigo, c.titular],
  );
  if (!rows[0]) continue;
  for (const [ordem, nome] of c.pessoas.entries()) {
    await cliente.query("insert into pessoas (convite_id, nome, ordem) values ($1, $2, $3)", [rows[0].id, nome, ordem]);
  }
  console.log("semente:", c.codigo);
}
await cliente.end();
