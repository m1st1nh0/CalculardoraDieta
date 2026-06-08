//Definição de estados globais para o aplicativo, incluindo o dia selecionado, a refeição em andamento e o plano semanal.

export class StateManager {
  constructor() {
    this.state = {
      diaSelecionado: null,
      refeicaoEmAndamento: null,
      planoSemanal: null,
    };
    this.listeners = [];
  }
  getState() {
    return { ...this.state };
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.notify();
  }
  subscribe(callback) {
    this.listeners.push(callback);
  }
  notify() {
    this.listeners.forEach((callback) => callback(this.state));
  }
  selecionarDia(dia) {
    this.setState({ diaSelecionado: dia });
  }

  setRefeicaoEmAndamento(refeicao) {
    this.setState({ refeicaoEmAndamento: refeicao });
  }
}
export const estado = new StateManager();
