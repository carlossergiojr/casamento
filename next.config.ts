import type { NextConfig } from "next";

/**
 * Publicado no GitHub Pages em carlossergiojr.github.io/casamento/ — o mesmo endereço dos
 * QR Codes. Por isso: exportação estática, tudo sob /casamento e imagens sem o otimizador
 * (que precisa de servidor). Quando RSVP/pagamento precisarem de servidor, isto muda.
 */
const basePath = "/casamento";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
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
