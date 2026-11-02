"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { campo, rotuloCampo } from "@/components/interno";

type Metodo = "pix" | "cartao";

/**
 * Prévia visual do pagamento (plan R4): campos sem `name`, nada é enviado nem guardado.
 * O Mercado Pago entra numa feature própria.
 */
export function Pagamento({ id, valor }: { id: string; valor: string }) {
  const [metodo, setMetodo] = useState<Metodo>("pix");

  // Abas acessíveis: setas, Home e End trocam de aba (specs/002 FR-012).
  function teclas(e: React.KeyboardEvent<HTMLDivElement>) {
    const outro: Metodo = metodo === "pix" ? "cartao" : "pix";
    const proximo: Metodo | null =
      e.key === "ArrowRight" || e.key === "ArrowLeft" ? outro
      : e.key === "Home" ? "pix"
      : e.key === "End" ? "cartao"
      : null;
    if (!proximo) return;
    e.preventDefault();
    setMetodo(proximo);
    document.getElementById(`aba-${proximo}`)?.focus();
  }

  return (
    <>
      <div role="tablist" aria-label="Forma de pagamento" onKeyDown={teclas} className="grid grid-cols-2 rounded-[3px] border border-line p-1">
        {(
          [
            ["pix", "Pix"],
            ["cartao", "Cartão"],
          ] as const
        ).map(([m, rotulo]) => (
          <button
            key={m}
            type="button"
            role="tab"
            id={`aba-${m}`}
            aria-controls={`painel-${m}`}
            aria-selected={metodo === m}
            tabIndex={metodo === m ? 0 : -1}
            onClick={() => setMetodo(m)}
            className={`h-11 rounded-[2px] text-sm font-semibold tracking-[0.12em] uppercase transition-colors ${
              metodo === m ? "bg-primary text-card" : "text-primary hover:bg-surface"
            }`}
          >
            {rotulo}
          </button>
        ))}
      </div>

      {metodo === "pix" ? (
        <div role="tabpanel" id="painel-pix" aria-labelledby="aba-pix" className="flex flex-col items-center gap-4 text-center">
          <div className="flex size-[200px] items-center justify-center border border-line bg-card text-[11px] tracking-[0.14em] text-primary-deep">
            [QR CODE PIX]
          </div>
          <p className="text-[15px] text-primary-deep">
            Abra o app do seu banco e escaneie, ou copie o código abaixo.
          </p>
          <button
            type="button"
            onClick={() => toast("Pix copiado (prévia — ainda sem código real)")}
            className="botao w-full border border-primary text-primary hover:bg-primary hover:text-card"
          >
            Copiar código Pix
          </button>
          <p className="flex items-center gap-2 text-[13px] text-primary-deep">
            <span className="size-2 animate-pulse rounded-full bg-gold-line" />
            Aguardando pagamento — esta tela atualiza sozinha
          </p>
        </div>
      ) : (
        <div role="tabpanel" id="painel-cartao" aria-labelledby="aba-cartao" className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="c-num" className={rotuloCampo}>
              Número do cartão
            </label>
            <input id="c-num" inputMode="numeric" autoComplete="off" className={campo} />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="c-nome" className={rotuloCampo}>
              Nome impresso no cartão
            </label>
            <input id="c-nome" autoComplete="off" className={campo} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <label htmlFor="c-val" className={rotuloCampo}>
                Validade
              </label>
              <input id="c-val" placeholder="MM/AA" autoComplete="off" className={campo} />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="c-cvv" className={rotuloCampo}>
                CVV
              </label>
              <input id="c-cvv" inputMode="numeric" autoComplete="off" className={campo} />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="c-parc" className={rotuloCampo}>
              Parcelas
            </label>
            <select id="c-parc" className={campo}>
              <option>1x de {valor}</option>
            </select>
          </div>
        </div>
      )}

      <div className="mt-auto flex flex-col items-center gap-2.5">
        <Link href={`/presentes/${id}/obrigado`} className="botao w-full bg-primary text-card hover:bg-primary-deep">
          {metodo === "pix" ? "Simular pagamento aprovado" : `Pagar ${valor}`}
        </Link>
        <p className="text-center text-[13px] text-primary-deep">
          Prévia do site: nenhum pagamento é feito e nenhum dado é enviado.
        </p>
      </div>
    </>
  );
}
