/** Códigos de convite (o que vai no QR). Ver specs/006 R7. */

const ALFABETO = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // sem 0/O, 1/I/L

/** "cavi 01" → "CAVI01". */
export const normalizarCodigo = (texto: string) =>
  texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toUpperCase()
    .replace(/[^A-Z0-9-]/g, "");

export const codigoValido = (codigo: string) => /^[A-Z0-9-]{3,20}$/.test(codigo);

export function gerarCodigo(tamanho = 6) {
  const bytes = crypto.getRandomValues(new Uint8Array(tamanho));
  return Array.from(bytes, (b) => ALFABETO[b % ALFABETO.length]).join("");
}

/** Para buscas por nome: sem acento, minúsculas. */
export const normalizarTexto = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
