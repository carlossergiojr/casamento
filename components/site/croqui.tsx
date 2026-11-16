import { publico } from "@/lib/conteudo";

/**
 * Croqui do caminho até o Campestre, no traço da estampa (specs/007). É um desenho sem escala:
 * mostra as referências (Rua Zeus, os condomínios, a ilha); a rota de verdade abre no app de mapa.
 */
export function Croqui() {
  return (
    <svg viewBox="0 0 350 250" aria-hidden="true" className="block h-auto w-full">
      <rect width="350" height="250" fill="var(--card)" />
      <g fill="none" stroke="var(--primary)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        {/* avenida */}
        <path d="M-4 200 C 70 192 150 212 354 194" />
        <path d="M-4 214 C 72 206 150 226 354 208" />
        {/* Rua Zeus */}
        <path d="M146 197 C 143 160 152 118 146 80 C 144 66 150 58 160 54" />
        <path d="M160 202 C 157 160 166 120 160 84 C 159 74 164 68 172 66" />
        {/* chegada */}
        <path d="M160 54 C 190 46 214 50 228 58" />
        <path d="M172 66 C 196 60 212 64 224 70" />
        {/* condomínios */}
        <path d="M28 96 L128 90 L132 182 L32 186 Z" stroke="var(--line)" strokeDasharray="4 4" />
        <path d="M180 134 L262 130 L266 186 L182 188 Z" stroke="var(--line)" strokeDasharray="4 4" />
        {/* lago e ilha */}
        <path d="M236 40 C 262 22 312 24 326 48 C 340 74 318 100 286 102 C 254 104 228 88 230 66 C 231 54 232 46 236 40 Z" stroke="var(--line)" />
        <path d="M272 58 C 280 52 296 54 298 63 C 300 72 288 77 278 74 C 270 71 266 64 272 58 Z" stroke="var(--gold-line)" />
        {/* norte */}
        <path d="M30 52 L30 24 M24 32 L30 24 L36 32" stroke="var(--line)" />
      </g>
      <g fontFamily="var(--font-cormorant), serif" fontStyle="italic" fill="var(--primary-deep)">
        <text x="30" y="18" fontSize="13" textAnchor="middle" fontStyle="normal">
          N
        </text>
        <text x="20" y="236" fontSize="15">
          R. Rubens Francisco Dias
        </text>
        <text x="141" y="150" fontSize="15" transform="rotate(-88 141 150)" textAnchor="middle">
          Rua Zeus
        </text>
        <text x="80" y="142" fontSize="16" textAnchor="middle">
          Aquarela Ville
        </text>
        <text x="223" y="166" fontSize="16" textAnchor="middle">
          Amarilis
        </text>
        <text x="292" y="124" fontSize="20" textAnchor="middle" fontStyle="normal" fill="var(--foreground)">
          Campestre
        </text>
        <text x="300" y="86" fontSize="13" textAnchor="middle" fill="var(--gold-text-sm)">
          a ilha
        </text>
      </g>
      <image href={publico("/estampa/spot-butterfly-2.png")} x="258" y="30" width="44" height="28" />
    </svg>
  );
}
