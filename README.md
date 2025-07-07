<Table>
  <tr>
   <td><a href= "https://www.btgpactual.com/"><img src="documentos/img/logo-btg.png" alt="Centro Paula Souza" border="0"></td>
       <td>
      <a href= "https://www.inteli.edu.br/"><img src="documentos/img/logo-Inteli.png" alt="Inteli - Instituto de Tecnologia e Liderança" border="0"></a>
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
          <img style="border-radius: 0%;" src="documentos/img/gestao-de-configuracao/Davi D&apos;avila Versan.jpg" width="150px;" alt="Davi D'avila Versan"/><br>
          <sub><b>Davi D’avila Versan</b></sub>
        </a>
      </td>
      <td align="center">
        <a href="https://www.linkedin.com/in/iasmim-/">
          <img style="border-radius: 0%;" src="documentos/img/gestao-de-configuracao/Iasmim_Santos_Silva_de_Jesus.jpg" width="110px;" alt="Iasmim Santos Silva de Jesus"/><br>
          <sub><b>Iasmim Santos Silva de Jesus</b></sub>
        </a>
      </td>
      <td align="center">
        <a href="https://www.linkedin.com/in/kauanmassuia/">
          <img style="border-radius: 0%;" src="documentos/img/gestao-de-configuracao/Kauan%20Massuia.jpg" width="150px;" alt="Kauan Massuia"/><br>
          <sub><b>Kauan Massuia</b></sub>
        </a>
      </td>
      <td align="center">
        <a href="https://www.linkedin.com/in/milena-castro-vieira/">
          <img style="border-radius: 0%;" src="documentos/img/gestao-de-configuracao/Milena%20Aparecida%20Vieira%20Castro.jpg" width="110px;" alt="Milena Aparecida Vieira Castro"/><br>
          <sub><b>Milena Aparecida Vieira Castro</b></sub>
        </a>
      </td>
      <td align="center">
        <a href="https://www.linkedin.com/in/nicolasramons/">
          <img style="border-radius: 0%;" src="documentos/img/gestao-de-configuracao/Nicolas%20Ramon%20da%20Silva.jpg" width="150px;" alt="Nicolas Ramon da Silva"/><br>
          <sub><b>Nicolas Ramon da Silva</b></sub>
        </a>
      </td>
      <td align="center">
        <a href="https://www.linkedin.com/in/otavio-vasc/">
          <img style="border-radius: 0%;" src="documentos/img/gestao-de-configuracao/Otavio%20de%20Carvalho%20Vasconcelos.jpg" width="110px;" alt="Otávio de Carvalho Vasconcelos"/><br>
          <sub><b>Otávio de Carvalho Vasconcelos</b></sub>
        </a>
      </td>
      <td align="center">
        <a href="https://www.linkedin.com/in/rodrigo-lee/">
          <img style="border-radius: 0%;" src="documentos/img/gestao-de-configuracao/Rodrigo%20Hu%20Tchie%20Lee.jpg" width="150px;" alt="Rodrigo Hu Tchie Lee"/><br>
          <sub><b>Rodrigo Hu Tchie Lee</b></sub>
        </a>
      </td>
    </tr>
  </table>
</div>

## Professores:

### Orientador(a)

- <a href="https://www.linkedin.com/in/vanunes/">Vanessa Nunes</a>

### Instrutores

- <a href="https://www.linkedin.com/in/ovidio-netto/">Computação - Ovidio Netto</a>
- <a href="https://www.linkedin.com/in/afonsolelis/">Computação - Afonso Cesar Lelis Brandão</a>
- <a href="https://www.linkedin.com/in/luciano-galdino-26191b36/">Matemática e Física - Luciano Galdino</a>
- <a href="https://www.linkedin.com/in/rafael-jacomossi-6135b0a1/">Negócios - Rafael Ricardo Jacomossi</a>
- <a href="https://www.linkedin.com/in/bruna-mayer/">Design - Bruna Mayer</a>
- <a href="https://www.linkedin.com/in/filipe-gon%C3%A7alves-08a55015b/">Liderança - Filipe Gonçalves</a>

## 📝 Descrição

&emsp; Projeto de sistemas distribuídos desenvolvido para um banco de investimentos, com o objetivo de analisar o perfil de investidores e recomendar produtos financeiros de forma personalizada. A solução envolve o uso de algoritmos de machine learning para segmentar clientes com base em seu comportamento e dados históricos, viabilizando estratégias como upselling e otimização de carteiras. A aplicação é estruturada com microsserviços e utiliza computação em nuvem para garantir escalabilidade e segurança no tratamento de dados sensíveis. Dessa forma, o processo de recomendação, que antes era generalista e manual, torna-se mais eficiente, automatizado e alinhado às necessidades individuais de cada cliente.

## 📝 LINKS

<a href="/documentos/Manual-instalacao.md">Link para o Manual de Instruções</a> que explica como montar, conectar e utilizar o protótipo.

<a href="/documentos/index.md">Link para a documentação geral</a> do projeto.

## 📁 Estrutura de pastas

```
|--> documentos
|    |--> img
|    |    └── (imagens relacionadas ao projeto)
|    |--> GestaoConfiguracao.md
|    |--> GestaoProjeto.md
|    |--> GuiaPadroesDesenvolvimento.md
|    |--> Index.md
|    |--> Manual-instalacao.md
|    └--> Projeto.md
|--> src
|    |--> aad
|    |--> api
|    |--> backend
|    |--> database
|    |    |--> init-db
|    |    |--> 01_create_database.sql
|    |    └--> 02_initial_data.sql
|    |--> data
|    |--> dataset
|    |--> frontend
|    |--> ml
|    |--> ml_service
|    |--> models
|    └--> teste.md
|--> .env
|--> docker-compose.yml
|--> Dockerfile
|--> readme.md
|--> .gitattributes
|--> .gitignore
|--> commitlint.config.cjs
|--> package-lock.json
|--> package.json
|--> README.md
|--> yarn.lock
```

Dentre os arquivos presentes na raiz do projeto, definem-se:

- <b>readme.md</b>: arquivo que serve como guia e explicação geral sobre o projeto (o mesmo que você está lendo agora).

- <b>documentos</b>: aqui estarão todos os documentos do projeto. Há também uma pasta denominada <b>outros</b> onde podem estar presentes documentos complementares à documentação principal.

- <b>img</b>: imagens relacionadas ao projeto como um todo (por exemplo imagens do sistema, do grupo, logotipos e afins).

- <b>src</b>: nesta pasta encontra-se todo o código fonte do sistema (circuito e eventuais sistemas complementares).

## 💻 Configuração para desenvolvimento

Para configurar o desenvolvimento da aplicação, [instale o git](https://git-scm.com/downloads) e clone esse repositório em seu computador através do comando:

```
git clone https://github.com/<endereco>
```

Em seguida siga as instruções presentes em nosso <a href="/documentos/manual-instalacao.md">manual de instalação</a>.

## 🗃 Histórico de lançamentos

- 0.1.0 - 30/04/2025
  - Entendimento do Projeto e do Negócio:
    &emsp;Foi realizado um Lean Inception para gerar este relatório em Markdown (Projeto.md), descrevendo o problema, o contexto, a visão e objetivo do produto, personas, fluxos de negócio, brainstorming e priorização de features, Canvas do MVP e a matriz de riscos.
  - Especificação de Requisitos funcionais e não funcionais:
    &emsp;Foi especificada a lista de requisitos funcionais e não funcionais (ISO 25010), cada um com ID único, descrição detalhada e testes de aceitação (pré-condição, procedimento, resultado esperado e pós-condição). Também foi criada uma tabela correlacionando RFs e RNFs. Tudo foi inserido no arquivo “Projeto.md”, na pasta docs do GitHub.
  - Gestão de Configuração:
    &emsp; Foi adotada a prática de Gitflow para organizar as branches (main, develop, feature, release, hotfix) no GitHub, definindo convenções de nomenclatura e procedimentos de criação e mesclagem.
  - Gestão evolutiva de projetos:
    &emsp;Foi realizada a gestão evolutiva do projeto, analisando pontos fortes e fracos da Sprint 1 e definindo melhorias. Foi entregue o planejamento inicial da Sprint 2 usando a métrica T-Shirt, alinhando-se aos critérios do Escritório de Projetos e às políticas de gestão de configuração.
- 0.2.0 - 16/05/2025
  - Modelagem de dados:
  &emsp;Foram criados os modelos conceitual, lógico e físico do banco de dados, incluindo entidades como cliente, assessor, perfil_investidor, recomendacao_ajuste, entre outras. Também foi especificado o modelo de dados necessário para alimentar o motor de recomendação.
  - Solução Técnica:
  &emsp;Foi definido o design técnico da aplicação, com os diagramas de classes, componentes e casos de uso em UML. A arquitetura técnica também incluiu a separação dos módulos de frontend (React Native), backend (C# .NET) e modelo de ML.
  - Modelo de recomendação baseado em filtragem colaborativa:
  &emsp;Foi iniciado o desenvolvimento do modelo de recomendação com filtragem colaborativa, utilizando dados do ModCloth e métricas de similaridade baseadas em vizinhos (kNN).
  - Projeto Visual da solução:
  &emsp;Foram desenvolvidos wireframes e mockups para as principais telas do aplicativo, incluindo Tela de Início, Tela de Simulação, Tela de Ajustes e componentes reutilizáveis como dropdowns e cards.
  - Gestão evolutiva de projetos:
  &emsp;Foi realizada a gestão evolutiva do projeto, analisando pontos fortes e fracos da Sprint 2 e definindo melhorias. Foi entregue o planejamento inicial da Sprint 3 usando a métrica T-Shirt, alinhando-se aos critérios do Escritório de Projetos e às políticas de gestão de configuração.
- 0.3.0 - 30/05/2025
  - Implementação do banco de dados:
  &emsp;Foi iniciado o desenvolvimento da base de dados no PostgreSQL com estrutura relacional completa, scripts de criação e vinculação entre tabelas com chaves estrangeiras e índices.
  - Desenvolvimento do projeto:
  &emsp;O backend .NET começou a expor as APIs REST, com implementação inicial das entidades e controladores principais. O frontend React Native foi estruturado com o padrão MVVM.
  - Planejamento de testes:
  &emsp;Foi definido o plano de testes (unitários, integração, usabilidade e RNFs), além da estratégia de TDD para backend e testes exploratórios para o modelo de recomendação.
  - Gestão evolutiva de projetos:
  &emsp;Foi realizada a gestão evolutiva do projeto, analisando pontos fortes e fracos da Sprint 3 e definindo melhorias. Foi entregue o planejamento inicial da Sprint 4 usando a métrica T-Shirt, alinhando-se aos critérios do Escritório de Projetos e às políticas de gestão de configuração.
- 0.4.0 - 13/06/2025
  - Desenvolvimento do projeto:
  &emsp;Foram implementadas funcionalidades como autenticação, exibição de clientes desenquadrados, visualização de perfil e sugestões de ativos para reenquadramento, integrando frontend e backend.
  - Evolução do banco de dados:
  &emsp;Novas migrações e ajustes de schema foram realizados para suportar requisitos como análise de perfil, regras de alocação e notificações.
  - Execução de testes:
  &emsp;Foram executados testes unitários e de integração no backend, testes exploratórios e testes de usabilidade com aplicação do questionário SUS. A cobertura mínima exigida foi alcançada.
  - Gestão evolutiva de projetos:
  &emsp;Foi realizada a gestão evolutiva do projeto, analisando pontos fortes e fracos da Sprint 4 e definindo melhorias. Foi entregue o planejamento inicial da Sprint 5 usando a métrica T-Shirt, alinhando-se aos critérios do Escritório de Projetos e às políticas de gestão de configuração.
- 0.5.0 - 26/06/2025
  - Desenvolvimento do projeto:
  &emsp;Finalização das funcionalidades restantes, como gráficos interativos, exportação de CSV/PDF e sugestões de clientes prioritários com base em perfis de atendimento configuráveis.
  - Execução de testes:
  &emsp;Conclusão dos testes funcionais, não funcionais e testes automatizados, incluindo testes via Postman, testes de RNFs e testes em dispositivos Android.
  - Versão final do projeto:
  &emsp;Foi concluída a entrega do MVP com documentação completa (Projeto.md, Swagger, guia de padrões, scripts SQL), vídeos de demonstração.
  - Gestão evolutiva de projetos:
  &emsp;Foi realizada a gestão evolutiva do projeto, analisando pontos fortes e fracos da Sprint 5 e definindo melhorias, alinhando-se aos critérios do Escritório de Projetos e às políticas de gestão de configuração.

## 📋 Licença/License

<p xmlns:cc="http://creativecommons.org/ns#" xmlns:dct="http://purl.org/dc/terms/">
  <a property="dct:title" rel="cc:attributionURL" href="https://github.com/Inteli-College/2025-1B-T13-ES06-G01">INERI</a>
  by
  <a rel="cc:attributionURL dct:creator" property="cc:attributionName" href="https://www.inteli.edu.br/"> INTELI,</a> <a rel="cc:attributionURL dct:creator" property="cc:attributionName" href="https://www.linkedin.com/in/daviversan/">Davi D’avila Versan,</a> <a rel="cc:attributionURL dct:creator" property="cc:attributionName" href="https://www.linkedin.com/in/iasmim-/">Iasmim Santos Silva de Jesus,</a> <a rel="cc:attributionURL dct:creator" property="cc:attributionName" href="https://www.linkedin.com/in/kauanmassuia/">Kauan Massuia,</a> <a rel="cc:attributionURL dct:creator" property="cc:attributionName" href="https://www.linkedin.com/in/milena-castro-vieira/">Milena Aparecida Vieira Castro,</a> <a rel="cc:attributionURL dct:creator" property="cc:attributionName" href="https://www.linkedin.com/in/nicolasramons/">Nicolas Ramon da Silva,</a> <a rel="cc:attributionURL dct:creator" property="cc:attributionName" href="https://www.linkedin.com/in/otavio-vasc/">Otávio de Carvalho Vasconcelos,</a> <a rel="cc:attributionURL dct:creator" property="cc:attributionName" href="https://www.linkedin.com/in/rodrigo-lee/">Rodrigo Hu Tchie Lee</a>
  is licensed under
  <a href="http://creativecommons.org/licenses/by/4.0/?ref=chooser-v1" target="_blank" rel="license noopener noreferrer" style="display:inline-block;">
    Attribution 4.0 International
    <img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/cc.svg?ref=chooser-v1" alt="CC logo">
    <img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/by.svg?ref=chooser-v1" alt="BY logo">
  </a>
</p>
