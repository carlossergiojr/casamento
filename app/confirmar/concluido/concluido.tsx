"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Petalas } from "@/components/site/petalas";
import { Revelar } from "@/components/site/revelar";
import { casamento, convitesExemplo } from "@/lib/conteudo";

/** Data no formato do iCalendar (UTC): 20270123T180000Z. */
const ics = (iso: string) => new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

function baixarAgenda() {
  const l = casamento.local;
  const conteudo = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Cavi2027//PT-BR",
    "BEGIN:VEVENT",
    "UID:casamento-cavi2027@carlossergiojr",
    `DTSTAMP:${ics(new Date().toISOString())}`,
    `DTSTART:${ics(casamento.inicio)}`,
    `DTEND:${ics(casamento.fim)}`,
    `SUMMARY:Casamento ${casamento.primeiro} & ${casamento.segundo}`,
    `LOCATION:${l.nome}\\, ${l.endereco.replace(",", "\\,")}\\, ${l.cidadeCep}`,
    `DESCRIPTION:${casamento.hashtag}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const url = URL.createObjectURL(new Blob([conteudo], { type: "text/calendar;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = "casamento-cavi2027.ics";
  a.click();
  // Safari e Firefox só começam o download depois do clique: apagar o link na hora o cancela.
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function Concluido() {
  const params = useSearchParams();
  const convite = convitesExemplo.find((c) => c.codigo === params.get("c"));
  const r = params.get("r") ?? "";
  const alguemVai = r.includes("1");

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
            <div key={p}>
              {i > 0 && <div className="mb-2 h-px bg-line/50" />}
              <div className="flex justify-between gap-3">
                <span>{p}</span>
                <span className="font-semibold text-primary">{r[i] === "1" ? "Vai" : "Não vai"}</span>
              </div>
            </div>
          ))}
        </Revelar>
      )}

      <p className="text-[13px] text-primary-deep">
        Mudou de ideia? Você pode alterar até {casamento.prazoRsvp}.
      </p>

      <div className="mt-auto flex w-full flex-col gap-3">
        <Link href="/#presentes" className="botao bg-primary text-card hover:bg-primary-deep">
          Ver lista de presentes
        </Link>
        <button
          type="button"
          onClick={baixarAgenda}
          className="botao border border-primary text-primary hover:bg-primary hover:text-card"
        >
          Salvar na agenda
        </button>
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
