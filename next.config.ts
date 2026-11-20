import type { NextConfig } from "next";

/**
 * Publicado na Vercel, com servidor (RSVP, área dos noivos e banco). O endereço antigo
 * (carlossergiojr.github.io/casamento/, o dos QR Codes impressos) virou só redirecionamento:
 * ver `redirecionamento/` e specs/006.
 */
const nextConfig: NextConfig = {
  trailingSlash: true,
  images: { unoptimized: true },
  // Os QR impressos levam a "…/casamento/?id=CÓDIGO" (o GitHub Pages repassa a query): abre
  // direto a confirmação daquele convite.
  async redirects() {
    return [
      {
        source: "/",
        has: [{ type: "query", key: "id", value: "(?<id>[A-Za-z0-9-]{3,20})" }],
        destination: "/confirmar/:id/",
        permanent: false,
      },
    ];
  },
  // Avisa no build quando esta versão do Next tiver falha de segurança conhecida.
  experimental: { agentUpgrade: "security" },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
