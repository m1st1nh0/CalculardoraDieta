import { estado } from "../app/estados.js";

const { planoSemanal } = estado.getState();

const dias = planoSemanal.getDias();
const refeicoes = dias.map(pegarRefeicoes);
const itensRefeicao = refeicoes.map(pegarItensRefeicao);

function pegarRefeicoes(dia) {
  return dia.getRefeicoes();
}
function pegarItensRefeicao(refeicao) {
  return refeicao.getItens();
}
