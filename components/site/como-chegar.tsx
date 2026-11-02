"use client";

import { toast } from "sonner";
import { casamento, enderecoCompleto, mapaEmbed, mapaRota } from "@/lib/conteudo";
import { Revelar } from "./revelar";

export function ComoChegar() {
  async function copiar() {
    try {
      await navigator.clipboard.writeText(enderecoCompleto);
      toast("Endereço copiado");
    } catch {
      toast("Não deu para copiar — segure o endereço para copiar à mão");
    }
  }

  return (
    <section id="local" className="flex flex-col gap-5 px-5 py-16">
      <Revelar>
        <h2 className="text-center font-serif text-[40px] text-primary italic">Como chegar</h2>
      </Revelar>
      <Revelar className="h-60 overflow-hidden border border-gold-line bg-surface">
        <iframe
          title={`Mapa: ${casamento.local.nome}`}
          src={mapaEmbed}
          className="h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </Revelar>
      <div className="flex flex-col gap-1 px-1">
        <p className="font-serif text-[28px]">{casamento.local.nome}</p>
        <p className="text-[15px]">
          {casamento.local.endereco}
          <br />
          {casamento.local.cidadeCep}
        </p>
        <p className="text-[13px] text-primary-deep">{casamento.local.referencia}</p>
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        <a
          href={mapaRota}
          target="_blank"
          rel="noopener noreferrer"
          className="botao bg-primary text-[13px] tracking-[0.12em] text-card hover:bg-primary-deep"
        >
          Abrir rota
        </a>
        <button
          type="button"
          onClick={copiar}
          className="botao border border-primary px-2 text-[13px] tracking-[0.08em] whitespace-nowrap text-primary hover:bg-primary hover:text-card"
        >
          Copiar endereço
        </button>
      </div>
    </section>
  );
}
