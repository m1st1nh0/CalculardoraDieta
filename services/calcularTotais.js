import { estado } from "../app/estados.js";

export function calcularTotais() {
  const { planoSemanal } = estado.getState();
  const dias = planoSemanal.getDias();
  const totais = new Map();

  for (const dia of dias) {
    for (const refeicao of dia.getRefeicoes()) {
      for (const item of refeicao.getItens()) {
        const nome = item.getNomeItem();

        if (!totais.has(nome)) {
          totais.set(nome, {
            ingrediente: nome,
            peso: 0,
          });
        }
        totais.get(nome).peso += item.getPeso();
      }
    }
  }
  return [...totais.values()];
}
