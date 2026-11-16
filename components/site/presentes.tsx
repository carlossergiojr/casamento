"use client";

import Link from "next/link";
import { useState } from "react";
import { categoriasPresente, formatarValor, presentes, type CategoriaPresente } from "@/lib/conteudo";
import { FotoPresente } from "./foto-presente";
import { Revelar } from "./revelar";

type Filtro = "Todos" | CategoriaPresente;
const filtros: Filtro[] = ["Todos", ...categoriasPresente];

/** Grade da lista de presentes com filtro por categoria (são ~60 itens). */
export function GradePresentes() {
  const [filtro, setFiltro] = useState<Filtro>("Todos");
  const visiveis = filtro === "Todos" ? presentes : presentes.filter((p) => p.categoria === filtro);

  return (
    <>
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
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {visiveis.map((p, i) => (
          <Revelar key={p.id} atraso={(i % 2) * 0.08} className="flex flex-col rounded-[3px] border border-surface bg-card">
            <div className="relative h-[130px] bg-surface">
              <FotoPresente
                presente={p}
                sizes="(max-width: 768px) 45vw, 200px"
                className={p.presenteado ? "opacity-60 grayscale-[40%]" : ""}
              />
            </div>
            <div className="flex flex-1 flex-col gap-1 p-3">
              <span className="text-sm leading-[1.35]">{p.nome}</span>
              <span className="font-serif text-2xl text-gold lining-nums">{formatarValor(p.valor)}</span>
              <div className="mt-auto pt-1.5">
                {p.presenteado ? (
                  <span className="block rounded-[3px] border border-gold-line px-1.5 py-[13px] text-center text-xs font-semibold tracking-[0.12em] text-gold-text-sm uppercase">
                    Presenteado ✓
                  </span>
                ) : (
                  <Link
                    href={`/presentes/${p.id}`}
                    className="block rounded-[3px] border border-primary px-1.5 py-[13px] text-center text-xs font-semibold tracking-[0.12em] text-primary uppercase transition-colors hover:bg-primary hover:text-card"
                  >
                    Presentear
                  </Link>
                )}
              </div>
            </div>
          </Revelar>
        ))}
      </div>
    </>
  );
}
