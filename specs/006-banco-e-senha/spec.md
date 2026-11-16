# Feature Specification: Banco, senha dos noivos e RSVP de verdade

**Feature Branch**: `006-banco-e-senha`

**Created**: 2026-11-16

**Status**: Implemented (falta publicar: ver PENDENCIAS.md, lista 2)

**Input**: "Banco de dados e senha dos noivos na Vercel. Sair do GitHub Pages para a Vercel,
mantendo o GitHub Pages só como redirecionamento dos QR Codes já impressos. Banco com migrations.
/noivos protegida por uma senha única, sessão de 30 dias. Convidados, gastos, tarefas e notas no
banco, os dois noivos veem a mesma coisa, importação da cópia. RSVP de verdade, com restrição
alimentar, até 03/01/2027, aparecendo na lista dos noivos. Convites reais fora do repositório
público. Mercado Pago fica para depois."

## Contexto

Hoje o site é só páginas prontas no GitHub Pages: o RSVP não grava nada, os convites são três de
exemplo escritos no código, e a área dos noivos guarda tudo só no aparelho de quem usa (cada
celular tem a sua versão, passada de um para o outro por arquivo). Os QR Codes dos convites já
foram gerados e apontam para `https://carlossergiojr.github.io/casamento/confirmar/` (talvez com
o código no fim: `/confirmar/CÓDIGO/`; os noivos vão conferir). Esse endereço não pode quebrar.

Esta feature leva o site para uma hospedagem com servidor e banco (a constituição já prevê
Vercel + Neon + Drizzle), protege a área dos noivos e faz a confirmação de presença valer.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - O QR impresso continua funcionando (Priority: P1)

O convidado aponta a câmera para o QR do convite e chega na página certa do site novo, sem
perceber a mudança de endereço.

**Why this priority**: os convites já estão impressos. Se o QR quebrar, nada mais importa.

**Independent Test**: abrir os endereços antigos (com e sem código, com parâmetros) e conferir
que cada um termina no mesmo caminho do site novo.

**Acceptance Scenarios**:

1. **Given** o endereço antigo `…github.io/casamento/confirmar/`, **When** o convidado abre,
   **Then** chega em `/confirmar/` do site novo.
2. **Given** `…github.io/casamento/confirmar/CAVI01/`, **When** abre, **Then** chega em
   `/confirmar/CAVI01/` do site novo, já no convite.
3. **Given** qualquer outro caminho antigo, com `?parâmetros` ou `#âncora`, **Then** o caminho, os
   parâmetros e a âncora chegam iguais no site novo.
4. **Given** o convidado aperta "voltar" depois do redirecionamento, **Then** não volta para a
   página de redirecionamento (não fica preso num vai-e-volta).

---

### User Story 2 - Confirmar presença de verdade (Priority: P1)

O convidado abre o convite (pelo código no QR ou buscando o nome), diz quem vai e quem não vai,
informa alguma restrição alimentar se quiser, e a resposta fica gravada. Pode voltar e mudar até
o prazo.

**Why this priority**: é o motivo de existir do site; os noivos precisam do número para o buffet.

**Independent Test**: com um convite cadastrado, responder pelo celular, fechar, abrir de novo e
ver a resposta anterior; conferir que ela aparece para os noivos.

**Acceptance Scenarios**:

1. **Given** um convite cadastrado com código válido, **When** o convidado abre
   `/confirmar/CÓDIGO/`, **Then** vê os nomes do convite e as opções Vou / Não vou por pessoa.
2. **Given** a tela `/confirmar/` sem código, **When** o convidado digita o código ou o nome
   (3 letras ou mais), **Then** encontra o convite e segue para ele.
3. **Given** o convidado respondeu, **When** envia, **Then** a resposta fica gravada e ele vê a
   tela de "Que alegria!" / "Obrigado por avisar" como hoje.
4. **Given** o convite já tem resposta, **When** o convidado abre de novo antes do prazo,
   **Then** vê as respostas anteriores marcadas e pode trocar.
5. **Given** depois de 03/01/2027 (fim do dia, horário de Brasília), **When** o convidado tenta
   responder, **Then** a resposta não é gravada e ele vê a orientação para falar com os noivos.
6. **Given** um código que não existe, **When** é aberto, **Then** o convidado vê a tela de busca
   com a orientação de "não encontrei meu convite", sem erro técnico.

---

### User Story 3 - Área dos noivos com senha e dados compartilhados (Priority: P1)

Victória e Carlos entram em `/noivos` com a mesma senha, em qualquer aparelho, e veem a mesma
lista de convidados, gastos, tarefas e notas. O que um muda, o outro vê.

**Why this priority**: sem senha, os dados reais não podem sair do aparelho; sem dados
compartilhados, os dois trabalham em versões diferentes.

**Independent Test**: entrar com a senha no celular A, marcar uma tarefa; entrar no celular B e
ver a tarefa marcada. Tentar abrir `/noivos` sem senha e não ver nada.

**Acceptance Scenarios**:

1. **Given** alguém sem sessão, **When** abre `/noivos`, **Then** vê só o campo de senha; nenhum
   dado dos noivos é enviado ao navegador.
2. **Given** a senha certa, **When** entra, **Then** fica conectado nesse aparelho por 30 dias.
3. **Given** a senha errada, **When** tenta, **Then** vê "Senha incorreta" e, depois de várias
   tentativas seguidas, precisa esperar um pouco antes de tentar de novo.
4. **Given** os dois noivos conectados, **When** um adiciona, edita, marca ou apaga um convidado,
   gasto, tarefa ou nota, **Then** o outro vê a mudança ao abrir ou atualizar a página.
5. **Given** um noivo conectado, **When** toca em "Sair", **Then** a sessão daquele aparelho
   termina.

---

### User Story 4 - Trazer o que já foi digitado (Priority: P2)

Os noivos levam para o banco o que já está no aparelho ou no arquivo de cópia (inclusive o
checklist preenchido).

**Why this priority**: evita redigitar 117 tarefas e 23 gastos; só é necessária uma vez.

**Independent Test**: abrir o arquivo de cópia na área com senha e ver tudo no banco, igual ao
arquivo.

**Acceptance Scenarios**:

1. **Given** um arquivo de "Salvar cópia" (de qualquer versão já usada), **When** os noivos o
   abrem na área com senha e confirmam, **Then** convidados, gastos, tarefas e notas do arquivo
   passam para o banco.
2. **Given** o aparelho ainda tem dados guardados do jeito antigo, **When** o noivo entra pela
   primeira vez, **Then** a área oferece levar esses dados para o banco (uma vez) e depois os
   apaga do aparelho.
3. **Given** um arquivo que não é uma cópia da área, **Then** nada muda e aparece a mensagem de
   erro de hoje.
4. **Given** a área conectada, **When** o noivo toca em "Salvar cópia", **Then** baixa um arquivo
   com tudo do banco (backup).

---

### User Story 5 - Respostas caindo na lista dos noivos (Priority: P2)

Cada convite da área dos noivos é o mesmo convite que o convidado responde: quando o convidado
confirma, a lista dos noivos mostra quem vem, quantos e a restrição alimentar.

**Why this priority**: tira o trabalho de copiar respostas do WhatsApp para a lista.

**Independent Test**: cadastrar um convite na área, responder como convidado pelo código, ver a
resposta na área.

**Acceptance Scenarios**:

1. **Given** um convite criado na área dos noivos, **Then** ele ganha um código, que os noivos
   veem e podem copiar, junto com o link de confirmação desse convite.
2. **Given** o convidado respondeu, **Then** a área mostra, por pessoa, Vem / Não vem, a
   restrição alimentar, e a data da resposta.
3. **Given** um convidado avisou pelo WhatsApp, **When** o noivo marca a resposta na área,
   **Then** ela vale do mesmo jeito (os noivos podem mudar respostas mesmo depois do prazo).
4. **Given** os convites já impressos têm códigos próprios, **When** os noivos cadastram ou
   importam um convite, **Then** podem informar o código que está no QR impresso.

### Edge Cases

- Convidado abre o mesmo convite em dois aparelhos e responde diferente: vale a última resposta.
- Nome repetido na busca (dois "João"): aparecem os dois convites, cada um com o titular.
- Convite sem nenhuma pessoa marcada como "vem": conta como "não vem" para todos.
- Código digitado com letras minúsculas ou espaços: é encontrado do mesmo jeito.
- Busca por nome curta demais (menos de 3 letras) ou muito genérica: não lista nada; pede mais.
- Os noivos apagam um convite que já tinha resposta: pede confirmação; a resposta some junto.
- Banco fora do ar: o convidado vê "Não deu para salvar agora, tente de novo em alguns minutos";
  o resto do site (história, presentes, local) continua abrindo.
- Sessão dos noivos vencida no meio de uma edição: o dado não se perde em silêncio; a área pede a
  senha de novo.
- Dois noivos editando o mesmo item ao mesmo tempo: vale a última gravação.

## Requirements *(mandatory)*

### Functional Requirements

**Hospedagem e QR Codes**

- **FR-001**: O site completo DEVE ser publicado numa hospedagem com servidor, a cada mudança na
  branch principal, sem passo manual.
- **FR-002**: O endereço antigo (`carlossergiojr.github.io/casamento/…`) DEVE continuar no ar
  apenas redirecionando para o mesmo caminho no site novo, sem o prefixo `/casamento`,
  preservando parâmetros e âncora, sem deixar a página de redirecionamento no histórico.
- **FR-003**: Sem JavaScript, o endereço antigo DEVE levar ao menos à página inicial do site novo.
- **FR-004**: O redirecionamento só DEVE ser ligado depois que o site novo estiver no ar e
  testado; até lá o endereço antigo continua servindo o site atual.

**Convites e RSVP**

- **FR-005**: Convites e convidados reais DEVEM existir só no banco, nunca no repositório.
- **FR-006**: `/confirmar/CÓDIGO/` DEVE abrir qualquer convite cadastrado, inclusive os criados
  depois da publicação.
- **FR-007**: A busca em `/confirmar/` DEVE achar por código exato ou por parte do nome (mínimo
  de 3 letras, sem diferenciar acentos e maiúsculas) e mostrar só o titular de cada convite
  encontrado — nunca a lista completa de convidados.
- **FR-008**: A resposta DEVE ser por pessoa (Vou / Não vou) mais uma restrição alimentar
  opcional por convite, validada no servidor (pessoas do convite, tamanho do texto).
- **FR-009**: Respostas DEVEM ser aceitas até 03/01/2027 23h59 (Brasília); depois disso o
  servidor recusa e só os noivos podem mudar.
- **FR-010**: Responder de novo DEVE substituir a resposta anterior daquele convite.
- **FR-011**: O site DEVE limitar tentativas repetidas de busca e de resposta vindas do mesmo
  lugar, para ninguém varrer a lista de convidados.

**Área dos noivos**

- **FR-012**: `/noivos` DEVE exigir a senha única dos noivos, conferida no servidor; a senha
  nunca aparece no código do site nem no repositório.
- **FR-013**: Entrar DEVE manter o aparelho conectado por 30 dias; "Sair" encerra.
- **FR-014**: Depois de 5 senhas erradas seguidas, novas tentativas DEVEM esperar 15 minutos.
- **FR-015**: Convidados, gastos, tarefas e notas DEVEM ser lidos e gravados no banco, com as
  mesmas telas e campos de hoje (Resumo, Checklist, Convidados, Orçamento, Notas).
- **FR-016**: Todo convite da área DEVE ter um código único (gerado ou informado pelos noivos) e
  mostrar o link de confirmação dele.
- **FR-017**: A lista de convidados DEVE mostrar as respostas vindas do RSVP (por pessoa, com
  restrição alimentar e data), e os noivos DEVEM poder alterá-las.
- **FR-018**: "Abrir cópia" DEVE importar um arquivo de cópia para o banco, depois de
  confirmação, substituindo o conteúdo atual; "Salvar cópia" DEVE baixar tudo do banco.
- **FR-019**: Na primeira entrada num aparelho com dados do jeito antigo, a área DEVE oferecer
  levá-los ao banco, uma vez.

**Dados**

- **FR-020**: Toda mudança na estrutura do banco DEVE entrar por migration versionada no
  repositório, aplicada automaticamente na publicação.
- **FR-021**: Nenhum segredo (senha dos noivos, acesso ao banco) DEVE ir para o repositório ou
  para o navegador.

### Key Entities

- **Convite**: código único (o do QR), titular, telefone (WhatsApp), lado (Victória, Carlos, os
  dois), observações dos noivos, restrição alimentar informada, data da última resposta.
- **Convidado (pessoa)**: nome, pertence a um convite, resposta (sem resposta / vem / não vem).
- **Gasto**: item, fornecedor, valor, já pago, próximo vencimento, se é estimativa, observações.
- **Tarefa**: título, detalhes, etapa, categoria, feita, "resolver agora", ordem.
- **Nota**: título, texto.
- **Tentativa de acesso**: de onde veio e quando, para limitar senhas erradas e varredura.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% dos endereços de QR testados (página de confirmação sem código, com cada
  código cadastrado, com parâmetros) chegam na página certa do site novo.
- **SC-002**: Um convidado confirma presença pelo celular em menos de 1 minuto, do QR à tela de
  "Que alegria!".
- **SC-003**: Uma resposta enviada aparece na área dos noivos ao abrir ou atualizar a página, em
  qualquer aparelho.
- **SC-004**: Sem a senha, nenhum dado dos noivos (convidados, valores, tarefas) é visível, nem na
  página nem nas respostas do servidor.
- **SC-005**: A importação do arquivo de cópia leva 100% dos convites, gastos, tarefas e notas.
- **SC-006**: Nenhum nome de convidado real, senha ou acesso ao banco está no repositório.
- **SC-007**: Site conferido em 375–390px nas telas novas (senha, RSVP gravado, área dos noivos).

## Assumptions

- Hospedagem: Vercel; banco: Neon (Postgres) com Drizzle — já na constituição. Os noivos criam as
  contas; o projeto Neon já existe.
- Endereço do site novo: o `.vercel.app` padrão até os noivos decidirem um domínio. Trocar depois
  é mudar uma linha do redirecionamento.
- O formato do QR (com ou sem código) ainda será confirmado; as duas formas funcionam.
- Uma senha só, compartilhada pelos dois noivos, cadastrada por eles na hospedagem.
- Os convites de exemplo (CAVI01–03) continuam só em desenvolvimento, para teste.
- A tela de confirmação, a busca e a área dos noivos mantêm o visual atual (DESIGN.md).
- Fora do escopo: pagamento dos presentes (Mercado Pago), "Presenteado", e-mail automático
  (decidido que não terá), domínio próprio.
