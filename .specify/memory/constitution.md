<!--
SYNC IMPACT REPORT
Versão: 1.0.2 → 1.0.3 — PATCH: noivo só "Carlos" (sem "Sergio") em todo o site.
Antes: 1.0.1 → 1.0.2 — PATCH: cerimônia às 15h (era 16h); prazo do RSVP 03/01/2027.
Antes: 1.0.0 → 1.0.1 — PATCH: glossário fixa a ordem dos nomes (Victória & Carlos, V & C).
Histórico: (template) → 1.0.0 — ratificação inicial, constituição curta de propósito.
Templates (.specify/templates/*): genéricos — sem ajuste.
TODOs pendentes: nenhum
-->

# Constituição do site Cavi 2027

Site do casamento de **Victória & Carlos** — sábado, 23/01/2027, 15h, Campestre
(Feira de Santana/BA). Quem abre é convidado, quase sempre pelo celular, vindo do QR Code do
convite. Idioma do produto e da documentação: **PT-BR**.

## Glossário

- **Convite**: o que cada família/grupo recebe; tem um código e um QR Code próprio.
- **Convidado**: pessoa nomeada num Convite. Só existe se veio do convite impresso.
- **Confirmação (RSVP)**: resposta Vou / Não vou de cada Convidado, até 03/01/2027.
- **Presente**: item da lista, com foto, nome e valor; pode ser **Presenteado**.
- **Noivos**: Victória e Carlos (nessa ordem em todo o site: "Victória & Carlos", "V & C") — os únicos que veem as respostas e os presentes recebidos.

## Princípios

### I. Simples acima de tudo

A solução mais simples que resolve o problema real. Nada de abstração "para o futuro", nada de
dependência que não paga o próprio peso. Cada feature entrega uma coisa visível e termina.

### II. O visual é o produto

O site é um convite: a direção do `DESIGN.md` (toile azul, dourado ≤ 5%, Cormorant + Karla,
cantos de 3px, muito espaço em branco, sem gradiente nem sombra forte) é regra, não sugestão.
**Mobile-first** (390px é a tela de referência). Animação é bem-vinda quando é suave e tem
propósito, e DEVE respeitar `prefers-reduced-motion`. Contraste AA em todo texto.

### III. Sem login para convidados

Convidado nunca cria conta nem digita senha: o convite (código ou QR) é o acesso. O que for só
dos noivos fica fora do site público e protegido do jeito mais simples que funcionar.

### IV. Servidor decide o que importa

Tudo que grava dado ou envolve dinheiro (confirmação, pagamento, presente comprado) é validado
no servidor (zod) e nunca confia no navegador. Efeitos externos (pagamento, e-mail) ficam fora
de transação de banco e são idempotentes.

### V. Dados com registro

Quando houver banco (Neon + Drizzle), o schema em código é a fonte da verdade e toda mudança
entra por migration versionada — nunca alteração manual em produção.

## Stack

Next.js (App Router) + TypeScript strict · Tailwind CSS + shadcn/ui · Motion para animações ·
hospedagem na Vercel. Mais tarde: Neon (Postgres) + Drizzle, Mercado Pago, Resend — entram só
na feature que precisar deles.

## Fluxo

Feature relevante passa por `/speckit-specify` → `/speckit-plan` → `/speckit-tasks` →
`/speckit-implement`, numa branch curta que vira PR. `/speckit-clarify` e `/speckit-checklist`
só quando houver dúvida real. Antes de publicar: `npm run build` verde e a tela conferida no
celular.

## Governança

Esta constituição prevalece sobre outras convenções. Mudança = editar este arquivo com
justificativa e subir a versão (MAJOR remove/redefine princípio, MINOR acrescenta, PATCH
esclarece).

**Version**: 1.0.3 | **Ratified**: 2026-11-01 | **Last Amended**: 2026-11-02
