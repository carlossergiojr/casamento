# Cavi 2027 — orientação para agentes

Site do casamento de Victória & Carlos (Next.js 16 + Tailwind 4 + shadcn/ui + Motion,
na Vercel com Neon + Drizzle; o GitHub Pages só redireciona os QR Codes antigos). Antes de mudar qualquer coisa, leia a constituição: `.specify/memory/constitution.md`
— ela prevalece sobre qualquer convenção. Features relevantes passam por Spec Kit
(`/speckit-specify` → `/speckit-plan` → `/speckit-tasks` → `/speckit-implement`).

## O que falta

`PENDENCIAS.md` é a lista viva do que falta. Quando perguntarem "o que falta?", "onde estamos?"
ou pedirem a próxima tarefa, responda a partir dela, seguindo a ordem das listas (uma de cada
vez). Ao concluir algo, marque o item e mova para "Feito" com a data, no mesmo commit.

## Regras práticas

- Visual: `specs/001-visual-do-site/DESIGN.md` é a fonte (tokens, medidas, onde vai a estampa).
  Tokens só pelo nome (`text-primary`, `bg-surface`, `text-gold`, `border-gold-line`), nunca hex
  solto em componente novo. Sem gradiente; sombra só nas polaroids; cantos de 3px.
- Mobile-first: confira toda tela em 375–390px. Alvos de toque ≥ 44px, inputs com fonte 16px.
- Animação com `motion/react`; toda animação respeita `useReduzir()` (`lib/use-reduzir.ts`; não use o `useReducedMotion()` do Motion, que quebra a hidratação — specs/007). Entrada de bloco
  por `<Revelar>` (`components/site/revelar.tsx`).
- Conteúdo editável (textos, datas, fotos, presentes, convites de exemplo) só em
  `lib/conteudo.ts`. Fotos de exemplo vêm de picsum.photos até as reais chegarem.
- Cabeçalhos utilitários do tema em `app/globals.css`: `sobretitulo`, `botao`, `toile`.
  (Não use `overline`: é classe do Tailwind para text-decoration.)
- Primitivas de UI pelo `npx shadcn@latest add` (estilo base-nova, Base UI).
- Banco (specs/006): schema em `lib/db/schema.ts`; mudou → `npm run db:gerar` e versione a migration
  de `drizzle/` (o build da Vercel aplica). Gravação só por Server Action com zod (`app/*/acoes.ts`).
  Convites e convidados reais só no banco, nunca no repositório (é público).
- `/noivos`: senha única (`NOIVOS_SENHA`) e cookie assinado (`SESSAO_SEGREDO`), `lib/sessao.ts`;
  toda ação dos noivos passa por `comSessao`. Pagamento dos presentes ainda é só visual.
- Publicação: a Vercel publica cada push (prévia por branch, produção na `main`), com
  `DATABASE_URL`, `DATABASE_URL_UNPOOLED`, `NOIVOS_SENHA`, `SESSAO_SEGREDO`. O GitHub Pages
  (`carlossergiojr.github.io/casamento/`, o endereço dos QR) publica só `redirecionamento/`
  (workflow `.github/workflows/pages.yml`); trocar o domínio = trocar `DESTINO` lá.

## Verificar

`npx tsc --noEmit && npm run build`, e a tela conferida no navegador em tamanho de celular.
Local: Postgres + `.env.local` (ver `specs/006-banco-e-senha/quickstart.md`), `npm run db:migrar`
e `npm run db:semente` (convites CAVI01–03 de teste).

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
