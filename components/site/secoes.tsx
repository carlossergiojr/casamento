import Link from "next/link";
import { casamento, dressCode, presentes, publico } from "@/lib/conteudo";
import { DesenhoTraje, IconeDica } from "./desenhos-traje";
import { Moldura } from "./moldura";
import { CotaLivre, DestaquesPresentes } from "./presentes";
import { Revelar } from "./revelar";

const TITULO = "font-serif text-[40px] leading-[1.1] text-primary italic";

export function DressCode() {
  return (
    // Irmão do cartão "Programação" (versão B, specs/007): mesma moldura, título cursivo,
    // roupas desenhadas no cabide, cores a evitar por motivo e dicas de verão com ícones.
    <section id="dresscode" aria-label="Traje" className="px-3.5 pt-14 pb-12">
      <Revelar>
        <Moldura className="flex flex-col items-center gap-[18px] px-5 pt-9 pb-8 text-center">
          <div className="flex flex-col items-center gap-1.5">
            <h2 className="-mb-1 font-script text-[50px] leading-none font-normal text-marinho">Traje</h2>
            <p className="pl-[0.34em] font-serif text-[15px] tracking-[0.34em] text-marinho uppercase">
              {dressCode.traje}
            </p>
          </div>

          <div className="flex justify-center gap-[30px]">
            {dressCode.trajes.map(({ desenho, legenda }) => (
              <figure key={desenho} className="flex flex-col items-center gap-1.5">
                <DesenhoTraje nome={desenho} className="h-[158px] w-[84px] text-marinho" />
                <figcaption className="font-serif text-base leading-tight text-primary-deep italic">{legenda}</figcaption>
              </figure>
            ))}
          </div>

          <p className="-mb-1 font-serif text-lg font-medium text-marinho">{dressCode.pedido}</p>
          <div className="flex flex-wrap justify-center gap-x-[26px] gap-y-[18px]">
            {dressCode.evitar.map(({ grupo, cores }) => (
              <div key={grupo} className="flex flex-col items-center gap-2">
                <p className="text-xs font-semibold tracking-[0.14em] text-primary-deep uppercase">{grupo}</p>
                {/* Nome embaixo de cada bolinha: no celular não tem "passar o mouse". */}
                <ul className="flex gap-1.5">
                  {cores.map(({ nome, cor }) => (
                    <li key={nome} className="flex w-12 flex-col items-center gap-1">
                      <span
                        aria-hidden="true"
                        className="relative size-[34px] rounded-full border-2 border-card ring-1 ring-line"
                        style={{ background: cor }}
                      >
                        {/* Risco de "evite". */}
                        <svg viewBox="0 0 34 34" className="absolute -inset-0.5 size-[34px]">
                          <path d="M7 27 L27 7" className="stroke-marinho" strokeWidth={1.3} strokeLinecap="round" />
                        </svg>
                      </span>
                      <span className="text-center text-[11.5px] leading-tight text-foreground">{nome}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <span aria-hidden="true" className="my-1 h-px w-[70%] bg-line" />
          <p className="-mb-1 font-serif text-lg font-medium text-marinho">{dressCode.dicasTitulo}</p>
          <ul className="grid w-full grid-cols-3 gap-2">
            {dressCode.dicas.map(({ icone, texto }) => (
              <li key={icone} className="flex flex-col items-center gap-1.5 text-[13px] leading-tight text-foreground">
                <IconeDica nome={icone} className="size-[34px] text-marinho" />
                {texto}
              </li>
            ))}
          </ul>
        </Moldura>
      </Revelar>
    </section>
  );
}

export function ListaPresentes() {
  return (
    <section id="presentes" className="flex flex-col gap-6 px-5 py-16">
      <Revelar className="flex flex-col items-center gap-2.5 px-2 text-center">
        <h2 className={TITULO}>Lista de presentes</h2>
        <p className="text-[15px] text-primary-deep">
          Escolha um presente e pague aqui mesmo, por Pix ou cartão: o valor chega até nós e a
          gente compra o item. Dá para deixar um recadinho junto.
        </p>
      </Revelar>
      <DestaquesPresentes />
      <Link href="/presentes/" className="botao border border-primary text-primary hover:bg-primary hover:text-card">
        Ver lista completa ({presentes.length} presentes)
      </Link>
      <CotaLivre />
    </section>
  );
}

export function ChamadaRsvp() {
  return (
    <section
      id="rsvp"
      className="relative flex flex-col items-center gap-5 bg-surface px-7 py-16 text-center"
    >
      <Revelar className="flex w-full flex-col items-center gap-5">
        <img
          src={publico("/estampa/spot-bird.png")}
          alt=""
          aria-hidden="true"
          className="h-auto w-[96px] -scale-x-100"
        />
        <h2 className={TITULO}>Você vem?</h2>
        <p className="text-[15px] text-primary-deep">
          Confirme até <strong className="text-foreground">{casamento.prazoRsvp}</strong>.
        </p>
        {/* GET simples: leva o nome para a busca do RSVP. */}
        <form action={publico("/confirmar/")} className="flex w-full flex-col gap-5">
          <div className="flex w-full flex-col gap-2 text-left">
            <label htmlFor="rsvp-nome" className="text-[13px] text-primary-deep">
              Seu nome ou código do convite
            </label>
            <input
              id="rsvp-nome"
              name="nome"
              type="text"
              autoComplete="name"
              placeholder="Ex.: Maria Souza"
              className="h-[50px] w-full rounded-[3px] border border-line bg-card px-3.5 text-base text-foreground placeholder:text-primary-deep/70 focus:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            />
          </div>
          <button type="submit" className="botao w-full bg-primary text-card hover:bg-primary-deep">
            Confirmar presença
          </button>
        </form>
      </Revelar>
    </section>
  );
}

export function Rodape() {
  return (
    <footer className="flex flex-col">
      <div className="toile h-40 border-t border-gold-line" />
      {/* Espaço extra embaixo para a barra de atalhos não cobrir o rodapé (specs/004 D6). */}
      <div className="flex flex-col items-center gap-2 px-7 pt-9 pb-[calc(7rem+env(safe-area-inset-bottom))] text-center">
        <p className="font-serif text-[40px] font-light text-primary">
          {casamento.monograma.a} <span className="text-gold italic">&amp;</span>{" "}
          {casamento.monograma.b}
        </p>
        <p className="text-xs tracking-[0.28em] text-primary-deep uppercase">
          {casamento.dataCurta} · {casamento.hashtag}
        </p>
      </div>
    </footer>
  );
}
