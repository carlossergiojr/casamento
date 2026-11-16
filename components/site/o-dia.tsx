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
 * título cursivo, ícones).
 */
export function Programacao() {
  return (
    <section id="programacao" aria-label="Programação" className="bg-surface px-3.5 pt-14 pb-6">
      <Revelar>
        {/* Compacto de propósito: o cartão inteiro cabe numa tela de celular pequeno (iPhone SE). */}
        <Moldura className="flex flex-col items-center gap-5 px-5 pt-9 pb-8">
          <div className="flex flex-col items-center gap-2 text-center">
            <h2 className="-mb-1 font-script text-[46px] leading-none font-normal text-marinho">Programação</h2>
            <p className="font-serif text-sm tracking-[0.3em] text-marinho">
              SÁBADO · {casamento.dataCurta.replaceAll(".", " . ")}
            </p>
          </div>

          {/* Linha do tempo: ícone, ponto no fio e o momento, com a hora na mesma linha do nome. */}
          <ol className="relative flex w-full flex-col gap-3.5">
            <span aria-hidden="true" className="absolute top-3 bottom-7 left-[39px] w-px bg-line" />
            {programa.map((m) => (
              <li key={m.titulo} className="grid grid-cols-[28px_24px_minmax(0,1fr)] items-start">
                <IconePrograma nome={m.icone} className="mt-0.5 size-6 text-marinho" />
                <span aria-hidden="true" className="mt-[10px] ml-[7px] size-[9px] rounded-full bg-marinho ring-4 ring-card" />
                <span className="flex flex-col">
                  <span className="flex items-baseline justify-between gap-2">
                    <span className="font-serif text-[21px] leading-tight font-medium text-marinho">{m.titulo}</span>
                    <span className="font-serif text-[15px] whitespace-nowrap text-primary-deep lining-nums">{m.hora}</span>
                  </span>
                  <span className="font-serif text-[15px] leading-snug text-primary-deep italic">{m.detalhe}</span>
                </span>
              </li>
            ))}
          </ol>
        </Moldura>
      </Revelar>
    </section>
  );
}

/**
 * Onde é, logo depois do Traje (a rota também abre pelo botão da capa): título, croqui desenhado, endereço e um botão que abre a
 * gaveta com Google Maps, Waze, Uber e copiar endereço. `id="local"`: destino de "Como chegar" no menu do topo.
 */
export function Local() {
  const [rota, setRota] = useState(false);

  return (
    <section id="local" className="flex flex-col gap-5 px-5 pt-14 pb-14">
      <Revelar>
        <h2 className="text-center font-serif text-[40px] leading-[1.1] text-primary italic">Como chegar</h2>
      </Revelar>
      <Revelar className="flex flex-col gap-4">
        <button
          type="button"
          onClick={() => setRota(true)}
          aria-label="Croqui do caminho até o Campestre. Toque para abrir a rota."
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
          Abrir rota
        </button>
      </Revelar>

      <ComoChegar aberto={rota} mudar={setRota} />
    </section>
  );
}
