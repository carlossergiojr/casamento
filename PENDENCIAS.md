# O que falta — Cavi 2027

Lista viva do que falta para o site ficar pronto. A gente vai fazendo **uma lista de cada vez**,
de cima para baixo. Ao terminar um item, marque `[x]` e mova para "Feito" com a data.

Casamento: 23/01/2027 · prazo do RSVP: 03/01/2027 · convites com QR saem antes disso.

## 1. Conteúdo (só os noivos podem dar) — tudo em `lib/conteudo.ts`

- [ ] **Fotos do pré-wedding**: trocar as 8 fotos de exemplo da galeria pelas reais e escrever a
      legenda (hoje "[legenda curta]").
- [ ] **Dress code**: traje esperado, texto curto explicando, o que evitar e as cores sugeridas
      (hoje são marcadores "[a definir]").
- [ ] **Lista de presentes real**: revisar os 62 objetos e valores (só objetos, por categoria),
      tirar o que já têm em casa, e mandar as **fotos dos produtos** (salvas em
      `public/presentes/`, nome do arquivo como 4º valor do item). Sem foto, aparece a borboleta.
- [ ] **E-mail no formulário do presente**: o campo diz "para receber a confirmação", mas não vai
      ter e-mail automático. Decidir junto com o pagamento (o Mercado Pago pode pedir e-mail).
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

As telas já existem em `/noivos` (sem link no site, fora dos buscadores), com os dados guardados só
no aparelho de quem usa (`lib/noivos.ts`, localStorage) e cópia em arquivo para passar de um celular
para o outro. Falta a parte de segurança e o banco, que dependem da lista 2.

- [ ] Entrada protegida por senha única dos noivos (sem conta, sem cadastro).
- [ ] Guardar convidados e orçamento no **Neon** (os dois veem a mesma coisa, sem passar cópia),
      e as respostas do RSVP caindo direto na lista de convidados.
- [ ] **Presentes recebidos**: quem deu, valor e recadinho; total arrecadado (depende da lista 3).

## Fora do escopo (decidido)

- **E-mail de confirmação**: não. Os noivos mandam mensagem pelo WhatsApp eles mesmos, de forma
  pessoal. O site não envia nada automático.

## Feito

- 16/11/2026 — Envelope de abertura desligado por enquanto (`ENVELOPE_LIGADO` em
  `lib/convite-aberto.ts`); "Victória" e "Carlos" se escrevem juntos na capa.
- 16/11/2026 — Lista de presentes com 62 objetos em 6 categorias (R$ 100 a R$ 2.800), filtro por
  categoria e borboleta no lugar das fotos aleatórias.
- 16/11/2026 — Área dos noivos em `/noivos`: resumo, convidados (titular, pessoas, WhatsApp, lado,
  resposta) e orçamento (previsto, pago, vencimento, lista sugerida), salvos no aparelho.
