"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { campo, rotuloCampo, tituloInterno } from "@/components/interno";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { casamento, formatarValor } from "@/lib/conteudo";
import {
  type Convidado,
  type DadosNoivos,
  type Gasto,
  type Lado,
  type Nota,
  type Resposta,
  type Tarefa,
  fasesPadrao,
  gastosSugeridos,
  lerReais,
  linkWhatsApp,
  mostrarReais,
  novoId,
  salvar,
  useDadosNoivos,
  validar,
} from "@/lib/noivos";
import { cn } from "@/lib/utils";

const abas = ["Resumo", "Checklist", "Convidados", "Orçamento", "Notas"] as const;
type Aba = (typeof abas)[number];

const rotuloResposta: Record<Resposta, string> = {
  pendente: "Sem resposta",
  vem: "Vem",
  "nao-vem": "Não vem",
};
const lados: Lado[] = ["Victória", "Carlos", "Os dois"];

const botaoPrimario = "botao bg-primary text-card hover:bg-primary-deep";
const botaoSecundario = "botao border border-primary text-primary hover:bg-surface";
const chip = (ativo: boolean) =>
  cn(
    "flex min-h-11 shrink-0 items-center rounded-[3px] border px-3.5 text-sm whitespace-nowrap",
    ativo ? "border-primary bg-primary text-card" : "border-line bg-card text-primary-deep",
  );

export function AreaNoivos() {
  const dados = useDadosNoivos();
  const [aba, setAba] = useState<Aba>("Resumo");

  return (
    <main className="flex flex-1 flex-col gap-6 px-5 py-8">
      <div className="flex flex-col gap-2">
        <p className="sobretitulo">Só de vocês dois</p>
        <h1 className={tituloInterno}>Área dos noivos</h1>
      </div>

      <div role="tablist" aria-label="Seções" className="-mx-5 flex gap-2 overflow-x-auto px-5">
        {abas.map((a) => (
          <button key={a} role="tab" aria-selected={aba === a} onClick={() => setAba(a)} className={chip(aba === a)}>
            {a}
          </button>
        ))}
      </div>

      {aba === "Resumo" && <Resumo dados={dados} irPara={setAba} />}
      {aba === "Checklist" && <Checklist dados={dados} />}
      {aba === "Convidados" && <Convidados dados={dados} />}
      {aba === "Orçamento" && <Orcamento dados={dados} />}
      {aba === "Notas" && <Notas dados={dados} />}

      <Copias dados={dados} />
    </main>
  );
}

/* ───────────────────────── Resumo ───────────────────────── */

function contarPessoas(convidados: Convidado[]) {
  let vem = 0, naoVem = 0, semResposta = 0;
  for (const c of convidados) {
    if (c.resposta === "vem") vem += c.quantosVem;
    else if (c.resposta === "nao-vem") naoVem += c.pessoas.length;
    else semResposta += c.pessoas.length;
  }
  const total = convidados.reduce((s, c) => s + c.pessoas.length, 0);
  return { total, vem, naoVem, semResposta };
}

/** Contratado = valores fechados; estimativa = itens ainda sem contrato (fora do "falta pagar"). */
function somarGastos(gastos: Gasto[]) {
  const fechados = gastos.filter((g) => !g.estimado);
  const contratado = fechados.reduce((s, g) => s + g.previsto, 0);
  const pago = gastos.reduce((s, g) => s + g.pago, 0);
  const falta = fechados.reduce((s, g) => s + Math.max(g.previsto - g.pago, 0), 0);
  const estimativa = gastos.filter((g) => g.estimado).reduce((s, g) => s + g.previsto, 0);
  return { contratado, pago, falta, estimativa };
}

function situacao(g: Gasto) {
  if (g.estimado) return { texto: "estimativa", cor: "text-primary-deep" };
  if (g.previsto > 0 && g.pago >= g.previsto) return { texto: "quitado", cor: "text-gold-text-sm" };
  if (g.pago > 0) return { texto: "parcial", cor: "text-primary" };
  return { texto: "nada pago", cor: "text-destructive" };
}

/** Dias até o casamento; null no servidor (o número certo só existe no relógio de quem abre). */
function useDiasFaltando() {
  const [dias, setDias] = useState<number | null>(null);
  useEffect(() => {
    setDias(Math.max(0, Math.ceil((new Date(casamento.inicio).getTime() - Date.now()) / 86_400_000)));
  }, []);
  return dias;
}

const marcarTarefa = (dados: DadosNoivos, id: string, feita: boolean) =>
  salvar({ ...dados, tarefas: dados.tarefas.map((t) => (t.id === id ? { ...t, feita } : t)) });

const hoje = () => new Date().toISOString().slice(0, 10);
const dataBr = (iso: string) => iso.split("-").reverse().join("/");

function Numero({ valor, rotulo, destaque = false }: { valor: string | number; rotulo: string; destaque?: boolean }) {
  return (
    <div className="flex flex-col gap-0.5 rounded-[3px] border border-surface bg-card px-3.5 py-3">
      <span className={cn("font-serif text-[28px] leading-none", destaque ? "text-gold" : "text-primary")}>{valor}</span>
      <span className="text-[13px] text-primary-deep">{rotulo}</span>
    </div>
  );
}

function Resumo({ dados, irPara }: { dados: DadosNoivos; irPara: (a: Aba) => void }) {
  const p = contarPessoas(dados.convidados);
  const g = somarGastos(dados.gastos);
  const dias = useDiasFaltando();
  const feitas = dados.tarefas.filter((t) => t.feita).length;
  const agora = dados.tarefas.filter((t) => t.urgente && !t.feita);
  const proximos = dados.gastos
    .filter((x) => x.vencimento && x.pago < x.previsto)
    .sort((a, b) => a.vencimento.localeCompare(b.vencimento))
    .slice(0, 4);

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-2.5">
          <Numero valor={dias ?? "—"} rotulo={dias === 1 ? "dia para o casamento" : "dias para o casamento"} destaque />
          <Numero valor={`${feitas}/${dados.tarefas.length}`} rotulo="tarefas feitas" />
        </div>
        {agora.length > 0 && (
          <div className="flex flex-col gap-1">
            <p className="sobretitulo">Para resolver agora · {agora.length}</p>
            <ul className="flex flex-col">
              {agora.map((t) => (
                <li key={t.id} className="flex items-center border-b border-surface last:border-b-0">
                  <Marcar tarefa={t} onMudar={(v) => marcarTarefa(dados, t.id, v)} />
                  <span className="py-2 text-[15px]">{t.titulo}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        <button className={botaoSecundario} onClick={() => irPara("Checklist")}>
          {dados.tarefas.length ? "Ver checklist" : "Começar o checklist"}
        </button>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-serif text-2xl text-primary">Convidados</h2>
        <div className="grid grid-cols-2 gap-2.5">
          <Numero valor={p.total} rotulo={`${p.total === 1 ? "pessoa" : "pessoas"} em ${dados.convidados.length} ${dados.convidados.length === 1 ? "convite" : "convites"}`} />
          <Numero valor={p.vem} rotulo="confirmadas" destaque />
          <Numero valor={p.semResposta} rotulo="sem resposta" />
          <Numero valor={p.naoVem} rotulo="não vêm" />
        </div>
        <div className="flex flex-col gap-1 text-[15px] text-primary-deep">
          {lados.map((l) => {
            const n = dados.convidados.filter((c) => c.lado === l).reduce((s, c) => s + c.pessoas.length, 0);
            return n ? (
              <p key={l}>
                {l === "Os dois" ? "Dos dois" : `Lado ${l === "Victória" ? "da" : "do"} ${l}`}: {n} {n === 1 ? "pessoa" : "pessoas"}
              </p>
            ) : null;
          })}
        </div>
        <button className={botaoSecundario} onClick={() => irPara("Convidados")}>
          Ver convidados
        </button>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-serif text-2xl text-primary">Orçamento</h2>
        <div className="grid grid-cols-2 gap-2.5">
          <Numero valor={formatarValor(g.contratado)} rotulo="contratado" />
          <Numero valor={formatarValor(g.pago)} rotulo="já pago" destaque />
          <Numero valor={formatarValor(g.falta)} rotulo="falta pagar" />
          {g.estimativa > 0 && <Numero valor={formatarValor(g.estimativa)} rotulo="estimado (sem contrato)" />}
        </div>
        {proximos.length > 0 && (
          <div className="flex flex-col gap-2">
            <p className="sobretitulo">Próximos pagamentos</p>
            {proximos.map((x) => (
              <p key={x.id} className="flex justify-between gap-3 text-[15px]">
                <span className={cn(x.vencimento < hoje() ? "text-destructive" : "text-foreground")}>
                  {dataBr(x.vencimento)} · {x.item}
                </span>
                <span className="text-primary-deep">{formatarValor(x.previsto - x.pago)}</span>
              </p>
            ))}
          </div>
        )}
        <button className={botaoSecundario} onClick={() => irPara("Orçamento")}>
          Ver orçamento
        </button>
      </section>
    </div>
  );
}

/* ───────────────────────── Convidados ───────────────────────── */

const normalizar = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

function Convidados({ dados }: { dados: DadosNoivos }) {
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState<Resposta | "todos">("todos");
  const [editando, setEditando] = useState<Convidado | null>(null);

  const lista = dados.convidados
    .filter((c) => filtro === "todos" || c.resposta === filtro)
    .filter((c) => !busca || c.pessoas.some((p) => normalizar(p).includes(normalizar(busca))))
    .sort((a, b) => a.titular.localeCompare(b.titular, "pt-BR"));

  const gravar = (c: Convidado) => {
    const existe = dados.convidados.some((x) => x.id === c.id);
    salvar({
      ...dados,
      convidados: existe ? dados.convidados.map((x) => (x.id === c.id ? c : x)) : [...dados.convidados, c],
    });
    setEditando(null);
  };
  const apagar = (id: string) => {
    salvar({ ...dados, convidados: dados.convidados.filter((x) => x.id !== id) });
    setEditando(null);
  };

  return (
    <div className="flex flex-col gap-4">
      <button
        className={botaoPrimario}
        onClick={() =>
          setEditando({ id: novoId(), titular: "", pessoas: [], telefone: "", lado: "Os dois", resposta: "pendente", quantosVem: 0, obs: "" })
        }
      >
        Adicionar convite
      </button>

      {dados.convidados.length > 0 && (
        <>
          <input
            type="search"
            aria-label="Buscar pelo nome"
            placeholder="Buscar pelo nome"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className={campo}
          />
          <div className="-mx-5 flex gap-2 overflow-x-auto px-5">
            {(["todos", "pendente", "vem", "nao-vem"] as const).map((f) => (
              <button key={f} aria-pressed={filtro === f} onClick={() => setFiltro(f)} className={chip(filtro === f)}>
                {f === "todos" ? "Todos" : rotuloResposta[f]}
              </button>
            ))}
          </div>
        </>
      )}

      {dados.convidados.length === 0 && (
        <p className="text-[15px] text-primary-deep">
          Nenhum convite ainda. Cada convite é uma família ou casal: o titular e todas as pessoas que vêm junto.
        </p>
      )}

      <ul className="flex flex-col gap-2.5">
        {lista.map((c) => {
          const zap = linkWhatsApp(c.telefone);
          return (
            <li key={c.id} className="flex items-stretch rounded-[3px] border border-surface bg-card">
              <button onClick={() => setEditando(c)} className="flex min-h-16 flex-1 flex-col items-start gap-0.5 px-3.5 py-3 text-left">
                <span className="text-base text-foreground">{c.titular || "(sem nome)"}</span>
                <span className="text-[13px] text-primary-deep">
                  {c.pessoas.length} {c.pessoas.length === 1 ? "pessoa" : "pessoas"} · {c.lado} ·{" "}
                  <span className={cn(c.resposta === "vem" && "text-gold-text-sm", c.resposta === "nao-vem" && "text-destructive")}>
                    {rotuloResposta[c.resposta]}
                    {c.resposta === "vem" && c.quantosVem !== c.pessoas.length ? ` (${c.quantosVem})` : ""}
                  </span>
                </span>
              </button>
              {zap && (
                <a
                  href={zap}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`WhatsApp de ${c.titular}`}
                  className="flex w-14 items-center justify-center border-l border-surface text-primary"
                >
                  <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M4 20l1.3-3.9A8 8 0 1 1 8 19z" />
                  </svg>
                </a>
              )}
            </li>
          );
        })}
      </ul>

      <Dialog open={editando !== null} onOpenChange={(aberto) => !aberto && setEditando(null)}>
        <DialogContent className="max-h-[90dvh] max-w-[calc(100%-1.5rem)] overflow-y-auto rounded-[3px] bg-background p-5 sm:max-w-md">
          {editando && (
            <FormConvidado
              inicial={editando}
              novo={!dados.convidados.some((x) => x.id === editando.id)}
              onGravar={gravar}
              onApagar={apagar}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Campo({ id, rotulo, children }: { id: string; rotulo: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className={rotuloCampo}>
        {rotulo}
      </label>
      {children}
    </div>
  );
}

function FormConvidado({
  inicial,
  novo,
  onGravar,
  onApagar,
}: {
  inicial: Convidado;
  novo: boolean;
  onGravar: (c: Convidado) => void;
  onApagar: (id: string) => void;
}) {
  const [c, setC] = useState(inicial);
  const [nomes, setNomes] = useState(inicial.pessoas.join("\n"));
  const mudar = (parte: Partial<Convidado>) => setC((x) => ({ ...x, ...parte }));

  const enviar = (e: React.FormEvent) => {
    e.preventDefault();
    const pessoas = nomes.split("\n").map((s) => s.trim()).filter(Boolean);
    const titular = c.titular.trim() || pessoas[0] || "";
    if (!titular) return toast.error("Coloque pelo menos o nome do titular.");
    // "Família Souza" não é uma pessoa: o titular só entra na lista se ela estiver vazia.
    if (pessoas.length === 0) pessoas.push(titular);
    const quantosVem = c.resposta === "vem" ? Math.min(c.quantosVem || pessoas.length, pessoas.length) : 0;
    onGravar({ ...c, titular, pessoas, quantosVem });
  };

  return (
    <form onSubmit={enviar} className="flex flex-col gap-4">
      <DialogTitle className="font-serif text-[28px] font-normal text-primary italic">
        {novo ? "Novo convite" : "Editar convite"}
      </DialogTitle>
      <Campo id="titular" rotulo="Titular (como vai no convite)">
        <input id="titular" className={campo} value={c.titular} onChange={(e) => mudar({ titular: e.target.value })} placeholder="Ex.: Família Souza" />
      </Campo>
      <Campo id="pessoas" rotulo="Pessoas do convite (uma por linha)">
        <textarea
          id="pessoas"
          rows={4}
          className={cn(campo, "h-auto py-3")}
          value={nomes}
          onChange={(e) => setNomes(e.target.value)}
          placeholder={"Maria Souza\nJoão Souza"}
        />
      </Campo>
      <Campo id="telefone" rotulo="WhatsApp">
        <input id="telefone" type="tel" inputMode="tel" className={campo} value={c.telefone} onChange={(e) => mudar({ telefone: e.target.value })} placeholder="(81) 99999-9999" />
      </Campo>
      <fieldset className="flex flex-col gap-1.5">
        <legend className={cn(rotuloCampo, "mb-1.5")}>Convidado de</legend>
        <div className="flex gap-2">
          {lados.map((l) => (
            <button type="button" key={l} aria-pressed={c.lado === l} onClick={() => mudar({ lado: l })} className={cn(chip(c.lado === l), "flex-1 justify-center")}>
              {l}
            </button>
          ))}
        </div>
      </fieldset>
      <fieldset className="flex flex-col gap-1.5">
        <legend className={cn(rotuloCampo, "mb-1.5")}>Resposta</legend>
        <div className="flex gap-2">
          {(["pendente", "vem", "nao-vem"] as const).map((r) => (
            <button type="button" key={r} aria-pressed={c.resposta === r} onClick={() => mudar({ resposta: r })} className={cn(chip(c.resposta === r), "flex-1 justify-center")}>
              {rotuloResposta[r]}
            </button>
          ))}
        </div>
      </fieldset>
      {c.resposta === "vem" && (
        <Campo id="quantos" rotulo="Quantas pessoas vêm (vazio = todas)">
          <input
            id="quantos"
            type="number"
            inputMode="numeric"
            min={1}
            className={campo}
            value={c.quantosVem || ""}
            onChange={(e) => mudar({ quantosVem: Number(e.target.value) || 0 })}
          />
        </Campo>
      )}
      <Campo id="obs-convidado" rotulo="Observações">
        <input id="obs-convidado" className={campo} value={c.obs} onChange={(e) => mudar({ obs: e.target.value })} placeholder="Ex.: restrição alimentar, criança de colo" />
      </Campo>
      <button type="submit" className={botaoPrimario}>
        Salvar
      </button>
      {!novo && (
        <button
          type="button"
          className="min-h-11 text-sm text-destructive"
          onClick={() => window.confirm(`Apagar o convite de ${c.titular}?`) && onApagar(c.id)}
        >
          Apagar convite
        </button>
      )}
    </form>
  );
}

/* ───────────────────────── Orçamento ───────────────────────── */

function Orcamento({ dados }: { dados: DadosNoivos }) {
  const [editando, setEditando] = useState<Gasto | null>(null);
  const g = somarGastos(dados.gastos);
  const novo = (item = ""): Gasto => ({ id: novoId(), item, fornecedor: "", previsto: 0, pago: 0, vencimento: "", obs: "", estimado: false });

  const gravar = (x: Gasto) => {
    const existe = dados.gastos.some((y) => y.id === x.id);
    salvar({ ...dados, gastos: existe ? dados.gastos.map((y) => (y.id === x.id ? x : y)) : [...dados.gastos, x] });
    setEditando(null);
  };
  const apagar = (id: string) => {
    salvar({ ...dados, gastos: dados.gastos.filter((y) => y.id !== id) });
    setEditando(null);
  };

  return (
    <div className="flex flex-col gap-4">
      {dados.gastos.length > 0 && (
        <div className="flex flex-col gap-2 rounded-[3px] border border-surface bg-card px-4 py-3.5">
          <p className="flex justify-between text-[15px]">
            <span className="text-primary-deep">Contratado</span>
            <span>{formatarValor(g.contratado)}</span>
          </p>
          <p className="flex justify-between text-[15px]">
            <span className="text-primary-deep">Já pago</span>
            <span>{formatarValor(g.pago)}</span>
          </p>
          <p className="flex justify-between border-t border-surface pt-2 text-base font-semibold">
            <span>Falta pagar</span>
            <span>{formatarValor(g.falta)}</span>
          </p>
          {g.estimativa > 0 && (
            <p className="flex justify-between text-[15px]">
              <span className="text-primary-deep">Sem contrato (estimativa)</span>
              <span>{formatarValor(g.estimativa)}</span>
            </p>
          )}
        </div>
      )}

      <button className={botaoPrimario} onClick={() => setEditando(novo())}>
        Adicionar gasto
      </button>

      {dados.gastos.length === 0 && (
        <>
          <p className="text-[15px] text-primary-deep">
            Nenhum gasto ainda. Dá para começar com os itens que quase todo casamento tem e ir preenchendo os valores.
          </p>
          <button className={botaoSecundario} onClick={() => salvar({ ...dados, gastos: gastosSugeridos.map((i) => novo(i)) })}>
            Começar com a lista sugerida
          </button>
        </>
      )}

      <ul className="flex flex-col gap-2.5">
        {dados.gastos.map((x) => {
          const parte = x.previsto ? Math.min(x.pago / x.previsto, 1) : 0;
          const quitado = x.previsto > 0 && x.pago >= x.previsto;
          const sit = situacao(x);
          const atrasado = !quitado && x.vencimento && x.vencimento < hoje();
          return (
            <li key={x.id}>
              <button onClick={() => setEditando(x)} className="flex w-full flex-col gap-2 rounded-[3px] border border-surface bg-card px-3.5 py-3 text-left">
                <span className="flex w-full items-baseline justify-between gap-3">
                  <span className="text-base text-foreground">{x.item}</span>
                  <span className="shrink-0 text-[15px] text-primary-deep">
                    {x.previsto ? `${formatarValor(x.previsto)}${x.estimado ? " est." : ""}` : "—"}
                  </span>
                </span>
                {x.previsto > 0 && !x.estimado && (
                  <span className="h-1 w-full overflow-hidden rounded-full bg-surface" aria-hidden="true">
                    <span className="block h-full bg-gold-line" style={{ width: `${parte * 100}%` }} />
                  </span>
                )}
                <span className="text-[13px] text-primary-deep">
                  {[
                    <span key="s" className={sit.cor}>
                      {sit.texto}
                    </span>,
                    x.fornecedor,
                    !quitado && x.pago ? `Pago ${formatarValor(x.pago)}` : null,
                    !quitado && x.vencimento ? (
                      <span key="v" className={cn(atrasado && "text-destructive")}>
                        {atrasado ? "Venceu" : "Vence"} {dataBr(x.vencimento)}
                      </span>
                    ) : null,
                  ]
                    .filter(Boolean)
                    .flatMap((v, i) => (i ? [" · ", v] : [v]))}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <Dialog open={editando !== null} onOpenChange={(aberto) => !aberto && setEditando(null)}>
        <DialogContent className="max-h-[90dvh] max-w-[calc(100%-1.5rem)] overflow-y-auto rounded-[3px] bg-background p-5 sm:max-w-md">
          {editando && (
            <FormGasto inicial={editando} novo={!dados.gastos.some((y) => y.id === editando.id)} onGravar={gravar} onApagar={apagar} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function FormGasto({
  inicial,
  novo,
  onGravar,
  onApagar,
}: {
  inicial: Gasto;
  novo: boolean;
  onGravar: (g: Gasto) => void;
  onApagar: (id: string) => void;
}) {
  const [x, setX] = useState(inicial);
  const [previsto, setPrevisto] = useState(mostrarReais(inicial.previsto));
  const [pago, setPago] = useState(mostrarReais(inicial.pago));
  const mudar = (parte: Partial<Gasto>) => setX((y) => ({ ...y, ...parte }));

  const enviar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!x.item.trim()) return toast.error("Dê um nome para o gasto.");
    onGravar({ ...x, item: x.item.trim(), previsto: lerReais(previsto), pago: lerReais(pago) });
  };

  return (
    <form onSubmit={enviar} className="flex flex-col gap-4">
      <DialogTitle className="font-serif text-[28px] font-normal text-primary italic">{novo ? "Novo gasto" : "Editar gasto"}</DialogTitle>
      <Campo id="item" rotulo="O quê">
        <input id="item" className={campo} value={x.item} onChange={(e) => mudar({ item: e.target.value })} placeholder="Ex.: Fotografia" />
      </Campo>
      <Campo id="fornecedor" rotulo="Fornecedor">
        <input id="fornecedor" className={campo} value={x.fornecedor} onChange={(e) => mudar({ fornecedor: e.target.value })} placeholder="Nome ou contato" />
      </Campo>
      <div className="grid grid-cols-2 gap-3">
        <Campo id="previsto" rotulo="Valor total (R$)">
          <input id="previsto" inputMode="decimal" className={campo} value={previsto} onChange={(e) => setPrevisto(e.target.value)} placeholder="0,00" />
        </Campo>
        <Campo id="pago" rotulo="Já pago (R$)">
          <input id="pago" inputMode="decimal" className={campo} value={pago} onChange={(e) => setPago(e.target.value)} placeholder="0,00" />
        </Campo>
      </div>
      <button
        type="button"
        aria-pressed={!!x.estimado}
        onClick={() => mudar({ estimado: !x.estimado })}
        className={cn(chip(!!x.estimado), "justify-center")}
      >
        {x.estimado ? "Valor ainda é estimativa ✓" : "Valor ainda é estimativa"}
      </button>
      <Campo id="vencimento" rotulo="Próximo pagamento">
        <input id="vencimento" type="date" className={campo} value={x.vencimento} onChange={(e) => mudar({ vencimento: e.target.value })} />
      </Campo>
      <Campo id="obs-gasto" rotulo="Observações (parcelas, o que está incluso…)">
        <textarea id="obs-gasto" rows={3} className={cn(campo, "h-auto py-3")} value={x.obs} onChange={(e) => mudar({ obs: e.target.value })} placeholder="Ex.: 10x de R$ 500, dia 5" />
      </Campo>
      <button type="submit" className={botaoPrimario}>
        Salvar
      </button>
      {!novo && (
        <button
          type="button"
          className="min-h-11 text-sm text-destructive"
          onClick={() => window.confirm(`Apagar "${x.item}"?`) && onApagar(x.id)}
        >
          Apagar gasto
        </button>
      )}
    </form>
  );
}

/* ───────────────────────── Checklist ───────────────────────── */

/** Caixa de marcar com alvo de 44px. */
function Marcar({ tarefa, onMudar }: { tarefa: Tarefa; onMudar: (feita: boolean) => void }) {
  return (
    <label className="flex size-11 shrink-0 cursor-pointer items-center justify-center">
      <input
        type="checkbox"
        checked={tarefa.feita}
        onChange={(e) => onMudar(e.target.checked)}
        aria-label={tarefa.titulo}
        className="size-5 cursor-pointer accent-primary"
      />
    </label>
  );
}

/** Etapas na ordem padrão; as que não estão nela vêm depois, na ordem em que aparecem. */
function ordemFases(tarefas: Tarefa[]) {
  const extras = [...new Set(tarefas.map((t) => t.fase))].filter((f) => !fasesPadrao.includes(f));
  return [...fasesPadrao, ...extras];
}

function Checklist({ dados }: { dados: DadosNoivos }) {
  const [categoria, setCategoria] = useState("Todas");
  const [esconderFeitas, setEsconderFeitas] = useState(false);
  const [editando, setEditando] = useState<Tarefa | null>(null);

  const categorias = [...new Set(dados.tarefas.map((t) => t.categoria).filter(Boolean))];
  const feitas = dados.tarefas.filter((t) => t.feita).length;
  const visiveis = dados.tarefas
    .filter((t) => categoria === "Todas" || t.categoria === categoria)
    .filter((t) => !esconderFeitas || !t.feita);

  const gravar = (t: Tarefa) => {
    const existe = dados.tarefas.some((x) => x.id === t.id);
    salvar({ ...dados, tarefas: existe ? dados.tarefas.map((x) => (x.id === t.id ? t : x)) : [...dados.tarefas, t] });
    setEditando(null);
  };
  const apagar = (id: string) => {
    salvar({ ...dados, tarefas: dados.tarefas.filter((x) => x.id !== id) });
    setEditando(null);
  };
  const nova = (): Tarefa => ({
    id: novoId(),
    titulo: "",
    nota: "",
    fase: fasesPadrao[0],
    categoria: categoria === "Todas" ? "" : categoria,
    feita: false,
    urgente: false,
  });

  return (
    <div className="flex flex-col gap-4">
      {dados.tarefas.length > 0 && (
        <div className="flex flex-col gap-2 rounded-[3px] border border-surface bg-card px-4 py-3.5">
          <p className="flex justify-between text-[15px]">
            <span className="text-primary-deep">Feitas</span>
            <span>
              {feitas} de {dados.tarefas.length}
            </span>
          </p>
          <span className="h-1 w-full overflow-hidden rounded-full bg-surface" aria-hidden="true">
            <span className="block h-full bg-gold-line" style={{ width: `${(feitas / dados.tarefas.length) * 100}%` }} />
          </span>
        </div>
      )}

      <button className={botaoPrimario} onClick={() => setEditando(nova())}>
        Adicionar tarefa
      </button>

      {dados.tarefas.length === 0 && (
        <p className="text-[15px] text-primary-deep">
          Nenhuma tarefa ainda. Adicione uma por uma ou abra uma cópia que já tenha o checklist (botão “Abrir cópia” lá
          embaixo).
        </p>
      )}

      {dados.tarefas.length > 0 && (
        <div className="-mx-5 flex gap-2 overflow-x-auto px-5">
          <button aria-pressed={esconderFeitas} onClick={() => setEsconderFeitas((v) => !v)} className={chip(esconderFeitas)}>
            Só o que falta
          </button>
          {["Todas", ...categorias].map((c) => (
            <button key={c} aria-pressed={categoria === c} onClick={() => setCategoria(c)} className={chip(categoria === c)}>
              {c}
            </button>
          ))}
        </div>
      )}

      {ordemFases(dados.tarefas).map((fase) => {
        const daFase = visiveis.filter((t) => t.fase === fase);
        if (daFase.length === 0) return null;
        const todas = dados.tarefas.filter((t) => t.fase === fase);
        return (
          <section key={fase} className="flex flex-col gap-1">
            <h2 className="flex items-baseline justify-between gap-3 border-b border-gold-line pb-1.5 font-serif text-xl text-primary">
              <span>{fase}</span>
              <span className="shrink-0 font-sans text-[13px] text-primary-deep">
                {todas.filter((t) => t.feita).length}/{todas.length}
              </span>
            </h2>
            <ul className="flex flex-col">
              {daFase.map((t) => (
                <li key={t.id} className="flex items-start border-b border-surface last:border-b-0">
                  <Marcar tarefa={t} onMudar={(v) => marcarTarefa(dados, t.id, v)} />
                  <button onClick={() => setEditando(t)} className="flex min-h-11 flex-1 flex-col items-start gap-0.5 py-2.5 text-left">
                    <span className={cn("text-[15px]", t.feita ? "text-primary-deep line-through" : "text-foreground")}>{t.titulo}</span>
                    {t.nota && !t.feita && <span className="line-clamp-2 text-[13px] text-primary-deep">{t.nota}</span>}
                    <span className="text-[12px] text-primary-deep">
                      {t.categoria}
                      {t.urgente && !t.feita && <span className="text-gold-text-sm">{t.categoria ? " · " : ""}agora</span>}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        );
      })}

      <Dialog open={editando !== null} onOpenChange={(aberto) => !aberto && setEditando(null)}>
        <DialogContent className="max-h-[90dvh] max-w-[calc(100%-1.5rem)] overflow-y-auto rounded-[3px] bg-background p-5 sm:max-w-md">
          {editando && (
            <FormTarefa
              inicial={editando}
              novo={!dados.tarefas.some((x) => x.id === editando.id)}
              fases={ordemFases(dados.tarefas)}
              categorias={categorias}
              onGravar={gravar}
              onApagar={apagar}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function FormTarefa({
  inicial,
  novo,
  fases,
  categorias,
  onGravar,
  onApagar,
}: {
  inicial: Tarefa;
  novo: boolean;
  fases: string[];
  categorias: string[];
  onGravar: (t: Tarefa) => void;
  onApagar: (id: string) => void;
}) {
  const [t, setT] = useState(inicial);
  const mudar = (parte: Partial<Tarefa>) => setT((x) => ({ ...x, ...parte }));

  const enviar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!t.titulo.trim()) return toast.error("Escreva o que precisa ser feito.");
    onGravar({ ...t, titulo: t.titulo.trim(), categoria: t.categoria.trim(), nota: t.nota.trim() });
  };

  return (
    <form onSubmit={enviar} className="flex flex-col gap-4">
      <DialogTitle className="font-serif text-[28px] font-normal text-primary italic">{novo ? "Nova tarefa" : "Editar tarefa"}</DialogTitle>
      <Campo id="titulo-tarefa" rotulo="O que fazer">
        <input id="titulo-tarefa" className={campo} value={t.titulo} onChange={(e) => mudar({ titulo: e.target.value })} />
      </Campo>
      <Campo id="nota-tarefa" rotulo="Detalhes">
        <textarea id="nota-tarefa" rows={5} className={cn(campo, "h-auto py-3")} value={t.nota} onChange={(e) => mudar({ nota: e.target.value })} />
      </Campo>
      <Campo id="fase-tarefa" rotulo="Quando">
        <select id="fase-tarefa" className={campo} value={t.fase} onChange={(e) => mudar({ fase: e.target.value })}>
          {fases.map((f) => (
            <option key={f}>{f}</option>
          ))}
        </select>
      </Campo>
      <Campo id="categoria-tarefa" rotulo="Categoria">
        <input
          id="categoria-tarefa"
          list="categorias-tarefa"
          className={campo}
          value={t.categoria}
          onChange={(e) => mudar({ categoria: e.target.value })}
          placeholder="Ex.: Convites"
        />
        <datalist id="categorias-tarefa">
          {categorias.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
      </Campo>
      <div className="grid grid-cols-2 gap-2">
        <button type="button" aria-pressed={t.urgente} onClick={() => mudar({ urgente: !t.urgente })} className={cn(chip(t.urgente), "justify-center")}>
          Resolver agora
        </button>
        <button type="button" aria-pressed={t.feita} onClick={() => mudar({ feita: !t.feita })} className={cn(chip(t.feita), "justify-center")}>
          Feita
        </button>
      </div>
      <button type="submit" className={botaoPrimario}>
        Salvar
      </button>
      {!novo && (
        <button
          type="button"
          className="min-h-11 text-sm text-destructive"
          onClick={() => window.confirm(`Apagar "${t.titulo}"?`) && onApagar(t.id)}
        >
          Apagar tarefa
        </button>
      )}
    </form>
  );
}

/* ───────────────────────── Notas ───────────────────────── */

function Notas({ dados }: { dados: DadosNoivos }) {
  const [editando, setEditando] = useState<Nota | null>(null);

  const gravar = (n: Nota) => {
    const existe = dados.notas.some((x) => x.id === n.id);
    salvar({ ...dados, notas: existe ? dados.notas.map((x) => (x.id === n.id ? n : x)) : [...dados.notas, n] });
    setEditando(null);
  };
  const apagar = (id: string) => {
    salvar({ ...dados, notas: dados.notas.filter((x) => x.id !== id) });
    setEditando(null);
  };

  return (
    <div className="flex flex-col gap-4">
      <button className={botaoPrimario} onClick={() => setEditando({ id: novoId(), titulo: "", texto: "" })}>
        Adicionar nota
      </button>
      {dados.notas.length === 0 && (
        <p className="text-[15px] text-primary-deep">
          Nenhuma nota ainda. Bom para o que não é tarefa nem gasto: perguntas para a degustação, quantidade de bebidas,
          contatos.
        </p>
      )}
      <ul className="flex flex-col gap-2.5">
        {dados.notas.map((n) => (
          <li key={n.id}>
            <button onClick={() => setEditando(n)} className="flex w-full flex-col gap-2 rounded-[3px] border border-surface bg-card px-3.5 py-3 text-left">
              <span className="font-serif text-xl text-primary">{n.titulo || "(sem título)"}</span>
              <span className="text-[14px] whitespace-pre-line text-foreground">{n.texto}</span>
            </button>
          </li>
        ))}
      </ul>

      <Dialog open={editando !== null} onOpenChange={(aberto) => !aberto && setEditando(null)}>
        <DialogContent className="max-h-[90dvh] max-w-[calc(100%-1.5rem)] overflow-y-auto rounded-[3px] bg-background p-5 sm:max-w-md">
          {editando && (
            <FormNota inicial={editando} novo={!dados.notas.some((x) => x.id === editando.id)} onGravar={gravar} onApagar={apagar} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function FormNota({
  inicial,
  novo,
  onGravar,
  onApagar,
}: {
  inicial: Nota;
  novo: boolean;
  onGravar: (n: Nota) => void;
  onApagar: (id: string) => void;
}) {
  const [n, setN] = useState(inicial);

  const enviar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!n.titulo.trim() && !n.texto.trim()) return toast.error("A nota está vazia.");
    onGravar({ ...n, titulo: n.titulo.trim() });
  };

  return (
    <form onSubmit={enviar} className="flex flex-col gap-4">
      <DialogTitle className="font-serif text-[28px] font-normal text-primary italic">{novo ? "Nova nota" : "Editar nota"}</DialogTitle>
      <Campo id="titulo-nota" rotulo="Título">
        <input id="titulo-nota" className={campo} value={n.titulo} onChange={(e) => setN({ ...n, titulo: e.target.value })} />
      </Campo>
      <Campo id="texto-nota" rotulo="Texto">
        <textarea id="texto-nota" rows={12} className={cn(campo, "h-auto py-3")} value={n.texto} onChange={(e) => setN({ ...n, texto: e.target.value })} />
      </Campo>
      <button type="submit" className={botaoPrimario}>
        Salvar
      </button>
      {!novo && (
        <button
          type="button"
          className="min-h-11 text-sm text-destructive"
          onClick={() => window.confirm(`Apagar a nota "${n.titulo}"?`) && onApagar(n.id)}
        >
          Apagar nota
        </button>
      )}
    </form>
  );
}

/* ───────────────────────── Cópias ───────────────────────── */

function Copias({ dados }: { dados: DadosNoivos }) {
  const arquivo = useRef<HTMLInputElement>(null);

  const baixar = () => {
    const blob = new Blob([JSON.stringify(dados, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `cavi2027-noivos-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const carregar = async (f: File | undefined) => {
    if (!f) return;
    try {
      const novos = validar(JSON.parse(await f.text()));
      if (window.confirm(`Trocar o que está neste aparelho por esta cópia (${novos.convidados.length} convites, ${novos.gastos.length} gastos, ${novos.tarefas.length} tarefas, ${novos.notas.length} notas)?`)) {
        salvar(novos);
        toast.success("Cópia carregada.");
      }
    } catch {
      toast.error("Esse arquivo não é uma cópia da área dos noivos.");
    }
    if (arquivo.current) arquivo.current.value = "";
  };

  return (
    <section className="mt-4 flex flex-col gap-3 border-t border-gold-line pt-6">
      <p className="text-[13px] text-primary-deep">
        Por enquanto tudo fica salvo só neste aparelho, e nada aparece no site. Para passar para o outro celular ou
        guardar um backup, salve uma cópia e abra no outro aparelho.
      </p>
      <div className="grid grid-cols-2 gap-2.5">
        <button className={botaoSecundario} onClick={baixar}>
          Salvar cópia
        </button>
        <button className={botaoSecundario} onClick={() => arquivo.current?.click()}>
          Abrir cópia
        </button>
      </div>
      <input ref={arquivo} type="file" accept="application/json,.json" hidden onChange={(e) => carregar(e.target.files?.[0])} />
    </section>
  );
}
