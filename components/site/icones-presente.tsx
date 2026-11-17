import type { CategoriaPresente, Presente } from "@/lib/conteudo";

/**
 * Desenhos de traço fino dos presentes, no mesmo traço dos ícones da Programação (28×28, 1.3).
 * Entram no lugar da foto enquanto as fotos reais não chegam.
 */
const TRACOS = {
  panela: (
    <>
      <path d="M5 13h18v6.5a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4Z" />
      <path d="M2 14.5h3M23 14.5h3" />
      <path d="M5.5 11c2.5-2 14.5-2 17 0" />
      <path d="M14 7v2" />
    </>
  ),
  frigideira: (
    <>
      <circle cx="11" cy="15" r="7.5" />
      <circle cx="11" cy="15" r="4.5" />
      <path d="M18.2 12.6 26 8.5" />
    </>
  ),
  facas: (
    <>
      <path d="M6 13h16l-2 11H8Z" />
      <path d="M10 13V6M14 13V4.5M18 13V6.5" />
    </>
  ),
  pote: (
    <>
      <rect x="7" y="9.5" width="14" height="14.5" rx="2" />
      <path d="M6 5.5h16v4H6Z" />
      <path d="M10 15h8" />
    </>
  ),
  utensilios: (
    <>
      <path d="M9 4v13" />
      <rect x="6.5" y="17" width="5" height="7" rx="1.5" />
      <ellipse cx="19" cy="8" rx="2.6" ry="4" />
      <path d="M19 12v12" />
    </>
  ),
  tabua: (
    <>
      <rect x="3" y="9" width="17" height="12" rx="2" />
      <path d="M20 13.5h3.5a1.5 1.5 0 0 1 0 3H20" />
      <path d="M7 15h9" />
    </>
  ),
  assadeira: (
    <>
      <path d="M3 12h22" />
      <path d="M5 12l1.5 8h15L23 12" />
      <path d="M1.5 12H3M25 12h1.5" />
    </>
  ),
  forma: (
    <>
      <ellipse cx="14" cy="11" rx="9" ry="3.2" />
      <path d="M5 11v8c0 2 4 3.5 9 3.5s9-1.5 9-3.5v-8" />
    </>
  ),
  escorredor: (
    <>
      <path d="M4 21h20" />
      <path d="M5 21v-8M23 21v-8" />
      <path d="M9 21V11M13 21V10M17 21V11" />
    </>
  ),
  lixeira: (
    <>
      <path d="M7 9h14l-1.2 15H8.2Z" />
      <path d="M5.5 9h17" />
      <path d="M11 9V6.5h6V9" />
    </>
  ),
  pano: (
    <>
      <path d="M8 5h12v19H8Z" />
      <path d="M8 18.5h12M8 21h12" />
      <path d="M14 5V3" />
    </>
  ),
  prato: (
    <>
      <circle cx="14" cy="14" r="7.6" />
      <circle cx="14" cy="14" r="4.6" />
      <path d="M2.6 5v4.5a1.6 1.6 0 0 0 3.2 0V5M4.2 5v18" />
      <path d="M25.4 5c-1.3 1-1.8 3.3-1.8 6.2h1.8V23" />
    </>
  ),
  talheres: (
    <>
      <path d="M5 4v5a2 2 0 0 0 4 0V4M7 4v20" />
      <path d="M15.5 4c-1.4 1.2-1.8 4-1.8 7h1.8v13" />
      <ellipse cx="21.5" cy="8" rx="2.4" ry="4" />
      <path d="M21.5 12v12" />
    </>
  ),
  tacas: (
    <>
      <path d="M5 4h6l-.6 6.2a2.4 2.4 0 0 1-4.8 0Z" />
      <path d="M8 12.6V22M5.5 22h5" />
      <path d="M17 4h6l-.6 6.2a2.4 2.4 0 0 1-4.8 0Z" />
      <path d="M20 12.6V22M17.5 22h5" />
    </>
  ),
  flutes: (
    <>
      <path d="M7 3.5h4l-.5 9a1.5 1.5 0 0 1-3 0Z" />
      <path d="M9 14v8.5M6.5 22.5h5" />
      <path d="M17 3.5h4l-.5 9a1.5 1.5 0 0 1-3 0Z" />
      <path d="M19 14v8.5M16.5 22.5h5" />
    </>
  ),
  copos: (
    <>
      <path d="M4.5 7h8l-1 16h-6Z" />
      <path d="M15.5 10h8l-1 13h-6Z" />
    </>
  ),
  xicara: (
    <>
      <path d="M6 11h13v4a5 5 0 0 1-5 5h-3a5 5 0 0 1-5-5Z" />
      <path d="M19 12.5h1.4a2.5 2.5 0 0 1 0 5H19" />
      <path d="M3.5 23h19" />
      <path d="M10.5 4.5c-1 1.2 1 2.3 0 3.8M14.5 4.5c-1 1.2 1 2.3 0 3.8" />
    </>
  ),
  travessa: (
    <>
      <ellipse cx="14" cy="15" rx="11" ry="6" />
      <ellipse cx="14" cy="15" rx="7.5" ry="3.5" />
    </>
  ),
  americano: (
    <>
      <rect x="3" y="7" width="22" height="14" rx="1" />
      <circle cx="14" cy="14" r="4" />
    </>
  ),
  jarra: (
    <>
      <path d="M8 6h11v16a2 2 0 0 1-2 2h-7a2 2 0 0 1-2-2Z" />
      <path d="M19 9h2a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2" />
      <path d="M8 6 6 4.5" />
      <path d="M8 11h11" />
    </>
  ),
  airfryer: (
    <>
      <path d="M8 5h12a2.5 2.5 0 0 1 2.5 2.5V21a3 3 0 0 1-3 3h-11a3 3 0 0 1-3-3V7.5A2.5 2.5 0 0 1 8 5Z" />
      <rect x="9" y="13" width="10" height="7.5" rx="1.2" />
      <circle cx="14" cy="9.3" r="1.5" />
      <path d="M12.5 16.5h3" />
    </>
  ),
  cafeteira: (
    <>
      <rect x="6" y="3.5" width="16" height="21" rx="2" />
      <path d="M6 9h16" />
      <path d="M10.5 14h7v4a2 2 0 0 1-2 2h-3a2 2 0 0 1-2-2Z" />
    </>
  ),
  liquidificador: (
    <>
      <path d="M9 4h10l-1.6 12.5H10.6Z" />
      <path d="M8 16.5h12V24H8Z" />
      <circle cx="14" cy="20.3" r="1.3" />
      <path d="M19 7h2.5v6h-3" />
    </>
  ),
  batedeira: (
    <>
      <path d="M8 5h11a3 3 0 0 1 3 3v2H8Z" />
      <path d="M20 10v14M4.5 24h19" />
      <path d="M7 16h11v2a4 4 0 0 1-4 4h-3a4 4 0 0 1-4-4Z" />
      <path d="M12.5 10v6" />
    </>
  ),
  mixer: (
    <>
      <rect x="11" y="3.5" width="6" height="11" rx="2" />
      <path d="M12.5 14.5v6M15.5 14.5v6" />
      <path d="M10.5 20.5h7l-1 3h-5Z" />
    </>
  ),
  sanduicheira: (
    <>
      <path d="M4 13a10 5 0 0 1 20 0" />
      <path d="M4 13h20v4.5H4Z" />
      <path d="M24 15h2.5" />
      <path d="M6 17.5v2M22 17.5v2" />
    </>
  ),
  chaleira: (
    <>
      <path d="M8 10h12l1.5 13h-15Z" />
      <path d="M10 10c0-2.5 1.8-4 4-4s4 1.5 4 4" />
      <path d="M8.3 13 4.5 10.5" />
      <path d="M5.5 25h17" />
    </>
  ),
  torradeira: (
    <>
      <rect x="4" y="11" width="20" height="12" rx="3" />
      <path d="M9 11V6.5h4V11M15 11V6.5h4V11" />
      <path d="M24 15h1.5" />
    </>
  ),
  ferro: (
    <>
      <path d="M3 21h20.5c0-5.5-4-9.5-9.5-9.5H8.5" />
      <path d="M3 21c.5-4 2.5-7 5.5-9.5" />
      <path d="M10.5 11.5 12.5 7h8.5" />
      <path d="M6 24h17" />
    </>
  ),
  aspirador: (
    <>
      <path d="M19 3.5 13 20.5" />
      <path d="M7 20.5h10l1 3H6Z" />
      <circle cx="16.5" cy="10.5" r="2.5" />
    </>
  ),
  microondas: (
    <>
      <rect x="3" y="6.5" width="22" height="14.5" rx="1.5" />
      <rect x="6" y="9.5" width="12" height="8.5" rx=".8" />
      <path d="M21.5 10.5v.1M21.5 13.5v.1" />
      <path d="M6 21v2M22 21v2" />
    </>
  ),
  forno: (
    <>
      <rect x="3" y="5.5" width="22" height="16" rx="1.5" />
      <path d="M3 9.5h22" />
      <rect x="6" y="12" width="16" height="7" rx=".8" />
      <path d="M7 7.5h.1M10 7.5h.1M6 21.5v2M22 21.5v2" />
    </>
  ),
  purificador: (
    <>
      <rect x="8" y="3.5" width="12" height="21" rx="2" />
      <path d="M14 9c-2 2.5-3 4-3 5.5a3 3 0 0 0 6 0C17 13 16 11.5 14 9Z" />
    </>
  ),
  robo: (
    <>
      <circle cx="14" cy="15" r="9.5" />
      <circle cx="14" cy="15" r="3" />
      <path d="M8.5 9h11" />
    </>
  ),
  lavaloucas: (
    <>
      <rect x="5" y="3.5" width="18" height="21" rx="1.5" />
      <path d="M5 8.5h18" />
      <path d="M8 6h.1M11 6h.1" />
      <path d="M10 12.5h8" />
    </>
  ),
  tv: (
    <>
      <rect x="3" y="5" width="22" height="14" rx="1" />
      <path d="M10 23h8M14 19v4" />
    </>
  ),
  cama: (
    <>
      <path d="M3.5 22V8" />
      <path d="M3.5 18h21v4" />
      <path d="M24.5 18v-3.5a2.5 2.5 0 0 0-2.5-2.5H12v6" />
      <rect x="5.5" y="13" width="5" height="3" rx="1.5" />
    </>
  ),
  travesseiro: (
    <path d="M5 9c3-1.5 15-1.5 18 0 1 3 1 7 0 10-3 1.5-15 1.5-18 0-1-3-1-7 0-10Z" />
  ),
  toalhas: (
    <>
      <rect x="5" y="7" width="18" height="6" rx="1" />
      <rect x="5" y="13" width="18" height="6" rx="1" />
      <path d="M9 7v6M9 13v6M5 22h18" />
    </>
  ),
  roupao: (
    <>
      <path d="M10 4l4 5 4-5" />
      <path d="M10 4 5 8l2 4 2-1v13h10V11l2 1 2-4-5-4" />
      <path d="M9 16h10" />
    </>
  ),
  tapete: (
    <>
      <rect x="5" y="8" width="18" height="12" rx="1" />
      <path d="M5 11H2.5M5 14H2.5M5 17H2.5M23 11h2.5M23 14h2.5M23 17h2.5" />
      <rect x="9" y="11.5" width="10" height="5" />
    </>
  ),
  saboneteira: (
    <>
      <path d="M10 12h8v10a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2Z" />
      <path d="M13 12V8h2v4" />
      <path d="M15 8h3.5" />
    </>
  ),
  manta: (
    <>
      <rect x="5" y="7" width="18" height="12" rx="1" />
      <path d="M5 13h18" />
      <path d="M8 19v3M11 19v3M14 19v3M17 19v3M20 19v3" />
    </>
  ),
  almofada: (
    <path d="M6 7c3 1 13 1 16 0-1 4.5-1 9.5 0 14-3-1-13-1-16 0 1-4.5 1-9.5 0-14Z" />
  ),
  espelho: (
    <>
      <ellipse cx="14" cy="12" rx="6.5" ry="8.5" />
      <path d="M11 24h6M14 20.5V24" />
    </>
  ),
  luminaria: (
    <>
      <path d="M9 4h10l3 7.5H6Z" />
      <path d="M14 11.5V23" />
      <path d="M9.5 24h9" />
    </>
  ),
  cortina: (
    <>
      <path d="M3 5h22" />
      <path d="M5 5c0 6 1 12 4 18M23 5c0 6-1 12-4 18" />
      <path d="M9.5 5c0 6 .5 12 2 18M18.5 5c0 6-.5 12-2 18" />
    </>
  ),
  vaso: (
    <>
      <path d="M9 16h10l-1.5 8h-7Z" />
      <path d="M14 16V9" />
      <path d="M14 11c-3 0-5-2-5-5 3 0 5 2 5 5ZM14 9c0-3 2-5 5-5 0 3-2 5-5 5Z" />
    </>
  ),
  difusor: (
    <>
      <path d="M9 14h10v8a2 2 0 0 1-2 2h-6a2 2 0 0 1-2-2Z" />
      <path d="M12 14v-2h4v2" />
      <path d="M13 12 10 3M14 12V3M15 12l3-9" />
    </>
  ),
  porta: (
    <>
      <rect x="6" y="4" width="16" height="20" rx="1" />
      <rect x="9" y="7" width="10" height="12" />
      <path d="M9 19l3.5-4 2.5 3 1.5-1.5L19 19" />
    </>
  ),
  som: (
    <>
      <rect x="7" y="3.5" width="14" height="21" rx="2" />
      <circle cx="14" cy="16" r="4" />
      <circle cx="14" cy="8.5" r="1.5" />
    </>
  ),
  ferramentas: (
    <>
      <path d="M5 6.5h12v4.5H5Z" />
      <path d="M17 8h3c1.5 0 2.5 1 3 2.5" />
      <path d="M10 11v13" />
    </>
  ),
} satisfies Record<string, React.ReactNode>;

export type IconePresente = keyof typeof TRACOS;

/** Desenho de cada presente pelo id; o que não estiver aqui usa o desenho da categoria. */
const POR_ID: Record<string, IconePresente> = {
  "jogo-de-panelas": "panela",
  "panela-de-pressao": "panela",
  frigideiras: "frigideira",
  "jogo-de-facas": "facas",
  "potes-de-vidro": "pote",
  "utensilios-silicone": "utensilios",
  "tabua-de-corte": "tabua",
  assadeiras: "assadeira",
  "formas-de-bolo": "forma",
  escorredor: "escorredor",
  "lixeira-cozinha": "lixeira",
  "panos-de-prato": "pano",
  "aparelho-de-jantar": "prato",
  faqueiro: "talheres",
  "tacas-de-vinho": "tacas",
  "tacas-de-espumante": "flutes",
  copos: "copos",
  xicaras: "xicara",
  travessas: "travessa",
  "jogo-americano": "americano",
  "toalha-de-mesa": "americano",
  "tabua-de-frios": "tabua",
  jarra: "jarra",
  "air-fryer": "airfryer",
  cafeteira: "cafeteira",
  liquidificador: "liquidificador",
  batedeira: "batedeira",
  processador: "liquidificador",
  mixer: "mixer",
  sanduicheira: "sanduicheira",
  chaleira: "chaleira",
  torradeira: "torradeira",
  "panela-de-arroz": "panela",
  "ferro-de-passar": "ferro",
  "aspirador-vertical": "aspirador",
  "micro-ondas": "microondas",
  "forno-eletrico": "forno",
  purificador: "purificador",
  "aspirador-robo": "robo",
  "lava-loucas": "lavaloucas",
  "smart-tv": "tv",
  "jogo-de-cama-queen": "cama",
  "jogo-de-cama-percal": "cama",
  edredom: "cama",
  "cobre-leito": "cama",
  travesseiros: "travesseiro",
  "protetor-de-colchao": "cama",
  "toalhas-de-banho": "toalhas",
  roupoes: "roupao",
  "tapetes-banheiro": "tapete",
  "acessorios-banheiro": "saboneteira",
  "tapete-sala": "tapete",
  "manta-sofa": "manta",
  almofadas: "almofada",
  espelho: "espelho",
  luminaria: "luminaria",
  cortina: "cortina",
  vasos: "vaso",
  difusor: "difusor",
  "porta-retratos": "porta",
  "caixa-de-som": "som",
  "kit-ferramentas": "ferramentas",
};

const POR_CATEGORIA: Record<CategoriaPresente, IconePresente> = {
  Cozinha: "panela",
  "Mesa e bar": "tacas",
  Eletroportáteis: "liquidificador",
  Eletrodomésticos: "microondas",
  "Quarto e banho": "cama",
  Casa: "luminaria",
};

export function IconePresente({
  presente,
  className,
  traco = 1.3,
}: {
  presente: Pick<Presente, "id" | "categoria">;
  className?: string;
  traco?: number;
}) {
  const nome = POR_ID[presente.id] ?? POR_CATEGORIA[presente.categoria];
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 28 28"
      fill="none"
      stroke="currentColor"
      strokeWidth={traco}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {TRACOS[nome]}
    </svg>
  );
}
