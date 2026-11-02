import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Karla } from "next/font/google";
import { scriptConviteAberto } from "@/lib/convite-aberto";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
});

const karla = Karla({
  variable: "--font-karla",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const titulo = "Victória & Carlos Sergio · 23.01.2027";
const descricao =
  "Vamos nos casar! Sábado, 23 de janeiro de 2027, às 16h, no Campestre — Feira de Santana, BA. #Cavi2027";

// Prévia do link no WhatsApp e redes (specs/002 FR-002, FR-003). As imagens são geradas no build
// em app/marca/ (rotas .png, com o basePath escrito à mão: os arquivos de metadata do Next o perdem).
export const metadata: Metadata = {
  metadataBase: new URL("https://carlossergiojr.github.io"),
  title: titulo,
  description: descricao,
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Victória & Carlos · #Cavi2027",
    url: "/casamento/",
    title: titulo,
    description: descricao,
    images: [{ url: "/casamento/marca/og.jpg", type: "image/jpeg", width: 1200, height: 630, alt: "Convite de casamento de Victória & Carlos Sergio" }],
  },
  twitter: { card: "summary_large_image", title: titulo, description: descricao, images: ["/casamento/marca/og.jpg"] },
  icons: {
    icon: { url: "/casamento/marca/icone.png", type: "image/png", sizes: "64x64" },
    apple: "/casamento/marca/icone-apple.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#faf7f1",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${cormorant.variable} ${karla.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: scriptConviteAberto }} />
        <noscript>
          <style>
            {"[data-envelope]{display:none!important}[data-revelar]{opacity:1!important;transform:none!important;clip-path:none!important}"}
          </style>
        </noscript>
      </head>
      <body className="min-h-dvh">
        {children}
        <Toaster position="bottom-center" theme="light" />
      </body>
    </html>
  );
}
