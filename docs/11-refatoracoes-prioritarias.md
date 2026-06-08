# 11 — Refatorações Prioritárias (Top 20)

> **Objetivo:** Listar os 20 problemas mais importantes encontrados no projeto, ordenados por prioridade. Cada item com gravidade, impacto, complexidade da correção e benefício esperado.

---

## 🧒 O que são Refatorações Prioritárias?

Refatoração é como arrumar o quarto: você tira o que está fora do lugar, joga fora o que não serve, organiza as gavetas. Mas você não precisa arrumar TUDO de uma vez — você faz primeiro o que está mais bagunçado.

Esta lista organiza os problemas do MAIS urgente ao MENOS urgente.

---

## 🎓 Critérios de Priorização

| Critério | O que mede | Escala |
|----------|-----------|--------|
| **Gravidade** | Quão grave é o problema | 🔴 Alta / 🟡 Média / 🟢 Baixa |
| **Impacto** | Quantas partes do sistema afeta | 🔴 Alto / 🟡 Médio / 🟢 Baixo |
| **Complexidade** | Quanto trabalho para corrigir | 🔴 Alta / 🟡 Média / 🟢 Baixa |
| **Benefício** | O que melhora ao corrigir | 🔴 Alto / 🟡 Médio / 🟢 Baixo |

---

## 💼 Top 20 Problemas

---

### #1 🔴 Persistência Inexistente

| Critério | Valor |
|----------|-------|
| **Gravidade** | 🔴 Alta |
| **Impacto** | 🔴 Alto — Todos os dados são perdidos |
| **Complexidade** | 🟡 Média |
| **Benefício** | 🔴 Alto — Dados salvos entre sessões |

**Descrição:** Nenhum dado é salvo. Ao recarregar a página, todo o plano semanal é perdido.

**Onde:** N/A — funcionalidade ausente

**Solução:** Criar `PlanoSemanalRepository` com `salvar()` e `carregar()`, serializando/desserializando para LocalStorage. Chamar `salvar()` ao finalizar refeição e `carregar()` na inicialização.

**Código mínimo:**
```javascript
// Chamar no main.js
const repo = new PlanoSemanalRepository(localStorage);
repo.salvar(planoSemanal); // ao finalizar
const plano = repo.carregar() || new PlanoSemanal(); // ao iniciar
```

---

### #2 🔴 Dependência Circular (render/ → main.js)

| Critério | Valor |
|----------|-------|
| **Gravidade** | 🔴 Alta |
| **Impacto** | 🟡 Médio — Pode causar bugs de importação |
| **Complexidade** | 🟢 Baixa |
| **Benefício** | 🟡 Médio — Código mais previsível |

**Descrição:** `render/renderizarRefeicoes.js` importa `kanban` de `main.js`, criando dependência circular.

**Onde:** `render/renderizarRefeicoes.js:4`

**Solução:** Receber `kanban` como parâmetro em vez de importar.

```javascript
// ❌ Atual
import { kanban } from "../main.js";

// ✅ Correto
export function renderizarRefeicoes(dia, kanban) {
  // kanban recebido como parâmetro
}
```

---

### #3 🔴 SRP Violado em ui/refeicaoForm.js

| Critério | Valor |
|----------|-------|
| **Gravidade** | 🔴 Alta |
| **Impacto** | 🔴 Alto — Dificulta manutenção |
| **Complexidade** | 🟡 Média |
| **Benefício** | 🔴 Alto — Código organizado e testável |

**Descrição:** `criarRefeicao()` faz 6 coisas diferentes: lê DOM, cria modelo, manipula estado, renderiza, navega modal, trata erro.

**Onde:** `ui/refeicaoForm.js:9-25`

**Solução:** Separar em:
1. `RefeicaoController.criarRefeicao(nome)` — lógica
2. `RefeicaoView.handleSubmit()` — DOM + render

---

### #4 🔴 Arrays Públicos em Todos os Models

| Critério | Valor |
|----------|-------|
| **Gravidade** | 🔴 Alta |
| **Impacto** | 🔴 Alto — Dados podem ser corrompidos |
| **Complexidade** | 🟡 Média |
| **Benefício** | 🔴 Alto — Integridade dos dados |

**Descrição:** `dias`, `refeicoes` e `itens` são arrays públicos. Qualquer código pode modificá-los sem passar pelos métodos.

**Onde:** `PlanoSemanal.dias`, `Dia.refeicoes`, `Refeicao.itens`

**Solução:** Usar campos privados `#` com getters que retornam cópia:

```javascript
class Dia {
  #refeicoes = [];
  get refeicoes() { return [...this.#refeicoes]; }
}
```

---

### #5 🟡 ItemRefeicao com Tipo Duplo (string ou objeto)

| Critério | Valor |
|----------|-------|
| **Gravidade** | 🟡 Média |
| **Impacto** | 🟡 Médio — Renderização precisa adivinhar tipo |
| **Complexidade** | 🟢 Baixa |
| **Benefício** | 🟡 Médio — Código consistente |

**Descrição:** `ItemRefeicao.ingrediente` pode ser string OU objeto Ingrediente. A view precisa fazer `typeof` para decidir como exibir.

**Onde:** `models/ItemRefeicao.js:3-7`, `render/renderizarItemRefeicao.js:33`

**Solução:** Forçar que `ingrediente` seja sempre uma instância de `Ingrediente`:

```javascript
constructor(ingrediente, peso) {
  if (!(ingrediente instanceof Ingrediente)) {
    throw new Error('ingrediente deve ser uma instância de Ingrediente');
  }
  this.#ingrediente = ingrediente;
}
```

---

### #6 🟡 Regra de Negócio na View (limite 5 refeições)

| Critério | Valor |
|----------|-------|
| **Gravidade** | 🟡 Média |
| **Impacto** | 🟡 Médio — Regra não está no modelo |
| **Complexidade** | 🟢 Baixa |
| **Benefício** | 🟡 Médio — Centralização de regras |

**Onde:** `render/renderizarBotao.js:7`

**Solução:** Mover para `Dia`:

```javascript
get podeAdicionarRefeicao() {
  return this.#refeicoes.length < this.#limiteRefeicoes;
}
```

---

### #7 🟡 Bug: renderizarModal Sobrescreve kanban.innerHTML

| Critério | Valor |
|----------|-------|
| **Gravidade** | 🟡 Média |
| **Impacto** | 🟡 Médio — Modais podem sumir |
| **Complexidade** | 🟢 Baixa |
| **Benefício** | 🟡 Médio — Comportamento correto |

**Onde:** `render/renderizarModal.js:3`

**Solução:** Anexar modais ao `body`, não ao `kanban`.

---

### #8 🟡 subscribe/notify Nunca é Chamado (Observer Morto)

| Critério | Valor |
|----------|-------|
| **Gravidade** | 🟡 Média |
| **Impacto** | 🟡 Médio — Código preparado mas não usado |
| **Complexidade** | 🟢 Baixa |
| **Benefício** | 🟡 Médio — Reatividade real |

**Onde:** `app/estados.js:20-25`

**Solução:** Views devem chamar `estado.subscribe(callback)`.

---

### #9 🟡 ID Frágil (Date.now() + Math.random())

| Critério | Valor |
|----------|-------|
| **Gravidade** | 🟡 Média |
| **Impacto** | 🟡 Médio — Possível conflito |
| **Complexidade** | 🟢 Baixa |
| **Benefício** | 🟢 Baixo — Correção simples |

**Onde:** `models/ItemRefeicao.js:9`

**Solução:** Usar `crypto.randomUUID()`:

```javascript
this.#id = crypto.randomUUID();
```

---

### #10 🟡 Primitive Obsession (peso como número solto)

| Critério | Valor |
|----------|-------|
| **Gravidade** | 🟡 Média |
| **Impacto** | 🟡 Médio — Perda de contexto (gramas? ml?) |
| **Complexidade** | 🟡 Média |
| **Benefício** | 🟡 Médio — Clareza |

**Onde:** `models/ItemRefeicao.js`, `models/ItemRefeicao.validarPeso()`

**Solução:** Criar Value Object `Peso`:

```javascript
class Peso {
  #valor;
  #unidade;
  constructor(valor, unidade = 'g') { ... }
}
```

---

### #11 🟡 Efeito Colateral em Dia.adicionarRefeicao()

| Critério | Valor |
|----------|-------|
| **Gravidade** | 🟡 Média |
| **Impacto** | 🟡 Médio — Modifica objeto externo |
| **Complexidade** | 🟢 Baixa |
| **Benefício** | 🟢 Baixo — Código mais previsível |

**Onde:** `models/Dia.js:11` — `refeicao.id = this.proxId`

**Solução:** Atribuir ID internamente ou receber refeição com ID já definido.

---

### #12 🟡 Re-render Duplicado ao Excluir Refeição

| Critério | Valor |
|----------|-------|
| **Gravidade** | 🟡 Média |
| **Impacto** | 🟢 Baixo — Performance |
| **Complexidade** | 🟢 Baixa |
| **Benefício** | 🟢 Baixo — Evita trabalho dobrado |

**Onde:** `render/renderizarRefeicoes.js:26-28`

**Solução:** O handler de excluir chama `renderizarRefeicoes` E `atualizarKanban`. Remover um dos dois.

---

### #13 🟡 validarPeso Compara == "" Após Number()

| Critério | Valor |
|----------|-------|
| **Gravidade** | 🟡 Média |
| **Impacto** | 🟢 Baixo — Bug silencioso |
| **Complexidade** | 🟢 Baixa |
| **Benefício** | 🟢 Baixo — Correção de bug |

**Onde:** `models/ItemRefeicao.js:13` — `peso == ""`

**Solução:** Remover comparação desnecessária:

```javascript
validarPeso(peso) {
  const p = Number(peso);
  if (isNaN(p) || p <= 0) throw new Error("Peso inválido");
  return p;
}
```

---

### #14 🟡 Calorias Default 0 (não deveria ser null?)

| Critério | Valor |
|----------|-------|
| **Gravidade** | 🟢 Baixa |
| **Impacto** | 🟢 Baixo |
| **Complexidade** | 🟢 Baixa |
| **Benefício** | 🟢 Baixo |

**Onde:** `models/Ingrediente.js:2` — `calorias = 0`

**Solução:** Usar `null` como default para distinguir "não informado" de "zero calorias".

---

### #15 🟡 Falta Value Object NomeRefeicao

| Critério | Valor |
|----------|-------|
| **Gravidade** | 🟢 Baixa |
| **Impacto** | 🟢 Baixo |
| **Complexidade** | 🟡 Média |
| **Benefício** | 🟢 Baixo |

**Descrição:** Validação de nome está solta em `Refeicao.validar()`.

**Solução:** Criar Value Object:

```javascript
class NomeRefeicao {
  #valor;
  constructor(valor) {
    if (!valor || valor.trim().length === 0) throw new Error("Nome obrigatório");
    this.#valor = valor.trim();
  }
  get valor() { return this.#valor; }
}
```

---

### #16 🟡 Falta Cópia Defensiva em PlanoSemanal.dias

| Critério | Valor |
|----------|-------|
| **Gravidade** | 🟡 Média |
| **Impacto** | 🟡 Médio |
| **Complexidade** | 🟢 Baixa |
| **Benefício** | 🟢 Baixo |

**Onde:** `models/PlanoSemanal.js`

**Solução:** Adicionar getter com cópia:

```javascript
get dias() { return [...this.#dias]; }
```

---

### #17 🟢 Modal na Camada Errada (render/ em vez de presentation/)

| Critério | Valor |
|----------|-------|
| **Gravidade** | 🟢 Baixa |
| **Impacto** | 🟢 Baixo |
| **Complexidade** | 🟢 Baixa |
| **Benefício** | 🟢 Baixo |

**Descrição:** `renderizarModal.js` está em `render/`, mas deveria estar em `presentation/views/` na nova estrutura.

---

### #18 🟢 Event Listeners Criados a Cada Renderização

| Critério | Valor |
|----------|-------|
| **Gravidade** | 🟢 Baixa |
| **Impacto** | 🟢 Baixo — Vazamento de memória em apps pequenos é mínimo |
| **Complexidade** | 🟡 Média |
| **Benefício** | 🟢 Baixo |

**Onde:** `render/renderizarRefeicoes.js:26-28`

**Solução:** Usar Event Delegation em vez de adicionar listeners em cada render.

---

### #19 🟢 Falta Testabilidade (DOM acoplado)

| Critério | Valor |
|----------|-------|
| **Gravidade** | 🟢 Baixa |
| **Impacto** | 🟡 Médio — Difícil de testar |
| **Complexidade** | 🟡 Média |
| **Benefício** | 🟡 Médio — Código testável |

**Descrição:** Funções acessam `document.getElementById` diretamente, impossibilitando testes unitários sem DOM.

**Solução:** Injetar dependências (receber elementos como parâmetros).

---

### #20 🟢 Código Morto: Comentários e Console.log

| Critério | Valor |
|----------|-------|
| **Gravidade** | 🟢 Baixa |
| **Impacto** | 🟢 Baixo |
| **Complexidade** | 🟢 Baixa |
| **Benefício** | 🟢 Baixo |

**Onde:** Vários arquivos (`console.log("deu bom")`, `console.log("fui clicado")`)

**Solução:** Remover `console.log` de produção.

---

## 📊 Tabela Resumo

| # | Problema | Gravidade | Impacto | Complexidade | Benefício |
|---|----------|-----------|---------|-------------|-----------|
| 1 | Persistência inexistente | 🔴 | 🔴 | 🟡 | 🔴 |
| 2 | Dependência circular | 🔴 | 🟡 | 🟢 | 🟡 |
| 3 | SRP violado em ui/ | 🔴 | 🔴 | 🟡 | 🔴 |
| 4 | Arrays públicos | 🔴 | 🔴 | 🟡 | 🔴 |
| 5 | Tipo duplo ItemRefeicao | 🟡 | 🟡 | 🟢 | 🟡 |
| 6 | Regra na view (limite) | 🟡 | 🟡 | 🟢 | 🟡 |
| 7 | Modal sobrescreve kanban | 🟡 | 🟡 | 🟢 | 🟡 |
| 8 | Observer morto | 🟡 | 🟡 | 🟢 | 🟡 |
| 9 | ID frágil | 🟡 | 🟡 | 🟢 | 🟢 |
| 10 | Primitive obsession (peso) | 🟡 | 🟡 | 🟡 | 🟡 |
| 11 | Efeito colateral | 🟡 | 🟡 | 🟢 | 🟢 |
| 12 | Re-render duplicado | 🟡 | 🟢 | 🟢 | 🟢 |
| 13 | Bug validarPeso | 🟡 | 🟢 | 🟢 | 🟢 |
| 14 | Calorias default 0 | 🟢 | 🟢 | 🟢 | 🟢 |
| 15 | Falta NomeRefeicao VO | 🟢 | 🟢 | 🟡 | 🟢 |
| 16 | Cópia defensiva | 🟡 | 🟡 | 🟢 | 🟢 |
| 17 | Modal camada errada | 🟢 | 🟢 | 🟢 | 🟢 |
| 18 | Listeners na render | 🟢 | 🟢 | 🟡 | 🟢 |
| 19 | Testabilidade | 🟢 | 🟡 | 🟡 | 🟡 |
| 20 | Código morto | 🟢 | 🟢 | 🟢 | 🟢 |

---

## 🎯 Plano de Ação (Ordem Recomendada)

### Semana 1 — 🔴 Urgente (itens 1-4)
1. Criar `PlanoSemanalRepository` (persistência)
2. Encapsular arrays: `#dias`, `#refeicoes`, `#itens`
3. Remover dependência circular (kanban como parâmetro)
4. Separar `ui/refeicaoForm.js` em Controller + View

### Semana 2 — 🟡 Importante (itens 5-10)
5. Corrigir tipo duplo em `ItemRefeicao`
6. Mover limite de refeições para `Dia`
7. Separar modais do kanban (anexar ao body)
8. Ativar subscribe/notify no StateManager
9. Substituir ID por `crypto.randomUUID()`
10. Criar Value Object `Peso`

### Semana 3 — 🟡 Desejável (itens 11-16)
11. Eliminar efeito colateral em `adicionarRefeicao`
12. Corrigir re-render duplicado
13. Corrigir `validarPeso`
14. Ajustar default de calorias
15. Criar Value Object `NomeRefeicao`
16. Adicionar cópia defensiva nos getters

### Semana 4 — 🟢 Bônus (itens 17-20)
17. Reorganizar pastas (estrutura intermediária)
18. Migrar para Event Delegation completo
19. Injetar dependências para testabilidade
20. Limpar código morto

---

📖 **Referências:**
- Fowler, Martin. *Refactoring: Improving the Design of Existing Code*. 2ª ed. 2018. — Capítulo 3 (Bad Smells), Capítulo 6-12 (Técnicas)
- Feathers, Michael. *Working Effectively with Legacy Code*. 2004. — Técnicas para código existente
- Martin, Robert C. *Clean Code*. 2008. — Capítulo 17 (Code Smells)

Próximo: [12 — Revisão Profissional](12-revisao-profissional.md)