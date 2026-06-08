# 06 — Fluxo de Dados

> **Objetivo:** Analisar gerenciamento de estado, fluxo de atualização e comunicação entre módulos. Explicar State Management, Single Source of Truth, Flux Architecture e Event-Driven Architecture. Sugerir uma arquitetura simples para JavaScript Vanilla.

---

## 🧒 O que é Fluxo de Dados? (Explicação para criança)

Imagine que você está jogando um jogo onde controla um personagem. Você aperta uma tecla → o personagem anda. Como o jogo sabe que você apertou a tecla? Como ele decide que o personagem deve andar? Como ele desenha o personagem no novo lugar?

Isso é **fluxo de dados**: o caminho que a informação percorre desde que o usuário faz algo (clica, digita) até que a tela se atualiza.

Fluxo de dados bagunçado é como uma cozinha onde todo mundo grita "cadê a faca?" ao mesmo tempo. Fluxo de dados organizado é como uma linha de montagem: cada um faz sua parte na ordem certa.

---

## 🎓 Conceitos Fundamentais (Nível Universitário)

### State Management (Gerenciamento de Estado)

**Estado** é a soma de todos os dados que definem o sistema em um dado momento. No seu projeto, o estado inclui:
- Quais refeições existem
- Quais ingredientes estão em cada refeição
- Qual modal está aberto
- Qual dia está selecionado

Gerenciar estado é responder: **quem pode ler o estado? Quem pode modificar? Como a UI sabe que mudou?**

### Single Source of Truth (Fonte Única da Verdade)

> **Cada dado deve existir em apenas um lugar no sistema.**

Se o nome de uma refeição existe em dois lugares diferentes, um dia eles vão divergir (um muda, o outro não) e você não saberá qual é o correto.

```
❌ DUAS FONTES:
estado.refeicaoAtual.nome = "Café"
modal.titulo.textContent = "Café"  ← Duplicado!

✅ FONTE ÚNICA:
estado.refeicaoAtual.nome = "Café"  ← Aqui é a verdade
modal.render(estado.refeicaoAtual)  ← Lê da fonte
```

### Flux Architecture

Arquitetura Flux (criada pelo Facebook para o React) define um **fluxo unidirecional de dados**:

```
AÇÃO → DISPATCHER → STORE → VIEW
  ↑                           │
  └───────────────────────────┘
           (ação do usuário)
```

**Regra de ouro:** Os dados sempre se movem em uma direção. A view nunca modifica o estado diretamente — ela dispara uma ação.

### Event-Driven Architecture

Em vez de funções chamarem funções diretamente, os componentes se comunicam através de **eventos**. Um componente "publica" um evento, outros "assinam" e reagem.

```
Componente A: "Evento: refeição criada!" → EventBus
                                              ↓
Componente B (assinante): "Ouvi que criaram refeição, vou atualizar a lista"
Componente C (assinante): "Ouvi que criaram refeição, vou fechar o modal"
```

---

## 💼 Análise do Fluxo Atual no Projeto

### Diagrama do fluxo ATUAL:

```
USUÁRIO CLICA EM "+" (botão adicionar refeição)
         │
         ▼
main.js detecta click (event delegation)
         │
         ▼
ui/modal.js → abrirModal(dia) → estado.selecionarDia(dia)
                                  modal1.style.display = "flex"
         │
         ▼
USUÁRIO DIGITA NOME E CLICA "CRIAR"
         │
         ▼
main.js detecta click em "submitModel1"
         │
         ▼
ui/refeicaoForm.js → criarRefeicao()
  ├── Lê DOM (input.value)
  ├── new Refeicao(nome)
  ├── diaSelecionado.adicionarRefeicao(r)
  ├── estado.setRefeicaoEmAndamento(r)
  ├── renderizarItemRefeicao()  ← Chama render diretamente
  └── passarModal()             ← Chama modal diretamente
```

### Problemas identificados no fluxo atual:

1. 🔴 **Fluxo misturado** — `criarRefeicao()` faz tudo: lê DOM, cria modelo, atualiza estado, renderiza, navega modal
2. 🟡 **Código morto** — `StateManager.subscribe/notify` nunca é chamado (está preparado mas ninguém usa)
3. 🟡 **Side effects espalhados** — renderização é chamada manualmente em vários lugares em vez de ser automática
4. 🟡 **Sem reatividade** — quando o estado muda, nada notifica a UI automaticamente

---

## 🏗️ Arquitetura Proposta: Store Reativa Simples

### Componentes:

```
┌─────────────────────────────────────────────────────────┐
│                     State Store                          │
│  (Fonte Única da Verdade + subscribe/notify)            │
│                                                          │
│  state = {                                               │
│    planoSemanal: PlanoSemanal,                           │
│    diaSelecionado: Dia | null,                           │
│    refeicaoEmAndamento: Refeicao | null,                 │
│    ui: { modalAberto: string | null }                    │
│  }                                                       │
└────────────────────────────────┬────────────────────────┘
                                 │
                    subscribe() ─┤─ notify()
                                 │
         ┌───────────────────────┼───────────────────────┐
         ▼                       ▼                       ▼
┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐
│   Controllers   │   │      Views      │   │  Repositories   │
│                 │   │                 │   │                 │
│ • Disparam      │   │ • Assinam store │   │ • Salvam no     │
│   ações         │   │ • Renderizam    │   │   storage       │
│ • Chamam        │   │   quando        │   │ • Carregam do   │
│   modelos       │   │   notificadas   │   │   storage       │
└─────────────────┘   └─────────────────┘   └─────────────────┘
```

### Fluxo REFATORADO:

```
USUÁRIO CLICA "CRIAR REFEIÇÃO"
         │
         ▼
RefeicaoController.handleSubmit()
  ├── Lê nome do input
  ├── Cria Refeicao via modelo
  ├── Adiciona ao dia
  ├── Chama store.dispatch('REFICAO_CRIADA', { refeicao, dia })
         │
         ▼
State Store
  ├── Atualiza estado: { refeicaoEmAndamento: refeicao }
  ├── notify() → todos os assinantes são chamados
         │
         ├──────────────────┬──────────────────┐
         ▼                  ▼                  ▼
    RefeicaoView       ModalView          Repository
  (re-renderiza      (fecha modal 1,    (salva no
   lista de itens)    abre modal 2)     LocalStorage)
```

### Código da Store Reativa:

```javascript
// infrastructure/state/Store.js
export class Store {
  #state;
  #listeners = [];
  
  constructor(initialState) {
    this.#state = initialState;
  }
  
  get state() {
    // Retorna cópia profunda para evitar mutação externa
    return structuredClone(this.#state);
  }
  
  dispatch(action, payload) {
    // action: string identificando a ação
    // payload: dados da ação
    
    switch(action) {
      case 'SELECIONAR_DIA':
        this.#state.diaSelecionado = payload.dia;
        break;
        
      case 'CRIAR_REFICAO':
        this.#state.diaSelecionado.adicionarRefeicao(payload.refeicao);
        this.#state.refeicaoEmAndamento = payload.refeicao;
        break;
        
      case 'ADICIONAR_ITEM':
        this.#state.refeicaoEmAndamento.adicionarItem(
          payload.ingrediente, 
          payload.peso
        );
        break;
        
      case 'FECHAR_MODAL':
        this.#state.diaSelecionado = null;
        this.#state.refeicaoEmAndamento = null;
        break;
        
      default:
        console.warn(`Ação desconhecida: ${action}`);
    }
    
    this.#notify();
  }
  
  subscribe(listener) {
    this.#listeners.push(listener);
    return () => {
      // Retorna função para cancelar inscrição
      this.#listeners = this.#listeners.filter(l => l !== listener);
    };
  }
  
  #notify() {
    const state = this.state;
    this.#listeners.forEach(listener => listener(state));
  }
}
```

### Como as Views usam:

```javascript
// presentation/views/SemanaView.js
export class SemanaView {
  #store;
  #container;
  #unsubscribe;
  
  constructor(store, container) {
    this.#store = store;
    this.#container = container;
    
    // Assina mudanças no estado
    this.#unsubscribe = store.subscribe((state) => {
      this.#render(state.planoSemanal);
    });
  }
  
  #render(plano) {
    this.#container.innerHTML = '';
    plano.dias.forEach(dia => {
      const diaView = new DiaView(dia);
      this.#container.appendChild(diaView.render());
    });
  }
  
  destroy() {
    // Cancela inscrição quando a view for destruída
    this.#unsubscribe();
  }
}
```

### Como o Controller usa:

```javascript
// application/controllers/RefeicaoController.js
export class RefeicaoController {
  #store;
  
  constructor(store) {
    this.#store = store;
  }
  
  criarRefeicao(nome) {
    try {
      const refeicao = new Refeicao(nome);
      const dia = this.#store.state.diaSelecionado;
      
      this.#store.dispatch('CRIAR_REFICAO', {
        refeicao,
        dia
      });
    } catch (error) {
      // O store não lida com erros de validação
      // Isso fica no controller
      alert(error.message);
    }
  }
  
  adicionarItem(nomeIngrediente, quantidade) {
    try {
      const ingrediente = new Ingrediente(nomeIngrediente);
      this.#store.dispatch('ADICIONAR_ITEM', {
        ingrediente,
        peso: quantidade
      });
    } catch (error) {
      alert(error.message);
    }
  }
}
```

### Como o main.js fica:

```javascript
// main.js (refatorado)
import { Store } from './infrastructure/state/Store.js';
import { PlanoSemanalRepository } from './infrastructure/repositories/PlanoSemanalRepository.js';
import { SemanaView } from './presentation/views/SemanaView.js';
import { ModalView } from './presentation/views/ModalView.js';
import { RefeicaoController } from './application/controllers/RefeicaoController.js';

// 1. Inicializar dependências
const repositorio = new PlanoSemanalRepository(localStorage);
const planoSemanal = repositorio.carregar() || new PlanoSemanal();
const initialState = { planoSemanal, diaSelecionado: null, refeicaoEmAndamento: null };
const store = new Store(initialState);
const container = document.getElementById('kanban');

// 2. Criar views (se inscrevem na store automaticamente)
const semanaView = new SemanaView(store, container);
const modalView = new ModalView(store, container);

// 3. Criar controllers
const refeicaoController = new RefeicaoController(store);

// 4. Configurar event delegation
container.addEventListener('click', (event) => {
  const target = event.target;
  
  if (target.id === 'submitModel1') {
    const nome = document.getElementById('nomeRefeicao').value;
    refeicaoController.criarRefeicao(nome);
  }
  
  if (target.id === 'btnAdcItem') {
    const ingrediente = document.getElementById('ingrediente').value;
    const quantidade = document.getElementById('quantidade').value;
    refeicaoController.adicionarItem(ingrediente, quantidade);
  }
  
  if (target.id === 'finishbtn') {
    repositorio.salvar(store.state.planoSemanal);
    store.dispatch('FECHAR_MODAL');
  }
});

// 5. Renderizar estado inicial
store.dispatch('INIT'); // Dispara notify que faz a primeira renderização
```

---

## 📊 Comparação: Fluxo Atual vs Fluxo Proposto

| Aspecto | Atual | Proposto |
|---------|-------|----------|
| **Direção do fluxo** | Misto (várias direções) | Unidirecional |
| **Atualização da UI** | Manual (chamadas explícitas) | Automática (subscribe) |
| **Acoplamento** | Alto (funções chamam funções) | Baixo (eventos/assinaturas) |
| **Testabilidade** | Baixa (tudo acoplado ao DOM) | Alta (controllers sem DOM) |
| **Persistência** | Nenhuma | Automática no "finalizar" |
| **Código morto** | subscribe/notify sem uso | Subscribe usado ativamente |
| **Complexidade** | Baixa (mas frágil) | Média (mas robusta) |

---

## 🎯 Conclusão

### O que implementar agora:
1. **Store reativa** com `dispatch(action, payload)` e `subscribe(listener)`
2. **Ativar o subscribe/notify** que já existe em `StateManager` (ou substituir pela Store)
3. **Controllers** para cada caso de uso (criar refeição, adicionar item, etc.)
4. **Views que se inscrevem** na store e re-renderizam automaticamente

### O que sua implementação atual já tem de bom:
- `StateManager` já tem a estrutura de `subscribe/notify` — só não está sendo usado
- O estado já está centralizado em `estado` — meio caminho andado

### Regra de ouro do fluxo de dados:

```
NUNCA faça:
  funçãoA() modifica DOM + modifica modelo + chama funçãoB

SEMPRE faça:
  Controller.dispatch(AÇÃO) → Store atualiza → Views reagem
```

---

📖 **Referências:**
- Facebook. *Flux Architecture*. 2014. — [Documentação oficial do Flux](https://facebook.github.io/flux/)
- Martin, Robert C. *Clean Architecture*. 2017. Capítulo 23: Presenters and Views.
- Fowler, Martin. *Patterns of Enterprise Application Architecture*. 2003. Capítulo 14: Unit of Work, Identity Map.
- MDN: [EventTarget](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget) — Base para EventBus.
- MDN: [structuredClone](https://developer.mozilla.org/en-US/docs/Web/API/structuredClone) — Para cópias profundas.

Próximo: [07 — Renderização e DOM](07-renderizacao-dom.md)