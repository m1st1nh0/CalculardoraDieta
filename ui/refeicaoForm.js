import { estado } from "../app/estados.js";
import { ItemRefeicao } from "../models/ItemRefeicao.js";
import { renderizarItemRefeicao } from "../render/renderizarItemRefeicao.js";
import { Refeicao } from "../models/Refeicao.js";
import { passarModal } from "./modal.js";

//Função para criar uma refeição
export function criarRefeicao() {
  //Pega o valor do input do nome da refeição
  let nomeRefeicao = document.getElementById("nomeRefeicao").value;
  //Instancia a refeição com o nomeRefeição
  const r = new Refeicao(nomeRefeicao);
  //Adicionar refeição ao dia selecionado
  estado.diaSelecionado.adicionarRefeicao(r);
  //Seta refeição criada como a refeição em andamento
  estado.refeicaoEmAndamento = r;

  //Chama função para passar o modal
  passarModal();
}

//Função para criar um item de refeição
export function criarItemRefeicao() {
  //pega os valores dos inputs de ingrediente e quantidade
  const ingrediente = document.getElementById("ingrediente").value;
  const quantidade = document.getElementById("quantidade").value;

  //Cria um novo item de refeição com os valores dos inputs
  estado.refeicaoEmAndamento.adicionarItem(ingrediente, quantidade);

  //Zera os valores dos inputs
  document.getElementById("ingrediente").value = "";
  document.getElementById("quantidade").value = "";
}
