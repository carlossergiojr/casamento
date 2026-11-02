"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ComponentProps } from "react";
import { useConviteAberto } from "@/lib/use-convite-aberto";

/**
 * Fade/slide suave quando o bloco entra na tela (specs/001 FR-004). Com `aposConvite`, espera o
 * envelope sair da frente para animar (a capa, que já está na tela ao carregar).
 * `data-revelar` deixa o bloco visível sem JS (noscript em app/layout.tsx).
 */
export function Revelar({
  atraso = 0,
  aposConvite = false,
  className,
  children,
  ...resto
}: { atraso?: number; aposConvite?: boolean } & ComponentProps<typeof motion.div>) {
  const reduzir = useReducedMotion();
  const aberto = useConviteAberto();
  const variantes = {
    oculto: reduzir ? { opacity: 0 } : { opacity: 0, y: 24 },
    visivel: { opacity: 1, y: 0 },
  };
  return (
    <motion.div
      data-revelar
      className={className}
      variants={variantes}
      initial="oculto"
      {...(aposConvite ? { animate: aberto ? "visivel" : "oculto" } : { whileInView: "visivel" })}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: reduzir ? 0.4 : 0.9, delay: atraso, ease: [0.22, 1, 0.36, 1] }}
      {...resto}
    >
      {children}
    </motion.div>
  );
}
