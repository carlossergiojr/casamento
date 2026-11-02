import Link from "next/link";
import { TelaInterna, tituloInterno } from "@/components/interno";

/** Endereço errado ou presente já presenteado (specs/002 FR-001). Vira o 404.html do Pages. */
export default function NaoEncontrada() {
  return (
    <TelaInterna voltar="/" rotuloVoltar="Início">
      <main className="flex flex-1 flex-col items-center gap-5 px-7 pt-14 pb-10 text-center">
        <p className="sobretitulo">Página não encontrada</p>
        <h1 className={tituloInterno}>Esse caminho não leva ao convite</h1>
        <p className="max-w-[34ch] text-[15px] text-primary-deep">
          O endereço pode estar incompleto, ou o presente que você procurava já foi escolhido por
          outro convidado.
        </p>
        <div className="mt-3 flex w-full max-w-sm flex-col gap-3">
          <Link href="/" className="botao bg-primary text-card hover:bg-primary-deep">
            Voltar ao convite
          </Link>
          <Link
            href="/#presentes"
            className="botao border border-primary text-primary hover:bg-primary hover:text-card"
          >
            Ver a lista de presentes
          </Link>
        </div>
      </main>
    </TelaInterna>
  );
}
