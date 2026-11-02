import { notFound } from "next/navigation";
import { TelaInterna } from "@/components/interno";
import { convitesExemplo } from "@/lib/conteudo";
import { RespostaConvite } from "./resposta";

export const metadata = { title: "Confirme sua presença · V & C" };

export function generateStaticParams() {
  return convitesExemplo.map((c) => ({ codigo: c.codigo }));
}

export default async function ConfirmarConvite({ params }: PageProps<"/confirmar/[codigo]">) {
  const { codigo } = await params;
  const convite = convitesExemplo.find((c) => c.codigo === codigo);
  if (!convite) notFound();

  return (
    <TelaInterna voltar="/confirmar">
      <RespostaConvite convite={convite} />
    </TelaInterna>
  );
}
