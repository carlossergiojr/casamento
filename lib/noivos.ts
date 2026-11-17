/**
 * Tipos e utilidades da área dos noivos, usados no servidor e na tela. Os dados moram no banco
 * (specs/006); a leitura fica em `lib/noivos-servidor.ts` e a gravação em `app/noivos/acoes.ts`.
 */

export type Lado = "Victória" | "Carlos" | "Os dois";
export type Resposta = "pendente" | "vem" | "nao-vem";

export type Pessoa = { id: string; nome: string; resposta: Resposta };

export type Convidado = {
  id: string;
  codigo: string; // o do QR; vazio num convite novo = o servidor gera
  titular: string;
  pessoas: Pessoa[];
  telefone: string;
  lado: Lado;
  obs: string;
  restricao: string; // informada no RSVP
  respondidoEm: string | null; // ISO
};

export type Gasto = {
  id: string;
  item: string;
  fornecedor: string;
  previsto: number; // centavos
  pago: number; // centavos
  vencimento: string; // AAAA-MM-DD do próximo pagamento, ou ""
  obs: string;
  estimado: boolean; // valor ainda é estimativa (sem contrato fechado)
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

/** Presente pago no Mercado Pago (specs/008). Só leitura: quem grava é o webhook. */
export type Recebido = {
  id: string;
  presente: string; // nome do item (ou "Cota lua de mel")
  nome: string;
  recado: string;
  valor: number; // centavos
  pagoEm: string; // ISO
};

export type DadosNoivos = {
  convidados: Convidado[];
  gastos: Gasto[];
  tarefas: Tarefa[];
  notas: Nota[];
};

/** Resultado das ações dos noivos. "sessao" = precisa da senha de novo. */
export type Resultado<T = undefined> = { ok: true; valor?: T } | { ok: false; erro: string };

/** Onde ficavam os dados antes do banco (só no aparelho). */
export const CHAVE_ANTIGA = "cavi2027:noivos";

export const novoId = () => crypto.randomUUID();

/** Situação do convite inteiro, a partir das respostas por pessoa. */
export function estadoConvite(c: Convidado): Resposta {
  if (c.pessoas.some((p) => p.resposta === "vem")) return "vem";
  if (c.pessoas.length > 0 && c.pessoas.every((p) => p.resposta === "nao-vem")) return "nao-vem";
  return "pendente";
}

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
