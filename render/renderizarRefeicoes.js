import { Refeicao } from "../models/Refeicao.js";

export function renderizarRefeicoes(dia) {
  const displayDia = document.getElementById(dia.id); //Selecionando coluna pelo id do dia
  

  //se o dia tiver refeições, renderizar cada uma delas
  if (dia.refeicoes.length > 0) {
    for (let i = 0; i < dia.refeicoes.length; i++) {
      const div = document.createElement("div"); //Criando div para conter a refeição
      const tabela = document.createElement("table");
      const rTitulo = document.createElement("tr");
      const titulo = document.createElement("th");
      const refDoDia = dia.refeicoes[i]; //Selecionando a refeição iterada

      const excbtnDisplay = document.createElement("th");
      const excbtn = document.createElement("button");

      excbtn.className = "excbtnRefeicao";
      excbtn.textContent = "X";

      excbtn.addEventListener("click", () => {
        refDoDia.excluirItem(refDoDia.id);
        renderizarRefeicoes(dia);
      });

      div.className = "refeicao";
      div.id = refDoDia.id;
      titulo.innerHTML = `${refDoDia.nome}`;
      rTitulo.appendChild(titulo);
      tabela.appendChild(rTitulo);
      div.appendChild(tabela);
      displayDia.appendChild(div);
      excbtnDisplay.appendChild(excbtn);
      rTitulo.appendChild(excbtnDisplay);

      for (let i = 0; i < refDoDia.itens.length; i++) {
        const itensRefDoDia = refDoDia.itens[i];
        const rdata = document.createElement("tr");
        rdata.innerHTML = `
          <td>${itensRefDoDia.ingrediente}</td>
          <td>${itensRefDoDia.peso}</td>
        `;
        tabela.appendChild(rdata);
      }

      //Adicionando a refeição ao dia
    }
  }
}
