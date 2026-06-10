import { estado } from "../app/estados.js";
import { Ingrediente } from "../models/Ingrediente.js";
import { ItemRefeicao } from "../models/ItemRefeicao.js";
import { renderizarItemRefeicao } from "../render/renderizarItemRefeicao.js";
import { Refeicao } from "../models/Refeicao.js";
import { passarModal } from "./modal.js";
import { calcularTotais } from "../services/calcularTotais.js";


//Função para criar uma refeição
export function criarRefeicao() {
  //Pega o valor do input do nome da refeição
  const input = document.getElementById("nomeRefeicao");
  const nomeRefeicao = input.value;
  try {
    const r = new Refeicao(nomeRefeicao);
    const { diaSelecionado } = estado.getState();

    diaSelecionado.adicionarRefeicao(r);
    estado.setRefeicaoEmAndamento(r);
    console.log("deu bom");
    renderizarItemRefeicao()
    passarModal();
  } catch (error) {
    alert(error.message);
  }
}

//Função para criar um item de refeição
export function criarItemRefeicao() {
  //pega os valores dos inputs de ingrediente e quantidade
  const nomeIngrediente = document.getElementById("ingrediente").value;
  const quantidade = document.getElementById("quantidade").value;
  const { refeicaoEmAndamento } = estado.getState();
  //Cria um novo item de refeição com os valores dos inputs

  try {
    const ingrediente = new Ingrediente(nomeIngrediente);
    refeicaoEmAndamento.adicionarItem(ingrediente, quantidade);

    document.getElementById("ingrediente").value = "";
    document.getElementById("quantidade").value = "";
  } catch (error) {
    alert(error.message);
  }
}
