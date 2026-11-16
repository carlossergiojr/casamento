import type { Metadata } from "next";
import { TelaInterna } from "@/components/interno";
import { lerDadosNoivos } from "@/lib/noivos-servidor";
import { sessaoValida } from "@/lib/sessao";
import { AreaNoivos } from "./area";
import { Entrar } from "./entrar";

// Fora dos buscadores e sem link no site: é só dos noivos (constituição, "o que for só dos noivos").
export const metadata: Metadata = {
  title: "Área dos noivos · V & C",
  robots: { index: false, follow: false },
};

/** Sem sessão, só a senha: nenhum dado dos noivos sai do servidor (specs/006 SC-004). */
export default async function Noivos() {
  const conectado = await sessaoValida();
  return (
    <TelaInterna voltar="/" rotuloVoltar="Site">
      {conectado ? <AreaNoivos dados={await lerDadosNoivos()} /> : <Entrar />}
    </TelaInterna>
  );
}
