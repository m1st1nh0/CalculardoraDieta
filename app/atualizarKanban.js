import { estado } from "./estados.js";
import { renderizarSemana } from "../render/renderizarSemana.js";
import { limparTela } from "./limparTela.js";
import { renderizarModal } from "../render/renderizarModal.js";
import { renderizarTotais } from "../render/renderizarTotais.js";

//Função para atualizar o kanban, renderizando a semana e os modais
export function atualizarKanban(kanban) {
  //Pega o plano semanal setado em estado
  const {planoSemanal} = estado.getState();

  //Limpa a tela do kanban, renderiza os modais e renderiza a semana no kanban
  limparTela(kanban);
  renderizarModal(kanban);
  renderizarSemana(planoSemanal, kanban);
  renderizarTotais();

}
