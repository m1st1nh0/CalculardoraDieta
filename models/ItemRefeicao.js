import { Ingrediente } from "./Ingrediente.js";

export class ItemRefeicao {
  #ingrediente;
  #peso;
  constructor(ingrediente, peso) {
    if (typeof ingrediente == "string") {
      this.#ingrediente = criarIngrediente(ingrediente);
    } else {
      this.#ingrediente = ingrediente;
    }

    this.#peso = this.validarPeso(peso);
    this.id = Date.now() + Math.random();
  }
  validarPeso(peso) {
    const p = Number(peso);
    if (isNaN(p) || p <= 0 || p == "") {
      throw new Error("O pese deve ser um número maior que zero");
    }
    return p;
  }
  criarIngrediente(ingrediente) {
    const i = new Ingrediente(ingrediente);
    return i;
  }
  getNomeItem() {
    return this.#ingrediente.getNomeIngrediente().toLowerCase();
  }
  getPeso() {
    return this.#peso;
  }
}
