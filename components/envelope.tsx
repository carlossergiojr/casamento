"use client";

import { useEffect, useState } from "react";
import { motion, useAnimate, useReducedMotion } from "motion/react";
import { casamento, publico } from "@/lib/conteudo";
import { CHAVE_CONVITE_ABERTO, EVENTO_CONVITE_ABERTO } from "@/lib/convite-aberto";

type Fase = "fechado" | "abrindo" | "fora";

const SUAVE = [0.22, 1, 0.36, 1] as const;
const DOBRA = [0.65, 0, 0.35, 1] as const;

/**
 * Abertura do convite (specs/001 US1). O envelope inteiro é o botão. Sequência ao tocar:
 * selo se parte → aba abre → borboletas saem voando → cartão sobe → envelope desce e o
 * cartão cresce até virar o site. Com `prefers-reduced-motion`, só um fade.
 */
export function Envelope() {
  const [fase, setFase] = useState<Fase>("fechado");
  const reduzir = useReducedMotion();
  const [cena, animar] = useAnimate<HTMLDivElement>();

  // Enquanto o envelope está na tela, ele é um diálogo modal: o site por trás não rola nem
  // recebe foco (specs/002 FR-010).
  useEffect(() => {
    const html = document.documentElement;
    if (html.dataset.convite === "aberto") {
      setFase("fora");
      return;
    }
    const site = document.getElementById("site");
    html.style.overflow = "hidden";
    site?.setAttribute("inert", "");
    return () => {
      html.style.overflow = "";
      site?.removeAttribute("inert");
    };
  }, []);

  // Saiu da frente: libera o site e avisa a capa para entrar (specs/002 FR-004).
  useEffect(() => {
    if (fase !== "fora") return;
    const html = document.documentElement;
    html.style.overflow = "";
    document.getElementById("site")?.removeAttribute("inert");
    if (html.dataset.convite !== "aberto") {
      html.dataset.convite = "aberto";
      window.dispatchEvent(new Event(EVENTO_CONVITE_ABERTO));
    }
  }, [fase]);

  function lembrar() {
    try {
      sessionStorage.setItem(CHAVE_CONVITE_ABERTO, "1");
    } catch {
      // Sem storage (aba anônima, bloqueio): o envelope só volta a aparecer.
    }
  }

  async function abrir() {
    if (fase !== "fechado") return;
    lembrar();
    setFase("abrindo");

    if (reduzir) {
      await animar(cena.current, { opacity: 0 }, { duration: 0.4 });
      setFase("fora");
      return;
    }

    animar("[data-dica]", { opacity: 0 }, { duration: 0.3 });

    // 1. O selo afunda com o toque e se parte em duas metades que caem.
    await animar("[data-selo]", { scale: [1, 0.9, 1.06] }, { duration: 0.28 });
    animar("[data-selo-inteiro]", { opacity: 0 }, { duration: 0 });
    animar("[data-selo-esq]", { x: -46, y: 70, rotate: -38, opacity: 0 }, { duration: 0.7, ease: "easeIn" });
    animar("[data-selo-dir]", { x: 46, y: 64, rotate: 34, opacity: 0 }, { duration: 0.7, ease: "easeIn" });

    // 2. A aba gira para cima; passa para trás do cartão na metade do giro.
    animar("[data-aba]", { rotateX: 180 }, { duration: 0.8, ease: DOBRA });
    animar("[data-aba]", { zIndex: 1 }, { delay: 0.4, duration: 0 });

    // 3. O cartão sobe de dentro do envelope.
    await animar("[data-cartao]", { y: "-58%" }, { delay: 0.55, duration: 0.95, ease: SUAVE });

    // 4. O envelope desce e some; o cartão vem para a frente e cresce.
    animar("[data-corpo], [data-aba]", { y: 160, opacity: 0 }, { duration: 0.75, ease: "easeIn" });
    animar("[data-cantos]", { opacity: 0 }, { duration: 0.6 });
    await animar("[data-cartao]", { y: "-10%", scale: 1.22 }, { duration: 0.85, ease: SUAVE });

    // 5. A tela do convite se desfaz no site.
    await animar(cena.current, { opacity: 0 }, { duration: 0.6, ease: "easeOut" });
    setFase("fora");
  }

  if (fase === "fora") return null;
  const fechado = fase === "fechado";

  return (
    <div
      ref={cena}
      data-envelope
      role="dialog"
      aria-modal="true"
      aria-label="Convite de casamento"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-9 overflow-hidden bg-background px-6"
    >
      <Cantos />

      <p data-dica className="sobretitulo text-center">
        Você recebeu um convite
      </p>

      <motion.button
        type="button"
        onClick={abrir}
        disabled={!fechado}
        aria-label="Abrir o convite"
        className="relative w-[min(340px,86vw)] cursor-pointer rounded-[3px] outline-none [perspective:1200px] [-webkit-tap-highlight-color:transparent] touch-manipulation focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-8 focus-visible:ring-offset-background disabled:cursor-default"
        initial={reduzir ? false : { y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: SUAVE }}
        whileHover={fechado && !reduzir ? { rotate: -1.2, scale: 1.015 } : undefined}
        whileTap={fechado && !reduzir ? { scale: 0.985 } : undefined}
      >
        {/* Flutua de leve enquanto espera o toque. */}
        <motion.div
          className="relative aspect-[1.45] w-full"
          animate={fechado && !reduzir ? { y: [0, -7, 0] } : { y: 0 }}
          transition={fechado ? { duration: 3.6, repeat: Infinity, ease: "easeInOut" } : { duration: 0.3 }}
        >
          {/* Fundo do envelope: forro com a estampa. */}
          <div data-corpo className="absolute inset-0 border border-line/60 bg-[#f3eee4]">
            <div className="toile absolute inset-[6px] opacity-90" />
          </div>

          {/* Cartão que sobe de dentro do envelope. */}
          <div
            data-cartao
            className="absolute inset-x-[7%] top-[6%] bottom-[4%] flex flex-col items-center justify-center gap-1 border-t border-gold-line bg-card px-4 text-center shadow-[0_1px_3px_rgb(43_49_64/0.12)]"
            style={{ zIndex: 2 }}
          >
            <span className="sobretitulo text-[10px]">Vamos nos casar</span>
            <span className="font-serif text-[clamp(22px,8vw,30px)] leading-none font-light whitespace-nowrap text-primary">
              {casamento.primeiro} <span className="text-gold italic">&amp;</span>{" "}
              {casamento.segundo.split(" ")[0]}
            </span>
            <span className="font-serif text-[17px] tracking-[0.1em]">{casamento.dataCapa}</span>
          </div>

          {/* Bolso da frente: laterais e fundo, em V. */}
          <div data-corpo className="absolute inset-0" style={{ zIndex: 3 }}>
            <div
              className="absolute inset-0 bg-[#f7f3eb]"
              style={{ clipPath: "polygon(0 0, 50% 54%, 100% 0, 100% 100%, 0 100%)" }}
            />
            <svg aria-hidden="true" className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0 0 L50 54 L100 0" fill="none" stroke="var(--line)" strokeOpacity="0.45" strokeWidth="0.6" vectorEffect="non-scaling-stroke" />
              <path d="M0 100 L42 48 M100 100 L58 48" fill="none" stroke="var(--line)" strokeOpacity="0.25" strokeWidth="0.6" vectorEffect="non-scaling-stroke" />
            </svg>
          </div>

          {/* Aba: frente creme, verso com a estampa; gira para cima ao abrir. */}
          <div
            data-aba
            className="absolute inset-x-0 top-0 h-[58%] origin-top [transform-style:preserve-3d]"
            style={{ zIndex: 4 }}
          >
            <div
              className="absolute inset-0 bg-[#f4efe5] [backface-visibility:hidden]"
              style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
            />
            <svg aria-hidden="true" className="absolute inset-0 h-full w-full [backface-visibility:hidden]" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0 0 L50 100 L100 0" fill="none" stroke="var(--line)" strokeOpacity="0.55" strokeWidth="0.6" vectorEffect="non-scaling-stroke" />
            </svg>
            <div
              className="toile absolute inset-0 [backface-visibility:hidden] [transform:rotateX(180deg)]"
              style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
            />
          </div>

          {/* Selo de cera em duas metades, para se partir ao abrir. */}
          <div
            data-selo
            aria-hidden="true"
            className="absolute top-[58%] left-1/2 size-[64px] -translate-x-1/2 -translate-y-1/2"
            style={{ zIndex: 5 }}
          >
            {/* Selo inteiro por baixo: esconde a emenda das metades até o selo partir. */}
            <span data-selo-inteiro className="absolute inset-0 rounded-full" style={estiloSelo} />
            <MeioSelo lado="esq" />
            <MeioSelo lado="dir" />
          </div>

          {fase === "abrindo" && !reduzir && <Borboletas />}
        </motion.div>
      </motion.button>

      <motion.p
        className="min-h-11 text-[13px] tracking-[0.08em] text-primary-deep"
        animate={!fechado ? { opacity: 0 } : reduzir ? undefined : { opacity: [0.45, 1, 0.45] }}
        transition={
          fechado
            ? { duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 1 }
            : { duration: 0.3 }
        }
      >
        Toque no envelope para abrir
      </motion.p>
    </div>
  );
}

// Sem gradiente (DESIGN.md): cor chapada com um aro mais claro.
const estiloSelo = { background: "var(--gold)", boxShadow: "inset 0 0 0 4px #b08e58" };

/** Metade do selo: o selo inteiro recortado à esquerda ou à direita, com um leve corte irregular. */
function MeioSelo({ lado }: { lado: "esq" | "dir" }) {
  const recorte =
    lado === "esq"
      ? "polygon(0 0, 52% 0, 46% 30%, 55% 55%, 47% 78%, 51% 100%, 0 100%)"
      : "polygon(52% 0, 100% 0, 100% 100%, 51% 100%, 47% 78%, 55% 55%, 46% 30%)";
  return (
    <span
      data-selo-esq={lado === "esq" ? "" : undefined}
      data-selo-dir={lado === "dir" ? "" : undefined}
      className="absolute inset-0 flex items-center justify-center rounded-full font-serif text-[20px] text-[#fbf6ea] italic"
      style={{ ...estiloSelo, clipPath: recorte }}
    >
      {casamento.monograma.a}&amp;{casamento.monograma.b}
    </span>
  );
}

/** Borboletas da estampa que escapam do envelope aberto, batendo as asas. */
const VOOS = [
  { img: "spot-butterfly-1.png", tam: 46, atraso: 0.75, x: [0, -40, -120, -190], y: [0, -110, -230, -420], giro: [-8, -18, -4, -22] },
  { img: "spot-butterfly-2.png", tam: 70, atraso: 0.9, x: [0, 50, 110, 210], y: [0, -90, -260, -400], giro: [6, 14, 2, 18] },
  { img: "spot-butterfly-1.png", tam: 34, atraso: 1.1, x: [0, 10, -30, 40], y: [0, -130, -280, -460], giro: [10, -6, 12, -4] },
];

function Borboletas() {
  return (
    <>
      {VOOS.map((v, i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          className="pointer-events-none absolute top-[30%] left-1/2"
          style={{ zIndex: 6, width: v.tam, marginLeft: -v.tam / 2 }}
          initial={{ opacity: 0, x: 0, y: 0, scale: 0.6 }}
          animate={{ opacity: [0, 1, 1, 0], x: v.x, y: v.y, rotate: v.giro, scale: [0.6, 1, 1, 0.9] }}
          transition={{ duration: 2.2, delay: v.atraso, ease: "easeOut", times: [0, 0.2, 0.75, 1] }}
        >
          <motion.img
            src={publico(`/estampa/${v.img}`)}
            alt=""
            className="w-full"
            animate={{ scaleX: [1, 0.35, 1] }}
            transition={{ duration: 0.3, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.span>
      ))}
    </>
  );
}

/** Borboletas paradas nos cantos da tela do envelope. */
function Cantos() {
  return (
    <div data-cantos className="pointer-events-none absolute inset-0">
      <img
        src={publico("/estampa/spot-butterfly-1.png")}
        alt=""
        aria-hidden="true"
        className="absolute top-[9%] left-[8%] w-12 -rotate-12 opacity-80"
      />
      <img
        src={publico("/estampa/spot-butterfly-2.png")}
        alt=""
        aria-hidden="true"
        className="absolute right-[7%] bottom-[10%] w-20 rotate-6 opacity-80"
      />
    </div>
  );
}
