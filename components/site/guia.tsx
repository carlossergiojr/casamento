import { Camera, Church, Clock, Flower2, Heart, Mail, Sparkles, Sun, Users, type LucideIcon } from "lucide-react";
import { guiaConvidado, guiaFecho } from "@/lib/conteudo";
import { Revelar } from "./revelar";

const ICONES: Record<string, LucideIcon> = {
  envelope: Mail,
  relogio: Clock,
  igreja: Church,
  camera: Camera,
  coracao: Heart,
  sol: Sun,
  flor: Flower2,
  pessoas: Users,
};

/** "Guia do convidado", o mesmo do cartão impresso que vai no envelope. */
export function Guia() {
  return (
    <section id="guia" className="flex flex-col gap-7 bg-surface px-6 py-16">
      <Revelar>
        <h2 className="text-center font-serif text-[40px] leading-[1.1] text-primary italic">Guia do convidado</h2>
      </Revelar>
      <Revelar>
        <ul className="flex flex-col gap-4">
          {guiaConvidado.map(({ icone, texto }) => {
            const Icone = ICONES[icone] ?? Heart;
            return (
              <li key={texto} className="flex items-center gap-4">
                <Icone aria-hidden="true" className="size-6 flex-none text-primary" strokeWidth={1.25} />
                <span className="font-serif text-[20px] leading-snug text-foreground">{texto}</span>
              </li>
            );
          })}
        </ul>
      </Revelar>
      <Revelar className="flex items-center justify-center gap-2.5 border-t border-gold-line pt-6">
        <Sparkles aria-hidden="true" className="size-5 flex-none text-gold" strokeWidth={1.25} />
        <p className="font-serif text-[22px] text-primary-deep italic">{guiaFecho}</p>
      </Revelar>
    </section>
  );
}
