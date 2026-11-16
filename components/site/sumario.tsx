"use client";

import { Fragment, type MouseEvent } from "react";
import { useReducedMotion } from "motion/react";
import { Revelar } from "./revelar";

// Na ordem da página. "Confirmar" fica de fora: o "Eu vou!" está logo acima.
const ITENS = [
  { id: "historia", rotulo: "Nossa história" },
  { id: "dresscode", rotulo: "Dress code" },
  { id: "presentes", rotulo: "Presentes" },
  { id: "local", rotulo: "Como chegar" },
];

/** Sumário do convite, logo abaixo da capa: leva direto à seção, como um índice impresso. */
export function Sumario() {
  const reduzir = useReducedMotion();

  // Rola sem pôr "#secao" no endereço: senão o link copiado ou reaberto cai direto nela, por
  // trás do envelope (o href fica para quem está sem JS).
  const ir = (evento: MouseEvent<HTMLAnchorElement>, id: string) => {
    const secao = document.getElementById(id);
    if (!secao) return;
    evento.preventDefault();
    secao.scrollIntoView({ behavior: reduzir ? "auto" : "smooth" });
  };

  return (
    <nav aria-labelledby="sumario-titulo" className="px-[36px] pb-14">
      <Revelar className="flex flex-col items-center gap-3 border-t border-gold-line pt-9 text-center">
        <p id="sumario-titulo" className="sobretitulo">
          Neste convite
        </p>
        <ul className="flex flex-col items-center">
          {ITENS.map(({ id, rotulo }, i) => (
            <Fragment key={id}>
              {i > 0 && (
                <li aria-hidden="true" className="size-1 rotate-45 bg-gold-line" />
              )}
              <li>
                <a
                  href={`#${id}`}
                  onClick={(evento) => ir(evento, id)}
                  className="flex min-h-12 items-center px-4 font-serif text-[26px] text-primary italic transition-colors duration-200 hover:text-gold-text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  {rotulo}
                </a>
              </li>
            </Fragment>
          ))}
        </ul>
      </Revelar>
    </nav>
  );
}
