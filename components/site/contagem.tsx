"use client";

import { useEffect, useState } from "react";
import { casamento } from "@/lib/conteudo";
import { Fio } from "./enfeites";

const ALVO = new Date(casamento.inicio).getTime();

function restante(agora: number) {
  const diff = Math.max(0, ALVO - agora);
  return {
    dias: String(Math.floor(diff / 86_400_000)),
    horas: String(Math.floor((diff % 86_400_000) / 3_600_000)).padStart(2, "0"),
    min: String(Math.floor((diff % 3_600_000) / 60_000)).padStart(2, "0"),
  };
}

/** Contagem viva até 23/01/2027 15h (specs/001 FR-003). Zeros depois da hora. */
export function Contagem() {
  // null no servidor: o número certo só existe no relógio de quem abre.
  const [agora, setAgora] = useState<number | null>(null);

  useEffect(() => {
    setAgora(Date.now());
    const id = window.setInterval(() => setAgora(Date.now()), 15_000);
    return () => window.clearInterval(id);
  }, []);

  const r = agora === null ? { dias: "—", horas: "—", min: "—" } : restante(agora);
  const itens = [
    { valor: r.dias, rotulo: "dias" },
    { valor: r.horas, rotulo: "horas" },
    { valor: r.min, rotulo: "min" },
  ];

  return (
    <div
      className="relative grid w-full grid-cols-3 py-4"
      role="timer"
      aria-label={`Faltam ${r.dias} dias, ${r.horas} horas e ${r.min} minutos`}
    >
      <Fio atraso={0.9} />
      <Fio lado="base" atraso={1.1} />
      {itens.map((item, i) => (
        <div
          key={item.rotulo}
          className={`flex flex-col items-center ${i === 1 ? "border-x border-surface" : ""}`}
        >
          <span className="font-serif text-[44px] leading-none text-gold tabular-nums lining-nums">
            {item.valor}
          </span>
          <span className="mt-1.5 text-[11px] tracking-[0.2em] text-primary-deep uppercase">
            {item.rotulo}
          </span>
        </div>
      ))}
    </div>
  );
}
