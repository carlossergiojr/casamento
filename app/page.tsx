import { Envelope } from "@/components/envelope";
import { ENVELOPE_LIGADO } from "@/lib/convite-aberto";
import { BarraAtalhos } from "@/components/site/barra-atalhos";
import { Cabecalho, Capa } from "@/components/site/capa";
import { Duvidas } from "@/components/site/duvidas";
import { Galeria } from "@/components/site/galeria";
import { Guia } from "@/components/site/guia";
import { Historia } from "@/components/site/historia";
import { Local, Programacao } from "@/components/site/o-dia";
import { ChamadaRsvp, DressCode, ListaPresentes, Rodape } from "@/components/site/secoes";

export default function Inicio() {
  return (
    <>
      {/* Desligado por enquanto: entra direto na capa (lib/convite-aberto.ts). */}
      {ENVELOPE_LIGADO && <Envelope />}
      {/* Mobile-first: 390px é a referência; no desktop vira uma coluna centralizada. */}
      <div id="site" className="mx-auto max-w-[640px] bg-background md:border-x md:border-surface">
        <Cabecalho />
        <main>
          {/* Primeiro o prático (quando, o que vestir, onde, confirmar, presentear); depois a
              história e as fotos, para quem quer ficar (specs/007). Programação e Traje são o
              par de cartões do convite impresso, juntos no mesmo fundo; a rota também está na capa. */}
          <Capa />
          <Programacao />
          <DressCode />
          <Local />
          <ChamadaRsvp />
          <ListaPresentes />
          <Historia />
          <Galeria />
          <Guia />
          <Duvidas />
        </main>
        <Rodape />
        {/* Dentro do #site: fica inerte enquanto o envelope está na frente (specs/004 D5). */}
        <BarraAtalhos />
      </div>
    </>
  );
}
