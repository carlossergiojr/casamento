"use client";

import { useEffect, useSyncExternalStore } from "react";
import { codigoValido, normalizarCodigo } from "./codigo";

/**
 * O convite deste aparelho. O QR impresso (`/?id=CÓDIGO`, ver next.config.ts) passa por
 * `/confirmar/CÓDIGO`, que confere o código e manda para a home com `?convite=CÓDIGO`: o convidado vê a cortina e o site, e o "Eu vou!" já leva direto ao convite
 * dele, sem a busca por nome. Fica no `localStorage` (a home continua estática) e vale também
 * para quem volta outro dia pelo endereço comum.
 */
const CHAVE = "cavi-meu-convite";
const EVENTO = "cavi:meu-convite";

function ler() {
  try {
    return localStorage.getItem(CHAVE);
  } catch {
    return null;
  }
}

export function guardarMeuConvite(codigoBruto: string) {
  const codigo = normalizarCodigo(codigoBruto);
  if (!codigoValido(codigo) || ler() === codigo) return;
  try {
    localStorage.setItem(CHAVE, codigo);
  } catch {
    return;
  }
  window.dispatchEvent(new Event(EVENTO));
}

/** "Não é o meu convite": o aparelho esquece o convite e o "Eu vou!" volta para a busca. */
export function esquecerMeuConvite() {
  try {
    localStorage.removeItem(CHAVE);
  } catch {
    return;
  }
  window.dispatchEvent(new Event(EVENTO));
}

function assinar(avisar: () => void) {
  window.addEventListener(EVENTO, avisar);
  window.addEventListener("storage", avisar);
  return () => {
    window.removeEventListener(EVENTO, avisar);
    window.removeEventListener("storage", avisar);
  };
}

/** Para onde vai o "Confirmar presença": o convite deste aparelho ou, sem ele, a busca por nome. */
export function useHrefConfirmar() {
  const codigo = useSyncExternalStore(assinar, ler, () => null);
  return codigo ? `/confirmar/${codigo}?de=site` : "/confirmar";
}

/** Na home: guarda o `?convite=` vindo do QR e tira o parâmetro do endereço. */
export function LembrarConvite() {
  useEffect(() => {
    const url = new URL(location.href);
    const codigo = url.searchParams.get("convite");
    if (!codigo) return;
    guardarMeuConvite(codigo);
    url.searchParams.delete("convite");
    history.replaceState(history.state, "", url.pathname + url.search + url.hash);
  }, []);
  return null;
}
