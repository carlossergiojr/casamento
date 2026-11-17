import { revalidatePath } from "next/cache";
import { sincronizarPagamento } from "@/lib/mercado-pago";

/**
 * Webhook do Mercado Pago (specs/008). O aviso só traz o id do pagamento; o status vem sempre de
 * uma consulta à API com o nosso token, então um aviso falso não marca nada como pago. Responde
 * 200 rápido; erro vira 500 e o MP tenta de novo.
 */
export async function POST(req: Request) {
  const url = new URL(req.url);
  const corpo = (await req.json().catch(() => ({}))) as { type?: string; topic?: string; data?: { id?: string | number } };
  // Formato novo: { type: "payment", data: { id } } (também em ?type=payment&data.id=);
  // o antigo (IPN): ?topic=payment&id=. Outros tópicos (merchant_order…) não interessam.
  const tipo = corpo.type ?? corpo.topic ?? url.searchParams.get("type") ?? url.searchParams.get("topic");
  const id = corpo.data?.id ?? url.searchParams.get("data.id") ?? url.searchParams.get("id");
  if (tipo !== "payment" || !id) return new Response(null, { status: 200 });

  try {
    const r = await sincronizarPagamento(String(id));
    // Entrou ou saiu de "approved" (pago, estornado): listas e páginas de presente mudam.
    if (r && (r.linha.status === "approved" || r.antes === "approved")) revalidatePath("/", "layout");
    return new Response(null, { status: 200 });
  } catch (e) {
    console.error("webhook mp:", e);
    return new Response(null, { status: 500 });
  }
}
