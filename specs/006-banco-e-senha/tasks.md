---
description: "Tarefas da feature 006 — banco, senha dos noivos e RSVP de verdade"
---

# Tasks: Banco, senha dos noivos e RSVP de verdade

**Input**: `specs/006-banco-e-senha/` (plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md)

**Tests**: sem suíte automatizada (não pedida). A validação é o roteiro de [quickstart.md](quickstart.md)
com Playwright contra servidor local + Postgres local, mais `npx tsc --noEmit && npm run build`.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: pode rodar em paralelo (arquivos diferentes, sem dependência pendente)
- **[Story]**: US1–US5 do spec.md

---

## Phase 1: Setup

- [ ] T001 Instalar dependências: `drizzle-orm`, `pg`, `zod`, `jose`, `server-only`; dev: `drizzle-kit`, `@types/pg` (package.json)
- [ ] T002 Tirar `output: "export"`, `basePath` e `env.NEXT_PUBLIC_BASE_PATH` de `next.config.ts` (manter `trailingSlash: true`, `images.unoptimized`, regra do turbopack); comentário explicando Vercel + redirecionamento
- [ ] T003 [P] `drizzle.config.ts` (dialect postgresql, schema `lib/db/schema.ts`, out `drizzle/`, url `DATABASE_URL_UNPOOLED ?? DATABASE_URL`)
- [ ] T004 [P] Scripts no package.json: `"build": "node scripts/migrar.mjs && next build"`, `"db:gerar": "drizzle-kit generate"`, `"db:migrar": "node scripts/migrar.mjs"`, `"db:semente": "node scripts/semente-exemplo.mjs"`

## Phase 2: Foundational (bloqueia todas as histórias)

- [ ] T005 Schema Drizzle em `lib/db/schema.ts` conforme data-model.md: `convites` (codigo único "maiúsculas, sem espaços, 3–20 caracteres `[A-Z0-9-]`"; lado "`Victória` | `Carlos` | `Os dois`"; restricao "≤ 300"), `pessoas` (FK `on delete cascade`, resposta "`pendente` | `vem` | `nao-vem`" default `pendente`, ordem), `gastos` (centavos integer ≥ 0, vencimento date null, estimado boolean), `tarefas`, `notas`, `tentativas` (bigserial, índice tipo+chave+criada_em)
- [ ] T006 Conexão em `lib/db/index.ts` (`server-only`, `pg.Pool` com `DATABASE_URL`, `drizzle(pool, { schema })`, um pool por instância via `globalThis`)
- [ ] T007 Gerar a primeira migration em `drizzle/` com `npm run db:gerar`
- [ ] T008 [P] `scripts/migrar.mjs`: sem `DATABASE_URL` → avisa e sai 0; senão migra com `drizzle-orm/node-postgres/migrator` usando `DATABASE_URL_UNPOOLED ?? DATABASE_URL`
- [ ] T009 [P] `lib/codigo.ts`: `normalizarCodigo` (maiúsculas, sem espaços/acentos) e `gerarCodigo` (6 de `ABCDEFGHJKMNPQRSTUVWXYZ23456789`, `crypto.getRandomValues`)
- [ ] T010 [P] `lib/limite.ts` (`server-only`): `ipDaRequisicao()` por `headers()` `x-forwarded-for`; `checarLimite(tipo, chave, max, minutos)`, `registrar(tipo, chave)`, `limpar(tipo, chave)`; apaga linhas com mais de 1 dia
- [ ] T011 [P] `casamento.fimRsvp = "2027-01-03T23:59:59-03:00"` e `prazoEncerrado()` em `lib/conteudo.ts`; `publico()` sem prefixo quando não houver basePath
- [ ] T012 [P] `scripts/semente-exemplo.mjs`: cria CAVI01–03 (os de `convitesExemplo`) se não existirem — só desenvolvimento
- [ ] T013 Postgres local + `.env.local` (não versionado) e rodar migrar + semente (quickstart "Pré-requisitos")

**Checkpoint**: banco local com tabelas e convites de exemplo.

## Phase 3: US1 — O QR impresso continua funcionando (P1)

**Goal**: endereço antigo leva ao mesmo caminho na Vercel. **Independent test**: quickstart cenário 8.

- [ ] T014 [P] [US1] `redirecionamento/index.html` e `redirecionamento/404.html` iguais, conforme contracts/redirecionamento.md (constante `DESTINO`, `location.replace`, meta refresh, noindex, canonical; visual mínimo com o fundo do site)
- [ ] T015 [P] [US1] `scripts/checar-redirecionamento.mjs <origem> <destino> [códigos…]`: abre com Playwright cada caso do contrato e confere a URL final; sai ≠ 0 se algum falhar
- [ ] T016 [US1] Validar local: servir `redirecionamento/` sob `/casamento/` (servidor estático com fallback 404) e rodar T015
- [ ] T017 [US1] Preparar `.github/workflows/pages.yml` para publicar `redirecionamento/` (sem npm/build), com `DESTINO` a preencher — só entra em vigor no merge da main (plan "Ordem de entrega")

## Phase 4: US2 — Confirmar presença de verdade (P1)

**Goal**: RSVP grava no banco, com prazo. **Independent test**: quickstart cenários 1–3.

- [ ] T018 [US2] `app/confirmar/acoes.ts` (`"use server"`): `buscarConvite(termo)` (limite busca 30/10 min; < 3 letras → `null`; código exato ou parte do nome sem acento; máx. 5 `{ codigo, titular }`) e `responderConvite({ codigo, respostas, restricao })` (zod; limite resposta 20/10 min; recusa após `fimRsvp`; respostas cobrindo exatamente as pessoas; restricao ≤ 300; transação; `respondido_em = now()`)
- [ ] T019 [US2] `app/confirmar/[codigo]/page.tsx`: sem `generateStaticParams`; lê convite pelo código normalizado; inexistente → `redirect("/confirmar/?naoEncontrado=1")`; passa só `{ codigo, titular, pessoas: { id, nome, resposta }, restricao, prazoEncerrado }`
- [ ] T020 [US2] `app/confirmar/[codigo]/resposta.tsx`: pré-marcar respostas e restrição; enviar por `responderConvite`; erro → toast; prazo encerrado → aviso "O prazo terminou em 3 de janeiro. Fale direto com os noivos." no lugar dos botões; sucesso → `/confirmar/concluido/?c=CÓDIGO`
- [ ] T021 [US2] `app/confirmar/busca.tsx`: busca pela ação (debounce ~300 ms, estado de carregando); `?naoEncontrado=1` abre a orientação de "não encontrei"
- [ ] T022 [US2] `app/confirmar/concluido`: página de servidor lê o convite pelo `c` e mostra Vai/Não vai por pessoa (sem `r` na URL); agenda e pétalas como hoje
- [ ] T023 [US2] Tirar `convitesExemplo` do uso no site (fica só como fonte da semente em `scripts/`), atualizando `lib/conteudo.ts`

## Phase 5: US3 — Área dos noivos com senha e dados compartilhados (P1)

**Goal**: `/noivos` protegido, dados no banco. **Independent test**: quickstart cenários 4–5.

- [ ] T024 [P] [US3] `lib/sessao.ts` (`server-only`): `criarSessao()`, `sessaoValida()`, `apagarSessao()`, `exigirNoivos()`; cookie `noivos` JWT HS256 com `SESSAO_SEGREDO`, `httpOnly`, `secure` em produção, `sameSite=lax`, `path=/`, 30 dias
- [ ] T025 [US3] `app/noivos/acoes.ts` (`"use server"`): `entrar(senha)` (SHA-256 + `timingSafeEqual` contra `NOIVOS_SENHA`; 5 erros/15 min → "Muitas tentativas. Tente de novo em 15 minutos."; sucesso limpa), `sair()`; CRUD com zod e `exigirNoivos()`: `salvarConvite` (código vazio → gera; repetido → "Código já usado"), `apagarConvite`, `salvarGasto`, `apagarGasto`, `salvarTarefa`, `apagarTarefa`, `marcarTarefa`, `salvarNota`, `apagarNota`; `revalidatePath("/noivos")`; sem sessão → `{ ok: false, erro: "sessao" }`
- [ ] T026 [US3] `lib/noivos.ts`: tirar localStorage/useSyncExternalStore; ficam tipos (Convidado com `codigo`, `restricao`, `respondidoEm`, `pessoas: { id?, nome, resposta }[]`), `lerReais`, `mostrarReais`, `linkWhatsApp`, `fasesPadrao`, `gastosSugeridos`, e `lerDadosNoivos()` server-only em `lib/noivos-servidor.ts`
- [ ] T027 [US3] `app/noivos/entrar.tsx`: tela de senha no visual interno (campo 16px, botão "Entrar", erro embaixo)
- [ ] T028 [US3] `app/noivos/page.tsx`: página dinâmica; sem sessão → `<Entrar/>` (nenhum dado no HTML); com sessão → `<AreaNoivos dados={…}/>`; botão "Sair"
- [ ] T029 [US3] `app/noivos/area.tsx`: receber `dados` por prop; trocar `salvar(...)` pelas ações; `useOptimistic` em marcar tarefa; erro `"sessao"` → recarregar para pedir senha; formulário de convite com pessoas e resposta por pessoa, código editável

## Phase 6: US4 — Trazer o que já foi digitado (P2)

**Goal**: cópia/aparelho → banco. **Independent test**: quickstart cenário 6.

- [ ] T030 [US4] `importarCopia(json)` e `exportarCopia()` em `app/noivos/acoes.ts`: aceita formato antigo (pessoas como nomes + `resposta`/`quantosVem` no convite, sem `tarefas`/`notas`) e novo; regra de `quantosVem` da research R8; substitui tudo numa transação; devolve contagens
- [ ] T031 [US4] `Copias` em `app/noivos/area.tsx` usando as ações; confirmação com as contagens
- [ ] T032 [US4] Aviso único quando existir `localStorage["cavi2027:noivos"]`: banco vazio → "Levar para o banco"; senão → "Baixar e apagar deste aparelho"

## Phase 7: US5 — Respostas caindo na lista dos noivos (P2)

**Goal**: a lista mostra o RSVP. **Independent test**: quickstart cenário 7.

- [ ] T033 [US5] Lista de convidados e Resumo em `app/noivos/area.tsx`: contagem por pessoa (vem / não vem / sem resposta), restrição e data da resposta no cartão; código e "Copiar link" (`<origem>/confirmar/CÓDIGO/`) no formulário

## Phase 8: Polish

- [ ] T034 [P] Constituição 1.0.5 (PATCH): horário 15h30/16h20; Vercel + Pages só redirecionando (`.specify/memory/constitution.md`)
- [ ] T035 [P] AGENTS.md (publicação, variáveis, `/noivos` no banco), PENDENCIAS.md (listas 2 e 4)
- [ ] T036 Rodar o roteiro do quickstart (cenários 1–8) com Playwright em 375px; `npx tsc --noEmit && npm run build`; conferir que nenhum segredo/nome real está no repositório

---

## Dependencies & Execution Order

- Setup (T001–T004) → Foundational (T005–T013) → histórias.
- US1 (T014–T017) não depende do banco; pode ir em paralelo com tudo.
- US2 e US3 dependem só da Foundational; entre si são independentes.
- US4 e US5 dependem de US3 (ações e área dos noivos); US5 também de US2 (respostas reais).
- Polish por último.

## Parallel Examples

- Foundational: T008, T009, T010, T011, T012 juntos depois de T005–T006.
- US1: T014 e T015 juntos.
- US3: T024 em paralelo com T018–T023 (US2).

## Implementation Strategy

MVP = Foundational + US2 + US3 (RSVP gravando e área protegida), validados localmente; US1
pronto mas só ligado no merge. Depois US4 (importar o checklist) e US5. A virada para produção
segue a "Ordem de entrega" do plan.md e depende da Vercel configurada pelos noivos.
