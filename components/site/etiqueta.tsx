"use client";

import { useEffect, useRef, useState } from "react";

/** Etiqueta em pé: cantos de cima chanfrados, furo no meio do topo. */
function emPe(w: number, h: number) {
  const c = 18;
  return `M${c},0.5 H${w - c} L${w - 0.5},${c} V${h - 0.5} H0.5 V${c} Z`;
}

/** Etiqueta deitada: ponta à esquerda, furo perto da ponta. */
function deitada(w: number, h: number) {
  return `M18,0.5 H${w - 0.5} V${h - 0.5} H18 L0.5,${h / 2} Z`;
}

/**
 * Forma de etiqueta de presente (papel branco, borda `line`, furo com aro dourado) atrás do
 * conteúdo; o fio dourado sai do furo. O desenho acompanha o tamanho da caixa, como a <Moldura>.
 */
export function FormaEtiqueta({ deitada: horizontal = false }: { deitada?: boolean }) {
  const caixa = useRef<SVGSVGElement>(null);
  const [tam, setTam] = useState<{ w: number; h: number } | null>(null);

  useEffect(() => {
    const el = caixa.current?.parentElement;
    if (!el) return;
    const medir = () => setTam({ w: el.offsetWidth, h: el.offsetHeight });
    const obs = new ResizeObserver(medir);
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const furo = tam && (horizontal ? { cx: 16, cy: tam.h / 2 } : { cx: tam.w / 2, cy: 14 });

  return (
    <>
      <svg
        ref={caixa}
        aria-hidden="true"
        className="absolute inset-0 -z-10 size-full overflow-visible"
        viewBox={tam ? `0 0 ${tam.w} ${tam.h}` : undefined}
      >
        {tam && furo && (
          <>
            <path d={horizontal ? deitada(tam.w, tam.h) : emPe(tam.w, tam.h)} fill="var(--card)" stroke="var(--line)" strokeWidth={1} />
            <circle cx={furo.cx} cy={furo.cy} r={4} fill="var(--background)" stroke="var(--gold-line)" strokeWidth={1.2} />
          </>
        )}
      </svg>
      {!horizontal && (
        <svg
          aria-hidden="true"
          viewBox="0 0 34 30"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.2}
          className="absolute -top-4 left-1/2 h-[30px] w-[34px] -translate-x-1/2 text-gold-line"
        >
          <path d="M17 26c-9-6-14-14-9-22M17 26c6-7 12-12 9-22" />
        </svg>
      )}
    </>
  );
}
