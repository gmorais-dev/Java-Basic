window.GUIDES = {
  "guia-java-basico": {
    label: "Guia 01",
    title: "Java básico",
    shortTitle: "Java básico",
    description: "Entenda como um projeto Java é organizado antes de entrar no código do WebTrans.",
    level: "Fundamentos",
    source: "ESTRUTURA_JAVA.md",
    sections: [
      {
        id: "inicio",
        nav: "Comece por aqui",
        title: "Estrutura de projetos Java",
        lead: "Um mapa direto das pastas, camadas e responsabilidades que formam uma aplicação Java web.",
        time: "5 min",
        html: `
          <div class="callout"><span class="callout-icon">01</span><p><strong>Objetivo:</strong> reconhecer onde cada tipo de código deve ficar e como as partes de uma aplicação Java se comunicam.</p></div>
          <h2 id="como-usar">Como usar este guia</h2>
          <p>Leia as primeiras seis seções em ordem. Depois, use JDBC, exceções, testes e os checklists como material de consulta durante as tarefas.</p>
          <ol class="steps">
            <li>Conheça o fluxo geral e a estrutura de diretórios.</li>
            <li>Entenda a função de cada pacote e camada.</li>
            <li>Observe os exemplos de Model, DTO, DAO, Service e Controller.</li>
            <li>Use os checklists antes de criar ou revisar uma classe.</li>
          </ol>
          <h2 id="mapa">Mapa do guia</h2>
          <div class="flow"><span>Projeto</span><b>→</b><span>Pacotes</span><b>→</b><span>Classes</span><b>→</b><span>Fluxo</span><b>→</b><span>Persistência</span><b>→</b><span>Testes</span></div>
        `
      },
      {
        id: "visao-geral",
        nav: "Visão geral",
        title: "Visão geral da arquitetura",
        lead: "Camadas separam responsabilidades para tornar o sistema mais fácil de entender, testar e manter.",
        time: "6 min",
        html: `
          <h2 id="fluxo-principal">Fluxo principal</h2>
          <div class="flow"><span>Interface</span><b>→ HTTP →</b><span>Controller</span><b>→</b><span>Service / BO</span><b>→</b><span>DAO</span><b>→ JDBC →</b><span>Banco</span></div>
          <div class="table-wrap"><table><thead><tr><th>Camada</th><th>Responsabilidade</th></tr></thead><tbody>
            <tr><td><strong>Interface</strong></td><td>Apresenta dados e captura ações do usuário.</td></tr>
            <tr><td><strong>Controller</strong></td><td>Recebe a requisição HTTP e prepara a resposta.</td></tr>
            <tr><td><strong>Service ou BO</strong></td><td>Coordena a operação da aplicação.</td></tr>
            <tr><td><strong>DAO</strong></td><td>Executa as operações de persistência.</td></tr>
            <tr><td><strong>Model</strong></td><td>Representa os dados usados pelo sistema.</td></tr>
          </tbody></table></div>
          <div class="callout"><span class="callout-icon">!</span><p>A dependência segue uma direção. Um DAO não deve depender de um Controller, e um Model não deve conhecer HTTP.</p></div>
        `
      },
      {
        id: "diretorios",
        nav: "Estrutura de diretórios",
        title: "Estrutura de diretórios",
        lead: "Projetos Gradle e Maven seguem uma convenção que indica onde ficam código, recursos, páginas e testes.",
        time: "8 min",
        html: `
          <div class="code-wrap"><span class="code-label">estrutura</span><button class="copy-code">Copiar</button><pre><code>projeto/
├── build.gradle
├── settings.gradle
├── src/
│   ├── main/
│   │   ├── java/br/com/exemplo/aplicacao/
│   │   │   ├── controller/
│   │   │   ├── service/
│   │   │   ├── dao/
│   │   │   ├── model/
│   │   │   └── exception/
│   │   ├── resources/
│   │   └── webapp/WEB-INF/
│   └── test/
│       ├── java/
│       └── resources/
└── README.md</code></pre></div>
          <h2 id="pastas">O que vai em cada pasta</h2>
          <ul>
            <li><code>src/main/java</code>: classes Java da aplicação.</li>
            <li><code>src/main/resources</code>: configurações e recursos do classpath.</li>
            <li><code>src/main/webapp</code>: JSPs e arquivos públicos de uma aplicação WAR.</li>
            <li><code>src/test/java</code>: testes automatizados.</li>
            <li><code>src/test/resources</code>: dados e configurações exclusivos dos testes.</li>
          </ul>
          <p>Projetos que geram JAR normalmente não possuem <code>src/main/webapp</code>. Em Maven, a estrutura de <code>src</code> é semelhante, mas a construção é configurada no <code>pom.xml</code>.</p>
        `
      },
      {
        id: "pacotes",
        nav: "Organização dos pacotes",
        title: "Organização dos pacotes",
        lead: "O nome do pacote mostra a responsabilidade técnica da classe e reduz o tempo necessário para localizar código.",
        time: "9 min",
        html: `
          <p>O pacote raiz costuma usar o domínio invertido: <code>br.com.exemplo.aplicacao</code>.</p>
          <div class="table-wrap"><table><thead><tr><th>Pacote</th><th>Conteúdo</th></tr></thead><tbody>
            <tr><td><code>controller</code></td><td>Servlets e endpoints HTTP.</td></tr>
            <tr><td><code>service</code> ou <code>bo</code></td><td>Coordenação das operações.</td></tr>
            <tr><td><code>dao</code></td><td>SQL, JDBC e mapeamento de resultados.</td></tr>
            <tr><td><code>model</code></td><td>Objetos que representam os dados principais.</td></tr>
            <tr><td><code>dto</code></td><td>Objetos específicos de entrada e saída.</td></tr>
            <tr><td><code>exception</code></td><td>Erros próprios da aplicação.</td></tr>
            <tr><td><code>filter</code></td><td>Intercepção de requisições e respostas.</td></tr>
            <tr><td><code>config</code></td><td>Configuração da infraestrutura.</td></tr>
            <tr><td><code>util</code></td><td>Utilitários pequenos, reutilizáveis e sem estado.</td></tr>
          </tbody></table></div>
          <div class="callout warning"><span class="callout-icon">!</span><p><code>util</code> não deve virar um depósito de classes sem responsabilidade definida. Se uma classe pertence claramente a uma camada, coloque-a nessa camada.</p></div>
        `
      },
      {
        id: "classes",
        nav: "Estrutura das classes",
        title: "Estrutura das classes",
        lead: "Cada tipo de classe possui um papel específico. Observe o formato básico de cada uma.",
        time: "12 min",
        html: `
          <h2 id="model">Model</h2>
          <p>Representa dados da aplicação e mantém seus campos encapsulados.</p>
          <div class="code-wrap"><span class="code-label">java</span><button class="copy-code">Copiar</button><pre><code>public class Registro {
    private Integer id;
    private String descricao;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }
}</code></pre></div>
          <h2 id="dto">DTO</h2>
          <p>Transporta somente os dados necessários para um fluxo específico. Ele evita expor todo o objeto interno.</p>
          <h2 id="dao">DAO</h2>
          <p>Concentra SQL, JDBC e a conversão do <code>ResultSet</code> para objetos Java.</p>
          <h2 id="service">Service ou BO</h2>
          <p>Coordena a operação, chama DAOs e impede que detalhes JDBC cheguem ao Controller.</p>
          <h2 id="controller">Controller</h2>
          <p>Lê a entrada HTTP, chama o Service ou BO e escreve a resposta. Não deve montar SQL.</p>
          <h2 id="exception">Exception</h2>
          <p>Representa uma categoria de erro e preserva a causa original para facilitar o diagnóstico.</p>
        `
      },
      {
        id: "fluxo-requisicao",
        nav: "Fluxo de uma requisição",
        title: "Fluxo técnico de uma requisição",
        lead: "Acompanhar o fluxo ponta a ponta é uma das habilidades mais importantes para compreender uma aplicação web.",
        time: "7 min",
        html: `
          <ol class="steps">
            <li>O navegador envia uma requisição HTTP.</li>
            <li>O contêiner direciona a requisição ao Controller.</li>
            <li>O Controller lê e valida o formato da entrada.</li>
            <li>O Controller chama o Service ou BO.</li>
            <li>O Service coordena a operação e chama o DAO.</li>
            <li>O DAO executa SQL por JDBC.</li>
            <li>O resultado é convertido em objetos Java.</li>
            <li>O Controller transforma o resultado em resposta HTTP.</li>
          </ol>
          <div class="callout"><span class="callout-icon">→</span><p>Quando surgir uma dúvida, localize primeiro o ponto de entrada e siga as chamadas de método na mesma direção do fluxo.</p></div>
        `
      },
      {
        id: "dependencias",
        nav: "Dependências entre camadas",
        title: "Dependências entre camadas",
        lead: "Uma arquitetura clara depende de relações previsíveis entre seus componentes.",
        time: "6 min",
        html: `
          <div class="flow"><span>controller</span><b>→</b><span>service</span><b>→</b><span>dao</span><b>→</b><span>banco</span></div>
          <ul>
            <li>Controller pode usar Service, DTO, Model e Exception.</li>
            <li>Service pode usar DAO, DTO, Model e Exception.</li>
            <li>DAO pode usar Model e Exception.</li>
            <li>Model não deve depender de Controller, Servlet ou JDBC.</li>
            <li>Dependências circulares entre pacotes devem ser evitadas.</li>
          </ul>
          <p>Essa direção permite alterar a interface sem reescrever a persistência e facilita testar uma camada isoladamente.</p>
        `
      },
      {
        id: "jdbc",
        nav: "Acesso a dados com JDBC",
        title: "Acesso a dados com JDBC",
        lead: "JDBC é a API padrão usada pelo Java para conversar com bancos de dados relacionais.",
        time: "12 min",
        html: `
          <div class="table-wrap"><table><thead><tr><th>Tipo</th><th>Função</th></tr></thead><tbody>
            <tr><td><code>DataSource</code></td><td>Fornece conexões em ambientes gerenciados.</td></tr>
            <tr><td><code>Connection</code></td><td>Representa uma sessão e controla transações.</td></tr>
            <tr><td><code>PreparedStatement</code></td><td>Executa SQL parametrizado.</td></tr>
            <tr><td><code>ResultSet</code></td><td>Percorre as linhas de uma consulta.</td></tr>
            <tr><td><code>SQLException</code></td><td>Representa falhas de acesso a dados.</td></tr>
          </tbody></table></div>
          <h2 id="consulta">Consulta segura</h2>
          <div class="code-wrap"><span class="code-label">java</span><button class="copy-code">Copiar</button><pre><code>String sql = "SELECT id, descricao FROM registro WHERE id = ?";

try (PreparedStatement statement = conexao.prepareStatement(sql)) {
    statement.setInt(1, id);
    try (ResultSet resultado = statement.executeQuery()) {
        if (resultado.next()) {
            // Converte a linha em um objeto Java.
        }
    }
}</code></pre></div>
          <h2 id="transacoes">Transações</h2>
          <p>Uma transação agrupa operações que devem ser confirmadas com <code>commit</code> ou desfeitas com <code>rollback</code>. Seu limite normalmente fica no Service ou BO que coordena a operação completa.</p>
        `
      },
      {
        id: "excecoes",
        nav: "Tratamento de exceções",
        title: "Tratamento de exceções",
        lead: "Cada camada trata somente o erro que consegue resolver ou traduzir adequadamente.",
        time: "8 min",
        html: `
          <div class="table-wrap"><table><thead><tr><th>Camada</th><th>Ação esperada</th></tr></thead><tbody>
            <tr><td>DAO</td><td>Libera recursos e propaga a falha de persistência com contexto.</td></tr>
            <tr><td>Service</td><td>Coordena rollback e traduz falhas técnicas.</td></tr>
            <tr><td>Controller</td><td>Converte a falha em uma resposta HTTP segura.</td></tr>
            <tr><td>Interface</td><td>Exibe uma mensagem adequada ao usuário.</td></tr>
          </tbody></table></div>
          <ul>
            <li>Capture tipos específicos quando possível.</li>
            <li>Nunca ignore uma exceção silenciosamente.</li>
            <li>Preserve a causa original.</li>
            <li>Não devolva stack trace ao cliente.</li>
            <li>Não registre senhas, tokens ou dados sensíveis.</li>
          </ul>
        `
      },
      {
        id: "io",
        nav: "Entrada, saída e recursos",
        title: "Entrada, saída e recursos",
        lead: "Arquivos, streams e conexões devem ser manipulados com tipo, charset e fechamento corretos.",
        time: "7 min",
        html: `
          <ul>
            <li>Use <code>InputStream</code> e <code>OutputStream</code> para dados binários.</li>
            <li>Use <code>Reader</code> e <code>Writer</code> para texto.</li>
            <li>Informe explicitamente o charset.</li>
            <li>Prefira <code>Path</code> e <code>Files</code> para caminhos e arquivos.</li>
            <li>Use try-with-resources para liberar recursos automaticamente.</li>
          </ul>
          <div class="code-wrap"><span class="code-label">java</span><button class="copy-code">Copiar</button><pre><code>Path caminho = Paths.get("dados", "entrada.txt");

try (BufferedReader leitor =
        Files.newBufferedReader(caminho, StandardCharsets.UTF_8)) {
    String linha;
    while ((linha = leitor.readLine()) != null) {
        processar(linha);
    }
}</code></pre></div>
        `
      },
      {
        id: "configuracao",
        nav: "Configuração",
        title: "Configuração da aplicação",
        lead: "Valores que mudam entre ambientes não devem ficar gravados diretamente no código.",
        time: "5 min",
        html: `
          <p>Endereços de banco, URLs de serviços, diretórios, timeouts e níveis de log podem ser fornecidos por:</p>
          <ul>
            <li>arquivos <code>.properties</code>;</li>
            <li>variáveis de ambiente;</li>
            <li>JNDI;</li>
            <li>configuração do contêiner.</li>
          </ul>
          <div class="callout warning"><span class="callout-icon">!</span><p>Credenciais, tokens e outros segredos nunca devem ser versionados no repositório.</p></div>
        `
      },
      {
        id: "convencoes",
        nav: "Convenções de código",
        title: "Convenções de código",
        lead: "Nomes consistentes tornam a intenção do código visível antes mesmo de abrir uma classe.",
        time: "7 min",
        html: `
          <div class="table-wrap"><table><thead><tr><th>Elemento</th><th>Convenção</th><th>Exemplo</th></tr></thead><tbody>
            <tr><td>Pacote</td><td>minúsculas</td><td><code>br.com.exemplo.dao</code></td></tr>
            <tr><td>Classe</td><td>PascalCase</td><td><code>RegistroService</code></td></tr>
            <tr><td>Método</td><td>camelCase</td><td><code>localizarPorId</code></td></tr>
            <tr><td>Constante</td><td>UPPER_SNAKE_CASE</td><td><code>TAMANHO_MAXIMO</code></td></tr>
            <tr><td>Teste</td><td>Classe + Test</td><td><code>RegistroServiceTest</code></td></tr>
          </tbody></table></div>
          <p>Mantenha métodos com propósito claro, evite estado global mutável e prefira interfaces como <code>List</code>, <code>Set</code> e <code>Map</code> nas declarações.</p>
        `
      },
      {
        id: "testes",
        nav: "Testes",
        title: "Organização dos testes",
        lead: "A árvore de testes deve acompanhar a organização do código principal.",
        time: "6 min",
        html: `
          <div class="code-wrap"><span class="code-label">estrutura</span><button class="copy-code">Copiar</button><pre><code>src/test/java/br/com/exemplo/aplicacao/
├── controller/
├── service/
├── dao/
└── util/</code></pre></div>
          <ul>
            <li><strong>Unitário:</strong> verifica uma classe isoladamente.</li>
            <li><strong>Integração:</strong> verifica banco, contêiner ou outro recurso.</li>
            <li><strong>Fluxo web:</strong> verifica requisição, resposta e integração das camadas.</li>
          </ul>
          <p>Um bom teste é independente, reproduzível e claro sobre o comportamento técnico verificado.</p>
        `
      },
      {
        id: "build",
        nav: "Construção e implantação",
        title: "Construção e implantação",
        lead: "O código Java é compilado, testado, empacotado e entregue ao ambiente de execução.",
        time: "6 min",
        html: `
          <div class="flow"><span>.java</span><b>→ javac →</b><span>.class</span><b>→ build →</b><span>WAR</span><b>→ deploy →</b><span>Tomcat</span></div>
          <p>Gradle ou Maven resolve dependências, compila o código, executa testes, copia recursos e produz o artefato final.</p>
          <p>APIs fornecidas pelo contêiner, como Servlet em determinados ambientes, precisam do escopo correto para não serem empacotadas desnecessariamente.</p>
        `
      },
      {
        id: "checklist-classes",
        nav: "Checklist para classes",
        title: "Checklist para novas classes",
        lead: "Use estas perguntas antes de adicionar uma classe ao projeto.",
        time: "4 min",
        html: `
          <ul class="checklist">
            <li>Qual é a responsabilidade única da classe?</li>
            <li>Em qual pacote ela deve ficar?</li>
            <li>Suas dependências respeitam a direção das camadas?</li>
            <li>Existe uma abstração que deve ser reutilizada?</li>
            <li>O nome descreve claramente sua função?</li>
            <li>Recursos externos são fechados corretamente?</li>
            <li>As exceções preservam causa e contexto?</li>
            <li>Algum dado sensível pode chegar aos logs?</li>
            <li>O código é compatível com a versão Java do projeto?</li>
            <li>É necessário criar ou atualizar testes?</li>
          </ul>
        `
      },
      {
        id: "checklist-fluxo",
        nav: "Checklist para fluxos",
        title: "Checklist para revisar um fluxo",
        lead: "Uma leitura estruturada reduz suposições e ajuda a localizar responsabilidades indevidas.",
        time: "5 min",
        html: `
          <ul class="checklist">
            <li>Qual URL ou evento inicia o fluxo?</li>
            <li>Qual Controller recebe a requisição?</li>
            <li>Quais dados de entrada são lidos?</li>
            <li>Qual Service ou BO é chamado?</li>
            <li>Quais DAOs participam da operação?</li>
            <li>Onde a transação começa e termina?</li>
            <li>Como o resultado é convertido em objetos ou DTOs?</li>
            <li>Quais recursos externos são utilizados?</li>
            <li>Como as exceções são propagadas?</li>
            <li>Como a resposta HTTP é construída?</li>
            <li>Existem dependências indevidas entre camadas?</li>
            <li>Há testes para o caminho principal e para os erros?</li>
          </ul>
        `
      },
      {
        id: "referencias",
        nav: "Referências",
        title: "Referências oficiais",
        lead: "Use a documentação oficial para aprofundar os conceitos apresentados.",
        time: "3 min",
        html: `
          <ul>
            <li><a href="https://docs.oracle.com/javase/8/docs/api/" target="_blank" rel="noreferrer">Java SE 8 API Specification</a></li>
            <li><a href="https://docs.oracle.com/javase/tutorial/java/concepts/" target="_blank" rel="noreferrer">Object-Oriented Programming Concepts</a></li>
            <li><a href="https://docs.oracle.com/javase/tutorial/collections/" target="_blank" rel="noreferrer">Collections Framework</a></li>
            <li><a href="https://docs.oracle.com/javase/tutorial/essential/exceptions/" target="_blank" rel="noreferrer">Exceptions</a></li>
            <li><a href="https://docs.oracle.com/javase/tutorial/jdbc/" target="_blank" rel="noreferrer">JDBC Database Access</a></li>
            <li><a href="https://docs.oracle.com/javaee/7/tutorial/" target="_blank" rel="noreferrer">Java EE 7 Tutorial</a></li>
          </ul>
        `
      }
    ]
  },

  "guia-java-webtrans": {
    label: "Guia 02",
    title: "Java no WebTrans",
    shortTitle: "Java no WebTrans",
    description: "Relacione fundamentos de Java com a arquitetura e as tecnologias usadas no WebTrans.",
    level: "Aplicação",
    source: "ESTRUTURA.md",
    sections: [
      {
        id: "inicio",
        nav: "Comece por aqui",
        title: "Java para entender o WebTrans",
        lead: "Conheça o caminho percorrido por uma requisição e os conceitos necessários para ler o backend com segurança.",
        time: "6 min",
        html: `
          <div class="callout"><span class="callout-icon">02</span><p><strong>Contexto técnico:</strong> Java 8, Java EE 7, Servlets, JSP, JDBC, PostgreSQL e uma combinação de arquitetura em camadas com estruturas legadas.</p></div>
          <h2 id="mapa-sistema">Mapa do sistema</h2>
          <div class="flow"><span>JSP / Vue</span><b>→</b><span>Controller</span><b>→</b><span>BO</span><b>→</b><span>DAO</span><b>→</b><span>PostgreSQL</span></div>
          <p>Para compreender uma rotina, observe quatro perspectivas: sintaxe Java, orientação a objetos, execução web no Tomcat e persistência por JDBC.</p>
          <h2 id="estrategia">Estratégia de leitura</h2>
          <ol class="steps">
            <li>Localize a tela e a requisição enviada.</li>
            <li>Siga o Controller, o BO e o DAO.</li>
            <li>Observe SQL, transação e mapeamento de dados.</li>
            <li>Confira a resposta e o tratamento de exceções.</li>
          </ol>
        `
      },
      {
        id: "fundamentos",
        nav: "Fundamentos de Java",
        title: "Fundamentos de Java",
        lead: "Java é uma linguagem fortemente tipada: variáveis, parâmetros e retornos possuem tipos conhecidos pelo compilador.",
        time: "14 min",
        html: `
          <h2 id="plataforma">JDK, JRE e JVM</h2>
          <ul>
            <li><strong>JVM:</strong> executa o bytecode <code>.class</code>.</li>
            <li><strong>JRE:</strong> reúne a JVM e as bibliotecas necessárias para executar aplicações.</li>
            <li><strong>JDK:</strong> adiciona ferramentas de desenvolvimento, como o compilador <code>javac</code>.</li>
          </ul>
          <h2 id="tipos">Tipos e referências</h2>
          <div class="code-wrap"><span class="code-label">java</span><button class="copy-code">Copiar</button><pre><code>int quantidade = 10;
double peso = 25.5;
boolean ativo = true;
String descricao = "Exemplo";
List&lt;String&gt; itens = new ArrayList&lt;&gt;();</code></pre></div>
          <p>Tipos por referência podem conter <code>null</code>. Verifique a existência do objeto antes de usá-lo.</p>
          <h2 id="fluxo">Controle de fluxo e métodos</h2>
          <p><code>if</code>, <code>switch</code>, <code>for</code>, <code>while</code> e <code>return</code> determinam o caminho da execução. Métodos agrupam operações, recebem parâmetros e podem retornar valores.</p>
          <h2 id="strings">String e StringBuilder</h2>
          <p><code>String</code> é imutável. Para montar textos extensos por etapas, como consultas SQL, use <code>StringBuilder</code>.</p>
        `
      },
      {
        id: "orientacao-objetos",
        nav: "Orientação a objetos",
        title: "Orientação a objetos",
        lead: "Objetos reúnem estado e comportamento; classes definem como esses objetos são construídos.",
        time: "15 min",
        html: `
          <h2 id="encapsulamento">Encapsulamento</h2>
          <p>Campos privados protegem o estado interno. Métodos públicos controlam como esse estado é lido ou alterado.</p>
          <h2 id="abstracao">Abstração</h2>
          <p>Uma classe apresenta uma operação útil sem obrigar quem a utiliza a conhecer os detalhes da implementação.</p>
          <h2 id="heranca">Herança</h2>
          <p>Uma classe especializada pode herdar comportamento de uma classe mais geral. No sistema, isso aparece em Servlets, DAOs e beans legados.</p>
          <h2 id="interfaces">Interfaces e polimorfismo</h2>
          <p>Uma interface define um contrato. Diferentes implementações podem ser usadas por meio desse mesmo contrato.</p>
          <h2 id="composicao">Composição</h2>
          <p>Um objeto utiliza ou contém outros objetos. Para simples reutilização, costuma ser mais flexível do que herança.</p>
          <div class="table-wrap"><table><thead><tr><th>Tipo</th><th>Papel</th></tr></thead><tbody>
            <tr><td>Model</td><td>Representa dados e conceitos da aplicação.</td></tr>
            <tr><td>DTO</td><td>Transporta dados entre camadas.</td></tr>
            <tr><td>JavaBean</td><td>Segue convenções de campos privados, construtor vazio, getters e setters.</td></tr>
            <tr><td>BO</td><td>Coordena as operações da aplicação.</td></tr>
            <tr><td>DAO</td><td>Abstrai o acesso ao banco.</td></tr>
          </tbody></table></div>
        `
      },
      {
        id: "procedural",
        nav: "Estilo procedural",
        title: "Estilo procedural",
        lead: "O WebTrans combina orientação a objetos com métodos que executam sequências longas de etapas.",
        time: "7 min",
        html: `
          <p>No estilo procedural, a atenção está na ordem em que os dados são transformados. Ele pode existir dentro de classes Java.</p>
          <div class="table-wrap"><table><thead><tr><th>Orientação a objetos</th><th>Estilo procedural</th></tr></thead><tbody>
            <tr><td>Objetos colaborativos</td><td>Sequência de procedimentos</td></tr>
            <tr><td>Estado e comportamento juntos</td><td>Dados passam entre operações</td></tr>
            <tr><td>Interfaces e composição</td><td>Condicionais escolhem comportamentos</td></tr>
          </tbody></table></div>
          <p>Ao ler um método longo, acompanhe a origem dos dados, mudanças de estado, condições, efeitos externos e tratamento dos erros.</p>
        `
      },
      {
        id: "arquitetura",
        nav: "Arquitetura do WebTrans",
        title: "Arquitetura do WebTrans",
        lead: "A arquitetura pretendida separa apresentação, transporte HTTP, coordenação e persistência.",
        time: "13 min",
        html: `
          <h2 id="view">View: JSP ou Vue</h2>
          <p>Apresenta dados, captura ações e envia requisições HTTP. Não deve acessar diretamente o banco.</p>
          <h2 id="controller">Controller</h2>
          <p>Normalmente estende <code>HttpServlet</code>. Lê parâmetros, obtém o contexto da sessão, chama o BO e prepara JSON, arquivo, redirect ou JSP.</p>
          <h2 id="bo">BO — Business Object</h2>
          <p>Coordena a operação, chama DAOs e controla transações quando vários passos precisam funcionar como uma unidade.</p>
          <h2 id="dao">DAO — Data Access Object</h2>
          <p>Isola SQL, JDBC, mapeamento de <code>ResultSet</code> e fechamento de recursos.</p>
          <h2 id="legado">Estrutura legada</h2>
          <p>Classes como <code>BeanCad</code>, <code>BeanConsulta</code>, <code>BeanConexao</code> e <code>AuxiliarBeanLocaliza</code> podem misturar dados, SQL e persistência. Ao encontrá-las, não presuma que o fluxo seguirá perfeitamente as camadas atuais.</p>
        `
      },
      {
        id: "jdbc",
        nav: "JDBC",
        title: "JDBC no WebTrans",
        lead: "O acesso ao PostgreSQL é feito pela API JDBC e pelo driver específico do banco.",
        time: "12 min",
        html: `
          <div class="flow"><span>Código Java</span><b>→</b><span>java.sql</span><b>→</b><span>Driver PostgreSQL</span><b>→</b><span>Banco</span></div>
          <h2 id="parametros">Consultas parametrizadas</h2>
          <div class="code-wrap"><span class="code-label">java</span><button class="copy-code">Copiar</button><pre><code>String sql = "SELECT id, descricao FROM tabela WHERE id = ?";

try (PreparedStatement statement = conexao.prepareStatement(sql)) {
    statement.setInt(1, id);
    try (ResultSet resultado = statement.executeQuery()) {
        // Percorre e converte os resultados.
    }
}</code></pre></div>
          <div class="callout warning"><span class="callout-icon">!</span><p>Nunca concatene entrada do usuário no SQL. Use placeholders <code>?</code> e métodos como <code>setInt</code> ou <code>setString</code>.</p></div>
          <h2 id="transacao">Transações e mapeamento</h2>
          <p><code>commit</code> confirma alterações e <code>rollback</code> desfaz o que ainda não foi confirmado. O DAO converte manualmente as colunas do <code>ResultSet</code> em objetos Java.</p>
        `
      },
      {
        id: "collections",
        nav: "Collections Framework",
        title: "Collections Framework",
        lead: "Coleções armazenam e manipulam grupos de objetos com características diferentes.",
        time: "9 min",
        html: `
          <div class="table-wrap"><table><thead><tr><th>Interface</th><th>Quando usar</th><th>Implementação comum</th></tr></thead><tbody>
            <tr><td><code>List</code></td><td>Ordem, índice ou repetição importam.</td><td><code>ArrayList</code></td></tr>
            <tr><td><code>Set</code></td><td>Os valores precisam ser únicos.</td><td><code>HashSet</code></td></tr>
            <tr><td><code>Map</code></td><td>Um valor é localizado por chave.</td><td><code>HashMap</code></td></tr>
            <tr><td><code>Queue</code></td><td>Itens aguardam processamento.</td><td><code>LinkedList</code></td></tr>
          </tbody></table></div>
          <div class="code-wrap"><span class="code-label">java</span><button class="copy-code">Copiar</button><pre><code>List&lt;Registro&gt; registros = new ArrayList&lt;&gt;();
Set&lt;Integer&gt; identificadores = new HashSet&lt;&gt;();
Map&lt;Integer, Registro&gt; registrosPorId = new HashMap&lt;&gt;();</code></pre></div>
          <p>Declare pela interface e escolha a implementação ao criar o objeto.</p>
        `
      },
      {
        id: "generics",
        nav: "Generics",
        title: "Generics",
        lead: "Generics permitem informar ao compilador quais tipos uma coleção, classe ou método aceita.",
        time: "8 min",
        html: `
          <p><code>List&lt;Registro&gt;</code> aceita somente objetos compatíveis com <code>Registro</code>. Isso reduz conversões manuais e antecipa erros para a compilação.</p>
          <div class="code-wrap"><span class="code-label">java</span><button class="copy-code">Copiar</button><pre><code>public class Resultado&lt;T&gt; {
    private T valor;

    public T getValor() {
        return valor;
    }
}</code></pre></div>
          <ul>
            <li><code>T</code>: tipo genérico.</li>
            <li><code>E</code>: elemento.</li>
            <li><code>K</code> e <code>V</code>: chave e valor.</li>
            <li><code>? extends Tipo</code>: aceita o tipo ou uma subclasse.</li>
            <li><code>? super Tipo</code>: aceita o tipo ou um ancestral.</li>
          </ul>
        `
      },
      {
        id: "io",
        nav: "Entrada e saída",
        title: "Entrada e saída — IO",
        lead: "No WebTrans, IO aparece em arquivos, XML, EDI, PDFs, uploads, downloads e comunicação HTTP.",
        time: "11 min",
        html: `
          <h2 id="bytes">Bytes e caracteres</h2>
          <p><code>InputStream</code> e <code>OutputStream</code> manipulam bytes. <code>Reader</code> e <code>Writer</code> manipulam texto e precisam de um charset.</p>
          <h2 id="encoding">Encoding</h2>
          <p>Arquivos legados podem usar ISO-8859-1, enquanto integrações recentes podem usar UTF-8. Escolher o charset errado corrompe acentos e pode invalidar arquivos.</p>
          <h2 id="recursos">Try-with-resources</h2>
          <div class="code-wrap"><span class="code-label">java</span><button class="copy-code">Copiar</button><pre><code>try (InputStream entrada = new FileInputStream(origem);
     OutputStream saida = new FileOutputStream(destino)) {
    // Copia os dados e fecha os dois recursos automaticamente.
}</code></pre></div>
          <p>Serialização Java, JSON e XML são mecanismos diferentes. No sistema, JSON costuma usar Gson e XML pode envolver JAXB, DOM, SAX ou bibliotecas de integração.</p>
        `
      },
      {
        id: "java-ee",
        nav: "Java EE e javax",
        title: "Java EE e os pacotes javax",
        lead: "Java SE oferece a base da linguagem; Java EE acrescenta APIs voltadas a aplicações empresariais e web.",
        time: "12 min",
        html: `
          <h2 id="namespace">O namespace javax</h2>
          <p>No projeto, Servlets usam <code>javax.servlet</code>. A migração automática para <code>jakarta.*</code> não é compatível com a base Java EE 7.</p>
          <h2 id="tomcat">Contêiner web</h2>
          <p>O Tomcat carrega Servlets, associa URLs, cria objetos de request e response, gerencia sessões e atende várias requisições simultaneamente.</p>
          <h2 id="servlet">Servlet</h2>
          <p><code>HttpServletRequest</code> fornece parâmetros, headers, sessão e corpo. <code>HttpServletResponse</code> controla status, headers, charset e corpo da resposta.</p>
          <div class="callout warning"><span class="callout-icon">!</span><p>Não armazene dados específicos de uma requisição em campos mutáveis do Servlet. A mesma instância pode atender várias threads.</p></div>
          <h2 id="jsp-war">JSP e WAR</h2>
          <p>JSP é convertida em Servlet pelo contêiner. O Gradle reúne classes, bibliotecas, páginas e configurações em um arquivo WAR para implantação no Tomcat.</p>
        `
      },
      {
        id: "excecoes",
        nav: "Tratamento de exceções",
        title: "Tratamento de exceções",
        lead: "Exceções separam o fluxo principal da aplicação do tratamento de falhas.",
        time: "11 min",
        html: `
          <h2 id="hierarquia">Hierarquia</h2>
          <ul>
            <li><code>Error</code>: falha grave da JVM ou ambiente.</li>
            <li>Exceção verificada: exige captura ou declaração com <code>throws</code>.</li>
            <li><code>RuntimeException</code>: exceção não verificada.</li>
          </ul>
          <h2 id="throw">throw e throws</h2>
          <p><code>throw</code> lança uma exceção. <code>throws</code> declara que um método pode propagá-la.</p>
          <h2 id="responsabilidade">Responsabilidade por camada</h2>
          <div class="flow"><span>DAO: contexto técnico</span><b>→</b><span>BO: tradução</span><b>→</b><span>Controller: resposta</span><b>→</b><span>View: mensagem</span></div>
          <p>Registrar uma exceção não significa tratá-la. O log serve ao diagnóstico; o tratamento decide como o sistema continua.</p>
        `
      },
      {
        id: "complementares",
        nav: "Conhecimentos complementares",
        title: "Conhecimentos complementares",
        lead: "Alguns assuntos aparecem com frequência na manutenção do sistema e merecem estudo posterior.",
        time: "5 min",
        html: `
          <ul>
            <li><code>BigDecimal</code> para valores que exigem precisão decimal.</li>
            <li><code>Date</code>, <code>Calendar</code>, <code>SimpleDateFormat</code> e <code>java.time</code>.</li>
            <li>Annotations e reflection.</li>
            <li>JSON com Gson e XML com JAXB ou DOM.</li>
            <li>Logging com Log4j2.</li>
            <li>HTTP, email e serviços externos.</li>
            <li>Threads e segurança de dados compartilhados.</li>
            <li>Gradle, WAR, PostgreSQL e modelagem relacional.</li>
            <li>Encodings ISO-8859-1 e UTF-8.</li>
            <li>Testes unitários com JUnit.</li>
          </ul>
        `
      },
      {
        id: "ordem-estudo",
        nav: "Ordem de estudo",
        title: "Ordem recomendada de estudo",
        lead: "Avance do código Java básico até o fluxo completo de uma aplicação web.",
        time: "5 min",
        html: `
          <ol class="steps">
            <li>Tipos, variáveis, operadores, métodos e controle de fluxo.</li>
            <li>Classes, objetos, construtores e modificadores.</li>
            <li>Encapsulamento, composição, herança e interfaces.</li>
            <li>String, Collections e generics.</li>
            <li>Exceções, IO e encoding.</li>
            <li>SQL, PostgreSQL, JDBC e transações.</li>
            <li>HTTP, Servlets, sessão, filters e JSP.</li>
            <li>Arquitetura Controller–BO–DAO.</li>
            <li>Estruturas legadas e integrações.</li>
          </ol>
        `
      },
      {
        id: "checklist",
        nav: "Checklist de uma rotina",
        title: "Checklist para compreender uma rotina",
        lead: "Use este roteiro ao receber sua primeira tarefa de leitura no WebTrans.",
        time: "7 min",
        html: `
          <ul class="checklist">
            <li>Qual JSP ou componente Vue inicia a ação?</li>
            <li>Qual URL e qual Controller recebem a requisição?</li>
            <li>Qual método trata a ação?</li>
            <li>Quais parâmetros HTTP são lidos?</li>
            <li>Qual BO é chamado?</li>
            <li>Qual DAO ou bean legado acessa o banco?</li>
            <li>Qual SQL é executado e quais parâmetros são vinculados?</li>
            <li>Como o <code>ResultSet</code> vira objetos?</li>
            <li>Onde a transação inicia, confirma ou desfaz?</li>
            <li>Quais arquivos ou serviços externos são afetados?</li>
            <li>Quais exceções podem ocorrer?</li>
            <li>Qual resposta volta ao frontend?</li>
            <li>O código segue a arquitetura atual ou o padrão legado?</li>
          </ul>
        `
      },
      {
        id: "referencias",
        nav: "Referências",
        title: "Referências oficiais",
        lead: "Aprofunde o estudo nas especificações e tutoriais oficiais usados como base.",
        time: "3 min",
        html: `
          <ul>
            <li><a href="https://docs.oracle.com/javase/8/docs/api/" target="_blank" rel="noreferrer">Java SE 8 API Specification</a></li>
            <li><a href="https://docs.oracle.com/javase/specs/jls/se8/html/" target="_blank" rel="noreferrer">Java Language Specification — Java SE 8</a></li>
            <li><a href="https://docs.oracle.com/javase/tutorial/java/nutsandbolts/" target="_blank" rel="noreferrer">Java Language Basics</a></li>
            <li><a href="https://docs.oracle.com/javase/tutorial/java/concepts/" target="_blank" rel="noreferrer">Object-Oriented Programming Concepts</a></li>
            <li><a href="https://docs.oracle.com/javase/tutorial/jdbc/" target="_blank" rel="noreferrer">JDBC Database Access</a></li>
            <li><a href="https://docs.oracle.com/javaee/7/tutorial/" target="_blank" rel="noreferrer">Java EE 7 Tutorial</a></li>
            <li><a href="https://docs.oracle.com/javaee/7/tutorial/servlets.htm" target="_blank" rel="noreferrer">Java Servlet Technology</a></li>
          </ul>
        `
      }
    ]
  }
};
