"use client";

import { useState } from "react";
import { casamento, programa } from "@/lib/conteudo";
import { ComoChegar } from "./como-chegar";
import { Croqui } from "./croqui";
import { IconePrograma } from "./icones-programa";
import { Moldura } from "./moldura";
import { Revelar } from "./revelar";

/**
 * Logo depois da capa (specs/007): o cartão "Programação" igual ao impresso (moldura recortada,
 * título cursivo, ícones) e, fora dele, o local simples de ler: croqui desenhado, endereço e um
 * botão "Como chegar" que abre a gaveta com Google Maps, Waze, Uber e copiar endereço.
 * `id="local"`: é o destino do atalho "Local" da barra.
 */
export function ODia() {
  const [rota, setRota] = useState(false);

  return (
    <section id="local" className="flex flex-col gap-8 bg-surface px-3.5 py-14">
      <Revelar>
        <Moldura className="flex flex-col items-center gap-7 px-7 pt-12 pb-10">
          <div className="flex flex-col items-center gap-2.5 text-center">
            <h2 className="-mb-1 font-script text-[54px] leading-none font-normal text-marinho">Programação</h2>
            <p className="font-serif text-sm tracking-[0.3em] text-marinho">
              SÁBADO · {casamento.dataCurta.replaceAll(".", " . ")}
            </p>
          </div>

          {/* Linha do tempo: ícone, ponto no fio, e o momento. */}
          <ol className="relative flex w-full flex-col gap-[22px]">
            <span aria-hidden="true" className="absolute top-3.5 bottom-8 left-[49px] w-px bg-line" />
            {programa.map((m) => (
              <li key={m.titulo} className="grid grid-cols-[34px_30px_minmax(0,1fr)] items-start">
                <IconePrograma nome={m.icone} className="mt-1 size-7 text-marinho" />
                <span aria-hidden="true" className="mt-[13px] ml-[11px] size-[9px] rounded-full bg-marinho ring-4 ring-card" />
                <span className="flex flex-col">
                  <span className="font-serif text-[15px] tracking-[0.06em] text-primary-deep lining-nums">{m.hora}</span>
                  <span className="font-serif text-2xl leading-tight font-medium text-marinho">{m.titulo}</span>
                  <span className="mt-0.5 font-serif text-[17px] leading-snug text-primary-deep italic">{m.detalhe}</span>
                </span>
              </li>
            ))}
          </ol>
        </Moldura>
      </Revelar>

      {/* Onde é: fora do cartão, simples de ler. */}
      <Revelar className="flex flex-col gap-4 px-1.5">
        <button
          type="button"
          onClick={() => setRota(true)}
          aria-label="Croqui do caminho até o Campestre. Toque para escolher como chegar."
          className="relative overflow-hidden rounded-[3px] border border-gold-line focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <Croqui />
          <span className="absolute right-2.5 bottom-2.5 rounded-[3px] border border-line bg-background px-2.5 py-1 text-xs font-semibold text-primary">
            Tocar para a rota
          </span>
        </button>
        <p className="-mt-1 text-center text-[13px] text-primary-deep">Desenho sem escala, só para se localizar.</p>
        <div className="flex flex-col items-center gap-0.5 text-center">
          <p className="font-serif text-[28px] leading-tight">{casamento.local.nome}</p>
          <p className="text-[15px]">
            {casamento.local.endereco}
            <br />
            {casamento.local.cidadeCep}
          </p>
          <p className="text-[13px] text-primary-deep">{casamento.local.referencia}</p>
        </div>
        <button type="button" onClick={() => setRota(true)} className="botao w-full bg-primary text-card hover:bg-primary-deep">
          Como chegar
        </button>
      </Revelar>

      <ComoChegar aberto={rota} mudar={setRota} />
    </section>
  );
}
