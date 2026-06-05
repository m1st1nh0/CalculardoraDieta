export function renderizarModal(kanban) {
  // Adiciona os modais ao HTML do kanban
  kanban.innerHTML = `
    <div id="myModal1" class="modal">
      <div class="modal-content1">
        <div id="criar-refeicao" style="order: 1">
          <div class="titulo-criar-refeicao">
            <h2>Qual refeição você quer planejar?</h2>
          </div>

          <div class="input-botao-criar-refeicao">
            <input
              type="text"
              id="nomeRefeicao"
              placeholder="Digite o nome (Ex: Almoço)"
            />
            <button
              type="button"
              id="submitModel1"
            >
              Criar
            </button>
          </div>
        </div>
      </div>
    </div>

    <div id="myModal2" class="modal">
      <div class="modal-content2">

        <div
          id="criar-itemRefeicao"
          style="order: 1"
        >
          <div class="titulo-criar-itemRefeicao">
            <h4>Adicione os Ingredientes da refeição</h4>
          </div>

          <div class="input-criar-itemRefeicao">
            <input
              type="text"
              id="ingrediente"
              placeholder="Ingrediente"
              class = "campo"
            />

            <input
              type="number"
              id="quantidade"
              placeholder="Quantidade em g"
              class = "campo"
            />
            <div class="botao-itemRefeicao">
            <button
              type="button"
              id="btnAdcItem"
            >
              +
            </button>
          </div>
          </div>

          
        </div>

        <div
          id="itemRefeicao"
          style="order: 2"
        ></div>

        <div
          id="botoes-controle-itemRefeicao"
          style="order: 2"
        >
          <button
            type="button"
            id="finishbtn"
            style="order: 3"
          >
            FINALIZAR
          </button>

          <button
            type="button"
            id="btnVoltar"
            style="order: 3"
          >
            VOLTAR
          </button>
        </div>
      </div>
    </div>
  `;
}
