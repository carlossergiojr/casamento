import { Envelope } from "@/components/envelope";
import { ENVELOPE_LIGADO } from "@/lib/convite-aberto";
import { Cabecalho } from "@/components/site/cabecalho";
import { Capa } from "@/components/site/capa";
import { Duvidas } from "@/components/site/duvidas";
import { Galeria } from "@/components/site/galeria";
import { Guia } from "@/components/site/guia";
import { Historia } from "@/components/site/historia";
import { Local, Programacao } from "@/components/site/o-dia";
import { ListaPresentes, Rodape } from "@/components/site/secoes";
import { DressCode } from "@/components/site/traje";

export default function Inicio() {
  return (
    <>
      {/* Desligado por enquanto: entra direto na capa (lib/convite-aberto.ts). */}
      {ENVELOPE_LIGADO && <Envelope />}
      {/* Mobile-first: 390px é a referência; no desktop vira uma coluna centralizada. */}
      <div id="site" className="mx-auto max-w-[640px] bg-background md:border-x md:border-surface">
        <Cabecalho />
        <main>
          {/* Primeiro o prático (quando, o que vestir, onde, presentear; confirmar fica no botão da capa e no menu); depois a
              história e as fotos, para quem quer ficar (specs/007). Programação e Traje são o
              par de cartões do convite impresso, juntos no mesmo fundo; a rota também está na capa. */}
          <Capa />
          <Programacao />
          <DressCode />
          <Local />
          <ListaPresentes />
          <Historia />
          <Galeria />
          <Guia />
          <Duvidas />
        </main>
        <Rodape />
      </div>
    </>
  );
}
