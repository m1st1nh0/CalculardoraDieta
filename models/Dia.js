export class Dia {
  constructor(nome, id) {
    this.nome = nome;
    this.id = id;
    this.refeicoes = [];
    this.proxId = 1;
  }

  //Funções
  adicionarRefeicao(refeicao) {
    refeicao.id = this.proxId;
    this.refeicoes.push(refeicao);
    this.proxId++;
    
  }
  excluirRefeicao(id) {
    this.refeicoes = this.refeicoes.filter((refeicao) => refeicao.id != id);
  }
}
