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

---

# Manual de Instalação e Execução do Projeto

Este manual explica como montar, conectar e utilizar o protótipo INERI, incluindo instruções para rodar a API, Backend, Frontend e o ambiente completo via Docker Compose.

## 1. Pré-requisitos

- **Docker** e **Docker Compose** (https://docs.docker.com/get-docker/)
- **.NET 9.0 SDK** (https://dotnet.microsoft.com/en-us/download)
- **Node.js** (https://nodejs.org/) e **Expo CLI** (https://docs.expo.dev/get-started/installation/) para desenvolvimento local do frontend

## 2. Configuração de Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis (ajuste conforme necessário):

```
DB_USER=usuario
DB_PASSWORD=senha_segura
DB_NAME=ineri_db
```

Essas variáveis são usadas pelo Docker Compose para configurar o banco de dados PostgreSQL.

> **Importante:** Nunca suba arquivos `.env` com senhas reais para o repositório.

## 3. Executando Tudo com Docker Compose

O modo mais simples de rodar toda a stack (banco, backend, API e frontend) é usando Docker Compose.

### Passos:

1. Certifique-se de que o Docker está rodando.
2. Na raiz do projeto, execute:

```bash
docker-compose up --build
```

3. Aguarde até que todos os serviços estejam prontos. O Docker Compose irá:
   - Subir o banco de dados PostgreSQL (porta 5439)
   - Subir o Backend (.NET, porta 8765)
   - Subir a API (.NET, porta 8767)
   - Subir o Frontend (Expo, portas 8769/19000, 8770/19001, 8771/19002)

4. Para parar tudo:
```bash
docker-compose down
```

## 4. Execução Manual de Cada Serviço (Desenvolvimento)

### 4.1 Banco de Dados

Você pode rodar o banco manualmente usando o Docker Compose do diretório `src/database/` ou o serviço `db` do compose principal.

### 4.2 Backend (.NET)

```bash
cd src/backend
# Configure a string de conexão em appsettings.json ou via variável de ambiente
# Exemplo de conexão local:
# "Host=localhost;Database=ineri_db;Username=usuario;Password=senha_segura;Port=5439;"

# Aplicar migrações (primeira vez)
dotnet tool install --global dotnet-ef # se necessário
dotnet ef database update

# Rodar servidor de desenvolvimento
./start-dev.sh
# ou
export ASPNETCORE_ENVIRONMENT=Development
dotnet run --urls="http://localhost:5000"
```

### 4.3 API (.NET)

```bash
cd src/api
# Ajuste appsettings.json se necessário (ex: caminho do DuckDB)
dotnet run
```

### 4.4 Frontend (Expo/React Native)

```bash
cd src/frontend
npm install
npx expo start
```

- Use o app Expo Go no celular ou emulador para acessar o QR code.

## 5. Estrutura de Portas e Serviços

- **Banco de Dados:** localhost:5439
- **Backend:** localhost:8765 (ou 5000 em dev local)
- **API:** localhost:8767
- **Frontend (Expo):** localhost:8769 (19000), 8770 (19001), 8771 (19002)

## 6. Observações Importantes

- Certifique-se de que as portas acima estejam livres.
- O arquivo `docker-compose.yml` orquestra todos os serviços.
- Os arquivos de configuração (`appsettings.json`, `.env`) devem ser revisados conforme o ambiente.
- Para desenvolvimento, recomenda-se rodar cada serviço separadamente para facilitar o debug.
- Para produção, utilize sempre o Docker Compose.

## 7. Solução de Problemas Comuns

- **Porta em uso:** Finalize processos que estejam usando as portas necessárias.
- **Banco não conecta:** Verifique variáveis do `.env` e se o serviço `db` está saudável.
- **Frontend não abre:** Certifique-se de que o Expo está rodando e as dependências estão instaladas.

---
