import { casamento } from "./conteudo";

/** Data no formato do iCalendar (UTC): 20270123T183000Z. */
const ics = (iso: string) => new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

const titulo = `Casamento ${casamento.primeiro} & ${casamento.segundo}`;
const local = `${casamento.local.nome}, ${casamento.local.endereco}, ${casamento.local.cidadeCep}`;
const descricao = `Boas-vindas às ${casamento.hora}, cerimônia às ${casamento.cerimonia}. ${casamento.hashtag}`;

/** Baixa o .ics: no iPhone abre direto no Calendário; no Android, na agenda padrão. */
export function baixarAgenda() {
  const escapar = (t: string) => t.replace(/[,;]/g, (c) => `\\${c}`);
  const conteudo = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Cavi2027//PT-BR",
    "BEGIN:VEVENT",
    "UID:casamento-cavi2027@carlossergiojr",
    `DTSTAMP:${ics(new Date().toISOString())}`,
    `DTSTART:${ics(casamento.inicio)}`,
    `DTEND:${ics(casamento.fim)}`,
    `SUMMARY:${escapar(titulo)}`,
    `LOCATION:${escapar(local)}`,
    `DESCRIPTION:${escapar(descricao)}`,
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
