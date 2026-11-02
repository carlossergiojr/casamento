# Feature Specification: "Victória & Carlos", sem o "Sergio"

**Feature Branch**: `005-nome-do-noivo`

**Created**: 2026-11-02

**Status**: Implemented

**Input**: "Quero que só seja Victória e Carlos, sem o Sergio."

## Contexto

O noivo aparece como "Carlos Sergio" na capa, no título da aba, na prévia do link, na imagem
de compartilhamento e no evento da agenda. Passa a ser só "Carlos" em todo lugar. O monograma
"V & C" e a hashtag `#Cavi2027` não mudam. O endereço do site (`carlossergiojr.github.io`) é o
usuário do GitHub e também não muda.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - O nome como os noivos querem (Priority: P1)

**Acceptance Scenarios**:

1. **Given** a capa, **Then** os nomes são "Victória & Carlos".
2. **Given** a aba do navegador e a prévia do WhatsApp, **Then** o título é "Victória & Carlos ·
   23.01.2027" e a imagem mostra "Victória & Carlos".
3. **Given** "Salvar na agenda", **Then** o evento se chama "Casamento Victória & Carlos".

## Requirements *(mandatory)*

- **FR-001**: `casamento.segundo = "Carlos"` em `lib/conteudo.ts`; o título e o texto
  alternativo da prévia em `app/layout.tsx` passam a vir de `casamento` (sem nome escrito à mão).
- **FR-002**: Documentação viva (AGENTS.md, README, DESIGN.md, constituição) com "Victória &
  Carlos". Briefing e mocks da 001 ficam como registro.

## Success Criteria *(mandatory)*

- **SC-001**: Nenhum "Carlos Sergio" no código do site.
- **SC-002**: `npx tsc --noEmit && npm run build` verde; capa e imagem de prévia conferidas.

## Tasks

- [X] T001 `segundo` e metadata a partir do conteúdo (FR-001)
- [X] T002 Documentação viva; constituição 1.0.3 (FR-002)
- [X] T003 Build verde, capa e `og.jpg` conferidas (SC-002)
