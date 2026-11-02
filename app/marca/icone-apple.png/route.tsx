import { ImageResponse } from "next/og";
import { casamento } from "@/lib/conteudo";
import { coresMarca as c, fontesMarca } from "@/lib/imagem-marca";

/** Ícone da tela inicial do iPhone (specs/002 FR-003). O iOS arredonda os cantos sozinho. */
const size = { width: 180, height: 180 };

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
          backgroundColor: c.fundo,
          fontFamily: "Cormorant",
          fontWeight: 300,
          fontSize: 80,
          color: c.primaria,
        }}
      >
        {casamento.monograma.a}
        <span style={{ margin: "0 6px", fontStyle: "italic", fontWeight: 400, fontSize: 62, color: c.ouro }}>
          &amp;
        </span>
        {casamento.monograma.b}
      </div>
    ),
    { ...size, fonts: await fontesMarca() },
  );
}
