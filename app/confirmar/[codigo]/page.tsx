import { redirect } from "next/navigation";
import { TelaInterna } from "@/components/interno";
import { prazoEncerrado } from "@/lib/conteudo";
import { lerConvitePublico } from "@/lib/convites-servidor";
import { RespostaConvite } from "./resposta";

export const metadata = { title: "Confirme sua presença · V & C", robots: { index: false } };

/** Qualquer código do banco abre aqui, inclusive os criados depois da publicação (specs/006 FR-006). */
export default async function ConfirmarConvite({ params, searchParams }: PageProps<"/confirmar/[codigo]">) {
  const { codigo } = await params;
  const { de } = await searchParams;
  const lido = decodeURIComponent(codigo);
  const convite = await lerConvitePublico(lido);
  // Código do QR que não existe: a busca diz qual código não achou (não "esse nome").
  if (!convite) redirect(`/confirmar/?codigo=${encodeURIComponent(lido)}`);
  // O QR impresso (`/?id=`, via next.config.ts) e o link copiado em /noivos chegam aqui sem `de`: o convidado vai
  // primeiro para o site, e o "Eu vou!" de lá volta aqui com `?de=site` (lib/meu-convite.ts).
  if (de !== "busca" && de !== "site") redirect(`/?convite=${encodeURIComponent(convite.codigo)}`);
  // Quem chega pela busca está no passo 2 e volta para ela; quem chega pelo site volta para ele.
  const daBusca = de === "busca";

  return (
    <TelaInterna voltar={daBusca ? "/confirmar" : "/"}>
      <RespostaConvite convite={convite} prazoEncerrado={prazoEncerrado()} daBusca={daBusca} />
    </TelaInterna>
  );
}
