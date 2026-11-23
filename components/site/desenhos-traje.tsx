"use client";

import { motion, type Transition } from "motion/react";
import { balanco, ventoTransicao } from "@/lib/vento";
import type { DesenhoTraje, IconeDica } from "@/lib/conteudo";

const PARADO: Transition = { duration: 0.8, ease: "easeOut" };

/** Cabide comum aos dois desenhos (viewBox 0 0 80 150). */
const CABIDE = (
  <>
    <path d="M40 16 C40 11 46 10 46 6 C46 2 40 1 38 5" />
    <path d="M40 16 L10 32 Q8 34 11 34 H69 Q72 34 70 32 Z" />
  </>
);

const CORPETE = (
  <>
    <path d="M28 30 L26 47" />
    <path d="M52 30 L54 47" />
    <path d="M26 47 Q40 54 54 47" />
    <path d="M26 47 C25 54 27 61 28 68" />
    <path d="M54 47 C55 54 53 61 52 68" />
    <path d="M28 68 Q40 71 52 68" />
  </>
);

/** A saia é um grupo à parte para balançar a partir da cintura. */
const SAIA = (
  <>
    <path d="M28 68 C23 92 16 116 10 140 Q40 147 70 140 C64 116 57 92 52 68" />
    <g stroke="var(--line)" strokeWidth={1}>
      <path d="M36 72 C34 96 30 118 27 142" />
      <path d="M45 72 C47 96 51 118 55 142" />
      <path d="M40 72 V144" />
    </g>
  </>
);

// Camisa social de manga longa por cima do cabide (preenchida de branco para esconder a barra):
// colarinho, carcela de botões e bolso.
const CAMISA = (
  <>
    <path
      fill="var(--card)"
      d="M33 29 Q22 31 15 36 C10 56 8 84 7 110 H15 L18 62 L17 124 Q40 130 63 124 L62 62 L65 110 H73 C72 84 70 56 65 36 Q58 31 47 29 Z"
    />
    <path d="M7.5 104 H15.3" />
    <path d="M64.7 104 H72.5" />
    <path d="M33 29 L35 41 L40 35 L45 41 L47 29" />
    <path d="M40 35 V126" />
    <path d="M45 52 H54 V60 Q49.5 62 45 60 Z" />
    <g fill="currentColor" stroke="none">
      {[50, 66, 82, 98, 114].map((cy) => (
        <circle key={cy} cx="42" cy={cy} r="1.2" />
      ))}
    </g>
  </>
);

/**
 * Roupa no cabide (sem pessoas, para não virar vitrine), para usar dentro de um `<svg>` com o traço
 * já definido. Desenho em 80×150; `x`, `y` e `escala` o posicionam. Com `vento`, o cabide balança
 * pendurado no gancho e a saia do vestido ondula a partir da cintura.
 */
export function RoupaNoCabide({
  nome,
  x,
  y,
  escala = 1,
  vento,
  atraso = 0,
}: {
  nome: DesenhoTraje;
  x: number;
  y: number;
  escala?: number;
  vento: boolean;
  atraso?: number;
}) {
  // A camisa é mais pesada que a saia: balança menos.
  const forca = nome === "vestido" ? 2.4 : 1.4;
  return (
    <g transform={`translate(${x} ${y}) scale(${escala})`}>
      <motion.g
        style={{ originX: 0.5, originY: 0 }}
        animate={{ rotate: vento ? balanco(0, forca) : 0 }}
        transition={vento ? ventoTransicao(atraso) : PARADO}
      >
        {CABIDE}
        {nome === "vestido" ? (
          <>
            {CORPETE}
            <motion.g
              style={{ originX: 0.5, originY: 0 }}
              animate={{ skewX: vento ? balanco(0, -5) : 0 }}
              transition={vento ? ventoTransicao(atraso + 0.18) : PARADO}
            >
              {SAIA}
            </motion.g>
          </>
        ) : (
          CAMISA
        )}
      </motion.g>
    </g>
  );
}

const DICAS: Record<IconeDica, React.ReactNode> = {
  tecido: (
    <>
      <path d="M4 9 C8 5 12 13 16 9 S22 6 24 8" />
      <path d="M4 15 C8 11 12 19 16 15 S22 12 24 14" />
      <path d="M4 21 C8 17 12 25 16 21 S22 18 24 20" />
    </>
  ),
  salto: <path d="M4 9 V23 H8 V18.5 Q10 21 14 21 H25 Q25.5 17 19 16.5 Q10 16 4 9 Z" />,
  sol: (
    <>
      <path d="M3 20 H25" />
      <path d="M8 20 A6 6 0 0 1 20 20" />
      <path d="M14 8 V10.5 M6.5 11.5 L8.2 13.2 M21.5 11.5 L19.8 13.2 M3.5 16.5 H5.5 M22.5 16.5 H24.5" />
      <path d="M7 24 H21" stroke="var(--line)" />
    </>
  ),
};

/** Ícones das dicas de verão do cartão "Traje" (viewBox 0 0 28 28). */
export function IconeDica({ nome, className }: { nome: IconeDica; className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 28 28"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.3}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {DICAS[nome]}
    </svg>
  );
}
