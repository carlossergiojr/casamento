import { redirect } from "next/navigation";
import { TelaInterna } from "@/components/interno";
import { prazoEncerrado } from "@/lib/conteudo";
import { lerConvitePublico } from "@/lib/convites-servidor";
import { RespostaConvite } from "./resposta";

export const metadata = { title: "Confirme sua presença · V & C", robots: { index: false } };

/** Qualquer código do banco abre aqui, inclusive os criados depois da publicação (specs/006 FR-006). */
export default async function ConfirmarConvite({ params }: PageProps<"/confirmar/[codigo]">) {
  const { codigo } = await params;
  const convite = await lerConvitePublico(decodeURIComponent(codigo));
  if (!convite) redirect("/confirmar/?naoEncontrado=1");

  return (
    <TelaInterna voltar="/confirmar">
      <RespostaConvite convite={convite} prazoEncerrado={prazoEncerrado()} />
    </TelaInterna>
  );
}
