# 10 — Roadmap Arquitetural

> **Objetivo:** Montar um roadmap completo de evolução arquitetural dividido em V1 (MVP), V2 (Melhorias), V3 (Escalabilidade) e V4 (Arquitetura Avançada). Explicar a motivação de cada etapa.

---

## 🧒 O que é Roadmap? (Explicação para criança)

Roadmap é como um mapa do tesouro. Você não precisa fazer tudo de uma vez. Você divide a jornada em etapas:

1. **V1** — Construir o barco (funcionalidade básica)
2. **V2** — Colocar vela (melhorias)
3. **V3** — Colocar motor (escalabilidade)
4. **V4** — Transformar em navio de cruzeiro (arquitetura avançada)

Cada etapa constrói sobre a anterior. Você não coloca o motor antes de ter o barco.

---

## 🎓 Roadmap em Engenharia de Software

Um roadmap arquitetural segue estes princípios:

1. **Value First** — funcionalidades que entregam valor ao usuário vêm primeiro
2. **Refactoring Second** — melhorias internas vêm depois que a funcionalidade existe
3. **YAGNI (You Ain't Gonna Need It)** — não construa para o futuro distante agora
4. **Incremental** — cada versão é um passo pequeno e seguro

---

## 💼 Roadmap Completo

---

## V1 (MVP) — Funcionalidade Essencial

### Objetivo
Ter um sistema funcional que resolve o problema principal: **planejar refeições da semana**.

### Funcionalidades
- ✅ Criar plano semanal (7 dias)
- ✅ Adicionar refeições a cada dia
- ✅ Adicionar ingredientes com quantidades
- ✅ Excluir refeições e itens
- ✅ Visualizar em formato Kanban
- ✅ Persistência LocalStorage (dados não morrem ao recarregar)

### Arquitetura Mínima

```
src/
├── index.html
├── css/
│   ├── styles.css
│   └── normalize.css
├── js/
│   ├── main.js
│   ├── domain/
│   │   └── entities/
│   │       ├── PlanoSemanal.js
│   │       ├── Dia.js
│   │       ├── Refeicao.js
│   │       ├── ItemRefeicao.js
│   │       └── Ingrediente.js
│   ├── application/
│   │   ├── controllers/
│   │   │   ├── RefeicaoController.js
│   │   │   └── ItemController.js
│   │   └── services/
│   │       └── EstadoService.js
│   ├── infrastructure/
│   │   ├── repositories/
│   │   │   └── PlanoSemanalRepository.js
│   │   └── dom/
│   │       └── EventBus.js
│   └── presentation/
│       └── views/
│           ├── SemanaView.js
│           ├── DiaView.js
│           ├── RefeicaoView.js
│           ├── ItemRefeicaoView.js
│           └── ModalView.js
└── docs/
```

### Refatorações Necessárias no Código Atual

| # | Refatoração | Arquivo | Motivo |
|---|-------------|---------|--------|
| 1 | Encapsular arrays públicos (usar `#`) | Todos models | Proteger dados |
| 2 | Criar PlanoSemanalRepository | novo | Persistência |
| 3 | Separar SRP de ui/refeicaoForm.js | ui/ → controller + view | Organização |
| 4 | Remover dependência circular render/ → main.js | render/ | Acoplamento |
| 5 | Separar modais do kanban (colocar no body) | render/renderizarModal.js | Bug de sumiço |
| 6 | Ativar subscribe/notify em estados.js | app/estados.js | Observer vivo |
| 7 | Normalizar nomes de ingredientes | Ingrediente.js | Preparar agrupamento |
| 8 | Mover limite de refeições para o modelo | render/ → Dia.js | Regra no lugar certo |

### Código que deve permanecer IGUAL:
- `main.js` event delegation (funciona bem)
- `styles.css` design system (ótimo)
- Estrutura de `models/` com pequenos ajustes

### Motivação da V1
Sem persistência, o sistema perde dados. Sem encapsulamento, dados podem ser corrompidos. Sem separação SRP, adicionar features fica cada vez mais difícil. A V1 resolve os problemas mais críticos e estabelece a base para crescer.

---

## V2 — Melhorias e Novas Features

### Objetivo
Adicionar features que aumentam utilidade e refatorar para melhor organização.

### Funcionalidades
- ✅ Lista de compras automática (agrupa ingredientes)
- ✅ Cadastro de ingredientes (com repositório)
- ✅ Banco de refeições reutilizáveis (Factory + clone)
- ✅ Exportar plano (CSV básico)

### Arquitetura da V2

```
                    ┌─────────────────────────┐
                    │   AppFacade             │ ← Facade simplifica
                    │   (main.js simplificado) │    inicialização
                    └──────────┬──────────────┘
                               │
         ┌─────────────────────┼─────────────────────┐
         ▼                     ▼                     ▼
┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐
│   Controllers   │   │     Store       │   │   Repositories   │
│   + Services    │   │  (Ativo)        │   │                  │
└─────────────────┘   └─────────────────┘   └─────────────────┘
         │                     │                     │
         ▼                     ▼                     ▼
┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐
│  Domain Models  │   │     Views       │   │  Ingrediente    │
│  (encapsulados) │   │  (reativas)     │   │  Repository     │
└─────────────────┘   └─────────────────┘   └─────────────────┘
```

### Refatorações

| # | Refatoração | Motivo |
|---|-------------|--------|
| 1 | Criar EventBus (Pub/Sub) | Comunicação desacoplada |
| 2 | Criar RefeicaoFactory | Refeições pré-definidas |
| 3 | Criar AppFacade | Simplificar initialization |
| 4 | Adicionar ListaComprasService | Feature de compras |
| 5 | Adicionar data ao PlanoSemanal | Preparar histórico |

### Motivação da V2
A V1 já entrega valor. Agora é hora de features que diferenciam o produto: lista de compras e refeições reutilizáveis. A refatoração via Facade e EventBus prepara o terreno sem excessos.

---

## V3 — Escalabilidade

### Objetivo
Preparar o sistema para evoluir sem dor. Adicionar performance e suporte a dados maiores.

### Funcionalidades
- ✅ Informações nutricionais (calorias, macros)
- ✅ Histórico de planos (salvar semanas anteriores)
- ✅ Exportação PDF
- ✅ Filtros e pesquisa
- ✅ Atualização parcial do DOM (melhor performance)

### Arquitetura da V3

```
┌─────────────────────────────────────────────────────────┐
│                     EventBus (Pub/Sub)                    │
│                                                          │
│  eventos: refeicao:criada, refeicao:excluida,            │
│           item:adicionado, plano:salvo                   │
└──────────┬──────────────────────────────────┬────────────┘
           │                                  │
           ▼                                  ▼
┌─────────────────────┐         ┌─────────────────────┐
│   Módulo            │         │   Módulo             │
│   Planejamento      │         │   Nutrição           │
│                     │         │                      │
│  ┌───────────────┐  │         │  ┌───────────────┐   │
│  │ Controllers   │  │         │  │ Strategy      │   │
│  │ Views         │  │         │  │ (cálculo)     │   │
│  │ Repository    │  │         │  │ Tabela BR     │   │
│  └───────────────┘  │         │  └───────────────┘   │
└─────────────────────┘         └─────────────────────┘
```

### Refatorações Técnicas

| # | Mudança | Benefício |
|---|---------|-----------|
| 1 | Strategy Pattern para cálculos nutricionais | Algoritmos intercambiáveis |
| 2 | Adapter para múltiplos storages | LocalStorage + IndexedDB |
| 3 | Atualização parcial (cache de elementos) | Performance |
| 4 | PlanoSemanalRepository.listarHistorico() | Histórico |

### Motivação da V3
Nutrição, histórico e exportação são features de maturidade. As refatorações técnicas (Strategy, Adapter, atualização parcial) são necessárias para manter performance com mais dados.

---

## V4 — Arquitetura Avançada

### Objetivo
Arquitetura modular profissional, preparada para crescimento significativo.

### Funcionalidades
- ✅ Módulos independentes por Bounded Context
- ✅ Possível migração para TypeScript
- ✅ Possível adoção de framework (React, lit-html)
- ✅ Sistema de plugins/extensões
- ✅ Testes unitários e de integração
- ✅ Multiusuário (se necessário)

### Arquitetura da V4

```
src/
├── core/                    ← Kernel (DI, EventBus, Router)
│   ├── di/                  ← Dependency Injection
│   ├── events/              ← EventBus
│   └── base/                ← classes base (Entity, VO, Repository)
│
├── modules/                 ← Bounded Contexts independentes
│   ├── planejamento/        ← Context 1
│   │   ├── domain/
│   │   ├── application/
│   │   ├── infrastructure/
│   │   └── presentation/
│   │
│   ├── nutricao/            ← Context 2
│   │   ├── domain/
│   │   ├── application/
│   │   ├── infrastructure/
│   │   └── presentation/
│   │
│   └── compras/             ← Context 3
│       ├── domain/
│       ├── application/
│       ├── infrastructure/
│       └── presentation/
│
├── shared/                  ← Código compartilhado
├── tests/
└── config/
```

### Motivação da V4
Arquitetura modular (também chamada de **Modular Monolith**) é o ápice antes de migrar para microsserviços. Cada Bounded Context pode ser desenvolvido, testado e evoluído independentemente. É o nível onde times grandes trabalham em paralelo.

---

## 📊 Linha do Tempo Visual

```
V1 (AGORA)          V2 (PRÓXIMO)        V3 (FUTURO)         V4 (LONGO PRAZO)
──────────────────  ──────────────────  ──────────────────  ──────────────────
MVP funcional       + Lista compras     + Nutrição          + Módulos
Persistência        + Refeições fixas   + Histórico         + TypeScript
Encapsulamento      + Facade            + Exportação PDF    + Framework?
SRP separado        + EventBus          + Strategy          + Testes
Observer ativo      + Factory           + Adapter           + DI Container
                    + CSV export        + Partial render    + Plugins
```

---

## 🎯 Resumo das Prioridades

| Fase | O que | Por que agora? | Risco de adiar |
|------|-------|----------------|----------------|
| **V1** | Persistência, encapsulamento, SRP | Dados são perdidos, código frágil | 🔴 Dados perdidos a cada refresh |
| **V2** | Features + Facade + EventBus | Produto precisa de diferenciação | 🟡 Acoplamento dificulta features |
| **V3** | Nutrição, histórico, performance | Maturidade do produto | 🟢 Pode esperar |
| **V4** | Arquitetura modular | Time crescendo ou complexidade alta | 🟢 Muito distante |

---

📖 **Referências:**
- Martin, Robert C. *Clean Architecture*. 2017. — Capítulo 34 (A Estrutura Adequada)
- Fowler, Martin. *Patterns of Enterprise Application Architecture*. 2003. — Capítulo 1 (Layering)
- Fowler, Martin. *Refactoring*. 2ª ed. 2018. — Técnicas de refatoração incremental
- Hunt, Andrew; Thomas, David. *The Pragmatic Programmer*. 2ª ed. 2019. — Dica "Investimento em Conhecimento"

Próximo: [11 — Refatorações Prioritárias](11-refatoracoes-prioritarias.md)