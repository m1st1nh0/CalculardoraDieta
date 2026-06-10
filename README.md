# 🥗 Calculadora de Dieta — Planejador Semanal de Refeições

> **Planejamento alimentar simples, modular e sem dependências.**  
> Uma aplicação front-end 100% vanilla JavaScript para organizar refeições da semana, registrar ingredientes e quantidades, e calcular totais para facilitar as compras.

[![Licence](https://img.shields.io/badge/licence-MIT-blue.svg)](LICENSE)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES%20Modules-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)

---

## 📋 Visão Geral

A **Calculadora de Dieta** é uma ferramenta de planejamento semanal de refeições construída inteiramente com tecnologias web padrão — HTML, CSS e JavaScript puro (ES Modules). Ela nasceu de uma necessidade prática: organizar o cardápio semanal, registrar a gramatura de cada ingrediente por refeição e somar os totais para facilitar a hora das compras.

O projeto também serve como um exercício contínuo de engenharia de software, aplicando conceitos como **Domain-Driven Design (DDD)**, **SOLID**, **padrões de projeto** (Observer), **separação de camadas** e boas práticas de modelagem de domínio — tudo sem frameworks ou build tools.

---

## ✨ Funcionalidades

| Funcionalidade | Descrição |
|---|---|
| 🗓️ **Plano Semanal** | Criação automática dos 7 dias da semana |
| 🍽️ **Gerenciamento de Refeições** | Adicionar até 5 refeições por dia |
| 🥦 **Registro de Ingredientes** | Adicionar ingredientes com quantidade em gramas |
| 📋 **Kanban Visual** | Interface estilo kanban para visualização dos dias |
| ➕ **Limite de Refeições** | Controle de até 5 refeições por dia |
| 🔍 **Detalhamento Expansível** | Clique no título da refeição para expandir/recolher itens |
| 📊 **Dashboard de Totais** | Sidebar com total semanal de cada ingrediente |
| 🗑️ **Exclusão de Itens** | Remover ingredientes ou refeições inteiras |
| 🎨 **Tema Verde Moderno** | Design responsivo com variáveis CSS e tema verde |
| 📱 **Responsivo** | Layout adaptável para desktop e mobile |
| 🧩 **Modais Multi-etapa** | Fluxo guiado em 2 modais para criação de refeição |
| 🧠 **Estado Reativo** | Gerenciamento de estado global com padrão Observer |

---

## 🛠️ Stack Tecnológica

| Categoria | Tecnologia |
|---|---|
| **Frontend** | HTML5, CSS3, JavaScript (ES Modules) |
| **Gerenciamento de Estado** | StateManager (padrão Observer — implementação própria) |
| **Tipografia** | Google Fonts (Roboto, Work Sans, Lato) |
| **CSS Reset** | normalize.css v8.0.1 |
| **Ferramentas de Build** | Nenhuma — zero dependências |
| **Testes** | Não foi possível identificar infraestrutura de testes no código analisado |

---

## 🏗️ Arquitetura

### Separação em Camadas

O projeto adota uma arquitetura modular inspirada nos princípios de **Domain-Driven Design** e **separação de responsabilidades**, dividida em 4 camadas principais:

```
┌─────────────────────────────────────────────────┐
│                   main.js                        │
│         (Composição raiz & Eventos)              │
├──────────────────┬──────────────────────────────┤
│   app/           │   ui/                         │
│   (Orquestração) │   (Interação do usuário)      │
├──────────────────┴──────────────────────────────┤
│   render/                                       │
│   (View — Renderização do DOM)                  │
├─────────────────────────────────────────────────┤
│   models/                                       │
│   (Domínio — Regras de negócio puras)           │
└─────────────────────────────────────────────────┘
```

### Padrões Arquiteturais Identificados

| Padrão | Onde é aplicado |
|---|---|
| **Observer** — `StateManager` | `app/estados.js` mantém uma lista de listeners e os notifica via `notify()` |
| **Aggregate Root** — `PlanoSemanal` | Agregado raiz que encapsula `Dia` como entidade filha |
| **Value Object** — `Ingrediente` | Objeto imutável identificado apenas por seu valor (nome) |
| **Entity** — `Dia`, `Refeicao`, `ItemRefeicao` | Entidades com identidade própria (id) e ciclo de vida |
| **Repository Pattern (conceitual)** | `app/estados.js` funciona como repositório central do agregado `PlanoSemanal` |
| **Modular Pattern** — ES Modules | Cada arquivo exporta funções/classes específicas, com imports explícitos |

### Fluxo de Dados

1. **main.js** instancia `PlanoSemanal` e o registra no `StateManager`
2. `atualizarKanban()` orquestra a renderização inicial
3. O usuário interage via cliques → eventos delegados no `kanban`
4. **ui/refeicaoForm.js** processa os formulários e modifica o estado
5. **models/** validam e mantêm a integridade dos dados
6. **render/** reconstroem partes específicas do DOM
7. `renderizarTotais()` agrega dados da semana e exibe no dashboard

### Modelo de Domínio

```
PlanoSemanal (Aggregate Root)
  └── Dia (Entity) — 7 instâncias (Segunda a Domingo)
        └── Refeicao (Entity) — até 5 por dia
              └── ItemRefeicao (Entity) — ingrediente + peso
                    └── Ingrediente (Value Object) — nome do ingrediente
```

---

## 📁 Estrutura de Diretórios

```
CalculadoraDieta/
├── index.html                  # 🚀 Ponto de entrada da aplicação
├── main.js                     # 🧩 Composição raiz e delegador de eventos
├── styles.css                  # 🎨 Estilos globais com variáveis CSS
├── normalize.css               # 🔄 Reset CSS entre navegadores (CDN local)
├── app/                        # ⚙️ Camada de aplicação
│   ├── estados.js              #   StateManager — estado global reativo
│   ├── atualizarKanban.js      #   Orquestrador da renderização completa
│   └── limparTela.js           #   Utilitário de limpeza do DOM
├── models/                     # 🧠 Camada de domínio (regras de negócio)
│   ├── PlanoSemanal.js         #   Agregado raiz do plano semanal
│   ├── Dia.js                  #   Dia da semana (entidade)
│   ├── Refeicao.js             #   Refeição composta por itens (entidade)
│   ├── ItemRefeicao.js         #   Item com ingrediente + peso (entidade)
│   └── Ingrediente.js          #   Value Object: nome do ingrediente
├── render/                     # 🎭 Camada de view (renderização DOM)
│   ├── renderizarSemana.js     #   Itera os dias e renderiza cada um
│   ├── renderizarDia.js        #   Cria coluna visual do dia
│   ├── renderizarRefeicoes.js  #   Renderiza refeições com toggle de itens
│   ├── renderizarItemRefeicao.js # Tabela de ingredientes no modal
│   ├── renderizarModal.js      #   Conteúdo HTML dos modais
│   ├── renderizarBotao.js      #   Botão "+" para adicionar refeição
│   └── renderizarTotais.js     #   Dashboard de totais semanais
└── ui/                         # 🖱️ Camada de interação
    ├── modal.js                #   Controle de abertura/fechamento de modais
    └── refeicaoForm.js         #   Lógica dos formulários de criação
```

### Descrição das Pastas

| Pasta | Responsabilidade |
|---|---|
| **`app/`** | Camada de orquestração e estado global da aplicação. Coordena o fluxo entre UI, modelos e renderização. |
| **`models/`** | Camada de domínio puro. Contém as classes de negócio sem qualquer dependência do DOM ou da interface. |
| **`render/`** | Camada de apresentação. Funções responsáveis exclusivamente por construir e atualizar elementos do DOM. |
| **`ui/`** | Camada de controle/interação. Lida com eventos do usuário, formulários e manipulação de modais. |

---

## ✅ Pré-requisitos

- Um **navegador web moderno** (Chrome, Firefox, Edge, Safari — versões lançadas a partir de 2020)
- **VS Code** (recomendado) com a extensão **Live Server** (opcional, para recarregamento automático)
- **Nenhuma dependência** — o projeto não requer Node.js, npm, Docker ou qualquer outra ferramenta

---

## 📦 Instalação

```bash
# Clone o repositório
git clone https://github.com/m1st1nh0/CalculardoraDieta.git

# Entre no diretório
cd CalculardoraDieta

# Pronto! Sem dependências para instalar 🎉
```

---

## ⚙️ Configuração

Não foram identificados arquivos de configuração (`.env`, `config.json`, etc.) no código analisado. O projeto funciona sem configuração adicional.

---

## 🚀 Execução

### Desenvolvimento

Abra o arquivo `index.html` diretamente no navegador:

```bash
# Opção 1 — Abrir diretamente (Windows)
start index.html
```

Ou utilizando o **Live Server** no VS Code:

1. Clique com o botão direito no `index.html`
2. Selecione **"Open with Live Server"**

### Produção

O projeto não requer build ou etapa de produção. Basta hospedar a pasta do projeto em qualquer servidor web estático (GitHub Pages, Netlify, Vercel, etc.).

> ⚠️ **Importante:** Como o projeto usa ES Modules (`type="module"`), o arquivo `index.html` deve ser servido por um servidor HTTP (local ou remoto). A abertura direta do arquivo (`file://`) pode ser bloqueada por políticas de CORS em alguns navegadores.

---

## 📜 Scripts Disponíveis

Não foram identificados scripts de automação (npm scripts, Makefile, etc.) no código analisado. O projeto não utiliza task runners ou bundlers.

---

## 🌐 API

Não foram identificados endpoints de API REST ou serviços externos no código analisado. A aplicação é **100% client-side** e não realiza chamadas de rede.

---

## 🗄️ Banco de Dados

Não foram identificados bancos de dados, ORMs ou sistemas de persistência externa no código analisado. Todos os dados são mantidos exclusivamente em memória durante a sessão do navegador.

---

## 🧪 Testes

Não foi possível identificar infraestrutura de testes automatizados (frameworks, configurações, suites de teste) no código analisado.

---

## ☁️ Deploy

### Hospedagem Estática

O projeto pode ser deployado em qualquer serviço de hospedagem estática:

| Plataforma | Como fazer |
|---|---|
| **GitHub Pages** | Faça push do repositório e habilite GitHub Pages nas settings |
| **Netlify** | Conecte o repositório ou faça drag-and-drop da pasta |
| **Vercel** | Importe o repositório e configure como static export |
| **Cloudflare Pages** | Conecte o repositório e faça deploy |

### Docker

Não foram identificados arquivos Docker (Dockerfile, docker-compose.yml) no código analisado.

### CI/CD

Não foram identificados pipelines de CI/CD (GitHub Actions, GitLab CI, etc.) no código analisado.

---

## 🔒 Segurança

- **Validação de entrada:** As classes `Ingrediente` e `Refeicao` validam seus parâmetros no construtor, lançando erros para dados inválidos
- **Tratamento de erros:** `try/catch` nos formulários com feedback via `alert()` ao usuário
- **Campos privados:** Uso de `#` (private class fields) nos atributos sensíveis das classes de modelo
- **Autenticação/Autorização:** Não foi possível identificar mecanismos de autenticação no código analisado (aplicação client-side sem backend)

---

## 📊 Monitoramento e Logs

- **Logs de desenvolvimento:** `console.log()` presente em `ui/refeicaoForm.js` e `render/renderizarRefeicoes.js` para depuração
- Não foram identificados sistemas de monitoramento, métricas ou observabilidade (APM, analytics, etc.)

---

## 🗺️ Roadmap

Sugestões de melhorias futuras baseadas na análise do código:

| Prioridade | Melhoria | Justificativa |
|---|---|---|
| 🔴 Alta | **Persistência de dados** (LocalStorage) | Dados são perdidos ao recarregar a página |
| 🔴 Alta | **Testes automatizados** | Sem cobertura de testes, risco de regressão |
| 🟡 Média | **Build tool** (Vite ou similar) | Para minificação, HMR e compatibilidade |
| 🟡 Média | **Componentização com template strings** | Reduzir repetição de HTML nos renderizadores |
| 🟡 Média | **Feedback visual** (toasts/notificações) | Substituir `alert()` por algo mais elegante |
| 🟢 Baixa | **Exportar lista de compras** (CSV/PDF) | Facilitar ida ao supermercado |
| 🟢 Baixa | **Modo escuro** | Acessibilidade e conforto visual |
| 🟢 Baixa | **PWA** (Service Worker + manifest) | Uso offline e instalação como app |
| 🟢 Baixa | **Internacionalização (i18n)** | Suporte a múltiplos idiomas |

---

## 🤝 Contribuição

Contribuições são bem-vindas! Este é um projeto pessoal de aprendizado, então toda ajuda é valorizada.

1. **Fork** o repositório
2. Crie uma **branch** para sua feature (`git checkout -b feat/nova-feature`)
3. **Commit** suas mudanças (`git commit -m 'feat: adiciona nova funcionalidade'`)
4. **Push** para a branch (`git push origin feat/nova-feature`)
5. Abra um **Pull Request**

### Diretrizes

- Mantenha o estilo de código existente
- Use nomes descritivos em português ou inglês (consistente com o código atual)
- Teste manualmente no navegador antes de abrir o PR
- Atualize a documentação se necessário

---

## 📄 Licença

Distribuído sob a licença **MIT**. Veja o arquivo [LICENSE](LICENSE) para mais informações.

---

## 🙏 Agradecimentos

- [normalize.css](https://necolas.github.io/normalize.css/) — Reset CSS confiável
- [Google Fonts](https://fonts.google.com/) — Tipografia de qualidade

---

<div align="center">
  <sub>Construído com ❤️ e JavaScript puro — sem frameworks, sem atalhos.</sub>
</div>