import { TelaSucesso } from "@/components/interno";
import { lerConvitePublico } from "@/lib/convites-servidor";
import { Concluido } from "./concluido";

export const metadata = { title: "Que alegria! · V & C", robots: { index: false } };

export default async function ConfirmacaoConcluida({ searchParams }: PageProps<"/confirmar/concluido">) {
  const { c } = await searchParams;
  const convite = typeof c === "string" ? await lerConvitePublico(c) : null;

  return (
    <TelaSucesso
      icone={
        <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9C7A45" strokeWidth="1.5">
          <path d="M5 12.5 L10 17 L19 7" />
        </svg>
      }
    >
      <Concluido convite={convite} />
    </TelaSucesso>
  );
}
