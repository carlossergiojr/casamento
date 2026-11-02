# Feature Specification: Visual do site

**Feature Branch**: `001-visual-do-site`

**Created**: 2026-11-01

**Status**: Draft

**Input**: "Montar todo o front de como está no design, de forma básica; onde faltar imagem, usar
imagem aleatória da internet. Ao entrar no site, ele deve ser como um cartão de convite que se
abre para entrar no site. Animações e beleza, não um site parado. Publicar hoje." Referências:
[BRIEFING.md](./BRIEFING.md), [DESIGN.md](./DESIGN.md) e as 8 telas em [design/](./design/).

## Contexto

O site é o convite digital do casamento (23/01/2027, 16h, Campestre, Feira de Santana/BA). Os
convites impressos já têm QR Code. Esta feature entrega **só o visual**: todas as telas
desenhadas, navegáveis, com dados de exemplo. Banco, confirmação gravada, pagamento e e-mail
ficam para as próximas features.

**Atores**: Convidado (abre pelo celular, sem login). Noivos (definem o visual com o tempo).

**Fora desta etapa**: gravar confirmação, busca real de convites, pagamento real (Pix/cartão),
e-mails, painel dos noivos, vínculo dos QR Codes com convites, fotos definitivas.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Abrir o convite (Priority: P1)

O convidado abre o site e vê um **envelope fechado** sobre o fundo creme, com selo de cera
"C & V" dourado e a estampa toile por dentro. Ao tocar em "Abrir o convite", a aba do envelope
se abre, o cartão sobe de dentro dele com os nomes e a data, e a tela se desfaz suavemente no
site.

**Why this priority**: é o pedido da noiva e a primeira impressão de todo convidado.

**Independent Test**: abrir `/` no celular, tocar no envelope e chegar à capa.

**Acceptance Scenarios**:

1. **Given** a primeira visita na sessão, **When** a página carrega, **Then** aparece o envelope
   fechado com o convite para tocar.
2. **Given** o envelope fechado, **When** o convidado toca nele, **Then** a aba abre, o cartão
   sobe e o site aparece em menos de ~3 s.
3. **Given** que o convidado já abriu o convite nesta sessão, **When** volta à página inicial
   (ex.: voltando do RSVP), **Then** vai direto ao site, sem o envelope.
4. **Given** `prefers-reduced-motion`, **When** abre o convite, **Then** a troca é um fade
   simples, sem movimento.
5. **Given** o envelope, **When** o convidado prefere pular, **Then** há um link discreto
   "Pular" que leva direto ao site.

### User Story 2 - Página inicial completa (Priority: P1)

O convidado rola a página e vê, na ordem do DESIGN.md: header (monograma + data), capa com foto,
cartão sobreposto com o pássaro, nomes, data, contagem regressiva viva e botões "Eu vou!" /
"Lista de presentes"; Nossa história; Pré-wedding em polaroids com galeria ampliada; Dress code;
Lista de presentes; Você vem?; Como chegar com mapa; rodapé com a estampa.

**Why this priority**: é o site em si.

**Independent Test**: rolar `/` inteira em 390px e conferir cada seção contra `design/Main.html`.

**Acceptance Scenarios**:

1. **Given** a capa, **When** o tempo passa, **Then** a contagem (dias/horas/min até
   23/01/2027 16h, horário de Brasília) se atualiza sozinha.
2. **Given** qualquer seção, **When** ela entra na tela, **Then** aparece com fade/slide suave
   (sem movimento com `prefers-reduced-motion`).
3. **Given** a galeria, **When** o convidado toca em "Ver todas as fotos", **Then** abre um
   diálogo com carrossel das fotos.
4. **Given** "Como chegar", **When** toca em "Copiar endereço", **Then** o endereço é copiado e
   aparece o aviso "Endereço copiado"; "Abrir rota" abre o Google Maps com o endereço.
5. **Given** a lista de presentes, **Then** os cards mostram foto, nome, preço dourado e
   "Presentear" ou o selo "Presenteado ✓".
6. **Given** "Você vem?", **When** digita um nome e toca em "Buscar meu convite", **Then** vai à
   tela de busca do RSVP com o nome preenchido.

### User Story 3 - Telas do RSVP (Priority: P2)

Busca (com resultados de exemplo), Confirmar (Vou / Não vou por pessoa), Concluído (resumo +
"Salvar na agenda") e Não encontrado — navegáveis, com dados fixos de exemplo.

**Independent Test**: percorrer busca → confirmar → concluído, e busca → não encontrado.

**Acceptance Scenarios**:

1. **Given** a busca, **When** o texto bate com um convite de exemplo, **Then** aparecem os
   cards; **When** não bate, **Then** aparece o estado "Não encontramos esse nome", sem oferecer
   cadastro.
2. **Given** a confirmação, **When** responde e envia, **Then** vai ao Concluído com o resumo
   das respostas escolhidas (nada é gravado nesta etapa).
3. **Given** o Concluído, **When** toca em "Salvar na agenda", **Then** baixa um `.ics` do
   evento.

### User Story 4 - Telas dos presentes (Priority: P2)

Detalhe (foto, nome, preço, nome/e-mail/recadinho), Pagamento (abas Pix e Cartão, só visual) e
Obrigado — navegáveis com dados de exemplo.

**Independent Test**: escolher um presente → pagamento → obrigado.

**Acceptance Scenarios**:

1. **Given** um presente disponível, **When** toca em "Presentear", **Then** abre o detalhe dele.
2. **Given** o pagamento, **Then** fica claro que é uma prévia: nenhum dado de cartão é enviado
   ou guardado, e o botão leva ao "Obrigado" como simulação.

### Edge Cases

- Depois de 23/01/2027 16h a contagem mostra zeros (sem números negativos).
- Imagem de exemplo fora do ar: o espaço mantém a cor `surface` e o layout não quebra.
- Telas largas (desktop): o conteúdo fica centralizado com largura máxima confortável, sem
  esticar a capa.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Abertura com envelope animado na primeira visita da sessão, com "Pular".
- **FR-002**: Página inicial com as 9 seções na ordem e nas medidas do DESIGN.md.
- **FR-003**: Contagem regressiva viva até 2027-01-23T16:00-03:00.
- **FR-004**: Animações de entrada suaves; tudo respeita `prefers-reduced-motion`.
- **FR-005**: Telas do RSVP (4) e dos presentes (3) navegáveis com dados de exemplo.
- **FR-006**: Imagens faltantes usam fotos aleatórias da internet (fáceis de trocar num lugar só).
- **FR-007**: Tokens de cor, tipografia e forma do DESIGN.md aplicados via tema (Tailwind +
  shadcn); a estampa toile só onde o DESIGN.md permite.
- **FR-008**: "Copiar endereço" / "Abrir rota" funcionam; `.ics` do evento baixa.
- **FR-009**: Nenhum dado digitado é enviado a lugar nenhum nesta etapa.
- **FR-010**: Site publicado na Vercel; o endereço antigo do GitHub Pages redireciona para ele.

### Key Entities

- **Conteúdo do site**: textos, datas, endereço, fotos e itens de exemplo num único arquivo de
  conteúdo, para os noivos ajustarem sem mexer nas telas.

## Success Criteria *(mandatory)*

- **SC-001**: Em 390px, cada tela bate visualmente com a correspondente em `design/`.
- **SC-002**: Do toque no envelope ao site visível em ≤ 3 s.
- **SC-003**: `npm run build` verde e o site acessível pela URL pública hoje.
- **SC-004**: Texto com contraste AA; alvos de toque ≥ 44px.
