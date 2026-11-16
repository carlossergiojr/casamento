# Implementation Plan: Banco, senha dos noivos e RSVP de verdade

**Branch**: `006-banco-e-senha` | **Date**: 2026-11-16 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/006-banco-e-senha/spec.md`

## Summary

O site sai do export estático do GitHub Pages e passa a rodar na Vercel com servidor (Next.js 16,
sem `output: "export"` nem `basePath`). Os dados vão para o Neon (Postgres) via Drizzle, com
migrations versionadas aplicadas no build da Vercel. A área `/noivos` vira uma página de
servidor protegida por uma senha única (cookie assinado de 30 dias) e grava por Server Actions
validadas com zod. O RSVP lê e grava o convite pelo código, com prazo checado no servidor. O
GitHub Pages passa a publicar só dois arquivos (`index.html` e `404.html`) que redirecionam
para o mesmo caminho na Vercel. Detalhes em [research.md](research.md).

## Technical Context

**Language/Version**: TypeScript 5 (strict), Node 24 (Vercel e GitHub Actions)

**Primary Dependencies**: Next.js 16.4 (App Router, Server Actions), React 19.3, drizzle-orm +
drizzle-kit, `pg` (node-postgres), zod, jose, server-only. UI existente: Tailwind 4, shadcn/ui
(Base UI), Motion, sonner.

**Storage**: Neon Postgres (produção, `DATABASE_URL`); Postgres 16 local para desenvolvimento e
testes.

**Testing**: sem suíte de testes no projeto. Validação por `npx tsc --noEmit && npm run build`,
script de checagem ponta a ponta com Playwright contra o servidor local + Postgres local
([quickstart.md](quickstart.md)), e checagem do redirecionamento com todos os códigos.

**Target Platform**: Vercel (runtime Node.js, região próxima de São Paulo) + GitHub Pages
(só redirecionamento). Navegadores móveis.

**Project Type**: web app Next.js único (sem separar frontend/backend).

**Performance Goals**: página do convite abre em < 2 s no 4G; resposta do RSVP grava em < 1 s.

**Constraints**: nenhum segredo no repositório nem no navegador; convidados reais só no banco;
QR antigo nunca pode quebrar; 375–390px; visual do DESIGN.md.

**Scale/Scope**: ~50 convites, ~150 pessoas, 2 usuários (os noivos), ~120 tarefas, ~25 gastos.
Picos de acesso só quando os convites são entregues.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Princípio | Como o plano atende | OK |
|---|---|---|
| I. Simples acima de tudo | Senha única num cookie assinado (sem biblioteca de auth, sem tabela de usuários); `pg` + Drizzle; sem proxy/middleware; limite de tentativas numa tabela, sem Redis. | ✓ |
| II. O visual é o produto | Telas novas (senha, aviso de prazo) reaproveitam `TelaInterna`, `campo`, `botao`; RSVP e área mantêm o visual atual. | ✓ |
| III. Sem login para convidados | Convidado só usa o código do convite; senha existe só em `/noivos`. | ✓ |
| IV. Servidor decide o que importa | Toda gravação por Server Action com zod; prazo, sessão e limite checados no servidor; nada confia no navegador. | ✓ |
| V. Dados com registro | Schema Drizzle em `lib/db/schema.ts`; migrations SQL geradas em `drizzle/` e aplicadas no build. | ✓ |
| Stack | Vercel + Neon + Drizzle, como previsto. Mercado Pago fica fora. | ✓ |

Ajuste de texto na constituição (PATCH): horário 15h30 boas-vindas / 16h20 cerimônia (o site já
mudou) e "hospedagem na Vercel; GitHub Pages só redireciona os QR antigos".

## Project Structure

### Documentation (this feature)

```text
specs/006-banco-e-senha/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── acoes-servidor.md   # Server Actions (RSVP, busca, senha, área dos noivos)
│   └── redirecionamento.md # GitHub Pages → Vercel
└── tasks.md                # /speckit-tasks
```

### Source Code (repository root)

```text
lib/
├── db/
│   ├── schema.ts          # tabelas Drizzle (fonte da verdade)
│   └── index.ts           # conexão (pg Pool + drizzle), server-only
├── sessao.ts              # assinar/verificar cookie dos noivos (jose), server-only
├── limite.ts              # limite de tentativas por IP (tabela tentativas)
├── codigo.ts              # gerar/normalizar código de convite
├── noivos.ts              # tipos compartilhados + utilidades de tela (sem localStorage)
└── conteudo.ts            # + prazo do RSVP em data/hora; sem convitesExemplo no site
app/
├── confirmar/
│   ├── page.tsx + busca.tsx          # busca chama Server Action
│   ├── acoes.ts                      # "use server": buscarConvite, responderConvite
│   ├── [codigo]/page.tsx             # servidor: lê convite do banco (sem generateStaticParams)
│   ├── [codigo]/resposta.tsx         # pré-marca respostas; envia pela ação
│   └── concluido/                    # lê o resultado do banco pelo código
├── noivos/
│   ├── page.tsx                      # servidor: sem sessão → <Entrar/>; com sessão → <AreaNoivos dados/>
│   ├── entrar.tsx                    # formulário de senha
│   ├── acoes.ts                      # "use server": entrar, sair, salvar*/apagar*, marcarTarefa, importar
│   └── area.tsx                      # mesma UI; recebe dados do servidor, grava pelas ações
drizzle/                               # migrations SQL geradas (versionadas)
drizzle.config.ts
scripts/
├── migrar.mjs                         # aplica migrations se houver DATABASE_URL (roda antes do next build)
├── semente-exemplo.mjs                # CAVI01–03 só para desenvolvimento
└── checar-redirecionamento.mjs        # abre cada link antigo e confere o destino
redirecionamento/
├── index.html, 404.html               # o que o GitHub Pages publica depois da virada
.github/workflows/pages.yml            # passa a publicar redirecionamento/ (na virada)
next.config.ts                         # sem output export / basePath
```

**Structure Decision**: continua um app Next.js único. Código de banco e sessão em `lib/`
marcado `server-only`; ações ao lado das rotas que as usam (`app/*/acoes.ts`).

## Ordem de entrega (para não quebrar o QR)

1. Tudo nesta branch, testado local (Postgres local).
2. Os noivos ligam a Vercel ao repositório (prévia da branch) com `DATABASE_URL`,
   `NOIVOS_SENHA`, `SESSAO_SEGREDO`. A prévia valida banco, senha e RSVP de verdade.
3. Merge na `main`: a Vercel publica produção e o workflow do Pages passa a publicar o
   redirecionamento no mesmo push. `scripts/checar-redirecionamento.mjs` roda logo depois.

Até o passo 3, a `main` (e o Pages) continua servindo o site atual.

## Complexity Tracking

Sem violações da constituição.
