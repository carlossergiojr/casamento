"use client";

import { useSyncExternalStore } from "react";

/**
 * Dados da área dos noivos. Por enquanto ficam SÓ no navegador de quem usa (localStorage):
 * nada vai para o repositório nem para o site público. Para passar de um celular para o outro,
 * use "Salvar cópia" e "Carregar cópia". Quando o banco (Neon) entrar, este arquivo vira a ponte
 * para ele (PENDENCIAS.md, listas 2 e 4).
 */

export type Lado = "Victória" | "Carlos" | "Os dois";
export type Resposta = "pendente" | "vem" | "nao-vem";

export type Convidado = {
  id: string;
  titular: string;
  pessoas: string[]; // todas as pessoas do convite, titular incluído
  telefone: string;
  lado: Lado;
  resposta: Resposta;
  quantosVem: number; // quando resposta = "vem"
  obs: string;
};

export type Gasto = {
  id: string;
  item: string;
  fornecedor: string;
  previsto: number; // centavos
  pago: number; // centavos
  vencimento: string; // AAAA-MM-DD do próximo pagamento, ou ""
  obs: string;
  estimado?: boolean; // valor ainda é estimativa (sem contrato fechado)
};

export type Tarefa = {
  id: string;
  titulo: string;
  nota: string;
  fase: string; // ex.: "Dezembro · até o recesso"
  categoria: string; // ex.: "Convites"
  feita: boolean;
  urgente: boolean; // entra em "Para resolver agora" no resumo
};

export type Nota = { id: string; titulo: string; texto: string };

export type DadosNoivos = {
  versao: 1;
  convidados: Convidado[];
  gastos: Gasto[];
  tarefas: Tarefa[];
  notas: Nota[];
};

const CHAVE = "cavi2027:noivos";
const VAZIO: DadosNoivos = { versao: 1, convidados: [], gastos: [], tarefas: [], notas: [] };

let cache: DadosNoivos | null = null;
const ouvintes = new Set<() => void>();

function ler(): DadosNoivos {
  if (cache) return cache;
  try {
    const bruto = localStorage.getItem(CHAVE);
    cache = bruto ? validar(JSON.parse(bruto)) : VAZIO;
  } catch {
    cache = VAZIO;
  }
  return cache;
}

export function salvar(dados: DadosNoivos) {
  cache = dados;
  try {
    localStorage.setItem(CHAVE, JSON.stringify(dados));
  } catch {
    // Sem armazenamento (aba anônima): continua funcionando até fechar a página.
  }
  ouvintes.forEach((f) => f());
}

function assinar(f: () => void) {
  ouvintes.add(f);
  const outraAba = (e: StorageEvent) => {
    if (e.key === CHAVE) {
      cache = null;
      f();
    }
  };
  window.addEventListener("storage", outraAba);
  return () => {
    ouvintes.delete(f);
    window.removeEventListener("storage", outraAba);
  };
}

export function useDadosNoivos() {
  return useSyncExternalStore(assinar, ler, () => VAZIO);
}

/** Aceita um JSON de "Carregar cópia"; joga erro se não for um arquivo da área dos noivos. */
export function validar(x: unknown): DadosNoivos {
  const d = x as Partial<DadosNoivos> | null;
  if (!d || d.versao !== 1 || !Array.isArray(d.convidados) || !Array.isArray(d.gastos)) {
    throw new Error("Arquivo não é uma cópia da área dos noivos.");
  }
  // Cópias antigas não têm checklist nem notas.
  return {
    versao: 1,
    convidados: d.convidados,
    gastos: d.gastos,
    tarefas: Array.isArray(d.tarefas) ? d.tarefas : [],
    notas: Array.isArray(d.notas) ? d.notas : [],
  };
}

export const novoId = () => Math.random().toString(36).slice(2, 10);

/** "1.234,56" ou "1234" → centavos. Vazio ou inválido vira 0. */
export function lerReais(texto: string) {
  const limpo = texto.replace(/[^\d,.]/g, "").replace(/\./g, "").replace(",", ".");
  const n = Number(limpo);
  return Number.isFinite(n) ? Math.round(n * 100) : 0;
}

export const mostrarReais = (centavos: number) =>
  centavos ? (centavos / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "";

/** Link do WhatsApp a partir do telefone digitado do jeito que for; sem DDI, assume Brasil. */
export function linkWhatsApp(telefone: string) {
  let n = telefone.replace(/\D/g, "");
  if (n.length < 10) return null;
  if (n.length <= 11) n = `55${n}`;
  return `https://wa.me/${n}`;
}

/** Etapas do checklist, na ordem; tarefas com outra etapa aparecem depois destas. */
export const fasesPadrao = [
  "Agora · até 30 de novembro",
  "Dezembro · até o recesso",
  "Reta final · 5 a 16 de janeiro",
  "Semana do casamento · 17 a 22 de janeiro",
  "Dia 23 de janeiro",
  "Depois do casamento",
  "Já resolvido",
];

/** Itens que quase todo casamento tem, para começar o orçamento sem página em branco. */
export const gastosSugeridos = [
  "Espaço",
  "Buffet",
  "Bebidas",
  "Bolo e doces",
  "Decoração e flores",
  "Fotografia",
  "Filmagem",
  "DJ ou banda",
  "Cerimonialista",
  "Celebrante",
  "Vestido",
  "Traje do noivo",
  "Cabelo e maquiagem",
  "Alianças",
  "Convites",
  "Lembrancinhas",
  "Cartório",
  "Lua de mel",
];
