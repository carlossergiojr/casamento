import Image from "next/image";
import { publico, type Presente } from "@/lib/conteudo";

/**
 * Foto do presente; enquanto a foto real não chega, uma borboleta da estampa no fundo de papel
 * (nada de foto aleatória que não tem a ver com o item).
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
      {/* eslint-disable-next-line @next/next/no-img-element -- enfeite pequeno de /public */}
      <img src={publico("/estampa/spot-butterfly-1.png")} alt="" aria-hidden="true" className="h-auto w-[34%] max-w-[120px] opacity-40" />
    </div>
  );
}
