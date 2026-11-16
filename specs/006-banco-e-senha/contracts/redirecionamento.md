# Contrato: redirecionamento GitHub Pages → Vercel

`redirecionamento/index.html` e `redirecionamento/404.html` (iguais), publicados pelo workflow
`.github/workflows/pages.yml` em `carlossergiojr.github.io/casamento/`.

| Entrada (Pages) | Saída (Vercel) |
|---|---|
| `/casamento/` | `DESTINO/` |
| `/casamento/confirmar/` | `DESTINO/confirmar/` |
| `/casamento/confirmar/CAVI01/` | `DESTINO/confirmar/CAVI01/` |
| `/casamento/confirmar/?c=X#y` | `DESTINO/confirmar/?c=X#y` |
| `/casamento/qualquer/coisa` | `DESTINO/qualquer/coisa` |

Regras:
- `DESTINO` é uma constante no próprio HTML (uma linha para trocar).
- Usa `location.replace` (sem entrada no histórico).
- Sem JavaScript: `<meta http-equiv="refresh" content="0; url=DESTINO/">`.
- `<meta name="robots" content="noindex">` e `<link rel="canonical" href="DESTINO/">`.
- Sem nenhum código ou nome de convidado no arquivo.
