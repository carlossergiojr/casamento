# O que falta — Cavi 2027

Lista viva do que falta para o site ficar pronto. A gente vai fazendo **uma lista de cada vez**,
de cima para baixo. Ao terminar um item, marque `[x]` e mova para "Feito" com a data.

Casamento: 23/01/2027 · prazo do RSVP: 03/01/2027 · convites com QR saem antes disso.

## 1. Conteúdo (só os noivos podem dar) — tudo em `lib/conteudo.ts`

- [ ] **Fotos do pré-wedding**: trocar as 8 fotos de exemplo da galeria pelas reais e escrever a
      legenda (hoje "[legenda curta]").
- [ ] **Dress code**: traje esperado, texto curto explicando, o que evitar e as cores sugeridas
      (hoje são marcadores "[a definir]").
- [ ] **Lista de presentes real**: revisar os 16 itens e valores (primeira versão em 16/11/2026),
      dizer o destino da lua de mel e o que já têm em casa, e trocar as fotos aleatórias por
      fotos dos itens ou ilustrações no estilo do site.
- [ ] **Lista de convidados**: os convites de verdade (titular + pessoas de cada convite), no lugar
      dos 3 de exemplo (CAVI01–03).

## 2. Banco + confirmação de presença (RSVP) de verdade

- [ ] Sair do GitHub Pages para a **Vercel** (specs/001 T021: o Pages vira redirecionamento).
- [ ] Banco **Neon (Postgres) + Drizzle**, com migrations (constituição, princípio V).
- [ ] RSVP gravando de verdade, validado no servidor (zod), com prazo até 03/01/2027.
- [ ] **QR Code por convite** para imprimir no convite físico, levando direto ao código.

## 3. Pagamento dos presentes

Modelo decidido: **presente virtual** — o convidado escolhe o item, paga por Pix ou cartão e o
dinheiro vai para os noivos, que compram o que quiserem.

- [ ] Decidir o caminho: (a) site de lista pronto (iCasei, Lejour…; taxa ~3–4%) com link no
      botão, ou (b) **Mercado Pago** integrado no próprio site (depende da Vercel + banco).
- [ ] Marcar o presente como "Presenteado" depois do pagamento aprovado.

## 4. Área dos noivos

- [ ] Página protegida (do jeito mais simples) para ver quem confirmou, quem não vai, os
      presentes recebidos e os recadinhos.

## Fora do escopo (decidido)

- **E-mail de confirmação**: não. Os noivos mandam mensagem pelo WhatsApp eles mesmos, de forma
  pessoal. O site não envia nada automático.

## Feito

- 16/11/2026 — Envelope de abertura desligado por enquanto (`ENVELOPE_LIGADO` em
  `lib/convite-aberto.ts`); "Victória" e "Carlos" se escrevem juntos na capa.
- 16/11/2026 — Primeira versão real da lista de presentes (16 itens, R$ 90 a R$ 1.500).
