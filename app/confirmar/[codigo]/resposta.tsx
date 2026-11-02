"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { passo, tituloInterno } from "@/components/interno";
import { casamento, type Convite } from "@/lib/conteudo";

type Resposta = "vou" | "nao";

/** Vou / Não vou por pessoa (specs/001 US3). Nesta etapa nada é gravado (FR-009). */
export function RespostaConvite({ convite }: { convite: Convite }) {
  const router = useRouter();
  const [respostas, setRespostas] = useState<(Resposta | null)[]>(convite.pessoas.map(() => null));
  const completo = respostas.every((r) => r !== null);
  const primeiroNome = convite.pessoas[0].split(" ")[0];

  function enviar(e: React.FormEvent) {
    e.preventDefault();
    if (!completo) return;
    const r = respostas.map((x) => (x === "vou" ? "1" : "0")).join("");
    router.push(`/confirmar/concluido?c=${convite.codigo}&r=${r}`);
  }

  return (
    <form onSubmit={enviar} className="flex flex-1 flex-col gap-[22px] px-6 py-9">
      <div className="flex flex-col gap-2.5">
        <p className={passo}>Passo 2 de 2</p>
        <h1 className={tituloInterno}>Olá, {primeiroNome}!</h1>
        <p className="text-[15px] text-primary-deep">
          {convite.pessoas.length === 1
            ? `Diga se você vai estar com a gente no dia ${casamento.dataPorExtenso}.`
            : `Seu convite inclui ${convite.pessoas.length} pessoas. Diga quem vai estar com a gente no dia ${casamento.dataPorExtenso}.`}
        </p>
      </div>

      {convite.pessoas.map((pessoa, i) => (
        <fieldset key={pessoa} className="flex flex-col gap-3 rounded-[3px] border border-line px-4 pt-2 pb-[18px]">
          <legend className="px-1.5 font-semibold">{pessoa}</legend>
          <div className="grid grid-cols-2 gap-2.5">
            {(["vou", "nao"] as const).map((opcao) => {
              const marcado = respostas[i] === opcao;
              return (
                <label
                  key={opcao}
                  className={`flex h-12 cursor-pointer items-center justify-center gap-2 rounded-[3px] text-[15px] transition-colors has-focus-visible:ring-2 has-focus-visible:ring-primary has-focus-visible:ring-offset-2 ${
                    marcado
                      ? "bg-primary font-semibold text-card"
                      : "border border-line text-foreground hover:border-primary"
                  }`}
                >
                  <input
                    type="radio"
                    name={`pessoa-${i}`}
                    value={opcao}
                    checked={marcado}
                    onChange={() =>
                      setRespostas((atual) => atual.map((r, j) => (j === i ? opcao : r)))
                    }
                    className="sr-only"
                  />
                  {opcao === "vou" ? "Vou" : "Não vou"}
                </label>
              );
            })}
          </div>
        </fieldset>
      ))}

      <p className="text-[13px] text-primary-deep">
        Os nomes vêm do convite e não podem ser alterados. Dúvidas? Fale direto com os noivos.
      </p>

      <div className="mt-auto flex flex-col items-center gap-2.5">
        <button
          type="submit"
          disabled={!completo}
          className="botao w-full bg-primary text-card hover:bg-primary-deep disabled:cursor-not-allowed disabled:opacity-50"
        >
          Enviar resposta
        </button>
        <p className="text-[13px] text-primary-deep">Prazo: {casamento.prazoRsvp}</p>
      </div>
    </form>
  );
}
