"use client";

import { motion, type Variants } from "motion/react";
import { useReduzir } from "@/lib/use-reduzir";

/*
 * Enfeites que herdam o momento do <Revelar> em volta (variantes "oculto" → "visivel"): não têm
 * gatilho próprio, então na capa só começam quando o envelope sai. `data-revelar` os deixa
 * prontos sem JS (noscript em app/layout.tsx).
 */

const TINTA = [0.65, 0, 0.35, 1] as const;
const ABERTO = "inset(-25% -12% -25% -12%)";

/** Fio dourado que se traça do centro para as pontas. Substitui um `border-*` gold-line. */
export function Fio({ lado = "topo", atraso = 0.2 }: { lado?: "topo" | "base"; atraso?: number }) {
  const reduzir = useReduzir();
  const variantes: Variants = {
    oculto: { scaleX: reduzir ? 1 : 0, opacity: reduzir ? 0 : 1 },
    visivel: { scaleX: 1, opacity: 1, transition: { duration: reduzir ? 0.4 : 1.4, delay: atraso, ease: TINTA } },
  };
  return (
    <motion.span
      data-revelar
      aria-hidden="true"
      variants={variantes}
      className={`pointer-events-none absolute inset-x-0 h-px bg-gold-line ${lado === "topo" ? "top-0" : "bottom-0"}`}
    />
  );
}

/** Texto revelado da esquerda para a direita, como tinta na pena. */
export function Tinta({
  atraso = 0,
  duracao = 1.3,
  className,
  children,
}: {
  atraso?: number;
  duracao?: number;
  className?: string;
  children: React.ReactNode;
}) {
  const reduzir = useReduzir();
  // Folga vertical e lateral no recorte para não cortar acentos e o itálico.
  // Reduzido: só aparece (o recorte abre na hora; o servidor manda o texto já recortado).
  const variantes: Variants = reduzir
    ? {
        oculto: { opacity: 0, clipPath: ABERTO },
        visivel: {
          opacity: 1,
          clipPath: ABERTO,
          transition: { opacity: { duration: 0.5, delay: atraso }, clipPath: { duration: 0 } },
        },
      }
    : {
        oculto: { clipPath: "inset(-25% 100% -25% -12%)" },
        visivel: { clipPath: ABERTO, transition: { duration: duracao, delay: atraso, ease: TINTA } },
      };
  return (
    <motion.span data-revelar variants={variantes} className={className}>
      {children}
    </motion.span>
  );
}
