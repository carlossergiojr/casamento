"use client";

import { useEffect, useRef, useState } from "react";
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
/** Rolagem mínima para a barra entrar: o primeiro gesto, sem disparar com o "quique" do iOS. */
const PRIMEIRA_ROLAGEM = 24;
const MOLA = { type: "spring", stiffness: 480, damping: 38 } as const;

/**
 * Atalhos fixos no rodapé da tela (specs/004). Entram na primeira rolagem, ficam até o fim e
 * marcam a seção que está no meio da tela. Somem com o teclado aberto.
 */
export function BarraAtalhos() {
  const reduzir = useReducedMotion();
  const [rolou, setRolou] = useState(false);
  const [digitando, setDigitando] = useState(false);
  const [ativo, setAtivo] = useState<string | null>(null);
  // Atalho tocado: fica ativo enquanto a página desliza até ele, sem piscar nos do caminho.
  const tocado = useRef<string | null>(null);

  // Escondida só com a capa parada na tela; entra no primeiro gesto de rolagem (D2).
  useEffect(() => {
    const conferir = () => setRolou(window.scrollY > PRIMEIRA_ROLAGEM);
    conferir();
    window.addEventListener("scroll", conferir, { passive: true });
    return () => window.removeEventListener("scroll", conferir);
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
        if (tocado.current) return;
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

  // Fim da rolagem do toque (150ms sem rolar): o observador volta a mandar (D3).
  const espera = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const soltarDepois = () => {
    clearTimeout(espera.current);
    espera.current = setTimeout(() => {
      tocado.current = null;
    }, 150);
  };
  useEffect(() => {
    const aoRolar = () => tocado.current && soltarDepois();
    window.addEventListener("scroll", aoRolar, { passive: true });
    return () => {
      window.removeEventListener("scroll", aoRolar);
      clearTimeout(espera.current);
    };
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

  const visivel = rolou && !digitando;

  const tocar = (id: string) => {
    tocado.current = id;
    setAtivo(id);
    soltarDepois();
  };

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
                  {/* Fio dourado do ativo: desliza de um atalho para o outro. */}
                  {atual && (
                    <motion.span
                      aria-hidden="true"
                      layoutId={reduzir ? undefined : "fio-ativo"}
                      className="absolute inset-x-4 -top-px h-[3px] rounded-b-[3px] bg-gold"
                      initial={reduzir ? { opacity: 0 } : false}
                      animate={{ opacity: 1 }}
                      transition={reduzir ? { duration: 0.2 } : MOLA}
                    />
                  )}
                  <a
                    href={`#${id}`}
                    onClick={() => tocar(id)}
                    aria-current={atual ? "location" : undefined}
                    className={`flex min-h-[60px] flex-col items-center justify-center gap-1 text-[11px] font-semibold tracking-[0.16em] uppercase transition-colors duration-300 focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-primary ${
                      atual ? "text-gold-text-sm" : "text-primary hover:text-primary-deep"
                    }`}
                  >
                    {/* Mesma caixa de 28px para todos: os rótulos ficam na mesma linha. */}
                    <motion.span
                      className={`relative flex size-7 items-center justify-center rounded-full transition-shadow duration-300 ${
                        destaque ? "bg-primary text-card" : ""
                      } ${destaque && atual ? "ring-2 ring-gold-line ring-offset-2 ring-offset-background" : ""}`}
                      animate={reduzir ? undefined : { y: atual ? -2 : 0, scale: atual ? 1.08 : 1 }}
                      whileTap={reduzir ? undefined : { scale: 0.9 }}
                      transition={MOLA}
                    >
                      {destaque ? (
                        <Icone aria-hidden="true" className="size-4" strokeWidth={1.5} />
                      ) : (
                        <Icone aria-hidden="true" className="size-[22px]" strokeWidth={atual ? 1.6 : 1.25} />
                      )}
                    </motion.span>
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
