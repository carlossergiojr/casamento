---
description: "Tarefas da 003 — Pente fino e horário das 15h"
---

# Tasks: Pente fino e horário das 15h

**Input**: [spec.md](./spec.md), [plan.md](./plan.md)

## Phase 1: US1 — O horário certo em todo lugar (P1)

- [X] T001 [US1] `casamento.hora` e `inicio` às 15h em `lib/conteudo.ts`; `diaHora` usa a hora (D1)
- [X] T002 [P] [US1] Descrição da prévia em `app/layout.tsx` com `casamento.hora` (D1)
- [X] T003 [P] [US1] "Que alegria!" com `casamento.hora`; `.ics` com revoke adiado (D1, D2)
- [X] T004 [P] [US1] Comentário da contagem; README, DESIGN.md e constituição 1.0.2 (D9)

## Phase 2: US2 — Detalhes visuais (P2)

- [X] T005 [P] [US2] Amostras do dress code com aro branco e contorno (D3)
- [X] T006 [P] [US2] Botões dos presentes e monograma interno ≥ 44px (D4)
- [X] T007 [P] [US2] `lining-nums` na contagem e nos preços (D5)
- [X] T008 [P] [US2] Cartão da capa alinhado à moldura (D6)
- [X] T009 [P] [US2] Títulos da galeria e do "Como chegar" com `<Revelar>` (D7)
- [X] T010 [P] [US2] `motion-safe:animate-pulse` no Pix (D8)

## Phase 3: Verificação

- [X] T011 `npx tsc --noEmit && npm run build` verde; nenhum "16h" no código
- [X] T012 Conferir no navegador em 375px
