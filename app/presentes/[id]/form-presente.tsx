"use client";

import { useState, useTransition } from "react";
import { campo, rotuloCampo } from "@/components/interno";
import { formatarValor } from "@/lib/conteudo";
import { iniciarPagamento } from "../acoes";

type Livre = { sugestoes: number[]; minimo: number; maximo: number };

/** Só dígitos e uma vírgula: "150", "150,50". Devolve centavos (ou NaN). */
function lerReais(texto: string) {
  const limpo = texto.replace(/[^\d,]/g, "").replace(",", ".");
  return limpo ? Math.round(Number(limpo) * 100) : NaN;
}

export function FormPresente({ id, livre }: { id: string; livre?: Livre }) {
  const [nome, setNome] = useState("");
  const [recado, setRecado] = useState("");
  const [valorTexto, setValorTexto] = useState("");
  const [erroValor, setErroValor] = useState("");
  const [erro, setErro] = useState("");
  const [indo, comecar] = useTransition();

  const centavos = lerReais(valorTexto);

  const valorOk = !!livre && centavos >= livre.minimo * 100 && centavos <= livre.maximo * 100;

  function continuar(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    if (livre && !valorOk) {
      setErroValor(
        centavos > livre.maximo * 100
          ? `Para valores acima de ${formatarValor(livre.maximo * 100)}, fale direto com os noivos.`
          : `Escolha um valor a partir de ${formatarValor(livre.minimo * 100)}.`,
      );
      document.getElementById("g-valor")?.focus();
      return;
    }
    // O preço é decidido no servidor; daqui sai só a escolha. Pix ou cartão na página do MP.
    comecar(async () => {
      const r = await iniciarPagamento({ presenteId: id, nome, recado, valor: livre ? centavos : undefined }).catch(
        () => ({ ok: false as const, erro: "Sem conexão. Tente de novo." }),
      );
      if (r.ok) window.location.assign(r.url);
      else setErro(r.erro);
    });
  }

  return (
    <form onSubmit={continuar} className="flex flex-1 flex-col gap-5">
      {livre && (
        <fieldset className="flex flex-col gap-2.5">
          <legend className={`${rotuloCampo} mb-2`}>Quanto você quer mandar?</legend>
          <div className="grid grid-cols-4 gap-2">
            {livre.sugestoes.map((r) => {
              const ativo = centavos === r * 100;
              return (
                <button
                  key={r}
                  type="button"
                  aria-pressed={ativo}
                  aria-label={formatarValor(r * 100)}
                  onClick={() => {
                    setValorTexto(String(r));
                    setErroValor("");
                  }}
                  className={`h-12 rounded-[3px] border font-serif text-xl lining-nums transition-colors ${
                    ativo ? "border-primary bg-primary text-card" : "border-line bg-card text-primary hover:border-primary"
                  }`}
                >
                  {r}
                </button>
              );
            })}
          </div>
          <label htmlFor="g-valor" className="sr-only">
            Outro valor, em reais
          </label>
          <div className="relative">
            <span aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-primary-deep">
              R$
            </span>
            <input
              id="g-valor"
              inputMode="decimal"
              autoComplete="off"
              placeholder="Outro valor"
              value={valorTexto}
              onChange={(e) => {
                setValorTexto(e.target.value);
                setErroValor("");
              }}
              aria-invalid={!!erroValor}
              aria-describedby={erroValor ? "g-valor-erro" : undefined}
              className={`${campo} pl-11`}
            />
          </div>
          {erroValor && (
            <p id="g-valor-erro" role="alert" className="text-[13px] text-destructive">
              {erroValor}
            </p>
          )}
        </fieldset>
      )}
      <div className="flex flex-col gap-2">
        <label htmlFor="g-nome" className={rotuloCampo}>
          Seu nome
        </label>
        <input id="g-nome" required autoComplete="name" value={nome} onChange={(e) => setNome(e.target.value)} className={campo} />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="g-msg" className={rotuloCampo}>
          Recadinho para os noivos (opcional)
        </label>
        <textarea
          id="g-msg"
          rows={3}
          value={recado}
          onChange={(e) => setRecado(e.target.value)}
          className={`${campo} h-auto py-3 leading-normal`}
        />
      </div>
      <div className="mt-auto flex flex-col gap-2.5">
        {erro && (
          <p role="alert" className="text-center text-[13px] text-destructive">
            {erro}
          </p>
        )}
        <button
          type="submit"
          disabled={indo}
          className="botao w-full bg-primary text-card hover:bg-primary-deep disabled:opacity-70"
        >
          {indo
            ? "Abrindo o pagamento…"
            : valorOk
              ? `Mandar ${formatarValor(centavos)}`
              : "Pagar com Pix ou cartão"}
        </button>
        <p className="text-center text-[13px] text-primary-deep">
          Você paga no Mercado Pago, em ambiente seguro, e volta para cá.
        </p>
      </div>
    </form>
  );
}
