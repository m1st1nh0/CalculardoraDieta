export class ItemRefeicao {
  constructor(ingrediente, peso) {
    if (typeof ingrediente == "string") {
      this.ingrediente = ingrediente;
    } else {
      this.ingrediente = ingrediente;
    }
    this.peso = this.validarPeso(peso);
    this.id = Date.now() + Math.random();
  }
  validarPeso(peso) {
    const p = Number(peso);
    if (isNaN(p) || p <= 0 || p =="") {
      throw new Error("O pese deve ser um número maior que zero");
    }
    return p;
  }
}
