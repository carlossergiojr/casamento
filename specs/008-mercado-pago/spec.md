# 008 — Presentes pagos pelo Mercado Pago

**Origem**: pedido dos noivos (17/11/2026), "vamos de Mercado Pago, faz a integração". Feita
direto no código, como a 007; este arquivo registra o que mudou e por quê.

## Problema

A lista de presentes era só visual: o pagamento era uma prévia, nada era cobrado e nenhum
presente virava "Presenteado". Modelo já decidido: **presente virtual** — o convidado paga o
valor do item e o dinheiro vai para os noivos.

## Decisão

**Checkout Pro** do Mercado Pago: o site cria uma *preferência* e manda o convidado para a página
do MP, que cuida de Pix e cartão (com parcelas). Dado de cartão nunca passa pelo site, e não há
QR Pix nem formulário de cartão para manter. Só REST com `fetch` (sem SDK, princípio I).

## Requisitos

- **FR-001**: no detalhe do presente, o convidado informa nome e recadinho opcional (sem
  e-mail: se precisar, o MP pede no checkout) e toca em "Pagar com Pix ou cartão" (na cota
  livre, também o valor).
- **FR-002**: a Server Action `iniciarPagamento` (`app/presentes/acoes.ts`) valida com zod, tira o
  preço da lista **no servidor** (cota livre: R$ 20 a R$ 20 mil), recusa presente já pago, limita
  10 tentativas por IP em 10 min, grava a linha em `pagamentos` ("criado") e cria a preferência
  (`external_reference` = id da linha; idempotência pelo mesmo id). Boleto fica de fora.
- **FR-003**: webhook `POST /api/mercado-pago/`: só aceita `payment`, consulta o pagamento na API
  com o nosso token (o aviso em si não é confiável) e grava o status. Aprovado só se o valor bate.
  Entrou ou saiu de "approved" → `revalidatePath("/", "layout")`. Erro → 500 e o MP reenvia.
- **FR-004**: a volta do checkout (`/presentes/[id]/obrigado/?ref=…&payment_id=…`) confere o
  status direto na API e mostra: **aprovado** ("Muito obrigado!", resumo e recadinho),
  **pendente** ("Quase lá", botão Atualizar) ou **recusado** ("Tentar de novo").
- **FR-005**: presente com pagamento aprovado aparece "Presenteado ✓" na home e em `/presentes`,
  sai dos destaques, e a página dele vira 404. A cota livre nunca fica presenteada.
- **FR-006**: `/noivos` ganha a aba **Presentes**: total arrecadado, quantidade e a lista (item,
  quem deu, data, valor, recadinho).

## Dados

Tabela `pagamentos` (migration `0001_pagamentos`): `presente_id`, `nome`, `recado`,
`valor` (centavos), `status` (o do MP: `approved`, `pending`, `rejected`…; "criado" antes do
checkout; "divergente" se o valor não bate), `mp_preferencia`, `mp_pagamento`, `pago_em`.

## Configuração

- `MP_ACCESS_TOKEN` (Vercel, Production e Preview): *Access Token* das credenciais do MP. Para
  testar, o de uma conta de teste (Suas integrações → Contas de teste).
- `SITE_URL` (opcional): endereço público para as voltas do checkout; sem ele, usa o host da
  requisição. Webhook e volta automática só vão com `https` (no localhost o convidado volta pelo
  botão do MP).
- No painel do MP não precisa cadastrar webhook: a preferência já leva o `notification_url`.

## Fora do escopo

- Assinatura `x-signature` do webhook: não precisa, porque o status sempre vem da API com o nosso
  token.
- Estorno pelo site (faz no painel do MP; o webhook tira o "Presenteado" sozinho).
