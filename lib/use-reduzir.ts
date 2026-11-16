"use client";

import { useSyncExternalStore } from "react";

const CONSULTA = "(prefers-reduced-motion: reduce)";

function assinar(avisar: () => void) {
  const mq = window.matchMedia(CONSULTA);
  mq.addEventListener("change", avisar);
  return () => mq.removeEventListener("change", avisar);
}

/**
 * `true` quando o aparelho pede "Reduzir movimento". No lugar do `useReducedMotion()` do Motion:
 * aquele já responde `true` na hidratação, o HTML do servidor deixa de bater com o do navegador e o
 * React refaz a capa do zero, invisível (specs/007 FR-001). Aqui o primeiro render é sempre igual ao
 * do servidor (`false`) e o valor real chega logo depois.
 */
export function useReduzir() {
  return useSyncExternalStore(
    assinar,
    () => window.matchMedia(CONSULTA).matches,
    () => false,
  );
}
