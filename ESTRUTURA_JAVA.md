# Guia de estrutura para projetos Java

## Objetivo

Este documento apresenta uma estrutura de referência para organizar aplicações Java de forma clara, previsível e sustentável. O foco está na separação de responsabilidades, na organização de pacotes e no fluxo técnico entre as camadas, sem definir regras de negócio de um sistema específico.

Os exemplos são compatíveis com Java 8 e com aplicações web baseadas em Java EE 7, Servlets, JSP, JDBC e banco de dados relacional.

---

## 1. Visão geral da arquitetura

Uma aplicação web Java pode ser organizada em camadas:

```text
Interface do usuário
        ↓ HTTP
Controller
        ↓
Service ou BO
        ↓
DAO
        ↓ JDBC
Banco de dados
```

Cada camada possui uma responsabilidade principal:

| Camada | Responsabilidade |
|---|---|
| Interface | Apresentar dados e capturar ações do usuário |
| Controller | Receber a requisição HTTP e produzir a resposta |
| Service ou BO | Coordenar o caso de uso e as operações da aplicação |
| DAO | Executar operações de persistência |
| Model | Representar dados e objetos do domínio |
| Banco de dados | Armazenar o estado persistente |

A dependência deve seguir essa direção. Por exemplo, um DAO não deve depender de um controller, e uma classe de modelo não deve conhecer detalhes de HTTP.

---

## 2. Estrutura de diretórios

Uma organização comum para um projeto Gradle no formato WAR é:

```text
projeto/
├── build.gradle
├── settings.gradle
├── gradlew
├── gradlew.bat
├── gradle/
│   └── wrapper/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── br/com/exemplo/aplicacao/
│   │   │       ├── controller/
│   │   │       ├── service/
│   │   │       ├── dao/
│   │   │       ├── model/
│   │   │       ├── dto/
│   │   │       ├── exception/
│   │   │       ├── filter/
│   │   │       ├── util/
│   │   │       └── config/
│   │   ├── resources/
│   │   │   ├── application.properties
│   │   │   └── log4j2.xml
│   │   └── webapp/
│   │       ├── assets/
│   │       ├── WEB-INF/
│   │       │   ├── jsp/
│   │       │   └── web.xml
│   │       └── index.jsp
│   └── test/
│       ├── java/
│       └── resources/
└── README.md
```

Em projetos que geram JAR, a pasta `src/main/webapp` normalmente não existe. Em projetos Maven, a organização interna de `src` permanece semelhante, mas o arquivo principal de construção é o `pom.xml`.

### 2.1 Código principal

- `src/main/java`: classes Java da aplicação;
- `src/main/resources`: configurações, templates e demais recursos incluídos no classpath;
- `src/main/webapp`: JSPs, arquivos estáticos e configurações da aplicação web;
- `WEB-INF`: conteúdo protegido contra acesso HTTP direto, como JSPs internas e `web.xml`.

### 2.2 Testes

- `src/test/java`: testes automatizados;
- `src/test/resources`: arquivos usados somente durante os testes.

A estrutura de pacotes dos testes deve, em geral, espelhar a estrutura do código principal.

---

## 3. Organização dos pacotes

O pacote raiz costuma seguir o domínio invertido da organização:

```text
br.com.exemplo.aplicacao
```

Os subpacotes agrupam classes pela função técnica:

### `controller`

Contém servlets ou endpoints responsáveis por:

- receber parâmetros, headers e corpo da requisição;
- fazer validações de formato e presença;
- chamar a camada de serviço;
- definir status, headers e conteúdo da resposta;
- encaminhar a execução para uma view, quando necessário.

O controller não deve conter SQL nem controlar diretamente detalhes de persistência.

### `service` ou `bo`

Contém a coordenação dos casos de uso:

- organiza a sequência das operações;
- chama um ou mais DAOs;
- define os limites de transação;
- converte falhas técnicas em erros compreensíveis para a camada superior;
- centraliza comportamentos que não pertencem ao transporte HTTP nem à persistência.

O projeto deve escolher uma nomenclatura principal — `service` ou `bo` — e usá-la de forma consistente.

### `dao`

Contém o acesso a dados:

- comandos SQL;
- uso de `Connection`, `PreparedStatement` e `ResultSet`;
- conversão entre colunas do banco e objetos Java;
- inclusão, consulta, atualização e exclusão de registros;
- liberação dos recursos JDBC.

O DAO não deve produzir respostas HTTP nem formatar telas.

### `model`

Contém classes que representam os principais dados da aplicação. Essas classes normalmente possuem:

- campos privados;
- construtores;
- getters e setters;
- métodos relacionados ao próprio estado do objeto;
- `equals`, `hashCode` e `toString`, quando apropriado.

### `dto`

Contém objetos usados para transportar dados entre camadas ou representar formatos específicos de entrada e saída. Um DTO evita expor diretamente toda a estrutura interna de uma classe de modelo.

### `exception`

Contém exceções específicas da aplicação. Os nomes devem descrever a categoria do problema, como `PersistenciaException`, `RecursoNaoEncontradoException` ou `EntradaInvalidaException`.

### `filter`

Contém filtros HTTP executados antes ou depois dos controllers. Eles podem tratar preocupações transversais, como autenticação, charset, logging e headers.

### `config`

Contém inicialização e configuração de infraestrutura, como fontes de dados, propriedades e integração com bibliotecas.

### `util`

Contém utilitários pequenos, reutilizáveis e sem estado. Esse pacote não deve se tornar um local genérico para classes sem responsabilidade definida.

---

## 4. Estrutura das classes

### 4.1 Classe de modelo

```java
package br.com.exemplo.aplicacao.model;

public class Registro {
    private Integer id;
    private String descricao;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }
}
```

A classe deve manter seus campos encapsulados. O uso de tipos primitivos ou wrappers deve ser intencional: `int` sempre possui um valor, enquanto `Integer` também pode representar ausência por meio de `null`.

### 4.2 DTO

```java
package br.com.exemplo.aplicacao.dto;

public class RegistroResumoDTO {
    private Integer id;
    private String descricao;

    public RegistroResumoDTO(Integer id, String descricao) {
        this.id = id;
        this.descricao = descricao;
    }

    public Integer getId() {
        return id;
    }

    public String getDescricao() {
        return descricao;
    }
}
```

O DTO deve conter apenas os dados necessários para o fluxo em que será utilizado.

### 4.3 DAO

```java
package br.com.exemplo.aplicacao.dao;

import br.com.exemplo.aplicacao.model.Registro;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class RegistroDAO {
    private final Connection conexao;

    public RegistroDAO(Connection conexao) {
        this.conexao = conexao;
    }

    public Registro localizarPorId(int id) throws SQLException {
        String sql = "SELECT id, descricao FROM registro WHERE id = ?";

        try (PreparedStatement statement = conexao.prepareStatement(sql)) {
            statement.setInt(1, id);

            try (ResultSet resultado = statement.executeQuery()) {
                if (resultado.next()) {
                    Registro registro = new Registro();
                    registro.setId(resultado.getInt("id"));
                    registro.setDescricao(resultado.getString("descricao"));
                    return registro;
                }
            }
        }

        return null;
    }
}
```

Consultas devem usar `PreparedStatement`. Valores externos não devem ser concatenados ao SQL.

### 4.4 Service

```java
package br.com.exemplo.aplicacao.service;

import br.com.exemplo.aplicacao.dao.RegistroDAO;
import br.com.exemplo.aplicacao.exception.PersistenciaException;
import br.com.exemplo.aplicacao.model.Registro;
import java.sql.Connection;
import java.sql.SQLException;

public class RegistroService {
    public Registro localizar(int id, Connection conexao) {
        try {
            RegistroDAO dao = new RegistroDAO(conexao);
            return dao.localizarPorId(id);
        } catch (SQLException excecao) {
            throw new PersistenciaException("Não foi possível consultar o registro.", excecao);
        }
    }
}
```

A camada de serviço coordena a operação e evita que detalhes JDBC cheguem ao controller.

### 4.5 Controller

```java
package br.com.exemplo.aplicacao.controller;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/registros")
public class RegistroController extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        // Lê a entrada, chama o serviço e escreve a resposta.
    }
}
```

Campos mutáveis de requisição não devem ser armazenados na instância do servlet. O contêiner pode utilizar a mesma instância para atender várias requisições simultaneamente.

### 4.6 Exceção da aplicação

```java
package br.com.exemplo.aplicacao.exception;

public class PersistenciaException extends RuntimeException {
    public PersistenciaException(String mensagem, Throwable causa) {
        super(mensagem, causa);
    }
}
```

Ao transformar uma exceção, a causa original deve ser preservada para manter as informações de diagnóstico.

---

## 5. Fluxo técnico de uma requisição

```text
1. O cliente envia uma requisição HTTP.
2. O contêiner direciona a requisição ao controller.
3. O controller lê e valida o formato da entrada.
4. O controller chama um método da camada de serviço.
5. O serviço coordena a operação e chama o DAO.
6. O DAO executa SQL por JDBC.
7. O DAO converte o resultado em objetos Java.
8. O serviço devolve o resultado ao controller.
9. O controller define a resposta HTTP.
10. O contêiner envia a resposta ao cliente.
```

Esse fluxo reduz o acoplamento entre HTTP, código de aplicação e banco de dados.

---

## 6. Dependências entre camadas

As dependências recomendadas são:

```text
controller ──→ service ──→ dao ──→ banco de dados
     │             │          │
     └─────────────┴──────────┴──→ model/dto/exception
```

Diretrizes:

- `controller` pode depender de `service`, `dto`, `model` e `exception`;
- `service` pode depender de `dao`, `dto`, `model` e `exception`;
- `dao` pode depender de `model` e `exception`;
- `model` não deve depender de `controller`, Servlet ou JDBC;
- pacotes de infraestrutura não devem conhecer detalhes da interface do usuário;
- dependências circulares entre pacotes devem ser evitadas.

---

## 7. Acesso a dados com JDBC

### 7.1 Recursos

Os principais tipos JDBC são:

| Tipo | Função |
|---|---|
| `DataSource` | Fornecer conexões, especialmente em ambiente gerenciado |
| `Connection` | Representar uma sessão com o banco e controlar transações |
| `PreparedStatement` | Executar SQL parametrizado |
| `CallableStatement` | Executar procedures ou funções armazenadas |
| `ResultSet` | Percorrer o resultado de uma consulta |
| `SQLException` | Representar falhas de acesso a dados |

Recursos que implementam `AutoCloseable` devem ser usados com try-with-resources sempre que possível.

### 7.2 Transações

Quando várias alterações precisam ser confirmadas como uma unidade:

```java
conexao.setAutoCommit(false);

try {
    executarPrimeiraOperacao(conexao);
    executarSegundaOperacao(conexao);
    conexao.commit();
} catch (SQLException excecao) {
    conexao.rollback();
    throw excecao;
} finally {
    conexao.setAutoCommit(true);
}
```

O limite transacional deve ficar na camada que coordena toda a operação, normalmente o service ou BO.

---

## 8. Tratamento de exceções

Cada camada deve tratar apenas aquilo que consegue resolver ou traduzir adequadamente:

| Camada | Tratamento esperado |
|---|---|
| DAO | Liberar recursos e propagar falhas de persistência com contexto |
| Service | Coordenar rollback e traduzir falhas técnicas |
| Controller | Converter a falha em resposta HTTP segura |
| Interface | Exibir uma mensagem apropriada ao usuário |

Boas práticas:

- capturar tipos específicos em vez de `Exception` quando possível;
- nunca ignorar uma exceção silenciosamente;
- preservar a causa original;
- evitar registrar a mesma falha repetidamente em todas as camadas;
- não retornar stack traces ou detalhes internos ao cliente;
- não registrar senhas, tokens ou dados sensíveis.

---

## 9. Entrada, saída e recursos

- Use `InputStream` e `OutputStream` para dados binários.
- Use `Reader` e `Writer` para texto.
- Informe explicitamente o charset ao ler ou escrever texto.
- Prefira `Path` e `Files` às APIs antigas baseadas apenas em `File`.
- Use try-with-resources para fechar arquivos, streams e recursos JDBC.
- Não armazene arquivos temporários dentro da árvore de código-fonte.

Exemplo:

```java
Path caminho = Paths.get("dados", "entrada.txt");

try (BufferedReader leitor = Files.newBufferedReader(caminho, StandardCharsets.UTF_8)) {
    String linha;
    while ((linha = leitor.readLine()) != null) {
        processar(linha);
    }
}
```

---

## 10. Configuração

Valores que mudam entre ambientes não devem ficar fixos no código-fonte. Exemplos:

- endereço do banco de dados;
- nomes de diretórios;
- URLs de serviços;
- timeouts;
- níveis de logging;
- opções específicas do ambiente.

Esses valores podem ser fornecidos por arquivos `.properties`, variáveis de ambiente, JNDI ou configuração do contêiner.

Credenciais e segredos não devem ser versionados no repositório.

---

## 11. Convenções de código

### Nomes

- pacotes: letras minúsculas, como `br.com.exemplo.aplicacao.dao`;
- classes e interfaces: `PascalCase`, como `RegistroService`;
- métodos e variáveis: `camelCase`, como `localizarPorId`;
- constantes: `UPPER_SNAKE_CASE`, como `TAMANHO_MAXIMO`;
- testes: nome da classe testada seguido de `Test`, como `RegistroServiceTest`.

### Organização interna de uma classe

Uma ordem consistente facilita a leitura:

1. constantes;
2. campos estáticos;
3. campos de instância;
4. construtores;
5. métodos públicos;
6. métodos protegidos;
7. métodos privados;
8. getters e setters, conforme a convenção adotada.

### Responsabilidades

- manter métodos pequenos e com propósito claro;
- evitar classes que concentrem muitas responsabilidades;
- preferir composição quando não existe uma relação real de especialização;
- programar para interfaces de coleções, como `List`, `Set` e `Map`;
- evitar estado global mutável;
- documentar decisões e restrições relevantes, não o que o código já expressa claramente.

---

## 12. Testes

Os testes devem acompanhar a mesma divisão de responsabilidades:

```text
src/test/java/br/com/exemplo/aplicacao/
├── controller/
├── service/
├── dao/
└── util/
```

Tipos comuns:

- teste unitário: verifica uma classe de forma isolada;
- teste de integração: verifica a comunicação com banco, contêiner ou outro recurso;
- teste de fluxo web: verifica requisição, resposta e integração entre camadas.

Um teste deve ser independente, reproduzível e claro sobre o comportamento técnico que verifica.

---

## 13. Construção e implantação

Em uma aplicação Java web tradicional:

```text
Código-fonte .java
        ↓ compilação
Bytecode .class
        ↓ empacotamento
Arquivo WAR
        ↓ implantação
Contêiner web, como Tomcat
```

O Gradle ou Maven deve:

- compilar o código;
- executar testes;
- resolver dependências;
- copiar recursos;
- produzir o artefato final.

Dependências fornecidas pelo contêiner, como a API Servlet em determinados ambientes, devem ser configuradas com o escopo adequado para não serem empacotadas desnecessariamente.

---

## 14. Checklist para novas classes

Antes de adicionar uma classe, verificar:

- Qual é a responsabilidade única da classe?
- Em qual pacote ela deve ficar?
- A camada escolhida é compatível com suas dependências?
- Existe uma abstração já disponível que deve ser reutilizada?
- O nome descreve claramente sua função?
- Os recursos externos são fechados corretamente?
- As exceções preservam a causa e o contexto?
- Algum dado sensível pode chegar aos logs?
- O código depende de uma versão de Java compatível com o projeto?
- É necessário criar ou atualizar testes?

---

## 15. Checklist para revisar o fluxo de uma funcionalidade

- Qual URL ou evento inicia o fluxo?
- Qual controller recebe a requisição?
- Quais dados de entrada são lidos?
- Qual service ou BO é chamado?
- Quais DAOs participam da operação?
- Onde a transação começa e termina?
- Como os resultados são mapeados para objetos ou DTOs?
- Quais recursos externos são utilizados?
- Quais exceções podem ser propagadas?
- Como a resposta HTTP é construída?
- Existem dependências indevidas entre as camadas?
- Há testes para o caminho principal e para os erros esperados?

---

## Referências oficiais

- [Java SE 8 API Specification](https://docs.oracle.com/javase/8/docs/api/)
- [Java Language Specification — Java SE 8](https://docs.oracle.com/javase/specs/jls/se8/html/index.html)
- [Object-Oriented Programming Concepts](https://docs.oracle.com/javase/tutorial/java/concepts/index.html)
- [Collections Framework](https://docs.oracle.com/javase/tutorial/collections/index.html)
- [Basic I/O](https://docs.oracle.com/javase/tutorial/essential/io/index.html)
- [Exceptions](https://docs.oracle.com/javase/tutorial/essential/exceptions/index.html)
- [JDBC Database Access](https://docs.oracle.com/javase/tutorial/jdbc/index.html)
- [Java EE 7 Tutorial](https://docs.oracle.com/javaee/7/tutorial/)
- [Java Servlet Technology](https://docs.oracle.com/javaee/7/tutorial/servlets.htm)
