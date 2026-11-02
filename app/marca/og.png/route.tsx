import { ImageResponse } from "next/og";
import { casamento } from "@/lib/conteudo";
import { coresMarca as c, fontesMarca, toileDataUrl } from "@/lib/imagem-marca";

/** Prévia do link no WhatsApp e redes (specs/002 FR-002): estampa + cartão do convite. */
const size = { width: 1200, height: 630 };

export const dynamic = "force-static";

export async function GET() {
  const [fontes, toile] = await Promise.all([fontesMarca(), toileDataUrl()]);
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
          backgroundImage: `url(${toile})`,
          backgroundSize: "410px 410px",
        }}
      >
        <div
          style={{
            width: 900,
            height: 470,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: c.fundo,
            borderTop: `3px solid ${c.fioOuro}`,
            boxShadow: "0 2px 6px rgba(43,49,64,0.18)",
          }}
        >
          <div style={{ fontFamily: "Karla", fontSize: 20, letterSpacing: 6, color: c.primariaFunda }}>
            VAMOS NOS CASAR
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              marginTop: 22,
              fontFamily: "Cormorant",
              fontWeight: 300,
              fontSize: 76,
              color: c.primaria,
            }}
          >
            {casamento.primeiro}
            <span style={{ margin: "0 22px", fontStyle: "italic", fontWeight: 400, fontSize: 64, color: c.ouro }}>
              &amp;
            </span>
            {casamento.segundo}
          </div>
          <div style={{ marginTop: 18, fontFamily: "Cormorant", fontWeight: 300, fontSize: 40, letterSpacing: 4, color: "#2b3140" }}>
            {casamento.dataCapa}
          </div>
          <div style={{ marginTop: 22, fontFamily: "Karla", fontSize: 22, letterSpacing: 2, color: c.primariaFunda }}>
            {`${casamento.local.nome} · ${casamento.local.cidade}`}
          </div>
        </div>
      </div>
    ),
    { ...size, fonts: fontes },
  );
}
