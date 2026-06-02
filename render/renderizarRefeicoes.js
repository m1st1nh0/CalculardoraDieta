export function renderizarRefeicoes(dia) {
  const displayDia = document.getElementById(dia.id);//Selecionando coluna pelo id do dia

  //se o dia tiver refeições, renderizar cada uma delas
  if (dia.refeicoes.length > 0) {
    for (let i = 0; i < dia.refeicoes.length; i++) {
      const r = document.createElement("div");//Criando div para conter a refeição
      const refDoDia = dia.refeicoes[i];//Selecionando a refeição iterada

      //configurações da div da refeição
      r.className = "refeicao";
      r.innerHTML = `
      <p>${refDoDia.nome}</p>
      `;

      //Adicionando a refeição ao dia
      displayDia.appendChild(r);
    }
  }
}
