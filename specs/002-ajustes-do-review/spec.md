# Feature Specification: Ajustes do review

**Feature Branch**: `002-ajustes-do-review`

**Created**: 2026-11-01

**Status**: Draft

**Input**: "Montar spec para resolução das coisas" — o pente fino da 001 (revisão com a skill
`web-design-guidelines` + navegador em 320/375px e desktop) achou 14 problemas visuais e de
acessibilidade; depois os noivos viram borboleta com meia asa e o pássaro da capa cortado.
Esta feature corrige tudo.

## Contexto

O visual da 001 está no ar em https://carlossergiojr.github.io/casamento/. Esta feature só
corrige o que já existe: nenhuma tela nova além da página de erro, nenhum conteúdo novo.

**Fora desta etapa**: fotos, textos e itens reais dos noivos (ver "Pendências de conteúdo"),
RSVP com banco, pagamento, e-mail, vínculo dos QR Codes.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Link bonito e sem becos sem saída (Priority: P1)

O convidado recebe o link pelo WhatsApp e vê uma prévia com os nomes, a data e uma imagem do
convite. Se digitar um endereço errado ou abrir um presente que já foi dado, cai numa página no
visual do site, em português, com caminho de volta.

**Why this priority**: o link circula pelo WhatsApp; a prévia e o erro são a primeira impressão.

**Independent Test**: colar a URL num validador de Open Graph (ou no WhatsApp) e abrir
`/casamento/qualquer-coisa/` e `/casamento/presentes/passeio/`.

**Acceptance Scenarios**:

1. **Given** o link do site, **When** é compartilhado, **Then** a prévia mostra o título
   "Victória & Carlos Sergio · 23.01.2027", a descrição e uma imagem 1200×630 do convite.
2. **Given** a aba do navegador, **Then** o ícone é o monograma "V & C", não o do Next.
3. **Given** um endereço que não existe, **When** é aberto, **Then** aparece uma página creme
   com a estampa, "Página não encontrada" e o botão "Voltar ao convite".
4. **Given** um presente já presenteado, **When** seu link é aberto, **Then** aparece a mesma
   página, com um link para a lista de presentes.

### User Story 2 - Animações, figuras e textos que se veem bem (Priority: P1)

**Acceptance Scenarios**:

1. **Given** as figuras da estampa (borboletas e pássaro), **Then** aparecem inteiras, sem asa
   ou cauda cortada, e sem distorcer a proporção.
2. **Given** a primeira visita, **When** o envelope some, **Then** a entrada da capa (nomes,
   cartão, botões) acontece nesse momento, à vista — não escondida atrás do envelope.
3. **Given** uma visita com o convite já aberto, **Then** a capa entra normalmente ao carregar.
4. **Given** a galeria ampliada, **When** a tela é baixa (celular deitado, notebook), **Then** a
   foto inteira cabe na tela, sem corte.
5. **Given** qualquer título de várias linhas, **Then** não sobra uma palavra sozinha na última
   linha.
6. **Given** um celular de 320px, **Then** o cartão do envelope mostra "Victória & Carlos" numa
   linha só.

### User Story 3 - Teclado e leitor de tela (Priority: P2)

**Acceptance Scenarios**:

1. **Given** a busca do RSVP no celular, **When** a tela abre, **Then** o teclado não sobe
   sozinho.
2. **Given** qualquer campo de texto, **When** recebe foco pelo teclado, **Then** o foco fica
   claro (anel visível, contraste ≥ 3:1).
3. **Given** o envelope fechado, **When** se usa Tab ou leitor de tela, **Then** só o envelope
   é alcançável; o site por trás fica inerte até abrir.
4. **Given** a galeria, **Then** os botões são lidos em português: "Fechar", "Foto anterior",
   "Próxima foto".
5. **Given** as abas Pix/Cartão, **When** se usam as setas do teclado, **Then** a aba muda.

### User Story 4 - Robustez e limpeza (Priority: P3)

**Acceptance Scenarios**:

1. **Given** o JavaScript desligado, **Then** todas as seções aparecem (sem a animação).
2. **Given** o Android, **When** se toca no envelope, **Then** não pisca o realce cinza.
3. **Given** o repositório, **Then** não há arquivos de modelo sem uso em `public/`.

### Edge Cases

- `prefers-reduced-motion`: a capa aparece sem movimento, também depois do envelope.
- Sem `sessionStorage` (aba anônima restrita): o envelope ainda abre e a capa ainda entra.
- A página de erro funciona no GitHub Pages (`404.html` na raiz do export) e respeita o
  `basePath` nos links e na estampa.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Página 404 própria, em português, no visual do site, com volta ao convite.
- **FR-002**: Metadata Open Graph/Twitter completa com `metadataBase` do endereço público e
  imagem 1200×630 gerada no build.
- **FR-003**: Favicon/ícone com o monograma V & C.
- **FR-004**: Entrada da capa sincronizada com o fim do envelope.
- **FR-005**: Foto ampliada da galeria limitada à altura da tela.
- **FR-006**: Títulos com quebra equilibrada (`text-balance`).
- **FR-007**: Cartão do envelope sem quebra de nomes a partir de 320px.
- **FR-008**: Sem foco automático em campos no celular.
- **FR-009**: Anel de foco visível em todos os campos e botões.
- **FR-010**: Envelope modal de verdade: foco preso nele e site por trás `inert`.
- **FR-011**: Rótulos de acessibilidade em português no Dialog e no Carousel.
- **FR-012**: Abas Pix/Cartão navegáveis pelas setas.
- **FR-013**: Conteúdo visível sem JavaScript.
- **FR-014**: Envelope sem realce de toque; `public/` sem arquivos do modelo.
- **FR-015**: Figuras da estampa (`public/estampa/spot-*.png`) inteiras, recortadas da própria
  `toile.jpg`, exibidas com altura automática.

## Success Criteria *(mandatory)*

- **SC-001**: Todos os itens conferidos no navegador (320px, 375px, celular deitado e desktop).
- **SC-002**: Validador de Open Graph mostra título, descrição e imagem do site publicado.
- **SC-003**: `npx tsc --noEmit && npm run build` verde; site publicado pelo workflow do Pages.
- **SC-004**: Navegação só por teclado do envelope até o rodapé sem perder o foco de vista.

## Pendências de conteúdo (dos noivos, não desta feature)

- Fotos reais: capa, pré-wedding (8) e presentes.
- Legenda da polaroid ("[legenda curta]").
- Dress code: traje, texto, "Evite" e as 4 cores (as atuais são provisórias).
- Itens reais da lista de presentes e a lista de convidados/convites.
- Confirmar o prazo do RSVP (22/12/2026).
- Formato do link dos QR Codes.
