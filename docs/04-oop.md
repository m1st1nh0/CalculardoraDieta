# 04 — Programação Orientada a Objetos

> **Objetivo:** Analisar o uso de OOP no projeto — encapsulamento, abstração, herança, polimorfismo, composição — explicando cada conceito, quando usar, quando evitar, erros comuns de iniciantes, e comparando abordagem procedural vs OO.

---

## 🧒 O que é Programação Orientada a Objetos? (Explicação para criança)

Imagine que você tem uma caixa de brinquedos. Cada brinquedo tem:
- **Características** (cor, tamanho, material) → **atributos**
- **Coisas que faz** (andar, falar, piscar) → **métodos**

Na programação orientada a objetos (OOP), a gente cria "brinquedos" chamados **objetos**. Cada objeto guarda suas características e sabe fazer suas ações. Se você quer um novo brinquedo, você usa um "molde" chamado **classe**.

**Abordagem procedural (sem OOP):**
```javascript
// Tudo solto, dados e funções separados
const nomeIngrediente = "Arroz";
const pesoIngrediente = 200;

function validarIngrediente(nome) { ... }
function exibirIngrediente(nome, peso) { ... }
```

**Abordagem orientada a objetos:**
```javascript
// Dados e comportamentos juntos
class Ingrediente {
  constructor(nome) { this.nome = nome; }
  validar() { ... }
  exibir() { ... }
}
```

---

## 🎓 Os 4 Pilares da OOP (Nível Universitário)

### 1. Encapsulamento

**O que é:** Esconder os detalhes internos de um objeto e expor apenas uma interface controlada.

**Por que existe:** Para proteger a integridade dos dados e reduzir o acoplamento entre componentes.

**Exemplo:**

```javascript
// ❌ SEM ENCAPSULAMENTO
class ContaBancaria {
  constructor() {
    this.saldo = 0; // Qualquer um pode modificar
  }
}

const conta = new ContaBancaria();
conta.saldo = -1000; // Nada impede saldo negativo!

// ✅ COM ENCAPSULAMENTO
class ContaBancaria {
  #saldo = 0; // Privado
  
  depositar(valor) {
    if (valor <= 0) throw new Error("Valor inválido");
    this.#saldo += valor;
  }
  
  sacar(valor) {
    if (valor > this.#saldo) throw new Error("Saldo insuficiente");
    this.#saldo -= valor;
  }
  
  get saldo() { return this.#saldo; }
}

const conta = new ContaBancaria();
conta.saldo = -1000; // ❌ Erro! Não pode acessar diretamente
conta.depositar(500); // ✅ Só pode através dos métodos
```

### 🔴 No seu projeto:

**Nenhuma classe usa campos privados.** Todos os atributos são públicos:

```javascript
// ❌ SEM ENCAPSULAMENTO
class Dia {
  constructor(nome, id) {
    this.refeicoes = []; // Público! Qualquer um pode modificar
    this.proxId = 1;
  }
}

// Qualquer código pode fazer:
const segunda = new Dia("Segunda", "segunda");
segunda.refeicoes.push({}); // Adiciona lixo sem validação
segunda.refeicoes = []; // Apaga tudo sem controle
```

```javascript
// ✅ COM ENCAPSULAMENTO (uso de # para campos privados)
class Dia {
  #refeicoes;
  #proximoId = 1;
  
  constructor(nome, id) {
    this.#refeicoes = [];
    this.nome = nome;
    this.id = id;
  }
  
  adicionarRefeicao(refeicao) {
    if (!(refeicao instanceof Refeicao)) {
      throw new Error("Deve ser uma refeição válida");
    }
    if (this.#refeicoes.length >= 5) {
      throw new Error("Limite de 5 refeições por dia");
    }
    refeicao.atribuirId(this.#proximoId++);
    this.#refeicoes.push(refeicao);
  }
  
  excluirRefeicao(id) {
    this.#refeicoes = this.#refeicoes.filter(r => r.id !== id);
  }
  
  get refeicoes() {
    return [...this.#refeicoes]; // Cópia defensiva
  }
  
  get quantidadeRefeicoes() {
    return this.#refeicoes.length;
  }
}
```

**Benefícios do encapsulamento:**
- 🟢 Controle sobre como os dados são modificados
- 🟢 Validações garantidas
- 🟢 Liberdade para mudar implementação interna sem quebrar quem usa
- 🟢 Debug mais fácil (sabe exatamente por onde os dados passam)

---

### 2. Abstração

**O que é:** Mostrar apenas o essencial, esconder a complexidade.

**Por que existe:** Para simplificar o uso de componentes complexos.

**Exemplo do mundo real:** Um controle remoto. Você aperta "ligar" e a TV liga. Você não precisa saber como os circuitos funcionam.

```javascript
// ❌ SEM ABSTRAÇÃO (vazamento de complexidade)
function renderizarKanban(plano) {
  // Quem chama essa função precisa saber:
  // 1. Que existe um kanban
  // 2. Que kanban é um elemento DOM
  // 3. Que precisa limpar a tela primeiro
  // 4. Que precisa renderizar modal e semana
  limparTela(kanban);
  renderizarModal(kanban);
  renderizarSemana(plano, kanban);
}

// ✅ COM ABSTRAÇÃO
class App {
  #kanban;
  
  constructor(seletor) {
    this.#kanban = document.getElementById(seletor);
  }
  
  renderizar(plano) {
    this.#limpar();
    this.#renderizarModal();
    this.#renderizarSemana(plano);
  }
  
  // Métodos privados — ninguém precisa saber que existem
  #limpar() { this.#kanban.innerHTML = ""; }
  #renderizarModal() { /* ... */ }
  #renderizarSemana(plano) { /* ... */ }
}

// Quem usa:
const app = new App("kanban");
app.renderizar(plano); // Simples!
```

---

### 3. Herança

**O que é:** Uma classe "filha" herda características e comportamentos de uma classe "pai".

**Por que existe:** Reutilização de código e modelagem de hierarquias.

**Quando usar:**
- Relação "É UM" verdadeira e estável
- Comportamento compartilhado faz sentido ser herdado

**Quando evitar (quase sempre):**
- Prefira **composição** (use subagentes para buscar referências)
- Herança profunda (> 2 níveis) é perigosa
- Herança para reutilizar código é quase sempre errada

**Exemplo bom vs ruim:**

```javascript
// ❌ HERANÇA RUIM (por reutilização)
class Database {
  salvar(dados) { /* ... */ }
  carregar(id) { /* ... */ }
}

class Usuario extends Database { // Usuário NÃO é um banco de dados!
  // Herdou salvar() e carregar() — mas não faz sentido
}

// ✅ COMPOSIÇÃO (melhor)
class Usuario {
  #repositorio;
  
  constructor(repositorio) {
    this.#repositorio = repositorio; // TEM um repositório
  }
  
  salvar() {
    this.#repositorio.salvar(this);
  }
}

// ✅ HERANÇA BOA (relação IS-A verdadeira)
class Refeicao {
  constructor(nome) { this.nome = nome; }
  adicionarItem(ingrediente, peso) { /* ... */ }
}

class RefeicaoFixa extends Refeicao {
  constructor(nome, itensPadrao) {
    super(nome);
    itensPadrao.forEach(item => this.adicionarItem(item.ingrediente, item.peso));
  }
}
// RefeicaoFixa É UMA Refeicao ✅
```

**No seu projeto atualmente:** Não há herança, o que é correto para o estágio atual.

---

### 4. Polimorfismo

**O que é:** A capacidade de um objeto se comportar de diferentes formas dependendo do contexto. "Muitas formas".

**Por que existe:** Permite escrever código genérico que funciona com diferentes tipos.

```javascript
// Exemplo: diferentes estratégias de cálculo nutricional
class CalculadoraCalorica {
  calcular(ingrediente) {
    // Comportamento padrão
    return ingrediente.calorias * ingrediente.quantidade / 100;
  }
}

class CalculadoraCaloricaLowCarb extends CalculadoraCalorica {
  calcular(ingrediente) {
    // Comportamento diferente para low carb
    if (ingrediente.carboidratos > 10) return 0;
    return super.calcular(ingrediente);
  }
}

// Uso polimórfico:
function calcularTotalRefeicao(refeicao, calculadora) {
  return refeicao.itens.reduce((total, item) => {
    return total + calculadora.calcular(item.ingrediente);
  }, 0);
}

// Pode usar qualquer calculadora:
const normal = new CalculadoraCalorica();
const lowCarb = new CalculadoraCaloricaLowCarb();
console.log(calcularTotalRefeicao(refeicao, normal));
console.log(calcularTotalRefeicao(refeicao, lowCarb));
```

---

### 5. Composição

**O que é:** Construir objetos complexos combinando objetos mais simples.

**Por que existe:** É mais flexível que herança. Permite "montar" comportamentos.

```
// Herança: Carro É UM Veiculo
// Composição: Carro TEM Motor, TEM Rodas, TEM Banco
```

```javascript
// Composição no seu projeto:
class PlanoSemanal {
  constructor() {
    this.dias = []; // PlanoSemanal TEM Dias
  }
}

class Dia {
  constructor() {
    this.refeicoes = []; // Dia TEM Refeicoes
  }
}

class Refeicao {
  constructor() {
    this.itens = []; // Refeicao TEM Itens
  }
}
```

Sua modelagem atual usa composição corretamente! A hierarquia `PlanoSemanal → Dia → Refeicao → ItemRefeicao → Ingrediente` é uma **composição** bem estruturada.

---

## 📊 Comparação: Procedural vs Orientação a Objetos

| Aspecto | Abordagem Procedural | Abordagem OO |
|---------|---------------------|--------------|
| **Dados** | Separados das funções | Dentro dos objetos (encapsulados) |
| **Estado** | Variáveis globais | Estado distribuído em objetos |
| **Reuso** | Funções reutilizáveis | Classes + herança + composição |
| **Mudança** | Condicionais (if/else) | Polimorfismo |
| **Organização** | Arquivos de funções | Arquivos de classes |
| **Teste** | Testar funções isoladas | Testar objetos com estado |
| **Exemplo** | `calcularTotal(refeicoes)` | `refeicao.calcularTotal()` |

### Exemplo no seu projeto:

```javascript
// ❌ ABORDAGEM MISTA (parte procedural, parte OO)
// ui/refeicaoForm.js — função solta que manipula modelo
export function criarRefeicao() {
  const r = new Refeicao(nomeRefeicao);     // OO
  diaSelecionado.adicionarRefeicao(r);      // OO
  estado.setRefeicaoEmAndamento(r);          // Procedural
  renderizarItemRefeicao();                  // Procedural
  passarModal();                             // Procedural
}

// ✅ ABORDAGEM OO PURA
class RefeicaoController {
  criar(nome) {
    const refeicao = new Refeicao(nome);
    this.diaSelecionado.adicionarRefeicao(refeicao);
    this.estado.setRefeicaoEmAndamento(refeicao);
    this.view.renderizarItens(refeicao.itens);
    this.view.navegarParaProximoPasso();
    return refeicao;
  }
}
```

---

## 🔴 Erros Comuns de Iniciantes em OOP

### Erro 1: Getter que retorna referência mutável

```javascript
// ❌ ERRO: getter retorna array original
class Refeicao {
  constructor() {
    this.itens = [];
  }
  get itens() { return this.itens; }
}

const ref = new Refeicao("Café");
ref.itens.push({ invalido: true }); // ❌ Modificou diretamente!

// ✅ CORRETO: cópia defensiva
class Refeicao {
  #itens;
  constructor() {
    this.#itens = [];
  }
  get itens() { return [...this.#itens]; }
}
```

### Erro 2: Misturar lógica de negócio com renderização

```javascript
// ❌ ERRO: modelo sabe como é exibido
class Refeicao {
  exibir() { // Modelo não deveria saber de HTML
    return `<div>${this.nome}</div>`;
  }
}

// ✅ CORRETO: separação de responsabilidades
class RefeicaoView {
  exibir(refeicao) {
    return `<div>${refeicao.nome}</div>`;
  }
}
```

### Erro 3: Efeitos colaterais em setters

```javascript
// ❌ ERRO: método modifica objeto recebido
class Dia {
  adicionarRefeicao(refeicao) {
    refeicao.id = this.proxId++; // Modifica o objeto externo!
    this.refeicoes.push(refeicao);
  }
}

// ✅ CORRETO: sem efeitos colaterais
class Dia {
  adicionarRefeicao(refeicao) {
    const novaRefeicao = refeicao.comId(this.#proximoId++);
    this.#refeicoes.push(novaRefeicao);
  }
}
```

### Erro 4: Array público

```javascript
// ❌ ERRO
class PlanoSemanal {
  constructor() {
    this.dias = [];
  }
}

// ✅ CORRETO
class PlanoSemanal {
  #dias;
  constructor() {
    this.#dias = [];
  }
  get dias() { return [...this.#dias]; }
  adicionarDia(dia) { this.#dias.push(dia); }
  obterDia(id) { return this.#dias.find(d => d.id === id); }
}
```

---

## 🎯 Conclusão

### O que seu projeto faz bem em OOP:
1. ✅ Usa classes com construtores
2. ✅ Usa composição (hierarquia correta)
3. ✅ Métodos nas classes (adicionarItem, excluirItem)
4. ✅ Validação nos construtores

### O que precisa melhorar:
1. 🔴 **Campos privados** — usar `#` em todos os atributos
2. 🔴 **Getters com cópia defensiva** — arrays não podem ser expostos diretamente
3. 🟡 **Separar lógica de negócio da view** — modelos não devem saber de DOM
4. 🟡 **Evitar efeitos colaterais** — métodos não devem modificar objetos recebidos
5. 🟢 **Repensar herança** — quando/quando usar no futuro

### Regra prática para OOP:

```
Pergunte-se: "Este método pertence a esta classe?"
- Se pertence ao DOM → está na classe errada
- Se pertence ao banco → está na classe errada
- Se pertence à lógica de negócio → pode estar na classe certa
- Se acessa dados privados de outra classe → está na classe errada
```

---

📖 **Referências:**
- Martin, Robert C. *Clean Code*. 2008. Capítulo 6: Objects and Data Structures, Capítulo 10: Classes.
- Gamma, Erich et al. *Design Patterns: Elements of Reusable Object-Oriented Software*. 1994. (GoF) — **O livro que definiu os padrões OO.**
- Freeman, Eric. *Head First Design Patterns*. 2ª ed. — Mais acessível que GoF.
- MDN: [Private class fields](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_class_fields)
- MDN: [Getters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get)
- ECMAScript: [Class Fields Proposal](https://github.com/tc39/proposal-class-fields)

Próximo: [05 — Estrutura de Pastas](05-estrutura-pastas.md)