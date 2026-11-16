import type { NextConfig } from "next";

/**
 * Publicado na Vercel, com servidor (RSVP, área dos noivos e banco). O endereço antigo
 * (carlossergiojr.github.io/casamento/, o dos QR Codes impressos) virou só redirecionamento:
 * ver `redirecionamento/` e specs/006.
 */
const nextConfig: NextConfig = {
  trailingSlash: true,
  images: { unoptimized: true },
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
