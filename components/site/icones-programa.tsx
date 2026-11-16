import type { IconePrograma } from "@/lib/conteudo";

/** Ícones de traço fino do cartão "Programação" impresso (taças, alianças, cloche, talheres, bolo). */
const TRACOS: Record<IconePrograma, React.ReactNode> = {
  tacas: (
    <>
      <path d="M5 4h6l-.6 6.2a2.4 2.4 0 0 1-4.8 0Z" />
      <path d="M8 12.6V22M5.5 22h5" />
      <path d="M17 4h6l-.6 6.2a2.4 2.4 0 0 1-4.8 0Z" />
      <path d="M20 12.6V22M17.5 22h5" />
    </>
  ),
  aliancas: (
    <>
      <circle cx="11" cy="17" r="5.5" />
      <circle cx="17.5" cy="17" r="5.5" />
      <path d="M11 9.5 9.2 7.2 11 4.8l1.8 2.4Z" />
    </>
  ),
  cloche: (
    <>
      <path d="M3.5 20.5h21" />
      <path d="M5.5 20.5a8.5 8.5 0 0 1 17 0" />
      <path d="M14 12V9.8M12.3 9.8h3.4" />
    </>
  ),
  talheres: (
    <>
      <path d="M4 4v6a2.2 2.2 0 0 0 4.4 0V4M6.2 4v20" />
      <circle cx="15" cy="14" r="5.2" />
      <path d="M24 4c-1.8 1.2-2.4 4.5-2.4 8.2h2.4V24" />
    </>
  ),
  bolo: (
    <>
      <path d="M4 23h20" />
      <path d="M6 23v-6h16v6" />
      <path d="M8.5 17v-4h11v4" />
      <path d="M14 13V9.5" />
      <path d="M14 6.2c.9.8.9 1.9 0 2.3-.9-.4-.9-1.5 0-2.3Z" />
      <path d="M6 20c2 1 3.3-1 5.3 0s3.4 1 5.4 0 3.3-1 5.3 0" />
    </>
  ),
};

export function IconePrograma({ nome, className }: { nome: IconePrograma; className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 28 28"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.3}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {TRACOS[nome]}
    </svg>
  );
}
