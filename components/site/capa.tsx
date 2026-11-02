import Image from "next/image";
import Link from "next/link";
import { casamento, publico } from "@/lib/conteudo";
import { Contagem } from "./contagem";
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
      <div className="relative h-[600px] bg-line md:h-[680px]">
        <Image
          src={casamento.fotoCapa}
          alt={`${casamento.noivo} e ${casamento.noiva}`}
          fill
          priority
          sizes="(max-width: 640px) 100vw, 640px"
          className="object-cover"
        />
        <div className="pointer-events-none absolute inset-[14px] border border-background" />
      </div>

      <Revelar className="relative mx-[18px] -mt-24 flex flex-col items-center gap-5 border-t border-gold-line bg-background px-[22px] pt-11 pb-9 text-center">
        <img
          src={publico("/estampa/spot-bird.png")}
          alt=""
          aria-hidden="true"
          className="absolute -top-[62px] -right-1.5 h-[102px] w-[120px]"
        />
        <p className="sobretitulo">Vamos nos casar</p>
        <h1 className="flex flex-col gap-0.5 font-serif text-[52px] leading-[1.02] font-light text-primary">
          <span>{casamento.noivo}</span>
          <span className="text-[40px] text-gold italic">&amp;</span>
          <span>{casamento.noiva}</span>
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
