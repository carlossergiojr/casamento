---
description: "Tarefas da 004 — Barra de atalhos"
---

# Tasks: Barra de atalhos

**Input**: [spec.md](./spec.md), [plan.md](./plan.md)

## Phase 1: US1 — Ir direto ao que procuro (P1)

- [X] T001 [US1] `components/site/barra-atalhos.tsx`: quatro atalhos com ícone e rótulo (D1)
- [X] T002 [US1] Aparece depois da capa, sem esconder ao rolar (D2)
- [X] T003 [US1] Atalho ativo pela seção no meio da tela (D3)
- [X] T004 [US1] Montar a barra em `app/page.tsx`, dentro do `#site` (D5)

## Phase 2: US2 — A barra não atrapalha (P1)

- [X] T005 [P] [US2] Some com campo de texto em foco (D4)
- [X] T006 [P] [US2] Safe area: `viewportFit: "cover"` + `env(safe-area-inset-bottom)` (D5)
- [X] T007 [P] [US2] Espaço extra no rodapé e toasts acima da barra (D6)

## Phase 3: Verificação

- [X] T008 `npx tsc --noEmit && npm run build` verde
- [X] T009 Conferir no navegador em 375px e desktop
