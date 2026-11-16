"use client";

import { toast } from "sonner";
import { baixarAgenda, linkGoogleAgenda } from "@/lib/agenda";
import { casamento, dressCode, enderecoCompleto, mapaEmbed, mapaRota, mapaWaze, programa } from "@/lib/conteudo";
import { Revelar } from "./revelar";

const SECUNDARIO = "botao border border-primary px-2 text-[13px] tracking-[0.08em] whitespace-nowrap text-primary hover:bg-primary hover:text-card";

/**
 * Tudo o que o convidado precisa saber do dia, logo depois da capa (specs/007): horários, onde é
 * (mapa, rota no Google ou Waze, copiar endereço), o traje numa linha e salvar na agenda.
 * `id="local"`: é o destino do atalho "Local" da barra.
 */
export function ODia() {
  async function copiar() {
    try {
      await navigator.clipboard.writeText(enderecoCompleto);
      toast("Endereço copiado");
    } catch {
      toast("Não deu para copiar — segure o endereço para copiar à mão");
    }
  }

  return (
    <section id="local" className="flex flex-col gap-8 bg-surface px-5 py-16">
      <Revelar className="flex flex-col items-center gap-1.5 text-center">
        <h2 className="font-serif text-[40px] leading-[1.1] text-primary italic">O dia</h2>
        <p className="text-[15px] text-primary-deep">Sábado, {casamento.dataPorExtenso} de 2027</p>
      </Revelar>

      {/* Programação: hora à esquerda, um fio dourado ligando os momentos. */}
      <Revelar>
        <ol className="relative flex flex-col gap-5 px-2">
          <span aria-hidden="true" className="absolute top-3 bottom-3 left-[104px] w-px bg-gold-line" />
          {programa.map((m) => (
            <li key={m.titulo} className="grid grid-cols-[88px_1fr] items-baseline gap-8">
              <span className="text-right font-serif text-[26px] leading-none text-gold lining-nums">{m.hora}</span>
              <span className="relative flex flex-col">
                <span aria-hidden="true" className="absolute top-[9px] -left-[19px] size-[7px] rounded-full border border-gold-line bg-surface" />
                <span className="text-[17px] font-semibold text-foreground">{m.titulo}</span>
                {m.detalhe && <span className="text-[14px] text-primary-deep">{m.detalhe}</span>}
              </span>
            </li>
          ))}
        </ol>
      </Revelar>

      {/* Onde é */}
      <Revelar className="flex flex-col gap-4">
        <div className="h-52 overflow-hidden border border-gold-line bg-background">
          <iframe
            title={`Mapa: ${casamento.local.nome}`}
            src={mapaEmbed}
            className="h-full w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        <div className="flex flex-col gap-1 px-1">
          <p className="font-serif text-[28px] leading-tight">{casamento.local.nome}</p>
          <p className="text-[15px]">
            {casamento.local.endereco}
            <br />
            {casamento.local.cidadeCep}
          </p>
          <p className="text-[13px] text-primary-deep">{casamento.local.referencia}</p>
        </div>
        <div className="flex flex-col gap-2.5">
          <a
            href={mapaRota}
            target="_blank"
            rel="noopener noreferrer"
            className="botao bg-primary text-[13px] tracking-[0.12em] text-card hover:bg-primary-deep"
          >
            Abrir rota no Google Maps
          </a>
          <div className="grid grid-cols-2 gap-2.5">
            <a href={mapaWaze} target="_blank" rel="noopener noreferrer" className={SECUNDARIO}>
              Abrir no Waze
            </a>
            <button type="button" onClick={copiar} className={SECUNDARIO}>
              Copiar endereço
            </button>
          </div>
        </div>
      </Revelar>

      {/* Traje e agenda: o resto que se pergunta antes de sair de casa. */}
      <Revelar className="flex flex-col gap-4 border-t border-gold-line pt-6">
        <a href="#dresscode" className="flex min-h-11 items-center justify-between gap-3 px-1">
          <span className="flex flex-col">
            <span className="text-[13px] text-primary-deep">Traje</span>
            <span className="text-[15px] text-foreground">{dressCode.resumo}</span>
          </span>
          <span className="text-sm text-primary underline decoration-gold-line underline-offset-4">Ver detalhes</span>
        </a>
        <div className="flex flex-col items-center gap-1">
          <button type="button" onClick={baixarAgenda} className={`${SECUNDARIO} w-full`}>
            Salvar na agenda
          </button>
          <a
            href={linkGoogleAgenda}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-11 items-center text-sm text-primary-deep underline decoration-gold-line underline-offset-4"
          >
            ou adicionar no Google Agenda
          </a>
        </div>
      </Revelar>
    </section>
  );
}
