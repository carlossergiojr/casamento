"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Revelar } from "@/components/site/revelar";
import { casamento, publico } from "@/lib/conteudo";
import { lerPresente, type DadosPresente } from "@/lib/presente-escolhido";

export function Obrigado({ id, nome, valor }: { id: string; nome: string; valor: string }) {
  const [dados, setDados] = useState<DadosPresente | null>(null);
  const reduzir = useReducedMotion();
  useEffect(() => setDados(lerPresente(id)), [id]);

  return (
    <>
      {/* Borboleta leve voando sobre a estampa (DESIGN.md: animações das telas de sucesso). */}
      {!reduzir && (
        <motion.img
          src={publico("/estampa/spot-butterfly-2.png")}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute top-[140px] left-[12%] w-16"
          initial={{ opacity: 0, x: -20, y: 20, rotate: -10 }}
          animate={{ opacity: [0, 1, 1, 0], x: [-20, 60, 140, 220], y: [20, -10, 10, -30], rotate: [-10, 6, -4, 8] }}
          transition={{ duration: 4, ease: "easeInOut", delay: 0.4 }}
        />
      )}
      <Revelar className="flex flex-col items-center gap-5">
        <h1 className="font-serif text-[40px] leading-[1.1] text-primary italic">Muito obrigado!</h1>
        <p className="text-[15px] text-primary-deep">
          Seu presente chegou até a gente{dados?.recado ? " — e o recadinho também" : ""}. Enviamos a
          confirmação para o seu e-mail.
        </p>
      </Revelar>

      <Revelar atraso={0.1} className="flex w-full flex-col gap-2 rounded-[3px] bg-surface p-4 text-left">
        <div className="flex justify-between gap-3">
          <span>{nome}</span>
          <span className="font-semibold whitespace-nowrap text-primary">{valor}</span>
        </div>
        {dados?.recado && (
          <>
            <div className="h-px bg-line/50" />
            <p className="font-serif text-lg text-primary-deep italic">“{dados.recado}”</p>
            {dados.nome && <p className="text-right text-[13px] text-primary-deep">— {dados.nome}</p>}
          </>
        )}
      </Revelar>

      <p className="font-serif text-xl text-primary-deep italic">
        Com carinho, {casamento.noivo.split(" ")[0]} &amp; {casamento.noiva}
      </p>

      <div className="mt-auto flex w-full flex-col gap-3">
        <Link href="/#presentes" className="botao bg-primary text-card hover:bg-primary-deep">
          Voltar à lista
        </Link>
        <Link
          href="/confirmar"
          className="flex min-h-11 items-center justify-center text-sm text-primary-deep underline decoration-gold-line underline-offset-4"
        >
          Já confirmou sua presença?
        </Link>
      </div>
    </>
  );
}
