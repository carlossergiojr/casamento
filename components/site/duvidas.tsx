import { duvidas } from "@/lib/conteudo";
import { Revelar } from "./revelar";

/**
 * Perguntas frequentes (specs/007): `<details>` nativo, que abre e fecha sem JS e é lido certo
 * pelo leitor de tela.
 */
export function Duvidas() {
  return (
    <section id="duvidas" className="flex flex-col gap-6 px-5 py-16">
      <Revelar>
        <h2 className="text-center font-serif text-[40px] leading-[1.1] text-primary italic">Dúvidas</h2>
      </Revelar>
      <Revelar>
        <div className="flex flex-col border-t border-line/60">
          {duvidas.map((d) => (
            <details key={d.pergunta} className="group border-b border-line/60">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-3 text-[16px] text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary [&::-webkit-details-marker]:hidden">
                {d.pergunta}
                <svg
                  aria-hidden="true"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="flex-none text-primary transition-transform duration-300 group-open:rotate-45 motion-reduce:transition-none"
                >
                  <path d="M8 2 V14 M2 8 H14" />
                </svg>
              </summary>
              <p className="pr-8 pb-4 text-[15px] text-primary-deep">{d.resposta}</p>
            </details>
          ))}
        </div>
      </Revelar>
    </section>
  );
}
