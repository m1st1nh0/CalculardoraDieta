import { Refeicao } from "../models/Refeicao.js";
import { estado } from "../app/estados.js";

export function renderizarItemRefeicao() {
  const { refeicaoEmAndamento } = estado.getState(); //Verifica qual refeição será escopo da função
  const displayItem = document.getElementById("itemRefeicao"); //Seleciona o display de itens da refeição

  displayItem.innerHTML = ""; //Limpa o display para renderizar os itens atualizados

  //Criar tabela para exibir os itens da refeição
  const tabela = document.createElement("table");
  //Configurações da tabela
  tabela.id = "tabelaItens";
  tabela.innerHTML = `
    <tr>
        <th>Ingrediente</th>
        <th>Quantidade</th>
        <th>Excluir</th>
    </tr>
  `;
  //Adicionar a tabela ao display
  displayItem.appendChild(tabela);

  const itensRefeicao = refeicaoEmAndamento.getItens(); //Seleciona a lista dos itens da refeição em andamento

  //Cria uma linha na tabela cada item da refeição
  for (let i = 0; i < itensRefeicao.length; i++) {
    const item = itensRefeicao[i]; //Seleciona o item da refeição
    const row = document.createElement("tr"); //Cria uma linha para o item
    //configurações da linha
    row.id = item.id;
    row.innerHTML = `
        <td>${item.getNomeItem()}</td>
        <td>${item.getPeso()}(g)</td>       
        
    `;
    //Criação do botaão de exclusão do item
    const excbtnDisplay = document.createElement("td"); //Define o display do botão de exclusão
    const excbtn = document.createElement("button"); //Cria o botão de exclusão
    //Configurações do botão de exclusão
    excbtn.className = "excbtn";
    excbtn.textContent = "X";

    //Engatilhando botão de exclusão do item
    excbtn.addEventListener("click", () => {
      estado.refeicaoEmAndamento.excluirItem(Number(row.id));
      renderizarItemRefeicao();
    });

    //Adiciona botão ao display do botão
    excbtnDisplay.appendChild(excbtn);
    //Adiciona o display do botão à linha da tabela
    row.appendChild(excbtnDisplay);
    //Adiciona a linha à tabela
    tabela.appendChild(row);
  }
}
