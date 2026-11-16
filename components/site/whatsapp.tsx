import { linkWhatsapp } from "@/lib/conteudo";

/** Botão "Falar com os noivos" no WhatsApp; sem número em lib/conteudo.ts, mostra o marcador. */
export function FalarComNoivos({ texto, className = "" }: { texto?: string; className?: string }) {
  const href = linkWhatsapp(texto);
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
