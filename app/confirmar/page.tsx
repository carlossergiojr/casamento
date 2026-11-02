import { Suspense } from "react";
import { TelaInterna } from "@/components/interno";
import { BuscaConvite } from "./busca";

export const metadata = { title: "Confirme sua presença · V & C" };

export default function Confirmar() {
  return (
    <TelaInterna voltar="/#rsvp">
      <Suspense>
        <BuscaConvite />
      </Suspense>
    </TelaInterna>
  );
}
