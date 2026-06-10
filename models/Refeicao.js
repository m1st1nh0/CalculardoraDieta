import { ItemRefeicao } from "./ItemRefeicao.js";

export class Refeicao {
  #itens = [];
  constructor(nome) {
    this.validar(nome);
    this.nome = nome;
    this.proxId = 1;
    this.id = null;
  }

  //Funções
  validar(nome) {
    if (!nome || typeof nome !== "string" || nome.trim().length === 0) {
      throw new Error("O nome da reifeição é obrigatório");
    }
  }
  adicionarItem(ingrediente, peso) {
    const item = new ItemRefeicao(ingrediente, peso);
    item.id = this.proxId;
    this.#itens.push(item);
    this.proxId++;
  }
  excluirItem(id) {
    this.#itens = this.#itens.filter((item) => item.id != id);
  }

  getItens() {
    return this.#itens;
  }
}
