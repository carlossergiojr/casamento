import type { Metadata } from "next";
import { TelaInterna, tituloInterno } from "@/components/interno";
import { CotaLivre, EtiquetasEmBreve, ListaCompletaPresentes } from "@/components/site/presentes";
import { avisoPresentesEmBreve, presentesAbertos } from "@/lib/conteudo";
import { lerPresenteados } from "@/lib/mercado-pago";

export const metadata: Metadata = { title: "Lista de presentes" };

/** Lista completa (na página inicial ficam só os destaques). */
export default async function PaginaPresentes() {
  if (!presentesAbertos) {
    return (
      <TelaInterna voltar="/#presentes" rotuloVoltar="Início">
        <main className="flex flex-1 flex-col gap-5 px-5 pt-8 pb-12">
          <div className="flex flex-col gap-2.5 px-1">
            <h1 className={tituloInterno}>Lista de presentes</h1>
            <p className="text-[15px] text-primary-deep">{avisoPresentesEmBreve}</p>
          </div>
          <EtiquetasEmBreve />
        </main>
      </TelaInterna>
    );
  }
  const presenteados = [...(await lerPresenteados())];
  return (
    <TelaInterna voltar="/#presentes" rotuloVoltar="Início">
      <main className="flex flex-1 flex-col gap-5 px-5 pt-8 pb-12">
        <div className="flex flex-col gap-2.5 px-1">
          <h1 className={tituloInterno}>Lista de presentes</h1>
          <p className="text-[15px] text-primary-deep">
            Escolha um presente e pague por Pix ou cartão: o valor chega até nós e a gente compra o
            item. Dá para deixar um recadinho junto.
          </p>
        </div>
        <CotaLivre />
        <ListaCompletaPresentes presenteados={presenteados} />
      </main>
    </TelaInterna>
  );
}
