# 07 — Renderização, DOM e Atualizações de Tela

> **Objetivo:** Analisar a renderização atual, manipulação do DOM, atualizações de tela. Explicar re-renderização total, atualização parcial, Virtual DOM, Diffing e Event Delegation. Comparar abordagens com exemplos aplicados ao projeto.

---

## 🧒 O que é Renderização e DOM? (Explicação para criança)

Imagine que você está desenhando um boneco em uma folha de papel. Você desenha a cabeça, os olhos, a boca, o corpo, os braços e as pernas. Esse desenho todo **é a sua página web** (o HTML). O **DOM** (Document Object Model) é como se alguém tirasse uma **fotografia do seu desenho** e transformasse cada parte em um **bloco de LEGO** que você pode mexer separadamente.

Se você quiser mudar a cor do chapéu do boneco, você **não precisa rabiscar o desenho inteiro de novo**. Você simplesmente pega o bloco do chapéu e troca sua cor. No DOM, é a mesma coisa: você pode pegar um elemento específico (como um botão, um texto, uma imagem) e modificá-lo sem precisar recriar a página inteira.

**Renderizar** é o processo de "desenhar" esses blocos na tela. Toda vez que você adiciona um novo bloco, remove ou modifica, o navegador precisa **renderizar** (redesembar) aquela parte.

---

## 🎓 Conceitos Fundamentais (Nível Universitário)

### Re-renderização Total

**O que é:** Limpar todo o conteúdo de um container e recriar tudo do zero.

```javascript
// Re-render total
container.innerHTML = "";      // Limpa tudo
container.appendChild(novo);  // Recria tudo
```

**Vantagens:** Simples de implementar, garante consistência.
**Desvantagens:** Perde estado interno (foco, scroll, animações), ineficiente para grandes listas.

### Atualização Parcial

**O que é:** Modificar apenas os elementos que realmente mudaram, mantendo o resto intacto.

```javascript
// Atualização parcial
const itemExistente = document.getElementById("item-5");
if (itemExistente) {
  itemExistente.textContent = "Novo valor";
} else {
  // Só adiciona se não existir
}
```

**Vantagens:** Performance, preserva estado do DOM (foco, seleção, animações).
**Desvantagens:** Mais código, risco de esquecer de atualizar algo.

### Virtual DOM

**O que é:** Uma representação em memória (como um "rascunho") do DOM real. Você faz as mudanças no rascunho, compara com a versão anterior (diffing), e só aplica as diferenças no DOM real.

**Como surgiu:** Popularizado pelo React (Facebook, 2013). Antes, frameworks como jQuery faziam manipulação direta, que era propensa a erros em aplicações grandes.

```
           Mudança de estado
                   │
                   ▼
         ┌─────────────────┐
         │  Virtual DOM    │ ← Representação em memória
         │  (rascunho)     │
         └────────┬────────┘
                  │ compara (diff)
                  ▼
         ┌─────────────────┐
         │   DOM Real      │ ← Só as diferenças são aplicadas
         └─────────────────┘
```

### Diffing

**O que é:** Algoritmo que compara duas árvores (a versão antiga e a nova do Virtual DOM) e descobre o que mudou: o que foi adicionado, removido ou alterado.

### Event Delegation

**O que é:** Em vez de colocar um evento em cada elemento filho, você coloca **um único evento no elemento pai** e usa a propagação de eventos (bubbling) para detectar qual filho foi clicado.

```javascript
// ❌ SEM DELEGATION: um evento para cada botão
botoes.forEach(btn => btn.addEventListener("click", handler));

// ✅ COM DELEGATION: um evento no pai
container.addEventListener("click", (event) => {
  if (event.target.matches(".adcbtn")) {
    handler(event);
  }
});
```

---

## 💼 Análise da Renderização Atual no Projeto

### Como está hoje:

```
1. main.js chama atualizarKanban(kanban)
         │
         ▼
2. atualizarKanban():
   ├── limparTela(kanban)          → kanban.textContent = ""
   ├── renderizarModal(kanban)     → kanban.innerHTML = HTML dos modais
   └── renderizarSemana(p, kanban) → Adiciona dias ao kanban
         │
         ▼
3. renderizarSemana():
   └── para cada dia:
       renderizarDia(dia, kanban)
         ├── col.innerHTML = ... (título)
         ├── renderizarRefeicoes(dia)
         │   └── cria divs, tabelas, botões
         └── renderizarBotao(dia)
             └── cria botão "+"
```

### 🔴 Bug Crítico 1: `renderizarModal` sobrescreve `kanban.innerHTML`

```javascript
// app/atualizarKanban.js
export function atualizarKanban(kanban) {
  const p = estado.planoSemanal;
  limparTela(kanban);           // kanban.textContent = "" (limpa)
  renderizarModal(kanban);      // kanban.innerHTML = HTML.modal ← SOBRESCREVE!
  renderizarSemana(p, kanban);  // Adiciona dias...
}
```

**O problema:** `renderizarModal` usa `kanban.innerHTML = ...` que **substitui todo o conteúdo** do kanban. Depois, `renderizarSemana` adiciona os dias. O resultado é que ambos convivem, mas se `renderizarSemana` for chamada novamente (ex: ao adicionar refeição), os modais perdem estado ou somem.

**Solução:** Modais devem ser anexados ao `body` ou a um container separado, não ao `kanban`.

```javascript
// ❌ COMO ESTÁ - modal dentro do kanban
renderizarModal(kanban); // kanban.innerHTML = HTML + modal

// ✅ COMO DEVERIA SER - modal no body
function renderizarModal() {
  const existingModal = document.getElementById("myModal1");
  if (!existingModal) {
    document.body.insertAdjacentHTML('beforeend', modalHTML);
  }
}
```

### 🔴 Bug Crítico 2: Dependência circular em `renderizarRefeicoes.js`

```javascript
// render/renderizarRefeicoes.js
import { kanban } from "../main.js";  // 🔴 Importa de main.js
```

`renderizarRefeicoes` importa `kanban` de `main.js`. Mas `main.js` importa `renderizarRefeicoes` indiretamente via `atualizarKanban`. Isso cria uma dependência circular:

```
main.js → app/atualizarKanban.js → render/renderizarRefeicoes.js → main.js
```

**Solução:** Receber `kanban` como parâmetro em vez de importar.

### 🔴 Problema 3: Re-render total destrói estado do DOM

Quando `renderizarRefeicoes` é chamada, ela recria **todas** as divs, tabelas e botões. Isso:
- Perde o estado de "expandido/recolhido" da tabela de itens
- Perde o foco de inputs
- Recria event listeners (vazamento de memória se não limpar os antigos)

```javascript
// ❌ Re-render total
export function renderizarRefeicoes(dia) {
  const displayDia = document.getElementById(dia.id);
  // A função inteira recria TUDO do zero
  // ...
}

// ✅ Abordagem com atualização parcial:
// 1. Separar criação do elemento da lógica de atualização
export class RefeicaoListaView {
  #elementos = new Map(); // cache de elementos por ID
  
  atualizar(dia) {
    // Para cada refeição do dia:
    dia.refeicoes.forEach(ref => {
      if (this.#elementos.has(ref.id)) {
        this.#atualizarExistente(ref);
      } else {
        this.#criarNovo(ref);
      }
    });
    
    // Remover os que não existem mais
    this.#removerExcluidos(dia.refeicoes);
  }
  
  #atualizarExistente(ref) {
    const el = this.#elementos.get(ref.id);
    el.querySelector('p').textContent = ref.nome.toUpperCase();
  }
  
  #criarNovo(ref) {
    const el = this.#criarElemento(ref);
    this.#elementos.set(ref.id, el);
    this.container.appendChild(el);
  }
  
  #removerExcluidos(refeicoes) {
    const idsAtuais = new Set(refeicoes.map(r => r.id));
    this.#elementos.forEach((el, id) => {
      if (!idsAtuais.has(id)) {
        el.remove();
        this.#elementos.delete(id);
      }
    });
  }
}
```

### 🔴 Problema 4: Event listeners dentro da renderização

```javascript
// render/renderizarRefeicoes.js
excbtn.addEventListener("click", () => {
  dia.excluirRefeicao(refDoDia.id);
  renderizarRefeicoes(dia);   // Re-render total
  atualizarKanban(kanban);     // Re-render total DE NOVO
});
```

Ao excluir uma refeição, o código chama `renderizarRefeicoes(dia)` que recria tudo, E depois chama `atualizarKanban(kanban)` que recria TUDO de novo (incluindo os modais). Isso é **dupla re-renderização**.

---

## 🗺️ Diagrama ASCII do Fluxo de Renderização (Atual vs Proposto)

### ATUAL:
```
USUÁRIO CLICA "EXCLUIR" em uma refeição
         │
         ▼
  excbtn click handler
         │
         ├──► dia.excluirRefeicao(id)
         │
         ├──► renderizarRefeicoes(dia)
         │      └── recria TODAS as refeições do dia
         │
         └──► atualizarKanban(kanban)
                ├── limparTela (kanban.textContent = "")
                ├── renderizarModal (kanban.innerHTML = ...)
                └── renderizarSemana (adiciona dias)
                       └── renderizarRefeicoes (recria de novo!)
```

### PROPOSTO:
```
USUÁRIO CLICA "EXCLUIR" em uma refeição
         │
         ▼
  RefeicaoController.excluir(id)
         │
         ├──► dia.excluirRefeicao(id)
         │
         ├──► store.dispatch('REFICAO_EXCLUIDA', { diaId, refId })
         │
         ▼
  Store.notify()
         │
         ├──► SemanaView
         │      └── RefeicaoListaView.atualizar(dia)
         │            └── Só remove o nó DOM da refeição excluída
         │
         └──► PlanoSemanalRepository.salvar(plano)
```

---

## 📊 Tabela Comparativa: Abordagens de Renderização

| Abordagem | Simplicidade | Performance | Manutenção | Preserva Estado | Ideal para |
|-----------|-------------|-------------|------------|-----------------|------------|
| **Re-render total** (innerHTML = "") | 🟢 Alta | 🔴 Baixa | 🟢 Alta | 🔴 Perde tudo | Protótipos, conteúdo pequeno |
| **Atualização parcial** (manipulação direta) | 🟡 Média | 🟢 Alta | 🟡 Média | 🟢 Preserva | Projetos médios, Vanilla JS |
| **Virtual DOM** (React, Vue) | 🟡 Média | 🟢 Alta | 🟢 Alta | 🟢 Preserva | Apps complexos, grandes equipes |
| **Template-based** (lit-html, handlebars) | 🟢 Alta | 🟡 Média | 🟢 Alta | 🟡 Parcial | Apps médios com dados dinâmicos |

---

## ✅ Refatoração Recomendada

### 1. Separar modais do kanban

```javascript
// Em vez de renderizarModal(kanban):
function inicializarModais() {
  // Só cria os modais uma vez, no body
  if (!document.getElementById("myModal1")) {
    document.body.insertAdjacentHTML('beforeend', modal1HTML);
    document.body.insertAdjacentHTML('beforeend', modal2HTML);
  }
}

// Chamado uma única vez na inicialização
inicializarModais();
```

### 2. Event Delegation para todos os cliques

```javascript
// main.js
document.addEventListener('click', (event) => {
  const target = event.target;
  
  if (target.matches('.adcbtn')) {
    const diaId = target.closest('[data-dia-id]').dataset.diaId;
    const dia = store.state.planoSemanal.obterDia(diaId);
    store.dispatch('ABRIR_MODAL_CRIACAO', { dia });
  }
  
  if (target.matches('.excbtnRefeicao')) {
    const refId = Number(target.closest('.refeicao').dataset.refId);
    const diaId = target.closest('[data-dia-id]').dataset.diaId;
    store.dispatch('EXCLUIR_REFICAO', { diaId, refId });
  }
  
  if (target.matches('#submitModel1')) {
    const nome = document.getElementById('nomeRefeicao').value;
    store.dispatch('CRIAR_REFICAO', { nome });
  }
});
```

### 3. View sem dependência de main.js

```javascript
// presentation/views/DiaView.js
export class DiaView {
  constructor(dia) {
    this.dia = dia;
  }
  
  render() {
    const col = document.createElement('div');
    col.id = this.dia.id;
    col.dataset.diaId = this.dia.id;
    col.className = 'dia-coluna';
    
    col.innerHTML = `<div class="titulo"><h4>${this.dia.nome}</h4></div>`;
    
    if (this.dia.podeAdicionarRefeicao) {
      col.insertAdjacentHTML('beforeend', '<button class="adcbtn">+</button>');
    }
    
    return col; // Retorna elemento, não precisa de kanban
  }
}
```

---

## 🎯 Conclusão

### O que seu projeto faz bem:
1. ✅ Já usa **Event Delegation** em `main.js` (ótimo para iniciante!)
2. ✅ Separa renderização em funções específicas (`renderizarDia`, `renderizarRefeicoes`)
3. ✅ Esforço consciente para separar render/ de models/

### O que precisa mudar:
1. 🔴 **Remover modais do kanban** — colocar no body
2. 🔴 **Eliminar dependência circular** — `renderizarRefeicoes` não deve importar `main.js`
3. 🟡 **Evitar re-render duplicado** — `excluirRefeicao` chama render duas vezes
4. 🟡 **Migrar para atualização parcial** — cache de elementos para evitar recriação total
5. 🟢 **Melhorar Event Delegation** — usar `matches()` em vez de `id ===`

### Virtual DOM é necessário?
Para o tamanho atual do projeto: **não**. Virtual DOM vale a pena quando você tem centenas de elementos que mudam frequentemente. Para seu kanban com ~35 refeições, **atualização parcial bem feita** é mais que suficiente.

---

📖 **Referências:**
- MDN: [Document Object Model (DOM)](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model)
- MDN: [Event Delegation](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#event_delegation)
- MDN: [insertAdjacentHTML](https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentHTML)
- React: [Virtual DOM](https://reactjs.org/docs/faq-internals.html) — Documentação oficial explicando Virtual DOM
- Wilson, E. *The InnerHTML Apocalypse*. 2015. — Artigo sobre performance de innerHTML vs manipulação direta

Próximo: [08 — Escalabilidade](08-escalabilidade.md)