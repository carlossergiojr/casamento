"use client";

import Link from "next/link";
import { Petalas } from "@/components/site/petalas";
import { Revelar } from "@/components/site/revelar";
import { casamento } from "@/lib/conteudo";
import type { ConvitePublico } from "@/lib/convites-servidor";

/** Resultado lido do banco pelo código (specs/006 T022). */
export function Concluido({ convite }: { convite: ConvitePublico | null }) {
  const alguemVai = !!convite?.pessoas.some((p) => p.resposta === "vem");

  return (
    <>
      {alguemVai && <Petalas />}
      <Revelar className="flex flex-col items-center gap-5">
        <h1 className="font-serif text-[40px] leading-[1.1] text-primary italic">
          {alguemVai || !convite ? "Que alegria!" : "Obrigado por avisar"}
        </h1>
        <p className="text-[15px] text-primary-deep">
          {alguemVai || !convite
            ? `Recebemos sua resposta. Nos vemos dia ${casamento.dataPorExtenso}, às ${casamento.hora}, no ${casamento.local.nome}.`
            : "Recebemos sua resposta. Vamos sentir sua falta!"}
        </p>
      </Revelar>

      {convite && (
        <Revelar atraso={0.1} className="flex w-full flex-col gap-2 rounded-[3px] bg-surface p-4 text-left">
          {convite.pessoas.map((p, i) => (
            <div key={p.id}>
              {i > 0 && <div className="mb-2 h-px bg-line/50" />}
              <div className="flex justify-between gap-3">
                <span>{p.nome}</span>
                <span className="font-semibold text-primary">{p.resposta === "vem" ? "Vai" : "Não vai"}</span>
              </div>
            </div>
          ))}
        </Revelar>
      )}

      <p className="text-[13px] text-primary-deep">
        Mudou de ideia? Você pode alterar até {casamento.prazoRsvp}.
      </p>

      <div className="mt-auto flex w-full flex-col gap-3">
        <Link href="/presentes/" className="botao bg-primary text-card hover:bg-primary-deep">
          Ver lista de presentes
        </Link>
        <Link
          href="/"
          className="flex min-h-11 items-center justify-center text-sm text-primary-deep underline decoration-gold-line underline-offset-4"
        >
          Voltar ao início
        </Link>
      </div>
    </>
  );
}
