# 05 — Estrutura de Pastas

> **Objetivo:** Avaliar a estrutura atual de pastas, propor estruturas profissional para JavaScript Vanilla, explicar detalhadamente a função de cada pasta, e comparar estruturas mínima, intermediária e avançada.

---

## 🧒 O que é Estrutura de Pastas? (Explicação para criança)

Imagine que você tem um quarto. Se você joga tudo no chão — roupa, brinquedo, livro, lápis — fica difícil encontrar o que precisa. Agora imagine que você tem gavetas: uma para roupa, outra para brinquedo, uma estante para livros, um estojo para lápis. Fica muito mais fácil arrumar e encontrar as coisas.

Estrutura de pastas é exatamente isso: organizar os arquivos do projeto em "gavetas" (pastas) para que você e outras pessoas encontrem o que precisam rapidamente.

---

## 🎓 Por que Estrutura de Pastas é Importante? (Nível Universitário)

Uma boa estrutura de pastas:

1. **Comunica a arquitetura** — olhando as pastas, alguém entende como o sistema é organizado
2. **Separa responsabilidades** — cada pasta tem um propósito claro
3. **Facilita navegação** — você sabe onde procurar cada coisa
4. **Escala com o projeto** — adicionar novas funcionalidades não vira bagunça
5. **Impõe disciplina** — a estrutura força boas práticas

Critérios para avaliar uma estrutura:

| Critério | O que mede | Pergunta |
|----------|-----------|----------|
| **Intuitividade** | É fácil de entender? | "Onde colocaria um novo arquivo?" |
| **Separação** | Responsabilidades estão claras? | "O que vai em cada pasta?" |
| **Escalabilidade** | Cresce sem bagunçar? | "Adicionar feature X vai exigir reorg?" |
| **Consistência** | Segue um padrão? | "Todas as pastas seguem mesma lógica?" |

---

## 💼 Avaliação da Estrutura Atual

### Como está hoje:

```
CalculadoraDieta/
├── index.html
├── main.js
├── styles.css
├── normalize.css
├── README.md
├── app/
│   ├── estados.js
│   ├── atualizarKanban.js
│   └── limparTela.js
├── models/
│   ├── Dia.js
│   ├── Ingrediente.js
│   ├── ItemRefeicao.js
│   ├── PlanoSemanal.js
│   └── Refeicao.js
├── render/
│   ├── renderizarBotao.js
│   ├── renderizarDia.js
│   ├── renderizarItemRefeicao.js
│   ├── renderizarModal.js
│   ├── renderizarRefeicoes.js
│   └── renderizarSemana.js
├── ui/
│   ├── modal.js
│   └── refeicaoForm.js
└── docs/
    └── 00-INDICE.md
```

### O que está funcionando:

| Aspecto | Nota | Comentário |
|---------|------|------------|
| Separação models/render/ui/app | 🟢 8/10 | Já separa responsabilidades |
| Models juntos | 🟢 9/10 | Fácil encontrar classes de domínio |
| Reactividade (app/) | 🟡 6/10 | Estado separado, mas com subscribe morto |
| Render separado | 🟢 8/10 | Renderização isolada |

### O que poderia melhorar:

| Problema | Localização | Impacto |
|----------|-------------|---------|
| `main.js` na raiz com muita responsabilidade | Raiz | Coordena tudo, difícil de testar |
| `ui/` mistura controller e view | ui/refeicaoForm.js | SRP violado |
| `render/` tem 6 arquivos soltos | render/ | Poderia ser organizado por componente |
| Sem pasta `controllers/` ou `services/` | Ausente | Falta camada de aplicação |
| Sem pasta `repositories/` | Ausente | Falta abstração de persistência |
| Sem pasta `value-objects/` | Ausente | Value Objects misturados com entidades |
| `styles.css` único | Raiz | Ficará gigante com o tempo |

---

## 📁 Propostas de Estrutura

### Estrutura Mínima (V1 — MVP)

Para projetos pequenos, o essencial é separar:

```
src/
├── index.html
├── css/
│   ├── styles.css
│   └── normalize.css
├── js/
│   ├── main.js
│   ├── models/
│   │   ├── PlanoSemanal.js
│   │   ├── Dia.js
│   │   ├── Refeicao.js
│   │   ├── ItemRefeicao.js
│   │   └── Ingrediente.js
│   ├── services/
│   │   ├── estado.js
│   │   └── atualizarKanban.js
│   └── views/
│       ├── renderizarSemana.js
│       ├── renderizarDia.js
│       ├── renderizarRefeicoes.js
│       ├── renderizarItemRefeicao.js
│       ├── renderizarModal.js
│       ├── renderizarBotao.js
│       ├── modal.js
│       └── refeicaoForm.js
└── docs/
```

**Vantagens:** Simples, fácil de entender.
**Desvantagens:** Views misturam render + eventos + controle.

---

### Estrutura Intermediária (V2 — Recomendada)

```
src/
├── index.html
├── css/
│   ├── styles.css
│   ├── normalize.css
│   └── components/          ← Estilos de componentes
│       ├── kanban.css
│       ├── modal.css
│       └── refeicao.css
├── js/
│   ├── main.js              ← Bootstrap da aplicação
│   │
│   ├── domain/              ← Camada de domínio (regras de negócio)
│   │   ├── entities/
│   │   │   ├── PlanoSemanal.js
│   │   │   ├── Dia.js
│   │   │   ├── Refeicao.js
│   │   │   ├── ItemRefeicao.js
│   │   │   └── Ingrediente.js
│   │   └── value-objects/
│   │       ├── Peso.js
│   │       ├── NomeRefeicao.js
│   │       └── Calorias.js
│   │
│   ├── application/         ← Casos de uso da aplicação
│   │   ├── controllers/
│   │   │   ├── RefeicaoController.js
│   │   │   └── ItemController.js
│   │   └── services/
│   │       ├── EstadoService.js
│   │       └── ListaComprasService.js  (futuro)
│   │
│   ├── infrastructure/      ← Tecnologia (DOM, storage)
│   │   ├── repositories/
│   │   │   └── PlanoSemanalRepository.js
│   │   ├── storage/
│   │   │   └── LocalStorageAdapter.js
│   │   └── dom/
│   │       ├── ContainerDOM.js
│   │       └── EventBus.js
│   │
│   ├── presentation/        ← Camada de apresentação (UI)
│   │   ├── views/
│   │   │   ├── SemanaView.js
│   │   │   ├── DiaView.js
│   │   │   ├── RefeicaoView.js
│   │   │   ├── ItemRefeicaoView.js
│   │   │   └── ModalView.js
│   │   └── templates/
│   │       ├── modalHTML.js
│   │       └── refeicaoHTML.js
│   │
│   └── shared/              ← Código compartilhado
│       ├── utils/
│       │   ├── validators.js
│       │   └── formatters.js
│       └── constants.js
│
├── assets/
│   └── icons/
│
└── docs/
```

**Vantagens:**
- Separação clara em camadas (Domain, Application, Infrastructure, Presentation)
- Cada pasta tem responsabilidade definida
- Fácil escalar
- Testável (domínio não sabe de DOM)

**Desvantagens:**
- Mais pastas, requer disciplina
- Pode ser excessivo para projetos muito pequenos

---

### Estrutura Avançada (V3/V4 — Para times grandes)

```
src/
├── index.html
├── css/
│   ├── styles.css
│   ├── normalize.css
│   └── components/
├── js/
│   ├── main.js
│   │
│   ├── core/                  ← Kernel da aplicação
│   │   ├── di/                ← Dependency Injection container
│   │   │   └── container.js
│   │   ├── events/
│   │   │   └── EventBus.js
│   │   └── router/
│   │       └── Router.js
│   │
│   ├── modules/               ← Módulos funcionais (DDD Bounded Contexts)
│   │   │
│   │   ├── planejamento/      ← Context: Planejamento Alimentar
│   │   │   ├── domain/
│   │   │   │   ├── entities/
│   │   │   │   │   ├── PlanoSemanal.js
│   │   │   │   │   └── Dia.js
│   │   │   │   └── value-objects/
│   │   │   ├── application/
│   │   │   │   ├── PlanoSemanalService.js
│   │   │   │   └── RefeicaoService.js
│   │   │   ├── infrastructure/
│   │   │   │   ├── PlanoSemanalRepository.js
│   │   │   │   └── PlanoSemanalSerializer.js
│   │   │   └── presentation/
│   │   │       ├── KanbanView.js
│   │   │       └── ModalView.js
│   │   │
│   │   ├── nutricao/          ← Context: Nutrição (futuro)
│   │   │   ├── domain/
│   │   │   │   ├── entities/
│   │   │   │   │   └── TabelaNutricional.js
│   │   │   │   └── value-objects/
│   │   │   │       ├── Calorias.js
│   │   │   │       ├── Macronutrientes.js
│   │   │   │       └── Micronutrientes.js
│   │   │   ├── application/
│   │   │   │   └── CalculoNutricionalService.js
│   │   │   ├── infrastructure/
│   │   │   │   └── TabelaNutricionalRepository.js
│   │   │   └── presentation/
│   │   │       └── TabelaNutricionalView.js
│   │   │
│   │   └── compras/           ← Context: Lista de Compras (futuro)
│   │       ├── domain/
│   │       │   └── ListaCompras.js
│   │       ├── application/
│   │       │   └── GeradorListaCompras.js
│   │       └── presentation/
│   │           └── ListaComprasView.js
│   │
│   └── shared/
│       ├── utils/
│       ├── constants.js
│       └── base/
│           ├── Entity.js
│           ├── ValueObject.js
│           └── Repository.js
│
├── assets/
│   ├── icons/
│   └── images/
│
├── tests/                     ← Testes (futuro)
│   ├── unit/
│   │   ├── domain/
│   │   └── application/
│   ├── integration/
│   └── e2e/
│
├── config/
│   └── app.config.js
│
└── docs/
```

**Vantagens:**
- Arquitetura modular por Bounded Context
- Máximo de separação de responsabilidades
- Ideal para times grandes ou projetos complexos
- Módulos podem ser desenvolvidos independentemente

**Desvantagens:**
- Overhead para projetos pequenos
- Curva de aprendizado alta
- Pode ser excessivo para uma pessoa só

---

## 🎯 Recomendação para seu Projeto

### Recomendo a **Estrutura Intermediária**.

**Motivos:**
1. Você está estudando arquitetura — essa estrutura ensina separação de camadas
2. É profissional (usada em startups e empresas de médio porte)
3. Fácil de migrar da sua estrutura atual
4. Se prepara para as features futuras sem excesso

### Mapa de Migração:

```
ATUAL                          →   INTERMEDIÁRIA
───────────────────────────────────────────────────
models/                        →   domain/entities/
  Ingrediente.js               →   domain/entities/Ingrediente.js
  ItemRefeicao.js              →   domain/entities/ItemRefeicao.js
  Refeicao.js                  →   domain/entities/Refeicao.js
  Dia.js                       →   domain/entities/Dia.js
  PlanoSemanal.js              →   domain/entities/PlanoSemanal.js
  
  (novo)                       →   domain/value-objects/Peso.js
  (novo)                       →   domain/value-objects/NomeRefeicao.js

app/                           →   application/services/
  estados.js                   →   application/services/EstadoService.js
  atualizarKanban.js           →   (distribuído nos controllers)

ui/                            →   presentation/views/
  modal.js                     →   presentation/views/ModalView.js
  refeicaoForm.js              →   presentation/views/RefeicaoView.js

render/                        →   presentation/views/ (cada um vira uma view)
  renderizarSemana.js          →   presentation/views/SemanaView.js
  renderizarDia.js             →   presentation/views/DiaView.js
  renderizarRefeicoes.js       →   presentation/views/RefeicaoView.js (componente)
  renderizarItemRefeicao.js    →   presentation/views/ItemRefeicaoView.js
  renderizarModal.js           →   presentation/views/ModalView.js (componente)
  renderizarBotao.js           →   presentation/views/DiaView.js (componente)

(novo)                         →   infrastructure/repositories/PlanoSemanalRepository.js
(novo)                         →   infrastructure/dom/EventBus.js
(novo)                         →   application/controllers/RefeicaoController.js
```

---

## 📊 Comparação Final

| Aspecto | Mínima | Intermediária (✅) | Avançada |
|---------|--------|-------------------|----------|
| **Pastas** | 4-5 | 8-10 | 15+ |
| **Arquivos** | ~15 | ~25 | ~50+ |
| **Aprendizado** | 🟢 Fácil | 🟡 Médio | 🔴 Difícil |
| **Manutenção** | 🟡 Média | 🟢 Boa | 🟢 Excelente |
| **Testabilidade** | 🟡 Média | 🟢 Boa | 🟢 Excelente |
| **Escalabilidade** | 🔴 Ruim | 🟢 Boa | 🟢 Excelente |
| **Overhead** | 🔴 Nenhum | 🟡 Pequeno | 🔴 Alto |
| **Indicado para** | MVP, protótipo | Projetos reais | Times, sistemas complexos |

---

## 🎯 Conclusão

### Regras de ouro para estrutura de pastas:

1. **Consistência > Perfeição** — mais importante que a estrutura ideal é seguir a mesma estrutura sempre
2. **Separe por responsabilidade** — não por tipo de arquivo (DOM vs LÓGICA vs DADOS)
3. **Evite pastas com um arquivo só** — (exceção: Value Objects)
4. **Nomes em inglês ou português** — escolha um e mantenha (no seu caso, português está OK)
5. **Não aninhe mais que 3-4 níveis** — dificulta navegação
6. **Refatore quando doer** — quando você sentir "não sei onde colocar isso", é hora de reavaliar

### Sua estrutura atual já é boa para um iniciante. A evolução para a estrutura intermediária é o próximo passo natural.

---

📖 **Referências:**
- Martin, Robert C. *Clean Architecture*. 2017. Capítulos 12-16 (Componentes).
- Evans, Eric. *Domain-Driven Design*. 2003. Capítulo 4 (Isolando o Domínio).
- Feathers, Michael. *Working Effectively with Legacy Code*. 2004. — Técnicas para refatorar e reorganizar código.
- MDN: [JavaScript modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)

Próximo: [06 — Fluxo de Dados](06-fluxo-de-dados.md)