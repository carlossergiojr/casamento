# Contrato: Server Actions

Todas validam a entrada com zod no servidor. Erros esperados voltam como `{ ok: false, erro }`
com texto para mostrar ao usuário; nada de exceção técnica na tela.

## Públicas (convidado) — `app/confirmar/acoes.ts`

### `buscarConvite(termo: string)`
- Limite: 30/10 min por IP (`busca`).
- `termo` normalizado; < 3 letras → `{ ok: true, convites: null }` (pede mais).
- Código exato → 1 resultado. Senão, convites cujo titular ou alguma pessoa contém o termo.
- Retorno: `{ ok: true, convites: { codigo, titular }[] }` (máx. 5).

### Leitura em `app/confirmar/[codigo]/page.tsx`
- Código normalizado; inexistente → `redirect("/confirmar/?naoEncontrado=1")`.
- Entrega ao cliente só `{ codigo, titular, pessoas: { id, nome, resposta }[], restricao,
  prazoEncerrado }`. Nunca `telefone`, `obs`, `lado`.
- Não conta no limite: abrir um convite exige já saber o código; o que varre a lista é a busca.

### `responderConvite(entrada)`
- `entrada = { codigo, respostas: { pessoaId, resposta: "vem" | "nao-vem" }[], restricao? }`.
- Recusa se: limite `resposta` estourado; depois de `casamento.fimRsvp`; código inexistente;
  `respostas` não cobre exatamente as pessoas do convite; `restricao` > 300.
- Grava numa transação: respostas das pessoas, `restricao`, `respondido_em = now()`.
- Retorno: `{ ok: true }` → cliente navega para `/confirmar/concluido/?c=CÓDIGO`.

## Noivos — `app/noivos/acoes.ts`

Todas (menos `entrar`) começam com `exigirNoivos()`; sem sessão válida →
`{ ok: false, erro: "sessao" }` e a tela pede a senha de novo.

| Ação | Entrada | Efeito |
|---|---|---|
| `entrar(senha)` | string | limite `senha` (5 erros/15 min); certo → cookie 30 dias |
| `sair()` | — | apaga cookie |
| `salvarConvite(c)` | convite + pessoas `{ id?, nome, resposta }` + `codigo?` | cria/atualiza; código vazio → gera; código repetido → erro "Código já usado" |
| `apagarConvite(id)` | uuid | apaga (pessoas em cascata) |
| `salvarGasto(g)` / `apagarGasto(id)` | | |
| `salvarTarefa(t)` / `apagarTarefa(id)` / `marcarTarefa(id, feita)` | | |
| `salvarNota(n)` / `apagarNota(id)` | | |
| `importarCopia(json)` | conteúdo do arquivo | valida; substitui tudo numa transação; devolve contagens |
| `exportarCopia()` | — | devolve o JSON de tudo |

Depois de gravar: `revalidatePath("/noivos")`.

## Cookie

`noivos`: JWT HS256 (`SESSAO_SEGREDO`), `httpOnly`, `secure`, `sameSite=lax`, `path=/`,
`maxAge` 30 dias.

## Variáveis de ambiente

| Nome | Onde | Uso |
|---|---|---|
| `DATABASE_URL` | Vercel (integração Neon) / `.env.local` | conexão do site, com pooling (host `-pooler`) |
| `DATABASE_URL_UNPOOLED` | Vercel | conexão direta, só para as migrations no build |
| `NOIVOS_SENHA` | Vercel | senha única |
| `SESSAO_SEGREDO` | Vercel | assina o cookie (≥ 32 caracteres) |
