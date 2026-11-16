import "server-only";
import { createHash, timingSafeEqual } from "node:crypto";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";

/**
 * Sessão dos noivos: uma senha só (NOIVOS_SENHA), um cookie assinado de 30 dias (SESSAO_SEGREDO).
 * Modelo "stateless session" do guia de autenticação do Next 16 (specs/006 R5).
 */
const COOKIE = "noivos";
const DURACAO_S = 30 * 24 * 60 * 60;

function chave() {
  const segredo = process.env.SESSAO_SEGREDO;
  if (!segredo || segredo.length < 32) throw new Error("SESSAO_SEGREDO ausente ou curto (mínimo 32 caracteres).");
  return new TextEncoder().encode(segredo);
}

const resumo = (s: string) => createHash("sha256").update(s).digest();

/** Comparação em tempo constante; sem NOIVOS_SENHA configurada, nada entra. */
export function senhaConfere(tentativa: string) {
  const senha = process.env.NOIVOS_SENHA;
  if (!senha) return false;
  return timingSafeEqual(resumo(tentativa), resumo(senha));
}

export async function criarSessao() {
  const token = await new SignJWT({ v: 1 })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${DURACAO_S}s`)
    .sign(chave());
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: DURACAO_S,
  });
}

export async function sessaoValida() {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return false;
  try {
    await jwtVerify(token, chave(), { algorithms: ["HS256"] });
    return true;
  } catch {
    return false;
  }
}

export async function apagarSessao() {
  (await cookies()).delete(COOKIE);
}
