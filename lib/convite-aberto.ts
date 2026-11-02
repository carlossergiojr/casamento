/** Marca na sessão que o convite já foi aberto (specs/001 US1, plan R1). */
export const CHAVE_CONVITE_ABERTO = "cavi-convite-aberto";

/**
 * Roda antes da pintura (no <head>): se o convite já foi aberto nesta sessão, esconde o
 * envelope por CSS, sem piscar. Sem JS, o <noscript> do layout faz o mesmo.
 */
export const scriptConviteAberto = `try{if(sessionStorage.getItem("${CHAVE_CONVITE_ABERTO}"))document.documentElement.dataset.convite="aberto"}catch(e){}`;
