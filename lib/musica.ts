"use client";

import { useSyncExternalStore } from "react";
import { musica } from "./conteudo";

/*
 * Música de fundo, um <audio> só para o site todo. Fica fora do React para continuar tocando
 * entre as páginas. O navegador só deixa tocar com som depois de um toque da pessoa: quem chama
 * `tocarMusica()` é o toque em "Abrir" da cortina.
 */
let audio: HTMLAudioElement | null = null;
let ligada = false;
let tocando = false;
const avisos = new Set<() => void>();

function avisar() {
  avisos.forEach((f) => f());
}

function pegarAudio() {
  if (!audio) {
    audio = new Audio(musica);
    audio.loop = true;
    audio.addEventListener("play", () => {
      tocando = true;
      avisar();
    });
    audio.addEventListener("pause", () => {
      tocando = false;
      avisar();
    });
  }
  return audio;
}

/** Começa a música subindo o volume aos poucos (~2 s). */
export function tocarMusica() {
  const a = pegarAudio();
  ligada = true;
  a.volume = 0;
  a.play().catch(() => {
    // Bloqueado ou sem rede: o botão de som fica disponível para tentar de novo.
  });
  const passo = setInterval(() => {
    a.volume = Math.min(1, a.volume + 0.05);
    if (a.volume >= 1) clearInterval(passo);
  }, 100);
  avisar();
}

export function alternarMusica() {
  const a = pegarAudio();
  if (a.paused) {
    a.volume = 1;
    a.play().catch(() => {});
  } else a.pause();
}

function assinar(f: () => void) {
  avisos.add(f);
  return () => avisos.delete(f);
}

/** `ligada`: a pessoa entrou com música (o botão aparece). `tocando`: está tocando agora. */
export function useMusica() {
  const l = useSyncExternalStore(assinar, () => ligada, () => false);
  const t = useSyncExternalStore(assinar, () => tocando, () => false);
  return { ligada: l, tocando: t };
}
