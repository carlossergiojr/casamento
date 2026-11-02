---
description: "Tarefas da 002 — Ajustes do review"
---

# Tasks: Ajustes do review

**Input**: [spec.md](./spec.md), [plan.md](./plan.md)

## Phase 1: US1 — Link bonito e sem becos sem saída (P1)

- [ ] T001 [US1] `app/not-found.tsx` em PT no visual do site, com "Voltar ao convite" e "Ver a
  lista de presentes" (D1)
- [ ] T002 [P] [US1] `metadataBase`, `openGraph` e `twitter` em `app/layout.tsx` (D2)
- [ ] T003 [P] [US1] `app/opengraph-image.tsx` 1200×630 estático (D2)
- [ ] T004 [P] [US1] `app/icon.svg` + `app/apple-icon.png`; remover `app/favicon.ico` (D3)

## Phase 2: US2 — Animações, figuras e textos (P1)

- [X] T019 [US2] Borboletas e pássaro inteiros, recortados da `toile.jpg`, com `h-auto` (D0)
- [ ] T005 [US2] `useConviteAberto()` + evento `cavi:convite-aberto`; capa só anima depois (D4)
- [ ] T006 [P] [US2] Galeria ampliada limitada a `80dvh` (D5)
- [ ] T007 [P] [US2] `text-balance` nos títulos, `text-pretty` nos parágrafos (D6)
- [ ] T008 [P] [US2] Cartão do envelope sem quebra em 320px (D7)

## Phase 3: US3 — Teclado e leitor de tela (P2)

- [ ] T009 [P] [US3] Tirar `autoFocus` da busca do RSVP (D8)
- [ ] T010 [P] [US3] Anel de foco visível em campos e botões (D8)
- [ ] T011 [US3] Envelope como diálogo modal: `inert` no site, foco no envelope (D9)
- [ ] T012 [P] [US3] Rótulos PT em `ui/dialog.tsx` e `ui/carousel.tsx` (D10)
- [ ] T013 [P] [US3] Abas Pix/Cartão com setas do teclado (D11)

## Phase 4: US4 — Robustez e limpeza (P3)

- [ ] T014 [P] [US4] Seções visíveis sem JS (`noscript` + `data-revelar`) (D12)
- [ ] T015 [P] [US4] Envelope sem realce de toque; apagar SVGs do modelo em `public/` (D13)

## Phase 5: Verificação e publicação

- [ ] T016 `npx tsc --noEmit && npm run build` verde
- [ ] T017 Conferir no navegador: 320px, 375px, 812×375, desktop, teclado, 404 no export local
- [ ] T018 Commit e push na `main`; conferir o workflow do Pages e a prévia no validador de
  Open Graph
