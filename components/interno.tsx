import Link from "next/link";
import { casamento } from "@/lib/conteudo";
import { Revelar } from "@/components/site/revelar";

/** Moldura das telas internas: faixa toile de 56px + nav "Voltar · C & V" (DESIGN.md §1). */
export function TelaInterna({
  voltar,
  rotuloVoltar = "Voltar",
  semFaixa = false,
  children,
}: {
  voltar: string;
  rotuloVoltar?: string;
  semFaixa?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex min-h-dvh max-w-[640px] flex-col bg-background md:border-x md:border-surface">
      {!semFaixa && <div className="toile h-14 border-b border-line" />}
      <nav className="grid h-14 grid-cols-[1fr_auto_1fr] items-center border-b border-surface px-4">
        <Link
          href={voltar}
          className="flex min-h-11 items-center gap-1.5 justify-self-start text-sm text-primary-deep hover:text-foreground"
        >
          <svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M11 3 L5 9 L11 15" />
          </svg>
          {rotuloVoltar}
        </Link>
        <Link href="/" className="font-serif text-xl text-primary">
          {casamento.monograma.a} <span className="text-gold">&amp;</span> {casamento.monograma.b}
        </Link>
        <span />
      </nav>
      {children}
    </div>
  );
}

/** Telas de sucesso: topo toile de 220px e selo redondo com fio dourado. */
export function TelaSucesso({ icone, children }: { icone: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="relative mx-auto flex min-h-dvh max-w-[640px] flex-col overflow-hidden bg-background md:border-x md:border-surface">
      <div className="toile h-[220px] border-b border-line" />
      <main className="flex flex-1 flex-col items-center gap-5 px-7 pt-10 pb-8 text-center">
        <Revelar className="-mt-[68px] flex size-14 items-center justify-center rounded-full border border-gold-line bg-background">
          {icone}
        </Revelar>
        {children}
      </main>
    </div>
  );
}

export const tituloInterno = "font-serif text-[38px] leading-[1.1] text-primary italic";
export const passo = "text-xs tracking-[0.22em] text-primary-deep uppercase";
export const rotuloCampo = "text-[13px] text-primary-deep";
export const campo =
  "h-[50px] w-full rounded-[3px] border border-line bg-card px-3.5 text-base text-foreground placeholder:text-primary-deep/70 focus:border-primary focus:outline-none";
