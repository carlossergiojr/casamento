"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ComponentProps } from "react";

/** Fade/slide suave quando o bloco entra na tela (specs/001 FR-004). */
export function Revelar({
  atraso = 0,
  className,
  children,
  ...resto
}: { atraso?: number } & ComponentProps<typeof motion.div>) {
  const reduzir = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduzir ? { opacity: 0 } : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: reduzir ? 0.4 : 0.9, delay: atraso, ease: [0.22, 1, 0.36, 1] }}
      {...resto}
    >
      {children}
    </motion.div>
  );
}
