# Quickstart: validar a feature 006

## Pré-requisitos

- Postgres local (16+) rodando; banco `cavi`.
- `.env.local` (não versionado):
  ```
  DATABASE_URL=postgres://postgres@localhost:5432/cavi
  NOIVOS_SENHA=teste-local
  SESSAO_SEGREDO=<openssl rand -base64 32>
  ```

## Subir

```bash
npm ci
node scripts/migrar.mjs            # cria as tabelas
node scripts/semente-exemplo.mjs   # CAVI01–03 (só dev)
npm run build && npm start
```

## Cenários (375px)

1. **RSVP**: abrir `/confirmar/CAVI01/` → marcar Vou/Não vou, restrição → enviar → "Que
   alegria!". Abrir de novo → respostas marcadas. (US2)
2. **Busca**: `/confirmar/` → "souza" → aparece só "Maria Souza" (titular) → abre o convite.
   Código inexistente `/confirmar/XXXX/` → busca com orientação. (US2)
3. **Prazo**: com `fimRsvp` no passado (variável de teste), enviar → recusado, aviso na tela.
4. **Senha**: `/noivos` sem cookie → só o campo de senha; o HTML não contém nenhum nome de
   convidado. Senha errada 5× → espera. Senha certa → área. (US3)
5. **Compartilhado**: dois contextos de navegador logados; marcar tarefa em um, atualizar o
   outro → marcada. (US3)
6. **Importar**: "Abrir cópia" com `cavi2027-noivos-planejamento.json` → 23 gastos, 117
   tarefas, 3 notas. "Salvar cópia" → arquivo com os mesmos números. (US4)
7. **Resposta na lista**: responder CAVI02 como convidado → na área, convite mostra "Vem",
   restrição e data. (US5)
8. **Redirecionamento**: servir `redirecionamento/` sob `/casamento/` num servidor estático
   local e rodar `node scripts/checar-redirecionamento.mjs <origem> <destino>` → todos os
   casos de [contracts/redirecionamento.md](contracts/redirecionamento.md) chegam certos.

## Verificar

```bash
npx tsc --noEmit && npm run build
git grep -n -i "senha\s*=\|postgres://" -- ':!specs' ':!*.md'   # nada de segredo
```

## Na Vercel (com os noivos)

1. Importar o repositório; ligar o Neon (Storage) ou colar `DATABASE_URL`.
2. Cadastrar `NOIVOS_SENHA` e `SESSAO_SEGREDO` (Production e Preview).
3. Abrir a prévia desta branch e repetir os cenários 1, 4, 6 e 7.
4. Só então: merge na `main` (produção + redirecionamento no mesmo push) e rodar o cenário 8
   contra `carlossergiojr.github.io/casamento` com os códigos reais.
