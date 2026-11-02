import { notFound } from "next/navigation";
import { TelaInterna } from "@/components/interno";
import { formatarValor, presentes } from "@/lib/conteudo";
import { Pagamento } from "./pagamento";

export const metadata = { title: "Pagamento · Lista de presentes" };

export function generateStaticParams() {
  return presentes.map((p) => ({ id: p.id }));
}

export default async function PaginaPagamento({ params }: PageProps<"/presentes/[id]/pagamento">) {
  const { id } = await params;
  const presente = presentes.find((p) => p.id === id);
  if (!presente || presente.presenteado) notFound();

  return (
    <TelaInterna voltar={`/presentes/${id}`} semFaixa>
      <main className="flex flex-1 flex-col gap-6 px-6 pt-7 pb-9">
        <div className="flex items-center justify-between gap-3 rounded-[3px] bg-surface p-4">
          <span className="flex flex-col">
            <span className="text-xs tracking-[0.2em] text-primary-deep uppercase">Seu presente</span>
            <span>{presente.nome}</span>
          </span>
          <span className="font-serif text-[28px] whitespace-nowrap text-gold">{formatarValor(presente.valor)}</span>
        </div>
        <Pagamento id={presente.id} valor={formatarValor(presente.valor)} />
      </main>
    </TelaInterna>
  );
}
