# 09 — Design Patterns

> **Objetivo:** Analisar 9 padrões de projeto (GoF e outros) que podem ser úteis no projeto. Cada padrão explicado do zero com analogia infantil, definição formal, exemplo genérico e exemplo aplicado à CalculadoraDieta.

---

## 🧒 O que são Design Patterns? (Explicação para criança)

Design Patterns são **receitas de bolo** para resolver problemas comuns de programação.

Imagine que você precisa fazer um bolo. Você pode inventar tudo do zero — e pode dar errado. Ou pode seguir uma receita que já foi testada por milhares de pessoas — e o bolo fica pronto, gostoso e sem surpresas.

Design Patterns são essas receitas. Programadores experientes perceberam que certos problemas aparecem sempre, e criaram soluções padronizadas. Você não precisa reinventar a roda — só precisa saber qual receita usar em cada situação.

---

## 🎓 Contexto Histórico (Nível Universitário)

O livro **"Design Patterns: Elements of Reusable Object-Oriented Software"** (1994), escrito pela Gang of Four (GoF) — Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides — catalogou 23 padrões de projeto.

Cada padrão documenta:
- **Nome** — vocabulário comum
- **Problema** — quando usar
- **Solução** — como implementar
- **Consequências** — trade-offs

**Não use padrões como "meta".** O objetivo não é "usar todos os padrões". O objetivo é reconhecer problemas e saber que já existe uma solução testada.

---

## 💼 9 Padrões Aplicados ao Projeto

---

## 1. 👁️ Observer (Observador)

### 🧒 Analogia infantil

Você tem uma campainha na porta. Quando alguém aperta, **todos** que estão em casa ouvem e reagem: o cachorro late, a mãe abre a porta, o bebê acorda. A campainha não precisa saber quem vai ouvir — ela só "notifica" que alguém chegou.

### 🎓 Definição formal

**Observer** define uma dependência um-para-muitos entre objetos: quando o objeto (sujeito) muda de estado, todos os seus dependentes (observadores) são notificados automaticamente.

### 💼 Exemplo genérico

```javascript
class Subject {
  #observers = [];
  
  subscribe(observer) {
    this.#observers.push(observer);
  }
  
  unsubscribe(observer) {
    this.#observers = this.#observers.filter(o => o !== observer);
  }
  
  notify(data) {
    this.#observers.forEach(o => o.update(data));
  }
}

class Observer {
  update(data) {
    console.log('Recebi:', data);
  }
}
```

### 💼 Exemplo aplicado ao projeto

**Você JÁ TEM isso em `app/estados.js` — mas está morto!**

```javascript
// app/estados.js — OBSERVER EXISTENTE (mas não usado)
export class StateManager {
  constructor() {
    this.listeners = []; // observers
  }
  
  subscribe(callback) {
    this.listeners.push(callback);
  }
  
  notify() {
    this.listeners.forEach(callback => callback(this.state));
  }
  
  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.notify(); // Notifica todos os observers
  }
}
```

**Problema:** `subscribe` nunca é chamado por ninguém.

✅ **Solução:** Ativar o Observer — views devem se inscrever na store:

```javascript
// presentation/views/SemanaView.js
export class SemanaView {
  constructor(store, container) {
    this.store = store;
    this.container = container;
    
    // Se inscreve para receber notificações
    this.store.subscribe((state) => {
      this.render(state.planoSemanal);
    });
  }
  
  render(plano) {
    this.container.innerHTML = '';
    // ... renderiza os dias
  }
}
```

### Quando usar:
- Múltiplos componentes precisam reagir a mudanças
- Ex: quando uma refeição é criada, o kanban E a lista de compras E o painel nutricional precisam se atualizar

### Quando não usar:
- Apenas um componente reage (use função direta)
- Notificações em cascata podem causar loop

---

## 2. 📢 Pub/Sub (Publisher-Subscriber)

### 🧒 Analogia infantil

Uma estação de rádio. O locutor (publisher) fala no microfone. Quem quiser ouvir (subscriber) sintoniza na frequência certa. O locutor não sabe quem está ouvindo. Os ouvintes não conhecem o locutor pessoalmente. Eles só se comunicam pelo **canal** (event bus).

### 🎓 Definição formal

**Pub/Sub** é uma evolução do Observer. A diferença: no Observer, o sujeito sabe sobre os observadores (tem uma lista). No Pub/Sub, publisher e subscriber **não se conhecem** — comunicam-se através de **eventos nomeados** em um barramento (Event Bus).

### 📊 Observer vs Pub/Sub

| Característica | Observer | Pub/Sub |
|---------------|----------|---------|
| Acoplamento | Sujeito conhece observers | Zero (só conhecem o bus) |
| Eventos | Único evento genérico | Múltiplos eventos nomeados |
| Complexidade | Menor | Maior |
| Ideal para | App pequeno, um tipo de mudança | App médio/grande, múltiplos eventos |

### 💼 Exemplo aplicado ao projeto

```javascript
// infrastructure/events/EventBus.js
export class EventBus {
  #listeners = new Map();
  
  on(evento, callback) {
    if (!this.#listeners.has(evento)) {
      this.#listeners.set(evento, []);
    }
    this.#listeners.get(evento).push(callback);
    
    // Retorna função para cancelar inscrição
    return () => {
      const cbs = this.#listeners.get(evento);
      this.#listeners.set(evento, cbs.filter(cb => cb !== callback));
    };
  }
  
  emit(evento, payload) {
    const cbs = this.#listeners.get(evento);
    if (cbs) {
      cbs.forEach(cb => cb(payload));
    }
  }
}

// Uso:
const bus = new EventBus();

// Controller publica evento
class RefeicaoController {
  criarRefeicao(nome) {
    const refeicao = new Refeicao(nome);
    bus.emit('refeicao:criada', { refeicao });
  }
}

// Views se inscrevem independentemente
const unsub1 = bus.on('refeicao:criada', (data) => {
  console.log('Kanban: atualizar visualização');
});

const unsub2 = bus.on('refeicao:criada', (data) => {
  console.log('Lista de compras: recalcular');
});
```

---

## 3. 🏭 Factory (Fábrica)

### 🧒 Analogia infantil

Você quer um brinquedo, mas não sabe como ele é montado por dentro. Você só pede na "fábrica de brinquedos" e ela te entrega o brinquedo pronto. A fábrica decide qual brinquedo criar baseado no que você pediu.

### 🎓 Definição formal

**Factory Method** define uma interface para criar objetos, mas permite que subclasses decidam qual classe instanciar.

### Quando usar:
- Criação de objetos é complexa
- Você quer centralizar a lógica de criação
- Precisa decidir em tempo de execução qual classe criar

### 💼 Exemplo aplicado ao projeto

```javascript
// application/factories/RefeicaoFactory.js
export class RefeicaoFactory {
  static criar(tipo, personalizacoes = {}) {
    switch(tipo) {
      case 'cafe-manha':
        return this.#cafeManha(personalizacoes);
      case 'almoco':
        return this.#almoco(personalizacoes);
      case 'jantar':
        return this.#jantar(personalizacoes);
      case 'lanche':
        return this.#lanche(personalizacoes);
      case 'personalizado':
        return new Refeicao(personalizacoes.nome);
      default:
        throw new Error(`Tipo de refeição desconhecido: ${tipo}`);
    }
  }
  
  static #cafeManha(opcoes) {
    const r = new Refeicao('Café da manhã');
    r.adicionarItem(new Ingrediente(opcoes.pao || 'Pão integral'), opcoes.gramasPao || 50);
    r.adicionarItem(new Ingrediente('Café'), 200);
    return r;
  }
  
  static #almoco(opcoes) {
    const r = new Refeicao('Almoço');
    r.adicionarItem(new Ingrediente('Arroz'), 150);
    r.adicionarItem(new Ingrediente(opcoes.proteina || 'Frango'), 200);
    return r;
  }
  
  static clonar(refeicao) {
    const clone = new Refeicao(refeicao.nome + ' (cópia)');
    refeicao.itens.forEach(item => {
      clone.adicionarItem(item.ingrediente, item.peso);
    });
    return clone;
  }
}

// Uso:
const cafe = RefeicaoFactory.criar('cafe-manha', { pao: 'Pão de forma' });
const almocoPadrao = RefeicaoFactory.criar('almoco');
const copia = RefeicaoFactory.clonar(cafe);
```

---

## 4. 🔨 Builder (Construtor)

### 🧒 Analogia infantil

Montar um sanduíche: você escolhe o pão, o recheio, os vegetais, os molhos. Cada escolha é opcional. No final, você recebe o sanduíche montado. Você não precisou saber COMO os ingredientes são combinados — só foi adicionando passo a passo.

### 🎓 Definição formal

**Builder** separa a construção de um objeto complexo de sua representação, permitindo que o mesmo processo de construção crie diferentes representações.

### 💼 Exemplo aplicado ao projeto

```javascript
// application/builders/RefeicaoBuilder.js
export class RefeicaoBuilder {
  constructor() {
    this.#reset();
  }
  
  #reset() {
    this.#nome = '';
    this.#itens = [];
  }
  
  comNome(nome) {
    this.#nome = nome;
    return this; // Retorna `this` para chaining
  }
  
  adicionarIngrediente(nome, peso) {
    this.#itens.push({ nome, peso });
    return this;
  }
  
  construir() {
    const refeicao = new Refeicao(this.#nome);
    this.#itens.forEach(item => {
      refeicao.adicionarItem(new Ingrediente(item.nome), item.peso);
    });
    this.#reset();
    return refeicao;
  }
}

// Uso com chaining:
const almoco = new RefeicaoBuilder()
  .comNome('Almoço especial')
  .adicionarIngrediente('Arroz', 150)
  .adicionarIngrediente('Frango', 200)
  .adicionarIngrediente('Brócolis', 100)
  .construir();
```

---

## 5. 📦 Repository (Repositório)

### 🧒 Analogia infantil

Você tem uma caixa de brinquedos. Quando quer brincar com um carrinho, você abre a caixa e pega. Quando termina, guarda de volta. Você não precisa saber se a caixa é de papelão, plástico ou madeira. Só precisa que ela guarde e entregue seus brinquedos.

### 🎓 Definição formal

**Repository** medeia entre o domínio e as camadas de mapeamento de dados, agindo como uma coleção de objetos do domínio em memória.

### 💼 Exemplo aplicado ao projeto

```javascript
// infrastructure/repositories/PlanoSemanalRepository.js
export class PlanoSemanalRepository {
  #storage;
  #chave = 'planoSemanal';
  
  constructor(storage = localStorage) {
    this.#storage = storage;
  }
  
  salvar(plano) {
    const dados = this.#serializar(plano);
    this.#storage.setItem(this.#chave, JSON.stringify(dados));
  }
  
  carregar() {
    const raw = this.#storage.getItem(this.#chave);
    return raw ? this.#hidratar(JSON.parse(raw)) : null;
  }
  
  #serializar(plano) {
    return {
      dataInicio: plano.dataInicio.toISOString(),
      dias: plano.dias.map(dia => ({
        id: dia.id,
        nome: dia.nome,
        refeicoes: dia.refeicoes.map(ref => ({
          id: ref.id,
          nome: ref.nome,
          itens: ref.itens.map(item => ({
            ingrediente: item.ingrediente.nome,
            peso: item.peso.valor
          }))
        }))
      }))
    };
  }
  
  #hidratar(dados) {
    const plano = new PlanoSemanal(new Date(dados.dataInicio));
    dados.dias.forEach(diaDTO => {
      const dia = plano.obterDia(diaDTO.id);
      diaDTO.refeicoes.forEach(refDTO => {
        const ref = new Refeicao(refDTO.nome);
        refDTO.itens.forEach(itemDTO => {
          ref.adicionarItem(new Ingrediente(itemDTO.ingrediente), itemDTO.peso);
        });
        dia.adicionarRefeicao(ref);
      });
    });
    return plano;
  }
}
```

---

## 6. 🧠 Strategy (Estratégia)

### 🧒 Analogia infantil

Você precisa ir para a escola. Pode ir de carro, de ônibus, de bicicleta ou a pé. A forma de ir (a "estratégia") pode mudar, mas o objetivo é o mesmo: chegar na escola. Você escolhe a estratégia que faz mais sentido hoje.

### 🎓 Definição formal

**Strategy** define uma família de algoritmos intercambiáveis. O algoritmo pode variar independentemente dos clientes que o usam.

### 💼 Exemplo aplicado ao projeto

```javascript
// domain/services/CalculoCaloricoStrategy.js
// Diferentes estratégias para calcular calorias

class EstrategiaCalculoCalorico {
  calcular(ingrediente, pesoGramas) {
    throw new Error('Implementar');
  }
}

class CalculoPorTabelaBR extends EstrategiaCalculoCalorico {
  calcular(ingrediente, pesoGramas) {
    // Tabela Brasileira de Composição de Alimentos
    const tabela = {
      'arroz': 130,   // kcal por 100g
      'frango': 165,
      'batata': 77,
      'brócolis': 34,
    };
    const kcalPor100g = tabela[ingrediente.nome.toLowerCase()] || 0;
    return (kcalPor100g * pesoGramas) / 100;
  }
}

class CalculoPorPropriedades extends EstrategiaCalculoCalorico {
  calcular(ingrediente, pesoGramas) {
    // Usa as propriedades do próprio ingrediente
    const kcalPor100g = ingrediente.calorias || 0;
    return (kcalPor100g * pesoGramas) / 100;
  }
}

// Contexto que usa a estratégia
class CalculadoraNutricional {
  #estrategia;
  
  constructor(estrategia) {
    this.#estrategia = estrategia;
  }
  
  mudarEstrategia(estrategia) {
    this.#estrategia = estrategia;
  }
  
  calcularRefeicao(refeicao) {
    return refeicao.itens.reduce((total, item) => {
      return total + this.#estrategia.calcular(item.ingrediente, item.peso.valor);
    }, 0);
  }
}

// Uso:
const calc = new CalculadoraNutricional(new CalculoPorTabelaBR());
console.log(calc.calcularRefeicao(almoco)); // Usa tabela BR

calc.mudarEstrategia(new CalculoPorPropriedades());
console.log(calc.calcularRefeicao(almoco)); // Usa propriedades do objeto
```

---

## 7. 🔌 Adapter (Adaptador)

### 🧒 Analogia infantil

Você tem um carregador de iPhone (Lightning) e quer carregar em uma tomada de dois pinos. Você usa um adaptador que "traduz" o pino redondo para encaixar na tomada.

### 🎓 Definição formal

**Adapter** permite que classes com interfaces incompatíveis trabalhem juntas. Ele "traduz" uma interface para outra.

### 💼 Exemplo aplicado ao projeto

```javascript
// Interface que o sistema espera
class Armazenamento {
  salvar(chave, dados) { throw new Error('Implementar'); }
  carregar(chave) { throw new Error('Implementar'); }
  remover(chave) { throw new Error('Implementar'); }
}

// Adapter para LocalStorage
class LocalStorageAdapter extends Armazenamento {
  salvar(chave, dados) {
    localStorage.setItem(chave, JSON.stringify(dados));
  }
  carregar(chave) {
    return JSON.parse(localStorage.getItem(chave));
  }
  remover(chave) {
    localStorage.removeItem(chave);
  }
}

// Adapter futura para IndexedDB (assíncrono)
class IndexedDBAdapter extends Armazenamento {
  async salvar(chave, dados) {
    const db = await this.#abrirDB();
    const tx = db.transaction('dados', 'readwrite');
    tx.objectStore('dados').put(dados, chave);
  }
  async carregar(chave) {
    const db = await this.#abrirDB();
    // ...
  }
  async remover(chave) {
    const db = await this.#abrirDB();
    // ...
  }
}

// Uso: o repositório não precisa saber qual storage está usando
class PlanoSemanalRepository {
  constructor(armazenamento) {
    this.armazenamento = armazenamento; // Pode ser LocalStorageAdapter ou IndexedDBAdapter
  }
  
  salvar(plano) {
    this.armazenamento.salvar('planoSemanal', this.#serializar(plano));
  }
}
```

---

## 8. 🏛️ Facade (Fachada)

### 🧒 Analogia infantil

Você vai a um restaurante. Você só conversa com o garçom (fachada). Não precisa saber como funciona a cozinha, a despensa, o caixa, a louça. O garçom simplifica tudo.

### 🎓 Definição formal

**Facade** fornece uma interface simplificada para um subsistema complexo. Esconde a complexidade e expõe apenas o essencial.

### 💼 Exemplo aplicado ao projeto

```javascript
// ❌ SEM FACADE — quem usa precisa conhecer todo o sistema
function inicializarApp() {
  const storageAdapter = new LocalStorageAdapter();
  const repositorio = new PlanoSemanalRepository(storageAdapter);
  const planoSemanal = repositorio.carregar() || new PlanoSemanal();
  const store = new Store({ planoSemanal });
  const controller = new RefeicaoController(store);
  const semanaView = new SemanaView(store, document.getElementById('kanban'));
  const modalView = new ModalView(store, document.body);
  // ... muito código!
}

// ✅ COM FACADE — uma única interface
export class AppFacade {
  #store;
  #repositorio;
  #views;
  
  constructor() {
    // Inicializa todo o subsistema internamente
    this.#repositorio = new PlanoSemanalRepository(new LocalStorageAdapter());
    const planoSemanal = this.#repositorio.carregar() || new PlanoSemanal();
    this.#store = new Store({ planoSemanal });
    
    // Inicializa views
    const kanban = document.getElementById('kanban');
    this.#views = [
      new SemanaView(this.#store, kanban),
      new ModalView(this.#store, document.body),
    ];
    
    // Configura eventos
    this.#configurarEventos();
  }
  
  #configurarEventos() {
    document.addEventListener('click', (event) => {
      if (event.target.id === 'finishbtn') {
        this.#repositorio.salvar(this.#store.state.planoSemanal);
        this.#store.dispatch('FECHAR_MODAL');
      }
    });
  }
  
  iniciar() {
    this.#store.dispatch('INIT');
  }
}

// Uso — UMA LINHA:
const app = new AppFacade();
app.iniciar();
```

---

## 9. 📋 Command (Comando)

### 🧒 Analogia infantil

Um controle remoto. Cada botão (comando) sabe executar uma ação. Você aperta "volume+" e a TV aumenta. O controle não precisa saber COMO a TV faz isso — só dispara o comando.

### 🎓 Definição formal

**Command** transforma uma solicitação em um objeto independente que contém toda a informação sobre a solicitação. Permite parametrizar, enfileirar e desfazer operações.

### 💼 Exemplo aplicado ao projeto

```javascript
// domain/commands/Command.js
export class Command {
  executar() { throw new Error('Implementar'); }
  desfazer() { throw new Error('Implementar'); }
}

// commands/adicionarRefeicaoCommand.js
export class AdicionarRefeicaoCommand extends Command {
  constructor(dia, refeicao) {
    super();
    this.dia = dia;
    this.refeicao = refeicao;
  }
  
  executar() {
    this.dia.adicionarRefeicao(this.refeicao);
  }
  
  desfazer() {
    this.dia.excluirRefeicao(this.refeicao.id);
  }
}

// commands/excluirItemCommand.js
export class ExcluirItemCommand extends Command {
  constructor(refeicao, itemId) {
    super();
    this.refeicao = refeicao;
    this.itemId = itemId;
    this.itemRemovido = null; // Para desfazer
  }
  
  executar() {
    this.itemRemovido = this.refeicao.itens.find(item => item.id === this.itemId);
    this.refeicao.excluirItem(this.itemId);
  }
  
  desfazer() {
    if (this.itemRemovido) {
      this.refeicao.adicionarItem(
        this.itemRemovido.ingrediente,
        this.itemRemovido.peso
      );
    }
  }
}

// Histórico para UNDO/REDO
export class CommandHistory {
  #historico = [];
  #indice = -1;
  
  executar(command) {
    command.executar();
    this.#historico = this.#historico.slice(0, this.#indice + 1);
    this.#historico.push(command);
    this.#indice++;
  }
  
  desfazer() {
    if (this.#indice >= 0) {
      this.#historico[this.#indice].desfazer();
      this.#indice--;
    }
  }
  
  refazer() {
    if (this.#indice < this.#historico.length - 1) {
      this.#indice++;
      this.#historico[this.#indice].executar();
    }
  }
}

// Uso:
const history = new CommandHistory();

// Usuário adiciona refeição
history.executar(new AdicionarRefeicaoCommand(dia, refeicao));
history.executar(new ExcluirItemCommand(refeicao, 5));

// Ctrl+Z
history.desfazer(); // Volta o item excluído
history.desfazer(); // Remove a refeição adicionada

// Ctrl+Y
history.refazer(); // Re-adiciona
```

---

## 📊 Tabela Comparativa: Padrões no Projeto

| Padrão | Já existe? | Implementado corretamente? | Prioridade |
|--------|-----------|---------------------------|------------|
| **Observer** | ✅ `estados.js` | 🔴 Subscribe/notify morto | 🔴 Reativar agora |
| **Pub/Sub** | ❌ | — | 🟡 V2 |
| **Factory** | ❌ | — | 🟡 V2 |
| **Builder** | ❌ | — | 🟢 V3 (se UI complexificar) |
| **Repository** | ❌ | — | 🔴 Criar agora (persistência) |
| **Strategy** | ❌ | — | 🟡 V3 (cálculos nutricionais) |
| **Adapter** | ❌ | — | 🟢 V3 (múltiplos storages) |
| **Facade** | ❌ | — | 🟡 V2 (simplificar main.js) |
| **Command** | ❌ | — | 🟢 V4 (undo/redo avançado) |

---

## 🎯 Conclusão

### Padrões para implementar AGORA:
1. ✅ **Observer** — reativar subscribe/notify em `estados.js`
2. ✅ **Repository** — criar `PlanoSemanalRepository` para persistência

### Padrões para V2:
3. ✅ **Pub/Sub** — EventBus para comunicação entre módulos
4. ✅ **Factory** — `RefeicaoFactory` para refeições pré-definidas
5. ✅ **Facade** — `AppFacade` para simplificar inicialização

### Padrões para V3+:
6. ✅ **Strategy** — cálculos nutricionais intercambiáveis
7. ✅ **Adapter** — suporte a diferentes storages
8. ✅ **Builder** — construção de refeições complexas
9. ✅ **Command** — undo/redo

---

📖 **Referências:**
- Gamma, Erich et al. *Design Patterns: Elements of Reusable Object-Oriented Software*. 1994. (GoF) — **O livro original.**
- Freeman, Eric. *Head First Design Patterns*. 2ª ed. — **Mais didático que GoF.**
- Martin, Robert C. *Clean Architecture*. 2017. — Patterns no contexto de arquitetura.
- MDN: [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) — Útil para implementar Observer reativo.

Próximo: [10 — Roadmap Arquitetural](10-roadmap.md)