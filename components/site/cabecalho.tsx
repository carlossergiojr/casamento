"use client";

import { useEffect, useRef, useState } from "react";
import { Dialog } from "@base-ui/react/dialog";
import { motion, useReducedMotion } from "motion/react";
import { casamento } from "@/lib/conteudo";

// Na ordem da página.
const SECOES = [
  { id: "historia", rotulo: "Nossa história" },
  { id: "galeria", rotulo: "Fotos" },
  { id: "dresscode", rotulo: "Dress code" },
  { id: "presentes", rotulo: "Presentes" },
  { id: "rsvp", rotulo: "Confirmar presença" },
  { id: "local", rotulo: "Como chegar" },
];

/** Rolagem mínima num sentido para o cabeçalho sumir ou voltar (evita tremer no "quique" do iOS). */
const LIMIAR = 8;

function Monograma() {
  return (
    <span className="font-serif text-[22px] text-primary">
      {casamento.monograma.a} <span className="text-gold">&amp;</span> {casamento.monograma.b}
    </span>
  );
}

/** Duas linhas finas: o "hambúrguer" com três ficaria pesado demais para o resto do site. */
function Linhas() {
  return (
    <span aria-hidden="true" className="flex w-5 flex-col gap-[5px]">
      <span className="h-px bg-current" />
      <span className="h-px bg-current" />
    </span>
  );
}

const BOTAO =
  "-mr-2 flex min-h-11 items-center gap-2.5 px-2 text-[11px] font-semibold tracking-[0.28em] text-primary-deep uppercase focus-visible:outline-2 focus-visible:outline-primary";

/**
 * Cabeçalho fixo no topo com o menu. Some ao rolar para baixo (não cobre a leitura) e volta ao
 * rolar para cima. O menu abre por cima da página e leva direto à seção escolhida.
 */
export function Cabecalho() {
  const reduzir = useReducedMotion();
  const [aberto, setAberto] = useState(false);
  const [escondido, setEscondido] = useState(false);
  const [rolou, setRolou] = useState(false);
  const destino = useRef<string | null>(null);

  useEffect(() => {
    let ultimo = window.scrollY;
    const aoRolar = () => {
      const y = window.scrollY;
      setRolou(y > 4);
      if (y < 52) setEscondido(false);
      else if (y - ultimo > LIMIAR) setEscondido(true);
      else if (ultimo - y > LIMIAR) setEscondido(false);
      else return;
      ultimo = y;
    };
    window.addEventListener("scroll", aoRolar, { passive: true });
    return () => window.removeEventListener("scroll", aoRolar);
  }, []);

  // Só rola depois que o menu fechou de vez: com ele aberto a página está travada.
  // Rola sem pôr "#secao" no endereço: senão o link copiado ou reaberto cai direto nela, por
  // trás do envelope (o href fica para quem está sem JS).
  const aoTerminar = (abriu: boolean) => {
    if (abriu || !destino.current) return;
    const secao = document.getElementById(destino.current);
    destino.current = null;
    if (!secao) return;
    secao.scrollIntoView({ behavior: reduzir ? "auto" : "smooth" });
    secao.setAttribute("tabindex", "-1");
    secao.focus({ preventScroll: true });
  };

  return (
    <motion.header
      className={`sticky top-0 z-40 flex h-[52px] items-center justify-between bg-background px-5 transition-[border-color] duration-300 ${
        rolou ? "border-b border-gold-line" : "border-b border-transparent"
      }`}
      animate={reduzir ? { opacity: escondido ? 0 : 1 } : { y: escondido ? "-100%" : 0 }}
      transition={{ duration: reduzir ? 0.2 : 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <Monograma />

      <Dialog.Root open={aberto} onOpenChange={setAberto} onOpenChangeComplete={aoTerminar}>
        <Dialog.Trigger className={BOTAO}>
          Menu
          <Linhas />
        </Dialog.Trigger>

        <Dialog.Portal>
          <Dialog.Popup
            finalFocus={() => !destino.current}
            className="fixed inset-0 z-50 mx-auto flex max-w-[640px] flex-col overflow-y-auto bg-background transition-opacity duration-300 outline-none data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 motion-reduce:duration-150"
          >
            <div className="flex h-[52px] shrink-0 items-center justify-between border-b border-gold-line px-5">
              <Monograma />
              <Dialog.Close className={BOTAO}>
                Fechar
                <span aria-hidden="true" className="relative block size-5">
                  <span className="absolute inset-x-0 top-1/2 h-px rotate-45 bg-current" />
                  <span className="absolute inset-x-0 top-1/2 h-px -rotate-45 bg-current" />
                </span>
              </Dialog.Close>
            </div>

            <Dialog.Title className="sr-only">Menu</Dialog.Title>
            <nav aria-label="Seções do convite" className="flex flex-1 flex-col items-center justify-center px-7 py-10">
              <ul className="flex flex-col items-center gap-1">
                {SECOES.map(({ id, rotulo }) => (
                  <li key={id}>
                    <a
                      href={`#${id}`}
                      onClick={(evento) => {
                        evento.preventDefault();
                        destino.current = id;
                        setAberto(false);
                      }}
                      className="flex min-h-14 items-center px-4 font-serif text-[32px] text-primary italic transition-colors duration-200 hover:text-gold focus-visible:outline-2 focus-visible:outline-primary"
                    >
                      {rotulo}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="flex shrink-0 flex-col items-center gap-1.5 pb-7 text-center">
              <p className="sobretitulo">{casamento.dataCurta}</p>
              <p className="text-[13px] text-primary-deep">
                {casamento.local.nome} · {casamento.local.cidade}
              </p>
            </div>
            <div aria-hidden="true" className="toile h-24 shrink-0 border-t border-gold-line" />
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </motion.header>
  );
}
