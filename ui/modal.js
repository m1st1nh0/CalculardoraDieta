import { estado } from "../app/estados.js";
//Função para fechar os modais
export function fecharModais() {
  const modal1 = document.getElementById("myModal1"); //Selecionando Modal 1
  const modal2 = document.getElementById("myModal2"); //Selecionando Modal 2
  //Se o modal 1 existir, fechar
  if (modal1) {
    modal1.style.display = "none";
  }
  //Se o modal 2 existir, fechar
  if (modal2) {
    modal2.style.display = "none";
  }
  //limpa os estados globais relacionados à seleção de dia e refeição em andamento
  estado.diaSelecionado = null;
  estado.refeicaoEmAndamento = null;
}

//Função para abrir o modal de criação de refeição e iniciar o processo de criação de refeição para um dia específico
export function abrirModal(dia) {
  const modal1 = document.getElementById("myModal1"); //Selecionando Modal 1

  //Configura o estado global para o dia selecionado e exibe o modal
  estado.diaSelecionado = dia;
  modal1.style.display = "flex";
}

//Adicionar gatilho para fechar modal em class .close
document.addEventListener("click", (event) => {
  //EventListener recebe o evento de clique, e verifica se o alvo mais proximo ao clique é um elemento com a class .close, se for, chama a função fecharModais para fechar os modais abertos.
  if (event.target.closest(".close")) {
    fecharModais();
  }
});

//Adicionar gatilho para fechar modal ao registrar clique fora do modal
window.addEventListener("click", (event) => {
  const modal1 = document.getElementById("myModal1"); //Selecionando Modal 1
  const modal2 = document.getElementById("myModal2"); // Selecionando Modal 2
  //Verifica se o clique ocorreu fora dos modais, se sim, chama a função fecharModais para fechar os modais abertos.
  if (event.target === modal1 || event.target === modal2) {
    fecharModais();
  }
});

export function passarModal() {
  const modal1 = document.getElementById("myModal1"); //Selecionando Modal 1
  const modal2 = document.getElementById("myModal2"); // Selecionando Modal 2

  //Esconde o modal 1 e exibe o modal 2
  modal1.style.display = "none";
  modal2.style.display = "flex";
}
export function voltarModal() {
  const modal1 = document.getElementById("myModal1"); //Selecionando Modal 1
  const modal2 = document.getElementById("myModal2"); // Selecionando Modal 2

  //Esconde o modal 2 e exibe o modal 1
  modal2.style.display = "none";
  modal1.style.display = "flex";
}
