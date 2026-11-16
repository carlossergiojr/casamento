import type { Metadata } from "next";
import { TelaInterna } from "@/components/interno";
import { AreaNoivos } from "./area";

// Fora dos buscadores e sem link no site: é só dos noivos (constituição, "o que for só dos noivos").
export const metadata: Metadata = {
  title: "Área dos noivos · V & C",
  robots: { index: false, follow: false },
};

export default function Noivos() {
  return (
    <TelaInterna voltar="/" rotuloVoltar="Site">
      <AreaNoivos />
    </TelaInterna>
  );
}
