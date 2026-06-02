import { abrirModal } from "../ui/modal.js";

export function renderizarBotao(dia) {
  const displayDia = document.getElementById(dia.id); //Selecionar a div do dia

  //Verifica se chegamos ao liimite de refeições, se não renderiza o botão de adicionar
  if (dia.refeicoes.length < 5) {
    const adcbtn = document.createElement("button"); //Criar elemento botão

    //Configurações do botão
    adcbtn.className = "adcbtn";
    adcbtn.textContent = `+`;

    //Adicionando gatilho para abrir o modal
    adcbtn.addEventListener("click", () => {
      abrirModal(dia);
    });
    //Adicionar o botão ao dia
    displayDia.appendChild(adcbtn);
  }
}
