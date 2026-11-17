"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { useReduzir } from "@/lib/use-reduzir";
import { Revelar } from "@/components/site/revelar";
import { casamento, publico } from "@/lib/conteudo";

export type Estado = "aprovado" | "pendente" | "recusado";

const textos: Record<Estado, { titulo: string; texto: (recado: boolean) => string }> = {
  aprovado: {
    titulo: "Muito obrigado!",
    texto: (recado) =>
      `Seu presente chegou até a gente${recado ? " — e o recadinho também" : ""}.`,
  },
  pendente: {
    titulo: "Quase lá",
    texto: () =>
      "O Mercado Pago ainda está confirmando o pagamento. No Pix costuma levar poucos segundos; assim que aprovar, o presente chega até a gente.",
  },
  recusado: {
    titulo: "O pagamento não foi aprovado",
    texto: () => "Nada foi cobrado. Dá para tentar de novo, com outro cartão ou por Pix.",
  },
};

type Props = { estado: Estado; id: string; presente: string; valor: string; nome: string; recado: string };

export function Obrigado({ estado, id, presente, valor, nome, recado }: Props) {
  const reduzir = useReduzir();
  const router = useRouter();
  const t = textos[estado];

  return (
    <>
      {/* Borboleta leve voando sobre a estampa (DESIGN.md: animações das telas de sucesso). */}
      {estado === "aprovado" && !reduzir && (
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
        <h1 className="font-serif text-[40px] leading-[1.1] text-primary italic">{t.titulo}</h1>
        <p className="text-[15px] text-primary-deep">{t.texto(!!recado)}</p>
      </Revelar>

      <Revelar atraso={0.1} className="flex w-full flex-col gap-2 rounded-[3px] bg-surface p-4 text-left">
        <div className="flex justify-between gap-3">
          <span>{presente}</span>
          <span className="font-semibold whitespace-nowrap text-primary">{valor}</span>
        </div>
        {recado && (
          <>
            <div className="h-px bg-line/50" />
            <p className="font-serif text-lg text-primary-deep italic">“{recado}”</p>
            <p className="text-right text-[13px] text-primary-deep">— {nome}</p>
          </>
        )}
      </Revelar>

      {estado === "aprovado" && (
        <p className="font-serif text-xl text-primary-deep italic">Com carinho, {casamento.casalCurto}</p>
      )}

      <div className="mt-auto flex w-full flex-col gap-3">
        {estado === "pendente" && (
          <button type="button" onClick={() => router.refresh()} className="botao bg-primary text-card hover:bg-primary-deep">
            Atualizar
          </button>
        )}
        {estado === "recusado" && (
          <Link href={`/presentes/${id}/`} className="botao bg-primary text-card hover:bg-primary-deep">
            Tentar de novo
          </Link>
        )}
        <Link
          href="/presentes/"
          className={
            estado === "aprovado"
              ? "botao bg-primary text-card hover:bg-primary-deep"
              : "botao border border-primary text-primary hover:bg-surface"
          }
        >
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
