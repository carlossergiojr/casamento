"use client";

import { useEffect, useState } from "react";
import { useAnimate } from "motion/react";
import { useReduzir } from "@/lib/use-reduzir";
import { casamento } from "@/lib/conteudo";
import { tocarMusica } from "@/lib/musica";
import { CHAVE_CONVITE_ABERTO, EVENTO_CONVITE_ABERTO } from "@/lib/convite-aberto";

type Fase = "fechado" | "abrindo" | "fora";

const ABRE = [0.65, 0, 0.25, 1] as const;

/**
 * Abertura do convite: a tela inteira é uma cortina com a estampa toile, dividida ao meio por um
 * fio dourado, com uma placa no centro. Em "Abrir", a placa some, as duas metades correm para os
 * lados e a música começa (o toque é o que libera o som no navegador). "Entrar sem música" abre
 * igual, em silêncio. Exceção ao DESIGN.md: aqui a estampa ocupa a tela, mas nunca fica atrás de
 * texto (a placa é lisa). Com `prefers-reduced-motion`, só um fade.
 */
export function Cortina() {
  const [fase, setFase] = useState<Fase>("fechado");
  const reduzir = useReduzir();
  const [cena, animar] = useAnimate<HTMLDivElement>();

  // Enquanto a cortina está na tela, ela é um diálogo modal: o site por trás não rola nem
  // recebe foco (specs/002 FR-010).
  useEffect(() => {
    const html = document.documentElement;
    if (html.dataset.convite === "aberto") {
      setFase("fora");
      return;
    }
    // Primeira abertura começa sempre na capa: um "#secao" no endereço ou a rolagem lembrada
    // pelo navegador levariam direto para o meio.
    if (location.hash) history.replaceState(null, "", location.pathname + location.search);
    history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
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

  async function abrir(comMusica: boolean) {
    if (fase !== "fechado") return;
    try {
      sessionStorage.setItem(CHAVE_CONVITE_ABERTO, "1");
    } catch {
      // Sem storage (aba anônima, bloqueio): a cortina só volta a aparecer.
    }
    setFase("abrindo");
    if (comMusica) tocarMusica();

    if (reduzir) {
      anunciarConvite();
      await animar(cena.current, { opacity: 0 }, { duration: 0.5 });
      setFase("fora");
      return;
    }

    animar("[data-placa]", { opacity: 0, scale: 0.96 }, { duration: 0.35 });
    animar("[data-sem-musica]", { opacity: 0 }, { duration: 0.3 });
    animar("[data-folha=esq]", { x: "-102%" }, { delay: 0.25, duration: 1.4, ease: ABRE });
    await animar("[data-folha=dir]", { x: "102%" }, { delay: 0.25, duration: 1.4, ease: ABRE });
    setFase("fora");
  }

  // A capa começa a entrar enquanto a cortina ainda corre.
  useEffect(() => {
    if (fase !== "abrindo" || reduzir) return;
    const t = setTimeout(anunciarConvite, 700);
    return () => clearTimeout(t);
  }, [fase, reduzir]);

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
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden px-4"
    >
      <div
        data-folha="esq"
        aria-hidden="true"
        className="toile absolute inset-y-0 left-0 w-[50.5%] border-r border-gold-line bg-background [background-position:right_top]"
      />
      <div
        data-folha="dir"
        aria-hidden="true"
        className="toile absolute inset-y-0 right-0 w-[50.5%] border-l border-gold-line bg-background [background-position:left_top]"
      />

      <button
        type="button"
        data-placa
        onClick={() => abrir(true)}
        disabled={!fechado}
        className="relative flex cursor-pointer flex-col items-center gap-1.5 rounded-[3px] border border-gold-line bg-background px-8 pt-8 pb-6 text-center outline outline-1 outline-offset-4 outline-gold-line touch-manipulation [-webkit-tap-highlight-color:transparent] focus-visible:ring-4 focus-visible:ring-gold-line disabled:cursor-default"
      >
        <span className="sobretitulo">Você está convidado</span>
        <span className="font-nomes text-[44px] leading-tight text-primary-deep">
          {casamento.primeiro} <span className="font-serif text-[28px] text-gold italic">&amp;</span>{" "}
          {casamento.segundo}
        </span>
        <span className="mb-3 font-serif text-base tracking-[0.12em] text-primary-deep">{casamento.dataCapa}</span>
        <span className="botao bg-primary px-6 text-card">Abrir</span>
      </button>

      <button
        type="button"
        data-sem-musica
        onClick={() => abrir(false)}
        disabled={!fechado}
        className="absolute bottom-[calc(1.75rem+env(safe-area-inset-bottom))] min-h-11 cursor-pointer rounded-[3px] bg-background px-4 text-[13px] text-primary-deep underline underline-offset-[3px] touch-manipulation"
      >
        Entrar sem música
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
