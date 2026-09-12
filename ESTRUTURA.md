# Guia de Java para entender o WebTrans

## Objetivo

Este documento apresenta os conhecimentos de Java necessários para ler, compreender, manter e evoluir o backend do WebTrans. O foco não é ensinar toda a plataforma Java, mas explicar os conceitos que aparecem com maior frequência no sistema e mostrar como eles se relacionam.

Os trechos de código são exemplos didáticos compatíveis com Java 8. Alguns usam nomes do domínio do WebTrans para facilitar a associação, mas não devem ser interpretados como cópias literais de uma rotina específica.

O WebTrans utiliza Java 8, Java EE 7, Servlets, JSP, JDBC e PostgreSQL. Seu backend combina orientação a objetos com trechos de estilo procedural e está organizado, predominantemente, na arquitetura:

```text
JSP ou Vue
    ↓ requisição HTTP
Controller / Controlador
    ↓ chamada de método
BO — Business Object
    ↓ chamada de método
DAO — Data Access Object
    ↓ JDBC e SQL
PostgreSQL
```

Para compreender o sistema, é necessário dominar quatro perspectivas ao mesmo tempo:

1. a linguagem Java e sua sintaxe;
2. a modelagem orientada a objetos;
3. a execução de uma aplicação web em um contêiner Java EE;
4. o acesso ao PostgreSQL por JDBC.

---

## 1. Fundamentos de Java

Java é uma linguagem de programação fortemente tipada. Isso significa que variáveis, parâmetros e retornos possuem tipos conhecidos pelo compilador. O código-fonte `.java` é compilado para bytecode `.class`, executado por uma Java Virtual Machine, a JVM.

No WebTrans, a versão de linguagem utilizada é Java 8. Portanto, não se deve empregar recursos introduzidos em versões posteriores.

### 1.1 JDK, JRE e JVM

- **JVM — Java Virtual Machine:** executa o bytecode Java.
- **JRE — Java Runtime Environment:** reúne a JVM e as bibliotecas necessárias para executar aplicações.
- **JDK — Java Development Kit:** inclui as ferramentas de desenvolvimento, como o compilador `javac`, além do ambiente de execução.

O Gradle compila as classes do WebTrans, reúne as dependências e gera um arquivo WAR. O WAR é implantado no Tomcat, que executa a aplicação.

### 1.2 Tipos primitivos e tipos por referência

Java possui tipos primitivos, que armazenam valores diretamente:

```java
int quantidade = 10;
long identificador = 1500L;
double peso = 25.5;
boolean autorizado = true;
char situacao = 'L';
```

Também possui tipos por referência, usados para objetos:

```java
String numeroConhecimento = "12345";
BeanUsuario usuario = new BeanUsuario();
Collection<Area> areas = new ArrayList<>();
```

Uma variável por referência pode conter `null`, isto é, não apontar para objeto algum. Antes de usar uma referência potencialmente nula, é necessário verificar sua existência.

```java
if (usuario != null) {
    int idUsuario = usuario.getIdusuario();
}
```

### 1.3 Variáveis, operadores e expressões

Uma variável associa um nome, um tipo e um valor. Operadores formam expressões que calculam ou comparam valores.

```java
double valorTotal = valorFrete + valorSeguro;
boolean podeEditar = nivelAcesso >= BO.LER_ALTERAR;
boolean filialValida = filial != null && filial.getIdfilial() > 0;
```

Operadores importantes:

| Categoria | Operadores | Finalidade |
|---|---|---|
| Aritméticos | `+`, `-`, `*`, `/`, `%` | Efetuar cálculos |
| Relacionais | `==`, `!=`, `>`, `<`, `>=`, `<=` | Comparar valores |
| Lógicos | `&&`, `||`, `!` | Combinar condições booleanas |
| Atribuição | `=`, `+=`, `-=`, `++`, `--` | Alterar variáveis |
| Condicional | `condicao ? valorA : valorB` | Escolher um valor |

Em objetos, `==` compara referências. Para comparar o conteúdo lógico, normalmente se usa `equals`:

```java
if ("localizar".equals(acao)) {
    localizar();
}
```

Essa forma também evita `NullPointerException` quando `acao` é `null`.

### 1.4 Controle de fluxo

O controle de fluxo determina quais instruções serão executadas e quantas vezes.

```java
if (valorFrete > 0) {
    calcularImpostos();
} else {
    informarValorInvalido();
}
```

```java
switch (acao) {
    case "cadastrar":
        cadastrar();
        break;
    case "excluir":
        excluir();
        break;
    default:
        informarAcaoInvalida();
}
```

```java
for (Conhecimento conhecimento : conhecimentos) {
    processar(conhecimento);
}
```

Os comandos mais importantes são `if`, `else`, `switch`, `for`, enhanced `for`, `while`, `break`, `continue` e `return`.

### 1.5 Métodos

Um método representa uma operação. Ele pode receber parâmetros, retornar um valor e declarar exceções.

```java
public double calcularFrete(double peso, double tarifa) {
    return peso * tarifa;
}
```

Na assinatura acima:

- `public` é o modificador de acesso;
- `double` é o tipo retornado;
- `calcularFrete` é o nome;
- `peso` e `tarifa` são parâmetros.

Sobrecarga ocorre quando métodos têm o mesmo nome, mas parâmetros diferentes:

```java
public void fecharConexao(Connection conexao) {
    // fecha a conexão recebida
}

public void fecharConexao() {
    // fecha a conexão mantida pelo objeto
}
```

### 1.6 Modificadores importantes

- `public`: acessível por qualquer classe que enxergue o tipo.
- `protected`: acessível pelo pacote e pelas subclasses.
- `private`: acessível somente pela própria classe.
- ausência de modificador: acessível apenas dentro do pacote.
- `static`: pertence à classe, e não a uma instância específica.
- `final`: impede nova atribuição à variável, sobrescrita do método ou herança da classe, conforme o local de uso.
- `abstract`: declara um comportamento ou tipo incompleto que deverá ser especializado.

### 1.7 `String`, imutabilidade e `StringBuilder`

`String` representa texto e é imutável: operações aparentemente modificadoras produzem um novo objeto. Para construir textos extensos ou SQL por etapas, usa-se `StringBuilder`.

```java
StringBuilder sql = new StringBuilder();
sql.append("SELECT id, numero ");
sql.append("FROM conhecimento ");
sql.append("WHERE id = ?");
```

No WebTrans, essa distinção é importante porque relatórios, arquivos EDI, XML e consultas SQL envolvem grande manipulação de texto.

**Documentação oficial:** [Java Language Basics — Oracle Java Tutorials](https://docs.oracle.com/javase/tutorial/java/nutsandbolts/index.html) e [Java Language Specification, Java SE 8](https://docs.oracle.com/javase/specs/jls/se8/html/index.html).

---

## 2. Orientação a objetos

Segundo a documentação oficial do Java, um objeto reúne **estado** e **comportamento**. O estado é armazenado em campos; o comportamento é disponibilizado por métodos. Uma classe é o projeto a partir do qual os objetos são criados.

```java
public class Area {
    private int id;
    private String descricao;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }
}
```

`Area` é a classe. Cada execução de `new Area()` cria um objeto independente dessa classe.

### 2.1 Encapsulamento

Encapsular significa ocultar o estado interno e controlar sua leitura ou alteração por métodos.

```java
public class Viagem {
    private boolean encerrada;

    public void encerrar() {
        this.encerrada = true;
    }

    public boolean isEncerrada() {
        return encerrada;
    }
}
```

O benefício não está apenas em criar getters e setters. O principal benefício é impedir que o objeto assuma um estado inválido.

No WebTrans, muitos modelos seguem o padrão JavaBean: construtor público sem parâmetros, campos privados e getters/setters públicos. Esse formato facilita formulários, serialização, relatórios e integração, mas pode produzir modelos com pouco comportamento próprio.

### 2.2 Abstração

Abstração é representar somente os aspectos relevantes de um conceito e esconder detalhes de implementação.

Uma classe `ConhecimentoDAO`, por exemplo, oferece métodos para localizar ou persistir conhecimentos. Quem chama esses métodos não precisa repetir os detalhes de `PreparedStatement`, `ResultSet` e SQL.

Classes abstratas e interfaces formalizam abstrações:

```java
public interface ProcessadorDocumento {
    void processar(Documento documento) throws ExcecaoProcessamento;
}
```

### 2.3 Herança

Herança permite que uma classe especializada receba campos e comportamentos de uma classe mais geral.

```java
public class ConhecimentoDAO extends DAO {
    // reutiliza conexão, transação e operações comuns definidas em DAO
}
```

No WebTrans, herança aparece principalmente em:

- controllers que estendem `HttpServlet`;
- DAOs que estendem `DAO`;
- cadastros que estendem `BeanCadastro`;
- consultas que estendem `BeanConsulta`;
- implementações de layouts e conversores EDI.

Herança deve representar uma relação coerente de especialização. Para apenas reutilizar um colaborador, composição costuma ser mais flexível.

### 2.4 Interfaces

Uma interface define um contrato. Uma classe que implementa a interface se compromete a fornecer seus comportamentos.

```java
public interface GeradorDocumento {
    byte[] gerar(int idDocumento) throws ExcecaoGeracao;
}

public class GeradorCte implements GeradorDocumento {
    @Override
    public byte[] gerar(int idDocumento) throws ExcecaoGeracao {
        return carregarXmlCte(idDocumento);
    }
}
```

O `@Override` informa ao compilador que o método está implementando ou sobrescrevendo um contrato existente.

### 2.5 Polimorfismo

Polimorfismo permite tratar diferentes implementações por meio do mesmo tipo abstrato.

```java
CTeBO cteBO;

if (versao.equals("400")) {
    cteBO = new CTeBO400(filial);
} else {
    cteBO = new CTeBO300(filial);
}

cteBO.enviar(auditoria, request, conhecimentos, status, requisicaoId);
```

Quem usa `CTeBO` chama o mesmo contrato, independentemente da versão concreta escolhida.

### 2.6 Composição

Composição ocorre quando um objeto contém ou utiliza outros objetos.

```java
public class Area {
    private BeanCliente cliente;
    private Collection<AreaCidade> cidades;
}
```

É uma relação de “tem um” ou “usa um”. No WebTrans, composição aparece intensamente nas entidades, DTOs, BOs e DAOs.

### 2.7 Classes de domínio, DTOs e JavaBeans

- **Classe de domínio:** representa um conceito do negócio, como `Conhecimento`, `Manifesto`, `Viagem` ou `Cliente`.
- **DTO — Data Transfer Object:** transporta dados entre camadas, sem necessariamente conter regras de negócio.
- **JavaBean:** segue convenções como campos privados, getters, setters e construtor sem argumentos.
- **BO — Business Object:** concentra validações, cálculos e orquestração do negócio.
- **DAO — Data Access Object:** abstrai o acesso ao banco de dados.

**Documentação oficial:** [Object-Oriented Programming Concepts — Oracle Java Tutorials](https://docs.oracle.com/javase/tutorial/java/concepts/index.html).

---

## 3. Estilo procedural

Programação procedural organiza uma solução como uma sequência de instruções e procedimentos que transformam dados. O foco principal está em “quais passos devem ser executados”.

```java
public void processarPedido(Pedido pedido) {
    validarPedido(pedido);
    calcularFrete(pedido);
    gerarConhecimento(pedido);
    registrarAuditoria(pedido);
    enviarEmail(pedido);
}
```

O estilo procedural não é o oposto absoluto da orientação a objetos. Um programa Java pode usar classes e, ainda assim, concentrar grande parte de sua lógica em métodos longos, sequenciais e dependentes de estado mutável.

### Orientação a objetos versus estilo procedural

| Orientação a objetos | Estilo procedural |
|---|---|
| Organiza o sistema em objetos colaborativos | Organiza a solução em etapas e procedimentos |
| Une estado e comportamento | Dados são passados entre operações |
| Favorece encapsulamento e polimorfismo | Favorece fluxo explícito e sequencial |
| Busca responsabilidades coesas | Pode concentrar muitas responsabilidades em um método |
| Usa interfaces e composição para variações | Usa condicionais para escolher comportamentos |

No WebTrans, ambos coexistem. As entidades, interfaces, heranças e camadas são orientadas a objetos. Muitos controllers, BOs, DAOs e processadores EDI, porém, executam longas sequências procedurais com `if`, `switch`, laços, alteração de objetos e chamadas encadeadas.

Para entender esse código, é necessário acompanhar:

1. a origem dos dados;
2. as alterações feitas em cada etapa;
3. as condições que mudam o fluxo;
4. os efeitos externos, como banco, arquivo, email ou serviço HTTP;
5. o tratamento de erro e a liberação de recursos.

---

## 4. Arquitetura do WebTrans

Arquitetura de software define como responsabilidades são separadas e como as partes se comunicam. No WebTrans, a arquitetura pretendida é multicamada.

### 4.1 View: JSP ou Vue

A interface apresenta dados e captura ações do usuário.

- JSP pertence ao frontend legado e é processado no servidor.
- Vue pertence às telas novas e executa no navegador.
- Ambos enviam requisições HTTP aos controllers.

A camada de apresentação não deve implementar regras de negócio nem acessar o banco.

### 4.2 Controller ou Controlador

O controller é normalmente uma classe que estende `HttpServlet`. Suas responsabilidades são:

1. receber `HttpServletRequest` e `HttpServletResponse`;
2. ler parâmetros enviados pelo navegador;
3. validar formato e presença dos parâmetros;
4. obter usuário e contexto da sessão;
5. chamar um BO;
6. produzir JSON, arquivo, redirecionamento ou forward para JSP.

```java
public class AreaControlador extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }
}
```

O controller não deve montar SQL nem instanciar DAO diretamente.

### 4.3 BO — Business Object

O BO representa a camada de negócio. Ele deve:

- validar regras do domínio;
- verificar permissões;
- executar cálculos;
- coordenar um ou mais DAOs;
- controlar uma operação transacional quando vários passos precisam funcionar como unidade;
- lançar exceções de negócio com significado para a camada superior.

```java
public class AreaBO {
    public Collection<Area> localizar(Consulta consulta, BeanUsuario usuario)
            throws ExcecaoConsulta {
        AreaDAO dao = new AreaDAO(usuario);
        return dao.localizar(consulta);
    }
}
```

### 4.4 DAO — Data Access Object

O DAO isola os detalhes do banco:

- SQL;
- JDBC;
- conversão de parâmetros Java para SQL;
- transformação de linhas do `ResultSet` em objetos;
- persistência de objetos;
- fechamento de recursos.

O DAO não deve decidir regras comerciais, enviar resposta HTTP ou formatar interface.

### 4.5 PostgreSQL

O PostgreSQL mantém o estado persistente do sistema. Tabelas, views, sequences, funções e constraints fazem parte do modelo efetivo da aplicação. O Java se comunica com ele por meio do driver JDBC do PostgreSQL.

### 4.6 Fluxo completo de uma requisição

```text
1. Usuário executa uma ação na JSP ou no componente Vue.
2. Navegador envia uma requisição HTTP.
3. Tomcat entrega a requisição ao HttpServlet correspondente.
4. Controller extrai e valida os parâmetros.
5. Controller chama o BO.
6. BO aplica regras e chama o DAO.
7. DAO prepara e executa SQL por JDBC.
8. PostgreSQL devolve dados ou confirma uma alteração.
9. DAO transforma o resultado em objetos Java.
10. BO conclui as regras e devolve o resultado.
11. Controller converte o resultado em JSON, arquivo ou atributos da JSP.
12. Tomcat envia a resposta HTTP ao navegador.
```

### 4.7 Arquitetura legada

Parte do WebTrans é anterior à estrutura Controller–BO–DAO. Nessa parte existem classes como:

- `BeanCad{Rotina}`;
- `BeanConsulta{Rotina}`;
- `BeanConexao`;
- `AuxiliarBeanLocaliza`.

Esses beans podem conter dados, SQL, conexão e operações de persistência na mesma classe. Ao trabalhar com essa estrutura, deve-se reconhecer que ela mistura responsabilidades que, na arquitetura nova, estariam separadas entre modelo, BO e DAO.

---

## 5. JDBC

JDBC significa Java Database Connectivity. É a API padrão da plataforma Java para acessar e processar dados, principalmente em bancos relacionais.

A aplicação utiliza a API JDBC e o driver JDBC específico do PostgreSQL:

```text
Código Java
    ↓ java.sql
API JDBC
    ↓ org.postgresql.Driver
Driver PostgreSQL
    ↓ protocolo do PostgreSQL
Banco de dados
```

### 5.1 Principais componentes

| Tipo | Responsabilidade |
|---|---|
| `DriverManager` | Localizar um driver e abrir uma conexão |
| `DataSource` | Representar uma fonte de dados; é a opção recomendada para ambientes gerenciados |
| `Connection` | Representar uma sessão com o banco e controlar transações |
| `PreparedStatement` | Executar SQL parametrizado |
| `CallableStatement` | Chamar procedures ou funções armazenadas |
| `ResultSet` | Percorrer as linhas devolvidas por uma consulta |
| `SQLException` | Representar erros de acesso ao banco |

### 5.2 Consulta parametrizada

```java
String sql = "SELECT id, numero FROM conhecimento WHERE id = ?";

try (PreparedStatement statement = conexao.prepareStatement(sql)) {
    statement.setInt(1, idConhecimento);

    try (ResultSet resultado = statement.executeQuery()) {
        if (resultado.next()) {
            Conhecimento conhecimento = new Conhecimento();
            conhecimento.setId(resultado.getInt("id"));
            conhecimento.setNumero(resultado.getString("numero"));
            return conhecimento;
        }
    }
}

return null;
```

O `?` é um placeholder JDBC. `setInt`, `setString`, `setDate` e métodos semelhantes enviam valores separadamente do SQL.

Nunca se deve concatenar entrada do usuário no comando:

```java
// Incorreto: permite alterar a estrutura lógica do SQL.
String sqlInseguro = "SELECT * FROM cliente WHERE nome = '" + nomeInformado + "'";
```

### 5.3 Transações

Uma transação agrupa operações que devem ser confirmadas ou desfeitas juntas.

```java
conexao.setAutoCommit(false);

try {
    cadastrarConhecimento(conexao, conhecimento);
    cadastrarNotas(conexao, conhecimento.getNotas());
    conexao.commit();
} catch (SQLException excecao) {
    conexao.rollback();
    throw excecao;
}
```

- `commit`: confirma a transação.
- `rollback`: desfaz as alterações não confirmadas.
- `autoCommit`: quando ativo, cada instrução é confirmada individualmente.

### 5.4 Mapeamento entre SQL e Java

O DAO transforma dados relacionais em objetos:

```java
Area area = new Area();
area.setId(resultado.getInt("id"));
area.setSigla(resultado.getString("sigla"));
area.setDescricao(resultado.getString("descricao"));
```

Esse mapeamento é manual no WebTrans; o projeto não é estruturado em torno de um ORM como JPA/Hibernate.

**Documentação oficial:** [JDBC Introduction — Oracle Java Tutorials](https://docs.oracle.com/javase/tutorial/jdbc/overview/index.html), [JDBC Basics](https://docs.oracle.com/javase/tutorial/jdbc/basics/index.html) e [API `java.sql` do Java SE 8](https://docs.oracle.com/javase/8/docs/api/java/sql/package-summary.html).

---

## 6. Collections Framework

O Java Collections Framework reúne interfaces e implementações para armazenar e manipular grupos de objetos.

### 6.1 Interfaces principais

| Interface | Característica | Implementações comuns |
|---|---|---|
| `Collection<E>` | Raiz da hierarquia de coleções de elementos | — |
| `List<E>` | Ordenada, indexada e permite repetição | `ArrayList`, `LinkedList` |
| `Set<E>` | Não permite elementos duplicados | `HashSet`, `TreeSet` |
| `Queue<E>` | Mantém elementos aguardando processamento | `LinkedList`, `PriorityQueue` |
| `Deque<E>` | Permite inserir e retirar nas duas extremidades | `ArrayDeque` |
| `Map<K,V>` | Associa uma chave a um valor | `HashMap`, `TreeMap` |

`Map` faz parte do framework, mas não herda de `Collection`.

### 6.2 Programar para a interface

É preferível declarar o tipo pela abstração e escolher a implementação na construção:

```java
List<Conhecimento> conhecimentos = new ArrayList<>();
Set<Integer> idsFiliais = new HashSet<>();
Map<Integer, BeanCliente> clientesPorId = new HashMap<>();
```

Assim, o restante do código depende de `List`, `Set` ou `Map`, e não dos detalhes de uma implementação.

### 6.3 Escolha da coleção

- Use `List` quando ordem, posição ou repetição importarem.
- Use `Set` quando os valores precisarem ser únicos.
- Use `Map` para procurar um valor por chave.
- Use `Queue` para filas de processamento.
- Use `Collection` quando o método só precisar percorrer ou manipular um grupo sem exigir características específicas.

### 6.4 Iteração

Forma tradicional:

```java
for (Conhecimento conhecimento : conhecimentos) {
    validar(conhecimento);
}
```

Java 8 também oferece operações de stream:

```java
List<Integer> ids = conhecimentos.stream()
        .filter(Conhecimento::isAutorizado)
        .map(Conhecimento::getId)
        .collect(Collectors.toList());
```

No WebTrans, a iteração tradicional é mais comum do que o uso de streams.

**Documentação oficial:** [Collections Framework — Oracle Java Tutorials](https://docs.oracle.com/javase/tutorial/collections/index.html) e [API `java.util` do Java SE 8](https://docs.oracle.com/javase/8/docs/api/java/util/package-summary.html).

---

## 7. Generics

Generics permitem parametrizar classes, interfaces e métodos com tipos. Seu objetivo principal é levar erros de tipo para o momento da compilação e reduzir conversões manuais.

Sem generics:

```java
List conhecimentos = new ArrayList();
conhecimentos.add(new Conhecimento());

Conhecimento conhecimento = (Conhecimento) conhecimentos.get(0);
```

Com generics:

```java
List<Conhecimento> conhecimentos = new ArrayList<>();
conhecimentos.add(new Conhecimento());

Conhecimento conhecimento = conhecimentos.get(0);
```

O compilador impede que um objeto de tipo incompatível seja colocado na coleção.

### 7.1 Parâmetros de tipo

Nomes convencionais:

- `T`: tipo;
- `E`: elemento;
- `K`: chave;
- `V`: valor;
- `R`: retorno.

```java
public class Resultado<T> {
    private T valor;

    public T getValor() {
        return valor;
    }

    public void setValor(T valor) {
        this.valor = valor;
    }
}
```

### 7.2 Limites e curingas

```java
public void imprimirIds(Collection<? extends Entidade> entidades) {
    for (Entidade entidade : entidades) {
        System.out.println(entidade.getId());
    }
}
```

`? extends Entidade` significa “um tipo desconhecido que é `Entidade` ou uma subclasse dela”. Também existe `? super Tipo`, usado quando a coleção recebe valores desse tipo.

### 7.3 Type erasure

Generics são verificados principalmente pelo compilador. No bytecode, grande parte das informações de tipo genérico é removida por um processo chamado type erasure. Isso explica por que não se pode, por exemplo, criar diretamente `new T()` ou usar `instanceof List<String>`.

**Documentação oficial:** [Generics — Oracle Java Tutorials](https://docs.oracle.com/javase/tutorial/java/generics/index.html).

---

## 8. Entrada e saída — IO

IO significa Input/Output: entrada e saída de dados. Inclui arquivos, memória, rede, requisições HTTP, respostas, uploads, downloads, XML, EDI, PDFs e serialização.

### 8.1 Streams de bytes

`InputStream` e `OutputStream` trabalham com bytes. São apropriados para PDFs, imagens, ZIPs e outros dados binários.

```java
try (InputStream entrada = new FileInputStream(arquivoOrigem);
        OutputStream saida = new FileOutputStream(arquivoDestino)) {
    byte[] buffer = new byte[8192];
    int quantidadeLida;

    while ((quantidadeLida = entrada.read(buffer)) != -1) {
        saida.write(buffer, 0, quantidadeLida);
    }
}
```

### 8.2 Streams de caracteres

`Reader` e `Writer` trabalham com caracteres e precisam considerar charset.

```java
Charset charset = Charset.forName("ISO-8859-1");

try (BufferedReader leitor = Files.newBufferedReader(caminho, charset)) {
    String linha;
    while ((linha = leitor.readLine()) != null) {
        processarLinha(linha);
    }
}
```

No backend do WebTrans, `.java`, `.jsp`, `.js`, `.xml`, `.jrxml`, `.properties` e `.css` legados permanecem em ISO-8859-1. Escolher o charset errado pode corromper acentos, XML, EDI e dados enviados ao banco.

### 8.3 Buffering

Classes como `BufferedInputStream`, `BufferedOutputStream`, `BufferedReader` e `BufferedWriter` diminuem a quantidade de acessos físicos ao recurso e permitem operações eficientes por blocos ou linhas.

### 8.4 `java.io` e `java.nio.file`

- `java.io.File` representa caminhos no modelo legado.
- `java.nio.file.Path` representa caminhos na API NIO.2.
- `java.nio.file.Files` oferece leitura, escrita, cópia, movimentação, diretórios e arquivos temporários.

```java
Path pastaTemporaria = Files.createTempDirectory("cte-");
Path arquivo = pastaTemporaria.resolve("documento.xml");
Files.write(arquivo, conteudoXml.getBytes(StandardCharsets.UTF_8));
```

### 8.5 Try-with-resources

Objetos que implementam `AutoCloseable` podem ser declarados no `try`. O Java os fecha automaticamente, inclusive quando ocorre exceção.

```java
try (Connection conexao = abrirConexao();
        PreparedStatement statement = conexao.prepareStatement(sql);
        ResultSet resultado = statement.executeQuery()) {
    processar(resultado);
}
```

Isso é especialmente importante para arquivos, conexões, statements e result sets.

### 8.6 Serialização

Uma classe que implementa `Serializable` declara que seus objetos podem ser convertidos para um formato binário compatível com o mecanismo de serialização Java.

```java
public class Organizacao implements Serializable {
    private static final long serialVersionUID = 1L;
}
```

Serialização Java não é a mesma coisa que serialização JSON ou XML. JSON no WebTrans normalmente é tratado por Gson; XML pode envolver JAXB, DOM, SAX ou bibliotecas de integração.

**Documentação oficial:** [Basic I/O — Oracle Java Tutorials](https://docs.oracle.com/javase/tutorial/essential/io/index.html) e [API `java.io` do Java SE 8](https://docs.oracle.com/javase/8/docs/api/java/io/package-summary.html).

---

## 9. Java EE e os pacotes `javax.*`

Java SE é a plataforma básica: linguagem, JVM, Collections, IO, JDBC, concorrência e outras APIs fundamentais.

Java EE 7 acrescenta especificações voltadas a aplicações empresariais e web. Entre elas estão Servlets, JSP, Expression Language, validação, transações, web services e email.

O WebTrans não utiliza necessariamente todos os componentes Java EE. Sua base web é principalmente Servlet/JSP executada no Tomcat.

### 9.1 O que significa `javax`

Historicamente, várias APIs Java foram publicadas no namespace `javax`. O prefixo sozinho não significa que o pacote pertença exclusivamente ao Java EE.

Exemplos presentes no Java SE 8:

- `javax.sql`;
- `javax.xml`;
- `javax.crypto`;
- `javax.naming`;
- `javax.net`.

Exemplos associados ao Java EE usado pelo WebTrans:

- `javax.servlet`;
- `javax.servlet.http`;
- `javax.mail`;
- `javax.jws`;
- `javax.xml.ws`;
- `javax.validation`, quando disponível na stack.

Nas versões atuais da plataforma empresarial, muitas APIs migraram para o namespace `jakarta.*`. Isso não deve ser aplicado automaticamente ao WebTrans, pois ele foi construído para Java EE 7 e `javax.*`.

### 9.2 Contêiner web

O Tomcat funciona como contêiner web. Ele:

- carrega e inicializa servlets;
- associa URLs aos componentes;
- cria objetos de request e response;
- gerencia sessões HTTP;
- executa filters e listeners;
- controla o ciclo de vida dos componentes;
- processa múltiplas requisições simultaneamente.

### 9.3 Servlet

Servlet é uma classe Java que atende ao modelo requisição–resposta. `HttpServlet` especializa esse contrato para HTTP.

Métodos comuns:

- `init`: inicialização do servlet;
- `doGet`: atendimento a GET;
- `doPost`: atendimento a POST;
- `service`: distribui a requisição para o método HTTP adequado;
- `destroy`: encerramento do componente.

Objetos importantes:

- `HttpServletRequest`: parâmetros, headers, sessão, corpo e atributos da requisição;
- `HttpServletResponse`: status, headers, charset e corpo da resposta;
- `HttpSession`: dados associados à sessão do usuário;
- `RequestDispatcher`: encaminhamento para outro recurso, normalmente JSP;
- `Filter`: interceptação de requests e responses;
- `ServletContext`: contexto compartilhado da aplicação.

### 9.4 Concorrência em servlets

O contêiner pode usar a mesma instância de servlet para atender várias requisições em threads diferentes. Por isso, dados específicos de uma requisição devem permanecer em variáveis locais ou no próprio request.

```java
public class ConsultaControlador extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws IOException {
        String filtro = request.getParameter("filtro");
        response.getWriter().println(filtro);
    }
}
```

Não se deve guardar `filtro`, usuário autenticado, conexão ou resposta em campos mutáveis do servlet sem uma estratégia explícita de sincronização.

### 9.5 JSP

JSP é uma tecnologia de página que é convertida pelo contêiner em servlet. Ela é adequada para apresentação server-side, mas não deve concentrar regras de negócio ou acesso ao banco.

### 9.6 WAR e implantação

Uma aplicação web Java é normalmente empacotada como WAR. O pacote contém classes compiladas, bibliotecas, JSPs, recursos estáticos e configurações em `WEB-INF`. No WebTrans, o Gradle produz o WAR implantado no Tomcat.

**Documentação oficial:** [Java EE 7 Tutorial](https://docs.oracle.com/javaee/7/tutorial/), [Java Servlet Technology](https://docs.oracle.com/javaee/7/tutorial/servlets.htm), [Web Applications](https://docs.oracle.com/javaee/7/tutorial/webapp001.htm) e [Java EE 7 API](https://docs.oracle.com/javaee/7/api/overview-summary.html).

---

## 10. Tratamento de exceções

Uma exceção representa um evento que interrompe o fluxo normal de execução. Java separa o fluxo principal da lógica de tratamento de erro.

### 10.1 Hierarquia

```text
Throwable
├── Error
└── Exception
    ├── exceções verificadas
    └── RuntimeException
        └── exceções não verificadas
```

- `Error`: falha grave da JVM ou do ambiente; normalmente não deve ser capturada pela aplicação.
- exceção verificada, ou checked: o compilador exige captura ou declaração com `throws`. Exemplos: `IOException`, `SQLException`.
- exceção não verificada, ou unchecked: deriva de `RuntimeException`. Exemplos: `NullPointerException`, `IllegalArgumentException`.

### 10.2 `throw` e `throws`

`throw` lança uma instância de exceção:

```java
if (cliente == null) {
    throw new ExcecaoViolacaoNegocio("Cliente não informado.");
}
```

`throws` declara na assinatura que o método pode propagar uma exceção:

```java
public Cliente localizar(int id) throws SQLException {
    return clienteDAO.localizar(id);
}
```

### 10.3 `try`, `catch` e `finally`

```java
try {
    dao.cadastrar(conhecimento);
} catch (SQLException excecao) {
    LOG.error("Erro ao cadastrar conhecimento.", excecao);
    throw new ExcecaoPersistencia("Não foi possível cadastrar o conhecimento.", excecao);
} finally {
    dao.fecharConexao();
}
```

- `try`: contém a operação que pode falhar;
- `catch`: trata um tipo de falha;
- `finally`: executa independentemente do sucesso, sendo útil para liberar recursos;
- try-with-resources: deve ser preferido quando o recurso implementa `AutoCloseable`.

### 10.4 Exceções específicas

Capturar ou declarar `Exception` esconde a natureza real do erro. Tipos específicos tornam o contrato mais claro:

```java
catch (SQLException excecao) {
    // erro de banco
} catch (IOException excecao) {
    // erro de arquivo ou comunicação
}
```

O WebTrans possui exceções próprias, como exceções de conexão, consulta, permissão, arquivo e violação de negócio. Elas devem preservar a causa original quando transformam uma exceção técnica.

```java
throw new ExcecaoConsulta("Falha ao localizar conhecimentos.", excecao);
```

### 10.5 Responsabilidade por camada

| Camada | Tratamento esperado |
|---|---|
| DAO | Identificar falhas JDBC, liberar recursos e propagar erro com contexto técnico |
| BO | Traduzir falhas em significado de negócio e decidir rollback |
| Controller | Converter o erro em resposta HTTP, mensagem ou página apropriada |
| View | Exibir uma mensagem segura, sem stack trace ou detalhes internos |

### 10.6 Logging

Registrar uma exceção não é o mesmo que tratá-la. O log preserva informações para diagnóstico; o tratamento decide como o sistema continua.

```java
catch (SQLException excecao) {
    LOG.error("Falha ao consultar a área de entrega.", excecao);
    throw excecao;
}
```

Cuidados:

- não ignorar silenciosamente a exceção;
- não registrar senhas, tokens ou documentos sensíveis;
- não usar apenas `excecao.getMessage()`, pois isso perde o stack trace;
- não registrar a mesma falha repetidamente em todas as camadas;
- não retornar stack trace ao usuário;
- não continuar com objeto parcialmente inicializado após uma falha crítica.

**Documentação oficial:** [Exceptions — Oracle Java Tutorials](https://docs.oracle.com/javase/tutorial/essential/exceptions/index.html).

---

## 11. Conhecimentos complementares importantes

Além dos temas centrais, a manutenção do WebTrans exige familiaridade com:

- `BigDecimal` para valores monetários;
- `Date`, `Calendar`, `SimpleDateFormat` e a API `java.time`;
- annotations e reflection;
- JSON com Gson;
- XML com JAXB, DOM e integrações SOAP;
- logging com Log4j2;
- HTTP e serviços externos;
- threads e segurança de dados compartilhados;
- Gradle e estrutura de um WAR;
- PostgreSQL, SQL, transações e modelagem relacional;
- encoding ISO-8859-1 e UTF-8;
- testes unitários com JUnit.

---

## 12. Ordem recomendada de estudo

1. Tipos, variáveis, operadores, métodos e controle de fluxo.
2. Classes, objetos, construtores e modificadores de acesso.
3. Encapsulamento, composição, herança, interfaces e polimorfismo.
4. `String`, `StringBuilder`, enums e annotations.
5. Collections e generics.
6. Exceções e try-with-resources.
7. IO, arquivos, streams e encoding.
8. SQL e PostgreSQL.
9. JDBC, transações e mapeamento de `ResultSet`.
10. HTTP, Servlets, sessão, filters e JSP.
11. Arquitetura Controller–BO–DAO.
12. Estruturas legadas `BeanCad`, `BeanConsulta` e `BeanConexao`.
13. Integrações XML, JSON, email, EDI e web services.

---

## 13. Checklist para compreender uma rotina do WebTrans

Ao estudar uma funcionalidade, responda:

- Qual JSP ou componente Vue inicia a ação?
- Qual URL e qual controller recebem a requisição?
- Qual método trata a ação?
- Quais parâmetros HTTP são lidos?
- Qual BO é chamado?
- Quais regras e permissões são verificadas?
- Qual DAO ou bean legado acessa o banco?
- Qual SQL é executado e quais parâmetros são vinculados?
- Como o `ResultSet` é transformado em objetos?
- Onde a transação inicia, confirma ou desfaz?
- Quais arquivos, emails ou serviços externos são afetados?
- Quais exceções podem ocorrer e em qual camada são tratadas?
- Qual resposta volta ao frontend?
- O código pertence à arquitetura atual ou ao padrão legado?

---

## Referências oficiais

- [Java SE 8 API Specification](https://docs.oracle.com/javase/8/docs/api/)
- [Java Language Specification — Java SE 8](https://docs.oracle.com/javase/specs/jls/se8/html/index.html)
- [Java Language Basics](https://docs.oracle.com/javase/tutorial/java/nutsandbolts/index.html)
- [Object-Oriented Programming Concepts](https://docs.oracle.com/javase/tutorial/java/concepts/index.html)
- [Generics](https://docs.oracle.com/javase/tutorial/java/generics/index.html)
- [Collections Framework](https://docs.oracle.com/javase/tutorial/collections/index.html)
- [Basic I/O](https://docs.oracle.com/javase/tutorial/essential/io/index.html)
- [Exceptions](https://docs.oracle.com/javase/tutorial/essential/exceptions/index.html)
- [JDBC Database Access](https://docs.oracle.com/javase/tutorial/jdbc/index.html)
- [Java EE 7 Tutorial](https://docs.oracle.com/javaee/7/tutorial/)
- [Java EE 7 API Specification](https://docs.oracle.com/javaee/7/api/overview-summary.html)
- [Java Servlet Technology](https://docs.oracle.com/javaee/7/tutorial/servlets.htm)

