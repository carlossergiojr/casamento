import type { Transition } from "motion/react";

/*
 * O vento do site (cartão "Traje", etiquetas dos presentes): uma rajada e depois uma brisa menor,
 * a cada ~6,5s. Cada peça recebe um `atraso` conforme a posição (da esquerda para a direita), para
 * parecer o mesmo vento passando.
 * Sem vento (fora da tela ou com "Reduzir movimento"), tudo fica parado no ângulo de base.
 */
const PASSOS = [0, 0.12, 0.26, 0.4, 0.52, 0.62, 0.8, 1];
const RAJADA = [0, 1, -0.65, 0.32, -0.14, 0, 0.28, 0];

/** Ângulos do balanço: `base` + a rajada vezes `forca` (em graus). */
export function balanco(base: number, forca: number) {
  return RAJADA.map((r) => base + r * forca);
}

export function ventoTransicao(atraso: number): Transition {
  return { duration: 6.5, times: PASSOS, ease: "easeInOut", repeat: Infinity, delay: atraso };
}

