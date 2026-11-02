# Implementation Plan: Ajustes do review

**Branch**: `002-ajustes-do-review` | **Date**: 2026-11-01 | **Spec**: [spec.md](./spec.md)

## Summary

Corrigir os achados do review da 001 sem mudar o desenho: figuras da estampa inteiras, página
404, prévia de compartilhamento e ícone, sincronia capa ↔ envelope, galeria em telas baixas,
tipografia, foco/teclado/leitor de tela e limpeza. Mesma stack e mesma hospedagem (GitHub Pages).

## Technical Context

Igual à 001 (Next.js 16 export estático em `/casamento`, Tailwind 4, shadcn base-nova, Motion).
Nada novo a instalar.

## Constitution Check

| Princípio | Como esta feature cumpre |
|---|---|
| I. Simples | Ajustes pontuais nos componentes existentes; um evento de janela, sem estado global. |
| II. Visual | É o foco: AA, foco visível, reduced-motion, 320px. |
| III. Sem login | Inalterado. |
| IV. Servidor decide | Inalterado (nada é gravado). |
| V. Dados com registro | N/A. |

## Decisões

- **D0 Figuras**: os `spot-*.png` do handoff já vinham cortados (meia asa, cauda e asa do
  pássaro fora do quadro). Novos recortes tirados da `toile.jpg`: maior componente conexo da
  tinta, sem galhos vizinhos, ampliado 3× e com fundo transparente na cor da estampa. Nas telas,
  só largura fixa e `h-auto` (nada de `size-*`/altura fixa que distorça).
- **D1 404**: `app/not-found.tsx` usando `TelaInterna` (faixa toile + "Voltar · V & C"). O
  export gera `out/404.html`, que o GitHub Pages serve sozinho. `notFound()` do presente
  presenteado já cai nela; ela oferece "Ver a lista de presentes" além de "Voltar ao convite".
- **D2 Compartilhamento**: `metadataBase: new URL("https://carlossergiojr.github.io/casamento/")`,
  `openGraph` (type website, locale pt_BR, siteName) e `twitter: summary_large_image` em
  `app/layout.tsx`. Imagem em `app/opengraph-image.tsx` com `ImageResponse` (estática):
  creme, borda dourada, "Victória & Carlos Sergio", data e local. Se a fonte não carregar no
  build, usar um PNG fixo em `public/og.png`.
- **D3 Ícone**: `app/icon.svg` com "V&C" em serif sobre `--primary`, e `app/apple-icon.png`
  180px. Remover `app/favicon.ico` do modelo.
- **D4 Capa ↔ envelope**: o envelope, ao terminar, marca `html[data-convite="aberto"]` e
  dispara `cavi:convite-aberto` na `window`. A capa só anima quando o atributo já existe no
  mount ou quando o evento chega. Helper `useConviteAberto()` em `lib/convite-aberto.ts`.
- **D5 Galeria**: imagem do diálogo com `max-h-[80dvh] w-auto object-contain`.
- **D6 Tipografia**: `text-balance` em `h1/h2/h3` (`@layer base` em `globals.css`),
  `text-pretty` nos parágrafos longos.
- **D7 Envelope 320px**: nomes do cartão com tamanho em `clamp()` e `whitespace-nowrap`.
- **D8 Foco**: tirar `autoFocus` da busca. Em `campo` (`components/interno.tsx`) e no input de
  `secoes.tsx`: `focus-visible:ring-2 ring-primary/60 ring-offset-2 ring-offset-background`.
  Conferir o mesmo nos botões (`botao`).
- **D9 Envelope modal**: enquanto fechado, o conteúdo do site recebe `inert`; o envelope tem
  `role="dialog" aria-modal="true" aria-label="Convite"` e o botão recebe foco ao montar (sem
  scroll). Ao sair, remove o `inert`.
- **D10 Rótulos PT**: editar `components/ui/dialog.tsx` e `components/ui/carousel.tsx`:
  "Fechar", "Foto anterior", "Próxima foto".
- **D11 Abas**: usar o `Tabs` do shadcn (Base UI já faz setas/Home/End) no pagamento.
- **D12 Sem JS**: `<noscript>` com estilo que zera opacidade/transform de `[data-revelar]`.
- **D13 Limpeza**: `-webkit-tap-highlight-color: transparent` e `touch-action: manipulation`
  no envelope; apagar `public/{file,globe,next,vercel,window}.svg`.

## Verificação

`npx tsc --noEmit && npm run build`, depois no navegador: 320px, 375px, 812×375 (deitado) e
desktop; Tab do envelope ao rodapé; `/casamento/xyz/` e `/casamento/presentes/passeio/` no
export local; validador de Open Graph no site publicado.
