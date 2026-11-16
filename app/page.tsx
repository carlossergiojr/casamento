import { Envelope } from "@/components/envelope";
import { ENVELOPE_LIGADO } from "@/lib/convite-aberto";
import { Cabecalho } from "@/components/site/cabecalho";
import { Capa } from "@/components/site/capa";
import { ComoChegar } from "@/components/site/como-chegar";
import { Galeria } from "@/components/site/galeria";
import { Historia } from "@/components/site/historia";
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
          <Capa />
          <Historia />
          <Galeria />
          <DressCode />
          <ListaPresentes />
          <ChamadaRsvp />
          <ComoChegar />
        </main>
        <Rodape />
      </div>
    </>
  );
}
