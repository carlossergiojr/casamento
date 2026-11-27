"use client";

import { useEffect, useSyncExternalStore } from "react";
import { registrarVisita } from "@/app/confirmar/acoes";
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

/** Conta uma visita deste convite, no máximo uma por aba (o `sessionStorage` lembra). */
export function marcarVisita(codigoBruto: string) {
  const codigo = normalizarCodigo(codigoBruto);
  if (!codigoValido(codigo)) return;
  const chave = `cavi-visita-${codigo}`;
  try {
    if (sessionStorage.getItem(chave)) return;
    sessionStorage.setItem(chave, "1");
  } catch {
    // Sem sessionStorage (aba anônima restrita): conta mesmo assim.
  }
  registrarVisita(codigo).catch(() => {});
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

/**
 * Na home: guarda o `?convite=` vindo do QR, tira o parâmetro do endereço e conta a visita (também
 * de quem volta outro dia pelo endereço comum, com o convite já lembrado no aparelho).
 */
export function LembrarConvite() {
  useEffect(() => {
    const url = new URL(location.href);
    const codigo = url.searchParams.get("convite");
    if (!codigo) {
      const lembrado = ler();
      if (lembrado) marcarVisita(lembrado);
      return;
    }
    guardarMeuConvite(codigo);
    marcarVisita(codigo);
    url.searchParams.delete("convite");
    history.replaceState(history.state, "", url.pathname + url.search + url.hash);
  }, []);
  return null;
}
