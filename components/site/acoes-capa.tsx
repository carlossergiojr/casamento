"use client";

import { MapPin } from "lucide-react";
import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { prazoEncerrado } from "@/lib/conteudo";
import { useHrefConfirmar } from "@/lib/meu-convite";
import { ComoChegar } from "./como-chegar";

const nada = () => () => {};

/**
 * Os dois botões da capa (specs/007): "Eu vou!" e "Como chegar" (abre a gaveta da rota).
 * Até o fim do RSVP o "Eu vou!" é o botão cheio; depois, a rota é que fica em destaque, porque no
 * dia o convidado abre o site para chegar. A data é lida no aparelho (o site é estático); no
 * servidor vale "antes do prazo", sem erro de hidratação.
 */
export function AcoesCapa() {
  const [rota, setRota] = useState(false);
  const depois = useSyncExternalStore(nada, () => prazoEncerrado(), () => false);
  const hrefConfirmar = useHrefConfirmar();

  const BASE = "botao flex-1 gap-1.5 px-2 tracking-[0.08em] whitespace-nowrap";
  const CHEIO = `${BASE} bg-primary text-card hover:bg-primary-deep`;
  const CONTORNO = `${BASE} border border-primary bg-transparent text-primary hover:bg-surface`;

  const confirmar = (
    <Link key="confirmar" href={hrefConfirmar} className={depois ? CONTORNO : CHEIO}>
      {depois ? "Minha resposta" : "Eu vou!"}
    </Link>
  );
  const chegar = (
    <button key="chegar" type="button" onClick={() => setRota(true)} className={depois ? CHEIO : CONTORNO}>
      <MapPin aria-hidden="true" className="size-[18px]" strokeWidth={1.6} />
      Como chegar
    </button>
  );

  return (
    <div className="flex w-full gap-2.5">
      {/* O botão em destaque vem primeiro. */}
      {depois ? [chegar, confirmar] : [confirmar, chegar]}
      <ComoChegar aberto={rota} mudar={setRota} />
    </div>
  );
}
