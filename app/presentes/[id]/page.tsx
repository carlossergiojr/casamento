import Image from "next/image";
import { notFound } from "next/navigation";
import { TelaInterna } from "@/components/interno";
import { formatarValor, presentes } from "@/lib/conteudo";
import { FormPresente } from "./form-presente";

export function generateStaticParams() {
  return presentes.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: PageProps<"/presentes/[id]">) {
  const { id } = await params;
  const p = presentes.find((x) => x.id === id);
  return { title: p ? `${p.nome} · Lista de presentes` : "Lista de presentes" };
}

export default async function DetalhePresente({ params }: PageProps<"/presentes/[id]">) {
  const { id } = await params;
  const presente = presentes.find((p) => p.id === id);
  if (!presente || presente.presenteado) notFound();

  return (
    <TelaInterna voltar="/#presentes" rotuloVoltar="Presentes" semFaixa>
      <div className="relative h-[280px] bg-surface">
        <Image src={presente.foto} alt={presente.nome} fill priority sizes="(max-width: 640px) 100vw, 640px" className="object-cover" />
      </div>
      <main className="flex flex-1 flex-col gap-5 px-6 pt-7 pb-9">
        <div className="flex flex-col gap-1">
          <h1 className="font-serif text-[34px] leading-[1.15] text-primary italic">{presente.nome}</h1>
          <span className="font-serif text-[30px] text-gold">{formatarValor(presente.valor)}</span>
        </div>
        <FormPresente id={presente.id} />
      </main>
    </TelaInterna>
  );
}
