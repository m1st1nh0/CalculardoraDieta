import { Refeicao } from "../models/Refeicao.js";
import { Dia } from "../models/Dia.js";
import { atualizarKanban } from "../app/atualizarKanban.js";
import { kanban } from "../main.js";
export function renderizarRefeicoes(dia) {
  const displayDia = document.getElementById(dia.id); //Selecionando coluna pelo id do dia

  //se o dia tiver refeições, renderizar cada uma delas
  if (dia.refeicoes.length > 0) {
    for (let i = 0; i < dia.refeicoes.length; i++) {
      const div = document.createElement("div"); //Criando div para conter a refeição
      const tabela = document.createElement("table");
      const rTitulo = document.createElement("div");
      rTitulo.id = "rTitulo";
      const titulo = document.createElement("p");
      const refDoDia = dia.refeicoes[i]; //Selecionando a refeição iterada

      const excbtnDisplay = document.createElement("div");
      excbtnDisplay.id = "excbtnDisplay";
      const excbtn = document.createElement("button");

      excbtn.className = "excbtnRefeicao";
      excbtn.textContent = "X";

      excbtn.addEventListener("click", () => {
        dia.excluirRefeicao(refDoDia.id);
        renderizarRefeicoes(dia);
        atualizarKanban(kanban);
        console.log("fui clicado");
      });
      rTitulo.addEventListener("click", () => {
        if (tabela.style.display == "") {
          tabela.style.display = "none";
        } else {
          tabela.style.display = "";
        }
      });

      div.className = "refeicao";
      div.id = refDoDia.id;
      tabela.id = `tabelaRefeicao`;
      tabela.style.display = "none";
      titulo.innerHTML = `${refDoDia.nome.toUpperCase()}`;
      excbtnDisplay.appendChild(excbtn);
      rTitulo.appendChild(titulo);
      div.appendChild(rTitulo);
      div.appendChild(excbtnDisplay);
      div.appendChild(tabela);
      displayDia.appendChild(div);

      for (let i = 0; i < refDoDia.itens.length; i++) {
        const itensRefDoDia = refDoDia.itens[i];
        const rdata = document.createElement("tr");
        rdata.innerHTML = `
          <td>${itensRefDoDia.ingrediente}</td>
          <td>${itensRefDoDia.peso} g</td>
        `;
        tabela.appendChild(rdata);
      }

      //Adicionando a refeição ao dia
    }
  }
}
