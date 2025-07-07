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



# 1. Introdução

## 1.1 Objetivo do Documento

Este documento apresenta estabelecer padrões de codificação e práticas de desenvolvimento para garantir a qualidade e a consistência do código.

Nota: Explicar a importância de seguir padrões de desenvolvimento para facilitar a manutenção, melhorar a legibilidade e promover a colaboração.

# 2. Padrões de Codificação

## 2.1 Naming Conventions


## Disposições Gerais

Este documento define os padrões e convenções de codificação utilizados no projeto Ineri, que utiliza **React Native com TypeScript** no frontend, **.NET** no backend, **integração com modelos de Machine Learning em ML.NET** e banco de dados **PostgreSQL**.


### Frontend - React Native com TypeScript


&emsp;Esta seção descreve as convenções recomendadas para nomeação de arquivos, pastas, componentes, funções, variáveis e outros elementos em projetos React Native, visando garantir legibilidade, manutenibilidade e consistência em todo o código.

---

#### 1. Arquivos e Pastas

- **kebab-case** (letras minúsculas separadas por hífen) para nomes de arquivos e pastas.
  - Exemplo: `user-profile.screen.tsx`, `auth.service.ts`
- **Sufixos** para indicar o tipo do elemento:
  - `.screen.tsx` para telas
  - `.component.tsx` para componentes
  - `.hook.ts` para hooks customizados
  - `.context.tsx` para contextos
- **Evitar abreviações** para garantir clareza.

---

#### 2. Componentes

- **PascalCase** para nomes de componentes.
  - Exemplo: `UserProfile`, `LoginScreen`
- **Sempre iniciar o nome do componente com letra maiúscula**.
- **Nomes descritivos** que refletem a função do componente.
- **Para telas**, utilizar o sufixo `Screen` (exemplo: `LoginScreen`).

---

#### 3. Hooks Customizados

- **Prefixados com `use`** seguido de PascalCase.
  - Exemplo: `useUserAuth`, `useFetch`
- **Nome do arquivo**: `use-user-auth.hook.ts`
- **Sempre utilizados em camelCase** na prática, mas o nome do hook em si segue a convenção acima.

---

#### 4. Variáveis e Funções

- **camelCase** para variáveis, funções e métodos.
  - Exemplo: `userToken`, `getUserProfile`, `handleLogin`
- **Evitar abreviações** para facilitar a compreensão do código.

---

#### 5. Constantes

- **UPPER_CASE_SNAKE_CASE** (todas as letras maiúsculas, separadas por underline).
  - Exemplo: `MAX_LOGIN_ATTEMPTS`, `API_BASE_URL`

---

#### 6. Classes e Interfaces

- **PascalCase** para classes e interfaces.
  - Exemplo: `AuthManager`, `UserProfile`

---

#### 7. Testes Unitários

- **Sufixo `.spec.ts`, `.spec.tsx`, `.test.ts` ou `.test.tsx`** para arquivos de teste.
  - Exemplo: `user-profile.screen.spec.tsx`, `auth.service.spec.ts`, `ButtonComponent.test.tsx`

---

#### 8. Organização de Pastas

- **Agrupar arquivos por funcionalidade** (exemplo: `/screens`, `/components`, `/hooks`, `/services`).
- **Cada componente/serviço/hook em seu próprio arquivo** (regra do "um por arquivo").
- **Pastas específicas** para contextos globais (`/context`), hooks customizados (`/hooks`), serviços (`/services`).

---

#### 9. Resumo das Convenções

| Elemento                | Convenção de Nomeação      | Exemplo                       |
|-------------------------|---------------------------|-------------------------------|
| Arquivo/Pasta           | kebab-case                | `user-profile.screen.tsx`     |
| Componente              | PascalCase                | `UserProfile`, `LoginScreen`  |
| Hook customizado        | `use` + PascalCase        | `useUserAuth`                 |
| Variável/Função         | camelCase                 | `userToken`, `getUserProfile` |
| Constante               | UPPER_CASE_SNAKE_CASE     | `MAX_LOGIN_ATTEMPTS`          |
| Classe/Interface        | PascalCase                | `AuthManager`, `UserProfile`  |
| Teste unitário          | `.spec.ts(x)`             | `user-profile.screen.spec.tsx`|


---

### Backend - .NET 7 (C#)

#### Rule of One

Cada controller, serviço ou modelo deve estar em seu próprio arquivo.

#### Nomes de arquivos

- **PascalCase** e um sufixo indicando a função:

```cs
UserController.cs
UserService.cs
UserRepository.cs
User.cs
UserDto.cs
```

#### Convenções para classes e interfaces

- Classes: **PascalCase**
- Interfaces: prefixadas com **I** e PascalCase

```cs
public interface IUserService { }
public class UserService : IUserService { }
```

#### Variáveis e Funções

- **camelCase** para variáveis privadas e parâmetros:

```cs
private string userName;
public void GetUser(string userId) { ... }
```

#### Constantes

- **UPPER_CASE com underscores**

```cs
public const int MAX_USERS = 1000;
```

#### Testes Unitários (xUnit ou NUnit)

- Arquivo de teste deve espelhar o nome da classe testada, com sufixo `Tests`:

```cs
UserServiceTests.cs
UserControllerTests.cs
```

---

###  Integração com Modelo (ML Models)

- Os modelos treinados devem ser salvos no formato `.pkl` ou `.zip` dentro da pasta `ML/`
- Nome da classe integradora: `ModelRunner.cs`
- Nome dos modelos: `nome-do-modelo.pkl` (kebab-case)

---


### Docker

- Cada módulo possui seu próprio `Dockerfile`
- Imagens devem seguir convenção de nome:

```bash
docker build -t ineri-frontend .
```

- Usar `docker-compose.yml` para orquestração local entre os módulos

---


## 2.2 Formatação de Código

- Indentação: Utilize 2 espaços para indentação.
- Linhas: Mantenha o comprimento das linhas em até 80 caracteres.
- Chaves: Coloque chaves de abertura na mesma linha.
  - Exemplo:
    ```
    if (condition) {
        // código
    }
    ```

## 2.3 Comentários e Documentação

- Comentários de Linha: Use para explicar lógica complexa.
  - Exemplo: // Calcula o total com desconto

- Comentários de Bloco: Use para documentar funções e classes com JSDoc.
  - Exemplo: 
    ```
    /**
    * Calcula o total de um pedido.
    * @param {number} price - Preço do item.
    * @param {number} quantity - Quantidade do item.
    * @returns {number} Total calculado.
    */
    function calculateTotal(price, quantity) {
        return price * quantity;
    }
    ```

- Documentação da API
  - Utilizar SWAGGER para documentação da API a partir dos comentários do código.
  - Configure uma rota, como /api-docs, para que a documentação gerada pelo Swagger seja facilmente acessível aos desenvolvedores e stakeholders.

# 3. Padrões de Projeto

## 3.1 Design Patterns

_Opcionalmente, o grupo pode definir um ou mais design patterns para serem adotados, como forma de exercitarem tipos de solução para problemas/situações recorrentes_
_Sugestão de leitura: https://refactoring.guru/_

### Factory Method (Padrão Criacional)


&emsp;O Factory Method é indicado em situações em que o sistema precisa criar diferentes tipos de objetos, mas sem que o cliente (classe que solicita a criação) precise conhecer em detalhes qual objeto será instanciado. No contexto deste projeto, que envolve a classificação de perfis de investidor conforme diferentes regras (como a Resolução CVM 175), o Factory Method permite que novos classificadores sejam adicionados facilmente, sem modificar o código existente.

**Benefícios para o projeto:**

- **Flexibilidade e extensibilidade:** Facilita a inclusão de novas regras de classificação ou algoritmos no futuro.
- **Desacoplamento:** O cliente não precisa conhecer as classes concretas dos classificadores, apenas a interface comum.
- **Manutenção simplificada:** Mudanças ou adições de regras não afetam o código cliente.

**Exemplo em C#:**

```
using System;

namespace RefactoringGuru.DesignPatterns.FactoryMethod.Conceptual
{
   
    abstract class Creator
    {
        
        public abstract IProduct FactoryMethod();
        public string SomeOperation()
        {
            // Call the factory method to create a Product object.
            var product = FactoryMethod();
            // Now, use the product.
            var result = "Creator: The same creator's code has just worked with "
                + product.Operation();

            return result;
        }
    }

    class ConcreteCreator1 : Creator
    {
        
        public override IProduct FactoryMethod()
        {
            return new ConcreteProduct1();
        }
    }

    class ConcreteCreator2 : Creator
    {
        public override IProduct FactoryMethod()
        {
            return new ConcreteProduct2();
        }
    }

    public interface IProduct
    {
        string Operation();
    }

    class ConcreteProduct1 : IProduct
    {
        public string Operation()
        {
            return "{Result of ConcreteProduct1}";
        }
    }

    class ConcreteProduct2 : IProduct
    {
        public string Operation()
        {
            return "{Result of ConcreteProduct2}";
        }
    }

    class Client
    {
        public void Main()
        {
            Console.WriteLine("App: Launched with the ConcreteCreator1.");
            ClientCode(new ConcreteCreator1());
            
            Console.WriteLine("");

            Console.WriteLine("App: Launched with the ConcreteCreator2.");
            ClientCode(new ConcreteCreator2());
        }

        public void ClientCode(Creator creator)
        {
            // ...
            Console.WriteLine("Client: I'm not aware of the creator's class," +
                "but it still works.\n" + creator.SomeOperation());
            // ...
        }
    }

    class Program
    {
        static void Main(string[] args)
        {
            new Client().Main();
        }
    }
}using System;

namespace RefactoringGuru.DesignPatterns.FactoryMethod.Conceptual
{

    abstract class Creator
    {

        public abstract IProduct FactoryMethod();
        public string SomeOperation()
        {
            // Call the factory method to create a Product object.
            var product = FactoryMethod();
            // Now, use the product.
            var result = "Creator: The same creator's code has just worked with "
                + product.Operation();

            return result;
        }
    }

    class ConcreteCreator1 : Creator
    {

        public override IProduct FactoryMethod()
        {
            return new ConcreteProduct1();
        }
    }

    class ConcreteCreator2 : Creator
    {
        public override IProduct FactoryMethod()
        {
            return new ConcreteProduct2();
        }
    }

    public interface IProduct
    {
        string Operation();
    }

    class ConcreteProduct1 : IProduct
    {
        public string Operation()
        {
            return "{Result of ConcreteProduct1}";
        }
    }

    class ConcreteProduct2 : IProduct
    {
        public string Operation()
        {
            return "{Result of ConcreteProduct2}";
        }
    }

    class Client
    {
        public void Main()
        {
            Console.WriteLine("App: Launched with the ConcreteCreator1.");
            ClientCode(new ConcreteCreator1());
            
            Console.WriteLine("");

            Console.WriteLine("App: Launched with the ConcreteCreator2.");
            ClientCode(new ConcreteCreator2());
        }

        public void ClientCode(Creator creator)
        {
            // ...
            Console.WriteLine("Client: I'm not aware of the creator's class," +
                "but it still works.\n" + creator.SomeOperation());
            // ...
        }
    }

    class Program
    {
        static void Main(string[] args)
        {
            new Client().Main();
        }
    }
}
```
---

### Strategy (Padrão Comportamental)


&emsp;O Strategy é ideal para cenários em que diferentes algoritmos ou estratégias podem ser aplicadas para resolver um mesmo problema, sendo possível alternar entre eles dinamicamente. No projeto, isso se aplica à recomendação de ajustes de carteira, onde diferentes estratégias de realocação (conservadora, agressiva, balanceada etc.) podem ser escolhidas conforme o perfil do investidor ou preferência do usuário.

**Benefícios para o projeto:**

- **Troca dinâmica de algoritmos:** Permite alterar a estratégia de recomendação em tempo de execução, sem modificar o código principal.
- **Separação de responsabilidades:** Cada estratégia é implementada em sua própria classe, facilitando a manutenção e o entendimento do código.
- **Reutilização de código:** Estratégias podem ser reutilizadas em diferentes partes do sistema.

**Exemplo em C#:**

```
using System;
using System.Collections.Generic;

namespace RefactoringGuru.DesignPatterns.Strategy.Conceptual
{
    class Context
    {

        private IStrategy _strategy;

        public Context()
        { }

        public Context(IStrategy strategy)
        {
            this._strategy = strategy;
        }

        public void SetStrategy(IStrategy strategy)
        {
            this._strategy = strategy;
        }

        public void DoSomeBusinessLogic()
        {
            Console.WriteLine("Context: Sorting data using the strategy (not sure how it'll do it)");
            var result = this._strategy.DoAlgorithm(new List<string> { "a", "b", "c", "d", "e" });

            string resultStr = string.Empty;
            foreach (var element in result as List<string>)
            {
                resultStr += element + ",";
            }

            Console.WriteLine(resultStr);
        }
    }

    public interface IStrategy
    {
        object DoAlgorithm(object data);
    }

    class ConcreteStrategyA : IStrategy
    {
        public object DoAlgorithm(object data)
        {
            var list = data as List<string>;
            list.Sort();

            return list;
        }
    }

    class ConcreteStrategyB : IStrategy
    {
        public object DoAlgorithm(object data)
        {
            var list = data as List<string>;
            list.Sort();
            list.Reverse();

            return list;
        }
    }

    class Program
    {
        static void Main(string[] args)
        {

            var context = new Context();

            Console.WriteLine("Client: Strategy is set to normal sorting.");
            context.SetStrategy(new ConcreteStrategyA());
            context.DoSomeBusinessLogic();
            
            Console.WriteLine();
            
            Console.WriteLine("Client: Strategy is set to reverse sorting.");
            context.SetStrategy(new ConcreteStrategyB());
            context.DoSomeBusinessLogic();
        }
    }
}
```

&emsp;Fonte: [Refactoring Guru](https://refactoring.guru/design-patterns/factory-method/csharp/example#example-0)

---



## 3.2 Arquitetura de Software

- Utilize a Arquitetura de Três Camadas: Separe a lógica de negócios (Camada de Negócios), a interface do usuário (Camada de Apresentção) e o acesso aos dados (Camada de Dados).
  - Exemplo: Em uma aplicação React Native, utilize serviços para lógica de negócios, componentes para a interface e controladores para gerenciar a interação.

# 4. Práticas de Desenvolvimento
_conteúdo_

## 4.1 Testes Automatizados

- Testes Unitários: Utilize Jest para criar testes unitários
  - Exemplo:
    ```
    test('adiciona 1 + 2 para igualar 3', () => {
      expect(1 + 2).toBe(3);
    });
    ```

- Testes de Integração: Como sugestão, utilizar o Cypress para testes de integração.
  - Exemplo: Testar a interação entre componentes de frontend e backend.

- Testes end-to-end: Como sugestão, utilizar o Cypress para testes end-to-end. 
  - Exemplo: Testar um RF de ponta a ponta.

## 4.2 Controle de Qualidade

- Revisão de Código: Todos os commits devem ser revisados por pelo menos um outro desenvolvedor.

- Sugestão: Utilizar ESLint para análise estática de código JavaScript/TypeScript.

# 5. Ferramentas e Tecnologias

## 5.1 Ferramentas de Desenvolvimento

- Editor de Código: Utilize Visual Studio Code como editor padrão.

- Plugins recomendados: ESLint, Prettier, GitLens.

## 5.2 Tecnologias e Frameworks

- Backend: Utilize Node.js com TypeScript.

- Frontend: Utilize React Native com TypeScript.

