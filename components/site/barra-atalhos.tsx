"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Gift, MailCheck, MapPin, type LucideProps } from "lucide-react";

/** Cabide de traço fino (o "Shirt" do lucide é uma camiseta, informal demais para o traje). */
function Cabide(props: LucideProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M10 5.5a2 2 0 1 1 2 2v1.5l-8.6 6.3a1 1 0 0 0 .6 1.8h16a1 1 0 0 0 .6-1.8L12 9" />
    </svg>
  );
}

// Na ordem da página (specs/004 D1). "Confirmar" é o destaque.
const ATALHOS = [
  { id: "dresscode", rotulo: "Traje", Icone: Cabide },
  { id: "presentes", rotulo: "Presentes", Icone: Gift },
  { id: "rsvp", rotulo: "Confirmar", Icone: MailCheck, destaque: true },
  { id: "local", rotulo: "Local", Icone: MapPin },
];

const CAMPOS = "input, textarea, select";

/**
 * Atalhos fixos no rodapé da tela (specs/004). Entram quando a "Nossa história" aparece, ficam
 * até o fim e marcam a seção que está no meio da tela. Somem com o teclado aberto.
 */
export function BarraAtalhos() {
  const reduzir = useReducedMotion();
  const [passouCapa, setPassouCapa] = useState(false);
  const [digitando, setDigitando] = useState(false);
  const [ativo, setAtivo] = useState<string | null>(null);

  // Aparece depois da capa, que já tem "Eu vou!" e "Lista de presentes" (D2).
  useEffect(() => {
    const historia = document.getElementById("historia");
    if (!historia) return;
    const conferir = () => setPassouCapa(historia.getBoundingClientRect().top < window.innerHeight * 0.85);
    conferir();
    window.addEventListener("scroll", conferir, { passive: true });
    window.addEventListener("resize", conferir);
    return () => {
      window.removeEventListener("scroll", conferir);
      window.removeEventListener("resize", conferir);
    };
  }, []);

  // Seção ativa: a que cruza uma faixa no meio da tela (D3).
  useEffect(() => {
    const visiveis = new Set<string>();
    const observador = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (e.isIntersecting) visiveis.add(e.target.id);
          else visiveis.delete(e.target.id);
        }
        setAtivo(ATALHOS.find((a) => visiveis.has(a.id))?.id ?? null);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    for (const a of ATALHOS) {
      const secao = document.getElementById(a.id);
      if (secao) observador.observe(secao);
    }
    return () => observador.disconnect();
  }, []);

  // Teclado aberto no campo do RSVP: a barra sai da frente (D4).
  useEffect(() => {
    const entrou = (e: FocusEvent) => setDigitando((e.target as Element).matches?.(CAMPOS) ?? false);
    const saiu = () => setDigitando(false);
    document.addEventListener("focusin", entrou);
    document.addEventListener("focusout", saiu);
    return () => {
      document.removeEventListener("focusin", entrou);
      document.removeEventListener("focusout", saiu);
    };
  }, []);

  const visivel = passouCapa && !digitando;

  return (
    <AnimatePresence>
      {visivel && (
        <motion.nav
          aria-label="Atalhos"
          className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-[640px] border-t border-gold-line bg-background pb-[env(safe-area-inset-bottom)]"
          initial={reduzir ? { opacity: 0 } : { opacity: 0, y: "100%" }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduzir ? { opacity: 0 } : { opacity: 0, y: "100%" }}
          transition={{ duration: reduzir ? 0.2 : 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <ul className="grid grid-cols-4">
            {ATALHOS.map(({ id, rotulo, Icone, destaque }) => {
              const atual = ativo === id;
              return (
                <li key={id} className="relative">
                  {/* Fio dourado em cima do atalho ativo. */}
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-5 -top-px h-0.5 bg-gold transition-opacity duration-300 ${atual ? "opacity-100" : "opacity-0"}`}
                  />
                  <a
                    href={`#${id}`}
                    aria-current={atual ? "location" : undefined}
                    className={`flex min-h-[60px] flex-col items-center justify-center gap-1 text-[11px] font-semibold tracking-[0.16em] uppercase transition-colors focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-primary ${
                      atual ? "text-primary" : "text-primary-deep/75 hover:text-primary"
                    }`}
                  >
                    {/* Mesma caixa de 28px para todos: os rótulos ficam na mesma linha. */}
                    <span
                      className={`flex size-7 items-center justify-center rounded-full ${destaque ? "bg-primary text-card" : ""}`}
                    >
                      {destaque ? (
                        <Icone aria-hidden="true" className="size-4" strokeWidth={1.5} />
                      ) : (
                        <Icone aria-hidden="true" className="size-[22px]" strokeWidth={1.25} />
                      )}
                    </span>
                    {rotulo}
                  </a>
                </li>
              );
            })}
          </ul>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
