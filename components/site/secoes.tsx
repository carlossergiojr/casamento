import Link from "next/link";
import { casamento, presentes } from "@/lib/conteudo";
import { CotaLivre, DestaquesPresentes } from "./presentes";
import { Revelar } from "./revelar";

const TITULO = "font-serif text-[40px] leading-[1.1] text-primary italic";

export function ListaPresentes() {
  return (
    <section id="presentes" className="flex flex-col gap-6 px-5 py-16">
      <Revelar className="flex flex-col items-center gap-2.5 px-2 text-center">
        <h2 className={TITULO}>Lista de presentes</h2>
        <p className="text-[15px] text-primary-deep">
          Escolha um presente e pague aqui mesmo, por Pix ou cartão: a gente compra o item. Dá
          para deixar um recadinho junto.
        </p>
      </Revelar>
      <DestaquesPresentes />
      <Link href="/presentes/" className="botao border border-primary text-primary hover:bg-primary hover:text-card">
        Ver os {presentes.length} presentes
      </Link>
      <CotaLivre />
    </section>
  );
}

export function Rodape() {
  return (
    <footer className="flex flex-col">
      <div className="toile h-40 border-t border-gold-line" />
      <div className="flex flex-col items-center gap-2 px-7 pt-9 pb-12 text-center">
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
