import { notFound } from "next/navigation";
import { TelaSucesso } from "@/components/interno";
import { formatarValor, presentes } from "@/lib/conteudo";
import { Obrigado } from "./obrigado";

export const metadata = { title: "Muito obrigado! · V & C" };

export function generateStaticParams() {
  return presentes.map((p) => ({ id: p.id }));
}

export default async function PaginaObrigado({ params }: PageProps<"/presentes/[id]/obrigado">) {
  const { id } = await params;
  const presente = presentes.find((p) => p.id === id);
  if (!presente) notFound();

  return (
    <TelaSucesso
      icone={
        <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9C7A45" strokeWidth="1.5">
          <path d="M12 20 C6 16 3 12.5 3 9 C3 6.5 5 4.5 7.5 4.5 C9.5 4.5 11 5.6 12 7.2 C13 5.6 14.5 4.5 16.5 4.5 C19 4.5 21 6.5 21 9 C21 12.5 18 16 12 20 Z" />
        </svg>
      }
    >
      <Obrigado id={presente.id} nome={presente.nome} valor={formatarValor(presente.valor)} />
    </TelaSucesso>
  );
}
