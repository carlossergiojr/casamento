"use client";

import { AnimatePresence, motion } from "motion/react";
import { alternarMusica, useMusica } from "@/lib/musica";

/** Botão redondo no canto para pausar e voltar a música. Só aparece para quem entrou com música. */
export function BotaoSom() {
  const { ligada, tocando } = useMusica();
  return (
    <AnimatePresence>
      {ligada && (
        <motion.button
          type="button"
          onClick={alternarMusica}
          aria-label={tocando ? "Pausar a música" : "Tocar a música"}
          aria-pressed={tocando}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed right-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-40 grid size-11 cursor-pointer place-items-center rounded-full border border-gold-line bg-background text-gold-text-sm touch-manipulation focus-visible:ring-2 focus-visible:ring-gold-line focus-visible:outline-none"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 9v6h4l5 4V5L8 9H4z" />
            {tocando ? (
              <path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11" strokeLinecap="round" />
            ) : (
              <path d="M16.5 9.5l5 5M21.5 9.5l-5 5" strokeLinecap="round" />
            )}
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
