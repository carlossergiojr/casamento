# O que falta — Cavi 2027

Lista viva do que falta para o site ficar pronto. A gente vai fazendo **uma lista de cada vez**,
de cima para baixo. Ao terminar um item, marque `[x]` e mova para "Feito" com a data.

Casamento: 23/01/2027 · prazo do RSVP: 03/01/2027 · convites com QR saem antes disso.

## 1. Conteúdo (só os noivos podem dar) — tudo em `lib/conteudo.ts`

- [ ] **Fotos do pré-wedding**: trocar as 8 fotos de exemplo da galeria pelas reais e escrever a
      legenda (hoje "[legenda curta]").
- [ ] **Lista de presentes real**: revisar os 62 objetos e valores (só objetos, por categoria),
      tirar o que já têm em casa, e mandar as **fotos dos produtos** (salvas em
      `public/presentes/`, nome do arquivo como 4º valor do item). Sem foto, aparece o desenho de traço do item.
      Escolher também os **destaques da home** (`destaquesPresente` em `lib/conteudo.ts`).
- [ ] **Lista de convidados**: os convites de verdade (titular + pessoas + o código que está no QR
      de cada um), digitados na área dos noivos (`/noivos`) depois que ela estiver no ar. Os 3 de
      exemplo (CAVI01–03) agora só existem no banco de teste.
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

## 3. Pagamento dos presentes (specs/008)

Mercado Pago (Checkout Pro) integrado: o convidado paga por Pix ou cartão na página do MP, o
presente vira "Presenteado" e aparece na aba "Presentes" de `/noivos`.

- [ ] **Credenciais do Mercado Pago**: criar a aplicação no painel do MP e cadastrar
      `MP_ACCESS_TOKEN` na Vercel (Production e Preview). Primeiro o token de uma conta de teste.
- [ ] **Testar na prévia**: um presente pago por Pix e um por cartão com a conta de teste; conferir
      "Presenteado" na lista e a aba "Presentes" de `/noivos`. Depois trocar pelo token de produção.

## Fora do escopo (decidido)

- **E-mail de confirmação**: não. Os noivos mandam mensagem pelo WhatsApp eles mesmos, de forma
  pessoal. O site não envia nada automático.

## Feito

- 17/11/2026 — Abertura da home virou uma cortina de toile com placa "Abrir": ao tocar, a
  cortina corre para os lados e começa a música (Iris, em loop, `public/musica/iris.mp3`), com
  botão de som no canto. "Entrar sem música" abre em silêncio. Sai o envelope antigo.
- 17/11/2026 — Revisão de UX (3 agentes), grupos 1 e 2. **Confirmação**: "voltar" depois de
  enviar não mostra mais o formulário antigo; sem internet, avisa na própria tela e mantém as
  escolhas; código de QR inexistente diz qual código não achou; quem chega pelo QR não vê "Passo 2
  de 2" e o voltar leva ao site; o botão diz o que falta marcar; data/hora/local com "ver como
  chegar"; "Recebemos" tem link "Alterar resposta" e mostra a restrição. Página de erro em
  português (`app/error.tsx`). **Presentes**: quem sai do Mercado Pago sem pagar lê "Pagamento não
  concluído, nada foi cobrado" (não mais "Quase lá"); cota livre acima de R$ 20 mil avisa para
  falar com os noivos. **Celular/acessibilidade**: sem rolagem lateral em 320px (galeria);
  cabeçalho escondido não pega toque nem foco; cada presente conta uma vez só no Tab; foto da capa
  com prioridade; passarinho de 93KB → 12KB; contraste do fecho do Guia.
- 17/11/2026 — Presentes pagos pelo Mercado Pago (specs/008): o formulário leva ao checkout do MP
  (Pix ou cartão), o webhook grava o pagamento, a volta mostra aprovado/pendente/recusado, o
  presente pago vira "Presenteado" e `/noivos` ganhou a aba "Presentes" (total, quem deu,
  recadinho). Sem e-mail no formulário. WhatsApp dos noivos no ar
  (75 99941-4200).

- 17/11/2026 — Programação ganhou vida ao descer: o fio da linha do tempo se enche de azul, os
  pontos se acendem e os ícones são traçados à tinta por cima de um rascunho claro. As etiquetas
  dos presentes balançam no fio com o mesmo vento do Traje (`lib/vento.ts`) e endireitam no toque.
  Nada se mexe com "Reduzir movimento".
- 17/11/2026 — "Dúvidas" respondidas: cerimônia ao ar livre (sim) e estacionamento (sim). Saíram
  crianças, hospedagem, lista de presentes e o "Fale direto com a gente" do fim da seção.
- 17/11/2026 — Saiu o bloco "Você vem?" da home. Confirmar presença fica no botão "Eu vou!" da
  capa e no item "Confirmar presença" do menu, que agora abre direto `/confirmar`.
- 17/11/2026 — Presentes viraram etiquetas de papel (versão B): furinho com fio dourado, levemente
  tortas como as polaroids, com um desenho de traço de cada item no lugar da foto (o mesmo traço
  da Programação). A etiqueta inteira é o toque; a cota lua de mel é uma etiqueta deitada. Vale
  para a home, `/presentes` (agrupada por categoria) e a página de cada presente.
- 17/11/2026 — "Traje" em versão "caderno da costureira": recadinhos com setinha à mão nas roupas
  (em `dressCode.trajes[].notas`), cores a evitar como retalhos picotados presos com alfinete e
  X à mão, dicas de verão com divisor ondulado e sublinhado dourado, borboleta no canto. Um vento
  leve passa pelo cartão (cabides, saia e retalhos balançam; a borboleta bate as asas), só com o
  cartão na tela e nunca com "Reduzir movimento".
- 16/11/2026 — Contagem da capa com segundos (dias · horas · min · seg); o número desce de leve
  ao trocar (sem animação com "Reduzir movimento").
- 16/11/2026 — Barra de atalhos do rodapé removida (cara de aplicativo). No lugar, a data no
  cabeçalho do topo com dois tracinhos ao lado: tocando, abre a lista de seções e leva até a
  escolhida (o cabeçalho some ao descer e volta ao subir). Nomes da capa e da prévia do link em
  caligrafia (Allura); foto da capa de volta à tela inteira (640px).

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
