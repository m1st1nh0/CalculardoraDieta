# 08 — Escalabilidade: Preparando o Projeto para o Futuro

> **Objetivo:** Analisar como as decisões atuais impactam a implementação de funcionalidades futuras. Identificar o que precisa ser refatorado agora, o que pode esperar, e classificar riscos.

---

## 🧒 O que é Escalabilidade? (Explicação para criança)

Imagine que você tem uma caixa de brinquedos pequena. Hoje cabem 5 brinquedos. Mas você sabe que vai ganhar mais 20 brinquedos no Natal. Se você não arrumar a caixa agora, os brinquedos novos vão ficar amontoados, alguns vão quebrar, e você não vai conseguir encontrar o que quer.

**Escalabilidade** é preparar o sistema para crescer sem precisar reconstruir tudo do zero.

No seu projeto, escalabilidade significa: "Se eu adicionar lista de compras, histórico, cadastro de ingredientes e nutrição, o código atual vai suportar ou vai quebrar?"

---

## 🎓 Escalabilidade em Frontend (Nível Universitário)

Escalabilidade em frontend tem várias dimensões:

| Dimensão | Pergunta | No seu projeto |
|----------|----------|----------------|
| **Código** | Adicionar nova feature requer modificar muito código existente? | 🟡 Médio |
| **Dados** | O modelo de dados suporta novos campos sem quebrar? | 🟡 Médio |
| **Estado** | O gerenciamento de estado escala com mais entidades? | 🔴 Ruim |
| **Equipe** | Outra pessoa entenderia o código rapidamente? | 🟡 Médio |
| **Performance** | O sistema continua rápido com 10x mais dados? | 🟢 Bom |

**Os dois maiores vilões da escalabilidade:**
1. **Acoplamento forte** — uma classe depende de detalhes internos de outra
2. **Responsabilidades misturadas** — uma função faz 5 coisas diferentes

---

## 💼 Análise de Features Futuras

### 1. 🛒 Lista de Compras Automática

**O que é:** Sistema que percorre todas as refeições da semana, agrupa ingredientes iguais e gera uma lista única.

**Decisão atual que pode causar problema:**
- `ItemRefeicao.ingrediente` pode ser string OU objeto (dualidade de tipo)
- Ingrediente "Arroz" escrito de formas diferentes ("arroz", "Arroz", "ARROZ") não serão agrupados

**Risco:** 🟡 **Médio**

**O que fazer AGORA:**
```javascript
// Normalizar nome do ingrediente (letra maiúscula, sem espaços)
class Ingrediente {
  #nome;
  
  constructor(nome) {
    this.#nome = this.#normalizar(nome);
  }
  
  #normalizar(nome) {
    return nome.trim().toLowerCase();
  }
  
  equals(outro) {
    return this.#nome === outro.nome;
  }
}
```

**O que fazer DEPOIS:**
- Criar `ListaComprasService` que recebe `PlanoSemanal` e retorna lista agrupada
- Adicionar campo `categoria` em `Ingrediente` (hortifrúti, laticínios, carnes...)

---

### 2. 📦 Cadastro de Ingredientes

**O que é:** Banco de ingredientes pré-cadastrados com nome, categoria, informações nutricionais.

**Decisão atual que pode causar problema:**
- `Ingrediente` hoje é criado via `new Ingrediente(nome)` — sem ID único
- Não há repositório para ingredientes

**Risco:** 🟡 **Médio**

**Solução:** Criar `IngredienteRepository` com um catálogo base:

```javascript
class IngredienteRepository {
  #ingredientes = new Map();
  
  constructor() {
    // Catálogo base
    this.#adicionarBase();
  }
  
  #adicionarBase() {
    this.#ingredientes.set('arroz', new Ingrediente('Arroz', 130));
    this.#ingredientes.set('frango', new Ingrediente('Frango', 165));
    this.#ingredientes.set('brócolis', new Ingrediente('Brócolis', 34));
  }
  
  buscarPorNome(nome) {
    return this.#ingredientes.get(nome.toLowerCase().trim());
  }
  
  cadastrar(ingrediente) {
    if (this.#ingredientes.has(ingrediente.nome.toLowerCase())) {
      throw new Error('Ingrediente já cadastrado');
    }
    this.#ingredientes.set(ingrediente.nome.toLowerCase(), ingrediente);
  }
}
```

---

### 3. 🍽️ Banco de Refeições Reutilizáveis

**O que é:** Refeições prontas que o usuário pode arrastar para o dia ("Café da manhã padrão", "Pré-treino").

**Decisão atual que pode causar problema:**
- Acoplamento entre criação de refeição e UI (`ui/refeicaoForm.js` faz tudo)
- Sem uma forma de "clonar" refeição

**Risco:** 🔴 **Alto**

**Solução:** Criar `RefeicaoFactory` e permitir clonagem:

```javascript
class RefeicaoFactory {
  static criarPadrao(tipo) {
    const receitas = {
      'cafe-manha': () => {
        const r = new Refeicao('Café da manhã');
        r.adicionarItem(new Ingrediente('Pão'), 50);
        r.adicionarItem(new Ingrediente('Manteiga'), 10);
        r.adicionarItem(new Ingrediente('Café'), 200);
        return r;
      },
      'almoco': () => {
        const r = new Refeicao('Almoço');
        r.adicionarItem(new Ingrediente('Arroz'), 150);
        r.adicionarItem(new Ingrediente('Frango'), 200);
        r.adicionarItem(new Ingrediente('Salada'), 100);
        return r;
      }
    };
    return receitas[tipo]?.() ?? null;
  }
  
  static clonar(refeicao) {
    const clone = new Refeicao(refeicao.nome + ' (cópia)');
    refeicao.itens.forEach(item => {
      clone.adicionarItem(item.ingrediente, item.peso);
    });
    return clone;
  }
}
```

---

### 4. 📜 Histórico de Planos

**O que é:** Salvar planos de semanas anteriores e poder consultar/reutilizar.

**Decisão atual que pode causar problema:**
- Sem persistência alguma (dados morrem ao recarregar)
- `PlanoSemanal` não tem data associada

**Risco:** 🔴 **Alto**

**O que fazer AGORA:**
```javascript
// Adicionar data ao PlanoSemanal
class PlanoSemanal {
  constructor(dataInicio = new Date()) {
    this.#dataInicio = dataInicio;
    // ...
  }
  
  get dataInicio() { return this.#dataInicio; }
  get semana() { 
    return `${this.#dataInicio.toLocaleDateString()} - ${this.#fim().toLocaleDateString()}`;
  }
}
```

**O que fazer DEPOIS:**
- `PlanoSemanalRepository` com `listarHistorico()`, `carregarPorData(data)`
- Limitar a N planos salvos para não lotar LocalStorage

---

### 5. 📊 Informações Nutricionais

**O que é:** Calcular calorias, proteínas, carboidratos, gorduras por refeição e por dia.

**Decisão atual que pode causar problema:**
- `Ingrediente` tem campo `calorias` mas não tem macronutrientes
- Sem uma estratégia para calcular totais

**Risco:** 🟡 **Médio**

**Solução com Strategy Pattern:**

```javascript
// Diferentes estratégias de cálculo
class CalculoNutricaoPadrao {
  calcular(ingrediente, peso) {
    return {
      calorias: (ingrediente.caloriasPor100g || 0) * peso / 100,
      proteinas: (ingrediente.proteinasPor100g || 0) * peso / 100,
      carboidratos: (ingrediente.carboidratosPor100g || 0) * peso / 100,
    };
  }
}

class Refeicao {
  calcularNutricao(estrategia) {
    return this.#itens.reduce((total, item) => {
      const nutri = estrategia.calcular(item.ingrediente, item.peso.valor);
      return {
        calorias: total.calorias + nutri.calorias,
        proteinas: total.proteinas + nutri.proteinas,
        carboidratos: total.carboidratos + nutri.carboidratos,
      };
    }, { calorias: 0, proteinas: 0, carboidratos: 0 });
  }
}
```

---

### 6. 📄 Exportação PDF

**O que é:** Gerar um PDF com o plano semanal para imprimir ou compartilhar.

**Decisão atual que pode causar problema:**
- Nenhum problema grave — é uma feature independente

**Risco:** 🟢 **Baixo**

**Solução:** Adapter Pattern para diferentes formatos:

```javascript
class ExportadorPDF {
  exportar(plano) {
    // Usar biblioteca como jsPDF
    const doc = new jsPDF();
    // ... gerar PDF
    return doc;
  }
}

class ExportadorCSV {
  exportar(plano) {
    // Gerar CSV para Excel
    return csvContent;
  }
}

// Uso
const exportador = new ExportadorPDF();
const pdf = exportador.exportar(plano);
```

---

### 7. 💾 Persistência (LocalStorage)

**O que é:** Salvar dados no navegador para não perder ao recarregar.

**Decisão atual que pode causar problema:**
- 🔴 **NÃO EXISTE PERSISTÊNCIA.** Dados são perdidos ao recarregar.
- Classes usam IDs locais (`proxId`) que não sobrevivem à serialização
- Objetos não são serializáveis facilmente (campos privados)

**Risco:** 🔴 **Alto (P0 — Urgente)**

**O que fazer AGORA:**

```javascript
// infrastructure/repositories/PlanoSemanalRepository.js
export class PlanoSemanalRepository {
  constructor(storage = localStorage) {
    this.storage = storage;
    this.chave = 'planoSemanal';
  }
  
  salvar(plano) {
    const dados = this.#serializar(plano);
    this.storage.setItem(this.chave, JSON.stringify(dados));
  }
  
  carregar() {
    const raw = this.storage.getItem(this.chave);
    return raw ? this.#hidratar(JSON.parse(raw)) : null;
  }
  
  #serializar(plano) {
    return {
      dataInicio: plano.dataInicio.toISOString(),
      dias: plano.dias.map(dia => ({
        nome: dia.nome,
        id: dia.id,
        refeicoes: dia.refeicoes.map(ref => ({
          id: ref.id,
          nome: ref.nome,
          itens: ref.itens.map(item => ({
            id: item.id,
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
      if (dia) {
        diaDTO.refeicoes.forEach(refDTO => {
          const ref = new Refeicao(refDTO.nome);
          refDTO.itens.forEach(itemDTO => {
            const ing = new Ingrediente(itemDTO.ingrediente);
            ref.adicionarItem(ing, itemDTO.peso);
          });
          dia.adicionarRefeicao(ref);
        });
      }
    });
    return plano;
  }
}
```

---

### 8. 👥 Multiusuário (Hipotético)

**O que é:** Vários usuários com planos separados, talvez com login.

**Decisão atual que pode causar problema:**
- Estado global único (`estado`) — não suporta múltiplos contextos
- Sem conceito de "usuário" ou "autenticação"

**Risco:** 🟢 **Baixo (para agora)** — é uma feature distante

**O que NÃO fazer agora:**
- Não crie sistema de login agora (YAGNI — You Ain't Gonna Need It)
- Mas mantenha o código desacoplado para facilitar no futuro

---

## 📊 Matriz de Riscos

| Feature | Risco | Urgência | Impacto | Prioridade |
|---------|-------|----------|---------|------------|
| 💾 Persistência (LocalStorage) | 🔴 Alto | Agora | Dados perdidos | **P0 — Urgente** |
| 🍽️ Refeições reutilizáveis | 🔴 Alto | V2 | Requer refatoração grande | P1 |
| 📜 Histórico de planos | 🔴 Alto | V2 | Requer persistência primeiro | P1 |
| 🛒 Lista de compras | 🟡 Médio | V2 | Agrupamento de ingredientes | P2 |
| 📦 Cadastro de ingredientes | 🟡 Médio | V2 | Repositório + catálogo | P2 |
| 📊 Informações nutricionais | 🟡 Médio | V3 | Strategy Pattern | P3 |
| 📄 Exportação PDF | 🟢 Baixo | V3 | Feature independente | P3 |
| 👥 Multiusuário | 🟢 Baixo | V4 | Muito distante | P4 |

---

## 🎯 Recomendações por Versão

### V1 (MVP — Agora)
**O que implementar:**
- ✅ Persistência LocalStorage (Repository Pattern)
- ✅ Normalizar nomes de ingredientes (para agrupamento futuro)
- ✅ Value Objects (Peso, NomeRefeicao) para dados consistentes

**O que refatorar:**
- ✅ Remover dependência circular (render/ → main.js)
- ✅ Encapsular arrays públicos (campos privados #)
- ✅ Separar SRP em ui/refeicaoForm.js

### V2 (Próximas features)
**O que implementar:**
- ✅ Lista de compras automática
- ✅ Cadastro de ingredientes (com repositório)
- ✅ Banco de refeições reutilizáveis (Factory + clone)

**O que refatorar:**
- ✅ Repository para persistência avançada
- ✅ Strategy para cálculos nutricionais

### V3 (Evolução)
**O que implementar:**
- ✅ Informações nutricionais
- ✅ Histórico de planos
- ✅ Exportação PDF/CSV

### V4 (Arquitetura Avançada)
**O que implementar:**
- ✅ Módulos separados por Bounded Context
- ✅ Event Bus para comunicação entre módulos
- ✅ Possível migração para TypeScript ou framework

---

## 🎯 Conclusão

### Regra de ouro para escalabilidade:

```
Hoje            →   Amanhã
────────────────────────────────────
Código acoplado →   Código modular
Estado global   →   Store + subscribe
Models públicos →   Models encapsulados
Sem persistência →  Repository
Funções faz-tudo →  Controller + View
```

### O que NÃO fazer:
- ❌ Não adicione features complexas antes de ter persistência
- ❌ Não crie abstrações para tudo (YAGNI)
- ❌ Não migre para framework só por "escalabilidade"

### O que fazer AGORA:
- 🔴 **Persistência LocalStorage** — o mais urgente
- 🔴 **Encapsulamento** — privar arrays e criar getters
- 🟡 **Value Objects** — Peso, NomeRefeicao
- 🟡 **Repository Pattern** — preparar o terreno para persistência

---

📖 **Referências:**
- Fowler, Martin. *Refactoring: Improving the Design of Existing Code*. 2ª ed. 2018. — Capítulo 3: Bad Smells (para identificar problemas de escalabilidade)
- Martin, Robert C. *Clean Architecture*. 2017. — Capítulo 2: Dois valores do software (comportamento + estrutura)
- Hunt, Andrew; Thomas, David. *The Pragmatic Programmer*. 2ª ed. 2019. — Dica 1: "Cuidado com o seu conhecimento" (YAGNI, DRY, etc.)
- Feathers, Michael. *Working Effectively with Legacy Code*. 2004. — Técnicas para refatorar código existente

Próximo: [09 — Design Patterns](09-design-patterns.md)