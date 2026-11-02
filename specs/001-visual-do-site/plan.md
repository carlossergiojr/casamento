# Implementation Plan: Visual do site

**Branch**: `001-visual-do-site` | **Date**: 2026-11-01 | **Spec**: [spec.md](./spec.md)

## Summary

Construir todas as telas do handoff (`design/`) em Next.js, só com o front: envelope de
abertura animado, página inicial com 9 seções, 4 telas de RSVP e 3 de presentes, tudo com dados
de exemplo de um arquivo de conteúdo. Publicar na Vercel e apontar o GitHub Pages antigo para o
site novo.

## Technical Context

- **Linguagem/versão**: TypeScript strict, Next.js 16 (App Router), React 19.
- **UI**: Tailwind CSS 4 + shadcn/ui (estilo base-nova), ícones lucide.
- **Animação**: Motion (`motion/react`) — envelope, entradas por viewport, galeria.
- **Fontes**: `next/font/google` — Cormorant Garamond (300/400/500 + itálico) e Karla (400/500/600).
- **Imagens**: `next/image`; fotos de exemplo de `picsum.photos` (liberado em `remotePatterns`).
- **Dados**: nenhum banco. `lib/conteudo.ts` concentra textos, datas, endereço, fotos, presentes
  e convites de exemplo.
- **Testes**: nesta feature, verificação visual no navegador (390px) + `npm run build`. Testes
  automatizados entram com as regras de negócio (RSVP/pagamento).
- **Hospedagem**: Vercel (região `gru1`). GitHub Pages (`carlossergiojr.github.io/casamento/`)
  vira um redirecionamento que preserva caminho e query (QR Codes já impressos).

## Constitution Check

| Princípio | Como esta feature cumpre |
|---|---|
| I. Simples | Sem banco, sem estado global; um arquivo de conteúdo; componentes por seção. |
| II. Visual | Tokens do DESIGN.md no tema; 390px de referência; `useReducedMotion` em toda animação. |
| III. Sem login | Nenhuma tela pede conta ou senha. |
| IV. Servidor decide | Nada é gravado; telas de pagamento são prévia e não enviam dados. |
| V. Dados com registro | N/A (sem banco nesta feature). |

## Estrutura

```text
app/
  layout.tsx            # fontes, metadata, <Toaster/>
  globals.css           # tokens do DESIGN.md mapeados para o tema shadcn
  page.tsx              # Envelope + página inicial
  confirmar/            # RSVP: page (busca/nao-encontrado), [codigo]/page, concluido/page
  presentes/[id]/       # detalhe, pagamento/, obrigado/
components/
  envelope.tsx          # abertura animada (client)
  site/                 # header, capa, contagem, historia, galeria, dress-code,
                        # presentes, rsvp-chamada, como-chegar, rodape, revelar (fade-in)
  interno/              # faixa toile + nav "Voltar · C & V" das telas internas
  ui/                   # shadcn
lib/conteudo.ts         # todo o conteúdo editável
public/estampa/         # toile.jpg, spot-bird.png, spot-butterfly-1/2.png
```

## Decisões

- **R1 Envelope**: overlay fixo em tela cheia. Envelope em CSS (corpo creme, forro toile, aba
  triangular com `rotateX` em 3D, selo dourado). Sequência: aba abre → cartão sobe → overlay faz
  fade. `sessionStorage` lembra que já abriu (com try/catch). Sem JS, o site aparece direto.
- **R2 Rotas em português** (`/confirmar`, `/presentes/[id]`), alinhadas ao glossário.
- **R3 Busca de exemplo** filtra convites fixos de `lib/conteudo.ts` no cliente; vira consulta
  ao banco na feature do RSVP.
- **R4 Pagamento** é só visual: campos de cartão sem `name`, nenhum `<form>` enviado; aviso
  "prévia" visível.
- **R5 Redirecionamento** do GitHub Pages: `index.html` + `404.html` com
  `location.replace(NOVO + caminho + query)`, para qualquer formato de QR.
