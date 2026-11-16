// Confere o redirecionamento dos QR antigos (specs/006 contracts/redirecionamento.md).
// Uso: node scripts/checar-redirecionamento.mjs <origem> <destino> [CÓDIGO …]
//   origem:  https://carlossergiojr.github.io/casamento   (ou um servidor local)
//   destino: https://<site>.vercel.app
import { createRequire } from "node:module";

// require (e não import) para achar o Playwright instalado na máquina, fora do projeto.
const { chromium } = createRequire(import.meta.url)("playwright");

const [origem, destinoBruto, ...codigos] = process.argv.slice(2);
if (!origem || !destinoBruto) {
  console.error("uso: checar-redirecionamento.mjs <origem> <destino> [códigos…]");
  process.exit(2);
}

const destino = new URL(destinoBruto).origin; // o navegador põe o host em minúsculas

const casos = [
  ["/", "/"],
  ["", "/"],
  ["/confirmar/", "/confirmar/"],
  ["/confirmar/?c=X#y", "/confirmar/?c=X#y"],
  ["/qualquer/coisa", "/qualquer/coisa"],
  ...(codigos.length ? codigos : ["CAVI01"]).map((c) => [`/confirmar/${c}/`, `/confirmar/${c}/`]),
];

const navegador = await chromium.launch();
const pagina = await navegador.newPage();
// Só queremos a URL de chegada; o destino pode nem estar no ar ainda.
await pagina.route(`${destino}/**`, (r) => r.fulfill({ status: 200, body: "ok" }));
let falhas = 0;
for (const [de, para] of casos) {
  await pagina.goto("about:blank");
  await pagina.goto(origem + de).catch(() => {});
  await pagina.waitForURL((u) => u.href.startsWith(destino), { timeout: 5000 }).catch(() => {});
  const chegou = pagina.url();
  const esperado = destino + para;
  const ok = chegou === esperado;
  if (!ok) falhas++;
  console.log(`${ok ? "ok  " : "ERRO"} ${origem}${de} → ${chegou}${ok ? "" : ` (esperado ${esperado})`}`);
}
await navegador.close();
process.exit(falhas ? 1 : 0);
