# Documentação do Banco de Dados INERI

## 1. Introdução

Este documento detalha a estrutura e a evolução do banco de dados PostgreSQL da INERI, fornecendo um dicionário de dados abrangente, as mudanças significativas entre as versões do esquema, e instruções para a configuração e implementação do ambiente. O objetivo é oferecer uma referência clara e atualizada para desenvolvedores e administradores de banco de dados.

## 2. Dicionário de Dados Detalhado

Este dicionário descreve de forma objetiva cada tabela, campo, tipo, restrição e relacionamento do modelo físico da base de dados, conforme as definições mais recentes. As tabelas são apresentadas em ordem alfabética para facilitar a consulta.

### Tabela: \_\_EFMigrationsHistory

| Campo          | Tipo         | Restrição    | Descrição                               |
| -------------- | ------------ | ------------ | --------------------------------------- |
| MigrationId    | VARCHAR(150) | PK, NOT NULL | Identificador único da migração.        |
| ProductVersion | VARCHAR(32)  | NOT NULL     | Versão do produto que gerou a migração. |

### Tabela: assessores

| Campo              | Tipo                              | Restrição | Descrição                                                  |
| ------------------ | --------------------------------- | --------- | ---------------------------------------------------------- |
| id                 | INTEGER                           | PK        | Identificador único do assessor.                           |
| nome               | VARCHAR(100)                      | NOT NULL  | Nome completo do assessor.                                 |
| email              | VARCHAR(100)                      | NOT NULL  | Endereço de e-mail do assessor.                            |
| categoria_assessor | ENUM('Gold', 'Prata', 'Platinum') | NOT NULL  | Categoria do assessor (Gold, Prata, Platinum).             |
| data_criacao       | TIMESTAMP WITH TIME ZONE          | NOT NULL  | Data e hora de criação do registro do assessor.            |
| ativo              | BOOLEAN                           | NOT NULL  | Indica se o assessor está ativo (TRUE) ou inativo (FALSE). |

### Tabela: ativos

| Campo         | Tipo                     | Restrição | Descrição                                               |
| ------------- | ------------------------ | --------- | ------------------------------------------------------- |
| id            | INTEGER                  | PK        | Identificador único do ativo.                           |
| codigo        | VARCHAR(10)              | NOT NULL  | Código de identificação do ativo.                       |
| nome          | VARCHAR(200)             | NOT NULL  | Nome completo do ativo.                                 |
| tipo          | VARCHAR(50)              | NOT NULL  | Tipo do ativo (ex: Ação, FII, Renda Fixa).              |
| preco_atual   | NUMERIC(18,2)            | NOT NULL  | Preço atual do ativo.                                   |
| risco         | NUMERIC(5,2)             | NOT NULL  | Nível de risco associado ao ativo.                      |
| rentabilidade | NUMERIC(5,2)             | NOT NULL  | Rentabilidade do ativo.                                 |
| data_criacao  | TIMESTAMP WITH TIME ZONE | NOT NULL  | Data e hora de criação do registro do ativo.            |
| ativo         | BOOLEAN                  | NOT NULL  | Indica se o ativo está ativo (TRUE) ou inativo (FALSE). |

### Tabela: clientes

| Campo           | Tipo                     | Restrição                                         | Descrição                                                 |
| --------------- | ------------------------ | ------------------------------------------------- | --------------------------------------------------------- |
| id              | INTEGER                  | PK                                                | Identificador único do cliente.                           |
| nome            | VARCHAR(100)             | NOT NULL                                          | Nome completo do cliente.                                 |
| email           | VARCHAR(100)             | NOT NULL                                          | Endereço de e-mail do cliente.                            |
| cpf             | VARCHAR(14)              | NOT NULL                                          | Cadastro de Pessoa Física do cliente.                     |
| data_nascimento | TIMESTAMP WITH TIME ZONE | NOT NULL                                          | Data de nascimento do cliente.                            |
| assessor_id     | INTEGER                  | NOT NULL, FK -> assessores(id) ON DELETE RESTRICT | Identificador do assessor responsável pelo cliente.       |
| data_criacao    | TIMESTAMP WITH TIME ZONE | NOT NULL                                          | Data e hora de criação do registro do cliente.            |
| ativo           | BOOLEAN                  | NOT NULL                                          | Indica se o cliente está ativo (TRUE) ou inativo (FALSE). |

### Tabela: historico_risco_calculado

| Campo           | Tipo                     | Restrição                                      | Descrição                                           |
| --------------- | ------------------------ | ---------------------------------------------- | --------------------------------------------------- |
| id              | INTEGER                  | PK                                             | Identificador único do registro de risco calculado. |
| cliente_id      | INTEGER                  | NOT NULL, FK -> clientes(id) ON DELETE CASCADE | Identificador do cliente associado.                 |
| risco_calculado | INTEGER                  | NOT NULL                                       | Valor do risco calculado.                           |
| dados_calculo   | JSONB                    | NOT NULL                                       | Dados detalhados utilizados no cálculo do risco.    |
| data_calculo    | TIMESTAMP WITH TIME ZONE | NOT NULL                                       | Data e hora em que o risco foi calculado.           |

### Tabela: historico_risco_declarado

| Campo                  | Tipo                     | Restrição                                      | Descrição                                                  |
| ---------------------- | ------------------------ | ---------------------------------------------- | ---------------------------------------------------------- |
| id                     | INTEGER                  | PK                                             | Identificador único do registro de risco declarado.        |
| cliente_id             | INTEGER                  | NOT NULL, FK -> clientes(id) ON DELETE CASCADE | Identificador do cliente associado.                        |
| risco_declarado        | INTEGER                  | NOT NULL                                       | Valor do risco declarado pelo cliente.                     |
| respostas_questionario | JSONB                    | NOT NULL                                       | Respostas do questionário que definiram o risco declarado. |
| data_declaracao        | TIMESTAMP WITH TIME ZONE | NOT NULL                                       | Data e hora em que o risco foi declarado.                  |

### Tabela: investimento

| Campo        | Tipo                     | Restrição                                      | Descrição                                             |
| ------------ | ------------------------ | ---------------------------------------------- | ----------------------------------------------------- |
| id           | INTEGER                  | PK                                             | Identificador único do investimento.                  |
| cliente_id   | INTEGER                  | NOT NULL, FK -> clientes(id) ON DELETE CASCADE | Identificador do cliente que realizou o investimento. |
| ativo_id     | INTEGER                  | NOT NULL, FK -> ativos(id) ON DELETE RESTRICT  | Identificador do ativo investido.                     |
| quantidade   | NUMERIC(18,6)            | NOT NULL                                       | Quantidade do ativo investido.                        |
| preco_compra | NUMERIC(18,2)            | NOT NULL                                       | Preço de compra do ativo no momento do investimento.  |
| data_compra  | TIMESTAMP WITH TIME ZONE | NOT NULL                                       | Data e hora da compra do ativo.                       |
| data_criacao | TIMESTAMP WITH TIME ZONE | NOT NULL                                       | Data e hora de criação do registro do investimento.   |

### Tabela: posicao_intelli_csv (tabela temporária)

| Campo           | Tipo         | Restrição | Descrição           |
| --------------- | ------------ | --------- | ------------------- |
| conta           | BIGINT       |           | Número da conta.    |
| financeiro      | NUMERIC      |           | Valor financeiro.   |
| quantidade      | NUMERIC      |           | Quantidade.         |
| nome_ativo      | VARCHAR(255) |           | Nome do ativo.      |
| tipo_ativo      | VARCHAR(255) |           | Tipo do ativo.      |
| perfil_carteira | VARCHAR(255) |           | Perfil da carteira. |

### Tabela: recomendacoes

| Campo               | Tipo                                    | Restrição                                      | Descrição                                                    |
| ------------------- | --------------------------------------- | ---------------------------------------------- | ------------------------------------------------------------ |
| id                  | INTEGER                                 | PK                                             | Identificador único da recomendação.                         |
| cliente_id          | INTEGER                                 | NOT NULL, FK -> clientes(id) ON DELETE CASCADE | Identificador do cliente para quem a recomendação foi feita. |
| ativo_id            | INTEGER                                 | NOT NULL, FK -> ativos(id) ON DELETE RESTRICT  | Identificador do ativo recomendado.                          |
| descricao           | VARCHAR(500)                            | NOT NULL                                       | Descrição detalhada da recomendação.                         |
| quantidade_sugerida | NUMERIC(18,6)                           | NOT NULL                                       | Quantidade sugerida do ativo.                                |
| status_recomendacao | ENUM('pendente', 'aceita', 'rejeitada') | NOT NULL                                       | Status atual da recomendação (pendente, aceita, rejeitada).  |
| data_criacao        | TIMESTAMP WITH TIME ZONE                | NOT NULL                                       | Data e hora de criação da recomendação.                      |
| data_atualizacao    | TIMESTAMP WITH TIME ZONE                |                                                | Data e hora da última atualização da recomendação.           |

### Tabela: recomendacoes_final_csv (tabela temporária)

| Campo                  | Tipo         | Restrição | Descrição                          |
| ---------------------- | ------------ | --------- | ---------------------------------- |
| conta                  | BIGINT       |           | Número da conta.                   |
| prop_fixa              | NUMERIC      |           | Proporção de renda fixa.           |
| prop_variavel          | NUMERIC      |           | Proporção de renda variável.       |
| prop_outros            | NUMERIC      |           | Proporção de outros investimentos. |
| nivel_desenquadramento | NUMERIC      |           | Nível de desenquadramento.         |
| nome_ativo             | VARCHAR(255) |           | Nome do ativo.                     |
| score                  | NUMERIC      |           | Score.                             |
| recomendacao_ajuste    | VARCHAR(255) |           | Recomendação de ajuste.            |

## 3. Evolução do Esquema e Otimizações

Esta seção detalha as mudanças significativas na estrutura do banco de dados entre a versão anterior e a atual, destacando as adições, remoções e modificações de tabelas, colunas e índices. As otimizações implementadas visam melhorar a performance e a integridade dos dados.

### 3.1. Resumo das Mudanças

As principais alterações no esquema incluem a introdução de tabelas temporárias para importação de dados CSV, a padronização de chaves primárias para `INTEGER GENERATED BY DEFAULT AS IDENTITY`, e a adição de novos campos para melhor rastreabilidade e controle. Além disso, foram adicionados índices para otimizar o desempenho de consultas.

### 3.2. Detalhamento das Alterações

#### Tabelas Adicionadas

As seguintes tabelas foram introduzidas no esquema atual:

- `posicao_intelli_csv`: Tabela temporária para importação de dados de posição de carteira.
- `recomendacoes_final_csv`: Tabela temporária para importação de dados de recomendações finais.

#### Tabelas Modificadas

As tabelas existentes passaram por diversas modificações em sua estrutura:

##### `assessores`

- **ID:** O tipo da coluna `id` foi alterado de `CHAR(26)` para `INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY`, padronizando o uso de chaves primárias auto-incrementais.
- **Colunas Adicionadas:**
  - `categoria_assessor`: Tipo `ENUM` para categorização do assessor.
  - `data_criacao`: `TIMESTAMP WITH TIME ZONE` para registrar a data de criação do registro.
  - `ativo`: `BOOLEAN` para indicar o status de atividade do assessor.
- **Colunas Removidas:** `telefone`, `sobrenome`, `cpf`, `rg`, `endereco`, `data_nascimento`, `categoria` (substituída por `categoria_assessor`), `unidade_btg`.

##### `ativos`

- **ID:** O tipo da coluna `id` foi alterado de `CHAR(26)` para `INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY`.
- **Colunas Adicionadas:**
  - `codigo`: `VARCHAR(10)` para um código de identificação do ativo.
  - `preco_atual`: `NUMERIC(18,2)` para o preço atual do ativo.
  - `risco`: `NUMERIC(5,2)` para o nível de risco do ativo.
  - `rentabilidade`: `NUMERIC(5,2)` para a rentabilidade do ativo.
  - `data_criacao`: `TIMESTAMP WITH TIME ZONE` para registrar a data de criação do registro.
  - `ativo`: `BOOLEAN` para indicar o status de atividade do ativo.
- **Colunas Removidas:** `subgrupo`.

##### `clientes`

- **ID:** O tipo da coluna `id` foi alterado de `CHAR(26)` para `INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY`.
- **data_nascimento:** O tipo da coluna `data_nascimento` foi alterado de `DATE` para `TIMESTAMP WITH TIME ZONE`.
- **Colunas Adicionadas:**
  - `assessor_id`: `INTEGER` com `FK -> assessores(id) ON DELETE RESTRICT` para vincular ao assessor.
  - `data_criacao`: `TIMESTAMP WITH TIME ZONE` para registrar a data de criação do registro.
  - `ativo`: `BOOLEAN` para indicar o status de atividade do cliente.
- **Colunas Removidas:** `telefone`, `sobrenome`, `rg`, `endereco`, `saldo_carteira`, `ultimo_contato`, `assessores_id` (substituída por `assessor_id`).

##### `historico_risco_calculado`

- **ID:** O tipo da coluna `id` foi alterado de `CHAR(26)` para `INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY`.
- **Colunas Adicionadas:**
  - `cliente_id`: `INTEGER` com `FK -> clientes(id) ON DELETE CASCADE`.
  - `risco_calculado`: `INTEGER` para o valor do risco calculado.
  - `dados_calculo`: `JSONB` para os dados detalhados do cálculo.
  - `data_calculo`: `TIMESTAMP WITH TIME ZONE` para a data do cálculo.
- **Colunas Removidas:** `risco`, `created_at`, `clientes_id` (substituída por `cliente_id`).

##### `historico_risco_declarado`

- **ID:** O tipo da coluna `id` foi alterado de `CHAR(26)` para `INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY`.
- **Colunas Adicionadas:**
  - `cliente_id`: `INTEGER` com `FK -> clientes(id) ON DELETE CASCADE`.
  - `risco_declarado`: `INTEGER` para o valor do risco declarado.
  - `respostas_questionario`: `JSONB` para as respostas do questionário.
  - `data_declaracao`: `TIMESTAMP WITH TIME ZONE` para a data da declaração.
- **Colunas Removidas:** `risco`, `created_at`, `clientes_id` (substituída por `cliente_id`).

##### `investimento`

- **ID:** O tipo da coluna `id` foi alterado de `CHAR(26)` para `INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY`.
- **quantidade:** O tipo da coluna `quantidade` foi alterado de `DOUBLE PRECISION` para `NUMERIC(18,6)`.
- **Colunas Adicionadas:**
  - `cliente_id`: `INTEGER` com `FK -> clientes(id) ON DELETE CASCADE`.
  - `ativo_id`: `INTEGER` com `FK -> ativos(id) ON DELETE RESTRICT`.
  - `preco_compra`: `NUMERIC(18,2)` para o preço de compra.
  - `data_compra`: `TIMESTAMP WITH TIME ZONE` para a data da compra.
  - `data_criacao`: `TIMESTAMP WITH TIME ZONE` para a data de criação do registro.
- **Colunas Removidas:** `ativos_id`, `clientes_id` (substituída por `cliente_id`), `valorTotal`.

##### `recomendacoes`

- **ID:** O tipo da coluna `id` foi alterado de `CHAR(26)` para `INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY`.
- **Colunas Adicionadas:**
  - `cliente_id`: `INTEGER` com `FK -> clientes(id) ON DELETE CASCADE`.
  - `ativo_id`: `INTEGER` com `FK -> ativos(id) ON DELETE RESTRICT`.
  - `quantidade_sugerida`: `NUMERIC(18,6)` para a quantidade sugerida.
  - `status_recomendacao`: `ENUM` para o status da recomendação.
  - `data_criacao`: `TIMESTAMP WITH TIME ZONE` para a data de criação.
  - `data_atualizacao`: `TIMESTAMP WITH TIME ZONE` para a data da última atualização.
- **Colunas Removidas:** `risco_calculado_id` (substituída por `cliente_id` e `ativo_id` para a relação), `clientes_id` (substituída por `cliente_id`), `descricao` (mantida, mas a descrição da mudança foi truncada na análise anterior), `data_recomendacao`, `status` (substituída por `status_recomendacao`).

#### Índices

Os seguintes índices foram adicionados para otimização de consultas:

- `IX_assessores_email` (UNIQUE) na tabela `assessores` na coluna `email`.
- `IX_ativos_codigo` (UNIQUE) na tabela `ativos` na coluna `codigo`.
- `IX_clientes_assessor` na tabela `clientes` na coluna `assessor_id`.
- `IX_clientes_cpf` (UNIQUE) na tabela `clientes` na coluna `cpf`.
- `IX_clientes_email` (UNIQUE) na tabela `clientes` na coluna `email`.
- `IX_hc_calc_cliente` na tabela `historico_risco_calculado` na coluna `cliente_id`.
- `IX_hc_decl_cliente` na tabela `historico_risco_declarado` na coluna `cliente_id`.
- `IX_inv_ativo` na tabela `investimento` na coluna `ativo_id`.
- `IX_inv_cliente` na tabela `investimento` na coluna `cliente_id`.
- `IX_rec_ativo` na tabela `recomendacoes` na coluna `ativo_id`.
- `IX_rec_cliente` na tabela `recomendacoes` na coluna `cliente_id`.

### 3.3. Funções e Triggers

As funções e triggers foram adaptadas para as novas chaves inteiras e para refletir as mudanças na estrutura das tabelas. As principais funções e triggers incluem:

- **`valida_cpf()`:** Função que limpa e valida o CPF, garantindo que ele tenha 11 dígitos numéricos. Associada aos triggers `trg_valida_cpf_clientes` e `trg_valida_cpf_assessores` nas tabelas `clientes` e `assessores`.
- **`valida_email()`:** Função que valida o formato básico de e-mail. Associada aos triggers `trg_valida_email_clientes` e `trg_valida_email_assessores` nas tabelas `clientes` e `assessores`.
- **`protege_assessor()`:** Função que impede a exclusão de um assessor que ainda possui clientes vinculados. Associada ao trigger `trg_protege_assessor` na tabela `assessores`.
- **`protege_cliente_com_investimentos()`:** Função que impede a exclusão de um cliente que possui investimentos ativos. Associada ao trigger `trg_protege_cliente_investimento` na tabela `clientes`.
- **`protege_ativo_com_investimentos()`:** Função que impede a exclusão de um ativo que está presente em investimentos. Associada ao trigger `trg_protege_ativo_investimento` na tabela `ativos`.
- **`transferir_cliente(p_cliente_id INT, p_novo_assessor_id INT)`:** Função para transferir um cliente de um assessor para outro.
- **`total_investido_cliente(p_cliente_id INT)`:** Função que retorna o total investido por um cliente.
- **`clientes_sem_contato(dias INT DEFAULT 30)`:** Função que lista clientes sem contato há mais de X dias.
- **`criar_recomendacao(p_cliente_id INT, p_ativo_id INT, p_descricao TEXT)`:** Função para criar uma nova recomendação.
- **`atualizar_status_recomendacao(p_recomendacao_id INT, p_novo_status status_recomendacao)`:** Procedure para atualizar o status de uma recomendação.

## 4. Instruções de Configuração e Implementação

Esta seção detalha as etapas necessárias para configurar e implementar o ambiente do banco de dados PostgreSQL da INERI, utilizando Docker e Docker Compose. Inclui a aplicação dos scripts SQL para a criação do esquema e a inserção de dados iniciais, bem como considerações para otimizações.

### 4.1. Pré-requisitos

Para configurar o ambiente do banco de dados, você precisará ter os seguintes softwares instalados em sua máquina:

- **Docker:** Uma plataforma para desenvolver, enviar e executar aplicativos em contêineres. [1]
- **Docker Compose:** Uma ferramenta para definir e executar aplicativos Docker de vários contêineres. [2]

### 4.2. Estrutura do Projeto

O projeto do banco de dados deve seguir a seguinte estrutura de diretórios:

```
database/
├── docker-compose.yml
├── Dockerfile
├── readme.md
└── init-db/
    ├── 01_create_database.sql
    ├── 02_initial_data.sql
    └── init-db.sh
```

- **`docker-compose.yml`**: Define o serviço do contêiner PostgreSQL, suas portas, volumes e dependência do arquivo `.env`.
- **`Dockerfile`**: (Opcional) Customização da imagem, se necessário.
- **`init-db/`**: Diretório crucial para a inicialização automática do banco de dados. Os scripts SQL dentro deste diretório são executados em ordem alfabética na primeira inicialização do contêiner.
  - **`01_create_database.sql`**: Contém o DDL (Data Definition Language) que define o modelo físico do banco de dados: tabelas, colunas, tipos, constraints, funções, triggers, etc.
  - **`02_initial_data.sql`**: Contém o DML (Data Manipulation Language) para popular o banco com dados iniciais após a criação da estrutura.
  - **`init-db.sh`**: (Opcional) Script shell que pode ser executado durante a inicialização para tarefas adicionais, como importação de dados CSV.

### 4.3. Configuração do Ambiente

1.  **Clone o Repositório:** Obtenha o código-fonte do projeto do banco de dados.

2.  **Crie o Arquivo `.env`:** Na raiz do diretório `database/`, crie um arquivo chamado `.env` e preencha-o com as seguintes variáveis de ambiente, substituindo os valores pelos seus próprios:

    ```
    POSTGRES_USER=seu_usuario
    POSTGRES_PASSWORD=sua_senha_segura
    POSTGRES_DB=seu_banco_de_dados
    PGADMIN_DEFAULT_EMAIL=seu_email@exemplo.com
    PGADMIN_DEFAULT_PASSWORD=sua_senha_pgadmin
    ```

3.  **Verifique os Scripts SQL:** Certifique-se de que os arquivos `01_create_database.sql` e `02_initial_data.sql` (e `init-db.sh` se aplicável) no diretório `init-db/` estão atualizados e contêm o esquema e os dados desejados.

### 4.4. Execução do Ambiente

Para iniciar o ambiente do banco de dados, navegue até o diretório `database/` no seu terminal e execute o seguinte comando:

```bash
docker-compose up -d
```

Este comando realizará as seguintes ações:

- Baixará a imagem `postgres:16` (se ainda não estiver presente).
- Criará e iniciará o contêiner do PostgreSQL.
- Mapeará a porta `5439` do contêiner para a porta `5433` na sua máquina host.
- Criará um volume nomeado `pgdata` para garantir a persistência dos dados do banco de dados.
- Na primeira execução, os scripts localizados em `init-db/` serão processados automaticamente para configurar o banco de dados (criação de tabelas, inserção de dados iniciais, etc.).

### 4.5. Acesso ao Banco de Dados

Após a inicialização bem-sucedida, você pode acessar o banco de dados utilizando as seguintes credenciais:

- **Host:** `10.140.0.16`
- **Porta:** `5439`
- **Usuário:** (Definido em `.env`, ex: `seu_usuario`)
- **Senha:** (Definida em `.env`, ex: `sua_senha_segura`)
- **Banco de Dados:** (Definido em `.env`, ex: `seu_banco_de_dados`)

### 4.6. Parando e Removendo o Ambiente

Para parar o contêiner do banco de dados, execute o seguinte comando no mesmo diretório `database/`:

```bash
docker-compose down
```

Para parar o contêiner e remover os dados persistidos (o volume `pgdata`), use:

```bash
docker-compose down --volumes
```

### 4.7. Otimizações e Considerações Adicionais

- **Índices:** Os índices adicionados (conforme detalhado na Seção 3.2) são cruciais para o desempenho das consultas. Certifique-se de que eles estão sendo criados corretamente durante a inicialização do banco.
- **Funções e Triggers:** As funções e triggers implementadas (conforme detalhado na Seção 3.3) garantem a integridade dos dados e automatizam processos importantes. Verifique se estão ativas e funcionando conforme o esperado.
- **Dados Iniciais:** O script `02_initial_data.sql` foi populado com dados reais.

## 5. Documentação de Testes de Carga - Banco Temporário

### Descrição

Este documento apresenta os resultados dos testes de carga realizados no banco temporário do Render durante a sprint. Os testes foram implementados devido a problemas encontrados no servidor principal, sendo necessário utilizar uma instância temporária para validar a performance do sistema.

Três scripts de teste de carga foram desenvolvidos e executados utilizando o **Pgbench** para avaliar diferentes cenários de uso do banco de dados.

### Configuração do Ambiente

### Conexão com o Banco Temporário

```bash
psql "host=dpg-d14sr0juibrs73c0go7g-a.oregon-postgres.render.com port=5432 dbname=ineri user=ineri_user password=QSnUvbJg3fhWoGVbGTpaU7kMIAILOfEB"
```

#### Preparação dos Testes

1. Entrar no diretório de teste:
   ```bash
   cd src/database/teste-carga
   ```

### Execução dos Testes

#### 1. Teste de Portfolio (`portfolio.sql`)

**Comando de execução:**

```bash
pgbench -h dpg-d14sr0juibrs73c0go7g-a.oregon-postgres.render.com -p 5432 -U ineri_user -d ineri -c 91 -j 8 -T 60 -f portfolio.sql --no-vacuum -P 1
```

**Resultados obtidos:**

- **Transações processadas:** 5.388
- **Transações falhadas:** 0 (0.000%)
- **Latência média:** 785.988 ms
- **Desvio padrão da latência:** 806.150 ms
- **Tempo de conexão inicial:** 13.990.637 ms
- **TPS:** 104.285443 (sem tempo de conexão inicial)
- **Duração:** 60s
- **Clientes simultâneos:** 91
- **Threads:** 8

#### 2. Teste de Risco do Cliente (`client_risk.sql`)

**Comando de execução:**

```bash
pgbench -h dpg-d14sr0juibrs73c0go7g-a.oregon-postgres.render.com -p 5432 -U ineri_user -d ineri -c 91 -j 8 -T 60 -f client_risk.sql --no-vacuum -P 1
```

**Resultados obtidos:**

- **Transações processadas:** 3.820
- **Transações falhadas:** 0 (0.000%)
- **Latência média:** 1.120.533 ms
- **Desvio padrão da latência:** 827.152 ms
- **Tempo de conexão inicial:** 13.827.622 ms
- **TPS:** 76.073894 (sem tempo de conexão inicial)
- **Duração:** 60s
- **Clientes simultâneos:** 91
- **Threads:** 8

#### 3. Teste de Atualização de Risco (`update_risk.sql`)

**Comando de execução:**

```bash
pgbench -h dpg-d14sr0juibrs73c0go7g-a.oregon-postgres.render.com -p 5432 -U ineri_user -d ineri -c 90 -j 8 -T 60 -f update_risk.sql --no-vacuum -P 1
```

**Resultados obtidos:**

- **Transações processadas:** 10.958
- **Transações falhadas:** 0 (0.000%)
- **Latência média:** 383.278 ms
- **Desvio padrão da latência:** 192.933 ms
- **Tempo de conexão inicial:** 13.721.205 ms
- **TPS:** 222.652211 (sem tempo de conexão inicial)
- **Duração:** 60s
- **Clientes simultâneos:** 90
- **Threads:** 8

### Análise dos Resultados

#### Performance Comparativa

| Teste       | TPS    | Latência Média (ms) | Transações Processadas |
| ----------- | ------ | ------------------- | ---------------------- |
| Portfolio   | 104.29 | 785.98              | 5.388                  |
| Client Risk | 76.07  | 1.120.53            | 3.820                  |
| Update Risk | 222.65 | 383.28              | 10.958                 |

#### Observações Importantes

1. **Limitação do Render:** O número de clientes simultâneos foi limitado a aproximadamente 90-91 devido às restrições da plataforma Render.

2. **Tempo de Conexão Inicial:** Todos os testes apresentaram um tempo de conexão inicial elevado (aproximadamente 13-14 segundos), característico de conexões remotas.

3. **Taxa de Falha:** Todos os testes apresentaram 0% de falhas, indicando estabilidade do sistema sob carga.

4. **Melhor Performance:** O teste `update_risk.sql` apresentou a melhor performance com 222.65 TPS e menor latência média.

5. **Pior Performance:** O teste `client_risk.sql` apresentou a menor performance com 76.07 TPS e maior latência média.

#### Limitações Técnicas

- **Conexões Simultâneas:** Limitadas pela infraestrutura do Render (que tivemos que usar devido a queda do banco)
- **Latência de Rede:** Impacto significativo devido à localização geográfica do servidor
- **Recursos Computacionais:** Limitados pelo plano utilizado no Render

&emsp; Os testes de carga demonstraram que o sistema mantém estabilidade mesmo sob alta carga, com 0% de transações falhadas em todos os cenários. A performance varia significativamente entre diferentes tipos de operações, sendo as operações de atualização de risco as mais eficientes e as consultas de risco do cliente as mais custosas em termos de latência.

## Planos de Execução - EXPLAIN ANALYZE

### Descrição

Análise dos planos de execução das queries principais utilizando EXPLAIN ANALYZE no PostgreSQL para documentar a eficácia das consultas SQL.

**Localização:** `database/queries/explain_analyze/`

### Resultados das Queries

#### 1. cliente_por_assessor.sql

```
Nested Loop (cost=0.00..2.13 rows=2 width=92) (actual time=0.008..0.010 rows=2 loops=1)
Planning Time: 0.384 ms
Execution Time: 0.034 ms
```

**Análise:** Query otimizada com Nested Loop eficiente. Execução rápida (0.034ms).

#### 2. portfolio_clientes.sql

```
Nested Loop (cost=1.21..3.49 rows=3 width=98) (actual time=0.059..0.069 rows=3 loops=1)
-> Hash Join (cost=1.21..2.39 rows=3 width=50) (actual time=0.043..0.049 rows=3 loops=1)
   Hash Cond: (at.id = i.ativo_id)
   Memory Usage: 9kB
Planning Time: 1.962 ms
Execution Time: 0.144 ms
```

**Análise:** Hash Join eficiente com baixo uso de memória (9kB). Performance adequada.

#### 3. clientes_por_faixa_risco.sql

```
Sort (cost=4.85..4.86 rows=1 width=60) (actual time=0.075..0.076 rows=2 loops=1)
Sort Method: quicksort Memory: 25kB
-> GroupAggregate (cost=4.76..4.84 rows=1 width=60) (actual time=0.061..0.064 rows=2 loops=1)
Planning Time: 0.656 ms
Execution Time: 0.124 ms
```

**Análise:** Query complexa com múltiplas tabelas. QuickSort otimizado com 25kB de memória.

#### 4. ativos_populares.sql

```
Sort (cost=3.17..3.20 rows=10 width=106) (actual time=0.056..0.057 rows=10 loops=1)
Sort Method: quicksort Memory: 25kB
-> GroupAggregate (cost=2.68..3.00 rows=10 width=106) (actual time=0.038..0.047 rows=10 loops=1)
Planning Time: 0.343 ms
Execution Time: 0.103 ms
```

**Análise:** Agregação eficiente com ordenação otimizada. Boa performance para relatórios.

#### 5. ranking_investidores_volume_investido.sql

```
Sort (cost=5.30..5.31 rows=4 width=56) (actual time=0.078..0.079 rows=4 loops=1)
Sort Method: quicksort Memory: 25kB
-> GroupAggregate (cost=5.03..5.26 rows=4 width=56) (actual time=0.062..0.067 rows=4 loops=1)
Planning Time: 0.662 ms
Execution Time: 0.133 ms
```

**Análise:** Query com maior custo (5.30) mas ainda eficiente. Múltiplos Hash Joins otimizados.

### Resumo de Performance

| Query                    | Execution Time | Planning Time | Status   |
| ------------------------ | -------------- | ------------- | -------- |
| cliente_por_assessor     | 0.034ms        | 0.384ms       | ✅ Ótima |
| portfolio_clientes       | 0.144ms        | 1.962ms       | ✅ Boa   |
| clientes_por_faixa_risco | 0.124ms        | 0.656ms       | ✅ Boa   |
| ativos_populares         | 0.103ms        | 0.343ms       | ✅ Ótima |
| ranking_investidores     | 0.133ms        | 0.662ms       | ✅ Boa   |

### Eficácia das Consultas

**✅ Pontos Positivos:**

- Todas as queries executam em < 0.2ms
- Hash Joins eficientes com baixo uso de memória
- Sequential Scans apropriados para o volume atual
- Algoritmos de ordenação otimizados (QuickSort)

**📈 Para Escala Futura:**

- Considerar índices quando volume > 10k registros
- Monitorar performance com crescimento dos dados
- Implementar cache para queries frequentes
