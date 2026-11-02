"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { casamento, publico } from "@/lib/conteudo";
import { CHAVE_CONVITE_ABERTO } from "@/lib/convite-aberto";

type Fase = "fechado" | "abrindo" | "saindo" | "fora";

export function Envelope() {
  const [fase, setFase] = useState<Fase>("fechado");
  const reduzir = useReducedMotion();

  // Trava a rolagem do site enquanto o envelope está na tela.
  useEffect(() => {
    if (document.documentElement.dataset.convite === "aberto") {
      setFase("fora");
      return;
    }
    const html = document.documentElement;
    html.style.overflow = "hidden";
    return () => {
      html.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (fase === "fora") document.documentElement.style.overflow = "";
  }, [fase]);

  function lembrar() {
    try {
      sessionStorage.setItem(CHAVE_CONVITE_ABERTO, "1");
    } catch {
      // Sem storage (aba anônima, bloqueio): o envelope só volta a aparecer.
    }
  }

  function abrir() {
    if (fase !== "fechado") return;
    lembrar();
    if (reduzir) {
      setFase("saindo");
      return;
    }
    setFase("abrindo");
    window.setTimeout(() => setFase("saindo"), 1900);
  }

  function pular() {
    lembrar();
    setFase("saindo");
  }

  const aberto = fase !== "fechado";

  return (
    <AnimatePresence onExitComplete={() => setFase("fora")}>
      {fase !== "fora" && fase !== "saindo" && (
        <motion.div
          key="envelope"
          data-envelope
          role="dialog"
          aria-modal="true"
          aria-label="Convite de casamento"
          className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-10 overflow-hidden bg-background px-6"
          exit={{ opacity: 0, transition: { duration: reduzir ? 0.3 : 0.7 } }}
        >
          <Cantos />

          <motion.p
            className="sobretitulo text-center"
            animate={{ opacity: aberto ? 0 : 1 }}
            transition={{ duration: 0.4 }}
          >
            Você recebeu um convite
          </motion.p>

          <button
            type="button"
            onClick={abrir}
            aria-label="Abrir o convite"
            className="group relative w-[min(340px,86vw)] cursor-pointer outline-none [perspective:1200px] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-8 focus-visible:ring-offset-background"
          >
            <motion.div
              className="relative aspect-[1.45] w-full"
              initial={reduzir ? false : { y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Fundo do envelope: forro com a estampa. */}
              <div className="absolute inset-0 border border-line/60 bg-[#f3eee4]">
                <div className="toile absolute inset-[6px] opacity-90" />
              </div>

              {/* Cartão que sobe de dentro do envelope. */}
              <motion.div
                className="absolute inset-x-[7%] top-[6%] bottom-[4%] flex flex-col items-center justify-center gap-1 border-t border-gold-line bg-card px-4 text-center shadow-[0_1px_3px_rgb(43_49_64/0.12)]"
                style={{ zIndex: 2 }}
                animate={aberto ? { y: "-62%" } : { y: 0 }}
                transition={{ delay: 0.75, duration: 1, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="sobretitulo text-[10px]">Vamos nos casar</span>
                <span className="font-serif text-[30px] leading-none font-light text-primary">
                  {casamento.primeiro}{" "}
                  <span className="text-gold italic">&amp;</span> {casamento.segundo.split(" ")[0]}
                </span>
                <span className="font-serif text-[17px] tracking-[0.1em]">{casamento.dataCapa}</span>
              </motion.div>

              {/* Bolso da frente: laterais e fundo, em V. */}
              <div
                className="absolute inset-0 bg-[#f7f3eb]"
                style={{
                  zIndex: 3,
                  clipPath: "polygon(0 0, 50% 54%, 100% 0, 100% 100%, 0 100%)",
                }}
              />
              <svg
                aria-hidden="true"
                className="absolute inset-0 h-full w-full"
                style={{ zIndex: 3 }}
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 0 L50 54 L100 0"
                  fill="none"
                  stroke="var(--line)"
                  strokeOpacity="0.45"
                  strokeWidth="0.6"
                  vectorEffect="non-scaling-stroke"
                />
                <path
                  d="M0 100 L42 48 M100 100 L58 48"
                  fill="none"
                  stroke="var(--line)"
                  strokeOpacity="0.25"
                  strokeWidth="0.6"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>

              {/* Aba: frente creme, verso com a estampa; gira para cima ao abrir. */}
              <motion.div
                className="absolute inset-x-0 top-0 h-[58%] origin-top [transform-style:preserve-3d]"
                initial={false}
                animate={
                  aberto
                    ? { rotateX: 180, zIndex: 1, transition: { duration: 0.8, ease: "easeInOut", zIndex: { delay: 0.4 } } }
                    : { rotateX: 0, zIndex: 4 }
                }
              >
                <div
                  className="absolute inset-0 bg-[#f4efe5] [backface-visibility:hidden]"
                  style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
                />
                <svg
                  aria-hidden="true"
                  className="absolute inset-0 h-full w-full [backface-visibility:hidden]"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0 0 L50 100 L100 0"
                    fill="none"
                    stroke="var(--line)"
                    strokeOpacity="0.55"
                    strokeWidth="0.6"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
                <div
                  className="toile absolute inset-0 [backface-visibility:hidden] [transform:rotateX(180deg)]"
                  style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
                />
              </motion.div>

              {/* Selo de cera dourado. */}
              <motion.span
                aria-hidden="true"
                className="absolute top-[58%] left-1/2 flex size-[64px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full font-serif text-[20px] text-[#fbf6ea] italic"
                // Sem gradiente (DESIGN.md): cor chapada com um aro mais claro.
                style={{
                  zIndex: 5,
                  background: "var(--gold)",
                  boxShadow: "0 1px 2px rgb(43 49 64 / 0.25), inset 0 0 0 4px #b08e58",
                }}
                animate={aberto ? { opacity: 0, scale: 0.6 } : { opacity: 1, scale: 1 }}
                whileHover={aberto || reduzir ? undefined : { scale: 1.06 }}
                transition={{ duration: 0.35 }}
              >
                {casamento.monograma.a}&amp;{casamento.monograma.b}
              </motion.span>
            </motion.div>
          </button>

          <motion.div
            className="flex flex-col items-center gap-3"
            animate={{ opacity: aberto ? 0 : 1 }}
            transition={{ duration: 0.4 }}
          >
            <button
              type="button"
              onClick={abrir}
              className="botao min-w-[220px] bg-primary text-card hover:bg-primary-deep"
            >
              Abrir o convite
            </button>
            <button
              type="button"
              onClick={pular}
              className="min-h-[44px] px-4 text-[13px] text-primary-deep underline decoration-gold-line underline-offset-4"
            >
              Pular
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Raminhos da estampa nos cantos da tela do envelope. */
function Cantos() {
  return (
    <>
      <img
        src={publico("/estampa/spot-butterfly-1.png")}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute top-[9%] left-[8%] w-12 -rotate-12 opacity-80"
      />
      <img
        src={publico("/estampa/spot-butterfly-2.png")}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute right-[7%] bottom-[10%] w-20 rotate-6 opacity-80"
      />
    </>
  );
}
