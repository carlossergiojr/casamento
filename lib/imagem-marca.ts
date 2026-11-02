import { readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * Fontes e estampa para as imagens geradas no build (prévia de compartilhamento e ícones).
 * O ImageResponse não usa o next/font, então as TTFs ficam em `assets/fonts/`.
 */
const ler = (...caminho: string[]) => readFile(join(process.cwd(), ...caminho));

export async function fontesMarca() {
  const [leve, italico, karla] = await Promise.all([
    ler("assets/fonts/CormorantGaramond-Light.ttf"),
    ler("assets/fonts/CormorantGaramond-Italic.ttf"),
    ler("assets/fonts/Karla-SemiBold.ttf"),
  ]);
  return [
    { name: "Cormorant", data: leve, weight: 300 as const, style: "normal" as const },
    { name: "Cormorant", data: italico, weight: 400 as const, style: "italic" as const },
    { name: "Karla", data: karla, weight: 600 as const, style: "normal" as const },
  ];
}

export async function toileDataUrl() {
  const jpg = await ler("public/estampa/toile.jpg");
  return `data:image/jpeg;base64,${jpg.toString("base64")}`;
}

/** Mesmos valores de app/globals.css (o ImageResponse não lê variáveis CSS). */
export const coresMarca = {
  fundo: "#faf7f1",
  primaria: "#636e84",
  primariaFunda: "#4e5769",
  ouro: "#9c7a45",
  fioOuro: "#c2a170",
};
