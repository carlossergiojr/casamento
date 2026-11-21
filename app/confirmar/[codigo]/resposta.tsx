"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { passo, tituloInterno } from "@/components/interno";
import { LinkWhatsapp } from "@/components/site/whatsapp";
import { casamento } from "@/lib/conteudo";
import { guardarMeuConvite } from "@/lib/meu-convite";
import type { ConvitePublico } from "@/lib/convites-servidor";
import { responderConvite } from "../acoes";

type Resposta = "vou" | "nao";

/** Vou / Não vou por pessoa, gravado no banco (specs/006 US2). Abre já com a resposta anterior. */
export function RespostaConvite({
  convite,
  prazoEncerrado,
  daBusca,
}: {
  convite: ConvitePublico;
  prazoEncerrado: boolean;
  /** Chegou pela busca (passo 2 de 2); pelo site (QR ou convite lembrado), sem passos. */
  daBusca: boolean;
}) {
  const router = useRouter();
  const [enviando, iniciar] = useTransition();
  const [respostas, setRespostas] = useState<(Resposta | null)[]>(
    convite.pessoas.map((p) => (p.resposta === "vem" ? "vou" : p.resposta === "nao-vem" ? "nao" : null)),
  );
  const [erro, setErro] = useState("");
  const completo = respostas.every((r) => r !== null);
  const primeiroNome = (convite.pessoas[0]?.nome ?? convite.titular).split(" ")[0];

  // Achou o convite pela busca: o aparelho passa a lembrar dele, como se tivesse vindo pelo QR.
  useEffect(() => guardarMeuConvite(convite.codigo), [convite.codigo]);

  function enviar(e: React.FormEvent) {
    e.preventDefault();
    if (!completo || prazoEncerrado) return;
    setErro("");
    iniciar(async () => {
      // Sem internet, a ação falha: avisa aqui mesmo e mantém as escolhas marcadas.
      const r = await responderConvite({
        codigo: convite.codigo,
        respostas: convite.pessoas.map((p, i) => ({ pessoaId: p.id, resposta: respostas[i] === "vou" ? "vem" : "nao-vem" })),
      }).catch(() => ({ ok: false as const, erro: "Sem conexão. Confira a internet e tente de novo." }));
      if (r.ok) {
        // `replace` + `refresh`: o "voltar" do celular não cai na versão antiga do formulário.
        router.refresh();
        router.replace(`/confirmar/concluido/?c=${convite.codigo}`);
      } else setErro(r.erro);
    });
  }

  if (prazoEncerrado) {
    return (
      <main className="flex flex-1 flex-col gap-[22px] px-6 py-9">
        <h1 className={tituloInterno}>Olá, {primeiroNome}!</h1>
        <p className="text-[15px] text-primary-deep">
          O prazo para confirmar terminou em {casamento.prazoRsvp}. Precisa mudar alguma coisa?{" "}
          <LinkWhatsapp>
            Chama a gente no WhatsApp
          </LinkWhatsapp>
          .
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
    <main className="flex flex-1 flex-col">
      <form onSubmit={enviar} className="flex flex-1 flex-col gap-[22px] px-6 py-9">
        <div className="flex flex-col gap-2.5">
          {daBusca && <p className={passo}>Passo 2 de 2</p>}
          <h1 className={tituloInterno}>Olá, {primeiroNome}!</h1>
          <p className="text-[15px] text-primary-deep">
            {convite.respondido
              ? "Você já respondeu. Se algo mudou, é só alterar e enviar de novo."
              : convite.pessoas.length === 1
              ? `Diga se você vai estar com a gente no dia ${casamento.dataPorExtenso}.`
              : `Seu convite inclui ${convite.pessoas.length} pessoas. Diga quem vai estar com a gente no dia ${casamento.dataPorExtenso}.`}
          </p>
          <p className="text-[13px] text-primary-deep">
            Às {casamento.hora}, no {casamento.local.nome} ·{" "}
            <Link href="/#local" className="underline decoration-gold-line underline-offset-4">
              ver como chegar
            </Link>
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

        <p className="text-[13px] text-primary-deep">
          Algum nome errado ou ficou alguma dúvida?{" "}
          <LinkWhatsapp>
            Chama a gente no WhatsApp
          </LinkWhatsapp>
          .
        </p>

        <div className="mt-auto flex flex-col items-center gap-2.5">
          {erro && (
            <p role="alert" className="w-full text-center text-[15px] text-destructive">
              {erro}
            </p>
          )}
          {!completo && (
            <p className="text-center text-[13px] text-primary-deep">
              {convite.pessoas.length === 1 ? "Marque Vou ou Não vou para enviar." : "Marque Vou ou Não vou para cada pessoa."}
            </p>
          )}
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
    </main>
  );
}
