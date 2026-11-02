import Image from "next/image";
import Link from "next/link";
import { casamento, dressCode, formatarValor, presentes, publico } from "@/lib/conteudo";
import { Revelar } from "./revelar";

const TITULO = "font-serif text-[40px] leading-[1.1] text-primary italic";

export function DressCode() {
  return (
    <section
      id="dresscode"
      className="relative flex flex-col items-center gap-[22px] bg-surface px-7 py-16 text-center"
    >
      <img
        src={publico("/estampa/spot-butterfly-1.png")}
        alt=""
        aria-hidden="true"
        className="absolute top-7 left-[22px] h-auto w-14 -rotate-[18deg]"
      />
      <Revelar className="flex flex-col items-center gap-[22px]">
        <h2 className={TITULO}>Dress code</h2>
        <p className="text-xs tracking-[0.24em] text-primary-deep uppercase">{dressCode.traje}</p>
        <p className="text-[15px]">{dressCode.texto}</p>
        <div className="flex flex-col items-center gap-3">
          <p className="text-xs tracking-[0.2em] text-primary-deep uppercase">Cores sugeridas</p>
          <div className="flex gap-3.5">
            {dressCode.cores.map((cor) => (
              <span
                key={cor}
                title={cor}
                className="size-11 rounded-full border border-primary-deep/40"
                style={{ background: cor }}
              />
            ))}
          </div>
        </div>
      </Revelar>
      <Revelar className="flex w-full flex-col gap-1.5 border-t border-gold-line pt-[18px]">
        <p className="text-xs tracking-[0.2em] text-primary-deep uppercase">Evite</p>
        <p className="text-[15px]">{dressCode.evite}</p>
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
          Escolha um presente e pague aqui mesmo, por Pix ou cartão. Dá para deixar um recadinho
          junto.
        </p>
      </Revelar>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {presentes.map((p, i) => (
          <Revelar
            key={p.id}
            atraso={(i % 2) * 0.08}
            className="flex flex-col rounded-[3px] border border-surface bg-card"
          >
            <div className="relative h-[130px] bg-surface">
              <Image
                src={p.foto}
                alt={p.nome}
                fill
                sizes="(max-width: 768px) 45vw, 200px"
                className={`object-cover ${p.presenteado ? "opacity-60 grayscale-[40%]" : ""}`}
              />
            </div>
            <div className="flex flex-1 flex-col gap-1 p-3">
              <span className="text-sm leading-[1.35]">{p.nome}</span>
              <span className="font-serif text-2xl text-gold">{formatarValor(p.valor)}</span>
              <div className="mt-auto pt-1.5">
                {p.presenteado ? (
                  <span className="block rounded-[3px] border border-gold-line px-1.5 py-[11px] text-center text-xs font-semibold tracking-[0.12em] text-gold-text-sm uppercase">
                    Presenteado ✓
                  </span>
                ) : (
                  <Link
                    href={`/presentes/${p.id}`}
                    className="block rounded-[3px] border border-primary px-1.5 py-[11px] text-center text-xs font-semibold tracking-[0.12em] text-primary uppercase transition-colors hover:bg-primary hover:text-card"
                  >
                    Presentear
                  </Link>
                )}
              </div>
            </div>
          </Revelar>
        ))}
      </div>
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
            Buscar meu convite
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
      <div className="flex flex-col items-center gap-2 px-7 pt-9 pb-11 text-center">
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
