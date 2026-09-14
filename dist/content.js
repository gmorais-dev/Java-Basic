const modules = [
    {
        id: "estrutura-webtrans",
        title: "Módulo 1: Estrutura WebTrans",
        source: "ESTRUTURA.md",
        summary: "Este módulo apresenta a estrutura técnica do WebTrans como um sistema Java web real. A ideia é entender como uma ação sai da tela, atravessa HTTP, chega ao controller, passa pelo BO, consulta ou altera dados pelo DAO e retorna uma resposta para o usuário.",
        concepts: [
            {
                name: "Visão geral do WebTrans",
                explanation: "O WebTrans usa Java 8, Java EE 7, Servlets, JSP, JDBC e PostgreSQL. Conceitualmente, isso significa que a aplicação combina código Java executado no servidor, páginas processadas pelo Tomcat, comunicação HTTP e persistência em banco relacional."
            },
            {
                name: "Fluxo de requisição",
                explanation: "Uma funcionalidade normalmente começa na JSP ou em uma tela Vue. O navegador envia uma requisição HTTP, o Tomcat escolhe o servlet correto, o controller interpreta a entrada, o BO executa a regra, o DAO acessa o banco e a resposta volta como JSON, arquivo, redirecionamento ou JSP."
            },
            {
                name: "Controller",
                explanation: "O controller é a fronteira entre o mundo HTTP e o mundo Java da aplicação. Ele deve ler parâmetros, validar formato, recuperar sessão, chamar a camada de negócio e preparar a resposta. Ele não deve conter SQL nem decidir regras profundas do domínio."
            },
            {
                name: "BO: Business Object",
                explanation: "O BO concentra a lógica de aplicação. Ele valida permissões, coordena cálculos, chama um ou mais DAOs e define se uma operação deve ser transacional. É a camada onde o caso de uso ganha significado."
            },
            {
                name: "DAO: Data Access Object",
                explanation: "O DAO isola o acesso ao PostgreSQL. Ele trabalha com Connection, PreparedStatement e ResultSet, monta consultas parametrizadas, converte linhas em objetos Java e fecha recursos. Seu papel é persistência, não interface nem regra de negócio."
            },
            {
                name: "JDBC e PostgreSQL",
                explanation: "JDBC é a API Java para conversar com bancos relacionais. No WebTrans, ela conecta o Java ao PostgreSQL por meio do driver específico. PreparedStatement deve ser usado para evitar concatenação insegura de dados do usuário no SQL."
            },
            {
                name: "Servlets, JSP e Tomcat",
                explanation: "O Tomcat é o contêiner web: carrega servlets, cria objetos de request e response, gerencia sessão e atende várias requisições simultâneas. JSP é uma tecnologia de apresentação server-side e deve evitar regra de negócio."
            },
            {
                name: "Estrutura legada",
                explanation: "Parte do WebTrans usa padrões antigos como BeanCad, BeanConsulta, BeanConexao e AuxiliarBeanLocaliza. Essas classes podem misturar dados, SQL, conexão e persistência. Ao estudar legado, o foco inicial deve ser entender o fluxo completo antes de reorganizar responsabilidades."
            },
            {
                name: "Exceções por camada",
                explanation: "DAO registra ou propaga falhas técnicas com contexto; BO traduz falhas e decide rollback; controller converte o problema em resposta HTTP; a view exibe uma mensagem segura. Stack trace e dados sensíveis não devem aparecer para o usuário final."
            },
            {
                name: "Checklist de leitura",
                explanation: "Para compreender uma rotina, identifique a tela inicial, URL, controller, método acionado, parâmetros lidos, BO chamado, DAO ou bean legado, SQL executado, transação, exceções possíveis e resposta final."
            }
        ],
        code: `JSP ou Vue
    -> requisição HTTP
Controller / Controlador
    -> chamada de método
BO / Business Object
    -> chamada de método
DAO / Data Access Object
    -> JDBC e SQL
PostgreSQL
    -> dados persistentes`,
        reflection: "O WebTrans fica mais legível quando você segue o caminho da requisição do começo ao fim, sem pular diretamente para o SQL ou para a tela."
    },
    {
        id: "estrutura-java",
        title: "Módulo 2: Estrutura Java",
        source: "ESTRUTURA_JAVA.md",
        summary: "Este módulo organiza os conceitos necessários para montar e manter um projeto Java web de forma previsível. O foco é separar responsabilidades, escolher pacotes corretamente, entender a estrutura de diretórios e manter o fluxo técnico limpo entre as camadas.",
        concepts: [
            {
                name: "Arquitetura em camadas",
                explanation: "Uma aplicação Java web pode ser organizada em interface, controller, service ou BO, DAO, model e banco. A dependência deve seguir uma direção: a interface chama o controller, o controller chama o service, o service chama o DAO e o DAO acessa o banco."
            },
            {
                name: "Estrutura de diretórios",
                explanation: "Em projetos Gradle empacotados como WAR, src/main/java guarda classes Java, src/main/resources guarda configurações, src/main/webapp guarda recursos web e WEB-INF protege arquivos internos. src/test/java concentra testes automatizados."
            },
            {
                name: "Pacote controller",
                explanation: "Controllers recebem requisições HTTP, validam entrada, chamam a camada de aplicação e definem resposta. Eles devem conhecer request e response, mas não devem conhecer detalhes de persistência."
            },
            {
                name: "Pacote service ou bo",
                explanation: "Service ou BO coordena o caso de uso. Essa camada organiza a sequência de operações, chama DAOs, define limites de transação e transforma falhas técnicas em erros compreensíveis."
            },
            {
                name: "Pacote dao",
                explanation: "DAOs executam operações de persistência. Eles concentram SQL, PreparedStatement, ResultSet, conversão entre colunas e objetos, inclusão, consulta, atualização, exclusão e fechamento de recursos JDBC."
            },
            {
                name: "Model e DTO",
                explanation: "Model representa conceitos centrais do domínio e pode ter comportamento ligado ao próprio estado. DTO transporta apenas os dados necessários para uma entrada, saída ou transferência entre camadas, evitando expor o modelo inteiro sem necessidade."
            },
            {
                name: "Exception, filter, config e util",
                explanation: "exception guarda erros específicos da aplicação; filter trata preocupações transversais como autenticação e charset; config inicializa infraestrutura; util deve conter apenas utilitários pequenos, reutilizáveis e sem estado."
            },
            {
                name: "Dependências corretas",
                explanation: "Model não deve depender de Servlet, JDBC ou controller. DAO não deve depender de controller. Infraestrutura não deve conhecer a interface. Evitar dependências circulares torna o projeto mais simples de testar e manter."
            },
            {
                name: "Convenções de código",
                explanation: "Pacotes usam letras minúsculas, classes usam PascalCase, métodos e variáveis usam camelCase, constantes usam UPPER_SNAKE_CASE e testes costumam terminar com Test. Convenções reduzem o esforço mental de quem lê."
            },
            {
                name: "Build, testes e implantação",
                explanation: "Gradle ou Maven compila código, executa testes, resolve dependências, copia recursos e produz o artefato final. Em aplicações web tradicionais, o código vira bytecode, é empacotado em WAR e implantado no Tomcat."
            }
        ],
        code: `projeto/
  build.gradle
  src/
    main/
      java/br/com/exemplo/aplicacao/
        controller/
        service/
        dao/
        model/
        dto/
        exception/
        filter/
        config/
        util/
      resources/
      webapp/
        WEB-INF/
    test/
      java/`,
        reflection: "Antes de criar uma classe, decida qual responsabilidade ela tem. O pacote correto nasce dessa resposta."
    }
];

const flowDescriptions = {
    interface: "A interface é o ponto de contato com o usuário. Ela apresenta dados, captura ações e envia requisições HTTP. Conceitualmente, ela deve ser clara, validar interações básicas e delegar regras de negócio para o backend.",
    controller: "O controller traduz HTTP para uma chamada de aplicação. Ele lê parâmetros, sessão e headers, valida formato, chama BO ou service e decide como responder com JSON, arquivo, redirecionamento ou JSP.",
    service: "BO ou service é o centro do caso de uso. Essa camada organiza regras, permissões, cálculos, transações e colaboração entre DAOs, mantendo o controller livre de detalhes de negócio.",
    dao: "DAO protege o restante da aplicação dos detalhes de persistência. Ele monta SQL parametrizado, usa JDBC, percorre ResultSet, cria objetos e fecha recursos.",
    database: "PostgreSQL guarda o estado persistente. Tabelas, views, constraints, sequences e funções fazem parte do comportamento real do sistema, não apenas do armazenamento."
};

const studyPath = [
    "Comece pelo módulo Estrutura Java para entender diretórios, pacotes e responsabilidades.",
    "Depois avance para Estrutura WebTrans para ver esses conceitos aplicados em uma aplicação real.",
    "Siga o fluxo interface, controller, BO/service, DAO e banco antes de alterar qualquer rotina.",
    "Leia exemplos de código procurando entrada, validação, regra, persistência, exceção e resposta.",
    "Use o checklist para revisar se a classe está na camada certa e se suas dependências fazem sentido."
];

const routineChecklist = [
    "A classe tem uma responsabilidade clara?",
    "O pacote escolhido combina com essa responsabilidade?",
    "A dependência segue a direção correta entre camadas?",
    "Entradas externas são validadas antes da regra de negócio?",
    "SQL usa PreparedStatement e parâmetros vinculados?",
    "Recursos JDBC, arquivos e streams são fechados corretamente?",
    "Exceções preservam causa, contexto e resposta segura?"
];

const conceptDetails = {
    "estrutura-webtrans:0": {
        title: "WebTrans como sistema de transporte e logística",
        explanation: "Em um sistema de transporte, a aplicação não é apenas cadastro de telas. Ela acompanha operações como coleta, emissão de conhecimento, manifesto, viagem, entrega, ocorrência, auditoria e consulta operacional. A estrutura WebTrans organiza essas ações em uma aplicação Java web tradicional, onde o usuário trabalha na interface e o servidor executa regras ligadas ao fluxo logístico.",
        examples: [
            "Uma filial consulta conhecimentos pendentes de manifesto para montar uma carga.",
            "Um operador registra uma ocorrência de entrega e o sistema precisa gravar histórico, data, usuário e situação.",
            "Uma rotina de emissão gera XML, valida dados fiscais e persiste o resultado para rastreabilidade."
        ],
        code: `// Exemplo conceitual de domínio logístico
Conhecimento conhecimento = conhecimentoBO.localizar(idConhecimento);
Viagem viagem = viagemBO.montarViagem(filial, motorista, conhecimentos);
manifestoBO.emitir(viagem, usuario);`,
        study: "Leia o sistema pensando em operação logística: documento, carga, filial, veículo, motorista, rota, ocorrência, entrega e faturamento."
    },
    "estrutura-webtrans:1": {
        title: "Fluxo de requisição em uma operação logística",
        explanation: "O fluxo de requisição mostra como uma ação operacional percorre o sistema. Quando o usuário clica para localizar conhecimentos, emitir manifesto ou registrar entrega, o navegador envia dados ao servidor. O controller entende a requisição, o BO aplica regras logísticas e o DAO grava ou consulta o PostgreSQL.",
        examples: [
            "Tela de manifesto envia ids de conhecimentos selecionados.",
            "Controller valida se a lista veio preenchida e se o usuário possui sessão ativa.",
            "BO verifica se os documentos podem entrar na viagem e chama o DAO para persistir o manifesto."
        ],
        code: `POST /manifesto/emitir

request: filial=12&motorista=88&conhecimentos=101,102,103

Controller -> ManifestoBO -> ManifestoDAO -> PostgreSQL`,
        study: "Ao estudar um fluxo, siga a jornada da informação: entrada HTTP, validação, regra logística, persistência e resposta."
    },
    "estrutura-webtrans:2": {
        title: "Controller aplicado ao WebTrans",
        explanation: "No WebTrans, o controller deve tratar a entrada da operação. Ele não deveria decidir se uma carga pode ou não ser manifestada; isso é regra de negócio. Seu papel é receber parâmetros como filial, documento, data, motorista ou ação, validar formato básico e chamar o BO correto.",
        examples: [
            "Ler idConhecimento enviado pela tela de consulta.",
            "Validar se a ação é localizar, cadastrar, excluir ou imprimir.",
            "Retornar JSON para uma tela Vue ou encaminhar atributos para uma JSP."
        ],
        code: `String acao = request.getParameter("acao");
String idConhecimento = request.getParameter("idConhecimento");

if ("localizar".equals(acao)) {
    Conhecimento conhecimento = conhecimentoBO.localizar(Integer.parseInt(idConhecimento), usuario);
    escreverJson(response, conhecimento);
}`,
        study: "Controller bom é fácil de ler: entrada, validação simples, chamada de BO e resposta."
    },
    "estrutura-webtrans:3": {
        title: "BO como regra de transporte",
        explanation: "O BO representa o caso de uso. Em transporte e logística, isso inclui verificar permissões por filial, validar situação de documentos, calcular valores, coordenar transações e impedir estados inválidos, como manifestar um conhecimento cancelado ou finalizar entrega sem ocorrência válida.",
        examples: [
            "Validar se um conhecimento pertence à filial do usuário.",
            "Bloquear emissão de manifesto para documento já entregue.",
            "Cadastrar viagem, vincular documentos e registrar auditoria na mesma transação."
        ],
        code: `public Manifesto emitir(Manifesto manifesto, BeanUsuario usuario) {
    validarFilial(manifesto.getFilial(), usuario);
    validarConhecimentos(manifesto.getConhecimentos());
    return manifestoDAO.cadastrar(manifesto);
}`,
        study: "Quando a pergunta for 'pode fazer isso?', geralmente a resposta deve estar no BO."
    },
    "estrutura-webtrans:4": {
        title: "DAO como acesso ao banco logístico",
        explanation: "O DAO transforma operações do domínio em SQL. Em um sistema logístico, ele consulta conhecimentos, filiais, clientes, notas, viagens, manifestos, ocorrências e auditorias. Ele deve se limitar à persistência e manter SQL parametrizado para proteger os dados.",
        examples: [
            "Buscar conhecimentos por filial, período e situação.",
            "Inserir ocorrência de entrega com data, usuário e observação.",
            "Mapear ResultSet para objetos como Conhecimento, Manifesto ou Viagem."
        ],
        code: `String sql = "SELECT id, numero, situacao FROM conhecimento WHERE filial_id = ? AND situacao = ?";

try (PreparedStatement stmt = conexao.prepareStatement(sql)) {
    stmt.setInt(1, idFilial);
    stmt.setString(2, "PENDENTE");
}`,
        study: "DAO deve responder 'como busco ou salvo?', não 'essa operação é permitida?'."
    },
    "estrutura-webtrans:5": {
        title: "JDBC e PostgreSQL nos dados de transporte",
        explanation: "JDBC permite que o Java converse com o PostgreSQL. Em logística, isso sustenta consultas operacionais e gravações críticas. Transações são importantes porque algumas operações precisam ser tudo ou nada: cadastrar viagem, vincular documentos, atualizar situação e registrar auditoria.",
        examples: [
            "Confirmar manifesto apenas se todos os conhecimentos forem vinculados.",
            "Desfazer alterações quando uma etapa da emissão falha.",
            "Usar PreparedStatement para filtrar por cliente, filial, rota ou período."
        ],
        code: `conexao.setAutoCommit(false);
try {
    viagemDAO.cadastrar(viagem);
    conhecimentoDAO.vincularNaViagem(viagem);
    auditoriaDAO.registrar(usuario, "VIAGEM_CADASTRADA");
    conexao.commit();
} catch (SQLException erro) {
    conexao.rollback();
    throw erro;
}`,
        study: "Toda operação que altera vários registros logísticos deve levantar a pergunta: precisa de transação?"
    },
    "estrutura-webtrans:6": {
        title: "Servlets, JSP e Tomcat no uso operacional",
        explanation: "Servlets recebem as ações das telas e o Tomcat gerencia o ciclo de vida da aplicação. JSPs podem montar telas server-side para consultas, cadastros e relatórios. Como várias requisições podem ocorrer ao mesmo tempo, dados de uma entrega, viagem ou usuário não devem ficar em campos mutáveis do servlet.",
        examples: [
            "Dois operadores consultam cargas ao mesmo tempo.",
            "Uma JSP exibe conhecimentos localizados para uma filial.",
            "Um servlet gera arquivo ou relatório a partir de uma solicitação HTTP."
        ],
        code: `protected void doPost(HttpServletRequest request, HttpServletResponse response)
        throws IOException {
    String filial = request.getParameter("filial");
    // Variável local: pertence somente a esta requisição.
}`,
        study: "Em servlet, pense sempre em concorrência: o que é da requisição deve ficar na requisição."
    },
    "estrutura-webtrans:7": {
        title: "Estrutura legada em rotinas logísticas",
        explanation: "Em sistemas longos, partes antigas podem misturar responsabilidades. Um BeanCad pode guardar dados de tela, abrir conexão, montar SQL e executar persistência. Para transporte e logística, isso costuma aparecer em rotinas de cadastro, consulta, emissão, baixa, arquivo EDI e relatórios.",
        examples: [
            "BeanConsultaConhecimento monta SQL e também guarda filtros da tela.",
            "BeanCadViagem valida campos, grava dados e controla conexão.",
            "Classe auxiliar localiza registros para combos ou telas antigas."
        ],
        code: `BeanConsultaConhecimento consulta = new BeanConsultaConhecimento();
consulta.setFilial(filial);
consulta.setPeriodo(inicio, fim);
Collection resultados = consulta.localizar();`,
        study: "No legado, primeiro desenhe o fluxo real; depois avalie onde as responsabilidades estão misturadas."
    },
    "estrutura-webtrans:8": {
        title: "Exceções em processos de transporte",
        explanation: "Falhas em logística precisam ser tratadas com clareza. Um erro de banco, arquivo fiscal, autorização, conexão externa ou validação de documento não deve vazar como stack trace para o usuário. A camada correta deve preservar a causa técnica e devolver uma mensagem útil.",
        examples: [
            "Falha ao gerar XML de CT-e deve preservar a causa e informar que a emissão não foi concluída.",
            "Erro de conexão com banco deve gerar resposta segura para a tela.",
            "Validação de regra deve informar o motivo operacional, como documento já entregue."
        ],
        code: `catch (SQLException erro) {
    LOG.error("Falha ao consultar conhecimentos pendentes.", erro);
    throw new ExcecaoConsulta("Não foi possível localizar os conhecimentos.", erro);
}`,
        study: "Boa exceção conta o que falhou, preserva a causa e não expõe detalhe sensível."
    },
    "estrutura-webtrans:9": {
        title: "Checklist para ler uma rotina WebTrans",
        explanation: "O checklist transforma leitura de código em investigação guiada. Em uma rotina logística, ele ajuda a descobrir quem iniciou a ação, qual documento foi afetado, qual regra foi aplicada, qual tabela mudou e qual resposta voltou ao usuário.",
        examples: [
            "Na emissão de manifesto: tela, URL, controller, BO, DAO, tabelas e resposta.",
            "Na baixa de entrega: parâmetros, validações, ocorrência, transação e auditoria.",
            "Na consulta de frete: filtros, SQL, mapeamento e formato de saída."
        ],
        code: `1. Tela ou evento
2. URL e controller
3. Parâmetros
4. BO e regra logística
5. DAO e SQL
6. Transação
7. Resposta final`,
        study: "Use o checklist sempre que uma rotina parecer grande demais para entender de uma vez."
    },
    "estrutura-java:0": {
        title: "Arquitetura em camadas",
        explanation: "Camadas separam motivos de mudança. A interface muda por experiência do usuário, controller por contrato HTTP, service por caso de uso, DAO por persistência e model por domínio. Essa divisão evita que uma alteração pequena se espalhe por todo o projeto.",
        examples: [
            "Trocar uma JSP por Vue não deveria obrigar reescrever SQL.",
            "Mudar uma tabela deve afetar principalmente DAO e mapeamentos.",
            "Alterar uma regra deve ficar concentrado em service ou BO."
        ],
        code: `controller -> service -> dao -> banco
controller -> dto/model/exception
service -> dao/model/dto/exception
dao -> model/exception`,
        study: "Quando uma classe faz trabalho de duas camadas, ela fica mais difícil de testar e reutilizar."
    },
    "estrutura-java:1": {
        title: "Estrutura de diretórios",
        explanation: "A estrutura de diretórios separa código-fonte, recursos, webapp e testes. Essa organização cria previsibilidade: qualquer pessoa nova no projeto sabe onde procurar uma classe, uma configuração, uma JSP ou um teste.",
        examples: [
            "Classes Java ficam em src/main/java.",
            "application.properties e log4j2.xml ficam em src/main/resources.",
            "JSPs e assets web ficam em src/main/webapp."
        ],
        code: `src/main/java       -> código Java
src/main/resources  -> configuração e recursos
src/main/webapp     -> conteúdo web
src/test/java       -> testes`,
        study: "Diretório bom reduz pergunta básica: onde coloco ou encontro isso?"
    },
    "estrutura-java:2": {
        title: "Pacote controller",
        explanation: "O pacote controller agrupa classes que recebem HTTP. Ele é a camada de adaptação entre navegador e aplicação. Um controller deve ser direto: ler entrada, chamar service ou BO e montar resposta.",
        examples: [
            "RegistroController atende /registros.",
            "UsuarioController trata login, saída ou consulta.",
            "RelatorioController escreve PDF, JSON ou encaminha para JSP."
        ],
        code: `@WebServlet("/registros")
public class RegistroController extends HttpServlet {
    protected void doGet(HttpServletRequest request, HttpServletResponse response) {
        // Entrada HTTP -> service -> resposta HTTP
    }
}`,
        study: "Evite controller com SQL, regra extensa ou transação complexa."
    },
    "estrutura-java:3": {
        title: "Pacote service ou bo",
        explanation: "Service ou BO representa o caso de uso da aplicação. Ele deve ser chamado pelo controller e pode chamar um ou mais DAOs. Essa camada é ideal para regras, transações e tradução de falhas técnicas.",
        examples: [
            "RegistroService.localizar valida entrada e chama RegistroDAO.",
            "PedidoService.cadastrar coordena pedido, itens e auditoria.",
            "UsuarioService.alterarSenha valida política antes de persistir."
        ],
        code: `public Registro localizar(int id, Connection conexao) {
    try {
        return new RegistroDAO(conexao).localizarPorId(id);
    } catch (SQLException erro) {
        throw new PersistenciaException("Falha ao consultar registro.", erro);
    }
}`,
        study: "Service responde pelo fluxo de aplicação, não pelo detalhe visual ou pelo SQL bruto."
    },
    "estrutura-java:4": {
        title: "Pacote dao",
        explanation: "DAO organiza persistência. Ele mantém SQL e JDBC fora do controller e do service. Isso facilita trocar uma consulta, melhorar performance ou corrigir mapeamento sem mexer na camada HTTP.",
        examples: [
            "localizarPorId executa SELECT com parâmetro.",
            "cadastrar executa INSERT e recupera chave gerada.",
            "atualizarSituacao executa UPDATE com controle de erro."
        ],
        code: `try (PreparedStatement stmt = conexao.prepareStatement(sql)) {
    stmt.setInt(1, id);
    try (ResultSet rs = stmt.executeQuery()) {
        return mapearRegistro(rs);
    }
}`,
        study: "DAO bom tem SQL claro, parâmetros vinculados e fechamento automático de recursos."
    },
    "estrutura-java:5": {
        title: "Model e DTO",
        explanation: "Model representa conceitos do sistema. DTO representa transferência de dados em um fluxo específico. Separar os dois evita expor campos demais e permite respostas mais simples para telas, APIs e relatórios.",
        examples: [
            "Registro é model com id e descrição.",
            "RegistroResumoDTO retorna apenas id e descrição para listagem.",
            "CadastroRegistroDTO pode representar a entrada de um formulário."
        ],
        code: `public class RegistroResumoDTO {
    private Integer id;
    private String descricao;
}`,
        study: "Use DTO quando a tela ou API não precisa conhecer o modelo inteiro."
    },
    "estrutura-java:6": {
        title: "Exception, filter, config e util",
        explanation: "Esses pacotes cuidam de preocupações de apoio. exception nomeia falhas da aplicação, filter intercepta HTTP, config centraliza infraestrutura e util reúne funções pequenas. O cuidado é não transformar util em depósito de responsabilidades indefinidas.",
        examples: [
            "CharsetFilter define UTF-8 para requisições.",
            "PersistenciaException preserva SQLException original.",
            "ConfigBanco carrega dados de conexão do ambiente."
        ],
        code: `public class PersistenciaException extends RuntimeException {
    public PersistenciaException(String mensagem, Throwable causa) {
        super(mensagem, causa);
    }
}`,
        study: "Se uma classe util começa a conhecer regra de negócio, provavelmente ela pertence a outro pacote."
    },
    "estrutura-java:7": {
        title: "Dependências corretas",
        explanation: "Dependência correta mantém o sistema compreensível. Uma classe de model não deve conhecer request, response ou SQL. Um DAO não deve chamar controller. Dependências circulares fazem o projeto ficar frágil e difícil de testar.",
        examples: [
            "Controller pode depender de service.",
            "Service pode depender de DAO.",
            "DAO pode depender de model, mas model não deve depender de DAO."
        ],
        code: `Correto:
RegistroController -> RegistroService -> RegistroDAO -> Registro

Evite:
Registro -> HttpServletRequest
RegistroDAO -> RegistroController`,
        study: "Se a seta de dependência volta para cima, pare e revise a responsabilidade."
    },
    "estrutura-java:8": {
        title: "Convenções de código",
        explanation: "Convenções tornam o projeto legível antes mesmo de entender a regra. Nomes padronizados ajudam a reconhecer rapidamente o papel de uma classe, método, constante ou teste.",
        examples: [
            "br.com.exemplo.aplicacao.dao para pacote.",
            "RegistroService para classe.",
            "localizarPorId para método.",
            "TAMANHO_MAXIMO para constante."
        ],
        code: `package br.com.exemplo.aplicacao.service;

public class RegistroService {
    private static final int TAMANHO_MAXIMO = 100;

    public Registro localizarPorId(int id) {
        return null;
    }
}`,
        study: "Nome bom reduz explicação. Ele mostra intenção antes do corpo do método."
    },
    "estrutura-java:9": {
        title: "Build, testes e implantação",
        explanation: "Build transforma código-fonte em artefato executável. Em uma aplicação web Java tradicional, o Gradle ou Maven compila classes, executa testes, resolve dependências, copia recursos e produz um WAR para implantação no Tomcat.",
        examples: [
            "gradle test executa testes automatizados.",
            "gradle war gera o arquivo de implantação.",
            "Tomcat carrega o WAR e disponibiliza os servlets."
        ],
        code: `.java -> .class -> WAR -> Tomcat -> aplicação web`,
        study: "Entender build ajuda a explicar por que uma classe compila localmente, mas falha ao empacotar ou implantar."
    }
};
