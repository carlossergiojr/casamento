/**
 * Todo o conteúdo editável do site num lugar só (specs/001 "Conteúdo do site").
 * Fotos ficam em /public (caminho por `publico`).
 */

/** Caminho de arquivo de /public. Era onde entrava o prefixo /casamento do GitHub Pages; na Vercel não há prefixo. */
export const publico = (caminho: string) => caminho;

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
  dataPorExtenso: "23 de janeiro",
  hashtag: "#Cavi2027",
  prazoRsvp: "3 de janeiro de 2027",
  /** Último instante em que o convidado ainda pode responder (o servidor recusa depois). */
  fimRsvp: "2027-01-03T23:59:59-03:00",
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

/** Música que começa ao abrir a cortina (components/cortina.tsx); toca em loop. */
export const musica = publico("/musica/iris.mp3");

export const enderecoCompleto = `${casamento.local.nome} — ${casamento.local.endereco}, ${casamento.local.cidadeCep}`;
const buscaMapa = encodeURIComponent(
  "R. Rubens Francisco Dias, 2101, Papagaio, Feira de Santana - BA, 44059-370",
);
export const mapaRota = `https://www.google.com/maps/dir/?api=1&destination=${buscaMapa}`;
export const mapaWaze = `https://waze.com/ul?q=${buscaMapa}&navigate=yes`;
export const mapaUber = `https://m.uber.com/ul/?action=setPickup&pickup=my_location&dropoff[formatted_address]=${buscaMapa}`;

/** Programação do dia, igual ao cartão "Programação" impresso (bloco "O dia", após a capa). */
export type IconePrograma = "tacas" | "aliancas" | "cloche" | "talheres" | "bolo";
export const programa: { hora: string; titulo: string; detalhe: string; icone: IconePrograma }[] = [
  { hora, titulo: "Boas-vindas", detalhe: "Chegue com calma e aproveite um drink fresquinho", icone: "tacas" },
  { hora: cerimonia, titulo: "Cerimônia", detalhe: "O momento do sim", icone: "aliancas" },
  { hora: "Em seguida", titulo: "Serviço volante", detalhe: "Petiscos e banda ao vivo, entre brindes e abraços", icone: "cloche" },
  { hora: "Depois", titulo: "Jantar", detalhe: "Um buffet para saborearmos juntos", icone: "talheres" },
  { hora: "Para fechar", titulo: "Sobremesas", detalhe: "Uma mesa doce para adoçar a noite", icone: "bolo" },
];

/**
 * "Guia do convidado", igual ao cartão impresso. `icone` é o nome do ícone em
 * components/site/guia.tsx.
 */
export const guiaConvidado: { icone: string; texto: string }[] = [
  { icone: "envelope", texto: "O convite é pessoal: valem os nomes do envelope" },
  { icone: "relogio", texto: "Chegue no horário, queremos você no sim" },
  { icone: "igreja", texto: "Participe também da cerimônia" },
  { icone: "camera", texto: "Deixe o caminho livre para os fotógrafos" },
  { icone: "coracao", texto: "Gentileza com todos, sempre" },
  { icone: "sol", texto: "Só boas palavras e boas energias" },
  { icone: "flor", texto: "A decoração fica para o fim da festa" },
  { icone: "pessoas", texto: "Não vá embora sem se despedir de nós" },
];
export const guiaFecho = "E, acima de tudo, divirta-se muito!";

/**
 * Contato dos noivos para dúvidas (WhatsApp). Número só com DDI+DDD+número, sem espaço:
 * ex. "5575999999999". Vazio = o site mostra "[WhatsApp a definir]" no lugar do botão.
 */
export const contato = {
  nome: "Victória e Carlos",
  whatsapp: "5575999414200",
};
export const linkWhatsapp = (texto = "Oi! Tenho uma dúvida sobre o casamento.") =>
  contato.whatsapp ? `https://wa.me/${contato.whatsapp}?text=${encodeURIComponent(texto)}` : null;

/** Perguntas frequentes (o que já foi decidido: lista fechada, prazo do RSVP, ao ar livre). */
export const duvidas: { pergunta: string; resposta: string }[] = [
  {
    pergunta: "Posso levar acompanhante?",
    resposta:
      "O convite é pessoal: valem os nomes do envelope. Se alguém da sua casa não aparece na confirmação, fale com a gente antes de levar.",
  },
  {
    pergunta: "Até quando confirmo presença?",
    resposta: "Até 3 de janeiro de 2027, aqui mesmo no site, com o seu nome ou o código do convite. Dá para mudar a resposta até esse dia.",
  },
  {
    pergunta: "A cerimônia é ao ar livre?",
    resposta:
      "Sim! Janeiro é verão: tecidos leves e saltos grossos ou tipo bloco deixam o dia mais confortável.",
  },
  { pergunta: "Tem estacionamento?", resposta: "Sim, o Campestre tem estacionamento." },
];

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
  /**
   * Na tela, três polaroids revezam as fotos (a 1ª, 4ª, 7ª… na grande; as outras nas pequenas);
   * todas aparecem em "Ver todas as fotos".
   */
  fotos: [
    "Victória e Carlos abraçados na sala, olhando um para o outro",
    "Em preto e branco, os dois passando pela mesa redonda da sala",
    "De mãos dadas na porta da casa, entre dois vasos de cróton",
    "Caminhando de mãos dadas diante da casa, o vestido e o cabelo ao vento",
    "Em preto e branco, sentados na mureta da varanda, rindo",
    "No deck entre as folhas, Carlos beija a testa de Victória",
    "Abraçados no deck, contra o sol do fim de tarde e o lago ao fundo",
    "Caminhando na grama com a luz dourada, a palmeira e a casa atrás",
    "Sentados no píer com o cachorro, sorrindo",
    "No barco, Victória rindo com o dedo no queixo de Carlos",
    "Em preto e branco, abraçados de pé no barco sobre o lago",
    "Beijo no píer ao anoitecer, ao lado do poste aceso",
  ].map((alt, i) => ({ src: publico(`/fotos/pre-${String(i + 1).padStart(2, "0")}.jpg`), alt })),
};

/** Igual ao cartão "Traje" impresso. */
export type DesenhoTraje = "vestido" | "terno";
export type IconeDica = "tecido" | "salto" | "sol";

/**
 * Cartão "Traje" (caderno da costureira, specs/007): roupas no cabide com recadinhos à mão,
 * cores a evitar como retalhos presos com alfinete, e as dicas de verão em ícones.
 */
export const dressCode = {
  traje: "Social",
  /** Legenda de cada desenho (roupa no cabide, sem pessoas) e os dois recadinhos com setinha:
   *  o de cima e o de baixo, cada um em duas linhas curtas (o desenho não quebra linha sozinho). */
  trajes: [
    {
      desenho: "vestido" as DesenhoTraje,
      legenda: "vestido",
      detalhe: "",
      notas: [
        ["fluido,", "que balança"],
        ["qualquer", "comprimento"],
      ],
    },
    {
      desenho: "terno" as DesenhoTraje,
      legenda: "terno",
      detalhe: "(opcional)",
      notas: [
        ["gravata?", "não precisa"],
        ["camisa clara", "já resolve"],
      ],
    },
  ],
  pedido: "Com carinho, pedimos que evitem:",
  /** Cores a EVITAR, agrupadas pelo motivo, com o nome embaixo de cada bolinha (no celular não
   *  tem "passar o mouse"). */
  evitar: [
    {
      grupo: "Da noiva",
      cores: [
        { nome: "branco", cor: "#FFFFFF" },
        { nome: "off-white", cor: "#F6F2E9" },
        { nome: "creme", cor: "#EFE4C8" },
        { nome: "nude", cor: "#E3C8B3" },
      ],
    },
    {
      grupo: "Das madrinhas",
      cores: [
        { nome: "azul", cor: "#2E6A9E" },
        { nome: "azul claro", cor: "#A8C1D7" },
      ],
    },
  ],
  dicasTitulo: "Para o calor de janeiro",
  dicas: [
    { icone: "tecido" as IconeDica, texto: "Tecido leve" },
    { icone: "salto" as IconeDica, texto: "Salto grosso ou bloco" },
    { icone: "sol" as IconeDica, texto: "Fim de tarde de verão" },
  ],
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

/**
 * Presentes em destaque na página inicial (ids da lista acima, nesta ordem; o ideal são 4 ou 6).
 * A lista completa fica em /presentes.
 */
export const destaquesPresente = [
  "air-fryer",
  "jogo-de-cama-queen",
  "aparelho-de-jantar",
  "cafeteira",
  "tacas-de-vinho",
  "jogo-de-panelas",
];

/** "R$ 450" quando é valor redondo, "R$ 49,90" quando tem centavos. */
export const formatarValor = (centavos: number) =>
  (centavos / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: centavos % 100 ? 2 : 0,
    maximumFractionDigits: 2,
  });

/**
 * Presente de valor livre: o convidado escolhe quanto manda (para a lua de mel). Tem página
 * própria em /presentes/livre/, fora da lista de objetos.
 */
export const presenteLivre = {
  id: "livre",
  nome: "Cota lua de mel",
  texto: "Prefere não escolher um objeto? Mande o valor que quiser para a nossa lua de mel.",
  /** Em reais: os botões de valor rápido. */
  sugestoes: [100, 200, 300, 500],
  /** Em reais. */
  minimo: 20,
  /** Em reais: acima disso, só falando com os noivos. */
  maximo: 20000,
};

/** Presente pelo id da URL: um da lista ou a cota livre (valor `null`: o convidado escolhe). */
export function acharPresente(id: string): { id: string; nome: string; valor: number | null; presenteado: boolean } | undefined {
  if (id === presenteLivre.id) return { id, nome: presenteLivre.nome, valor: null, presenteado: false };
  return presentes.find((p) => p.id === id);
}
/** Todos os ids com página (lista + cota livre), para o generateStaticParams. */
export const idsPresentes = () => [...presentes.map((p) => ({ id: p.id })), { id: presenteLivre.id }];

/** Depois disso o convidado não muda mais a resposta (specs/006 FR-009); os noivos podem. */
export const prazoEncerrado = (agora = Date.now()) => agora > new Date(casamento.fimRsvp).getTime();

