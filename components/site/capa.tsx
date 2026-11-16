import Image from "next/image";
import { casamento } from "@/lib/conteudo";
import { AcoesCapa } from "./acoes-capa";
import { Contagem } from "./contagem";
import { Tinta } from "./enfeites";
import { Revelar } from "./revelar";

export function Cabecalho() {
  return (
    <header className="flex h-[52px] items-center justify-between px-5">
      <span className="font-serif text-[22px] text-primary">
        {casamento.monograma.a} <span className="text-gold">&amp;</span> {casamento.monograma.b}
      </span>
      <span className="text-[11px] tracking-[0.28em] text-primary-deep uppercase">
        {casamento.dataCurta}
      </span>
    </header>
  );
}

export function Capa() {
  return (
    <section id="inicio" className="flex flex-col">
      {/* Nomes direto no céu da foto, sem cartão: o casal fica inteiro embaixo. */}
      {/* 500px: a foto quase inteira cabe (perde só um fio de céu) e a data, o local e o "Eu vou!"
          sobem para a primeira tela do celular (specs/007). */}
      <div className="relative h-[500px] overflow-hidden bg-line md:h-[760px]">
        <Image
          src={casamento.fotoCapa}
          alt={`${casamento.primeiro} e ${casamento.segundo}`}
          fill
          priority
          sizes="(max-width: 640px) 100vw, 640px"
          className="respirar object-cover object-bottom"
        />
        <div className="pointer-events-none absolute inset-[14px] border border-background" />

        <Revelar aposConvite className="absolute inset-x-0 top-0 flex flex-col items-center gap-4 px-6 pt-9 text-center">
          <p className="sobretitulo">Vamos nos casar</p>
          <h1 className="flex flex-col gap-0.5 font-serif text-[46px] leading-[1.02] font-light text-primary-deep">
            {/* Os dois nomes se escrevem juntos; o "&" entra no meio do traço. */}
            <Tinta atraso={0.35}>{casamento.primeiro}</Tinta>
            <Tinta atraso={0.85} duracao={0.9} className="text-[34px] text-gold italic">
              &amp;
            </Tinta>
            <Tinta atraso={0.35}>{casamento.segundo}</Tinta>
          </h1>
        </Revelar>
      </div>

      <Revelar aposConvite atraso={0.3} className="relative flex flex-col items-center gap-3 px-6 pt-6 pb-9 text-center">
        <p className="font-serif text-2xl tracking-[0.1em]">{casamento.dataCapa}</p>
        {/* Só o dia e o lugar: os horários e a rota estão no cartão "Programação" logo abaixo. */}
        <p className="text-[15px] text-primary-deep">
          Sábado · {casamento.local.nome}, {casamento.local.cidade.replace(", BA", "")}
        </p>

        {/* Confirmar e a rota, que é o que mais se procura; o resto fica na barra de atalhos. */}
        <AcoesCapa />

        <div className="w-full pt-3">
          <Contagem />
        </div>
      </Revelar>
    </section>
  );
}
