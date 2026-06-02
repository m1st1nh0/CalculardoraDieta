import { renderizarRefeicoes } from "./renderizarRefeicoes.js";
import { renderizarBotao } from "./renderizarBotao.js";

export function renderizarDia(dia, kanban) {
  const col = document.createElement("div");//Div que conterá a coluna do dia

  //Configurações da coluna
  col.id = dia.id;

  //Conteúdo da coluna
  col.innerHTML = `
  <div class = "titulo"><h4>${dia.nome}</h4></div>
  `;

  //Adicionando a coluna ao kanban
  kanban.appendChild(col);
  //Renderizando as refeições desse dia
  renderizarRefeicoes(dia);
  //Renderizando o botão de adicionar refeição desse dia
  renderizarBotao(dia);
}
