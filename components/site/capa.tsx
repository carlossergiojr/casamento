import Image from "next/image";
import Link from "next/link";
import { casamento, publico } from "@/lib/conteudo";
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
      <div className="relative h-[640px] overflow-hidden bg-line md:h-[760px]">
        <Image
          src={casamento.fotoCapa}
          alt={`${casamento.primeiro} e ${casamento.segundo}`}
          fill
          priority
          sizes="(max-width: 640px) 100vw, 640px"
          className="respirar object-cover object-bottom"
        />
        <div className="pointer-events-none absolute inset-[14px] border border-background" />

        {/* O pássaro da estampa voando no céu, ao lado dos nomes. */}
        <img
          src={publico("/estampa/spot-bird.png")}
          alt=""
          aria-hidden="true"
          className="absolute top-[300px] right-7 h-auto w-[84px] md:top-[200px] md:right-24"
        />
        <Revelar aposConvite className="absolute inset-x-0 top-0 flex flex-col items-center gap-4 px-6 pt-14 text-center">
          <p className="sobretitulo">Vamos nos casar</p>
          <h1 className="flex flex-col gap-0.5 font-serif text-[52px] leading-[1.02] font-light text-primary-deep">
            <Tinta atraso={0.35}>{casamento.primeiro}</Tinta>
            <Tinta atraso={1.25} duracao={0.9} className="text-[40px] text-gold italic">
              &amp;
            </Tinta>
            <Tinta atraso={1.75}>{casamento.segundo}</Tinta>
          </h1>
        </Revelar>
      </div>

      <Revelar aposConvite atraso={0.3} className="relative flex flex-col items-center gap-5 px-[36px] pt-10 pb-9 text-center">
        <p className="font-serif text-2xl tracking-[0.1em]">{casamento.dataCapa}</p>
        <p className="text-[15px] text-primary-deep">
          {casamento.diaHora}
          <br />
          {casamento.local.nome} · {casamento.local.cidade}
        </p>

        <Contagem />

        {/* Só a ação principal; presentes e o resto ficam na barra de atalhos (specs/004). */}
        <Link href="/confirmar" className="botao w-full bg-primary text-card hover:bg-primary-deep">
          Eu vou!
        </Link>
      </Revelar>
    </section>
  );
}
