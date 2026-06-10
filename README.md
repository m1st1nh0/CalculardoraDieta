# Calculadora de Dietas

> Planejador semanal de refeições — JavaScript puro, zero dependências.

---

## Funcionalidades Implementadas

- Criação automática de 7 dias (Segunda-feira a Domingo)
- Adição de refeições a dias específicos (limite de 5 refeições por dia)
- Adição de ingredientes com quantidade em gramas a cada refeição
- Exclusão de refeições e ingredientes individuais
- Visualização dos ingredientes de cada refeição com toggle expandir/recolher
- Painel com totais semanais de cada ingrediente
- Fluxo em dois modais: nome da refeição e ingredientes
- Navegação entre modais (avançar/voltar/fechar)
- Validação de entrada nos modelos de domínio

---

## Stack Tecnológica

| Categoria | Tecnologia |
|-----------|------------|
| Linguagem | JavaScript (ES Modules) |
| Marcação | HTML5 |
| Estilo | CSS3 |
| CSS Reset | normalize.css v8.0.1 |
| Tipografia | Google Fonts (Fascinate, Lato, Roboto, Work Sans) |
| Gerenciamento de Estado | StateManager (implementação própria com padrão Observer) |
| Build | Nenhum |

---

## Arquitetura

O código está organizado em camadas com separação de responsabilidades:

```
main.js        — Composição raiz e delegador de eventos
app/           — Orquestração e estado global
models/        — Domínio (regras de negócio sem dependência do DOM)
render/        — Renderização do DOM
ui/            — Interação do usuário (modais e formulários)
services/      — Cálculos sobre os dados
```

Não foi possível identificar claramente um padrão arquitetural formal na implementação atual. Observa-se separação em camadas (domínio, aplicação, apresentação, interação) e uso de ES Modules.

### Modelo de Domínio

```
PlanoSemanal
  └── Dia (7 instâncias: Segunda-feira a Domingo)
        └── Refeicao (até 5 por dia)
              └── ItemRefeicao (ingrediente + peso)
                    └── Ingrediente (nome)
```

---

## Estrutura do Projeto

```
CalculadoraDieta/
├── index.html
├── main.js
├── styles.css
├── normalize.css
├── app/
│   ├── estados.js            — StateManager e instância global
│   ├── atualizarKanban.js    — Orquestra renderização completa
│   └── limparTela.js         — Limpa conteúdo do elemento kanban
├── models/
│   ├── PlanoSemanal.js       — Agregado raiz com 7 dias
│   ├── Dia.js                — Dia da semana com refeições
│   ├── Refeicao.js           — Refeição com itens
│   ├── ItemRefeicao.js       — Item com ingrediente e peso
│   └── Ingrediente.js        — Ingrediente (nome)
├── render/
│   ├── renderizarSemana.js   — Itera dias e renderiza cada um
│   ├── renderizarDia.js      — Cria coluna visual do dia
│   ├── renderizarRefeicoes.js— Renderiza refeições com toggle
│   ├── renderizarItemRefeicao.js — Tabela de ingredientes no modal
│   ├── renderizarModal.js    — Conteúdo HTML dos modais
│   ├── renderizarBotao.js    — Botão "+" para adicionar refeição
│   └── renderizarTotais.js   — Painel de totais semanais
├── services/
│   └── calcularTotais.js     — Agrega pesos dos ingredientes
└── ui/
    ├── modal.js              — Abertura, fechamento e navegação de modais
    └── refeicaoForm.js       — Criação de refeições e itens
```

### Descrição dos Diretórios

| Diretório | Responsabilidade |
|-----------|------------------|
| `app/` | Orquestração da aplicação e estado global reativo |
| `models/` | Classes de domínio com regras de negócio, sem dependência do DOM |
| `render/` | Funções que constroem e atualizam elementos do DOM |
| `ui/` | Controle de modais, formulários e interação do usuário |
| `services/` | Funções de cálculo sobre os dados do domínio |

---

## Pré-requisitos

- Navegador web com suporte a ES Modules (Chrome, Firefox, Edge, Safari — versões a partir de 2020)
- Nenhuma dependência de runtime (Node.js, npm, Docker)

---

## Instalação

```
git clone https://github.com/m1st1nh0/CalculardoraDieta.git
cd CalculardoraDieta
```

---

## Configuração

Não foi possível identificar arquivos de configuração no código analisado. O projeto não possui variáveis de ambiente ou arquivos de configuração.

---

## Execução

O projeto deve ser servido por um servidor HTTP devido ao uso de ES Modules (`type="module"`). Abra o arquivo `index.html` via servidor local.

Opções:

- VS Code com extensão Live Server: clique com o botão direito em `index.html` → "Open with Live Server"
- Qualquer servidor HTTP estático (Python http.server, http-server, etc.)

---

## Scripts Disponíveis

Não foi possível identificar scripts de automação no código analisado.

---

## API

Não foi possível identificar endpoints de API. A aplicação é 100% client-side e não realiza requisições de rede.

---

## Banco de Dados

Não foi possível identificar banco de dados, ORM ou sistema de persistência. Todos os dados são mantidos em memória durante a sessão do navegador.

---

## Testes

Não foi possível identificar infraestrutura de testes automatizados no código analisado.

---

## Docker

Não foi possível identificar arquivos Docker (Dockerfile, docker-compose.yml) no código analisado.

---

## CI/CD

Não foi possível identificar pipelines de CI/CD no código analisado.

---

## Segurança

- `Ingrediente`, `Refeicao` e `ItemRefeicao` validam parâmetros no construtor
- `ItemRefeicao.validarPeso` rejeita valores não numéricos, menores ou iguais a zero
- Tratamento de erros com `try/catch` e `alert()` nos formulários
- Não foi possível identificar mecanismos de autenticação ou autorização

---

## Limitações Identificadas

- Os dados são perdidos ao recarregar a página (ausência de persistência)
- Não foram encontrados testes automatizados
- O parâmetro `calorias` no construtor de `Ingrediente` não é utilizado na interface ou nos cálculos de totais
- `console.log()` presente em `ui/refeicaoForm.js` e `render/renderizarRefeicoes.js` para depuração

---

## Licença

Distribuído sob licença MIT. Consulte o arquivo [`LICENSE`](LICENSE).
</write_to_file>