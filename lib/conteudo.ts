/**
 * Todo o conteúdo editável do site num lugar só (specs/001 "Conteúdo do site").
 * Fotos com picsum.photos são de exemplo — troque pelo caminho em /public quando chegarem.
 */

const foto = (semente: string, largura: number, altura: number) =>
  `https://picsum.photos/seed/cavi-${semente}/${largura}/${altura}`;

/** Caminho de arquivo de /public sob o basePath (GitHub Pages serve em /casamento). */
export const publico = (caminho: string) => `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${caminho}`;

/** Chegada (boas-vindas), como aparece nos textos. Mude junto com `casamento.inicio`. */
const hora = "15h30";
/** Início da cerimônia na ilha, igual ao convite impresso. */
const cerimonia = "16h20";

export const casamento = {
  /** Ordem dos nomes em todo o site: Victória primeiro. */
  primeiro: "Victória",
  segundo: "Carlos",
  casalCurto: "Victória & Carlos",
  monograma: { a: "V", b: "C" },
  /** 23/01/2027 (sábado) 15h30, boas-vindas, horário de Brasília. Mude junto com `hora`. */
  inicio: "2027-01-23T15:30:00-03:00",
  fim: "2027-01-24T02:00:00-03:00",
  dataCurta: "23.01.2027",
  dataCapa: "23 · 01 · 2027",
  hora,
  cerimonia,
  diaHora: `Sábado · boas-vindas às ${hora}`,
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

/** Ordem das categorias = ordem dos filtros na lista de presentes. */
export const categoriasPresente = [
  "Cozinha",
  "Mesa e bar",
  "Eletroportáteis",
  "Eletrodomésticos",
  "Quarto e banho",
  "Casa",
] as const;
export type CategoriaPresente = (typeof categoriasPresente)[number];

export type Presente = {
  id: string;
  nome: string;
  categoria: CategoriaPresente;
  /** Centavos. */
  valor: number;
  /** Foto real do item (ex.: publico("/presentes/air-fryer.jpg")). Sem foto, entra a estampa. */
  foto?: string;
  presenteado: boolean;
};

/** [id, nome, valor em reais, foto opcional] */
type Item = [string, string, number, string?];
const categoria = (nome: CategoriaPresente, itens: Item[]): Presente[] =>
  itens.map(([id, nomeItem, reais, arquivo]) => ({
    id,
    nome: nomeItem,
    categoria: nome,
    valor: reais * 100,
    foto: arquivo ? publico(`/presentes/${arquivo}`) : undefined,
    presenteado: false,
  }));

/**
 * Presentes "virtuais": o convidado escolhe o objeto e paga por Pix ou cartão; o valor vai para
 * os noivos, que compram o item. ~60 objetos para ~150 convidados (um por família/casal, com
 * folga), de R$ 100 a R$ 2.800. Valores aproximados de loja em 2026; ajuste à vontade.
 * Foto: salve em public/presentes/ e ponha o nome do arquivo como 4º valor do item.
 */
export const presentes: Presente[] = [
  ...categoria("Cozinha", [
    ["jogo-de-panelas", "Jogo de panelas antiaderente", 600],
    ["panela-de-pressao", "Panela de pressão", 250],
    ["frigideiras", "Jogo de frigideiras", 280],
    ["jogo-de-facas", "Jogo de facas com cepo", 350],
    ["potes-de-vidro", "Kit de potes herméticos de vidro", 180],
    ["utensilios-silicone", "Kit de utensílios de silicone", 150],
    ["tabua-de-corte", "Tábua de corte de madeira", 120],
    ["assadeiras", "Jogo de assadeiras de vidro", 160],
    ["formas-de-bolo", "Jogo de formas de bolo", 130],
    ["escorredor", "Escorredor de louça inox", 170],
    ["lixeira-cozinha", "Lixeira inox com pedal", 200],
    ["panos-de-prato", "Kit de panos de prato", 100],
  ]),
  ...categoria("Mesa e bar", [
    ["aparelho-de-jantar", "Aparelho de jantar (30 peças)", 400],
    ["faqueiro", "Faqueiro inox (42 peças)", 350],
    ["tacas-de-vinho", "Jogo de taças de vinho", 180],
    ["tacas-de-espumante", "Jogo de taças de espumante", 180],
    ["copos", "Jogo de copos de vidro", 120],
    ["xicaras", "Jogo de xícaras de café", 150],
    ["travessas", "Jogo de travessas de porcelana", 250],
    ["jogo-americano", "Jogo americano (6 lugares)", 140],
    ["toalha-de-mesa", "Toalha de mesa de linho", 220],
    ["tabua-de-frios", "Tábua de frios com acessórios", 190],
    ["jarra", "Jarra de vidro com copos", 110],
  ]),
  ...categoria("Eletroportáteis", [
    ["air-fryer", "Air fryer", 450],
    ["cafeteira", "Cafeteira de cápsulas", 500],
    ["liquidificador", "Liquidificador", 300],
    ["batedeira", "Batedeira planetária", 600],
    ["processador", "Processador de alimentos", 400],
    ["mixer", "Mixer de mão", 250],
    ["sanduicheira", "Sanduicheira e grill", 200],
    ["chaleira", "Chaleira elétrica", 180],
    ["torradeira", "Torradeira", 200],
    ["panela-de-arroz", "Panela elétrica de arroz", 250],
    ["ferro-de-passar", "Ferro de passar a vapor", 220],
    ["aspirador-vertical", "Aspirador de pó vertical", 500],
  ]),
  ...categoria("Eletrodomésticos", [
    ["micro-ondas", "Micro-ondas", 750],
    ["forno-eletrico", "Forno elétrico de bancada", 700],
    ["purificador", "Purificador de água", 900],
    ["aspirador-robo", "Aspirador robô", 1200],
    ["lava-loucas", "Lava-louças", 2500],
    ["smart-tv", "Smart TV 50\"", 2800],
  ]),
  ...categoria("Quarto e banho", [
    ["jogo-de-cama-queen", "Jogo de cama queen 400 fios", 350],
    ["jogo-de-cama-percal", "Jogo de cama casal percal", 250],
    ["edredom", "Edredom queen", 380],
    ["cobre-leito", "Cobre-leito queen", 320],
    ["travesseiros", "Par de travesseiros", 250],
    ["protetor-de-colchao", "Protetor de colchão impermeável", 150],
    ["toalhas-de-banho", "Jogo de toalhas de banho (4 peças)", 200],
    ["roupoes", "Par de roupões", 300],
    ["tapetes-banheiro", "Kit de tapetes de banheiro", 120],
    ["acessorios-banheiro", "Kit de acessórios para banheiro", 150],
  ]),
  ...categoria("Casa", [
    ["tapete-sala", "Tapete para sala", 600],
    ["manta-sofa", "Manta para sofá", 180],
    ["almofadas", "Kit de almofadas", 200],
    ["espelho", "Espelho decorativo", 400],
    ["luminaria", "Luminária de chão", 450],
    ["cortina", "Cortina de linho", 300],
    ["vasos", "Kit de vasos com plantas", 200],
    ["difusor", "Difusor de aromas", 130],
    ["porta-retratos", "Kit de porta-retratos", 100],
    ["caixa-de-som", "Caixa de som bluetooth", 400],
    ["kit-ferramentas", "Kit de ferramentas", 250],
  ]),
];

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

