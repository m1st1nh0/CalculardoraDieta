import { ItemRefeicao } from "./ItemRefeicao.js";

export class Refeicao {
  constructor(nome) {
    this.nome = nome;
    this.itens = [];
    this.proxId = 1;
  }


  
  //Funções
  adicionarItem(ingrediente, peso) {
    const item = new ItemRefeicao(ingrediente, peso);
    item.id = this.proxId;
    this.itens.push(item);
    this.proxId++;
  }
  excluirItem(id) {
    this.itens = this.itens.filter((item) => item.id != id);
  }
}
