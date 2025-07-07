<Table>
  <tr>
    <td><a href= "https://www.btgpactual.com/"><img src="img/logo-btg.png" alt="Centro Paula Souza" border="0"></td>
    <td>
      <a href= "https://www.inteli.edu.br/"><img src="img/logo-Inteli.png" alt="Inteli - Instituto de Tecnologia e Liderança" border="0"></a>
    </td>
  </tr>
</table>

# Nome do Projeto: INERI

## Nome do Grupo: INERI

## Integrantes:

<div align="center">
  <table>
    <tr>
      <td align="center">
        <a href="https://www.linkedin.com/in/daviversan/">
          <img style="border-radius: 0%;" src="img/gestao-de-configuracao/Davi%20D%27avila%20Versan.jpg" width="150px;" alt="Davi D'avila Versan"/><br>
          <sub><b>Davi D’avila Versan</b></sub>
        </a>
      </td>
      <td align="center">
        <a href="https://www.linkedin.com/in/iasmim-/">
          <img style="border-radius: 0%;" src="img/gestao-de-configuracao/Iasmim_Santos_Silva_de_Jesus.jpg" width="110px;" alt="Iasmim Santos Silva de Jesus"/><br>
          <sub><b>Iasmim Santos Silva de Jesus</b></sub>
        </a>
      </td>
      <td align="center">
        <a href="https://www.linkedin.com/in/kauanmassuia/">
          <img style="border-radius: 0%;" src="img/gestao-de-configuracao/Kauan%20Massuia.jpg" width="150px;" alt="Kauan Massuia"/><br>
          <sub><b>Kauan Massuia</b></sub>
        </a>
      </td>
      <td align="center">
        <a href="https://www.linkedin.com/in/milena-castro-vieira/">
          <img style="border-radius: 0%;" src="img/gestao-de-configuracao/Milena%20Aparecida%20Vieira%20Castro.jpg" width="110px;" alt="Milena Aparecida Vieira Castro"/><br>
          <sub><b>Milena Aparecida Vieira Castro</b></sub>
        </a>
      </td>
      <td align="center">
        <a href="https://www.linkedin.com/in/nicolasramons/">
          <img style="border-radius: 0%;" src="img/gestao-de-configuracao/Nicolas%20Ramon%20da%20Silva.jpg" width="150px;" alt="Nicolas Ramon da Silva"/><br>
          <sub><b>Nicolas Ramon da Silva</b></sub>
        </a>
      </td>
      <td align="center">
        <a href="https://www.linkedin.com/in/otavio-vasc/">
          <img style="border-radius: 0%;" src="img/gestao-de-configuracao/Otavio%20de%20Carvalho%20Vasconcelos.jpg" width="110px;" alt="Otávio de Carvalho Vasconcelos"/><br>
          <sub><b>Otávio de Carvalho Vasconcelos</b></sub>
        </a>
      </td>
      <td align="center">
        <a href="https://www.linkedin.com/in/rodrigo-lee/">
          <img style="border-radius: 0%;" src="img/gestao-de-configuracao/Rodrigo%20Hu%20Tchie%20Lee.jpg" width="150px;" alt="Rodrigo Hu Tchie Lee"/><br>
          <sub><b>Rodrigo Hu Tchie Lee</b></sub>
        </a>
      </td>
    </tr>
  </table>
</div>

# Sumário

- [Nome do Projeto: INERI](#nome-do-projeto-ineri)
  - [Nome do Grupo: ](#nome-do-grupo-)
  - [Integrantes:](#integrantes)
- [Sumário](#sumário)
- [1. Introdução](#1-introdução)
  - [1.1 Objetivo do Documento](#11-objetivo-do-documento)
- [2. Política de Branches](#2-política-de-branches)
  - [2.1 Visão Geral do Gitflow](#21-visão-geral-do-gitflow)
  - [2.2 Estrutura de Branches](#22-estrutura-de-branches)
  - [2.3 Diretrizes de Uso das Branches](#23-diretrizes-de-uso-das-branches)
- [3. Políticas de Commit](#3-políticas-de-commit)
- [4. Política de Push e Pull Requests](#4-política-de-push-e-pull-requests)
  - [5. Infraestrutura como Código](#5-infraestrutura-como-código)
  - [6. Gestão de Arquivos Sensíveis](#6-gestão-de-arquivos-sensíveis)
  - [7. Política de Rollback](#7-política-de-rollback)
  - [8. Registro de Variáveis de Ambiente](#8-registro-de-variáveis-de-ambiente)
- [Referências](#referências)

# 1. Introdução

&emsp; Neste documento descrevemos as práticas, convenções e regras que a equipe de desenvolvimento seguirá para garantir consistência, qualidade e segurança no nosso fluxo de trabalho com Git. Ao adotar padrões claros de nomenclatura de branches, revisões de código e proteção de branches principais, reduzimos riscos de regressões, facilitamos correções e aceleramos a entrega de valor ao usuário.

## 1.1 Objetivo do Documento

&emsp; Este documento estabelece diretrizes claras para a utilização de boas práticas no desenvolvimento de software, visando a organização e a qualidade do código. Todos os membros da equipe devem seguir as instruções definidas.

# 2. Política de Branches

&emsp;A política de branches é uma parte fundamental do fluxo de trabalho deste projeto, garantindo que o código seja organizado, versionado e entregue de maneira eficiente e consistente. A adoção de um modelo estruturado, como o Gitflow, permite que a equipe gerencie as diferentes fases do desenvolvimento de forma clara, minimizando conflitos entre versões e facilitando a colaboração entre os membros.

## 2.1 Visão Geral do Gitflow

&emsp; O Gitflow é um modelo de fluxo de trabalho amplamente utilizado no desenvolvimento de software para gerenciar branches de forma eficiente e organizada. Ele define uma estrutura clara para o ciclo de vida do desenvolvimento, desde a criação de novas funcionalidades até a entrega de versões estáveis para produção. Empresas renomadas, como Apple, Microsoft e Google , adotam o Gitflow em seus processos de desenvolvimento devido à sua capacidade de manter o código-fonte organizado, facilitar a colaboração entre os membros da equipe e reduzir o risco de conflitos durante o desenvolvimento.

## 2.2 Estrutura de Branches

Padrão de Nomenclatura das Branches:

> **main**: Contém o código pronto para produção.
> **dev**: Integração contínua das novas funcionalidades em desenvolvimento.
> **feature/[nome-da-feature]**: Para desenvolvimento de novas funcionalidades. Exemplo: feature/integracao-api
> **bugfix/[nome-do-bug]**: Para correção de bugs. Exemplo: bugfix/corrige-login
> **release/[versao]**: Preparação para lançamento de uma nova versão. Exemplo: release/v1.0.0
> **hotfix/[nome-do-hotfix]**: Correção urgente diretamente na produção. Exemplo: hotfix/corrige-bug-em-producao
> **chore/[descrição-da-tarefa]**: Para atividades de manutenção, configuração ou tarefas gerais que não alteram funcionalidades. Exemplo: chore/atualiza-dependencias

&emsp; A seguir, apresentamos o diagrama de estrutura de branches, que ilustra a hierarquia e o propósito de cada branch utilizada no nosso projeto. Essa estrutura foi projetada para garantir clareza, organização e eficiência no gerenciamento do código-fonte.

```bash
├── main                              # Código e documentação consolidados referentes à última sprint finalizada
│
│   └── hotfix/nome-do-hotfix         # Correção urgente aplicada diretamente na branch `main`
│
├── develop                           # Integração contínua das novas funcionalidades e documentação em desenvolvimento
│
│   ├── feature/nome-da-feature       # Nova funcionalidade sendo desenvolvida
│   │
│   ├── feature/outra-feature         # Outra funcionalidade em desenvolvimento
│   │
│   ├── chore/nome-da-tarefa          # Tarefa de manutenção, configuração ou atualização de dependências
│   │
│   ├── docs/nome-da-secao            # Documentação de uma seção específica do projeto
│   │
│   ├── docs/outra-secao              # Documentação de outra seção específica do projeto
│   │
│   ├── bugfix/nome-do-bug            # Correção não urgente de um bug
│   │
│   └── release/versao-x.y.z          # Preparação da versão mais atualizada e estável para lançamento da versão x.y.z
```

&emsp; Além disso, neste momento, não utilizaremos branches como `support`, `experiment`, `spike` ou `refactor`. Caso precisemos adotar outros tipos de branches, este documento será atualizado para refletir as mudanças e garantir que todos os membros da equipe estejam alinhados.

## 2.3 Diretrizes de Uso das Branches

- Cada nova funcionalidade deve ser desenvolvida em uma branch de feature criada a partir da branch develop.
  - Nomeação das branches de features deve seguir o padrão feature/[nome-da-feature].
- Todas as novas funcionalidades devem ser desenvolvidas em branches de features e integradas na branch develop através de pull requests.
- Commits diretos na branch main são proibidos!
  - Configurem o Github para proteger de commits direto para a main.
- Branches de hotfix devem ser criadas a partir da branch main para corrigir problemas críticos em produção.
  - Nomeação das branches de hotfix deve seguir o padrão hotfix/[nome-do-hotfix].

# 3. Políticas de Commit

Integrar "Conventional Commits" nas políticas de commit ajuda a manter um histórico de commits claro e estruturado, facilitando a automação de processos como geração de changelogs e versionamento semântico.
&emsp; Para garantir consistência e organização no gerenciamento das branches, estabelecemos diretrizes claras sobre como criar, nomear e utilizar cada tipo de branch no projeto. A tabela abaixo apresenta as diretrizes, descrições e padrões de nomenclatura adotados. Todas as branches, exceto hotfix, devem ser integradas à branch develop por meio de pull requests. Além disso, todas as branches devem seguir o padrão kebab-case.

| **Finalidade da branch**               | **Diretriz**                                                                                                                                                              | **Padrão de nomenclatura (kebab-case)** |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| **Desenvolvimento de Funcionalidades** | Cada nova funcionalidade deve ser desenvolvida em uma branch criada a partir da branch `develop`.                                                                         | `feature/[nome-da-feature]`             |
| **Documentação**                       | Branches para documentação devem ser criadas a partir da branch `develop`.                                                                                                | `docs/[nome-da-secao]`                  |
| **Manutenção / Tarefas Gerais**        | Branches para atividades de manutenção, configuração ou outras tarefas que não alteram features.                                                                          | `chore/[descrição-da-tarefa]`           |
| **Correção de Bugs**                   | Branches para correção de bugs não urgentes devem ser criadas a partir da branch `develop`.                                                                               | `bugfix/[nome-do-bug]`                  |
| **Preparação de Release**              | Branches de release devem ser criadas a partir da branch `develop` para testes finais antes de produção.                                                                  | `release/[versao]`                      |
| **Correções Críticas (Hotfix)**        | Branches de hotfix devem ser criadas a partir da branch `main` para corrigir problemas críticos. Após a correção, devem ser integradas tanto à `main` quanto à `develop`. | `hotfix/[nome-do-hotfix]`               |

Restrições e considerações adicionais:

- **Commits diretos nas branches `main` e `develop` são proibidos!**
  As branches `main` e `develop` estão configuradas para não aceitar commits diretamente. Para incluir alterações, é necessário abrir pull requests:

  - De qualquer branch de trabalho (feature, bugfix, chore, docs, release) para a branch `develop`.
  - Da branch `develop` para a branch `main`.
    Todos os pull requests devem ser revisados e aprovados, em sua versão mais recente, por no mínimo uma pessoa.

- **Adoção de novos padrões ou branches**:
  Qualquer novo padrão ou tipo de branch só deve ser adotado após aprovação do grupo e dos docentes envolvidos no projeto. Todas as mudanças devem ser documentadas neste documento.

# 3. Políticas de Commit

&emsp; Integrar "Conventional Commits" nas políticas de commit ajuda a manter um histórico de commits claro e estruturado, facilitando a automação de processos como geração de changelogs e versionamento semântico.

&emsp; As mensagens de commit devem seguir o padrão de Conventional Commits para garantir clareza e consistência.

Formato: [Tipo][Escopo opcional]: Mensagem clara e descritiva.

Os tipos devem ser:

> **feat**: Uma nova funcionalidade para o usuário.
> **fix**: Correção de bug.
> **docs**: Mudanças na documentação.
> **style**: Mudanças que não afetam o significado do código (espaços em branco, formatação, etc.).
> **refactor**: Uma mudança de código que não corrige um bug nem adiciona uma funcionalidade.
> **test**: Adição ou correção de testes.
> **chore**: Atualizações de tarefas de build ou ferramentas auxiliares e bibliotecas, como a geração de documentação.

### Exemplos de Commit

&emsp; A seguir, apresentamos uma tabela com exemplos de commits válidos e inválidos, acompanhados de suas respectivas justificativas para facilitar a compreensão do padrão Conventional Commits .

| **Tipo**        | **Exemplo**                               | **Justificativa**                                                                               |
| --------------- | ----------------------------------------- | ----------------------------------------------------------------------------------------------- |
| **Válido ✅**   | `feat(auth): adicionar feature de login`  | Segue o padrão Conventional Commits, com tipo, escopo e mensagem descritiva.                    |
| **Válido ✅**   | `docs: adicionar documentação da seção 3` | Segue o padrão Conventional Commits. O escopo é opcional, e sua ausência não invalida o commit. |
| **Inválido ❌** | `melhorias: ajustes no código`            | Inválido porque a mensagem é vaga e não segue o formato estruturado esperado.                   |
| **Inválido ❌** | `docs📝: adição da seção X`               | Inválido porque contém um emoji.                                                                |

### Considerações Importantes:

Proibido:

- O uso de emojis nas mensagens de commit, e commits com mensagens vagas como "melhorias" ou "atualizações".

IMPORTANTE!

- Realizar commits frequentes (diários) para facilitar o rastreamento de mudanças e a colaboração.

### Commits Frequentes e Validação de Padrões

> **É importante realizar commits frequentes**, preferencialmente diários, para facilitar o rastreamento de mudanças e promover uma colaboração eficiente.

&emsp; Para garantir consistência e qualidade no histórico de alterações, adotamos o seguinte fluxo:

1. **Husky** intercepta todo `git commit` e executa:

   - **Commitlint**, para validar se a mensagem segue o padrão Conventional Commits.
   - (Futuro) **StyleCop.Analyzers**, quando o projeto C# estiver criado, para validar convenções de código.

2. **Commitlint** bloqueia o commit caso a mensagem não esteja no formato Conventional Commits.


# 4. Política de Push e Pull Requests

**Políticas de Push**:

- Não é permitido fazer push diretamente para a main ou dev.
- Todas as contribuições devem ser feitas via branches e submetidas por meio de pull requests.

**Regras de Push**:

- Todo código deve passar por revisão de código por pares antes de ser mergeado.
- A revisão só deve ser aprovada se os testes automatizados forem bem-sucedidos e os critérios de qualidade (cobertura de testes, análise de código) forem atendidos.

**Revisão por Pares - Critério de Aprovação**:

- O pull request deve ser revisado por, no mínimo, uma pessoa.
- A revisão de código deve considerar:
  - Está funcional e resolve o problema proposto.
  - Passou em todos os testes automatizados.
  - Cobertura mínima de testes (60% ou mais).
  - Verificação de boas práticas de código.
  - Não introduz duplicidade de código.
- Após a aprovação, a branch deve ser mergeada na dev e o pull request pode ser fechado.
- O Scrum Master da Sprint é responsável por subir os artefatos para a MAIN ao final da Sprint.

## 5. Infraestrutura como Código

- Uso obrigatório de Docker para padronizar ambientes de desenvolvimento e produção.
- Incluir na raiz do repositório:
  - Dockerfile(s) para build de aplicações e serviços.
  - .dockerignore para excluir arquivos desnecessários do contexto de build.
  - docker-compose.yml para orquestrar múltiplos serviços/containers localmente.
- Cada serviço/contêiner deve ter seu próprio Dockerfile customizável, se necessário.
- O Docker Compose deve funcionar para rodar toda a stack do sistema localmente com um único comando (docker-compose up).

## 6. Gestão de Arquivos Sensíveis

- É obrigatório o uso de .gitignore bem configurado para bloquear:
  - Arquivos contendo senhas, segredos ou informações sensíveis.
  - Arquivos de configuração individuais (por exemplo, .env, configs locais, etc).
- Explicação/documentação das diferenças entre arquivos de configuração locais, de desenvolvimento e de produção (ex.: .env.local, .env.dev, .env.prod).
- Nunca commitar dados sensíveis ou credenciais diretamente no repositório.

## 7. Política de Rollback

- Documentar o processo básico para rollback de uma release defeituosa.
- Passos mínimos recomendados:
  - Identificar rapidamente a versão estável anterior (tag/release/commit).
  - Criar uma branch/selecione a tag da versão a ser restaurada.
  - Realizar o deploy dessa versão, conforme procedimento do time.
  - Comunicar o time e stakeholders sobre a reversão.
- Deixar esses procedimentos registrados no repositório (ex: docs/rollback.md).

## 8. Registro de Variáveis de Ambiente

- Obrigatório manter um arquivo .env.example documentando todas as variáveis de ambiente exigidas pela aplicação.
- O arquivo deve listar todas as keys (sem valores reais/sensíveis) e breve explicação de cada variável.
- Todos os membros devem usar esse exemplo para criar seus próprios arquivos .env locais.
- Exemplo:
  - DB_HOST= # Endereço do banco de dados
  - DB_USER= # Usuário do banco
  - DB_PASS= # Senha do banco (NUNCA commitada)
  - SECRET_KEY= # Chave secreta do sistema

# Referências

- Conventional Commits: https://www.conventionalcommits.org/en/v1.0.0/
- GitFlow: https://nvie.com/posts/a-successful-git-branching-model/
- Gitihub/iuricode: https://github.com/iuricode/padroes-de-commits
- Docker (documentação oficial): https://docs.docker.com/
- Best Practices for Writing Dockerfiles: https://docs.docker.com/develop/develop-images/dockerfile_best-practices/
- Docker Compose (documentação oficial): https://docs.docker.com/compose/
- .dockerignore Reference: https://docs.docker.com/engine/reference/builder/#dockerignore-file
- .gitignore (documentação oficial): https://git-scm.com/docs/gitignore
- gitignore.io (gerador de .gitignore para diferentes stacks): https://www.toptal.com/developers/gitignore/
- Handling secrets in Git repos (GitHub Guide): https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-and-storing-encrypted-secrets
- Creating a pull request template for your repository: https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/creating-a-pull-request-template-for-your-repository
- Exemplo de Checklists para PRs: https://github.com/othneildrew/Best-README-Template#pull-request-template
- Best Practices for Rollbacks (Atlassian): https://www.atlassian.com/continuous-delivery/principles/rollback-strategies
- How to Use Git Revert and Git Reset: https://www.git-tower.com/learn/git/faq/git-reset-vs-revert/
- 12 Factor App: Config: https://12factor.net/config
- Dotenv (Exemplo e uso de arquivos .env): https://github.com/motdotla/dotenv#usage