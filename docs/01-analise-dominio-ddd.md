# 01 — Análise de Domínio (Domain-Driven Design)

> **Objetivo:** Entender o domínio do problema usando conceitos de DDD (Eric Evans), identificando Entidades, Objetos de Valor, Agregados, Bounded Contexts e Regras de Negócio.

---

## 🧒 O que é DDD? (Explicação para criança)

Imagine que você vai construir uma cidade inteira (o sistema). Antes de começar a construir as casas, você precisa entender como a cidade funciona: quem mora onde, o que cada pessoa faz, quais são as regras da cidade, como as pessoas se comunicam.

DDD (Domain-Driven Design) é exatamente isso: **antes de programar, você primeiro entende profundamente o problema que está resolvendo**. Você conversa com as pessoas que entendem do assunto (nutricionistas, chefs, atletas) e descobre quais são os conceitos importantes, as regras e os limites do sistema.

No seu projeto de planejador alimentar, o "domínio" é **planejamento de refeições semanais**. As pessoas que entendem disso sabem que:
- Uma semana tem 7 dias
- Cada dia tem refeições (café da manhã, almoço, jantar)
- Cada refeição tem ingredientes com quantidades
- Alguns ingredientes se repetem em várias refeições

DDD nos ajuda a transformar esse conhecimento em código que faz sentido.

---

## 🎓 O que é DDD? (Nível Universitário)

**Domain-Driven Design** é uma abordagem de desenvolvimento de software introduzida por Eric Evans em seu livro homônimo (2003). Seu princípio fundamental é:

> **O coração do software é o conhecimento sobre o domínio. O modelo de domínio deve refletir fielmente a realidade do negócio.**

### Conceitos fundamentais do DDD:

| Conceito | Definição |
|----------|-----------|
| **Domínio** | A área de conhecimento e atividade na qual o sistema opera |
| **Subdomínio** | Uma parte específica do domínio (ex: planejamento, nutrição, compras) |
| **Linguagem Ubíqua** | Vocabulário compartilhado entre desenvolvedores e especialistas do domínio |
| **Entidade** | Objeto com identidade única que persiste ao longo do tempo |
| **Value Object** | Objeto definido apenas por seus atributos, sem identidade |
| **Agregado** | Grupo de objetos que devem ser tratados como uma unidade |
| **Raiz do Agregado** | O único objeto do agregado que pode ser referenciado externamente |
| **Bounded Context** | Limite explícito dentro do qual um modelo de domínio se aplica |
| **Repositório** | Mecanismo para recuperar e persistir agregados |

---

## 💼 Aplicando DDD no seu Projeto

### 1. Linguagem Ubíqua

A linguagem ubíqua é o vocabulário que **todos** usam: desenvolvedores, nutricionistas, usuários. No seu projeto, os termos são:

| Termo | Significado |
|-------|-------------|
| **Plano Semanal** | Conjunto de 7 dias com refeições planejadas |
| **Dia** | Um dia da semana (Segunda a Domingo) |
| **Refeição** | Uma ocasião de comer (Café da manhã, Almoço, Jantar) |
| **Item de Refeição** | Um ingrediente com quantidade dentro de uma refeição |
| **Ingrediente** | Um alimento (Arroz, Frango, Brócolis) |

**Problema identificado:** O termo "ItemRefeicao" é confuso. Na linguagem ubíqua, seria melhor "Porcao" (porção) ou "ItemDoCardapio". O nome atual não deixa claro que é a **combinação** de um ingrediente + quantidade.

---

### 2. Entidades vs Value Objects

#### Entidade
Uma **Entidade** tem identidade própria. Duas entidades podem ter os mesmos atributos mas serem diferentes.

**Exemplo do mundo real:** Duas pessoas chamadas "João Silva" não são a mesma pessoa. O que as diferencia é o CPF (identidade).

**No seu projeto:**

```javascript
// ✅ Entidade - tem identidade (id)
class Refeicao {
  constructor(nome) {
    this.nome = nome;
    this.id = null; // Identidade
    this.itens = [];
  }
}

// Duas refeições com mesmo nome são diferentes
const cafe1 = new Refeicao("Café da manhã"); // id = 1
const cafe2 = new Refeicao("Café da manhã"); // id = 2
// cafe1 !== cafe2 (são diferentes!)
```

**Entidades identificadas no projeto:**
- `PlanoSemanal` — identidade: o plano em si (futuramente data de início)
- `Dia` — identidade: o dia da semana (Segunda, Terça...)
- `Refeicao` — identidade: id numérico
- `ItemRefeicao` — identidade: id (timestamp + random)

#### Value Object
Um **Value Object** é definido APENAS pelos seus atributos. Dois Value Objects com os mesmos atributos são **iguais**. Não têm identidade própria.

**Exemplo do mundo real:** Uma cor RGB(255, 0, 0) é vermelho. Outro RGB(255, 0, 0) É O MESMO vermelho. Não importa "qual" vermelho, importa os valores.

**No seu projeto:**

```javascript
// ✅ Value Object - definido pelos atributos
class Peso {
  constructor(valor, unidade = 'g') {
    this.valor = valor;
    this.unidade = unidade;
  }
  
  equals(outro) {
    return this.valor === outro.valor && this.unidade === outro.unidade;
  }
  
  converterPara(kg) {
    return kg ? this.valor / 1000 : this.valor;
  }
}

const peso1 = new Peso(200, 'g');
const peso2 = new Peso(200, 'g');
// peso1.equals(peso2) === true
```

**Value Objects que DEVERIAM existir no seu projeto:**

| Value Object | Atributos | Motivo |
|-------------|-----------|--------|
| `Peso` | valor, unidade | Quantidade não é só número; pode ser gramas, kg, xícaras |
| `NomeRefeicao` | valor | Nome com validação e formatação |
| `Calorias` | valor | Informação nutricional |
| `DataSemana` | dataInicio | Representa uma semana específica |

🔴 **Violação encontrada:** No seu código, `peso` é um número primitivo solto. Isso é uma **obsessão por tipos primitivos** (primitive obsession — um anti-pattern). Um número "200" sem contexto pode ser 200g, 200ml, 200kcal. Um Value Object `Peso` resolveria isso.

```javascript
// ❌ COMO ESTÁ - primitive obsession
class ItemRefeicao {
  constructor(ingrediente, peso) {
    this.peso = this.validarPeso(peso); // número solto
    // 200 → o que? gramas? ml? unidades?
  }
}

// ✅ COMO DEVERIA SER
class ItemRefeicao {
  constructor(ingrediente, peso) {
    this.ingrediente = ingrediente;
    this.peso = peso; // peso é uma instância de Peso
  }
}

// Uso:
const porcao = new ItemRefeicao(
  new Ingrediente("Arroz"),
  new Peso(200, 'g')
);
console.log(porcao.peso.valor); // 200
console.log(porcao.peso.unidade); // 'g'
```

---

### 3. Agregados e Raiz do Agregado

Um **Agregado** é um grupo de objetos que devem ser tratados como uma unidade. Se você salvar, carregar ou excluir, faz com o agregado inteiro.

**Regra de ouro:** Fora do agregado, você só pode referenciar a **raiz**. Ninguém fora do agregado pode mexer nos objetos internos diretamente.

**Exemplo do mundo real:** Uma árvore. Você pode tocar no tronco (raiz), mas não pode mexer diretamente nas folhas sem passar pelo tronco.

**No seu projeto:**

```
┌──────────────────────────────────────────────┐
│           AGREGADO: PlanoSemanal              │ ← RAIZ
│                                              │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐  │
│  │  Dia 1   │   │  Dia 2   │   │  Dia 7   │  │
│  │ (Segunda)│   │ (Terça)  │   │ (Domingo)│  │
│  │          │   │          │   │          │  │
│  │ Refeicao1│   │ Refeicao1│   │ Refeicao1│  │
│  │  └ Itens │   │  └ Itens │   │  └ Itens │  │
│  │ Refeicao2│   │ Refeicao2│   │ Refeicao2│  │
│  │  └ Itens │   │  └ Itens │   │  └ Itens │  │
│  └──────────┘   └──────────┘   └──────────┘  │
└──────────────────────────────────────────────┘
```

**Quem é a raiz?** `PlanoSemanal` é a raiz do agregado. Para acessar qualquer refeição, você passa pelo plano.

🔴 **Violação encontrada:** No seu código atual, `Dia.refeicoes` é um array público. Qualquer parte do sistema pode fazer `plano.dias[0].refeicoes.push(refeicao)` — isso quebra o encapsulamento do agregado.

```javascript
// ❌ COMO ESTÁ - array público, qualquer um pode modificar
class Dia {
  constructor(nome, id) {
    this.refeicoes = []; // ❌ Público! Nada impede manipulação externa
  }
}

// ✅ COMO DEVERIA SER - encapsulado
class Dia {
  constructor(nome, id) {
    this._refeicoes = []; // Privado por convenção
  }
  
  adicionarRefeicao(refeicao) {
    // Regras de negócio aqui
    if (this._refeicoes.length >= 5) {
      throw new Error("Limite de 5 refeições por dia");
    }
    refeicao.id = this._proximoId();
    this._refeicoes.push(refeicao);
  }
  
  get refeicoes() {
    return [...this._refeicoes]; // Retorna cópia (imutável)
  }
  
  get quantidadeRefeicoes() {
    return this._refeicoes.length;
  }
}
```

---

### 4. Bounded Contexts

**Bounded Context** é uma fronteira explícita dentro da qual um modelo de domínio se aplica. Cada contexto tem sua própria linguagem ubíqua e suas próprias regras.

**Exemplo do mundo real:** A palavra "mouse" significa uma coisa no contexto de informática (dispositivo) e outra completamente diferente no contexto de biologia (animal). Cada contexto tem seu próprio modelo.

**No seu projeto (atual e futuro):**

```
┌──────────────────────┐   ┌──────────────────────┐   ┌──────────────────────┐
│   PLANEJAMENTO       │   │   NUTRIÇÃO           │   │   COMPRAS            │
│                      │   │                      │   │                      │
│ ● Criar plano semanal│   │ ● Calcular calorias  │   │ ● Gerar lista        │
│ ● Adicionar refeições│   │ ● Macronutrientes    │   │ ● Agrupar por setor  │
│ ● Organizar por dia  │   │ ● Metas nutricionais │   │ ● Estimar custo      │
│                      │   │                      │   │                      │
│ Linguagem:           │   │ Linguagem:           │   │ Linguagem:           │
│ "Refeição"           │   │ "Porção"             │   │ "Item de compra"     │
│ "Dia"                │   │ "Calorias"           │   │ "Setor"              │
│ "Ingrediente"        │   │ "Proteínas"          │   │ "Quantidade"         │
│ "Quantidade"         │   │ "Carboidratos"       │   │ "Preço"              │
└──────────────────────┘   └──────────────────────┘   └──────────────────────┘
```

**Por que isso importa:**
- No contexto de **Planejamento**, `Ingrediente` é só um nome com quantidade
- No contexto de **Nutrição**, `Ingrediente` tem calorias, proteínas, carboidratos
- No contexto de **Compras**, `Ingrediente` vira "item de supermercado" com setor e preço

Cada contexto pode ter seu próprio modelo de `Ingrediente`. Eles não precisam ser a mesma classe.

---

### 5. Regras de Negócio

Regras de negócio são as **leis do sistema**. Elas vêm do mundo real, não da tecnologia.

**Regras identificadas no seu domínio:**

| # | Regra | Onde está hoje | Onde DEVERIA estar |
|---|-------|----------------|-------------------|
| 1 | Cada dia pode ter no máximo 5 refeições | `renderizarBotao.js:7` (hardcoded na view) | `Dia.adicionarRefeicao()` (no modelo) |
| 2 | Nome da refeição é obrigatório | `Refeicao.validar()` (correto!) | OK |
| 3 | Peso deve ser número positivo | `ItemRefeicao.validarPeso()` (correto!) | OK |
| 4 | Nome do ingrediente é obrigatório | `Ingrediente.validar()` (correto!) | OK |
| 5 | Uma semana tem exatamente 7 dias | `PlanoSemanal` construtor (correto!) | OK |
| 6 | Refeições não podem ter nomes duplicados (?) | **Não implementada** | Faltando |
| 7 | Ingredientes não podem se repetir na mesma refeição (?) | **Não implementada** | Faltando |

🔴 **Violação ALTA:** Regra #1 está na view (`renderizarBotao.js:7`):

```javascript
// ❌ COMO ESTÁ - regra de negócio na camada de renderização
export function renderizarBotao(dia) {
  const displayDia = document.getElementById(dia.id);
  if (dia.refeicoes.length < 5) {  // 🔴 REGRA AQUI!
    // renderiza botão...
  }
}
```

Isso é grave porque:
- Se a regra mudar (ex: 10 refeições), você precisa alterar a VIEW
- Se outra parte do sistema precisar saber o limite, não tem acesso
- Viola SRP (responsabilidade única) — renderizar botão não deveria saber regras de negócio

```javascript
// ✅ COMO DEVERIA SER - regra no modelo
class Dia {
  constructor(nome, id) {
    this._refeicoes = [];
    this._limiteRefeicoes = 5;
  }
  
  adicionarRefeicao(refeicao) {
    if (this._refeicoes.length >= this._limiteRefeicoes) {
      throw new Error(`Limite de ${this._limiteRefeicoes} refeições por dia`);
    }
    refeicao.id = this._proximoId();
    this._refeicoes.push(refeicao);
  }
  
  get podeAdicionarRefeicao() {
    return this._refeicoes.length < this._limiteRefeicoes;
  }
}

// E na view:
export function renderizarBotao(dia) {
  if (dia.podeAdicionarRefeicao) { // ✅ Pergunta ao modelo
    // renderiza botão...
  }
}
```

---

### 6. Mapas de Contexto

As relações entre Bounded Contexts podem ser representadas em um **Context Map**:

```
┌──────────────┐    Relacionamentos    ┌──────────────┐
│ PLANEJAMENTO │ ◄───── upstream ──── │   NUTRIÇÃO   │
│              │                       │              │
│ (dieta atual)│                       │ (tabela de   │
│              │                       │  composição) │
└──────┬───────┘                       └──────────────┘
       │
       │ downstream
       ▼
┌──────────────┐
│   COMPRAS    │
│              │
│ (lista para  │
│  mercado)    │
└──────────────┘
```

**Explicação:**
- **Upstream** (NUTRIÇÃO) fornece dados para **downstream** (PLANEJAMENTO e COMPRAS)
- Se a tabela nutricional mudar, o planejamento precisa se adaptar
- Mas o planejamento pode existir sem a nutrição (MVP)

---

## 🗺️ Diagrama Completo do Domínio (ASCII)

```
                    ┌─────────────────────────────────────────┐
                    │         BOUNDED CONTEXT                  │
                    │         PLANEJAMENTO ALIMENTAR           │
                    └─────────────────────────────────────────┘
                                                                
 ┌──────────────────────────────────────────────────────────────┐
 │                   AGREGADO PRINCIPAL                         │
 │                                                              │
 │  ┌────────────────────────────────────────────────────────┐  │
 │  │              PlanoSemanal (RAIZ DO AGREGADO)           │  │
 │  │                                                        │  │
 │  │  - dataInicio: Date       (Value Object)              │  │
 │  │  - dataFim: Date          (Value Object)              │  │
 │  │  - usuario: String                                     │  │
 │  │                                                        │  │
 │  │  + adicionarDia(dia)                                   │  │
 │  │  + removerDia(id)                                      │  │
 │  │  + obterDia(id): Dia                                   │  │
 │  │  + gerarListaCompras(): ListaCompras                   │  │
 │  └────────────────────────┬───────────────────────────────┘  │
 │                           │                                   │
 │              ┌────────────┼────────────┐                     │
 │              ▼            ▼            ▼                     │
 │  ┌──────────────────┐ ┌────────────┐ ┌──────────────────┐   │
 │  │  Dia (Entidade)   │ │  ...       │ │  Dia             │   │
 │  │                   │ │           │ │  (Domingo)        │   │
 │  │  - nome: String   │ │           │ │                   │   │
 │  │  - id: String     │ │           │ │                   │   │
 │  │  - _refeicoes: [] │ │           │ │                   │   │
 │  │                   │ │           │ │                   │   │
 │  │  + adicionarRef() │ │           │ │                   │   │
 │  │  + removerRef()   │ │           │ │                   │   │
 │  │  + get refeicoes  │ │           │ │                   │   │
 │  └────────┬──────────┘ └───────────┘ └────────┬──────────┘   │
 │           │                                    │             │
 │           ▼                                    ▼             │
 │  ┌────────────────────────────────────────────────────────┐  │
 │  │           Refeicao (Entidade)                          │  │
 │  │                                                        │  │
 │  │  - id: Number                                           │  │
 │  │  - nome: NomeRefeicao      (Value Object)              │  │
 │  │  - _itens: ItemRefeicao[]                               │  │
 │  │                                                        │  │
 │  │  + adicionarItem(ingrediente, peso)                    │  │
 │  │  + removerItem(id)                                     │  │
 │  │  + get itens                                            │  │
 │  └────────────────────────┬───────────────────────────────┘  │
 │                           │                                   │
 │                           ▼                                   │
 │  ┌────────────────────────────────────────────────────────┐  │
 │  │        ItemRefeicao (Entidade)                          │  │
 │  │                                                        │  │
 │  │  - id: Number                                           │  │
 │  │  - ingrediente: Ingrediente  (ou ValueObject)          │  │
 │  │  - peso: Peso               (Value Object)             │  │
 │  └────────────────────────┬───────────────────────────────┘  │
 │                           │                                   │
 │                           ▼                                   │
 │  ┌────────────────────────────────────────────────────────┐  │
 │  │        Ingrediente (Entidade ou ValueObject?)           │  │
 │  │                                                        │  │
 │  │  - nome: String                                         │  │
 │  │  - categoria: String (futuro)                          │  │
 │  │  - kcal (por 100g): Number (futuro)                    │  │
 │  └────────────────────────────────────────────────────────┘  │
 └──────────────────────────────────────────────────────────────┘
```

---

## 📋 Resumo: Mapeamento DDD para o Projeto

| Conceito DDD | Classe | Tipo | Observação |
|-------------|--------|------|------------|
| Entidade | `PlanoSemanal` | Raiz do Agregado | OK, mas precisa encapsular dias |
| Entidade | `Dia` | Entidade do Agregado | Precisa encapsular refeicoes |
| Entidade | `Refeicao` | Entidade do Agregado | OK |
| Entidade | `ItemRefeicao` | Entidade do Agregado | OK |
| Entidade/ValueObject | `Ingrediente` | **Indefinido** | Hoje é entidade, mas no contexto de planejamento poderia ser Value Object |
| Value Object | `Peso` | **Faltando** | Substituir número primitivo |
| Value Object | `NomeRefeicao` | **Faltando** | Encapsular validação |
| Repositório | `PlanoSemanalRepository` | **Faltando** | Para persistência futura |
| Serviço de Domínio | `ListaComprasService` | **Futuro** | Para gerar lista de compras |
| Serviço de Domínio | `CalculoNutricionalService` | **Futuro** | Para calcular nutrientes |

---

## 🎯 Conclusão da Análise de Domínio

### O que está correto no seu modelo:
1. A hierarquia `PlanoSemanal → Dias → Refeicoes → Itens` está conceitualmente correta
2. As validações básicas existem nos construtores
3. `PlanoSemanal` pré-inicializa os 7 dias (regra de negócio correta)

### O que precisa melhorar:
1. 🔴 **Encapsulamento dos arrays públicos** (`dias`, `refeicoes`, `itens`)
2. 🔴 **Regra de negócio na view** (limite de 5 refeições)
3. 🟡 **Primitive obsession** (peso como número solto)
4. 🟡 **Falta Value Objects** (Peso, NomeRefeicao)
5. 🟢 **Falta Repositório** (para futuro)
6. 🟢 **Bounded Contexts não definidos** (para escalabilidade)

### Próximo documento:
No [documento 02](02-avaliacao-modelagem.md), vamos avaliar a modelagem atual em detalhes, medindo coesão, acoplamento, encapsulamento e identificando violações de SOLID.

---

📖 **Referências para este documento:**
- Evans, Eric. *Domain-Driven Design: Tackling Complexity in the Heart of Software*. 2003. — **O livro que criou DDD. Leia os capítulos 1-6 para fundamentos.**
- Vernon, Vaughn. *Implementing Domain-Driven Design*. 2013. — Versão prática de DDD com exemplos de código.
- Fowler, Martin. *Patterns of Enterprise Application Architecture*. 2003. — Para entender Repository, Service Layer.
- MDN: [Value Objects](https://martinfowler.com/bliki/ValueObject.html) — Martin Fowler sobre Value Objects.