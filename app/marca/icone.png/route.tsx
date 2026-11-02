import { ImageResponse } from "next/og";
import { casamento } from "@/lib/conteudo";
import { coresMarca as c, fontesMarca } from "@/lib/imagem-marca";

/** Ícone da aba com o monograma (specs/002 FR-003). */
const size = { width: 64, height: 64 };

export const dynamic = "force-static";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: c.primaria,
          borderRadius: 8,
          fontFamily: "Cormorant",
          fontStyle: "italic",
          fontSize: 27,
          letterSpacing: 1,
          color: c.fundo,
        }}
      >
        {casamento.monograma.a}
        <span style={{ margin: "0 1px", color: c.fioOuro }}>&amp;</span>
        {casamento.monograma.b}
      </div>
    ),
    { ...size, fonts: await fontesMarca() },
  );
}
