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

export const metadata: Metadata = {
  title: "Victória & Carlos Sergio · 23.01.2027",
  description:
    "Vamos nos casar! Sábado, 23 de janeiro de 2027, às 16h, no Campestre — Feira de Santana, BA. #Cavi2027",
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
          <style>{"[data-envelope]{display:none!important}"}</style>
        </noscript>
      </head>
      <body className="min-h-dvh">
        {children}
        <Toaster position="bottom-center" theme="light" />
      </body>
    </html>
  );
}
