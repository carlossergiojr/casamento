# 007 — O que o convidado procura primeiro

**Origem**: revisão de design e UX do site (16/11/2026), com prints em 390px. Feita direto no
código por pedido dos noivos ("aplique todas as sugestões"); este arquivo registra o que mudou e
por quê.

## Problema

Quem abre o site (pelo QR, no celular) quer, nesta ordem: **quando e onde → confirmar →
presentes → o que vestir → fotos e história**. A página ia na ordem contrária (local por último),
a primeira tela só mostrava a foto, e com "Reduzir movimento" ligado a capa ficava vazia.

## Requisitos

- **FR-001** (bug): com `prefers-reduced-motion: reduce`, a capa mostra nomes, data, local, botão
  e contagem. Causa: o `useReducedMotion()` do Motion já responde `true` na hidratação, o HTML não
  bate e o React refaz a capa invisível. Correção: `lib/use-reduzir.ts` (primeiro render igual ao
  do servidor) no lugar dele em todo o site, `<MotionConfig reducedMotion="user">` no layout e a
  `Tinta` abrindo o recorte na hora quando reduzido.
- **FR-002**: a primeira tela (390×750) mostra nomes, data, horários, local (link para o mapa) e
  o botão "Eu vou!". Foto da capa com 500px no celular; a contagem fica abaixo do botão.
- **FR-003**: bloco **"O dia"** logo depois da capa (`id="local"`, destino do atalho "Local"):
  programação (`programa`), mapa, "Abrir rota no Google Maps", "Abrir no Waze", "Copiar
  endereço", traje em uma linha (`dressCode.resumo`) e "Salvar na agenda" (.ics) + Google Agenda.
  Substitui o antigo "Como chegar".
- **FR-004**: nova ordem da home: Capa → O dia → Dress code → Você vem? → Presentes → Nossa
  história → Pré-wedding → Dúvidas → Rodapé. A barra de atalhos segue a ordem: Local, Traje,
  Confirmar, Presentes.
- **FR-005**: seção **"Dúvidas"** (`duvidas`), em `<details>` nativo, fechando com "Falar com os
  noivos no WhatsApp" (`contato.whatsapp`). Sem número, aparece "[WhatsApp dos noivos a definir]".
- **FR-006**: o mesmo botão de WhatsApp na tela "Não encontramos esse nome" do RSVP.
- **FR-007**: o botão do formulário do RSVP na home passa a dizer "Confirmar presença".
- **FR-008**: presentes na home em linhas compactas enquanto os destaques não têm foto real (com
  todas as fotos, volta aos cartões). Valores redondos sem centavos ("R$ 450").
- **FR-009**: **Cota lua de mel** (`presenteLivre`, página `/presentes/livre/`): o convidado
  escolhe o valor (atalhos de R$ 100–500 ou digita; mínimo R$ 20) e segue o mesmo fluxo visual de
  pagamento. Cartão na home e no topo de `/presentes`.
- **FR-010**: cores sugeridas do traje com o nome embaixo (`dressCode.cores[].nome`).
- **FR-011**: menos caixa alta espaçada: rótulos da barra, da contagem, do dress code, filtros e
  "Presentear" em caixa normal. Botões principais (`botao`) e sobretítulo da capa continuam.
- **FR-012**: com o envelope desligado, o `data-convite="aberto"` vai direto no `<html>`, sem
  `<script>` inline.

- **FR-013**: textos dos cartões impressos: `programa` com os 5 momentos do cartão "Programação",
  `dressCode` igual ao cartão "Traje" (Social; cores a **evitar**: branco, off-white, creme, nude,
  azul e azul claro; dica de verão) e a seção **"Guia do convidado"** (`guiaConvidado`), antes de
  "Dúvidas".

- **FR-014**: o bloco "O dia" vira a versão D escolhida pelos noivos: o cartão **"Programação"**
  igual ao impresso (moldura com cantos recortados em `components/site/moldura.tsx`, título em
  Pinyon Script, ícones de traço, os 5 momentos em linha do tempo, token `marinho`) e, fora do
  cartão, o local simples: **croqui desenhado** (`components/site/croqui.tsx`, sem escala),
  endereço e um botão **"Como chegar"** que abre uma gaveta com Google Maps, Waze, Uber e copiar
  endereço. Saem o mapa do Google embutido, os três botões de rota, a linha do traje e o "Salvar
  na agenda". A pedido dos noivos, ele também sai da tela de confirmação do RSVP.

- **FR-015**: capa só com a data, "Sábado · Campestre, Feira de Santana", o "Eu vou!" e a
  contagem (os horários e a rota já estão logo abaixo). O cartão "Programação" fica compacto
  (hora na mesma linha do nome; ~490px, cabe num iPhone SE) e o local vira a seção própria
  **"Como chegar"** (`id="local"`, destino do atalho "Local"), com o botão "Abrir rota".

## Mantido (de propósito)

Paleta azul + dourado, toile só nas faixas, Cormorant + Karla, nomes "se escrevendo" na capa,
"Nossa história" com o fio, polaroids, barra de atalhos (some com o teclado), fluxo do RSVP,
filtros de `/presentes`, alvos de toque ≥ 44px e inputs com 16px.
