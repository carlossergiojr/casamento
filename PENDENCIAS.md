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
- [ ] **Lista de convidados**: os convites de verdade (titular + pessoas + o código que está no QR
      de cada um), digitados na área dos noivos (`/noivos`) depois que ela estiver no ar. Os 3 de
      exemplo (CAVI01–03) agora só existem no banco de teste.
- [ ] **Formato do QR impresso**: abrir um QR e ver se é `…/casamento/confirmar/` ou
      `…/confirmar/CÓDIGO/`. Os dois funcionam; com código, cadastrar o mesmo código no convite.

## 2. Colocar no ar o banco, a senha e o RSVP (specs/006)

O código está pronto na branch e testado com banco local. Falta publicar, nesta ordem:

- [ ] **Noivos**: projeto na **Vercel** importando o repositório, com as variáveis
      `DATABASE_URL` (Neon, com pooling), `DATABASE_URL_UNPOOLED` (sem pooling), `NOIVOS_SENHA` e
      `SESSAO_SEGREDO` (`openssl rand -base64 32`), em Production e Preview.
- [ ] Testar a **prévia da branch** na Vercel: senha, importar a cópia, RSVP de um convite de teste.
- [ ] Trocar `https://preencher.vercel.app` pelo endereço real em `redirecionamento/*.html`.
- [ ] **Merge na `main`**: Vercel em produção e GitHub Pages redirecionando no mesmo push; rodar
      `node scripts/checar-redirecionamento.mjs https://carlossergiojr.github.io/casamento <vercel> <códigos>`.

## 3. Pagamento dos presentes

Modelo decidido: **presente virtual** — o convidado escolhe o item, paga por Pix ou cartão e o
dinheiro vai para os noivos, que compram o que quiserem.

- [ ] Decidir o caminho: (a) site de lista pronto (iCasei, Lejour…; taxa ~3–4%) com link no
      botão, ou (b) **Mercado Pago** integrado no próprio site (depende da Vercel + banco).
- [ ] Marcar o presente como "Presenteado" depois do pagamento aprovado.

## 4. Área dos noivos

`/noivos` (sem link no site, fora dos buscadores) tem senha única e guarda tudo no banco
(specs/006); entra no ar com a lista 2.

- [ ] **Presentes recebidos**: quem deu, valor e recadinho; total arrecadado (depende da lista 3).

## Fora do escopo (decidido)

- **E-mail de confirmação**: não. Os noivos mandam mensagem pelo WhatsApp eles mesmos, de forma
  pessoal. O site não envia nada automático.

## Feito

- 16/11/2026 — specs/006 no código: site preparado para a Vercel, banco Neon + Drizzle com
  migrations, RSVP gravando (por pessoa, restrição alimentar, prazo 03/01), `/noivos` com senha
  única e dados no banco (importa a cópia antiga), GitHub Pages pronto para só redirecionar.
- 16/11/2026 — Área dos noivos ganhou Checklist (tarefas por etapa e categoria, "resolver agora"),
  Notas, contagem de dias no resumo e orçamento com contratado × estimativa. Site com o horário do
  convite (boas-vindas 15h30, cerimônia 16h20) e campo de restrição alimentar no RSVP (só visual).
- 16/11/2026 — Envelope de abertura desligado por enquanto (`ENVELOPE_LIGADO` em
  `lib/convite-aberto.ts`); "Victória" e "Carlos" se escrevem juntos na capa.
- 16/11/2026 — Lista de presentes com 62 objetos em 6 categorias (R$ 100 a R$ 2.800), filtro por
  categoria e borboleta no lugar das fotos aleatórias.
- 16/11/2026 — Área dos noivos em `/noivos`: resumo, convidados (titular, pessoas, WhatsApp, lado,
  resposta) e orçamento (previsto, pago, vencimento, lista sugerida), salvos no aparelho.
