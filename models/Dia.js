export class Dia {
  constructor(nome, id) {
    this.nome = nome;
    this.id = id;
    this.refeicoes = [];
  }


  //Funções
  adicionarRefeicao(refeicao) {
    this.refeicoes.push(refeicao);
    return;
  }
}
