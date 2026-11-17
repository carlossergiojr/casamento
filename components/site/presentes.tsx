"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "motion/react";
import { useRef, useState } from "react";
import {
  categoriasPresente,
  destaquesPresente,
  formatarValor,
  presentes,
  type CategoriaPresente,
  presenteLivre,
  publico,
  type Presente,
} from "@/lib/conteudo";
import { FormaEtiqueta } from "./etiqueta";
import { IconePresente } from "./icones-presente";
import { Revelar } from "./revelar";
import { useReduzir } from "@/lib/use-reduzir";
import { balanco, ventoTransicao } from "@/lib/vento";

/** Marca como presenteado o que já foi pago (ids lidos do banco no servidor, specs/008). */
const comPagos = (lista: Presente[], pagos: string[]) =>
  lista.map((p) => (pagos.includes(p.id) ? { ...p, presenteado: true } : p));

/** Grade de etiquetas: duas colunas no celular, três a partir do tablet. Espaço vertical para o fio. */
const GRADE = "grid grid-cols-2 gap-x-3.5 gap-y-7 pt-3 md:grid-cols-3";

/** Prévia da página inicial: só os presentes em destaque, como etiquetas. */
export function DestaquesPresentes({ presenteados }: { presenteados: string[] }) {
  const destaques = destaquesPresente
    .map((id) => presentes.find((p) => p.id === id))
    .filter((p): p is Presente => !!p && !p.presenteado && !presenteados.includes(p.id));
  return (
    <Revelar>
      <ul className={GRADE}>
        {destaques.map((p, i) => (
          <li key={p.id} className="flex">
            <EtiquetaPresente presente={p} indice={i} />
          </li>
        ))}
      </ul>
    </Revelar>
  );
}

/**
 * Um presente como etiqueta de papel, levemente torta como as polaroids, pendurada pelo fio:
 * balança com o mesmo vento do Traje enquanto está na tela e endireita no toque. Sem foto, entra o
 * desenho de traço do item. A etiqueta inteira é o link.
 */
function EtiquetaPresente({ presente: p, indice }: { presente: Presente; indice: number }) {
  const reduzir = useReduzir();
  const ref = useRef<HTMLDivElement>(null);
  const naTela = useInView(ref, { margin: "0px 0px -10% 0px" });
  const vento = naTela && !reduzir;
  // Pares de colunas alternam o giro: −, +, +, − … (as vizinhas nunca pendem para o mesmo lado).
  const giro = indice % 4 === 0 || indice % 4 === 3 ? -1.6 : 1.4;
  // O vento passa da esquerda para a direita e de cima para baixo (duas colunas no celular).
  const atraso = (indice % 2) * 0.25 + Math.floor(indice / 2) * 0.4;

  const conteudo = (
    <>
      <FormaEtiqueta />
      {p.foto ? (
        <span className="relative mb-1.5 aspect-[4/3] w-full overflow-hidden rounded-[3px] bg-surface">
          <Image src={p.foto} alt="" fill sizes="(max-width: 768px) 40vw, 180px" className={`object-cover ${p.presenteado ? "grayscale-[40%]" : ""}`} />
        </span>
      ) : (
        <IconePresente presente={p} className="mb-1.5 size-10 text-marinho" />
      )}
      <span className="text-sm leading-[1.3] text-foreground">{p.nome}</span>
      <span className="mt-auto pt-0.5">
        {p.presenteado ? (
          <span className="text-[13px] font-semibold text-gold-text-sm">Presenteado ✓</span>
        ) : (
          <span className="font-serif text-2xl leading-[1.1] text-gold lining-nums">{formatarValor(p.valor)}</span>
        )}
      </span>
    </>
  );
  const classe = "relative isolate flex size-full flex-col items-center gap-1 px-2.5 pt-[34px] pb-4 text-center";
  return (
    // Gira a partir do furo, onde o fio segura a etiqueta.
    <motion.div
      ref={ref}
      tabIndex={-1}
      className="flex w-full"
      style={{ originX: 0.5, originY: 0 }}
      initial={{ rotate: giro }}
      animate={{ rotate: vento ? balanco(giro, 2.2) : giro }}
      transition={vento ? ventoTransicao(atraso) : { duration: 0.6 }}
      whileHover={p.presenteado ? undefined : { rotate: 0, transition: { duration: 0.3 } }}
      whileTap={p.presenteado ? undefined : { rotate: 0, transition: { duration: 0.2 } }}
    >
      {p.presenteado ? (
        <div className={`${classe} opacity-70`}>{conteudo}</div>
      ) : (
        <Link
          href={`/presentes/${p.id}/`}
          aria-label={`${p.nome}, ${formatarValor(p.valor)}. Presentear`}
          className={`${classe} focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary`}
        >
          {conteudo}
        </Link>
      )}
    </motion.div>
  );
}

/** Cota de valor livre (lua de mel): uma etiqueta deitada, para quem prefere não escolher um objeto. */
export function CotaLivre() {
  return (
    <Link
      href={`/presentes/${presenteLivre.id}/`}
      className="group relative isolate flex items-center gap-3.5 py-[18px] pr-[18px] pl-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      <FormaEtiqueta deitada />
      <img src={publico("/estampa/spot-bird.png")} alt="" aria-hidden="true" loading="lazy" className="h-auto w-[52px] flex-none -scale-x-100" />
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="font-serif text-2xl leading-tight text-primary italic">{presenteLivre.nome}</span>
        <span className="text-[13px] text-primary-deep">Você escolhe o valor.</span>
      </span>
      <Seta />
    </Link>
  );
}

function Seta() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" className="flex-none text-primary-deep">
      <path d="M7 3 L13 9 L7 15" />
    </svg>
  );
}

type Filtro = "Todos" | CategoriaPresente;
type Ordem = "sugerida" | "menor" | "maior";
const filtros: Filtro[] = ["Todos", ...categoriasPresente];

/** Página /presentes: filtro por categoria, ordem por preço e as etiquetas em grade. */
export function ListaCompletaPresentes({ presenteados }: { presenteados: string[] }) {
  const [filtro, setFiltro] = useState<Filtro>("Todos");
  const [ordem, setOrdem] = useState<Ordem>("sugerida");

  const todos = comPagos(presentes, presenteados);
  const filtrados = filtro === "Todos" ? todos : todos.filter((p) => p.categoria === filtro);
  // Já presenteados sempre no fim; o resto na ordem escolhida (sort é estável).
  const visiveis = [...filtrados].sort(
    (a, b) =>
      Number(a.presenteado) - Number(b.presenteado) ||
      (ordem === "menor" ? a.valor - b.valor : ordem === "maior" ? b.valor - a.valor : 0),
  );

  // Em "Todos" + ordem sugerida, separa por categoria com um subtítulo; senão, uma grade só.
  const grupos: { titulo?: string; itens: Presente[] }[] = [];
  if (filtro === "Todos" && ordem === "sugerida") {
    for (const p of visiveis) {
      const titulo = p.presenteado ? "Já presenteados" : p.categoria;
      const ultimo = grupos.at(-1);
      if (ultimo?.titulo === titulo) ultimo.itens.push(p);
      else grupos.push({ titulo, itens: [p] });
    }
  } else {
    grupos.push({ itens: visiveis });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none]" aria-label="Filtrar presentes por categoria">
        {filtros.map((f) => (
          <button
            key={f}
            type="button"
            aria-pressed={filtro === f}
            onClick={() => setFiltro(f)}
            className={`min-h-11 shrink-0 rounded-[3px] border px-3.5 text-sm font-semibold whitespace-nowrap transition-colors ${
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

      {grupos.map((g, gi) => (
        <section key={g.titulo ?? gi} className="flex flex-col gap-1 pt-2">
          {g.titulo && <h2 className="font-serif text-[26px] text-primary italic">{g.titulo}</h2>}
          <ul className={GRADE}>
            {g.itens.map((p, i) => (
              <li key={p.id} className="flex">
                <EtiquetaPresente presente={p} indice={i} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
