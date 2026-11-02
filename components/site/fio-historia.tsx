"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";

/**
 * Fio dourado que desce pela "Nossa história" acompanhando a rolagem e liga os trechos; uma
 * conta dourada marca a ponta. Fica na margem esquerda, atrás do texto. Sem movimento, o fio
 * já aparece inteiro.
 */
export function FioHistoria() {
  const trilho = useRef<HTMLDivElement>(null);
  const reduzir = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: trilho, offset: ["start 75%", "end 60%"] });
  const progresso = useSpring(scrollYProgress, { stiffness: 90, damping: 24, restDelta: 0.001 });
  const topoConta = useTransform(progresso, (p) => `${p * 100}%`);

  return (
    <div
      ref={trilho}
      aria-hidden="true"
      className="pointer-events-none absolute top-[150px] bottom-[150px] left-3.5 w-px"
    >
      <div className="absolute inset-0 bg-gold-line/25" />
      <motion.div
        className="absolute inset-0 origin-top bg-gold-line"
        style={{ scaleY: reduzir ? 1 : progresso }}
      />
      {!reduzir && (
        <motion.span
          className="absolute -left-[2.5px] size-1.5 -translate-y-1/2 rounded-full bg-gold"
          style={{ top: topoConta }}
        />
      )}
    </div>
  );
}
