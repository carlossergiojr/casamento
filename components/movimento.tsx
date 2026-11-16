"use client";

import { MotionConfig } from "motion/react";

/**
 * Com "Reduzir movimento" ligado, o Motion pula deslocamentos e giros (só o fade continua), em
 * todo o site — inclusive nos blocos que o servidor já mandou deslocados (specs/007 FR-001).
 */
export function Movimento({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
