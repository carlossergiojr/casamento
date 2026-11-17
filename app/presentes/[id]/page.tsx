import { notFound } from "next/navigation";
import { TelaInterna } from "@/components/interno";
import { FotoPresente } from "@/components/site/foto-presente";
import { formatarValor, idsPresentes, presenteLivre, presentes, publico } from "@/lib/conteudo";
import { lerPresenteados } from "@/lib/mercado-pago";
import { FormPresente } from "./form-presente";

export function generateStaticParams() {
  return idsPresentes();
}

export async function generateMetadata({ params }: PageProps<"/presentes/[id]">) {
  const { id } = await params;
  const nome = id === presenteLivre.id ? presenteLivre.nome : presentes.find((x) => x.id === id)?.nome;
  return { title: nome ? `${nome} · Lista de presentes` : "Lista de presentes" };
}

export default async function DetalhePresente({ params }: PageProps<"/presentes/[id]">) {
  const { id } = await params;

  // Cota livre: o convidado escolhe o valor (specs/007).
  if (id === presenteLivre.id) {
    return (
      <TelaInterna voltar="/presentes/" rotuloVoltar="Presentes" semFaixa>
        <div className="relative flex h-[200px] items-center justify-center bg-surface">
          <img src={publico("/estampa/spot-bird.png")} alt="" aria-hidden="true" className="h-auto w-[120px] -scale-x-100" />
        </div>
        <main className="flex flex-1 flex-col gap-5 px-6 pt-7 pb-9">
          <div className="flex flex-col gap-2">
            <h1 className="font-serif text-[34px] leading-[1.15] text-primary italic">{presenteLivre.nome}</h1>
            <p className="text-[15px] text-primary-deep">{presenteLivre.texto}</p>
          </div>
          <FormPresente id={presenteLivre.id} livre={{ sugestoes: presenteLivre.sugestoes, minimo: presenteLivre.minimo }} />
        </main>
      </TelaInterna>
    );
  }

  const presente = presentes.find((p) => p.id === id);
  // Já pago: a página vira 404 (o webhook revalida, specs/008).
  if (!presente || presente.presenteado || (await lerPresenteados()).has(presente.id)) notFound();

  return (
    <TelaInterna voltar="/presentes/" rotuloVoltar="Presentes" semFaixa>
      <div className="relative h-[280px] bg-surface">
        <FotoPresente presente={presente} priority sizes="(max-width: 640px) 100vw, 640px" />
      </div>
      <main className="flex flex-1 flex-col gap-5 px-6 pt-7 pb-9">
        <div className="flex flex-col gap-1">
          <h1 className="font-serif text-[34px] leading-[1.15] text-primary italic">{presente.nome}</h1>
          <span className="font-serif text-[30px] text-gold lining-nums">{formatarValor(presente.valor)}</span>
        </div>
        <FormPresente id={presente.id} />
      </main>
    </TelaInterna>
  );
}
