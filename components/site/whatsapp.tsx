import { linkWhatsapp } from "@/lib/conteudo";

/** Botão "Falar com os noivos" no WhatsApp; sem número em lib/conteudo.ts, mostra o marcador. */
export function FalarComNoivos({ className = "" }: { className?: string }) {
  const href = linkWhatsapp();
  if (!href) {
    return <p className={`text-center text-[13px] text-primary-deep ${className}`}>[WhatsApp dos noivos a definir]</p>;
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`botao border border-primary text-primary hover:bg-primary hover:text-card ${className}`}
    >
      Falar com os noivos no WhatsApp
    </a>
  );
}

/** O mesmo contato, como link no meio do texto ("Chama a gente no WhatsApp"). */
export function LinkWhatsapp({ children }: { children: React.ReactNode }) {
  const href = linkWhatsapp();
  if (!href) return <>{children}</>;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex min-h-11 items-center text-primary underline decoration-gold-line underline-offset-4"
    >
      {children}
    </a>
  );
}
