# Implementation Plan: Pente fino e horário das 15h

**Branch**: `003-pente-fino` | **Date**: 2026-11-02 | **Spec**: [spec.md](./spec.md)

## Summary

Trocar o horário para 15h a partir de um único campo do conteúdo e corrigir cinco detalhes
visuais achados no pente fino. Mesma stack, nada a instalar.

## Constitution Check

| Princípio | Como esta feature cumpre |
|---|---|
| I. Simples | Ajustes de classe e um campo novo (`hora`) no conteúdo. |
| II. Visual | É o foco: toque ≥ 44px, reduced-motion, coerência das animações. |
| III–V | Inalterados. |

## Decisões

- **D1 Horário**: `casamento.hora = "15h"` em `lib/conteudo.ts`; `diaHora` passa a ser
  montado com ela, e `app/layout.tsx` (descrição) e `concluido.tsx` usam o campo em vez do
  texto fixo. `inicio` vira `2027-01-23T15:00:00-03:00`, o que move a contagem e o `.ics`
  juntos. O `fim` (02h) fica como está.
- **D2 Agenda**: `URL.revokeObjectURL` num `setTimeout`, depois do clique, para o Safari e o
  Firefox terem tempo de começar o download.
- **D3 Cores do dress code**: cada amostra ganha um aro branco (`border-[3px] border-card`) e um
  contorno fino (`ring-1 ring-line`), como uma amostra de tinta. A cor clara aparece dentro do
  aro mesmo sendo igual ao fundo.
- **D4 Toque**: botões dos cartões de presente com `py-[13px]` (12px de texto + 16px de linha
  + 26px + 2px de borda = 44px). Monograma de `TelaInterna` com `flex min-h-11 items-center`.
- **D5 Algarismos**: `lining-nums` na contagem (junto do `tabular-nums`) e nos preços (cartão,
  detalhe e resumo do pagamento). A data da capa mantém os algarismos antigos, que combinam com
  o tom de convite.
- **D6 Moldura**: o cartão da capa passa de `mx-[18px]` para `mx-[14px]`, igual ao `inset` da
  moldura: os fios da moldura terminam exatamente nas laterais do cartão.
- **D7 Títulos**: `<h2>` de `Galeria` e `ComoChegar` dentro de `<Revelar>`.
- **D8 Pulso**: `motion-safe:animate-pulse` no ponto do Pix.
- **D9 Documentação**: README, `DESIGN.md` §topo e constituição (PATCH 1.0.2, que também
  corrige o prazo do RSVP para 03/01/2027). Os artefatos da 001 (briefing, mocks) ficam como
  registro histórico.

## Verificação

`npx tsc --noEmit && npm run build`; `grep` por "16h"/"T16"; navegador em 375px: capa, dress
code, presentes, telas internas e "Que alegria!".
