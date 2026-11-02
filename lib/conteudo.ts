/**
 * Todo o conteúdo editável do site num lugar só (specs/001 "Conteúdo do site").
 * Fotos com picsum.photos são de exemplo — troque pelo caminho em /public quando chegarem.
 */

const foto = (semente: string, largura: number, altura: number) =>
  `https://picsum.photos/seed/cavi-${semente}/${largura}/${altura}`;

/** Início da cerimônia, como aparece nos textos. Mude junto com `casamento.inicio`. */
const hora = "15h";

export const casamento = {
  /** Ordem dos nomes em todo o site: Victória primeiro. */
  primeiro: "Victória",
  segundo: "Carlos",
  casalCurto: "Victória & Carlos",
  monograma: { a: "V", b: "C" },
  /** 23/01/2027 (sábado) 15h, horário de Brasília. Mude junto com `hora`. */
  inicio: "2027-01-23T15:00:00-03:00",
  fim: "2027-01-24T02:00:00-03:00",
  dataCurta: "23.01.2027",
  dataCapa: "23 · 01 · 2027",
  hora,
  diaHora: `Sábado, às ${hora}`,
  dataPorExtenso: "23 de janeiro",
  hashtag: "#Cavi2027",
  prazoRsvp: "3 de janeiro de 2027",
  local: {
    nome: "Campestre",
    cidade: "Feira de Santana, BA",
    endereco: "R. Rubens Francisco Dias, 2101 — Papagaio",
    cidadeCep: "Feira de Santana / BA · CEP 44059-370",
    referencia: "Rua Zeus, entre os condomínios Aquarela Ville e Amarilis",
  },
  fotoCapa: foto("capa", 900, 1300),
};

export const enderecoCompleto = `${casamento.local.nome} — ${casamento.local.endereco}, ${casamento.local.cidadeCep}`;
const buscaMapa = encodeURIComponent(
  "R. Rubens Francisco Dias, 2101, Papagaio, Feira de Santana - BA, 44059-370",
);
export const mapaEmbed = `https://maps.google.com/maps?q=${buscaMapa}&z=15&output=embed`;
export const mapaRota = `https://www.google.com/maps/dir/?api=1&destination=${buscaMapa}`;

/** "Nossa história" em trechos; alinhamento alterna esquerda/direita. */
export const historia: { linhas: string[]; borboleta?: boolean }[] = [
  {
    linhas: [
      "A gente se encontrou cedo demais para entender o que era.",
      "Viramos amigos. Mas alguma coisa ficou.",
    ],
  },
  {
    linhas: [
      "Quatro anos depois, uma conversa recomeçou exatamente onde tinha parado.",
      "E dessa vez não deu para fingir que era só amizade.",
    ],
  },
  {
    linhas: ["Teve um filme. Teve um cinema. Teve uma noite que nunca mais terminou."],
    borboleta: true,
  },
  {
    linhas: [
      "Dez anos depois daquele primeiro *oi*, ele perguntou.",
      "Ela já sabia a resposta desde 2015.",
    ],
  },
];
export const historiaFecho = "Agora só falta você.";

export const galeria = {
  legenda: "[legenda curta]",
  fotos: Array.from({ length: 8 }, (_, i) => ({
    src: foto(`pre-${i + 1}`, 900, 1100),
    alt: `Foto ${i + 1} do pré-wedding (exemplo)`,
  })),
};

export const dressCode = {
  traje: "[Traje esperado]",
  texto: "[Texto curto explicando o traje — ainda a definir.]",
  cores: ["#636E84", "#9AA3B4", "#C9B8A0", "#E9EBEF"],
  evite: "[O que evitar — a definir]",
};

export type Presente = {
  id: string;
  nome: string;
  /** Centavos. */
  valor: number;
  foto: string;
  presenteado: boolean;
};

export const presentes: Presente[] = [
  { id: "jantar", nome: "Jantar romântico na lua de mel", valor: 35000, presenteado: false },
  { id: "jogo-de-cama", nome: "Jogo de cama", valor: 28000, presenteado: false },
  { id: "passeio", nome: "Passeio de barco", valor: 42000, presenteado: true },
  { id: "cafeteira", nome: "Cafeteira", valor: 39000, presenteado: false },
  { id: "tacas", nome: "Jogo de taças", valor: 18000, presenteado: false },
  { id: "vinho", nome: "Vinho para brindar", valor: 15000, presenteado: false },
].map((p) => ({ ...p, foto: foto(`presente-${p.id}`, 600, 600) }));

export const formatarValor = (centavos: number) =>
  (centavos / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export type Convite = { codigo: string; titular: string; pessoas: string[] };

/** Convites de exemplo — viram o banco na feature do RSVP. */
export const convitesExemplo: Convite[] = [
  { codigo: "CAVI01", titular: "Maria Souza", pessoas: ["Maria Souza", "João Souza"] },
  { codigo: "CAVI02", titular: "Maria Clara Alves", pessoas: ["Maria Clara Alves"] },
  {
    codigo: "CAVI03",
    titular: "Família Lima",
    pessoas: ["Ana Lima", "Pedro Lima", "Sofia Lima"],
  },
];

/** Caminho de arquivo de /public sob o basePath (GitHub Pages serve em /casamento). */
export const publico = (caminho: string) => `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${caminho}`;
