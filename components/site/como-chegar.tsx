"use client";

import { ChevronRight, Copy, MapPin, Navigation, CarFront } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { casamento, enderecoCompleto, mapaRota, mapaUber, mapaWaze } from "@/lib/conteudo";

const OPCOES = [
  { rotulo: "Google Maps", href: mapaRota, Icone: MapPin },
  { rotulo: "Waze", href: mapaWaze, Icone: Navigation },
  { rotulo: "Uber", href: mapaUber, Icone: CarFront },
];

const LINHA =
  "flex min-h-14 w-full items-center gap-3.5 px-1 text-left text-base font-medium text-foreground focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary";
const BOLINHA = "flex size-[34px] flex-none items-center justify-center rounded-full border border-gold-line text-primary";

/** Gaveta que sobe de baixo com as formas de chegar ao Campestre (specs/007). */
export function ComoChegar({ aberto, mudar }: { aberto: boolean; mudar: (aberto: boolean) => void }) {
  async function copiar() {
    try {
      await navigator.clipboard.writeText(enderecoCompleto);
      toast("Endereço copiado");
    } catch {
      toast("Não deu para copiar — segure o endereço para copiar à mão");
    }
  }

  return (
    <Dialog open={aberto} onOpenChange={mudar}>
      <DialogContent
        showCloseButton={false}
        className="top-auto bottom-0 max-w-[640px] translate-y-0 gap-0 rounded-none rounded-t-[14px] border-t border-gold-line bg-background px-5 pt-2.5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] ring-0 sm:max-w-[640px] data-open:slide-in-from-bottom data-open:zoom-in-100 data-closed:slide-out-to-bottom data-closed:zoom-out-100"
      >
        <div aria-hidden="true" className="mx-auto mb-3 h-1 w-10 rounded-[3px] bg-line" />
        <DialogTitle className="text-center font-serif text-[30px] font-normal text-primary italic">Como chegar</DialogTitle>
        <DialogDescription className="mb-2.5 text-center text-[13px] text-primary-deep">
          {casamento.local.endereco} · {casamento.local.cidade}
        </DialogDescription>
        <ul className="border-t border-surface">
          {OPCOES.map(({ rotulo, href, Icone }) => (
            <li key={rotulo} className="border-b border-surface">
              <a href={href} target="_blank" rel="noopener noreferrer" className={LINHA}>
                <span className={BOLINHA}>
                  <Icone aria-hidden="true" className="size-[18px]" strokeWidth={1.5} />
                </span>
                {rotulo}
                <ChevronRight aria-hidden="true" className="ml-auto size-4 text-line" />
              </a>
            </li>
          ))}
          <li className="border-b border-surface">
            <button type="button" onClick={copiar} className={LINHA}>
              <span className={BOLINHA}>
                <Copy aria-hidden="true" className="size-[18px]" strokeWidth={1.5} />
              </span>
              Copiar endereço
            </button>
          </li>
        </ul>
        <button
          type="button"
          onClick={() => mudar(false)}
          className="mt-2.5 min-h-11 w-full text-[15px] text-primary-deep"
        >
          Fechar
        </button>
      </DialogContent>
    </Dialog>
  );
}
