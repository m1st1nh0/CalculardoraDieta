import { renderizarDia } from "./renderizarDia.js";

export function renderizarSemana(plano, kanban) {
  //Para cada dia do plano, renderizar o dia no kanban
  for (let i = 0; i < plano.getDias().length; i++) {
    const d = plano.getDias()[i]; //Selecionar o dia do plano
    renderizarDia(d, kanban); //Renderizar no kanban
  }
}
