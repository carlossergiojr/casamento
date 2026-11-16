/**
 * Nome e recadinho do convidado passam do detalhe ao "Obrigado" só no navegador (sessionStorage),
 * sem ir para a URL. Nesta etapa nada é enviado (specs/001 FR-009).
 */
import { useSyncExternalStore } from "react";
import { formatarValor } from "./conteudo";

/** `valor` (centavos) só existe na cota livre, em que o convidado escolhe quanto manda. */
export type DadosPresente = { nome: string; recado: string; valor?: number };

const chave = (id: string) => `cavi-presente-${id}`;

export function guardarPresente(id: string, dados: DadosPresente) {
  try {
    sessionStorage.setItem(chave(id), JSON.stringify(dados));
  } catch {
    // Sem storage: o "Obrigado" só não mostra o recadinho.
  }
}

export function lerPresente(id: string): DadosPresente | null {
  try {
    const bruto = sessionStorage.getItem(chave(id));
    return bruto ? (JSON.parse(bruto) as DadosPresente) : null;
  } catch {
    return null;
  }
}

const nada = () => () => {};

/**
 * Valor já formatado: o fixo do presente ou, na cota livre (`fixo` null), o que o convidado
 * escolheu no passo anterior. No servidor (e sem storage) mostra "—".
 */
export function useValorEscolhido(id: string, fixo: number | null) {
  return useSyncExternalStore(
    nada,
    () => {
      const v = fixo ?? lerPresente(id)?.valor;
      return v ? formatarValor(v) : "—";
    },
    () => (fixo ? formatarValor(fixo) : "—"),
  );
}
