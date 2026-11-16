"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { campo, passo, rotuloCampo, tituloInterno } from "@/components/interno";
import { casamento } from "@/lib/conteudo";
import type { ConvitePublico } from "@/lib/convites-servidor";
import { responderConvite } from "../acoes";

type Resposta = "vou" | "nao";

/** Vou / Não vou por pessoa, gravado no banco (specs/006 US2). Abre já com a resposta anterior. */
export function RespostaConvite({ convite, prazoEncerrado }: { convite: ConvitePublico; prazoEncerrado: boolean }) {
  const router = useRouter();
  const [enviando, iniciar] = useTransition();
  const [respostas, setRespostas] = useState<(Resposta | null)[]>(
    convite.pessoas.map((p) => (p.resposta === "vem" ? "vou" : p.resposta === "nao-vem" ? "nao" : null)),
  );
  const [restricao, setRestricao] = useState(convite.restricao);
  const completo = respostas.every((r) => r !== null);
  const primeiroNome = (convite.pessoas[0]?.nome ?? convite.titular).split(" ")[0];

  function enviar(e: React.FormEvent) {
    e.preventDefault();
    if (!completo || prazoEncerrado) return;
    iniciar(async () => {
      const r = await responderConvite({
        codigo: convite.codigo,
        respostas: convite.pessoas.map((p, i) => ({ pessoaId: p.id, resposta: respostas[i] === "vou" ? "vem" : "nao-vem" })),
        restricao: respostas.includes("vou") ? restricao : "",
      });
      if (r.ok) router.push(`/confirmar/concluido/?c=${convite.codigo}`);
      else toast.error(r.erro);
    });
  }

  if (prazoEncerrado) {
    return (
      <main className="flex flex-1 flex-col gap-[22px] px-6 py-9">
        <h1 className={tituloInterno}>Olá, {primeiroNome}!</h1>
        <p className="text-[15px] text-primary-deep">
          O prazo para confirmar terminou em {casamento.prazoRsvp}. Para mudar alguma coisa, fale direto com os
          noivos.
        </p>
        {convite.respondido && (
          <ul className="flex flex-col gap-2 rounded-[3px] bg-surface p-4">
            {convite.pessoas.map((p) => (
              <li key={p.id} className="flex justify-between gap-3">
                <span>{p.nome}</span>
                <span className="font-semibold text-primary">
                  {p.resposta === "vem" ? "Vai" : p.resposta === "nao-vem" ? "Não vai" : "Sem resposta"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </main>
    );
  }

  return (
    <form onSubmit={enviar} className="flex flex-1 flex-col gap-[22px] px-6 py-9">
      <div className="flex flex-col gap-2.5">
        <p className={passo}>Passo 2 de 2</p>
        <h1 className={tituloInterno}>Olá, {primeiroNome}!</h1>
        <p className="text-[15px] text-primary-deep">
          {convite.respondido
            ? "Você já respondeu. Se algo mudou, é só alterar e enviar de novo."
            : convite.pessoas.length === 1
            ? `Diga se você vai estar com a gente no dia ${casamento.dataPorExtenso}.`
            : `Seu convite inclui ${convite.pessoas.length} pessoas. Diga quem vai estar com a gente no dia ${casamento.dataPorExtenso}.`}
        </p>
      </div>

      {convite.pessoas.map(({ id, nome: pessoa }, i) => (
        <fieldset key={id} className="flex flex-col gap-3 rounded-[3px] border border-line px-4 pt-2 pb-[18px]">
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

      {respostas.includes("vou") && (
        <div className="flex flex-col gap-1.5">
          <label htmlFor="restricao" className={rotuloCampo}>
            Alguma restrição alimentar ou alergia? (opcional)
          </label>
          <input
            id="restricao"
            name="restricao"
            maxLength={300}
            value={restricao}
            onChange={(e) => setRestricao(e.target.value)}
            className={campo}
            placeholder="Ex.: alergia a camarão, vegetariano"
          />
        </div>
      )}

      <p className="text-[13px] text-primary-deep">
        Os nomes vêm do convite e não podem ser alterados. Dúvidas? Fale direto com os noivos.
      </p>

      <div className="mt-auto flex flex-col items-center gap-2.5">
        <button
          type="submit"
          disabled={!completo || enviando}
          className="botao w-full bg-primary text-card hover:bg-primary-deep disabled:cursor-not-allowed disabled:opacity-50"
        >
          {enviando ? "Enviando…" : "Enviar resposta"}
        </button>
        <p className="text-[13px] text-primary-deep">Prazo: {casamento.prazoRsvp}</p>
      </div>
    </form>
  );
}
