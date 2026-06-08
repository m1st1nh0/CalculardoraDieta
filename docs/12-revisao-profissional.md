# 12 — Revisão Profissional

> **Objetivo:** Avaliar o projeto como se fosse apresentado em um processo seletivo para vaga de Desenvolvedor Frontend Júnior. Analisar pontos fortes, pontos fracos, e o que impressionaria em cada nível de senioridade.

---

## 🧒 O que é uma Revisão Profissional?

Imagine que você construiu um robô e vai apresentar numa feira de ciências. Tem jurados de diferentes níveis:
- **Um amigo** (recrutador) — olha se o robô anda e se é bonito
- **Um professor de robótica** (Tech Lead) — olha como as peças se encaixam
- **Um engenheiro sênior** (Staff Engineer) — olha se o robô pode ser melhorado, se as peças são fáceis de trocar, se o código é elegante

Cada um vê coisas diferentes. Esta revisão simula o olhar de cada um desses jurados.

---

## 🎓 Níveis de Senioridade na Avaliação

| Nível | Foca em | Tempo de experiência |
|-------|---------|---------------------|
| **Recrutador** | Aparência, funcionalidade, boas práticas básicas | RH técnico |
| **Tech Lead** | Arquitetura, organização do código, testabilidade | 5-8 anos |
| **Staff Engineer** | Princípios de design, escalabilidade, trade-offs | 10+ anos |

---

## 💼 Avaliação por Nível

---

### 👀 O que impressionaria RECRUTADORES

**Recrutadores em processos seletivos júnior geralmente olham:**

✅ **O projeto funciona?** — Sim, o Kanban renderiza, adiciona refeições, itens
✅ **Usa tecnologias adequadas?** — Vanilla JS com ES Modules, sem framework desnecessário
✅ **Tem organização básica?** — Pastas separadas (models/, render/, ui/, app/)
✅ **Tem README?** — Sim, tem README.md
✅ **Usa CSS moderno?** — Sim, CSS Custom Properties, LCH/OKLCH colors
✅ **Código limpo?** — Parcialmente (identação ok, nomes em português consistentes)

**Pontuação estimada para recrutador: 7/10**

> "O candidato demonstra que sabe estruturar um projeto, usar módulos ES6, tem noção de separação de responsabilidades e se preocupa com organização. Acima da média para júnior."

---

### 🔍 O que impressionaria TECH LEADS

**Tech Leads olham além do "funciona":**

✅ **Separação em camadas:** `models/`, `render/`, `ui/`, `app/` — boa intenção
✅ **State Manager com Observer:** `StateManager` com `subscribe/notify` (mesmo que não usado)
✅ **Validações:** `Refeicao.validar()`, `Ingrediente.validar()`, `ItemRefeicao.validarPeso()`
✅ **Event Delegation:** Uso em `main.js` (em vez de listener por botão)
✅ **ES Modules:** `import`/`export` sem bundler

**O que chamaria atenção negativa:**

🔴 **Dependência circular:** `render/` importa de `main.js`
🔴 **Subscribe/notify morto:** Estrutura de observer sem uso
🔴 **Arrays públicos:** Todos os dados podem ser corrompidos externamente
🔴 **SRP violado:** `ui/refeicaoForm.js` faz 6 coisas
🔴 **Sem persistência:** Dados perdidos ao recarregar
🔴 **Regra de negócio na view:** Limite de 5 refeições em `renderizarBotao.js`
🔴 **ItemRefeicao com tipo duplo:** string OU objeto Ingrediente

**Pontuação estimada para Tech Lead: 5/10**

> "Base sólida para iniciante, mas os problemas de encapsulamento, acoplamento e responsabilidade única precisam ser resolvidos para considerar o código 'pronto para produção'. O candidato tem potencial mas precisa refinar."

---

### 🧠 O que impressionaria STAFF ENGINEERS

**Staff Engineers olham o quadro completo:**

✅ **Preocupação com arquitetura:** O candidato já está pensando em SOLID, design patterns, separação de responsabilidades — isso é raro em júnior
✅ **Uso de DDD conceitos:** Entidades, Agregados, Value Objects — mesmo que imperfeito, mostra estudo
✅ **CSS design system:** Uso de variáveis CSS, cores com LCH/OKLCH (técnica avançada)
✅ **Composição correta:** `PlanoSemanal → Dia → Refeicao → ItemRefeicao → Ingrediente`

**O que um Staff Engineer identificaria como pontos de melhoria profundos:**

🔴 **Falta de testabilidade:** Código acoplado ao DOM, funções acessam `document` diretamente
🔴 **Ausência de tratamento de erros global:** Erros são capturados com `alert()` — péssimo para UX
🔴 **Sem imutabilidade:** Estado pode ser modificado de qualquer lugar
🔴 **Mistura de idiomas:** Código em português (consistente, mas inglês é padrão internacional)
🔴 **Código morto:** `console.log` e comentários de debug
🔴 **Sem lazy loading:** Tudo carregado upfront (ES Modules sem code splitting)
🔴 **Sem testes:** Nenhum teste unitário ou de integração

**Pontuação estimada para Staff Engineer: 4/10**

> "O candidato demonsta estudo e potencial acima da média, mas o projeto ainda está no estágio de 'protótipo funcional'. As bases conceituais estão sendo construídas — o que é bom — mas a execução prática ainda precisa amadurecer. Com 3-6 meses de refatoração guiada, o projeto pode chegar a um nível profissional."

---

## 📊 Comparativo: Notas por Dimensão

| Dimensão | Recrutador | Tech Lead | Staff Engineer |
|----------|-----------|-----------|----------------|
| **Funcionalidade** | 8/10 | 7/10 | 6/10 |
| **Organização** | 7/10 | 6/10 | 5/10 |
| **Código limpo** | 6/10 | 5/10 | 4/10 |
| **Arquitetura** | 5/10 | 4/10 | 3/10 |
| **Boas práticas** | 7/10 | 5/10 | 4/10 |
| **Inovação/Estudo** | 8/10 | 7/10 | 7/10 |
| **Média** | **6.8** | **5.6** | **4.8** |

---

## 🚀 O que aumentaria MUITO a nota do projeto

### Impacto Imediato (maior retorno com menor esforço)

| # | Ação | Impacto na nota |
|---|------|-----------------|
| 1 | Adicionar persistência LocalStorage | +1.5 pontos |
| 2 | Encapsular arrays públicos | +1.0 ponto |
| 3 | Separar SRP de ui/refeicaoForm.js | +0.8 ponto |
| 4 | Remover dependência circular | +0.7 ponto |
| 5 | Corrigir tipo duplo ItemRefeicao | +0.5 ponto |

### Impacto Médio

| # | Ação | Impacto na nota |
|---|------|-----------------|
| 6 | Ativar subscribe/notify | +0.5 ponto |
| 7 | Criar Value Objects (Peso, NomeRefeicao) | +0.5 ponto |
| 8 | Mover regras de negócio para o modelo | +0.5 ponto |
| 9 | Separar modais do kanban | +0.3 ponto |
| 10 | Adicionar README com instruções claras | +0.3 ponto |

### Impacto Alto (mais trabalho)

| # | Ação | Impacto na nota |
|---|------|-----------------|
| 11 | Adicionar testes unitários | +2.0 pontos |
| 12 | Reorganizar para estrutura intermediária | +1.5 pontos |
| 13 | Migrar para Event-Driven (EventBus) | +1.0 ponto |
| 14 | Adicionar tratamento de erros profissional | +1.0 ponto |
| 15 | Traduzir código para inglês | +0.5 ponto |

---

## 🎯 O que o projeto ENSINA sobre você como desenvolvedor

### Mensagens positivas que o projeto transmite:

> "Eu me preocupo com organização e boas práticas. Estudo arquitetura de software mesmo em projetos pessoais. Sei que JavaScript Vanilla tem limitações e busco estruturar meu código com camadas e separação de responsabilidades. Entendo que CSS também precisa de arquitetura (design system com variáveis)."

### Mensagens negativas que o projeto transmite:

> "Ainda não internalizei encapsulamento — expor arrays públicos é um erro básico de OOP. Não implemento persistência, o que torna o projeto inviável para uso real. Misturo lógica de negócio com renderização. Meu código ainda tem resquícios de procedural dentro de um invólucro OO."

---

## 📋 Checklist para um Projeto Júnior NOTA 10

### Funcionalidades
- [x] Sistema funcional (faz o que promete)
- [ ] Persistência de dados
- [ ] Tratamento de erros (sem alert())
- [ ] Feedback visual para o usuário
- [ ] Responsividade básica

### Código
- [x] ES Modules
- [ ] Campos privados (#)
- [ ] Getters com cópia defensiva
- [ ] Funções com responsabilidade única
- [ ] Sem dependências circulares
- [ ] Sem código morto (console.log)
- [ ] Constantes e não números mágicos

### Arquitetura
- [x] Separação em pastas
- [ ] Camada de domínio pura (sem DOM)
- [ ] Camada de aplicação (controllers)
- [ ] Camada de infraestrutura (repositories)
- [ ] Gerenciamento de estado (store reativa)
- [ ] Testes unitários

### Profissionalismo
- [x] README.md
- [x] CSS organizado
- [ ] Comentários em inglês ou nenhum
- [ ] Nomes de variáveis em inglês
- [ ] Git commits convencionais
- [ ] Sem alert() para erros

---

## 🎯 Conclusão

### Nota final do projeto (para processos seletivos júnior):

> **🎯 5.5 / 10** — Acima da média para iniciante, mas com pontos críticos a resolver

### O que você precisa para chegar a 8+:

1. **Persistência** (LocalStorage) — 2 horas
2. **Encapsulamento** (# privado) — 1 hora
3. **Separar SRP** (Controller + View) — 2 horas
4. **Ajustes finos** (tipo duplo, dependência circular, bugs) — 2 horas

**Total estimado: ~7 horas de refatoração para um projeto nota 8+**

---

📖 **Referências:**
- Martin, Robert C. *Clean Code*. 2008. — Capítulo 1 (Código Limpo), Capítulo 4 (Comentários)
- Cracking the Coding Interview — Gayle Laakmann McDowell — Para entender como entrevistadores avaliam
- MDN: [Guia de Boas Práticas JavaScript](https://developer.mozilla.org/en-US/docs/Learn/JavaScript)

Próximo: [13 — Referências Bibliográficas](13-referencias.md)