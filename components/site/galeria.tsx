"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { galeria } from "@/lib/conteudo";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const SOMBRA = "shadow-[0_1px_3px_rgb(43_49_64/0.12)]";

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
  const reduzir = useReducedMotion();
  return (
    <motion.div
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

function Foto({ i, sizes }: { i: number; sizes: string }) {
  const f = galeria.fotos[i];
  return (
    <div className="relative h-full w-full bg-surface">
      <Image src={f.src} alt={f.alt} fill sizes={sizes} className="object-cover" />
    </div>
  );
}

export function Galeria() {
  return (
    <section id="galeria" className="flex flex-col gap-7 px-5 pt-16 pb-[72px]">
      <h2 className="text-center font-serif text-[40px] text-primary italic">Pré-wedding</h2>

      <div className="flex flex-col items-center">
        <Polaroid angulo={-3} atraso={0} className="flex w-[270px] flex-col gap-2.5 p-3 pb-10">
          <div className="h-[300px]">
            <Foto i={0} sizes="270px" />
          </div>
          <span className="text-center font-serif text-lg text-primary-deep italic">
            {galeria.legenda}
          </span>
        </Polaroid>
        <div className="-mt-6 flex">
          <Polaroid angulo={4} atraso={0.15} className="w-[170px] translate-x-3 p-2.5 pb-[30px]">
            <div className="h-[170px]">
              <Foto i={1} sizes="170px" />
            </div>
          </Polaroid>
          <Polaroid
            angulo={-2}
            atraso={0.3}
            className="w-[170px] translate-x-[-8px] translate-y-[30px] p-2.5 pb-[30px]"
          >
            <div className="h-[170px]">
              <Foto i={2} sizes="170px" />
            </div>
          </Polaroid>
        </div>
      </div>

      <Dialog>
        <DialogTrigger className="mt-8 flex min-h-11 items-center self-center border-b border-gold-line text-sm font-semibold tracking-[0.12em] text-primary uppercase">
          Ver todas as fotos
        </DialogTrigger>
        <DialogContent className="max-w-[calc(100%-1.5rem)] rounded-[3px] bg-background p-4 pt-12 sm:max-w-xl">
          <DialogTitle className="sr-only">Fotos do pré-wedding</DialogTitle>
          <Carousel opts={{ loop: true }} className="mx-auto w-full">
            <CarouselContent>
              {galeria.fotos.map((f, i) => (
                <CarouselItem key={f.src}>
                  <div className={`bg-card p-2.5 pb-8 ${SOMBRA}`}>
                    <div className="relative aspect-[9/11]">
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
