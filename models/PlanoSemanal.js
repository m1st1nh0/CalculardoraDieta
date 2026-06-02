import { Dia } from "./Dia.js";
export class PlanoSemanal {
  constructor() {
    this.dias = [];

    //Instanciando os dias da semana
    const segunda = new Dia("Segunda-feira", "segunda");
    const terca = new Dia("Terça-feira", "terca");
    const quarta = new Dia("Quarta-feira", "quarta");
    const quinta = new Dia("Quinta-feira", "quinta");
    const sexta = new Dia("Sexta-feira", "sexta");
    const sabado = new Dia("Sábado", "sabado");
    const domingo = new Dia("Domingo", "domingo");

    this.dias.push(segunda, terca, quarta, quinta, sexta, sabado, domingo);
  }
}
