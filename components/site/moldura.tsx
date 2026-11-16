"use client";

import { useEffect, useRef, useState } from "react";

/** Retângulo com os quatro cantos recortados para dentro (côncavos), como o cartão impresso. */
function recorte(x0: number, y0: number, x1: number, y1: number, r: number) {
  return `M${x0 + r},${y0} H${x1 - r} A${r},${r} 0 0 0 ${x1},${y0 + r} V${y1 - r} A${r},${r} 0 0 0 ${x1 - r},${y1} H${x0 + r} A${r},${r} 0 0 0 ${x0},${y1 - r} V${y0 + r} A${r},${r} 0 0 0 ${x0 + r},${y0} Z`;
}

/**
 * Moldura do cartão "Programação": papel branco, borda marinho com cantos recortados e um fio
 * fino por dentro. O desenho acompanha o tamanho do conteúdo (ResizeObserver).
 */
export function Moldura({ className = "", children }: { className?: string; children: React.ReactNode }) {
  const caixa = useRef<HTMLDivElement>(null);
  const [tam, setTam] = useState<{ w: number; h: number } | null>(null);

  useEffect(() => {
    const el = caixa.current;
    if (!el) return;
    const medir = () => setTam({ w: el.clientWidth, h: el.clientHeight });
    const obs = new ResizeObserver(medir);
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={caixa} className={`relative isolate ${className}`}>
      {tam && (
        <svg aria-hidden="true" className="absolute inset-0 -z-10 size-full overflow-visible" viewBox={`0 0 ${tam.w} ${tam.h}`}>
          <path d={recorte(0.5, 0.5, tam.w - 0.5, tam.h - 0.5, 26)} fill="var(--card)" stroke="var(--marinho)" strokeWidth={1.2} />
          <path d={recorte(9, 9, tam.w - 9, tam.h - 9, 19)} fill="none" stroke="var(--line)" strokeWidth={1} />
        </svg>
      )}
      {children}
    </div>
  );
}
