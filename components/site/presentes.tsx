"use client";

import Link from "next/link";
import { useState } from "react";
import {
  categoriasPresente,
  destaquesPresente,
  formatarValor,
  presentes,
  type CategoriaPresente,
  type Presente,
} from "@/lib/conteudo";
import { FotoPresente } from "./foto-presente";
import { Revelar } from "./revelar";

const destaques = destaquesPresente
  .map((id) => presentes.find((p) => p.id === id))
  .filter((p): p is Presente => !!p && !p.presenteado);

/** Prévia da página inicial: só os presentes em destaque, em cartões grandes. */
export function DestaquesPresentes() {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
      {destaques.map((p, i) => (
        <Revelar key={p.id} atraso={(i % 2) * 0.08} className="flex flex-col rounded-[3px] border border-surface bg-card">
          <div className="relative h-[130px] bg-surface">
            <FotoPresente presente={p} sizes="(max-width: 768px) 45vw, 200px" />
          </div>
          <div className="flex flex-1 flex-col gap-1 p-3">
            <span className="text-sm leading-[1.35]">{p.nome}</span>
            <span className="font-serif text-2xl text-gold lining-nums">{formatarValor(p.valor)}</span>
            <div className="mt-auto pt-1.5">
              <Link
                href={`/presentes/${p.id}/`}
                className="block rounded-[3px] border border-primary px-1.5 py-[13px] text-center text-xs font-semibold tracking-[0.12em] text-primary uppercase transition-colors hover:bg-primary hover:text-card"
              >
                Presentear
              </Link>
            </div>
          </div>
        </Revelar>
      ))}
    </div>
  );
}

type Filtro = "Todos" | CategoriaPresente;
type Ordem = "sugerida" | "menor" | "maior";
const filtros: Filtro[] = ["Todos", ...categoriasPresente];

/** Página /presentes: filtro por categoria, ordem por preço e uma linha compacta por presente. */
export function ListaCompletaPresentes() {
  const [filtro, setFiltro] = useState<Filtro>("Todos");
  const [ordem, setOrdem] = useState<Ordem>("sugerida");

  const filtrados = filtro === "Todos" ? presentes : presentes.filter((p) => p.categoria === filtro);
  // Já presenteados sempre no fim; o resto na ordem escolhida (sort é estável).
  const visiveis = [...filtrados].sort(
    (a, b) =>
      Number(a.presenteado) - Number(b.presenteado) ||
      (ordem === "menor" ? a.valor - b.valor : ordem === "maior" ? b.valor - a.valor : 0),
  );
  // Em "Todos" + ordem sugerida, separa por categoria com um subtítulo.
  const comGrupos = filtro === "Todos" && ordem === "sugerida";

  return (
    <div className="flex flex-col gap-4">
      <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none]" aria-label="Filtrar presentes por categoria">
        {filtros.map((f) => (
          <button
            key={f}
            type="button"
            aria-pressed={filtro === f}
            onClick={() => setFiltro(f)}
            className={`min-h-11 shrink-0 rounded-[3px] border px-3.5 text-xs font-semibold tracking-[0.12em] whitespace-nowrap uppercase transition-colors ${
              filtro === f ? "border-primary bg-primary text-card" : "border-line bg-card text-primary"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between gap-3">
        <p className="text-[13px] text-primary-deep" aria-live="polite">
          {visiveis.length} {visiveis.length === 1 ? "presente" : "presentes"}
        </p>
        <label className="flex items-center gap-2 text-[13px] text-primary-deep">
          Ordenar
          <select
            value={ordem}
            onChange={(e) => setOrdem(e.target.value as Ordem)}
            className="h-11 rounded-[3px] border border-line bg-card px-2.5 text-base text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <option value="sugerida">Por categoria</option>
            <option value="menor">Menor preço</option>
            <option value="maior">Maior preço</option>
          </select>
        </label>
      </div>

      <ul className="flex flex-col">
        {visiveis.map((p, i) => {
          const novoGrupo = comGrupos && !p.presenteado && p.categoria !== visiveis[i - 1]?.categoria;
          return (
            <li key={p.id} className="flex flex-col">
              {novoGrupo && <h2 className="sobretitulo pt-5 pb-2 first:pt-1">{p.categoria}</h2>}
              <LinhaPresente presente={p} />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function LinhaPresente({ presente: p }: { presente: Presente }) {
  const conteudo = (
    <>
      <div className="relative size-16 shrink-0 overflow-hidden rounded-[3px] bg-surface">
        <FotoPresente presente={p} sizes="64px" className={p.presenteado ? "opacity-60 grayscale-[40%]" : ""} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="text-[15px] leading-[1.3]">{p.nome}</span>
        <span className="font-serif text-xl text-gold lining-nums">{formatarValor(p.valor)}</span>
      </div>
      {p.presenteado ? (
        <span className="shrink-0 text-xs font-semibold tracking-[0.12em] text-gold-text-sm uppercase">Presenteado ✓</span>
      ) : (
        <span className="flex min-h-11 shrink-0 items-center rounded-[3px] border border-primary px-3 text-xs font-semibold tracking-[0.12em] text-primary uppercase transition-colors group-hover:bg-primary group-hover:text-card">
          Presentear
        </span>
      )}
    </>
  );
  const classe = "flex items-center gap-3 border-b border-surface py-3";
  if (p.presenteado) return <div className={`${classe} opacity-80`}>{conteudo}</div>;
  return (
    <Link href={`/presentes/${p.id}/`} className={`group ${classe} focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary`}>
      {conteudo}
    </Link>
  );
}
