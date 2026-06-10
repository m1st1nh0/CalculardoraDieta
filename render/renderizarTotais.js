import { estado } from "../app/estados.js";
import { calcularTotais } from "../services/calcularTotais.js";

export function renderizarTotais() {
  const container = document.getElementById("container");
  const dashTotais = document.createElement("div");
  dashTotais.id = "dashTotais";
  dashTotais.innerHTML = `
        <div id="tituloTotais">Totais da Semana</div>
    `;
  const tabelaTotais = document.createElement("table");
  tabelaTotais.id = "tabelaTotais";
  tabelaTotais.innerHTML = `
        <thead>
            <tr>
                <th>Ingrediente</th>
                <th>Quantidade (g)</th>
            </tr>
        </thead>
        <tbody></tbody>
    `;

  container.appendChild(dashTotais);
  dashTotais.appendChild(tabelaTotais);

  let { planoSemanal } = estado.getState();
  let itensDaSemana = calcularTotais(planoSemanal.getDias());

  if (itensDaSemana) {
    const tbody = tabelaTotais.querySelector("tbody");
    for (const item of itensDaSemana) {
      const r = document.createElement("tr");
      r.innerHTML = `
            <td>${item.ingrediente}</td>
            <td>${item.peso}</td>
        `;
      tbody.appendChild(r);
    }
  }
}
