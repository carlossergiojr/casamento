# Data Model: Banco, senha dos noivos e RSVP de verdade

Postgres (Neon). Schema em `lib/db/schema.ts` (Drizzle). Ids `uuid` com `defaultRandom()`.
Datas `timestamptz`. Dinheiro em centavos (`integer`).

## convites

| Campo | Tipo | Regras |
|---|---|---|
| id | uuid PK | |
| codigo | text, único, not null | maiúsculas, sem espaços, 3–20 caracteres `[A-Z0-9-]` |
| titular | text not null | 1–120 |
| telefone | text not null default '' | livre |
| lado | text not null | `Victória` \| `Carlos` \| `Os dois` |
| obs | text not null default '' | só noivos veem |
| restricao | text not null default '' | do RSVP, ≤ 300 |
| respondido_em | timestamptz null | última resposta (convidado ou noivos) |
| criado_em / atualizado_em | timestamptz | |

## pessoas

| Campo | Tipo | Regras |
|---|---|---|
| id | uuid PK | |
| convite_id | uuid FK → convites.id `on delete cascade` | |
| nome | text not null | 1–120 |
| ordem | integer not null | ordem no convite |
| resposta | text not null default 'pendente' | `pendente` \| `vem` \| `nao-vem` |

Um convite tem 1..n pessoas. Estado de cada pessoa: `pendente → vem | nao-vem`, e pode trocar
entre `vem` e `nao-vem` até o prazo (convidado) ou a qualquer momento (noivos).

## gastos

| Campo | Tipo | Regras |
|---|---|---|
| id | uuid PK | |
| item | text not null | 1–120 |
| fornecedor | text not null default '' | |
| previsto | integer not null default 0 | ≥ 0 |
| pago | integer not null default 0 | ≥ 0 |
| vencimento | date null | |
| estimado | boolean not null default false | |
| obs | text not null default '' | |
| ordem | integer not null | ordem de cadastro |

## tarefas

| Campo | Tipo | Regras |
|---|---|---|
| id | uuid PK | |
| titulo | text not null | 1–200 |
| nota | text not null default '' | ≤ 2000 |
| fase | text not null | |
| categoria | text not null default '' | |
| feita | boolean not null default false | |
| urgente | boolean not null default false | |
| ordem | integer not null | |

## notas

| Campo | Tipo | Regras |
|---|---|---|
| id | uuid PK | |
| titulo | text not null default '' | |
| texto | text not null default '' | ≤ 20000 |
| ordem | integer not null | |

## tentativas

| Campo | Tipo | Regras |
|---|---|---|
| id | bigserial PK | |
| chave | text not null | IP |
| tipo | text not null | `senha` \| `busca` \| `resposta` |
| criada_em | timestamptz not null default now() | índice (tipo, chave, criada_em) |

## Formato do arquivo de cópia (entrada e saída)

Continua o de hoje (`versao: 1`), aceito com ou sem `tarefas`/`notas`. Na saída, cada convidado
ganha `codigo` e `restricao`, e `pessoas` vira lista de `{ nome, resposta }`; a entrada aceita
os dois jeitos (lista de nomes com `resposta`/`quantosVem` no convite, ou lista de objetos).
Importar substitui tudo numa transação.
