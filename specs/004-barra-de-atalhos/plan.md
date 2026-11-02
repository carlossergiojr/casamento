# Implementation Plan: Barra de atalhos

**Branch**: `004-barra-de-atalhos` | **Date**: 2026-11-02 | **Spec**: [spec.md](./spec.md)

## Summary

Um componente cliente, `components/site/barra-atalhos.tsx`, dentro do `#site` da página
inicial. Nada a instalar (ícones do `lucide-react`, que já vem com o shadcn, e um cabide
desenhado à mão).

## Constitution Check

| Princípio | Como esta feature cumpre |
|---|---|
| I. Simples | Um componente, links de âncora nativos, dois observadores. |
| II. Visual | Creme + fio dourado, rótulos sempre visíveis, ≥ 44px, reduced-motion. |
| III–V | Inalterados. |

## Decisões

- **D1 Itens e ordem**: ordem da página — Traje, Presentes, Confirmar, Local. Ícones de traço
  1.25: cabide (próprio, o "Shirt" do lucide é camiseta), `Gift`, `MailCheck`, `MapPin`.
  "Confirmar" se destaca com o ícone num círculo azul cheio.
- **D2 Quando aparece**: listener de rolagem passivo; visível com `scrollY > 24` (o primeiro
  gesto, sem disparar com o "quique" do iOS). Só volta a esconder no topo. Sem esconder ao
  rolar para baixo (previsível para quem não usa apps).
- **D3 Seção ativa**: `IntersectionObserver` com `rootMargin: "-45% 0px -50% 0px"` (uma faixa
  no meio da tela) sobre as quatro seções. No toque, o atalho vira ativo na hora e o observador
  fica em pausa até a rolagem parar (150ms sem `scroll`).
- **D3b Destaque do ativo**: rótulo e ícone em `text-gold-text-sm` (inativos em `text-primary`;
  antes o ativo era `text-primary` e o inativo `text-primary-deep/75`, quase a mesma cor). Fio
  dourado de 3px com `layoutId` (desliza entre os atalhos, mola), ícone sobe 2px e cresce 8%,
  "Confirmar" ganha `ring` dourado. Com reduced-motion: só troca de cor, sem deslizar.
- **D4 Teclado**: `focusin`/`focusout` no documento; com `input`/`textarea`/`select` em foco a
  barra sai.
- **D5 Posição**: `fixed inset-x-0 bottom-0 z-40 mx-auto max-w-[640px]`, `pb` com
  `env(safe-area-inset-bottom)`; `viewport.viewportFit = "cover"` em `app/layout.tsx`. Fica
  dentro do `#site`, então herda o `inert` do envelope.
- **D6 Espaço no fim**: rodapé com `pb` extra (altura da barra + safe area). Toaster com
  `offset`/`mobileOffset` de 88px embaixo.
- **D7 Rolagem**: as âncoras usam o `scroll-behavior: smooth` que já existe (e que já é
  desligado com reduced-motion).

## Verificação

`npx tsc --noEmit && npm run build`; navegador em 375px e desktop: aparecer/sumir, cada
atalho, item ativo, rodapé inteiro, toast acima da barra, foco no campo do RSVP.
