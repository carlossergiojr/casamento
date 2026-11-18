"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView } from "motion/react";
import { useReduzir } from "@/lib/use-reduzir";
import { galeria } from "@/lib/conteudo";
import { Revelar } from "./revelar";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const SOMBRA = "shadow-[0_1px_3px_rgb(43_49_64/0.12)]";
/** De quanto em quanto tempo uma das três polaroids troca de foto (uma por vez, em rodízio). */
const TROCA_MS = 2500;
const POLAROIDS = 3;

/** Polaroid que "cai" girando até o ângulo final ao entrar na tela. */
function Polaroid({
  angulo,
  atraso,
  className,
  children,
}: {
  angulo: number;
  atraso: number;
  className: string;
  children: React.ReactNode;
}) {
  const reduzir = useReduzir();
  return (
    <motion.div
      data-revelar
      className={`bg-card ${SOMBRA} ${className}`}
      initial={reduzir ? { opacity: 0, rotate: angulo } : { opacity: 0, y: 40, rotate: angulo * 3 }}
      whileInView={{ opacity: 1, y: 0, rotate: angulo }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 1, delay: atraso, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Fotos de uma polaroid empilhadas; só a da vez aparece, as outras somem num fade lento.
 * Todas ficam montadas para a troca não piscar enquanto a próxima carrega.
 */
function Revezando({ polaroid, vez, sizes }: { polaroid: number; vez: number; sizes: string }) {
  const fotos = galeria.fotos.filter((_, i) => i % POLAROIDS === polaroid);
  const atual = vez % fotos.length;
  return (
    <div className="relative h-full w-full bg-surface">
      {fotos.map((f, i) => (
        <Image
          key={f.src}
          src={f.src}
          alt={i === atual ? f.alt : ""}
          aria-hidden={i !== atual}
          fill
          sizes={sizes}
          className={`object-cover transition-opacity duration-[1500ms] ease-in-out ${
            i === atual ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
    </div>
  );
}

function Foto({ i, sizes }: { i: number; sizes: string }) {
  const f = galeria.fotos[i];
  return (
    <div className="relative h-full w-full bg-surface">
      <Image src={f.src} alt={f.alt} fill sizes={sizes} className="object-cover" />
    </div>
  );
}

export function Galeria() {
  const reduzir = useReduzir();
  const secao = useRef<HTMLElement>(null);
  const naTela = useInView(secao, { margin: "0px 0px -20% 0px" });
  const [passo, setPasso] = useState(0);

  useEffect(() => {
    if (reduzir || !naTela) return;
    const id = setInterval(() => setPasso((p) => p + 1), TROCA_MS);
    return () => clearInterval(id);
  }, [reduzir, naTela]);

  /** Quantas vezes a polaroid `n` já trocou: a cada passo, troca a polaroid `passo % 3`. */
  const vez = (n: number) => Math.floor((passo + POLAROIDS - 1 - n) / POLAROIDS);

  return (
    <section ref={secao} id="galeria" className="flex flex-col gap-7 px-5 pt-16 pb-[72px]">
      <Revelar>
        <h2 className="text-center font-serif text-[40px] text-primary italic">Pré-wedding</h2>
      </Revelar>

      <div className="flex flex-col items-center">
        <Polaroid angulo={-3} atraso={0} className="w-[min(270px,80vw)] p-3 pb-10">
          <div className="h-[300px]">
            <Revezando polaroid={0} vez={vez(0)} sizes="270px" />
          </div>
        </Polaroid>
        <div className="-mt-6 flex">
          <Polaroid angulo={4} atraso={0.15} className="w-[min(170px,44vw)] translate-x-3 p-2.5 pb-[30px]">
            <div className="aspect-[150/170]">
              <Revezando polaroid={1} vez={vez(1)} sizes="170px" />
            </div>
          </Polaroid>
          <Polaroid
            angulo={-2}
            atraso={0.3}
            className="w-[min(170px,44vw)] translate-x-[-8px] translate-y-[30px] p-2.5 pb-[30px]"
          >
            <div className="aspect-[150/170]">
              <Revezando polaroid={2} vez={vez(2)} sizes="170px" />
            </div>
          </Polaroid>
        </div>
      </div>

      <Dialog>
        <DialogTrigger className="mt-8 flex min-h-11 items-center self-center text-[15px] font-semibold text-primary underline decoration-gold-line underline-offset-4">
          Ver todas as fotos
        </DialogTrigger>
        <DialogContent className="max-w-[calc(100%-1.5rem)] rounded-[3px] bg-background p-4 pt-12 sm:max-w-xl">
          <DialogTitle className="sr-only">Fotos do pré-wedding</DialogTitle>
          <Carousel opts={{ loop: true }} className="mx-auto w-full min-w-0">
            <CarouselContent>
              {galeria.fotos.map((f, i) => (
                <CarouselItem key={f.src}>
                  <div className={`mx-auto max-w-[calc((100dvh-9.5rem)*2/3)] bg-card p-2.5 pb-8 ${SOMBRA}`}>
                    <div className="relative aspect-[2/3]">
                      <Foto i={i} sizes="(max-width: 640px) 90vw, 560px" />
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2 bg-background/90" />
            <CarouselNext className="right-2 bg-background/90" />
          </Carousel>
        </DialogContent>
      </Dialog>
    </section>
  );
}
