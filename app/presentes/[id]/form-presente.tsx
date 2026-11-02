"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { campo, rotuloCampo } from "@/components/interno";
import { guardarPresente } from "@/lib/presente-escolhido";

export function FormPresente({ id }: { id: string }) {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [recado, setRecado] = useState("");

  function continuar(e: React.FormEvent) {
    e.preventDefault();
    guardarPresente(id, { nome: nome.trim(), recado: recado.trim() });
    router.push(`/presentes/${id}/pagamento`);
  }

  return (
    <form onSubmit={continuar} className="flex flex-1 flex-col gap-5">
      <div className="flex flex-col gap-2">
        <label htmlFor="g-nome" className={rotuloCampo}>
          Seu nome
        </label>
        <input id="g-nome" required autoComplete="name" value={nome} onChange={(e) => setNome(e.target.value)} className={campo} />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="g-email" className={rotuloCampo}>
          E-mail (para receber a confirmação)
        </label>
        <input id="g-email" type="email" required autoComplete="email" className={campo} />
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
      <button type="submit" className="botao mt-auto w-full bg-primary text-card hover:bg-primary-deep">
        Ir para o pagamento
      </button>
    </form>
  );
}
