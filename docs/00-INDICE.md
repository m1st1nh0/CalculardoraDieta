# 📚 Revisão Arquitetural Profunda — Calculadora de Dieta

> Documento de **revisão arquitetural + curso de Engenharia de Software** aplicado ao seu projeto real.
> Cada conceito é explicado em **3 níveis**: 🧒 *como se você tivesse 10 anos*, 🎓 *nível universitário*, 💼 *nível profissional*.

---

## Como ler este material

Este não é um relatório de "está bom / está ruim". É um **mapa de aprendizado**.
A ordem recomendada de leitura é a numérica, porque cada documento constrói vocabulário usado no próximo. Mas você pode pular para o tema que mais te interessa.

| # | Documento | O que você vai aprender | Tempo de leitura |
|---|-----------|--------------------------|------------------|
| 01 | [Análise de Domínio (DDD)](01-analise-dominio-ddd.md) | Entidade, Value Object, Agregado, Bounded Context, Linguagem Ubíqua | ~25 min |
| 02 | [Avaliação da Modelagem](02-avaliacao-modelagem.md) | Coesão, acoplamento, encapsulamento, herança vs composição | ~30 min |
| 03 | [Princípios SOLID](03-solid.md) | SRP, OCP, LSP, ISP, DIP do zero, com violações reais do seu código | ~35 min |
| 04 | [Programação Orientada a Objetos](04-oop.md) | Encapsulamento, abstração, herança, polimorfismo, composição | ~25 min |
| 05 | [Estrutura de Pastas](05-estrutura-pastas.md) | Estruturas mínima, intermediária e avançada para Vanilla JS | ~20 min |
| 06 | [Fluxo de Dados / Estado](06-fluxo-de-dados.md) | Single Source of Truth, Flux, Event-Driven, store reativa | ~30 min |
| 07 | [Renderização e DOM](07-renderizacao-dom.md) | Re-render total, atualização parcial, Virtual DOM, diffing, event delegation | ~30 min |
| 08 | [Escalabilidade](08-escalabilidade.md) | Risco de cada decisão atual frente às features futuras | ~25 min |
| 09 | [Design Patterns](09-design-patterns.md) | Observer, Pub/Sub, Factory, Builder, Repository, Strategy, Adapter, Facade, Command | ~40 min |
| 10 | [Roadmap Arquitetural](10-roadmap.md) | V1 → V2 → V3 → V4, com motivação técnica | ~20 min |
| 11 | [Refatorações Prioritárias](11-refatoracoes-prioritarias.md) | Top 20 problemas, ordenados por prioridade | ~20 min |
| 12 | [Revisão Profissional](12-revisao-profissional.md) | Como recrutadores, Tech Leads e Staff Engineers veriam o projeto | ~15 min |
| 13 | [Referências Bibliográficas](13-referencias.md) | Os livros, artigos, RFCs e docs que sustentam tudo isto | ~10 min |

---

## 🗺️ Mapa mental do projeto atual (como está hoje)

```
┌─────────────────────────────────────────────────────────────┐
│                         index.html                          │
│                    <div id="kanban">                        │
└───────────────────────────┬─────────────────────────────────┘
                            │  <script type="module" src="main.js">
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  main.js  (composição + roteador de eventos por id)         │
│   new PlanoSemanal() ──► estado.planoSemanal                │
│   atualizarKanban(kanban)                                   │
│   kanban.addEventListener("click", roteia por event.id)     │
└───────────────┬─────────────────────────────────────────────┘
                │
        ┌───────┴────────────────────────────────┐
        ▼                                         ▼
┌───────────────────┐                  ┌────────────────────────┐
│  app/ (aplicação) │                  │  models/ (domínio)     │
│  estado (Store)   │                  │  PlanoSemanal          │
│  atualizarKanban  │                  │   └─ Dia               │
│  limparTela       │                  │       └─ Refeicao      │
└─────────┬─────────┘                  │           └─ ItemRef.  │
          │                            │               └─ Ingr. │
          ▼                            └────────────────────────┘
┌───────────────────┐                  ┌────────────────────────┐
│ render/ (view)    │◄─────────────────│  ui/ (controllers)     │
│ renderizarSemana  │                  │  refeicaoForm          │
│ renderizarDia     │                  │  modal                 │
│ renderizarRefeicoes│                 └────────────────────────┘
│ renderizarItem... │
│ renderizarModal   │
│ renderizarBotao   │
└───────────────────┘
```

**Observação importante:** as setas mostram que `render/` e `ui/` se importam mutuamente e ambos dependem de `app/estado`. Isso gera um **acoplamento em teia** (todo mundo conhece todo mundo) que vamos destrinchar no doc 02 e 06.

---

## 🎯 Veredito executivo (resumo de 30 segundos)

| Dimensão | Nota (0–10) | Comentário curto |
|----------|-------------|------------------|
| Organização em pastas | 7 | Já separa models/render/ui/app — ótimo para iniciante |
| Modelagem de domínio | 5 | Hierarquia correta, mas `Ingrediente`/`ItemRefeicao` inconsistentes |
| Orientação a Objetos | 5 | Usa classes, mas com vazamento de regra para a view |
| SOLID | 4 | SRP e DIP violados em vários pontos |
| Fluxo de dados | 4 | Tem uma Store, mas o `subscribe/notify` é código morto |
| Renderização/DOM | 3 | Re-render total + bug de container compartilhado |
| Escalabilidade | 4 | Sem persistência/repositório; acoplamento dificulta crescer |
| **Média geral** | **~4.6** | **Base muito promissora para um projeto de aprendizado** |

> ⚠️ **Nota motivacional, importante:** uma média ~4.6 **não é ruim** — é exatamente o esperado de quem está construindo "na unha" e **já se preocupa com arquitetura**. A maioria dos iniciantes nem tem `models/` separado de `render/`. Você está fazendo as perguntas certas cedo. Este documento existe para transformar esse 4.6 em 8+.

---

## Convenções usadas nos documentos

- 🧒 **Nível Criança** — analogia simples.
- 🎓 **Nível Universitário** — definição formal.
- 💼 **Nível Profissional** — como se usa no mercado.
- 🔴 **Violação encontrada** — problema real no seu código.
- ✅ **Refatoração** — código sugerido.
- 📖 **Referência** — livro/artigo onde aprofundar.

Vamos começar. → [01 - Análise de Domínio (DDD)](01-analise-dominio-ddd.md)
