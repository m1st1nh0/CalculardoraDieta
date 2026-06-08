# 03 — Princípios SOLID

> **Objetivo:** Analisar cada um dos 5 princípios SOLID individualmente, explicar do zero, demonstrar exemplos simples e aplicados ao projeto, identificar violações existentes e apresentar refatorações recomendadas.

---

## 🧒 O que é SOLID? (Explicação para criança)

SOLID é um conjunto de 5 regrinhas para escrever código que não quebra quando você precisa mudar alguma coisa.

Imagine que você tem um brinquedo de Lego. Se você construiu tudo com peças que encaixam perfeitamente, você pode trocar uma peça sem derrubar o castelo inteiro. SOLID te ajuda a fazer isso com código.

Cada letra é uma regra:

| Letra | Nome | Tradução |
|-------|------|----------|
| **S** | Single Responsibility Principle | Uma classe = uma responsabilidade |
| **O** | Open/Closed Principle | Aberto pra extensão, fechado pra modificação |
| **L** | Liskov Substitution Principle | Subtipo deve ser substituível pelo tipo base |
| **I** | Interface Segregation Principle | Interfaces específicas são melhores que genéricas |
| **D** | Dependency Inversion Principle | Dependa de abstrações, não de implementações |

---

## 🎓 Contexto Histórico (Nível Universitário)

SOLID foi introduzido por Robert C. Martin (Uncle Bob) no final dos anos 1990 e consolidado em seu livro *Agile Software Development, Principles, Patterns, and Practices* (2002).

O objetivo era resolver problemas comuns em código orientado a objetos:
- **Fragilidade**: mudar em um lugar quebra em vários
- **Imobilidade**: código difícil de reutilizar
- **Rigidez**: mudanças forçam cascata de alterações

SOLID não é uma lei universal. É um **conjunto de heurísticas** que ajudam a evitar esses problemas. Nem sempre você consegue aplicar todos os 5. O importante é saber quando está violando e por quê.

---

## 💼 Aplicação no Projeto

---

## 1️⃣ S — Single Responsibility Principle (SRP)

### O que é?

> **Uma classe deve ter um, e apenas um, motivo para mudar.**

Em outras palavras: cada classe deve fazer **uma coisa** e fazer bem.

### Por que existe?

Se uma classe faz várias coisas, uma mudança em qualquer dessas coisas quebra a classe inteira. Além disso, fica difícil testar, difícil entender, difícil reutilizar.

### Exemplo simples

```javascript
// ❌ VIOLA SRP - faz 3 coisas
class Relatorio {
  constructor(dados) {
    this.dados = dados;
  }
  
  calcularDados() { /* ... */ }           // 1. Lógica de negócio
  gerarHTML() { /* ... */ }               // 2. Renderização
  enviarEmail() { /* ... */ }             // 3. Infraestrutura
}

// ✅ RESPEITA SRP - cada classe tem uma responsabilidade
class CalculadoraRelatorio {
  calcular(dados) { /* ... */ }
}

class RelatorioHTML {
  gerar(dados) { /* ... */ }
}

class ServicoEmail {
  enviar(relatorio) { /* ... */ }
}
```

### Analogia

Um restaurante onde o garçom também cozinha, lava pratos e recebe pagamento. Se ele ficar doente, o restaurante fecha. Num restaurante bem organizado, cada um tem sua função.

### 🔴 Violações encontradas no seu projeto

#### Violação 1: `ui/refeicaoForm.js` — 4 responsabilidades

```javascript
// ui/refeicaoForm.js
export function criarRefeicao() {
  const input = document.getElementById("nomeRefeicao"); // 1. Acessa DOM
  const nomeRefeicao = input.value;
  try {
    const r = new Refeicao(nomeRefeicao);                // 2. Cria modelo
    const { diaSelecionado } = estado.getState();
    diaSelecionado.adicionarRefeicao(r);                 // 3. Manipula dados
    estado.setRefeicaoEmAndamento(r);
    renderizarItemRefeicao()                              // 4. Renderiza
    passarModal();                                        // 5. Navega modal
  } catch (error) {
    alert(error.message);                                // 6. Trata erro
  }
}
```

**Responsabilidades misturadas:**
1. Leitura do DOM
2. Criação de modelo de domínio
3. Atualização de estado global
4. Renderização
5. Navegação entre modais
6. Tratamento de erro

**Risco:** Se a lógica de criação de refeição mudar, você precisa alterar esse arquivo. Se a renderização mudar, também. Se o modal mudar, também. Três motivos diferentes para mudar o mesmo arquivo = SRP violado.

#### Violação 2: `renderizarRefeicoes.js` — renderiza + gerencia eventos + controla visibilidade

```javascript
export function renderizarRefeicoes(dia) {
  // ... renderização ...
  
  excbtn.addEventListener("click", () => {       // 1. Configura evento
    dia.excluirRefeicao(refDoDia.id);             // 2. Manipula dados
    renderizarRefeicoes(dia);                     // 3. Re-renderiza
    atualizarKanban(kanban);                      // 4. Atualiza tudo
  });
  
  rTitulo.addEventListener("click", () => {       // 5. Configura outro evento
    if (tabela.style.display == "") {              // 6. Gerencia visibilidade
      tabela.style.display = "none";
    } else {
      tabela.style.display = "";
    }
  });
}
```

### ✅ Refatoração recomendada

```javascript
// controllers/refeicaoController.js
export class RefeicaoController {
  constructor(estado, repositorio) {
    this.estado = estado;
    this.repositorio = repositorio;
  }
  
  criarRefeicao(nome, dia) {
    const refeicao = new Refeicao(nome);
    dia.adicionarRefeicao(refeicao);
    this.estado.setRefeicaoEmAndamento(refeicao);
    return refeicao;
  }
  
  excluirRefeicao(dia, idRefeicao) {
    dia.excluirRefeicao(idRefeicao);
    this.repositorio.salvar(this.estado.planoSemanal);
  }
}

// views/refeicaoView.js
export class RefeicaoView {
  constructor(container, controller) {
    this.container = container;
    this.controller = controller;
  }
  
  renderizarFormulario() {
    // Só renderiza o formulário
  }
  
  handleSubmit(event) {
    const nome = document.getElementById("nomeRefeicao").value;
    const { diaSelecionado } = this.controller.estado.getState();
    this.controller.criarRefeicao(nome, diaSelecionado);
    this.renderizarItemRefeicao();
    this.navegarModal();
  }
}
```

---

## 2️⃣ O — Open/Closed Principle (OCP)

### O que é?

> **Entidades de software devem estar abertas para extensão, mas fechadas para modificação.**

Isso significa: você deve poder adicionar novas funcionalidades SEM modificar código existente.

### Por que existe?

Código existente já foi testado e está funcionando. Toda vez que você modifica código existente, corre o risco de introduzir bugs. É mais seguro **adicionar** código novo do que **modificar** código velho.

### Exemplo simples

```javascript
// ❌ VIOLA OCP - para adicionar novo formato, modifica a classe
class Relatorio {
  exportar(formato) {
    if (formato === 'PDF') { /* ... */ }
    else if (formato === 'CSV') { /* ... */ }
    // Para adicionar JSON, preciso modificar esta função
  }
}

// ✅ RESPEITA OCP - usa polimorfismo
class Relatorio {
  exportar(estrategia) {
    return estrategia.exportar(this.dados);
  }
}

class EstrategiaPDF {
  exportar(dados) { /* ... */ }
}

class EstrategiaCSV {
  exportar(dados) { /* ... */ }
}

// Para adicionar JSON, crio uma nova classe sem mexer nas existentes
class EstrategiaJSON {
  exportar(dados) { /* ... */ }
}
```

### Analogia

Uma tomada elétrica. Você não precisa quebrar a parede para conectar um novo aparelho. A tomada é **fechada para modificação** (não mexa na parede) mas **aberta para extensão** (conecte o que quiser).

### 🔴 Violação identificada

**Violação:** `renderizarBotao.js` tem a regra de limite de 5 refeições hardcoded. Para mudar para 10, você precisaria modificar o código.

```javascript
// ❌ VIOLA OCP
if (dia.refeicoes.length < 5) { // Número mágico 5 hardcoded
```

**Solução OCP:** O limite deve ser configurável pelo modelo, não fixo na view.

```javascript
// ✅ RESPEITA OCP
class Dia {
  constructor(nome, id, limiteRefeicoes = 5) {
    this._limiteRefeicoes = limiteRefeicoes; // Configurável
  }
  
  get podeAdicionarRefeicao() {
    return this._refeicoes.length < this._limiteRefeicoes;
  }
}

// Na view, não precisa saber o número:
if (dia.podeAdicionarRefeicao) { // Aberto para extensão
```

Outra violação OCP: se você quiser adicionar uma nova forma de visualizar a semana (ex: modo lista em vez de kanban), precisaria modificar `renderizarSemana.js`. Uma solução OCP seria usar o **Strategy Pattern** para permitir diferentes visualizações.

---

## 3️⃣ L — Liskov Substitution Principle (LSP)

### O que é?

> **Se S é um subtipo de T, então objetos de T podem ser substituídos por objetos de S sem alterar as propriedades do programa.**

Em outras palavras: se você tem uma classe `Pai` e uma classe `Filho` que herda de `Pai`, você deve poder usar `Filho` em qualquer lugar que espera `Pai` sem quebrar nada.

### Por que existe?

Herança mal feita gera comportamentos surpreendentes. O LSP garante que a herança seja semanticamente correta, não apenas tecnicamente.

### Exemplo clássico (e por que é útil)

```javascript
// ❌ VIOLA LSP
class Retangulo {
  constructor(largura, altura) {
    this.largura = largura;
    this.altura = altura;
  }
  setLargura(valor) { this.largura = valor; }
  setAltura(valor) { this.altura = valor; }
  getArea() { return this.largura * this.altura; }
}

class Quadrado extends Retangulo {
  setLargura(valor) {
    this.largura = valor;
    this.altura = valor; // Mantém quadrado
  }
  setAltura(valor) {
    this.largura = valor;
    this.altura = valor; // Mantém quadrado
  }
}

function aumentarLargura(retangulo) {
  retangulo.setLargura(10);
  retangulo.setAltura(5);
  // A função espera área = 50 (10 * 5)
  // Mas se receber um Quadrado, área = 25 (5 * 5)
  console.log(retangulo.getArea()); 
}
```

Aqui `Quadrado` viola LSP porque substituir `Retangulo` por `Quadrado` muda o comportamento esperado.

### No seu projeto

Atualmente **não há herança**, então LSP não é violado. Mas é um aprendizado importante para quando você criar hierarquias.

**Quando pode ser relevante no futuro:**
- Se criar uma classe `RefeicaoFixa` (pré-cadastrada) que herda de `Refeicao`
- Se criar `ItemRefeicaoComNutricao` que herda de `ItemRefeicao`

```javascript
// ✅ Exemplo de herança que RESPEITA LSP
class Refeicao {
  constructor(nome) { 
    this.validar(nome);
    this.nome = nome;
    this.itens = [];
  }
  
  adicionarItem(ingrediente, peso) {
    const item = new ItemRefeicao(ingrediente, peso);
    this.itens.push(item);
  }
  
  totalCalorias() {
    return this.itens.reduce((sum, item) => {
      return sum + (item.ingrediente.calorias || 0);
    }, 0);
  }
}

// "RefeicaoFixa" É UMA "Refeicao" — relação IS-A verdadeira
class RefeicaoFixa extends Refeicao {
  constructor(nome, itens) {
    super(nome);
    itens.forEach(item => this.adicionarItem(item.ingrediente, item.peso));
  }
  
  // Não sobrescreve comportamento inesperado
  // Pode adicionar comportamento novo:
  get descricao() {
    return `${this.nome} (${this.itens.length} ingredientes)`;
  }
}

// Tudo que funciona com Refeicao funciona com RefeicaoFixa
function exibirRefeicao(refeicao) {
  console.log(refeicao.nome); // OK
  console.log(refeicao.totalCalorias()); // OK
}
```

---

## 4️⃣ I — Interface Segregation Principle (ISP)

### O que é?

> **Nenhum cliente deve ser forçado a depender de métodos que não usa.**

No JavaScript (que não tem interfaces formais), isso significa: não crie classes com métodos que não fazem sentido para quem as usa.

### Por que existe?

Interfaces grandes demais forçam implementações vazias ou lançando exceções. Isso gera código confuso e frágil.

### Exemplo simples

```javascript
// ❌ VIOLA ISP - interface grande demais
class MaquinaDeCafe {
  fazerCafe() {}
  fazerCha() {}
  fazerChocolate() {}
  fazerCapuccino() {}
}

// Uma máquina simples que só faz café
class MaquinaSimples extends MaquinaDeCafe {
  fazerCafe() { /* ok */ }
  fazerCha() { throw new Error("Não faz chá"); }    // 🔴 Forçado!
  fazerChocolate() { throw new Error("Não faz"); }   // 🔴 Forçado!
  fazerCapuccino() { throw new Error("Não faz"); }   // 🔴 Forçado!
}

// ✅ RESPEITA ISP - interfaces específicas
class CafeMaker {
  fazerCafe() {}
}

class ChaMaker {
  fazerCha() {}
}

class MaquinaSimples {
  constructor() {
    this.cafe = new CafeMaker();
  }
}

class MaquinaPremium {
  constructor() {
    this.cafe = new CafeMaker();
    this.cha = new ChaMaker();
  }
}
```

### No seu projeto

Atualmente ISP não é um problema porque você não tem classes que herdam de interfaces grandes. Mas é relevante para o design das funções.

**Boa prática:** Funções que recebem um objeto devem pedir apenas o que usam.

```javascript
// ❌ VIOLA ISP (conceitual) - função recebe objeto inteiro mas usa pouco
function renderizarBotao(dia) {
  // Só usa dia.refeicoes.length, mas recebe o Dia inteiro
  if (dia.refeicoes.length < 5) { ... }
}

// ✅ RESPEITA ISP
function renderizarBotao(podeAdicionar) {
  // Só recebe o que precisa
  if (podeAdicionar) { ... }
}

// Chamada:
renderizarBotao(dia.podeAdicionarRefeicao);
```

---

## 5️⃣ D — Dependency Inversion Principle (DIP)

### O que é?

> **Módulos de alto nível não devem depender de módulos de baixo nível. Ambos devem depender de abstrações. Abstrações não devem depender de detalhes. Detalhes devem depender de abstrações.**

Traduzindo: sua lógica de negócio (o que o sistema faz) não deve saber como as coisas são implementadas (banco de dados, DOM, API).

### Por que existe?

Se a lógica de negócio depende diretamente de implementações concretas, qualquer mudança na implementação quebra a lógica. Invertendo a dependência, a lógica fica estável e as implementações podem ser trocadas.

### Exemplo simples

```javascript
// ❌ VIOLA DIP - alto nível depende de baixo nível
class ServicoCadastro {
  constructor() {
    this.bd = new DatabaseMySQL(); // Dependência concreta!
  }
  
  salvarUsuario(usuario) {
    this.bd.insert('usuarios', usuario);
  }
}

// Se trocar MySQL por MongoDB, precisa modificar ServicoCadastro!

// ✅ RESPEITA DIP
class ServicoCadastro {
  constructor(repositorio) { // Depende de abstração
    this.repositorio = repositorio;
  }
  
  salvarUsuario(usuario) {
    this.repositorio.salvar(usuario);
  }
}

// Implementações concretas dependem da abstração:
class RepositorioMySQL {
  salvar(entidade) { /* SQL */ }
}

class RepositorioMongoDB {
  salvar(entidade) { /* MongoDB */ }
}

// Fácil trocar:
const servico = new ServicoCadastro(new RepositorioMySQL());
```

### Analogia

Uma lâmpada não precisa saber de onde vem a eletricidade (usina hidrelétrica, solar, nuclear). Ela só precisa saber que existe uma fonte de energia (a abstração "fonte elétrica"). Se trocar a usina, a lâmpada continua funcionando.

### 🔴 Violações encontradas no seu projeto

#### Violação DIP 1: `render/renderizarRefeicoes.js` importa `kanban` de `main.js`

```javascript
// render/renderizarRefeicoes.js
import { kanban } from "../main.js";  // 🔴 Depende de módulo concreto!

// Se main.js mudar a forma de exportar kanban, render quebra.
// Além disso, é uma dependência circular potencial:
// main.js → render/ → main.js
```

**Risco:** Se você renomear a variável `kanban` em `main.js`, o render quebra. Se você mudar o arquivo `main.js` de lugar, o import quebra.

#### Violação DIP 2: `ui/refeicaoForm.js` depende diretamente de modelos concretos

```javascript
// ui/refeicaoForm.js
import { Ingrediente } from "../models/Ingrediente.js";
import { Refeicao } from "../models/Refeicao.js";
// 🔴 Depende de implementações concretas
```

#### Violação DIP 3: `renderizarDia.js` usa `document.createElement` diretamente

```javascript
// render/renderizarDia.js
export function renderizarDia(dia, kanban) {
  const col = document.createElement("div"); // 🔴 Acoplado à API do DOM
  // ...
}
```

Se um dia você quiser renderizar em Canvas ou WebGL, precisa reescrever tudo.

### ✅ Refatoração recomendada

```javascript
// 1. Criar uma abstração para o container de renderização
// render/abstracoes/container.js
export class ContainerDOM {
  constructor(elemento) {
    this.elemento = elemento;
  }
  
  append(child) {
    this.elemento.appendChild(child);
  }
  
  getElemento() {
    return this.elemento;
  }
}

// 2. Injetar dependências em vez de importar diretamente
// render/renderizarDia.js (refatorado)
export function renderizarDia(dia, container) {
  const col = container.getElemento().ownerDocument.createElement("div");
  col.innerHTML = `<div class="titulo"><h4>${dia.nome}</h4></div>`;
  container.append(col);
  return col;
}

// 3. main.js (refatorado)
const kanbanElement = document.getElementById("kanban");
const container = new ContainerDOM(kanbanElement);
const p = new PlanoSemanal();
estado.planoSemanal = p;
atualizarKanban(container);
```

```javascript
// 4. Repository Pattern para desacoplar persistência
// repositories/planoSemanalRepository.js
export class PlanoSemanalRepository {
  constructor(storage) {
    this.storage = storage; // Abstração: poderia ser LocalStorage, API, IndexedDB
  }
  
  salvar(plano) {
    this.storage.setItem('planoSemanal', JSON.stringify(plano));
  }
  
  carregar() {
    const dados = this.storage.getItem('planoSemanal');
    return dados ? this._hidratar(JSON.parse(dados)) : null;
  }
  
  _hidratar(dados) {
    // Converte JSON de volta para objetos do domínio
    const plano = new PlanoSemanal();
    // ... lógica de hidratação
    return plano;
  }
}

// Uso (injeção de dependência):
const repositorio = new PlanoSemanalRepository(localStorage);
const plano = repositorio.carregar() || new PlanoSemanal();
```

---

## 📊 Tabela Resumo: SOLID no Projeto

| Princípio | Violado? | Onde | Gravidade | Prioridade |
|-----------|----------|------|-----------|------------|
| **SRP** | 🔴 Sim | `ui/refeicaoForm.js` — 4 responsabilidades | Alta | 🔴 Corrigir agora |
| **SRP** | 🟡 Sim | `renderizarRefeicoes.js` — render + eventos | Média | 🟡 Corrigir na V2 |
| **OCP** | 🟡 Sim | Limite 5 refeições hardcoded na view | Média | 🟡 Corrigir agora |
| **LSP** | 🟢 Não | Sem herança no projeto | — | — |
| **ISP** | 🟢 Não | Sem interfaces grandes | — | — |
| **DIP** | 🔴 Sim | render/ depende de main.js | Alta | 🔴 Corrigir agora |
| **DIP** | 🟡 Sim | ui/ depende de modelos concretos | Média | 🟡 Corrigir na V2 |

---

## 🎯 Conclusão

### O que fazer IMEDIATAMENTE (V1/MVP após análise):
1. **SRP** — Separar responsabilidades de `ui/refeicaoForm.js` em controller + view
2. **OCP** — Mover limite de refeições para o modelo `Dia`
3. **DIP** — Remover dependência de `render/` para `main.js` (injeção de dependência)

### O que fazer na V2:
4. **SRP** — Separar eventos de `renderizarRefeicoes.js` para um módulo de handlers
5. **DIP** — Criar Repository para abstrair persistência
6. **DIP** — Injetar dependências nos controllers

### O que NÃO fazer agora:
7. **LSP/ISP** — Sem herança, sem interfaces, sem problemas
8. Criar abstrações desnecessárias (YAGNI — You Ain't Gonna Need It)

---

📖 **Referências:**
- Martin, Robert C. *Clean Architecture*. 2017. Capítulos 7-11. — **Leitura obrigatória para SOLID.**
- Martin, Robert C. *Agile Software Development, Principles, Patterns, and Practices*. 2002. — Onde SOLID foi originalmente definido.
- Freeman, Eric. *Head First Design Patterns*. 2ª ed. Capítulo 1. — SOLID com exemplos práticos.
- MDN: [Classes JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)
- Martin Fowler: [Dependency Injection](https://martinfowler.com/articles/injection.html)

Próximo: [04 — Programação Orientada a Objetos](04-oop.md)