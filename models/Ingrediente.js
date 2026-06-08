export class Ingrediente {
  constructor(nome, calorias = 0) {
    this.validar(nome);
    this.nome = nome;
    this.calorias = calorias;
  }
  validar(nome){
    if (!nome || typeof nome !== 'string' ||nome.trim().length ===0) {
      throw new Error('O nome do ingrediente é obrigatório');
    }
  }
}
