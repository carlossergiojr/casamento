# Cavi 2027 — site do casamento

Site do casamento de **Carlos Sérgio & Victória** — 22/01/2027, 16h, Campestre (Feira de
Santana/BA). Abre com um envelope animado; a página inicial tem capa com contagem regressiva,
nossa história, pré-wedding, dress code, lista de presentes, confirmação de presença e como
chegar.

Stack: **Next.js 16** (App Router) · **Tailwind CSS 4 + shadcn/ui** · **Motion** · Vercel.

## Rodar

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # build de produção
```

## Onde mexer

- **Textos, datas, endereço, fotos, presentes e convites de exemplo**: `lib/conteudo.ts`.
- **Cores e fontes**: `app/globals.css` (tokens do DESIGN.md) e `app/layout.tsx`.
- **Seções da página inicial**: `components/site/`; envelope: `components/envelope.tsx`.
- **Especificações**: `specs/` (Spec Kit); constituição em `.specify/memory/constitution.md`.
