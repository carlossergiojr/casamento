"use client";

import Link from "next/link";
import { useEffect } from "react";
import { TelaInterna, tituloInterno } from "@/components/interno";

/**
 * Erro inesperado (sem internet no meio de uma tela, banco fora do ar): em português e com
 * saída, no lugar da tela padrão do Next em inglês.
 */
export default function Erro({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <TelaInterna voltar="/" rotuloVoltar="Início">
      <main className="flex flex-1 flex-col items-center gap-5 px-7 pt-14 pb-10 text-center">
        <p className="sobretitulo">Algo não carregou</p>
        <h1 className={tituloInterno}>Deu um tropeço por aqui</h1>
        <p className="max-w-[34ch] text-[15px] text-primary-deep">
          Pode ter sido a internet. Confira a conexão e tente de novo; o que você já enviou antes
          continua guardado.
        </p>
        <div className="mt-3 flex w-full max-w-sm flex-col gap-3">
          <button type="button" onClick={() => retry()} className="botao bg-primary text-card hover:bg-primary-deep">
            Tentar de novo
          </button>
          <Link href="/" className="botao border border-primary text-primary hover:bg-primary hover:text-card">
            Voltar ao convite
          </Link>
        </div>
      </main>
    </TelaInterna>
  );
}
