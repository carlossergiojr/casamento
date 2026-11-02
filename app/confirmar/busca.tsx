"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { campo, passo, rotuloCampo, tituloInterno } from "@/components/interno";
import { convitesExemplo } from "@/lib/conteudo";

const normalizar = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();

/** Busca de exemplo no cliente (plan R3) — vira consulta ao banco na feature do RSVP. */
function buscar(termo: string) {
  const t = normalizar(termo);
  if (t.length < 3) return null;
  return convitesExemplo.filter(
    (c) =>
      normalizar(c.codigo) === t ||
      c.pessoas.some((p) => normalizar(p).includes(t)) ||
      normalizar(c.titular).includes(t),
  );
}

function SetaDireita() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#4E5769" strokeWidth="1.5">
      <path d="M7 3 L13 9 L7 15" />
    </svg>
  );
}

export function BuscaConvite() {
  const params = useSearchParams();
  const [termo, setTermo] = useState(params.get("nome") ?? "");
  // "Não encontrei meu nome" abre a mesma orientação de quando a busca não acha nada.
  const [ajuda, setAjuda] = useState(false);
  const resultado = ajuda ? null : buscar(termo);
  const naoEncontrado = ajuda || (resultado !== null && resultado.length === 0);

  return (
    <main className="flex flex-1 flex-col gap-[22px] px-6 py-9">
      <div className="flex flex-col gap-2.5">
        <p className={passo}>Passo 1 de 2</p>
        <h1 className={tituloInterno}>Encontre seu convite</h1>
        {!naoEncontrado && (
          <p className="text-[15px] text-primary-deep">
            Digite seu nome como está no convite, ou o código impresso nele.
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="busca" className={rotuloCampo}>
          Nome ou código
        </label>
        <input
          id="busca"
          type="search"
          autoComplete="name"
          autoFocus
          value={termo}
          onChange={(e) => {
            setTermo(e.target.value);
            setAjuda(false);
          }}
          placeholder="Ex.: Maria Souza"
          className={campo}
        />
      </div>

      <AnimatePresence mode="wait">
        {resultado && resultado.length > 0 && (
          <motion.div
            key="lista"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-2.5"
            aria-live="polite"
          >
            <p className="text-[13px] text-primary-deep">
              {resultado.length === 1 ? "1 convite encontrado" : `${resultado.length} convites encontrados`}
            </p>
            {resultado.map((c) => (
              <Link
                key={c.codigo}
                href={`/confirmar/${c.codigo}`}
                className="flex items-center justify-between gap-3 rounded-[3px] bg-surface p-4 transition-colors hover:bg-[#dfe2e8]"
              >
                <span className="flex flex-col">
                  <span className="font-semibold">{c.titular}</span>
                  <span className="text-[13px] text-primary-deep">
                    {c.pessoas.length === 1 ? "Convite individual" : `Convite para ${c.pessoas.length} pessoas`}
                  </span>
                </span>
                <SetaDireita />
              </Link>
            ))}
            <p className="text-xs text-primary-deep">
              [Nomes de exemplo — experimente “Maria”, “Lima” ou “CAVI01”]
            </p>
          </motion.div>
        )}

        {naoEncontrado && (
          <motion.div
            key="vazio"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-3 rounded-[3px] border border-line px-5 py-7 text-center"
            aria-live="polite"
          >
            <svg aria-hidden="true" width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#636E84" strokeWidth="1.3">
              <circle cx="12" cy="12" r="7.5" />
              <path d="M17.5 17.5 L24 24" />
            </svg>
            <p className="font-serif text-2xl text-primary">Não encontramos esse nome</p>
            <p className="text-[15px] text-primary-deep">
              Tente escrever como está no convite, ou use o código impresso nele. Se mesmo assim
              não aparecer, fale direto com os noivos — eles resolvem pra você.
            </p>
            <p className="pt-1 text-[13px] text-primary-deep">
              A confirmação é só para quem já está na lista de convidados.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => {
          if (naoEncontrado) setTermo("");
          setAjuda(!naoEncontrado);
        }}
        className="mt-auto flex min-h-11 items-center justify-center text-sm text-primary-deep underline decoration-gold-line underline-offset-4"
      >
        {naoEncontrado ? "Tentar de novo" : "Não encontrei meu nome"}
      </button>
    </main>
  );
}
