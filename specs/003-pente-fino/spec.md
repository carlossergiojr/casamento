# Feature Specification: Pente fino e horário das 15h

**Feature Branch**: `003-pente-fino`

**Created**: 2026-11-02

**Status**: Implemented

**Input**: "Pode corrigir sim. Tudo com spec bonitinha, e a programação tá errada: começa às 15."
Um segundo pente fino no site (código + navegador em 375px e desktop) achou detalhes visuais;
os noivos corrigiram o horário da cerimônia de 16h para **15h**.

## Contexto

Mesmo escopo da 002: só corrige o que já existe. Nenhuma seção nova.

**Fora desta etapa** (anotado no review, fica para depois): Pix com "Copiar código" antes do QR
no celular, link "Google Agenda", seções "Programação" e "Dúvidas", menu de navegação, música,
redução das fotos reais quando chegarem.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - O horário certo em todo lugar (Priority: P1)

O convidado vê que a cerimônia começa às 15h na capa, na prévia do link, na tela "Que
alegria!" e no evento que salva na agenda. A contagem regressiva termina às 15h.

**Why this priority**: horário errado faz convidado chegar atrasado ao casamento.

**Independent Test**: abrir a capa, a confirmação concluída e o `.ics` baixado; procurar "16h"
no código.

**Acceptance Scenarios**:

1. **Given** a capa, **Then** mostra "Sábado, às 15h".
2. **Given** a contagem, **Then** conta até 23/01/2027 15:00 (horário de Brasília).
3. **Given** o link compartilhado, **Then** a descrição diz "às 15h".
4. **Given** a tela "Que alegria!", **Then** diz "às 15h".
5. **Given** "Salvar na agenda", **When** tocado no iPhone, Android ou desktop, **Then** baixa
   um evento que começa às 15h (18:00 UTC).

### User Story 2 - Detalhes visuais (Priority: P2)

**Acceptance Scenarios**:

1. **Given** o dress code, **Then** as quatro cores sugeridas aparecem, inclusive a mais clara,
   que hoje é igual ao fundo da seção.
2. **Given** os botões "Presentear"/"Presenteado" e o monograma "V & C" das telas internas,
   **Then** a área de toque tem pelo menos 44px de altura.
3. **Given** a contagem e os preços, **Then** os algarismos têm a mesma altura (sem os números
   "de estilo antigo" da Cormorant subindo e descendo).
4. **Given** a capa, **Then** a moldura creme da foto encontra o cartão sem sobrar uma linha
   para fora das laterais dele.
5. **Given** os títulos "Pré-wedding" e "Como chegar", **Then** entram com a mesma animação das
   outras seções.

### Edge Cases

- `prefers-reduced-motion`: a bolinha "Aguardando pagamento" não pulsa.
- Depois das 15h do dia 23 a contagem mostra zeros (inalterado).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Início da cerimônia em 2027-01-23T15:00-03:00; o horário escrito vem de um só
  campo em `lib/conteudo.ts` e é usado na capa, na prévia, no "Que alegria!" e no `.ics`.
- **FR-002**: O download do `.ics` funciona no Safari/Firefox (o link temporário não é apagado
  antes do download começar).
- **FR-003**: Amostras de cor do dress code visíveis em qualquer fundo.
- **FR-004**: Alvos de toque ≥ 44px nos cartões de presente e no monograma das telas internas.
- **FR-005**: Algarismos alinhados (`lining-nums`) na contagem e nos preços.
- **FR-006**: Moldura da foto da capa alinhada às laterais do cartão.
- **FR-007**: Títulos de "Pré-wedding" e "Como chegar" com `<Revelar>`.
- **FR-008**: Pulso do "Aguardando pagamento" só com movimento permitido.
- **FR-009**: Documentação viva (README, DESIGN.md, constituição) com 15h.

## Success Criteria *(mandatory)*

- **SC-001**: Nenhum "16h"/"T16:00" no código do site.
- **SC-002**: `npx tsc --noEmit && npm run build` verde.
- **SC-003**: Telas conferidas no navegador em 375px.
