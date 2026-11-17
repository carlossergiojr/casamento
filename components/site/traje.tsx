"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { dressCode, publico } from "@/lib/conteudo";
import { useReduzir } from "@/lib/use-reduzir";
import { balanco, IconeDica, RoupaNoCabide, ventoTransicao } from "./desenhos-traje";
import { Moldura } from "./moldura";
import { Revelar } from "./revelar";

/** Retalho de 40×40 com a borda picotada (tesoura de picotar): dentes de 4px, 2,2px para fora. */
const PICOTADO = (() => {
  const s = 40;
  const n = 10;
  const a = 2.2;
  const pts: string[] = [];
  const lado = (x0: number, y0: number, dx: number, dy: number, nx: number, ny: number) => {
    for (let i = 0; i < n; i++) {
      pts.push(`${x0 + (dx * i * s) / n} ${y0 + (dy * i * s) / n}`);
      pts.push(`${(x0 + (dx * (i + 0.5) * s) / n + nx * a).toFixed(1)} ${(y0 + (dy * (i + 0.5) * s) / n + ny * a).toFixed(1)}`);
    }
  };
  lado(0, 0, 1, 0, 0, -1);
  lado(s, 0, 0, 1, 1, 0);
  lado(s, s, -1, 0, 0, 1);
  lado(0, s, 0, -1, -1, 0);
  return `M${pts.join(" L")} Z`;
})();

/** Ângulo de cada retalho no alfinete, para não ficarem alinhados demais. */
const GIROS = [-6, 4, -3, 7, -5, 3];

/** Recadinhos: [x, y, alinhamento] da 1ª linha de cada nota, e a setinha (traço + ponta). */
const NOTAS: { x: number; y: number; fim?: boolean; seta: [string, string] }[][] = [
  [
    { x: 6, y: 16, seta: ["M44 34 C 30 48 34 70 56 86", "M50 78 L56 86 L46 87"] },
    { x: 4, y: 232, seta: ["M34 214 C 30 196 38 186 60 182", "M52 178 L60 182 L53 188"] },
  ],
  [
    { x: 318, y: 16, fim: true, seta: ["M296 40 C 306 56 296 72 266 78", "M274 72 L266 78 L274 83"] },
    { x: 318, y: 216, fim: true, seta: ["M300 200 C 304 186 292 170 262 166", "M268 160 L262 166 L269 171"] },
  ],
];

/**
 * Cartão "Traje", irmão da Programação (specs/007), em versão "caderno da costureira": as roupas
 * no cabide com recadinhos e setinhas à mão, as cores a evitar como retalhos presos com alfinete
 * e as dicas de verão em ícones. Um vento leve passa pelo cartão enquanto ele está na tela
 * (nada se mexe com "Reduzir movimento").
 */
export function DressCode() {
  const reduzir = useReduzir();
  const ref = useRef<HTMLElement>(null);
  const naTela = useInView(ref, { margin: "0px 0px -10% 0px" });
  const vento = naTela && !reduzir;
  let indice = 0;

  return (
    <section ref={ref} id="dresscode" aria-label="Traje" className="bg-surface px-3.5 pt-4 pb-14">
      <Revelar>
        <Moldura className="flex flex-col items-center gap-[18px] px-5 pt-9 pb-8 text-center">
          {/* Borboleta da estampa pousada no canto, batendo as asas de vez em quando. */}
          <motion.img
            src={publico("/estampa/spot-butterfly-1.png")}
            alt=""
            aria-hidden="true"
            className="absolute top-[22px] right-6 h-auto w-11"
            animate={vento ? { scaleX: [1, 1, 0.45, 1, 0.55, 1, 1], y: [0, 0, -2, 0, -1, 0, 0] } : { scaleX: 1, y: 0 }}
            transition={
              vento
                ? { duration: 5.5, times: [0, 0.55, 0.6, 0.66, 0.71, 0.77, 1], repeat: Infinity, delay: 1.2 }
                : { duration: 0.4 }
            }
          />

          <div className="flex flex-col items-center gap-1.5">
            <h2 className="-mb-1 font-script text-[50px] leading-none font-normal text-marinho">Traje</h2>
            <p className="pl-[0.34em] font-serif text-[15px] tracking-[0.34em] text-marinho uppercase">
              {dressCode.traje}
            </p>
          </div>

          {/* As roupas com os recadinhos. O desenho é decorativo; o texto vai na lista escondida. */}
          <svg viewBox="0 0 322 270" aria-hidden="true" className="-mt-2 block h-auto w-full overflow-visible">
            <g fill="none" stroke="var(--marinho)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" className="text-marinho">
              {dressCode.trajes.map(({ desenho }, i) => (
                <RoupaNoCabide key={desenho} nome={desenho} x={58 + i * 120} y={34} escala={1.15} vento={vento} atraso={i * 0.3} />
              ))}
            </g>
            <g fill="none" stroke="var(--primary-deep)" strokeWidth={1.1} strokeLinecap="round">
              {NOTAS.flat().map(({ seta }) => seta.map((d) => <path key={d} d={d} />))}
            </g>
            <g fill="var(--primary-deep)" fontSize={15} fontStyle="italic" className="font-serif">
              {dressCode.trajes.map(({ notas }, i) =>
                notas.map((linhas, j) => {
                  const { x, y, fim } = NOTAS[i][j];
                  return (
                    <text key={`${i}-${j}`} x={x} y={y} textAnchor={fim ? "end" : "start"}>
                      {linhas.map((l, k) => (
                        <tspan key={l} x={x} dy={k === 0 ? 0 : 15}>
                          {l}
                        </tspan>
                      ))}
                    </text>
                  );
                }),
              )}
            </g>
            <g fill="var(--marinho)" fontSize={18} fontStyle="italic" textAnchor="middle" className="font-serif">
              {dressCode.trajes.map(({ desenho, legenda, detalhe }, i) => (
                <text key={desenho} x={104 + i * 120} y={264}>
                  {legenda}
                  {detalhe && (
                    <tspan fontSize={15} fill="var(--primary-deep)">
                      {" "}
                      {detalhe}
                    </tspan>
                  )}
                </text>
              ))}
            </g>
          </svg>
          <ul className="sr-only">
            {dressCode.trajes.map(({ legenda, detalhe, notas }) => (
              <li key={legenda}>
                {legenda} {detalhe}: {notas.map((n) => n.join(" ")).join("; ")}
              </li>
            ))}
          </ul>

          <p className="-mb-1 font-serif text-lg font-medium text-marinho">{dressCode.pedido}</p>
          <div className="flex flex-wrap justify-center gap-x-[22px] gap-y-4">
            {dressCode.evitar.map(({ grupo, cores }) => (
              <div key={grupo} className="flex flex-col items-center gap-2">
                <p className="text-xs font-semibold tracking-[0.14em] text-primary-deep uppercase">{grupo}</p>
                {/* Nome embaixo de cada retalho: no celular não tem "passar o mouse". */}
                <ul className="flex gap-1">
                  {cores.map(({ nome, cor }) => {
                    const i = indice++;
                    const giro = GIROS[i % GIROS.length];
                    return (
                      <li key={nome} className="flex w-[50px] flex-col items-center gap-0.5">
                        <svg viewBox="-8 -12 56 54" aria-hidden="true" className="w-[52px] overflow-visible">
                          {/* O retalho balança pendurado no alfinete (perto do topo). */}
                          <motion.g
                            style={{ originX: 0.5, originY: 0.12 }}
                            initial={{ rotate: giro }}
                            animate={{ rotate: vento ? balanco(giro, 4) : giro }}
                            transition={vento ? ventoTransicao(0.9 + i * 0.09) : { duration: 0.8 }}
                          >
                            <path d={PICOTADO} fill={cor} stroke="var(--line)" strokeWidth={0.8} />
                            {/* X de "evite", feito à mão. */}
                            <g fill="none" stroke="var(--marinho)" strokeWidth={1.5} strokeLinecap="round">
                              <path d="M9 10 C 16 18 24 24 31 31" />
                              <path d="M31 9 C 25 15 17 23 10 30" />
                            </g>
                          </motion.g>
                          <path d="M20 -6 L 22 6" stroke="var(--primary-deep)" strokeWidth={1} strokeLinecap="round" />
                          <circle cx="19.7" cy="-7" r="3" fill="var(--gold-line)" stroke="var(--gold-text-sm)" strokeWidth={0.7} />
                        </svg>
                        <span className="text-center font-serif text-sm leading-tight text-foreground italic">{nome}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>

          {/* Divisor ondulado e o título das dicas sublinhado à mão. */}
          <svg viewBox="0 0 240 10" aria-hidden="true" className="mt-1 block w-[70%]">
            <path d="M2 6 C 40 3 80 8 120 5 S 200 3 238 6" fill="none" stroke="var(--line)" strokeWidth={1} strokeLinecap="round" />
          </svg>
          <p className="relative -mt-1 font-serif text-lg font-medium text-marinho">
            {dressCode.dicasTitulo}
            <svg viewBox="0 0 200 10" aria-hidden="true" preserveAspectRatio="none" className="absolute -inset-x-1 -bottom-2 h-2.5 w-[calc(100%+8px)]">
              <path d="M3 5 C 50 8 120 2 197 6" fill="none" stroke="var(--gold-line)" strokeWidth={1.6} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
            </svg>
          </p>
          <ul className="mt-1 grid w-full grid-cols-3 gap-2">
            {dressCode.dicas.map(({ icone, texto }) => (
              <li key={icone} className="flex flex-col items-center gap-1.5 text-[13px] leading-tight text-foreground">
                <IconeDica nome={icone} className="size-[34px] text-marinho" />
                {texto}
              </li>
            ))}
          </ul>
        </Moldura>
      </Revelar>
    </section>
  );
}
