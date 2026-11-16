/**
 * Todo o conteúdo editável do site num lugar só (specs/001 "Conteúdo do site").
 * Fotos com picsum.photos são de exemplo — troque pelo caminho em /public quando chegarem.
 */

const foto = (semente: string, largura: number, altura: number) =>
  `https://picsum.photos/seed/cavi-${semente}/${largura}/${altura}`;

/** Caminho de arquivo de /public sob o basePath (GitHub Pages serve em /casamento). */
export const publico = (caminho: string) => `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${caminho}`;

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
  /** Foto real (recortada: sem parte do céu, para o casal ficar acima do cartão). */
  fotoCapa: publico("/fotos/capa.jpg"),
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

/**
 * Presentes "virtuais": o convidado escolhe o item e paga por Pix ou cartão; o valor cai para os
 * noivos, que compram o que quiserem. Mistura do que mais aparece nas listas (casa, cozinha,
 * eletros) com cotas de lua de mel e alguns divertidos, em faixas de R$ 90 a R$ 1.500 para caber
 * em todo bolso. Valores em centavos; ajuste à vontade. Ordem = ordem na página.
 */
export const presentes: Presente[] = [
  { id: "cafe-da-manha", nome: "Café da manhã na cama do primeiro dia de casados", valor: 12000 },
  { id: "air-fryer", nome: "Air fryer", valor: 45000 },
  { id: "jantar-lua-de-mel", nome: "Jantar romântico na lua de mel", valor: 35000 },
  { id: "jogo-de-cama", nome: "Jogo de cama casal", valor: 28000 },
  { id: "pizza-domingo", nome: "Pizza de domingo (porque ninguém vai querer cozinhar)", valor: 9000 },
  { id: "cafeteira", nome: "Cafeteira de cápsulas", valor: 50000 },
  { id: "passeio-de-barco", nome: "Passeio de barco na lua de mel", valor: 42000 },
  { id: "jogo-de-panelas", nome: "Jogo de panelas antiaderente", valor: 60000 },
  { id: "tacas", nome: "Jogo de taças para brindar", valor: 18000 },
  { id: "aparelho-de-jantar", nome: "Aparelho de jantar", valor: 40000 },
  { id: "jogo-de-toalhas", nome: "Jogo de toalhas de banho", valor: 20000 },
  { id: "batedeira", nome: "Batedeira", valor: 38000 },
  { id: "aspirador-robo", nome: "Aspirador robô (o melhor amigo do casal)", valor: 120000 },
  { id: "diaria-lua-de-mel", nome: "Uma diária de hotel na lua de mel", valor: 80000 },
  { id: "passagem-lua-de-mel", nome: "Ajuda nas passagens da lua de mel", valor: 150000 },
  { id: "vinho", nome: "Vinho para o primeiro aniversário de casados", valor: 15000 },
].map((p) => ({ ...p, presenteado: false, foto: foto(`presente-${p.id}`, 600, 600) }));

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

