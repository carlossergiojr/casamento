import { Fragment } from "react";
import { historia, historiaFecho, publico } from "@/lib/conteudo";
import { Revelar } from "./revelar";

/** "*oi*" no conteúdo vira itálico. */
function comItalico(texto: string) {
  return texto.split("*").map((parte, i) =>
    i % 2 ? <em key={i}>{parte}</em> : <Fragment key={i}>{parte}</Fragment>,
  );
}

// Alternância do DESIGN.md: esquerda, direita com fio, borboleta, esquerda com fio.
const LADOS = [
  "pr-12",
  "pl-12 pr-4 text-right border-r border-gold-line",
  "",
  "pr-12 pl-4 border-l border-gold-line",
];

export function Historia() {
  return (
    <section id="historia" className="relative flex flex-col gap-9 bg-surface px-7 pt-16 pb-[72px]">
      <Revelar className="flex flex-col items-center gap-2.5">
        <img src={publico("/estampa/spot-butterfly-1.png")} alt="" aria-hidden="true" className="h-auto w-[68px]" />
        <h2 className="font-serif text-[40px] text-primary italic">Nossa história</h2>
      </Revelar>

      {historia.map((trecho, i) =>
        trecho.borboleta ? (
          <Revelar key={i} className="flex items-center gap-4">
            <img
              src={publico("/estampa/spot-butterfly-2.png")}
              alt=""
              aria-hidden="true"
              className="h-auto w-[72px] flex-none"
            />
            <p className="font-serif text-[22px] leading-[1.4] text-primary-deep italic">
              {trecho.linhas.map((l) => comItalico(l))}
            </p>
          </Revelar>
        ) : (
          <Revelar key={i} className={`flex flex-col gap-1.5 ${LADOS[i % LADOS.length]}`}>
            <p className="font-serif text-[25px] leading-[1.35]">{comItalico(trecho.linhas[0])}</p>
            {trecho.linhas.slice(1).map((l) => (
              <p key={l} className="text-[15px] text-primary-deep">
                {comItalico(l)}
              </p>
            ))}
          </Revelar>
        ),
      )}

      <Revelar>
        <p className="mt-2 text-center font-serif text-[34px] leading-[1.2] text-gold italic">
          {historiaFecho}
        </p>
      </Revelar>
    </section>
  );
}
