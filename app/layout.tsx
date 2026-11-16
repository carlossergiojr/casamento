import type { Metadata, Viewport } from "next";
import { Allura, Cormorant_Garamond, Karla, Pinyon_Script } from "next/font/google";
import { casamento } from "@/lib/conteudo";
import { ENVELOPE_LIGADO, scriptConviteAberto } from "@/lib/convite-aberto";
import { Movimento } from "@/components/movimento";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
});

// Letra cursiva do convite impresso: só nos títulos dos cartões "Programação" e "Traje" (specs/007).
const pinyon = Pinyon_Script({
  variable: "--font-pinyon",
  subsets: ["latin"],
  weight: "400",
});

// Caligrafia dos nomes da capa: traço fino, sem cara de negrito.
const allura = Allura({
  variable: "--font-allura",
  subsets: ["latin"],
  weight: "400",
});

const karla = Karla({
  variable: "--font-karla",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const titulo = `${casamento.casalCurto} · ${casamento.dataCurta}`;
const descricao = `Vamos nos casar! Sábado, 23 de janeiro de 2027, às ${casamento.hora}, no ${casamento.local.nome} — ${casamento.local.cidade}. ${casamento.hashtag}`;

// Prévia do link no WhatsApp e redes (specs/002 FR-002, FR-003). As imagens são geradas no build
// em app/marca/. Na Vercel, o endereço vem de VERCEL_PROJECT_PRODUCTION_URL (preenchido por ela).
const site = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(site),
  title: titulo,
  description: descricao,
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Victória & Carlos · #Cavi2027",
    url: "/",
    title: titulo,
    description: descricao,
    images: [{ url: "/marca/og.jpg", type: "image/jpeg", width: 1200, height: 630, alt: `Convite de casamento de ${casamento.casalCurto}` }],
  },
  twitter: { card: "summary_large_image", title: titulo, description: descricao, images: ["/marca/og.jpg"] },
  icons: {
    icon: { url: "/marca/icone.png", type: "image/png", sizes: "64x64" },
    apple: "/marca/icone-apple.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#faf7f1",
  // Deixa o env(safe-area-inset-bottom) valer no iPhone, para a gaveta "Como chegar".
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      data-scroll-behavior="smooth"
      // Envelope desligado: o convite já nasce "aberto" no HTML, sem script nenhum.
      data-convite={ENVELOPE_LIGADO ? undefined : "aberto"}
      className={`${cormorant.variable} ${karla.variable} ${pinyon.variable} ${allura.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        {ENVELOPE_LIGADO && <script dangerouslySetInnerHTML={{ __html: scriptConviteAberto }} />}
        <noscript>
          <style>
            {"[data-envelope]{display:none!important}[data-revelar]{opacity:1!important;transform:none!important;clip-path:none!important}"}
          </style>
        </noscript>
      </head>
      <body className="min-h-dvh">
        <Movimento>{children}</Movimento>
        <Toaster position="bottom-center" theme="light" />
      </body>
    </html>
  );
}
