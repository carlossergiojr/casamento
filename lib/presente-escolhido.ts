/**
 * Nome e recadinho do convidado passam do detalhe ao "Obrigado" só no navegador (sessionStorage),
 * sem ir para a URL. Nesta etapa nada é enviado (specs/001 FR-009).
 */
export type DadosPresente = { nome: string; recado: string };

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
