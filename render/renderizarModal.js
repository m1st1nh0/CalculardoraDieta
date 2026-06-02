export function renderizarModal(kanban) {

  //Adiciona os modais ao HTML do kanban
  kanban.innerHTML = `
        <div id="myModal1" class="modal">

          <div class="modal-content1">
          <span class="close" style="order: 2">&times;</span>

            <div id="criar-refeicao" style="order: 1">
              <input
                type="text"
                id="nomeRefeicao"
                placeholder="Digite o nome (Ex: Almoço)"
              />
              <button type="button" id="submitModel1">Criar refeicão</button>
            </div>
          </div>
        </div>
        <div id="myModal2" class="modal">
          <div class="modal-content2">
            <span class="close" style="order: 3">&times;</span>
            <div id="criar-itemRefeicao" style="order: 1">
              <input type="text" id="ingrediente" placeholder="Ingrediente" />
              <input
                type="number"
                id="quantidade"
                placeholder="Quantidade em g"
              />
              <button type="button" id="btnAdcItem">
                Adicionar ingrediente
              </button>
              <button type="button" id="finishbtn">Finalizar Edição</button>
            </div>
            <div id="itemRefeicao" style="order: 2"></div>
          </div>
        </div>
    `;
}
