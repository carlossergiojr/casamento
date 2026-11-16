"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { casamento } from "@/lib/conteudo";
import { useReduzir } from "@/lib/use-reduzir";
import { Fio } from "./enfeites";

const ALVO = new Date(casamento.inicio).getTime();

function restante(agora: number) {
  const diff = Math.max(0, ALVO - agora);
  return {
    dias: String(Math.floor(diff / 86_400_000)),
    horas: String(Math.floor((diff % 86_400_000) / 3_600_000)).padStart(2, "0"),
    min: String(Math.floor((diff % 3_600_000) / 60_000)).padStart(2, "0"),
    seg: String(Math.floor((diff % 60_000) / 1000)).padStart(2, "0"),
  };
}

/** Número que troca descendo de leve (os segundos, e os outros quando viram). */
function Numero({ valor, reduzir }: { valor: string; reduzir: boolean }) {
  return (
    <span className="relative flex h-[44px] items-center justify-center overflow-hidden">
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={valor}
          className="font-serif text-[44px] leading-none text-gold tabular-nums lining-nums"
          initial={reduzir ? false : { y: "-60%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={reduzir ? { opacity: 0, transition: { duration: 0 } } : { y: "60%", opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          {valor}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/** Contagem viva até 23/01/2027 15h30, boas-vindas (specs/001 FR-003). Zeros depois da hora. */
export function Contagem() {
  const reduzir = useReduzir();
  // null no servidor: o número certo só existe no relógio de quem abre.
  const [agora, setAgora] = useState<number | null>(null);

  useEffect(() => {
    setAgora(Date.now());
    const id = window.setInterval(() => setAgora(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const r = agora === null ? { dias: "—", horas: "—", min: "—", seg: "—" } : restante(agora);
  const itens = [
    { valor: r.dias, rotulo: "dias" },
    { valor: r.horas, rotulo: "horas" },
    { valor: r.min, rotulo: "min" },
    { valor: r.seg, rotulo: "seg" },
  ];

  return (
    <div
      className="relative grid w-full grid-cols-4 py-4"
      role="timer"
      // Sem os segundos: o leitor de tela não precisa de um aviso novo a cada segundo.
      aria-label={`Faltam ${r.dias} dias, ${r.horas} horas e ${r.min} minutos`}
    >
      <Fio atraso={0.9} />
      <Fio lado="base" atraso={1.1} />
      {itens.map((item, i) => (
        <div
          key={item.rotulo}
          aria-hidden="true"
          className={`flex flex-col items-center ${i > 0 ? "border-l border-surface" : ""}`}
        >
          <Numero valor={item.valor} reduzir={reduzir} />
          <span className="mt-1.5 text-[13px] text-primary-deep">{item.rotulo}</span>
        </div>
      ))}
    </div>
  );
}
