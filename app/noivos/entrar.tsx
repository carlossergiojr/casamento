"use client";

import { useState, useTransition } from "react";
import { campo, rotuloCampo, tituloInterno } from "@/components/interno";
import { entrar } from "./acoes";

/** Senha única dos noivos (specs/006 US3). Nenhum dado chega ao navegador antes dela. */
export function Entrar() {
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [entrando, iniciar] = useTransition();

  const enviar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senha) return;
    iniciar(async () => {
      const r = await entrar(senha).catch(() => ({ ok: false as const, erro: "Sem conexão. Tente de novo." }));
      if (r.ok) window.location.reload();
      else {
        setErro(r.erro);
        setSenha("");
      }
    });
  };

  return (
    <main className="flex flex-1 flex-col gap-6 px-6 py-9">
      <div className="flex flex-col gap-2">
        <p className="sobretitulo">Só de vocês dois</p>
        <h1 className={tituloInterno}>Área dos noivos</h1>
      </div>
      <form onSubmit={enviar} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="senha" className={rotuloCampo}>
            Senha
          </label>
          <input
            id="senha"
            type="password"
            autoComplete="current-password"
            className={campo}
            value={senha}
            onChange={(e) => {
              setSenha(e.target.value);
              setErro("");
            }}
            aria-invalid={!!erro}
            aria-describedby={erro ? "erro-senha" : undefined}
            autoFocus
          />
          {erro && (
            <p id="erro-senha" role="alert" className="text-sm text-destructive">
              {erro}
            </p>
          )}
        </div>
        <button type="submit" disabled={!senha || entrando} className="botao bg-primary text-card hover:bg-primary-deep disabled:opacity-50">
          {entrando ? "Entrando…" : "Entrar"}
        </button>
      </form>
      <p className="text-[13px] text-primary-deep">Uma senha só para os dois. Fica conectado neste aparelho por 30 dias.</p>
    </main>
  );
}
