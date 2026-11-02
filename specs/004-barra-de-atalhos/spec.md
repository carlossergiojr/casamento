# Feature Specification: Barra de atalhos

**Feature Branch**: `004-barra-de-atalhos`

**Created**: 2026-11-02

**Status**: Implemented

**Input**: "Uma coisa que minha noiva falou é deixar as coisas mais fáceis, como local,
presente etc." — a página inicial tem ~6.000px no celular; quem volta ao site quase sempre
procura uma coisa só (endereço, traje, presente, confirmar).

## Contexto

Barra fixa no rodapé da tela, estilo aplicativo, com quatro atalhos para as seções da página
inicial. Só na página inicial; as telas internas já têm "Voltar".

**Fora desta etapa**: seção "Programação" (quando existir, vira o primeiro atalho), botão de
música (pode morar na barra depois).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Ir direto ao que procuro (Priority: P1)

O convidado volta ao site para ver o endereço. Rola um pouco, vê a barra com "Traje ·
Presentes · Confirmar · Local" e toca em "Local": a página desliza até "Como chegar".

**Independent Test**: no celular (375px), rolar além da capa e tocar em cada atalho.

**Acceptance Scenarios**:

1. **Given** a capa parada na tela (página no topo), **Then** a barra não aparece: a foto e os
   nomes ficam livres logo depois do envelope.
2. **Given** o primeiro gesto de rolagem, **Then** a barra entra suave e fica visível até o fim
   da página, sem sumir ao rolar; volta a sair só se a pessoa voltar ao topo. (Antes entrava só
   na "Nossa história", mas no celular o "Eu vou!" da capa fica abaixo da dobra: a pessoa
   rolava ~350px sem nenhuma ação à vista.)
3. **Given** a barra, **When** toco num atalho, **Then** a página rola até a seção.
4. **Given** uma seção dos atalhos no meio da tela, **Then** o atalho dela aparece ativo:
   ícone e rótulo em dourado, ícone um pouco erguido, fio dourado em cima que desliza de um
   atalho para o outro ("Confirmar" ganha um anel dourado). Os outros, em azul.
6. **Given** um toque num atalho, **Then** ele fica ativo na hora e continua ativo enquanto a
   página desliza, sem piscar nas seções do caminho.
5. **Given** a barra, **Then** cada atalho tem ícone **e** palavra, e "Confirmar" se destaca.

### User Story 2 - A barra não atrapalha (Priority: P1)

**Acceptance Scenarios**:

1. **Given** o fim da página, **Then** o rodapé ("V & C · #Cavi2027") aparece inteiro acima da
   barra.
2. **Given** um iPhone com barra de gestos, **Then** os atalhos ficam acima dela (safe area).
3. **Given** o campo do RSVP com o teclado aberto, **Then** a barra some e volta ao sair do
   campo.
4. **Given** "Copiar endereço", **Then** o aviso aparece acima da barra, não atrás.
5. **Given** o envelope fechado, **Then** a barra não é alcançável (fica no site `inert`).

### Edge Cases

- `prefers-reduced-motion`: a barra entra só com fade, sem deslizar.
- Desktop: a barra ocupa a largura da coluna de 640px, centralizada.
- Sem JavaScript: a barra não aparece (as âncoras continuam no fluxo da página).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: `<nav aria-label="Atalhos">` fixo no rodapé com quatro links de âncora, na ordem da
  página: Traje (`#dresscode`), Presentes (`#presentes`), Confirmar (`#rsvp`), Local
  (`#local`).
- **FR-002**: Só aparece depois que a "Nossa história" entra na tela; não se esconde ao rolar.
- **FR-003**: Atalho da seção no meio da tela marcado com `aria-current="location"` e estilo
  ativo.
- **FR-004**: Alvos ≥ 44px; ícone de traço fino + rótulo em caixa alta (Karla).
- **FR-005**: Visual de convite: fundo creme, fio dourado no topo, sem sombra.
- **FR-006**: Respeita `env(safe-area-inset-bottom)` (`viewport-fit=cover`).
- **FR-007**: Some com um campo de texto em foco.
- **FR-008**: Rodapé e avisos (toasts) não ficam escondidos atrás da barra.
- **FR-009**: Entrada com `useReducedMotion()`.

## Success Criteria *(mandatory)*

- **SC-001**: Cada atalho leva à seção certa em 375px e no desktop.
- **SC-002**: `npx tsc --noEmit && npm run build` verde.
