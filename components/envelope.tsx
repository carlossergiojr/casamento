"use client";

import { useEffect, useState } from "react";
import { motion, useAnimate, useReducedMotion } from "motion/react";
import { casamento, publico } from "@/lib/conteudo";
import { CHAVE_CONVITE_ABERTO, EVENTO_CONVITE_ABERTO } from "@/lib/convite-aberto";

type Fase = "fechado" | "abrindo" | "fora";

const SUAVE = [0.22, 1, 0.36, 1] as const;
const DOBRA = [0.65, 0, 0.35, 1] as const;

/*
 * Geometria do envelope em tela cheia (em % da tela). A aba desce até a ponta (BICO) e o bolso
 * da frente sobe pelas laterais até OMBRO. O cartão começa abaixo do bico, escondido no bolso.
 */
const OMBRO = 30;
const BICO = 54;
const ABA = `polygon(0 0, 100% 0, 100% ${OMBRO}%, 50% ${BICO}%, 0 ${OMBRO}%)`;
const BOLSO = `polygon(0 ${OMBRO + 0.6}%, 50% ${BICO + 0.8}%, 100% ${OMBRO + 0.6}%, 100% 100%, 0 100%)`;
const TOPO_CARTAO = BICO + 5;
const ORIGEM = `50% ${BICO}%`;


/**
 * Abertura do convite (specs/001 US1). O envelope ocupa a tela inteira e é o botão. Sequência ao
 * tocar (~6,5 s): selo se parte → aba abre → a tela "entra" no envelope e as borboletas saem →
 * cartão sobe do bolso → envelope desce e o cartão pousa no centro → pausa → o cartão desliza até
 * o nome na capa e o site aparece em volta. Com `prefers-reduced-motion`, só um fade.
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
    document.documentElement.style.overflow = "";
    document.getElementById("site")?.removeAttribute("inert");
    anunciarConvite();
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

    const cartao = cena.current.querySelector<HTMLElement>("[data-cartao]")!;
    const altura = cartao.offsetHeight;
    // Do topo inicial (escondido no bolso) até o centro da tela.
    const subida = innerHeight * (0.5 - TOPO_CARTAO / 100) - altura / 2;
    animar("[data-dica]", { opacity: 0 }, { duration: 0.4 });

    // 1. O selo afunda com o toque e se parte em duas metades que caem.
    await animar("[data-selo]", { scale: [1, 0.92, 1.04] }, { duration: 0.45, ease: "easeOut" });
    animar("[data-selo-inteiro]", { opacity: 0 }, { duration: 0 });
    animar("[data-selo-esq]", { x: -70, y: 160, rotate: -40, opacity: 0 }, { duration: 1.1, ease: "easeIn" });
    animar("[data-selo-dir]", { x: 70, y: 150, rotate: 36, opacity: 0 }, { duration: 1.1, ease: "easeIn" });

    // 2. A aba abre para cima, devagar, e a tela "entra" um pouco no envelope.
    animar("[data-aba]", { rotateX: 180 }, { delay: 0.1, duration: 1.5, ease: DOBRA });
    animar("[data-corpo]", { scale: 1.06 }, { delay: 0.3, duration: 3, ease: "easeInOut" });

    // 3. O cartão sai do bolso com calma.
    await animar("[data-cartao]", { y: subida }, { delay: 1.2, duration: 1.6, ease: SUAVE });

    // 4. O envelope desce e some; o cartão vem para a frente e pousa no centro, legível.
    animar("[data-cartao]", { zIndex: 6 }, { duration: 0 });
    animar("[data-corpo]", { y: "100%", opacity: 0 }, { duration: 1.2, ease: [0.55, 0, 0.75, 0.4] });
    await animar("[data-cartao]", { scale: 1.06 }, { delay: 0.2, duration: 1.1, ease: SUAVE });

    // 5. Uma pausa para ler o convite.
    await new Promise((r) => setTimeout(r, 900));

    // 6. O cartão vira o site: desliza até o nome na capa enquanto a capa entra por baixo dele e
    //    o fundo do convite se desfaz.
    anunciarConvite();
    animar(cena.current, { backgroundColor: "rgb(250 247 241 / 0)" }, { duration: 1.1, ease: "easeInOut" });
    const destino = destinoNaCapa(cartao, 1.06);
    await animar(
      "[data-cartao]",
      destino
        ? { x: destino.x, y: subida + destino.y, scale: destino.escala, opacity: 0 }
        : { y: subida - 40, opacity: 0 },
      { duration: 1.1, ease: SUAVE, opacity: { duration: 0.7, delay: 0.15, ease: "easeIn" } },
    );
    setFase("fora");
  }

  if (fase === "fora") return null;
  const fechado = fase === "fechado";

  return (
    <div
      ref={cena}
      data-envelope
      data-abrindo={fechado ? undefined : ""}
      role="dialog"
      aria-modal="true"
      aria-label="Convite de casamento"
      className="fixed inset-0 z-50 overflow-hidden bg-background"
    >
      <FiltrosCera />

      <button
        type="button"
        onClick={abrir}
        disabled={!fechado}
        aria-label="Abrir o convite"
        className="absolute inset-0 cursor-pointer outline-none [-webkit-tap-highlight-color:transparent] touch-manipulation focus-visible:ring-4 focus-visible:ring-gold-line focus-visible:ring-inset disabled:cursor-default"
      >
        {/* Envelope em três camadas irmãs (forro, bolso, aba), para o cartão passar entre elas.
            Todas têm `data-corpo`: crescem e descem juntas. */}
        <div data-corpo className="absolute inset-0" style={{ zIndex: 1, transformOrigin: ORIGEM }}>
          {/* Forro por dentro: creme com a estampa, visível quando a aba abre. */}
          <div className="toile absolute inset-0 bg-[#f3eee4]" />
          <div className="absolute inset-0 bg-[#f3eee4]/55" />
        </div>

        {/* Bolso da frente, com sombra da aba e um texto de "endereçamento". */}
        <div data-corpo className="absolute inset-0" style={{ zIndex: 3, transformOrigin: ORIGEM }}>
          <div className="absolute inset-0 drop-shadow-[0_-2px_6px_rgb(20_24_34/0.35)]">
            <Papel cor="#5a6479" recorte={BOLSO} />
          </div>
          <div
            data-dica
            className="absolute inset-x-0 bottom-[11%] flex flex-col items-center gap-3 text-center text-[#f4efe4]"
          >
            <span className="font-serif text-[26px] font-light italic">Para você, com carinho</span>
            <motion.span
              className="text-[12px] tracking-[0.24em] uppercase"
              animate={reduzir ? undefined : { opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
            >
              Toque para abrir
            </motion.span>
          </div>
        </div>

        {/* Aba: frente no papel, verso com o forro; gira para cima ao abrir. */}
        <div
          data-corpo
          className="absolute inset-0 [perspective:1400px]"
          style={{ zIndex: 4, transformOrigin: ORIGEM }}
        >
          <div data-aba className="absolute inset-0 origin-top [transform-style:preserve-3d]">
            <div className="absolute inset-0 drop-shadow-[0_6px_10px_rgb(20_24_34/0.4)] [backface-visibility:hidden]">
              <Papel cor="#646f86" recorte={ABA} />
            </div>
            <div
              className="toile absolute inset-0 bg-[#efe9dc] [backface-visibility:hidden] [transform:rotateX(180deg)]"
              style={{ clipPath: ABA }}
            />
            <p
              data-dica
              className="sobretitulo absolute inset-x-0 top-[12%] text-center text-[#f4efe4] [backface-visibility:hidden]"
            >
              Você recebeu um convite
            </p>
          </div>
        </div>

        {/* Cartão que sobe do bolso. */}
        <div
          data-cartao
          className="absolute left-1/2 flex aspect-[1.45] w-[min(84vw,400px)] -translate-x-1/2 flex-col items-center justify-center gap-1.5 border-t border-gold-line bg-card px-4 text-center shadow-[0_2px_8px_rgb(43_49_64/0.18)]"
          style={{ top: `${TOPO_CARTAO}%`, zIndex: 2 }}
        >
          <span className="sobretitulo text-[10px]">Vamos nos casar</span>
          <span
            data-nome
            className="font-serif text-[clamp(24px,8.4vw,36px)] leading-none font-light whitespace-nowrap text-primary"
          >
            {casamento.primeiro} <span className="text-gold italic">&amp;</span>{" "}
            {casamento.segundo.split(" ")[0]}
          </span>
          <span className="font-serif text-[18px] tracking-[0.1em]">{casamento.dataCapa}</span>
        </div>

        {/* Selo de cera na ponta da aba, em duas metades para se partir. */}
        <div
          data-selo
          aria-hidden="true"
          className="absolute left-1/2 size-[min(36vw,168px)] -translate-x-1/2 -translate-y-1/2"
          style={{ top: `${BICO}%`, zIndex: 5 }}
        >
          {/* Respira de leve enquanto espera o toque (separado do [data-selo], que o toque anima). */}
          <motion.div
            className="absolute inset-0"
            animate={fechado && !reduzir ? { scale: [1, 1.025, 1] } : { scale: 1 }}
            transition={fechado ? { duration: 3.2, repeat: Infinity, ease: "easeInOut" } : { duration: 0.2 }}
          >
            <span data-selo-inteiro className="absolute inset-0">
              <SeloCera />
            </span>
            <MeioSelo lado="esq" />
            <MeioSelo lado="dir" />
          </motion.div>
        </div>

        {fase === "abrindo" && !reduzir && <Borboletas />}
      </button>
    </div>
  );
}

/** Marca o convite como aberto e avisa a capa para entrar (specs/002 FR-004). Uma vez só. */
function anunciarConvite() {
  const html = document.documentElement;
  if (html.dataset.convite === "aberto") return;
  html.dataset.convite = "aberto";
  window.dispatchEvent(new Event(EVENTO_CONVITE_ABERTO));
}

/**
 * Quanto o cartão precisa andar (e crescer) para o nome dele cair sobre o nome da capa. `null`
 * quando o nome da capa está fora da tela (tela baixa): aí o cartão só sobe e some.
 */
function destinoNaCapa(cartao: HTMLElement, escalaAtual: number) {
  const alvo = document.querySelector("#inicio h1")?.getBoundingClientRect();
  const nome = cartao.querySelector("[data-nome]")?.getBoundingClientRect();
  if (!alvo || !nome || alvo.top + alvo.height / 2 > innerHeight - 40) return null;
  const caixa = cartao.getBoundingClientRect();
  const escala = 1.2;
  const r = escala / escalaAtual;
  // Escala em torno do centro do cartão: o nome se afasta do centro na mesma proporção.
  const centro = { x: caixa.left + caixa.width / 2, y: caixa.top + caixa.height / 2 };
  const desvio = { x: nome.left + nome.width / 2 - centro.x, y: nome.top + nome.height / 2 - centro.y };
  return {
    x: alvo.left + alvo.width / 2 - desvio.x * r - centro.x,
    y: alvo.top + alvo.height / 2 - desvio.y * r - centro.y,
    escala,
  };
}

/**
 * Papel azul-acinzentado com a estampa toile em baixo-relevo: a estampa escurece de leve (sombra)
 * e uma cópia deslocada 1px clareia (luz), como papel gofrado. Exceção ao DESIGN.md: o envelope
 * imita um objeto real, então tem sombra e volume.
 */
function Papel({ cor, recorte }: { cor: string; recorte: string }) {
  return (
    <div className="absolute inset-0" style={{ clipPath: recorte, backgroundColor: cor }}>
      <div className="toile absolute inset-0 opacity-[0.16] mix-blend-multiply" />
      <div className="toile absolute inset-0 -translate-x-px -translate-y-px opacity-[0.07] mix-blend-screen" />
    </div>
  );
}

/* ---------- Selo de cera ---------- */

/** Borda irregular de cera derramada: círculo com ondulações fixas (igual no servidor e no cliente). */
const BORDA_CERA = (() => {
  const n = 18;
  const pontos = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    const r = 90 + Math.sin(i * 2.7) * 4 + Math.cos(i * 1.3) * 3;
    return [100 + Math.cos(a) * r, 100 + Math.sin(a) * r];
  });
  const meio = (p: number[], q: number[]) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
  const f = (v: number) => v.toFixed(1);
  let d = `M${meio(pontos[n - 1], pontos[0]).map(f).join(" ")}`;
  pontos.forEach((p, i) => {
    const m = meio(p, pontos[(i + 1) % n]);
    d += ` Q${f(p[0])} ${f(p[1])} ${f(m[0])} ${f(m[1])}`;
  });
  return `${d}Z`;
})();

/**
 * Luz sobre a cera: o canal alfa borrado vira volume (bordas arredondadas) e o brilho especular
 * dá o aspecto de cera. "relevo" faz o mesmo, mais fino, no monograma e no aro carimbados.
 */
function FiltrosCera() {
  return (
    <svg aria-hidden="true" width="0" height="0" className="absolute">
      <defs>
        <filter id="cera-volume" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="5" result="alto" />
          <feSpecularLighting in="alto" surfaceScale="9" specularConstant="0.9" specularExponent="14" lightingColor="#fff3d6" result="brilho">
            <feDistantLight azimuth="235" elevation="48" />
          </feSpecularLighting>
          <feComposite in="brilho" in2="SourceAlpha" operator="in" result="brilhoDentro" />
          <feComposite in="SourceGraphic" in2="brilhoDentro" operator="arithmetic" k2="1" k3="0.75" />
        </filter>
        <filter id="cera-relevo" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="1.4" result="alto" />
          <feSpecularLighting in="alto" surfaceScale="2.4" specularConstant="0.9" specularExponent="22" lightingColor="#fff3d6" result="brilho">
            <feDistantLight azimuth="235" elevation="40" />
          </feSpecularLighting>
          <feComposite in="brilho" in2="SourceAlpha" operator="in" result="brilhoDentro" />
          <feComposite in="SourceGraphic" in2="brilhoDentro" operator="arithmetic" k2="1" k3="0.7" />
        </filter>
      </defs>
    </svg>
  );
}

function SeloCera() {
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full drop-shadow-[0_4px_6px_rgb(20_24_34/0.45)]">
      <path d={BORDA_CERA} fill="#a5834c" filter="url(#cera-volume)" />
      {/* Disco prensado pelo carimbo, um pouco mais escuro, com aro. */}
      <circle cx="100" cy="100" r="64" fill="#8c6c3b" />
      <g filter="url(#cera-relevo)" fill="#b8955c">
        <circle cx="100" cy="100" r="64" fill="none" stroke="#b8955c" strokeWidth="3" />
        <circle cx="100" cy="100" r="56" fill="none" stroke="#b8955c" strokeWidth="1" />
        <text
          x="100"
          y="114"
          textAnchor="middle"
          style={{ fontFamily: "var(--font-cormorant), serif", fontStyle: "italic" }}
          fontSize="46"
        >
          {casamento.monograma.a}
          <tspan fontSize="34" dx="1" dy="-2">&amp;</tspan>
          <tspan dx="1" dy="2">{casamento.monograma.b}</tspan>
        </text>
      </g>
    </svg>
  );
}

/** Metade do selo: o selo inteiro recortado à esquerda ou à direita, com corte irregular. */
function MeioSelo({ lado }: { lado: "esq" | "dir" }) {
  const recorte =
    lado === "esq"
      ? "polygon(0 0, 52% 0, 46% 30%, 55% 55%, 47% 78%, 51% 100%, 0 100%)"
      : "polygon(52% 0, 100% 0, 100% 100%, 51% 100%, 47% 78%, 55% 55%, 46% 30%)";
  return (
    <span
      data-selo-esq={lado === "esq" ? "" : undefined}
      data-selo-dir={lado === "dir" ? "" : undefined}
      className="absolute inset-0"
      style={{ clipPath: recorte }}
    >
      <SeloCera />
    </span>
  );
}

/* ---------- Borboletas ---------- */

/** Borboletas da estampa que escapam do envelope aberto, batendo as asas. */
const VOOS = [
  { img: "spot-butterfly-1.png", tam: 54, atraso: 1.1, x: [0, -50, -130, -210], y: [0, -120, -260, -480], giro: [-8, -18, -4, -22] },
  { img: "spot-butterfly-2.png", tam: 80, atraso: 1.3, x: [0, 60, 130, 230], y: [0, -100, -290, -460], giro: [6, 14, 2, 18] },
  { img: "spot-butterfly-1.png", tam: 40, atraso: 1.55, x: [0, 10, -40, 50], y: [0, -150, -310, -520], giro: [10, -6, 12, -4] },
];

function Borboletas() {
  return (
    <>
      {VOOS.map((v, i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2"
          style={{ top: `${OMBRO + 8}%`, zIndex: 7, width: v.tam, marginLeft: -v.tam / 2 }}
          initial={{ opacity: 0, x: 0, y: 0, scale: 0.6 }}
          animate={{ opacity: [0, 1, 1, 0], x: v.x, y: v.y, rotate: v.giro, scale: [0.6, 1, 1, 0.9] }}
          transition={{ duration: 2.8, delay: v.atraso, ease: "easeOut", times: [0, 0.2, 0.75, 1] }}
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
