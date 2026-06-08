# 02 — Avaliação da Modelagem

> **Objetivo:** Avaliar a modelagem atual do projeto — classes, responsabilidades, acoplamento, coesão, encapsulamento, herança vs composição — e identificar violações, classes desnecessárias, classes faltantes e problemas de SOLID.

---

## 🧒 O que é Modelagem? (Explicação para criança)

Modelagem é como desenhar a planta de uma casa antes de construí-la.

Se você desenhar uma planta bagunçada — quarto dentro do banheiro, cozinha sem pia, porta que não abre — a casa vai ficar ruim. Se a planta for bem feita, a casa fica boa, fácil de morar e fácil de reformar.

No software, modelagem é decidir:
- **Que classes existem** (quais cômodos?)
- **O que cada classe faz** (qual a função de cada cômodo?)
- **Como as classes se comunicam** (onde ficam as portas?)
- **O que cada classe esconde** (o que fica dentro do armário?)

Uma boa modelagem torna o software fácil de entender, modificar e dar manutenção.

---

## 🎓 Conceitos Fundamentais (Nível Universitário)

### Coesão

**Coesão** mede o quanto as responsabilidades de uma classe estão relacionadas entre si.

| Tipo | Descrição | Exemplo |
|------|-----------|---------|
| 🟢 **Alta coesão** | A classe faz uma coisa só, e faz bem | `Refeicao` só gerencia dados de refeição |
| 🔴 **Baixa coesão** | A classe faz várias coisas não relacionadas | Uma classe que calcula imposto E envia email |

**Regra:** Prefira classes com **alta coesão**. É mais fácil de entender, testar e reutilizar.

### Acoplamento

**Acoplamento** mede o quanto uma classe depende de outras.

| Tipo | Descrição | Exemplo |
|------|-----------|---------|
| 🟢 **Baixo acoplamento** | Classe depende de poucas outras, de forma estável | `Peso` depende de nada |
| 🔴 **Alto acoplamento** | Classe depende de muitas outras, ou de detalhes internos | `renderizarRefeicoes` importa `kanban` de `main.js` |

**Regra:** Prefira **baixo acoplamento**. Mudanças em uma classe não quebram muitas outras.

### Encapsulamento

**Encapsulamento** é esconder detalhes internos e expor apenas o necessário.

```
🔒 BOM:   objeto.metodo()        ← "O que faz"
🔓 RUIM:  objeto.dados.metodo()  ← "Como faz"
```

### Herança vs Composição

| | Herança | Composição |
|--|---------|------------|
| Relação | "É UM" (IS-A) | "TEM UM" (HAS-A) |
| Exemplo | `Carro` herda de `Veiculo` | `Carro` tem `Motor` |
| Flexibilidade | Baixa (hierarquia rígida) | Alta (pode trocar componentes) |
| Risco | Quebra fácil ao mudar base | Menor risco |

**Regra de ouro:** Prefira **composição** sobre herança. Só use herança quando a relação "É UM" for verdadeira e estável.

---

## 💼 Avaliação Detalhada da Modelagem Atual

### 1. Análise Classe por Classe

#### Classe: `Ingrediente` (models/Ingrediente.js)

```javascript
export class Ingrediente {
  constructor(nome, calorias = 0) {
    this.validar(nome);
    this.nome = nome;
    this.calorias = calorias;
  }
  validar(nome){
    if (!nome || typeof nome !== 'string' || nome.trim().length === 0) {
      throw new Error('O nome do ingrediente é obrigatório');
    }
  }
}
```

| Critério | Avaliação | Nota |
|----------|-----------|------|
| Coesão | Alta — só faz validação e armazenamento | 🟢 |
| Acoplamento | Nulo — não importa nada | 🟢 |
| Encapsulamento | 🔴 **Problema**: `nome` e `calorias` são públicos | 🟡 |
| Responsabilidade | OK para MVP | 🟢 |

🔴 **Problema:** `calorias` aceita qualquer número, inclusive negativos. Deveria ser um Value Object `Calorias` com validação própria.

🔴 **Problema:** Se `calorias` for 0, como saber se é porque o ingrediente não tem calorias ou porque o usuário não preencheu? Melhor usar `null` como default.

```javascript
// ✅ Refatoração recomendada
export class Ingrediente {
  #nome;  // Campo privado (ES2022)
  #calorias;
  
  constructor(nome, calorias = null) {
    this.#nome = this.#validarNome(nome);
    this.#calorias = calorias !== null ? new Calorias(calorias) : null;
  }
  
  #validarNome(nome) {
    if (!nome || typeof nome !== 'string' || nome.trim().length === 0) {
      throw new Error('O nome do ingrediente é obrigatório');
    }
    return nome.trim();
  }
  
  get nome() { return this.#nome; }
  get calorias() { return this.#calorias; }
}
```

---

#### Classe: `ItemRefeicao` (models/ItemRefeicao.js)

```javascript
export class ItemRefeicao {
  constructor(ingrediente, peso) {
    if (typeof ingrediente == "string") {
      this.ingrediente = ingrediente;
    } else {
      this.ingrediente = ingrediente;
    }
    this.peso = this.validarPeso(peso);
    this.id = Date.now() + Math.random();
  }
  validarPeso(peso) {
    const p = Number(peso);
    if (isNaN(p) || p <= 0 || p =="") {
      throw new Error("O pese deve ser um número maior que zero");
    }
    return p;
  }
}
```

| Critério | Avaliação | Nota |
|----------|-----------|------|
| Coesão | Média — valida peso + guarda dados | 🟡 |
| Acoplamento | Baixo — não importa nada externo | 🟢 |
| Encapsulamento | 🔴 **Problema**: tudo público | 🟡 |
| Consistência | 🔴 **Problema GRAVE**: `ingrediente` pode ser string OU objeto | 🔴 |

🔴 **Problema GRAVE — Dualidade de tipo:**

```javascript
// O construtor tem um if que faz EXATAMENTE a mesma coisa:
if (typeof ingrediente == "string") {
  this.ingrediente = ingrediente;  // guarda string
} else {
  this.ingrediente = ingrediente;  // guarda objeto (Ingrediente)
}
// Resultado: ingrediente pode ser string OU objeto Ingrediente
```

Isso força quem renderiza a fazer:
```javascript
// Em renderizarItemRefeicao.js:33
`<td>${typeof item.ingrediente === 'object' ? item.ingrediente.nome : item.ingrediente}</td>`
```

Esse `typeof` no template é um **cheiro de código** (code smell). Indica que o modelo está inconsistente.

🔴 **Problema:** `id = Date.now() + Math.random()` não garante unicidade em alta frequência. Duas chamadas no mesmo milissegundo podem gerar o mesmo ID.

🔴 **Problema:** `validarPeso(peso)` compara `peso == ""` depois de converter com `Number()`. `Number("")` retorna `0`, então a comparação `0 == ""` é `true` em JavaScript (== faz coerção de tipo). Isso é um **bug silencioso**.

```javascript
// ❌ Bug: Number("") retorna 0, e 0 == "" é true
// Mas a condição também verifica p <= 0, então cai no throw
// O problema é que a comparação "" é desnecessária e confusa
```

```javascript
// ✅ Refatoração recomendada
import { Peso } from "./Peso.js";

export class ItemRefeicao {
  #id;
  #ingrediente;
  #peso;
  
  constructor(ingrediente, peso) {
    if (!(ingrediente instanceof Ingrediente)) {
      throw new Error("ingrediente deve ser uma instância de Ingrediente");
    }
    this.#id = crypto.randomUUID(); // UUID verdadeiro (ES2022+)
    this.#ingrediente = ingrediente;
    this.#peso = peso instanceof Peso ? peso : new Peso(peso, 'g');
  }
  
  get id() { return this.#id; }
  get ingrediente() { return this.#ingrediente; }
  get peso() { return this.#peso; }
}
```

---

#### Classe: `Refeicao` (models/Refeicao.js)

```javascript
export class Refeicao {
  constructor(nome) {
    this.validar(nome);
    this.nome = nome;
    this.itens = [];
    this.proxId = 1;
    this.id = null;
  }
  validar(nome) { ... }
  adicionarItem(ingrediente, peso) { ... }
  excluirItem(id) { ... }
}
```

| Critério | Avaliação | Nota |
|----------|-----------|------|
| Coesão | Alta | 🟢 |
| Acoplamento | Importa `ItemRefeicao` | 🟢 |
| Encapsulamento | 🔴 `itens` público | 🟡 |
| Responsabilidade | OK | 🟢 |

🔴 **Problema:** `this.itens = []` é público. Alguém pode fazer `refeicao.itens.push(x)` sem passar pelo `adicionarItem()`, pulando validações.

🔴 **Problema:** `proxId` é um ID incremental local. Se você carregar dados do LocalStorage, o `proxId` vai resetar e causar conflito de IDs.

```javascript
// ✅ Refatoração recomendada
export class Refeicao {
  #id;
  #nome;
  #itens;
  #proximoId = 1;
  
  constructor(nome) {
    this.#id = crypto.randomUUID();
    this.#nome = this.#validarNome(nome);
    this.#itens = [];
  }
  
  #validarNome(nome) {
    if (!nome || typeof nome !== 'string' || nome.trim().length === 0) {
      throw new Error("O nome da refeição é obrigatório");
    }
    return nome.trim();
  }
  
  adicionarItem(ingrediente, peso) {
    const item = new ItemRefeicao(ingrediente, peso);
    item._definirId(this.#proximoId++);
    this.#itens.push(item);
  }
  
  excluirItem(id) {
    this.#itens = this.#itens.filter(item => item.id !== id);
  }
  
  get id() { return this.#id; }
  get nome() { return this.#nome; }
  get itens() { return [...this.#itens]; } // Cópia defensiva
}
```

---

#### Classe: `Dia` (models/Dia.js)

```javascript
export class Dia {
  constructor(nome, id) {
    this.nome = nome;
    this.id = id;
    this.refeicoes = [];
    this.proxId = 1;
  }
  adicionarRefeicao(refeicao) {
    refeicao.id = this.proxId;
    this.refeicoes.push(refeicao);
    this.proxId++;
  }
  excluirRefeicao(id) {
    this.refeicoes = this.refeicoes.filter(refeicao => refeicao.id != id);
  }
}
```

| Critério | Avaliação | Nota |
|----------|-----------|------|
| Coesão | Alta | 🟢 |
| Acoplamento | Baixo — só importa nada | 🟢 |
| Encapsulamento | 🔴 `refeicoes` público | 🔴 |
| Regras de negócio | 🔴 Limite de refeições está na VIEW | 🔴 |

🔴 **Problema:** `refeicao.id = this.proxId` — o método modifica um objeto que recebeu de fora. Isso é um **efeito colateral** (side effect). É melhor que `Refeicao` já venha com ID, ou que o método retorne uma nova refeição com ID (imutabilidade).

---

#### Classe: `PlanoSemanal` (models/PlanoSemanal.js)

```javascript
export class PlanoSemanal {
  constructor() {
    this.dias = [];
    // Instanciando os dias da semana
    const segunda = new Dia("Segunda-feira", "segunda");
    // ...
    this.dias.push(segunda, terca, quarta, quinta, sexta, sabado, domingo);
  }
}
```

| Critério | Avaliação | Nota |
|----------|-----------|------|
| Coesão | Média | 🟡 |
| Acoplamento | Importa `Dia` | 🟢 |
| Encapsulamento | 🔴 `dias` é público | 🔴 |
| Flexibilidade | 🔴 Só permite 7 dias fixos. E se quiser planejar 2 semanas? | 🟡 |

🔴 **Problema:** `this.dias` é um array público. `renderizarSemana` itera `plano.dias[i]` diretamente. Se a estrutura interna mudar (ex: usar Map em vez de array), todos os consumidores quebram.

---

### 2. Análise de Acoplamento Entre Módulos

Diagrama de dependências **ATUAL**:

```
                  ┌──────────────┐
                  │   main.js    │
                  └──────┬───────┘
                         │
         ┌───────────────┼───────────────┐
         ▼               ▼               ▼
  ┌────────────┐  ┌────────────┐  ┌────────────┐
  │  app/      │  │  models/   │  │  render/   │
  │  estados   │  │  (todos)   │  │  (todos)   │
  └────────────┘  └────────────┘  └────────────┘
         ▲                                       
         │          ┌────────────┐               
         └──────────│  ui/       │               
                    │  refeicao  │               
                    │  Form      │               
                    └────────────┘               
```

**Problema de acoplamento detectado:**

1. 🔴 **`render/renderizarRefeicoes.js` importa `kanban` de `main.js`**
   ```javascript
   import { kanban } from "../main.js";  // 🔴 Dependência circular potencial!
   ```
   Isso cria uma dependência onde `render/` depende de `main/` que é o ponto de entrada. Se `main.js` mudar, `render/` quebra.

2. 🔴 **`ui/refeicaoForm.js` importa de `models/`, `render/` e `ui/modal.js`** — faz tudo ao mesmo tempo.

3. 🟡 **`app/atualizarKanban.js` importa `render/` e `app/limparTela`** — OK, mas poderia ser mais simples.

---

### 3. Classes Desnecessárias

**Nenhuma classe é desnecessária.** Todas as 5 classes têm função no domínio.

### 4. Classes Faltantes

| Classe Faltante | Motivo |
|-----------------|--------|
| `Peso` (Value Object) | Substituir primitive obsession em `ItemRefeicao` |
| `NomeRefeicao` (Value Object) | Encapsular validação de nome |
| `Calorias` (Value Object) | Para informações nutricionais |
| `PlanoSemanalRepository` (Repository) | Para persistência (LocalStorage) |
| `ListaComprasService` (Service) | Para gerar lista de compras (futuro) |
| `CalculoNutricionalService` (Service) | Para calcular nutrientes (futuro) |

---

### 5. Violações de SOLID

(Lista resumida — detalhada no documento 03)

| Princípio | Violação | Onde | Gravidade |
|-----------|----------|------|-----------|
| **SRP** | `ui/refeicaoForm.js` cria + manipula DOM + renderiza + navega modal | ui/ | 🔴 |
| **SRP** | `renderizarRefeicoes.js` renderiza + configura eventos + gerencia visibilidade | render/ | 🟡 |
| **OCP** | Se quiser adicionar novo tipo de visualização, precisa modificar render/ | render/ | 🟡 |
| **LSP** | Não aplicável (sem herança) | — | 🟢 |
| **ISP** | Não aplicável (sem interfaces) | — | 🟢 |
| **DIP** | `render/` depende de `main.js` (módulo concreto) | render/ | 🔴 |
| **DIP** | `ui/` depende diretamente de `models/` concretos | ui/ | 🟡 |

---

### 6. Tabela Comparativa: Estado Ideal vs Estado Atual

| Aspecto | Estado Atual | Estado Ideal |
|---------|-------------|--------------|
| Campos privados | Nenhum (tudo público) | `#campos` privados |
| Getters | Nenhum | Getters com cópia defensiva |
| Value Objects | Nenhum | Peso, NomeRefeicao, Calorias |
| Persistência | Nenhuma | Repository |
| SSR (Single Source of Truth) | Estado global parcial | Estado centralizado |
| Eventos | Subscribe/notify morto | Eventos ativos |
| Testabilidade | Baixa (DOM acoplado) | Alta (injeção de dependência) |
| Imutabilidade | Nenhuma | Cópias defensivas |

---

### 7. Cálculo de Métricas (Estimativa)

```javascript
// Métricas do projeto atual (estimadas):

// Acoplamento aferitivo (Afferent Coupling - Ca)
// Quantas classes externas dependem desta
// PlanoSemanal: 2 (estado, renderizarSemana)
// Dia: 2 (PlanoSemanal, renderizarDia)
// Refeicao: 2 (Dia, ui/refeicaoForm)
// ItemRefeicao: 2 (Refeicao, render)
// Ingrediente: 2 (ItemRefeicao, ui/refeicaoForm)

// Acoplamento eferente (Efferent Coupling - Ce)
// Quantas classes esta classe usa
// PlanoSemanal: 1 (Dia)
// Dia: 0
// Refeicao: 1 (ItemRefeicao)
// ItemRefeicao: 0
// Ingrediente: 0

// Instabilidade = Ce / (Ce + Ca)
// PlanoSemanal: 1 / (1+2) = 0.33 (relativamente estável)
// Dia: 0 / (0+2) = 0.00 (muito estável)
// Refeicao: 1 / (1+2) = 0.33
// ItemRefeicao: 0 / (0+2) = 0.00
// Ingrediente: 0 / (0+2) = 0.00
```

---

## 📊 Resumo da Avaliação

| Classe | Coesão | Acoplamento | Encapsulamento | SOLID | Nota |
|--------|--------|-------------|----------------|-------|------|
| `Ingrediente` | 🟢 Alta | 🟢 Baixo | 🟡 Parcial | 🟢 | 8/10 |
| `ItemRefeicao` | 🟡 Média | 🟢 Baixo | 🟡 Parcial | 🟡 | 6/10 |
| `Refeicao` | 🟢 Alta | 🟢 Baixo | 🟡 Parcial | 🟢 | 7/10 |
| `Dia` | 🟢 Alta | 🟢 Baixo | 🔴 Ruim | 🟡 | 6/10 |
| `PlanoSemanal` | 🟡 Média | 🟢 Baixo | 🔴 Ruim | 🟡 | 5/10 |

---

## 🎯 Conclusão

### O que está bom:
1. Separação em módulos (models/ vs render/ vs ui/ vs app/)
2. Cada classe de modelo representa um conceito real do domínio
3. Hierarquia de dados correta
4. Validações básicas existem

### O que precisa melhorar (urgente):
1. 🔴 **Encapsulamento total** — todos os arrays e campos devem ser privados
2. 🔴 **Consistência de tipos** — `ItemRefeicao.ingrediente` não pode ser string OU objeto
3. 🔴 **Remover dependência** de `render/` para `main.js`
4. 🟡 **Criar Value Objects** para peso, nome
5. 🟡 **Mover regras de negócio** para o modelo (limite de refeições)
6. 🟡 **IDs robustos** (UUID em vez de timestamp+random)
7. 🟢 **Cópia defensiva** em getters de arrays

---

📖 **Referências:**
- Martin, Robert C. *Clean Code*. 2008. — Capítulo 10: Classes
- Fowler, Martin. *Refactoring: Improving the Design of Existing Code*. 2ª ed. 2018. — Capítulo 3: Bad Smells in Code
- Martin, Robert C. *Clean Architecture*. 2017. — Capítulo 7: SRP, Capítulo 8: OCP
- MDN: [Private class fields](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_class_fields)
- MDN: [crypto.randomUUID()](https://developer.mozilla.org/en-US/docs/Web/API/Crypto/randomUUID)

Próximo: [03 — Princípios SOLID](03-solid.md)