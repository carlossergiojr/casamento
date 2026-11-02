"use client";

import { useSyncExternalStore } from "react";
import { EVENTO_CONVITE_ABERTO } from "./convite-aberto";

function assinar(avisar: () => void) {
  window.addEventListener(EVENTO_CONVITE_ABERTO, avisar);
  return () => window.removeEventListener(EVENTO_CONVITE_ABERTO, avisar);
}

/**
 * `true` quando o envelope já saiu da frente do site (ou nem apareceu nesta sessão), para a
 * capa só animar quando estiver à vista (specs/002 FR-004).
 */
export function useConviteAberto() {
  return useSyncExternalStore(
    assinar,
    () => document.documentElement.dataset.convite === "aberto",
    () => false,
  );
}
