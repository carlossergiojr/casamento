import Image from "next/image";
import Link from "next/link";
import { casamento, publico } from "@/lib/conteudo";
import { Contagem } from "./contagem";
import { Fio, Tinta } from "./enfeites";
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
      <div className="relative h-[600px] overflow-hidden bg-line md:h-[680px]">
        <Image
          src={casamento.fotoCapa}
          alt={`${casamento.primeiro} e ${casamento.segundo}`}
          fill
          priority
          sizes="(max-width: 640px) 100vw, 640px"
          className="respirar object-cover"
        />
        <div className="pointer-events-none absolute inset-[14px] border border-background" />
      </div>

      <Revelar aposConvite className="relative mx-[18px] -mt-24 flex flex-col items-center gap-5 bg-background px-[22px] pt-11 pb-9 text-center">
        <img
          src={publico("/estampa/spot-bird.png")}
          alt=""
          aria-hidden="true"
          className="absolute -top-[66px] -right-1 h-auto w-[104px]"
        />
        <Fio atraso={0.1} />
        <p className="sobretitulo">Vamos nos casar</p>
        <h1 className="flex flex-col gap-0.5 font-serif text-[52px] leading-[1.02] font-light text-primary">
          <Tinta atraso={0.35}>{casamento.primeiro}</Tinta>
          <Tinta atraso={1.25} duracao={0.9} className="text-[40px] text-gold italic">
            &amp;
          </Tinta>
          <Tinta atraso={1.75}>{casamento.segundo}</Tinta>
        </h1>
        <p className="font-serif text-2xl tracking-[0.1em]">{casamento.dataCapa}</p>
        <p className="text-[15px] text-primary-deep">
          {casamento.diaHora}
          <br />
          {casamento.local.nome} · {casamento.local.cidade}
        </p>

        <Contagem />

        <div className="flex w-full flex-col gap-3">
          <Link href="/confirmar" className="botao bg-primary text-card hover:bg-primary-deep">
            Eu vou!
          </Link>
          <a
            href="#presentes"
            className="botao border border-primary text-primary hover:bg-primary hover:text-card"
          >
            Lista de presentes
          </a>
        </div>
      </Revelar>
    </section>
  );
}
