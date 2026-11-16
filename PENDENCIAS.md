# O que falta — Cavi 2027

Lista viva do que falta para o site ficar pronto. A gente vai fazendo **uma lista de cada vez**,
de cima para baixo. Ao terminar um item, marque `[x]` e mova para "Feito" com a data.

Casamento: 23/01/2027 · prazo do RSVP: 03/01/2027 · convites com QR saem antes disso.

## 1. Conteúdo (só os noivos podem dar) — tudo em `lib/conteudo.ts`

- [ ] **Fotos do pré-wedding**: trocar as 8 fotos de exemplo da galeria pelas reais e escrever a
      legenda (hoje "[legenda curta]").
- [ ] **Lista de presentes real**: revisar os 62 objetos e valores (só objetos, por categoria),
      tirar o que já têm em casa, e mandar as **fotos dos produtos** (salvas em
      `public/presentes/`, nome do arquivo como 4º valor do item). Sem foto, aparece a borboleta.
      Escolher também os **destaques da home** (`destaquesPresente` em `lib/conteudo.ts`).
- [ ] **E-mail no formulário do presente**: o campo diz "para receber a confirmação", mas não vai
      ter e-mail automático. Decidir junto com o pagamento (o Mercado Pago pode pedir e-mail).
- [ ] **Lista de convidados**: os convites de verdade (titular + pessoas + o código que está no QR
      de cada um), digitados na área dos noivos (`/noivos`) depois que ela estiver no ar. Os 3 de
      exemplo (CAVI01–03) agora só existem no banco de teste.
- [ ] **WhatsApp dos noivos**: o número em `contato.whatsapp` (só dígitos, com 55 e DDD). Ele
      aparece em "Dúvidas" e na tela "Não encontramos esse nome" do RSVP.
- [ ] **Dúvidas**: responder as que estão entre colchetes em `duvidas` (crianças, estacionamento,
      hospedagem, cerimônia ao ar livre) e tirar/acrescentar perguntas.
- [ ] **Croqui do local**: conferir o desenho em "O dia" (`components/site/croqui.tsx`): a Rua
      Zeus sai da R. Rubens Francisco Dias? Os condomínios ficam de cada lado? Tem lago com a ilha?
      Ajusto o traçado com o que vocês disserem (ou com um print do mapa).
- [ ] **Formato do QR impresso**: o cartão traz um código impresso embaixo do QR, então o QR deve
      levar a `…/confirmar/CÓDIGO/`. Abrir um QR para confirmar e cadastrar em `/noivos` cada
      convite com exatamente o código impresso.

## 2. Banco, senha e RSVP no ar (specs/006)

Site em https://casamento-cavi.vercel.app (Vercel + Neon). O endereço dos QR
(`carlossergiojr.github.io/casamento/…`) redireciona para o mesmo caminho lá.

- [x] **Noivos, pelo celular**: senha, importação, convite de teste respondido pelo link (16/11).
- [ ] Cadastrar os convites reais em `/noivos` (com o código do QR, se o QR tiver código).

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

- 16/11/2026 — Barra de atalhos do rodapé removida (cara de aplicativo). No lugar, a data no
  cabeçalho do topo com dois tracinhos ao lado: tocando, abre a lista de seções e leva até a
  escolhida (o cabeçalho some ao descer e volta ao subir). Nomes da capa e da prévia do link em
  caligrafia (Great Vibes).

- 16/11/2026 — Capa com "Eu vou!" e "Como chegar" lado a lado (abre a gaveta da rota). Depois do
  prazo do RSVP (03/01) o site troca sozinho o destaque: "Como chegar" vira o botão cheio e o outro
  vira "Minha resposta". Nova ordem: Programação e Traje juntos (mesmo fundo), depois Como chegar.

- 16/11/2026 — "Traje" virou cartão irmão da Programação (versão B): moldura recortada, vestido e
  terno desenhados no cabide ("terno opcional"), cores a evitar separadas em "Da noiva" e "Das
  madrinhas" com risco, e as dicas de verão em ícones. Legendas em `dressCode` (`lib/conteudo.ts`).

- 16/11/2026 — "O dia" na versão D: cartão "Programação" igual ao impresso (moldura recortada,
  título cursivo, ícones) e o local com croqui desenhado e a gaveta "Como chegar" (Google Maps,
  Waze, Uber, copiar endereço). Saiu o "Salvar na agenda" desse bloco.

- 16/11/2026 — Textos dos cartões impressos no site: programação com os 5 momentos (boas-vindas,
  cerimônia, serviço volante, jantar, sobremesas), traje Social com as cores a evitar (o site
  sugeria azul, que é das madrinhas) e a dica de verão, e a seção "Guia do convidado".

- 16/11/2026 — Revisão de UX (specs/007): capa corrigida com "Reduzir movimento" (antes ficava
  vazia), data/local/"Eu vou!" na primeira tela, bloco "O dia" (programação, mapa, Google Maps,
  Waze, copiar endereço, traje, salvar na agenda), nova ordem da home, seção "Dúvidas" com
  WhatsApp, cota lua de mel de valor livre, presentes em linhas na home, valores sem centavos,
  cores do traje com nome e menos caixa alta.

- 16/11/2026 — Lista de presentes enxuta: a home mostra só 6 destaques e o botão "Ver lista
  completa"; a lista inteira foi para `/presentes`, em linhas compactas, com filtro por categoria,
  ordem por preço e os já presenteados no fim.
- 16/11/2026 — No ar: site na Vercel (https://casamento-cavi.vercel.app) com o banco Neon; GitHub
  Pages só redireciona os QR (conferido com `scripts/checar-redirecionamento.mjs`); Next.js 16.4.6.
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
