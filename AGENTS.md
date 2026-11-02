# Cavi 2027 — orientação para agentes

Site do casamento de Victória & Carlos Sergio (Next.js 16 + Tailwind 4 + shadcn/ui + Motion,
no GitHub Pages por enquanto; Vercel quando houver servidor). Antes de mudar qualquer coisa, leia a constituição: `.specify/memory/constitution.md`
— ela prevalece sobre qualquer convenção. Features relevantes passam por Spec Kit
(`/speckit-specify` → `/speckit-plan` → `/speckit-tasks` → `/speckit-implement`).

## Regras práticas

- Visual: `specs/001-visual-do-site/DESIGN.md` é a fonte (tokens, medidas, onde vai a estampa).
  Tokens só pelo nome (`text-primary`, `bg-surface`, `text-gold`, `border-gold-line`), nunca hex
  solto em componente novo. Sem gradiente; sombra só nas polaroids; cantos de 3px.
- Mobile-first: confira toda tela em 375–390px. Alvos de toque ≥ 44px, inputs com fonte 16px.
- Animação com `motion/react`; toda animação respeita `useReducedMotion()`. Entrada de bloco
  por `<Revelar>` (`components/site/revelar.tsx`).
- Conteúdo editável (textos, datas, fotos, presentes, convites de exemplo) só em
  `lib/conteudo.ts`. Fotos de exemplo vêm de picsum.photos até as reais chegarem.
- Cabeçalhos utilitários do tema em `app/globals.css`: `sobretitulo`, `botao`, `toile`.
  (Não use `overline`: é classe do Tailwind para text-decoration.)
- Primitivas de UI pelo `npx shadcn@latest add` (estilo base-nova, Base UI).
- Nada é gravado nem enviado ainda: RSVP e pagamento são só visuais (specs/001 FR-009).
- Publicação: export estático (`output: "export"`, `basePath: "/casamento"`) no GitHub Pages pelo
  workflow `.github/workflows/pages.yml` a cada push na `main`. Arquivo de `/public` em `<img>`
  ou `<form action>` passa por `publico()` (`lib/conteudo.ts`); `next/link` já põe o basePath.

## Verificar

`npx tsc --noEmit && npm run build`, e a tela conferida no navegador em tamanho de celular.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
