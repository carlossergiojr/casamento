import { Envelope } from "@/components/envelope";
import { Cabecalho, Capa } from "@/components/site/capa";
import { ComoChegar } from "@/components/site/como-chegar";
import { Galeria } from "@/components/site/galeria";
import { Historia } from "@/components/site/historia";
import { ChamadaRsvp, DressCode, ListaPresentes, Rodape } from "@/components/site/secoes";

export default function Inicio() {
  return (
    <>
      <Envelope />
      {/* Mobile-first: 390px é a referência; no desktop vira uma coluna centralizada. */}
      <div className="mx-auto max-w-[640px] bg-background md:border-x md:border-surface">
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
