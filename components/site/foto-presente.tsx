import Image from "next/image";
import type { Presente } from "@/lib/conteudo";
import { IconePresente } from "./icones-presente";

/**
 * Foto do presente; enquanto a foto real não chega, o desenho de traço do item (o mesmo das
 * etiquetas da lista), nada de foto aleatória que não tem a ver com ele.
 */
export function FotoPresente({
  presente,
  sizes,
  priority,
  className = "",
}: {
  presente: Presente;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  if (presente.foto) {
    return (
      <Image src={presente.foto} alt={presente.nome} fill priority={priority} sizes={sizes} className={`object-cover ${className}`} />
    );
  }
  return (
    <div className={`absolute inset-0 flex items-center justify-center ${className}`}>
      <IconePresente presente={presente} traco={0.6} className="size-[38%] max-h-[120px] max-w-[120px] text-marinho" />
    </div>
  );
}
