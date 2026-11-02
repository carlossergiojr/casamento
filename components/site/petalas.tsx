"use client";

import { motion, useReducedMotion } from "motion/react";
import { publico } from "@/lib/conteudo";

/** Sorteio fixo por índice: igual no servidor e no navegador (sem erro de hidratação). */
const sorte = (i: number, n: number) => {
  const x = Math.sin(i * 12.9898 + n * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

const CORES = ["var(--gold-line)", "var(--line)", "var(--gold)"];

const PECAS = Array.from({ length: 22 }, (_, i) => {
  const borboleta = i % 6 === 0;
  return {
    borboleta,
    img: i % 12 === 0 ? "spot-butterfly-2.png" : "spot-butterfly-1.png",
    esquerda: `${Math.round(4 + sorte(i, 1) * 92)}%`,
    tam: Math.round(borboleta ? 34 + sorte(i, 2) * 18 : 9 + sorte(i, 2) * 8),
    cor: CORES[i % CORES.length],
    atraso: sorte(i, 3) * 2.6,
    duracao: 6.5 + sorte(i, 4) * 3.5,
    balanco: 18 + sorte(i, 5) * 30,
    giro: (sorte(i, 6) - 0.5) * 540,
  };
});

/**
 * Pétalas e borboletas da estampa caindo devagar pela tela, uma vez, em comemoração ao "Vou!"
 * (tela "Que alegria!"). Não aparecem com `prefers-reduced-motion`.
 */
export function Petalas() {
  const reduzir = useReducedMotion();
  if (reduzir) return null;
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
      {PECAS.map((p, i) => (
        <motion.span
          key={i}
          className="absolute -top-12 block"
          style={{ left: p.esquerda, width: p.tam }}
          initial={{ y: 0, x: 0, rotate: 0, opacity: 0 }}
          animate={{
            y: "112vh",
            x: [0, p.balanco, -p.balanco, p.balanco / 2, 0],
            rotate: p.borboleta ? [0, 8, -8, 6, 0] : p.giro,
            opacity: [0, 0.9, 0.9, 0.9, 0],
          }}
          transition={{ duration: p.duracao, delay: p.atraso, ease: "linear" }}
        >
          {p.borboleta ? (
            <motion.img
              src={publico(`/estampa/${p.img}`)}
              alt=""
              className="w-full"
              animate={{ scaleX: [1, 0.4, 1] }}
              transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut" }}
            />
          ) : (
            <span
              className="block rounded-[70%_0_70%_0]"
              style={{ height: Math.round(p.tam * 1.4), backgroundColor: p.cor, opacity: 0.7 }}
            />
          )}
        </motion.span>
      ))}
    </div>
  );
}
