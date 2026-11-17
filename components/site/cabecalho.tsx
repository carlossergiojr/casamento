"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Dialog } from "@base-ui/react/dialog";
import { motion } from "motion/react";
import { casamento } from "@/lib/conteudo";
import { useReduzir } from "@/lib/use-reduzir";

// Na ordem da página (specs/007). Com `href`, o item abre outra tela em vez de rolar até a seção.
const SECOES: { id: string; rotulo: string; href?: string }[] = [
  { id: "programacao", rotulo: "Programação" },
  { id: "dresscode", rotulo: "Traje" },
  { id: "local", rotulo: "Como chegar" },
  { id: "rsvp", rotulo: "Confirmar presença", href: "/confirmar" },
  { id: "presentes", rotulo: "Presentes" },
  { id: "historia", rotulo: "Nossa história" },
  { id: "galeria", rotulo: "Fotos" },
  { id: "guia", rotulo: "Guia do convidado" },
  { id: "duvidas", rotulo: "Dúvidas" },
];

const ITEM =
  "flex min-h-12 items-center px-4 font-serif text-[28px] text-primary italic transition-colors duration-200 hover:text-gold focus-visible:outline-2 focus-visible:outline-primary";

/** Rolagem mínima num sentido para o cabeçalho sumir ou voltar (evita tremer no "quique" do iOS). */
const LIMIAR = 8;

function Monograma() {
  return (
    <span className="font-serif text-[22px] text-primary">
      {casamento.monograma.a} <span className="text-gold">&amp;</span> {casamento.monograma.b}
    </span>
  );
}

function Data() {
  return <span className="text-[11px] tracking-[0.28em] text-primary-deep uppercase">{casamento.dataCurta}</span>;
}

const BOTAO =
  "-mr-2 flex min-h-11 items-center gap-3 px-2 text-primary-deep focus-visible:outline-2 focus-visible:outline-primary";

/**
 * Cabeçalho do topo: monograma e, à direita, a data com dois tracinhos que abrem as seções.
 * Some ao rolar para baixo (não cobre a leitura) e volta ao rolar para cima.
 */
export function Cabecalho() {
  const reduzir = useReduzir();
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

  // Só rola depois que a lista fechou de vez: com ela aberta a página está travada.
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
    // Escondido, sai do caminho de verdade: sem toque, sem foco de teclado nem leitor de tela.
    <motion.header
      inert={escondido && !aberto}
      className={`sticky top-0 z-40 flex h-[52px] items-center justify-between border-b bg-background px-5 transition-[border-color] duration-300 ${
        rolou ? "border-gold-line" : "border-transparent"
      } ${escondido ? "pointer-events-none" : ""}`}
      animate={reduzir ? { opacity: escondido ? 0 : 1 } : { y: escondido ? "-100%" : 0 }}
      transition={{ duration: reduzir ? 0.2 : 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <Monograma />

      <Dialog.Root open={aberto} onOpenChange={setAberto} onOpenChangeComplete={aoTerminar}>
        <Dialog.Trigger aria-label="Abrir as seções do site" className={BOTAO}>
          <Data />
          <span aria-hidden="true" className="flex w-5 flex-col gap-[5px]">
            <span className="h-px bg-current" />
            <span className="h-px bg-current" />
          </span>
        </Dialog.Trigger>

        <Dialog.Portal>
          <Dialog.Popup
            finalFocus={() => !destino.current}
            className="fixed inset-0 z-50 mx-auto flex max-w-[640px] flex-col overflow-y-auto bg-background transition-opacity duration-300 outline-none data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 motion-reduce:duration-150"
          >
            <div className="flex h-[52px] shrink-0 items-center justify-between border-b border-gold-line px-5">
              <Monograma />
              <Dialog.Close aria-label="Fechar" className={BOTAO}>
                <Data />
                <span aria-hidden="true" className="relative block size-5">
                  <span className="absolute inset-x-0 top-1/2 h-px rotate-45 bg-current" />
                  <span className="absolute inset-x-0 top-1/2 h-px -rotate-45 bg-current" />
                </span>
              </Dialog.Close>
            </div>

            <Dialog.Title className="sr-only">Seções do site</Dialog.Title>
            <nav aria-label="Seções do site" className="flex flex-1 flex-col items-center justify-center px-7 py-8">
              <ul className="flex flex-col items-center">
                {SECOES.map(({ id, rotulo, href }) => (
                  <li key={id}>
                    {href ? (
                      <Link href={href} className={ITEM}>
                        {rotulo}
                      </Link>
                    ) : (
                      <a
                        href={`#${id}`}
                        onClick={(evento) => {
                          evento.preventDefault();
                          destino.current = id;
                          setAberto(false);
                        }}
                        className={ITEM}
                      >
                        {rotulo}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
            <div aria-hidden="true" className="toile h-20 shrink-0 border-t border-gold-line" />
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </motion.header>
  );
}
