# Research: Banco, senha dos noivos e RSVP de verdade

## R1. Hospedagem: sair do export estático

- **Decision**: Vercel com o Next.js completo. Remover `output: "export"`, `basePath`,
  `trailingSlash` continua `true` (os links antigos terminam em `/`). `NEXT_PUBLIC_BASE_PATH`
  vazio; `publico()` continua existindo e passa a devolver o caminho sem prefixo.
- **Rationale**: Server Actions, páginas dinâmicas por código e cookies precisam de servidor;
  GitHub Pages só serve arquivos (pesquisado em 16/11/2026). A constituição já prevê Vercel.
- **Alternatives**: GitHub Pages + Supabase (lógica fora do Next); Cloudflare Pages/Netlify
  (sem ganho sobre a Vercel para Next).

## R2. Redirecionamento dos QR antigos

- **Decision**: o workflow do Pages publica a pasta `redirecionamento/` com `index.html` e
  `404.html` idênticos: script que tira o prefixo `/casamento` do `location.pathname` e faz
  `location.replace(DESTINO + caminho + search + hash)`; `<meta http-equiv="refresh">` para a
  raiz do destino como reserva sem JavaScript; `<link rel="canonical">`; `noindex`.
- **Rationale**: o Pages entrega `404.html` para qualquer caminho inexistente, então um arquivo
  cobre todos os códigos sem listar nenhum (nada de nome/código no repositório).
  `location.replace` não deixa a página no histórico. Ver [contracts/redirecionamento.md](contracts/redirecionamento.md).
- **Alternatives**: gerar uma página por código (exporia os códigos no repositório);
  domínio próprio com redirecionamento HTTP (o domínio `github.io` não é dos noivos).

## R3. Driver do banco

- **Decision**: `pg` (node-postgres) com `drizzle-orm/node-postgres`, um `Pool` por instância.
- **Rationale**: funciona igual com o Postgres local e com o Neon (TCP, URL com
  `sslmode=require`); a Vercel (Fluid compute) reaproveita instâncias, então o pool vale a pena.
  Um driver só para dev e produção = menos surpresa.
- **Alternatives**: `@neondatabase/serverless` (HTTP) — não fala com Postgres local sem proxy;
  `postgres` (postgres.js) — equivalente, sem vantagem aqui.

## R4. Migrations

- **Decision**: schema em `lib/db/schema.ts`; `drizzle-kit generate` cria SQL em `drizzle/`
  (versionado); `scripts/migrar.mjs` usa o migrator do drizzle-orm e roda antes do `next build`
  quando existe `DATABASE_URL` (Vercel). Migra pela conexão direta `DATABASE_URL_UNPOOLED`
  quando existir (o pooler do Neon não é indicado para migrations); o site usa a `DATABASE_URL`
  com pooling. Sem `DATABASE_URL` (ex.: build local sem banco), pula.
- **Rationale**: princípio V (nada manual em produção); migração junto com a publicação.
- **Cuidado**: prévias da Vercel usam o mesmo `DATABASE_URL` de produção, a menos que a
  integração Neon crie branch por prévia. Migrations desta feature são só aditivas (tabelas
  novas), então rodar na prévia é seguro. Registrado no quickstart.
- **Alternatives**: `drizzle-kit push` (sem histórico); migrar à mão (proibido).

## R5. Sessão dos noivos

- **Decision**: senha comparada no servidor com `NOIVOS_SENHA` (comparação em tempo constante
  sobre o SHA-256 dos dois lados). Sucesso → cookie `noivos` com JWT HS256 assinado por
  `SESSAO_SEGREDO` (jose), payload `{ v: 1 }`, `httpOnly`, `secure`, `sameSite: "lax"`,
  `path: "/"`, 30 dias. Toda leitura/gravação dos noivos chama `exigirNoivos()` (DAL), que
  verifica o cookie. "Sair" apaga o cookie. Trocar `SESSAO_SEGREDO` derruba todas as sessões.
- **Rationale**: é o modelo "stateless session" do guia de autenticação do Next 16
  (`node_modules/next/dist/docs/01-app/02-guides/authentication.md`), sem tabela de usuários.
- **Alternatives**: Auth.js/Better Auth (exagero para uma senha); proxy.ts com checagem
  otimista (desnecessário: a página já é de servidor e checa a sessão antes de ler dados).

## R6. Limite de tentativas

- **Decision**: tabela `tentativas (chave, tipo, criada_em)`. Chave = IP de `x-forwarded-for`
  (primeiro valor; a Vercel preenche). Senha: 5 erros em 15 min bloqueiam por 15 min (sucesso
  limpa). Busca/abertura de convite: 30 por 10 min por IP. Resposta: 20 por 10 min por IP.
  Linhas com mais de 1 dia são apagadas na própria checagem.
- **Rationale**: FR-011/FR-014 sem serviço extra (princípio I).
- **Alternatives**: Vercel Firewall/rate limit (configuração fora do repositório); Upstash.

## R7. Códigos de convite

- **Decision**: texto, único, guardado em maiúsculas sem espaços. Gerado com 6 caracteres de
  `ABCDEFGHJKMNPQRSTUVWXYZ23456789` (sem 0/O/1/I/L) quando os noivos não informam. Os noivos
  podem digitar o código que já está no QR impresso. Busca normaliza o que foi digitado.
- **Rationale**: compatível com os códigos já impressos (formato ainda a confirmar) e difícil
  de adivinhar quando gerado.

## R8. Resposta por pessoa

- **Decision**: a resposta passa a ser por pessoa (`pendente | vem | nao-vem`) na tabela
  `pessoas`; `quantosVem` deixa de ser guardado e vira contagem. Restrição alimentar e data da
  resposta ficam no convite. Importação de cópia antiga: `resposta = "vem"` com `quantosVem = n`
  marca as `n` primeiras pessoas como `vem` e o resto `nao-vem`; `nao-vem`/`pendente` valem para
  todas.
- **Rationale**: o RSVP já é por pessoa; um modelo só para convidado e noivos.

## R9. Prazo

- **Decision**: `casamento.fimRsvp = "2027-01-03T23:59:59-03:00"` em `lib/conteudo.ts`; o
  servidor recusa respostas depois disso; a página do convite mostra o aviso em vez dos botões.
  As ações dos noivos ignoram o prazo.

## R10. Atualização entre os dois noivos

- **Decision**: cada Server Action grava e chama `revalidatePath("/noivos")`; a página é de
  servidor e re-renderiza com os dados novos na resposta da ação. Marcar tarefa usa
  `useOptimistic` para a caixinha responder na hora. O outro aparelho vê ao abrir/atualizar
  (SC-003); sem tempo real.
- **Alternatives**: polling/realtime (exagero para dois usuários).

## R11. Busca por nome

- **Decision**: Server Action `buscarConvite(termo)`; mínimo 3 letras; compara sem acento e
  sem caixa (`unaccent` não é garantido no Neon → normalização feita em JS sobre os ~150 nomes,
  carregados só com `codigo`, `titular` e nomes); devolve no máximo 5 `{ codigo, titular }`.
- **Rationale**: FR-007 (nunca a lista inteira) e simplicidade; volume minúsculo.

## R12. Dados antigos no aparelho

- **Decision**: depois de entrar, se `localStorage["cavi2027:noivos"]` existir e o banco estiver
  vazio, a área oferece "Levar para o banco"; usa a mesma ação `importarCopia` e então apaga a
  chave. Com banco já preenchido, só oferece baixar o arquivo antigo e apagar.
