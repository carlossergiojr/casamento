import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Fotos de exemplo enquanto as do casal não chegam (specs/001 FR-006).
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "fastly.picsum.photos" },
    ],
  },
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
