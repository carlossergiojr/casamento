---
description: "Tarefas da 001 — Visual do site"
---

# Tasks: Visual do site

**Input**: [spec.md](./spec.md), [plan.md](./plan.md), [DESIGN.md](./DESIGN.md), [design/](./design/)

## Phase 1: Setup

- [X] T001 Next.js 16 + Tailwind 4 + shadcn (button, input, label, textarea, radio-group, tabs,
  select, dialog, carousel, sonner, card) + Motion; assets em `public/estampa/`
- [X] T002 Tokens do DESIGN.md em `app/globals.css`; fontes e metadata em `app/layout.tsx`;
  `picsum.photos` em `next.config.ts`
- [X] T003 `lib/conteudo.ts` com textos, datas, endereço, fotos, presentes e convites de exemplo

## Phase 2: US1 — Abrir o convite (P1)

- [X] T004 [US1] `components/envelope.tsx`: envelope animado, "Pular", sessionStorage,
  reduced-motion

## Phase 3: US2 — Página inicial (P1)

- [X] T005 [P] [US2] `components/site/revelar.tsx` (fade/slide por viewport) e `contagem.tsx`
- [X] T006 [US2] Header + capa + cartão sobreposto
- [X] T007 [P] [US2] Nossa história
- [X] T008 [P] [US2] Pré-wedding (polaroids + Dialog/Carousel)
- [X] T009 [P] [US2] Dress code
- [X] T010 [P] [US2] Lista de presentes (grade)
- [X] T011 [P] [US2] Você vem? (input → `/confirmar?nome=`)
- [X] T012 [P] [US2] Como chegar (mapa, abrir rota, copiar endereço) + rodapé
- [X] T013 [US2] `app/page.tsx` montando envelope + seções

## Phase 4: US3 — RSVP (P2)

- [X] T014 [US3] `components/interno/` (faixa toile + nav)
- [X] T015 [US3] `/confirmar` busca + estado não encontrado
- [X] T016 [US3] `/confirmar/[codigo]` Vou/Não vou → `/confirmar/concluido` com resumo e `.ics`

## Phase 5: US4 — Presentes (P2)

- [X] T017 [US4] `/presentes/[id]` detalhe
- [X] T018 [US4] `/presentes/[id]/pagamento` (Pix/Cartão, só visual) → `/presentes/[id]/obrigado`

## Phase 6: Polish & publicação

- [X] T019 Conferir cada tela em 375px contra `design/`
- [ ] T022 Revisão com a skill `web-design-guidelines` (depois da publicação)
- [X] T020 `npm run build` verde; publicar no GitHub Pages (export estático em `/casamento`, Actions)
- [ ] T021 Ao migrar para a Vercel (RSVP com banco): GitHub Pages vira redirecionamento preservando caminho e query
