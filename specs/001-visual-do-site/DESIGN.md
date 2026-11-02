# Site Cavi 2027 — Handoff de design

Site do casamento de **Victória & Carlos Sergio** — 23/01/2027, 16h, Campestre (Feira de Santana/BA).
Mobile-first (a maioria abre pelo QR Code). Deploy: GitHub Pages em `carlossergiojr.github.io/casamento/`.

`design/` tem as 8 telas desenhadas (HTML com estilos inline, 390px de largura) — use como **referência visual e de medidas**, não como código final. Elas usam um runtime do canvas (`<x-dc>`, `{{holes}}`, `<sc-for>`, `<sc-if>`), então não abrem perfeitas no navegador puro.

---

## 1. Tokens

### Cores
| Token | Hex | Uso |
|---|---|---|
| `background` | `#FAF7F1` | Fundo do site (creme leve) |
| `surface` | `#E9EBEF` | Seções alternadas, cartões, placeholders |
| `card` | `#FFFFFF` | Inputs, cards de presente, polaroids |
| `foreground` | `#2B3140` | Texto corrido |
| `primary` | `#636E84` | Títulos, botões principais, links |
| `primary-deep` | `#4E5769` | Textos secundários, legendas, ícones |
| `line` | `#9AA3B4` | Bordas e linhas — **nunca para texto** (contraste 2.5:1) |
| `gold` | `#9C7A45` | Acento: "&", contagem, preços, ícones de sucesso — só texto ≥ 24px (3.7:1) |
| `gold-line` | `#C2A170` | Fios e bordas douradas — **nunca para texto** |
| `gold-text-sm` | `#8E6E3C` | Dourado para texto pequeno (4.4:1), ex. "Presenteado ✓" |

Regra: azul domina; dourado ≤ 5% da página.

### Tipografia (Google Fonts)
- **Cormorant Garamond** 300/400/500 + itálico — nomes, títulos de seção (40px itálico), números, citações.
- **Karla** 400/500/600 — corpo (15–16px), labels (13px), botões (13–14px, 600, uppercase, letter-spacing .12–.14em), overlines (11–12px, uppercase, letter-spacing .2–.3em).

### Forma
- Radius **3px** (quase reto). Sem gradientes. Sombra só nas polaroids (`0 1px 3px rgb(43 49 64 / .12)`).
- Touch targets ≥ 44px; inputs 48–50px de altura, fonte 16px (evita zoom no iOS).
- Padding lateral das seções: 20–28px; espaço vertical entre seções: 64px.

### Assets (`assets/`)
- `toile.jpg` — estampa da papelaria (tile ~300px). Usar **só** em: faixa do rodapé (160px), topo das telas de sucesso (220px), faixa fina (56px) no topo das telas internas. Nunca atrás de texto.
- `spot-bird.png`, `spot-butterfly-1.png`, `spot-butterfly-2.png` — recortes transparentes da estampa, usados soltos como ilustração (`aria-hidden`).

---

## 2. shadcn/ui

Tema via CSS vars (`globals.css`), mapeando: `--background` creme, `--primary` #636E84, `--foreground` #2B3140, `--muted` #E9EBEF, `--border` #9AA3B4, `--radius: 0.1875rem`. Adicionar `--gold` e `--gold-line` como cores extras no Tailwind.

| Parte do site | Componente |
|---|---|
| Botões | `Button` (default = primary sólido; `outline` = borda primary) |
| Busca RSVP, formulário de presente | `Input`, `Label`, `Textarea`, `Form` (react-hook-form + zod) |
| Vou / Não vou por pessoa | `RadioGroup` estilizado como 2 botões segmentados |
| Pix / Cartão | `Tabs` |
| Parcelas | `Select` |
| Galeria ampliada | `Dialog` + `Carousel` |
| "Pix copiado", "Endereço copiado" | `Sonner` (toast) |
| Cards de presente | `Card` |

Capa, Nossa história, galeria em polaroid e rodapé: **Tailwind puro** (editorial, não usar visual padrão do shadcn).

---

## 3. Página inicial (ordem das seções)

1. **Header** 52px: monograma "V & C" (& dourado) à esquerda, "23.01.2027" à direita.
2. **Capa**: foto do casal em tela cheia (retrato, ~600px de altura no celular) com moldura fina creme inset 14px. Cartão creme sobreposto (−96px) com fio dourado no topo e o pássaro pousado no canto. Dentro: overline "Vamos nos casar", nomes (52px, light), "&" dourado itálico, data "23 · 01 · 2027", "Sábado, às 16h / Campestre · Feira de Santana, BA", **contagem regressiva** (dias/horas/min, números dourados 44px, entre fios dourados), botões **"Eu vou!"** (→ RSVP) e **"Lista de presentes"** (→ #presentes).
3. **Nossa história** (fundo surface): borboleta + título; o texto em trechos alternando esquerda/direita com fios dourados; fecha com "Agora só falta você." em dourado itálico 34px. Texto final está no briefing.
4. **Pré-wedding**: polaroids levemente rotacionadas (−3°, 4°, −2°), uma grande + duas sobrepostas; link "Ver todas as fotos" → Dialog com carrossel.
5. **Dress code** (surface): traje, 4 círculos de cores sugeridas, "Evite". Texto ainda a definir.
6. **Lista de presentes**: grade 2 colunas; card = foto, nome, preço (dourado), botão "Presentear" ou selo "Presenteado ✓" (já comprado).
7. **Você vem?** (surface): pássaro espelhado, prazo 22/12/2026, input nome/código, botão "Buscar meu convite".
8. **Como chegar**: mapa Google embutido (borda dourada), endereço por extenso, botões "Abrir rota" e "Copiar endereço".
9. **Rodapé**: faixa toile 160px, "V & C", "23.01.2027 · #Cavi2027".

Animações (só no código): fade/slide suave ao entrar na viewport, contagem viva, borboleta leve nas telas de sucesso. Respeitar `prefers-reduced-motion`.

---

## 4. Fluxos

### RSVP (lista fechada)
1. **Buscar** — input nome ou código; resultados como cards clicáveis ("Maria Souza · Convite para 2 pessoas"); link "Não encontrei meu nome".
2. **Responder** — "Olá, {nome}!"; um fieldset por pessoa do convite com Vou / Não vou; botão "Enviar resposta"; texto "nomes vêm do convite e não podem ser alterados".
3. **Confirmado** — topo toile, ícone ✓ dourado, "Que alegria!", resumo por pessoa, "pode alterar até 22/12/2026", botões "Ver lista de presentes" / "Salvar na agenda" (.ics).
4. **Não encontrado** — aviso para falar com os noivos; **nunca** oferece campo para cadastrar nome novo.

Regras: só nomes pré-cadastrados; acompanhantes só se vinculados ao convite; resposta sim/não; formulário fecha sozinho em 22/12/2026; respostas visíveis para os noivos (planilha/painel).

### Presentes (pagamento no próprio site)
1. **Detalhe** — foto, nome, preço; campos nome, e-mail, recadinho (opcional); "Ir para o pagamento".
2. **Pagamento** — resumo; Tabs Pix (QR + "Copiar código Pix" + status "aguardando" com polling) / Cartão (número, nome, validade, CVV, parcelas); "Pagamento seguro processado por [gateway]".
3. **Obrigado** — topo toile, coração dourado, "Muito obrigado!", resumo + recadinho, "Com carinho, Carlos & Victória".

Regras: presente comprado sai da lista ou fica marcado; e-mail de confirmação para o convidado e aviso para os noivos.

---

## 5. Arquitetura sugerida

GitHub Pages é estático, então RSVP e pagamento precisam de serviços externos:

- **Front**: Vite + React + TypeScript + Tailwind + shadcn/ui, `base: '/casamento/'`, deploy por GitHub Actions.
- **Dados (convidados, respostas, presentes)**: Supabase (Postgres + RLS) — tabelas `invites`, `guests`, `rsvps`, `gifts`, `gift_orders`.
- **Pagamento (Pix + cartão)**: gateway brasileiro (ex. Mercado Pago) chamado por uma função serverless (Supabase Edge Function), nunca direto do front; webhook marca o presente como comprado.
- **E-mails**: disparados pela mesma função (ex. Resend).

---

## 6. Ainda falta (placeholders nas telas)

- Fotos do pré-wedding e foto da capa
- Texto do dress code e cores sugeridas
- Itens da lista de presentes (foto, nome, valor)
- Lista de convidados / convites
- Conta que recebe os pagamentos
