import { PlanoSemanal } from "./models/PlanoSemanal.js";
import { renderizarSemana } from "./render/renderizarSemana.js";
import { criarRefeicao } from "./ui/refeicaoForm.js";
import { criarItemRefeicao } from "./ui/refeicaoForm.js";
import { renderizarItemRefeicao } from "./render/renderizarItemRefeicao.js";
import { estado } from "./app/estados.js";
import { fecharModais } from "./ui/modal.js";
import { atualizarKanban } from "./app/atualizarKanban.js";
import { limparTela } from "./app/limparTela.js";
import { voltarModal } from "./ui/modal.js";

export const kanban = document.getElementById("kanban"); //Setar Kanaban
const p = new PlanoSemanal(); //Instanciar plano semanal
estado.planoSemanal = p; //Setar plano semanal no estado

atualizarKanban(kanban);

//Engatilhar botões e window
kanban.addEventListener("click", (event) => {
  if (event.target.id === "submitModel1") {
    criarRefeicao();

  }

  if (event.target.id === "btnAdcItem") {
    criarItemRefeicao();
    renderizarItemRefeicao();
  }

  if (event.target.id === "finishbtn") {
    fecharModais();
    atualizarKanban(kanban);
  }
  if (event.target.id == "btnVoltar"){
    voltarModal()
  }
});
