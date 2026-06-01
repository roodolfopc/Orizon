import {
  OrizonAgents,
  formatCompactCurrency,
  formatHa,
  formatNumber,
  formatPercent,
  levelClass,
  levelOrder,
} from "./agents.js";

const DATA_URL = "./data/orizon-data.json?v=20260527-governance";
const SAAS_DATA_URL = "./data/orizon-saas-data.json?v=20260529-saas-v2";
const SAAS_PUBLIC_URL = "./data/orizon-saas-public.json?v=20260529-saas-v2";
const LOCAL_HOSTS = new Set(["", "localhost", "127.0.0.1", "::1"]);
const IS_PUBLIC_DEPLOY =
  Boolean((globalThis as { ORIZON_PUBLIC_DEPLOY?: boolean }).ORIZON_PUBLIC_DEPLOY) ||
  (globalThis.location?.protocol !== "file:" && !LOCAL_HOSTS.has(globalThis.location?.hostname ?? ""));

const navItems = [
  { label: "Inicio", href: "program", scope: "public" },
  { label: "Como funciona", href: "saas-os", scope: "public" },
  { label: "Cliente", href: "client-profile", scope: "restricted" },
  { label: "Plano Vivo", href: "live-plan", scope: "restricted" },
  { label: "Parceiros", href: "partners", scope: "public" },
  { label: "Overview", href: "admin-overview", scope: "admin" },
  { label: "Cockpit", href: "cockpit", scope: "admin" },
  { label: "Carteira", href: "portfolio", scope: "admin" },
  { label: "Credito", href: "credit", scope: "admin" },
  { label: "GIS", href: "gis", scope: "admin" },
  { label: "Report", href: "report", scope: "restricted" },
  { label: "Automacao", href: "automation", scope: "admin" },
];

const automationBlueprint = [
  {
    name: "Dashboard BI",
    agent: "BI / Score Agent",
    flow: "Consome JSON/API, score, pipeline, credito e clientes por nivel.",
  },
  {
    name: "CRM",
    agent: "CRM / Conta Agent",
    flow: "Armazena conta, responsavel, etapa, historico e plano tecnico.",
  },
  {
    name: "Assinatura e aprovacao",
    agent: "Aprovacao / Assinatura Agent",
    flow: "Libera budget apenas com plano tecnico, alcada e trilha de auditoria.",
  },
  {
    name: "Mapas / GIS",
    agent: "GIS / Areas Agent",
    flow: "Conecta grupo, usina, unidade agricola e area evoluida ORIZON.",
  },
  {
    name: "Follow-up",
    agent: "Follow-up / Cadencia Agent",
    flow: "Dispara cadencia, comites, atrasos e revisao de maturidade.",
  },
];

const accessProfiles = [
  {
    id: "visitante",
    label: "Visitante",
    role: "public",
    description: "Ve somente a visao do programa, conceito, parceiros e trilha ORIZON.",
  },
  {
    id: "rodolfo",
    label: "Rodolfo",
    role: "admin",
    description: "Administrador com acesso integral a carteira, dados sensiveis, credito e governanca.",
  },
  {
    id: "marcia",
    label: "Marcia",
    role: "admin",
    description: "Administradora com acesso integral a carteira, dados sensiveis, credito e governanca.",
  },
  {
    id: "cliente-raizen",
    label: "Cliente externo",
    role: "client",
    clientId: "grupo-raizen",
    description: "Visualiza somente o proprio plano, sem carteira completa ou dados sensiveis de outros clientes.",
  },
  {
    id: "parceiro-tch",
    label: "Parceiro TCH",
    role: "partner",
    partner: "TCH",
    description: "Acessa modelos de diagnostico e fluxo tecnico, sem carteira sensivel.",
  },
  {
    id: "parceiro-mais-maquinas",
    label: "Parceiro Mais Maquinas",
    role: "partner",
    partner: "Mais Maquinas",
    description: "Acessa trilhas de equipamentos, pontos e coparticipacao operacional, sem carteira sensivel.",
  },
];
const activeAccessProfiles = IS_PUBLIC_DEPLOY
  ? accessProfiles.filter((profile) => profile.role === "public")
  : accessProfiles;

const governanceLayers = [
  {
    level: "Publico",
    audience: "Visitantes, clientes e parceiros",
    data: "Conceito ORIZON, etapas Diagnosticar/Corrigir/Evoluir, parceiros e trilha de valor.",
    hidden: "Carteira, score por cliente, potencial, credito, situacao comercial e plano interno.",
  },
  {
    level: "Cliente selecionado",
    audience: "Cliente externo cadastrado",
    data: "Seu proprio status, etapa assistida, agenda de diagnostico, pontos elegiveis e proximos marcos.",
    hidden: "Outros clientes, pipeline, score comparativo, credito total e dados internos de decisao.",
  },
  {
    level: "Parceiro operacional",
    audience: "TCH, Mais Maquinas e parceiros futuros",
    data: "Modelos de entrega, checklist tecnico, tipos de laudo, equipamentos e fluxo de execucao.",
    hidden: "Carteira completa, pontos por cliente, credito recomendado e estrategia comercial sensivel.",
  },
  {
    level: "Administrador",
    audience: "Rodolfo e Marcia",
    data: "Todas as camadas: carteira, score, credito, governanca, pipeline, cliente vivo e relatorios.",
    hidden: "Nada no prototipo; em producao, acesso auditado por usuario, perfil e aprovacao.",
  },
];

const programLevelLayers = [
  {
    level: "START",
    stage: "Diagnosticar",
    possibility: "Entrada para diagnostico tecnico e qualificacao da dor operacional.",
    characteristics: [
      "Baixa exposicao",
      "TCH como leitura inicial",
      "Sem evolucao estrutural sem evidencia",
    ],
    unlock: "Avanca com gargalo claro e plano de correcao.",
  },
  {
    level: "FLOW",
    stage: "Corrigir",
    possibility: "Prova de valor com rotina tecnica, treinamento e acompanhamento.",
    characteristics: [
      "Cliente em movimento",
      "Correcao por frente",
      "Follow-up semanal ou quinzenal",
    ],
    unlock: "Avanca com aderencia, recorrencia e potencial de escala.",
  },
  {
    level: "PRIME",
    stage: "Corrigir + Evoluir",
    possibility: "Plano tecnico por unidade, pontos ORIZON e governanca de aprovacao.",
    characteristics: [
      "Potencial de portfolio",
      "Budget por marcos",
      "Parceiros por evidencia",
    ],
    unlock: "Avanca quando vira tese de expansao por safra.",
  },
  {
    level: "LEGACY",
    stage: "Evoluir",
    possibility: "Programa vertical com comite, Evolution Report, GIS e expansao.",
    characteristics: [
      "Cliente ancora",
      "Plano multiunidade",
      "Mais Maquinas quando houver evidencia",
    ],
    unlock: "Evolucao continua com antes/depois e maturidade.",
  },
];

const kaizenStageMoves = {
  K0: {
    title: "Base mapeada",
    movement: "Mapear potencial e iniciar leitura tecnica.",
    partner: "NOOA + TCH",
    fit: "Faz sentido quando a conta ainda nao tem diagnostico recente, area validada ou prioridade operacional clara.",
    output: "Cadastro validado, frente priorizada e agenda de diagnostico.",
  },
  K1: {
    title: "Diagnostico em campo",
    movement: "Medir o gargalo antes de liberar qualquer proxima acao.",
    partner: "TCH Gestao Agricola",
    fit: "Faz sentido quando existem perdas, duvidas de aplicacao, despadronizacao ou baixa visibilidade de rotina.",
    output: "Laudo tecnico, evidencia de campo e plano de correcao.",
  },
  K2: {
    title: "Plano de correcao",
    movement: "Priorizar a rotina que corrige a causa do problema.",
    partner: "NOOA + TCH",
    fit: "Faz sentido quando o diagnostico ja mostrou onde atuar: equipe, regulagem, janela, protocolo ou manejo.",
    output: "Plano aprovado, responsavel definido e marco de reafericao.",
  },
  K3: {
    title: "Execucao assistida",
    movement: "Operar o plano com acompanhamento e evidencia.",
    partner: "NOOA + parceiros por demanda",
    fit: "Faz sentido quando a usina ja tem um plano tecnico e precisa transformar recomendacao em rotina executada.",
    output: "Projeto implantado, evidencias anexadas e follow-up ativo.",
  },
  K4: {
    title: "Resultado validado",
    movement: "Medir antes/depois e decidir se a evolucao e operacional ou estrutural.",
    partner: "NOOA + cliente",
    fit: "Faz sentido quando ja existe resultado para defender expansao, ajustes de rota ou novo ciclo de melhoria.",
    output: "Indicador validado, Evolution Report e tese de continuidade.",
  },
  K5: {
    title: "Benchmark replicavel",
    movement: "Escalar o que funcionou para outras areas, unidades ou safras.",
    partner: "Comite ORIZON",
    fit: "Faz sentido quando o modelo virou referencia e pode orientar investimento, padrao ou portfolio.",
    output: "Case interno, governanca de expansao e novo ciclo Kaizen.",
  },
};

const partnerProgramPartners = [
  {
    id: "tch",
    partner: "TCH Gestao Agricola",
    logo: "./assets/tch-logo-framed.jpg",
    summary: "Parceiro de diagnostico, auditoria e padronizacao operacional.",
    media: {
      type: "video",
      src: "./assets/tch-controle-qualidade.mp4",
      label: "Controle de qualidade em campo",
      caption: "Registro visual da rotina de afericao, leitura tecnica e validacao operacional.",
    },
    actions: [
      {
        id: "qualidade",
        label: "Qualidade de aplicacao",
        stage: "Diagnosticar",
        model: "Afericao em campo, uniformidade, dose, cobertura e aderencia ao protocolo.",
        evidence: "Indice de conformidade, fotos, geolocalizacao e plano de correcao.",
      },
      {
        id: "eficiencia",
        label: "Eficiencia operacional",
        stage: "Diagnosticar",
        model: "Leitura de frente, turno, maquina, janela agricola e risco de perda operacional.",
        evidence: "Laudo tecnico, gargalo priorizado e rotina de acompanhamento.",
      },
      {
        id: "treinamento",
        label: "Treinamento tecnico",
        stage: "Corrigir",
        model: "Capacitacao da equipe, padronizacao de rotina e reafericao apos ajuste.",
        evidence: "Agenda, lista de presenca, protocolo replicavel e evidencias de execucao.",
      },
      {
        id: "report",
        label: "Evolution Report",
        stage: "Evoluir",
        model: "Consolidacao antes/depois, aprendizado por safra e recomendacao do proximo ciclo.",
        evidence: "Relatorio executivo, indicadores, ROI operacional e tese de expansao.",
      },
    ],
  },
  {
    id: "mais-maquinas",
    partner: "Mais Maquinas",
    logo: "./assets/mais-maquinas-logo-framed.jpg",
    summary: "Parceiro de alternativas estruturais quando o diagnostico aponta restricao de equipamento.",
    media: {
      type: "gif",
      src: "./assets/mais-maquinas-portfolio-loop.gif",
      label: "Portfólio de implementos",
      caption: "Exemplos visuais do portfólio para avaliar alternativas estruturais por evidencia tecnica.",
    },
    actions: [
      {
        id: "aplicacao",
        label: "Sistemas de aplicacao",
        stage: "Corrigir",
        model: "Equipamentos para padronizar dosagem, preparo, calda e qualidade de aplicacao.",
        evidence: "Laudo indicando perda por variacao de dosagem, temperatura, preparo ou aplicacao.",
      },
      {
        id: "vinhaca",
        label: "Vinhaca localizada",
        stage: "Evoluir",
        model: "Modelos para operacoes com necessidade de aplicacao localizada e maior controle operacional.",
        evidence: "Evidencia de desuniformidade, perda de eficiencia ou limitacao de estrutura atual.",
      },
      {
        id: "calda",
        label: "Calda fresca",
        stage: "Evoluir",
        model: "Carretas e solucoes para preparar calda proxima da aplicacao e reduzir variacao entre frentes.",
        evidence: "Plano PRIME/LEGACY com escala, comite e comparativo de ganho operacional.",
      },
      {
        id: "campo",
        label: "Itens de campo",
        stage: "Diagnosticar",
        model: "Ferramentas simples para afericao, rotina de medicao e disciplina operacional.",
        evidence: "Necessidade de padronizar afericoes antes de ampliar a operacao.",
      },
    ],
  },
];

const followUpCadenceOptions = [
  { value: "Semanal", label: "Semanal", moment: "Execucao em campo", objective: "Destravar pendencias operacionais" },
  { value: "Quinzenal", label: "Quinzenal", moment: "Diagnostico e correcao", objective: "Revisar evidencias, cotacoes e tarefas abertas" },
  { value: "Mensal", label: "Mensal", moment: "Comite operacional", objective: "Consolidar score, hectares, riscos e decisoes" },
  { value: "Bimestral", label: "Bimestral", moment: "Reavaliacao tecnica", objective: "Medir aderencia, treinamento e qualidade operacional" },
  { value: "Trimestral", label: "Trimestral", moment: "Revisao executiva", objective: "Atualizar Evolution Report e tese de expansao" },
  { value: "Inicio de safra", label: "Inicio de safra", moment: "Planejamento agricola", objective: "Definir unidades, janelas, produtos e parceiros" },
  { value: "Fim de safra", label: "Fim de safra", moment: "Fechamento de ciclo", objective: "Validar resultado, benchmark e proximo ciclo" },
];

const followUpObjectiveOptions = [
  "Relacionamento",
  "Diagnostico",
  "Correcao operacional",
  "Cotacao",
  "Comite",
  "Parceiro",
  "Safra",
  "Evolution Report",
];

const followUpStageOptions = ["Diagnosticar", "Corrigir", "Evoluir", "Governanca", "Safra"];
const followUpStatusOptions = ["A fazer", "Em andamento", "Concluido"];

const institutionalChapters = [
  {
    kicker: "Origem NOOA",
    title: "Ecossistema organizado para agregar valor ao agro.",
    body: "A base institucional apresenta a NOOA como um ecossistema de empresas dentro da economia circular, com ciencia e tecnologia agricola como motor.",
  },
  {
    kicker: "Proposito",
    title: "Transformar o campo em um ambiente mais equilibrado e resiliente.",
    body: "Empresa nativa biologica, fundada em 2016, com foco em solucoes que aumentam eficiencia dos sistemas produtivos.",
  },
  {
    kicker: "Operacao",
    title: "Relacionamento tecnico assistido como premissa comercial.",
    body: "A marca sustenta inovacao continua, garantia de qualidade e difusao de conhecimento de valor como eixo de crescimento.",
  },
  {
    kicker: "Escala",
    title: "Presenca nacional e portfolio biologico para diferentes sistemas.",
    body: "O institucional destaca equipe nos principais estados produtores, CDs estrategicos e portfolio com AUFIX, BRAFIX, AURAS, AUBA, BOVETTUS, METTUS, BETTUS e TRITTER.",
  },
];

const institutionalSignals = [
  ["2016", "origem biologica"],
  ["78", "time NOOA Brasil"],
  ["45", "RTCs e CTVs"],
  ["3", "CDs estrategicos"],
];

const tchDiagnosticModels = [
  {
    title: "Qualidade de aplicacao",
    stage: "Diagnosticar",
    scope: "Verificar dose, uniformidade, regulagem, cobertura, perdas e aderencia operacional.",
    outputs: ["Afericao em campo", "Indice de conformidade", "Fotos e geolocalizacao", "Plano de correcao"],
  },
  {
    title: "Eficiencia operacional",
    stage: "Diagnosticar",
    scope: "Medir frente, turno, maquina, janela agricola, padronizacao e risco de perda invisivel.",
    outputs: ["Laudo tecnico", "Prioridade por frente", "Risco operacional", "Rotina de acompanhamento"],
  },
  {
    title: "Plantio, colheita e tratos",
    stage: "Diagnosticar",
    scope: "Auditar indicadores de plantio, colheita, preparo de solo, cana planta, cana soca e tratos culturais.",
    outputs: ["Checklist por operacao", "Desvio por maquina", "Historico por turno", "Benchmark tecnico"],
  },
  {
    title: "Treinamento e padronizacao",
    stage: "Corrigir",
    scope: "Capacitar equipe, corrigir rotina e criar protocolo replicavel para produtos biologicos.",
    outputs: ["Agenda de treinamento", "Lista de presenca", "Padrao operacional", "Evidencias de execucao"],
  },
  {
    title: "Validacao de area semi-comercial",
    stage: "Corrigir",
    scope: "Acompanhar areas piloto, comparar manejos e definir criterio de expansao do cliente.",
    outputs: ["Relatorio de campo", "Benchmark operacional", "Indicador de continuidade", "Reuniao tecnica"],
  },
  {
    title: "Evolution Report tecnico",
    stage: "Evoluir",
    scope: "Consolidar antes/depois, aprendizado por safra e recomendacao de proxima onda.",
    outputs: ["Relatorio executivo", "Evidencias", "ROI operacional", "Tese de expansao"],
  },
];

const tchCommercialOptions = [
  {
    product: "Diagnostico Tecnico de Qualidade",
    specification: "Qualidade operacional",
    points: "Faixa Essencial",
    maxOrizon: "Cobertura por pontos ate 100%",
    stage: "Diagnosticar",
    decision: "Porta de entrada recomendada para qualquer cliente sem evidencia recente.",
  },
  {
    product: "Treinamento Tecnico Equipe Operacional",
    specification: "1 dia de treinamento com a equipe",
    points: "Faixa Correcao",
    maxOrizon: "Cobertura por pontos ate 100%",
    stage: "Corrigir",
    decision: "Acionado depois do laudo, quando o gargalo for rotina, regulagem, equipe ou padrao de execucao.",
  },
];

const equipmentModels = [
  {
    title: "Sistema de corte de soqueira",
    stage: "Corrigir",
    specification: "Tanque de 100l ou 200l com bombas eletricas",
    points: "Faixa Estrutural 1",
    maxOrizon: "Coparticipacao por pontos ate 50%",
    fit: "Cliente com falha operacional ligada ao corte de soqueira e necessidade de dosagem controlada.",
    note: "Usar somente apos diagnostico apontar perda por execucao ou equipamento.",
  },
  {
    title: "Tanque termico com dosador eletronico",
    stage: "Corrigir",
    specification: "Acoplado ao caminhao de calda pronta",
    points: "Faixa Estrutural 1",
    maxOrizon: "Coparticipacao por pontos ate 50%",
    fit: "Operacoes com necessidade de preservar calda, padronizar dosagem e reduzir variacao de preparo.",
    note: "Recomendado quando o gargalo for preparo, temperatura, dosagem ou estabilidade da calda.",
  },
  {
    title: "Sistema de aplicacao em vinhaca localizada",
    stage: "Evoluir",
    specification: "300l",
    points: "Faixa Estrutural 2",
    maxOrizon: "Coparticipacao por pontos ate 50%",
    fit: "Clientes com evidencia de perda ou desuniformidade em aplicacao de vinhaca localizada.",
    note: "Opcao mais aderente ao caso Aralco, mas apenas depois de manutencao e reafericao.",
  },
  {
    title: "Tanque termico para operacao de cobricao",
    stage: "Evoluir",
    specification: "300l",
    points: "Faixa Estrutural 2",
    maxOrizon: "Coparticipacao por pontos ate 50%",
    fit: "Operacoes de cobricao que exigem padrao de calda, temperatura e aplicacao mais estavel.",
    note: "Indicado quando o laudo mostrar perda de padrao no processo de cobricao.",
  },
  {
    title: "Carreta com 4 tanques de 200l",
    stage: "Evoluir",
    specification: "Sistema com dosagem eletronica",
    points: "Faixa Legacy",
    maxOrizon: "Coparticipacao por pontos ate 50%",
    fit: "Conta PRIME/LEGACY com escala, varias frentes e necessidade de padronizacao operacional.",
    note: "Exige comite, plano tecnico e comparativo de ganho operacional.",
  },
  {
    title: "Carreta de calda fresca para aplicacao",
    stage: "Evoluir",
    specification: "Sistema com dosagem eletronica",
    points: "Faixa Legacy Plus",
    maxOrizon: "Coparticipacao por pontos ate 50%",
    fit: "Operacao de maior escala que precisa preparar calda fresca na hora da aplicacao.",
    note: "Priorizar quando houver perda por tempo de calda, logistica ou variacao entre frentes.",
  },
  {
    title: "Carreta de calda fresca sem rodado",
    stage: "Evoluir",
    specification: "Acoplada em cima do caminhao",
    points: "Faixa Legacy",
    maxOrizon: "Coparticipacao por pontos ate 50%",
    fit: "Cliente com caminhao disponivel e necessidade de solucao acoplada, sem sistema de rodado proprio.",
    note: "Alternativa estrutural quando a restricao for configuracao da frota.",
  },
  {
    title: "Jarra personalizada com nivel bolha",
    stage: "Diagnosticar",
    specification: "Material de campo",
    points: "Faixa Campo",
    maxOrizon: "Cobertura por pontos ate 100%",
    fit: "Padronizacao simples de afericao, treinamento e rotina de medicao em campo.",
    note: "Item de baixo valor para reforcar disciplina tecnica e qualidade de medicao.",
  },
  {
    title: "Barra de pulverizacao para colhedora",
    stage: "Evoluir",
    specification: "Sistema de corte da colhedora de cereais",
    points: "Faixa Estrutural 3",
    maxOrizon: "Coparticipacao por pontos ate 50%",
    fit: "Aplicacao para graos ou operacoes com necessidade de pulverizacao integrada ao corte.",
    note: "Nao deve ser liberado sem aderencia ao plano tecnico do cliente.",
  },
];

const tchReportTypes = [
  {
    type: "Laudo de Qualidade de Aplicacao",
    useWhen: "Falhas de deposicao, cobertura, deriva, dose, tecnologia de aplicacao ou uniformidade.",
    output: "Indice de qualidade, nao conformidades, recomendacao de ajuste e prioridade.",
  },
  {
    type: "Laudo de Eficiencia Operacional",
    useWhen: "Baixa eficiencia de janela, retrabalho, variacao entre equipes ou alto custo operacional.",
    output: "Gargalo principal, perda estimada, plano de correcao e meta operacional.",
  },
  {
    type: "Laudo de Sanidade e Manejo Biologico",
    useWhen: "Validacao de AURAS, AUBA, TRITTER ou pacote biologico em area piloto/semi-comercial.",
    output: "Leitura agronomica, resposta de campo, risco tecnico e recomendacao de continuidade.",
  },
  {
    type: "Laudo de Padronizacao Operacional",
    useWhen: "Conta PRIME/LEGACY com varias unidades e necessidade de replicar o mesmo padrao.",
    output: "Checklist por unidade, desvio por frente, protocolo recomendado e governanca.",
  },
  {
    type: "Laudo Executivo ORIZON",
    useWhen: "Comite mensal, fechamento de safra, renovacao ou decisao de expansao.",
    output: "Resumo executivo, evidencias, creditos utilizados, ROI operacional e proximo ciclo.",
  },
];

const tchServiceGroups = [
  {
    category: "Auditorias",
    items: [
      "Auditoria de aplicacao",
      "Auditoria de preparo de calda",
      "Auditoria de janela operacional",
      "Auditoria de aderencia ao protocolo NOOA",
      "Auditoria de resultado em area piloto",
    ],
  },
  {
    category: "Treinamentos",
    items: [
      "Aplicacao e tecnologia de gotas",
      "Manejo biologico",
      "Pragas e doencas",
      "Padronizacao por frente operacional",
      "Leitura de indicadores ORIZON",
    ],
  },
  {
    category: "Recomendacoes",
    items: [
      "Ajuste de dose, janela e sequenciamento",
      "Pacote AURAS/AUBA/TRITTER",
      "Area semi-comercial",
      "Expansao por unidade",
      "Elegibilidade Mais Maquinas",
    ],
  },
];

const structuralCatalog = [
  {
    group: "Sistemas de Aplicacao",
    examples: ["bicos", "controladores", "sensores", "componentes de pulverizacao", "calibracao assistida"],
    eligibility: "Quando laudo TCH apontar perda por qualidade de aplicacao.",
  },
  {
    group: "Implementos Operacionais",
    examples: ["preparo", "sulcacao", "cobertura", "aplicacao localizada", "adequacoes de campo"],
    eligibility: "Quando gargalo operacional limitar resposta do pacote biologico.",
  },
  {
    group: "Mecanizacao e Padronizacao",
    examples: ["ajustes de maquina", "kits operacionais", "padronizacao de frente", "treinamento embarcado"],
    eligibility: "Quando houver ganho replicavel entre unidades.",
  },
  {
    group: "Monitoramento e Medicao",
    examples: ["telemetria", "checklists digitais", "sensores de aplicacao", "painel de indicadores"],
    eligibility: "Quando o cliente estiver em PRIME/LEGACY e precisar governar escala.",
  },
];

const technicalPointsPolicy = {
  name: "Pontos ORIZON de Evolucao Tecnica",
  positioning: "Nao sao cashback, desconto ou rebate. Sao lastro tecnico para coparticipacao em planos aprovados.",
  earnRules: [
    "Compra de produtos elegiveis gera budget tecnico conforme peso ORIZON",
    "Evidencia TCH aumenta prioridade de liberacao",
    "Score PRIME/LEGACY habilita usos estruturais",
    "Produtos B2B nao geram pontos de evolucao",
  ],
  useRules: [
    "Diagnosticos e laudos TCH",
    "Auditorias e treinamentos",
    "Planos de correcao assistida",
    "Coparticipacao Mais Maquinas",
    "Projetos de aplicacao, implementos e medicao",
  ],
};

function safe(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function percent(value, total) {
  if (!total) return 0;
  return Math.max(0, Math.min(100, (value / total) * 100));
}

function formatPoints(value = 0) {
  return `${new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 }).format(Number(value) || 0)} pts`;
}

function formatPotential(value = 0) {
  const numeric = Number(value) || 0;
  if (Math.abs(numeric) >= 1_000_000) return `${formatNumber(numeric / 1_000_000)} mi`;
  if (Math.abs(numeric) >= 1_000) return `${formatNumber(numeric / 1_000)} mil`;
  return formatNumber(numeric);
}

function categoryClass(category = "") {
  return `category-${String(category).toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
}

function selectedOrFirst(data, id) {
  return data.clients.find((client) => client.id === id) ?? data.clients[0];
}

class OrizonCockpitApp extends HTMLElement {
  orizonData = null;
  publicData = null;
  saasData = null;
  saasPublicData = null;
  clientPayload = null;
  partnerPayload = null;
  motionObserver = null;
  scrollHandler = null;
  scrollRaf = 0;
  state = {
    selectedClientId: null,
    search: "",
    level: "TODOS",
    profileId: "visitante",
    selectedEquipmentIndex: 0,
    selectedProgramLayer: null,
    selectedKaizenStage: "K0",
    selectedPartnerId: "tch",
    selectedPartnerActionId: "qualidade",
  };

  connectedCallback() {
    this.renderLoading();
    this.bindEvents();
    void this.loadData();
  }

  disconnectedCallback() {
    this.cleanupMotion();
  }

  bindEvents() {
    this.addEventListener("click", (event) => {
      const element = event.target instanceof Element ? event.target : null;
      const target = element?.closest("[data-action]");
      if (!target) return;

      if (target.dataset.action === "select-client") {
        if (!this.canUseAdminFeatures() || !this.orizonData) return;
        this.state.selectedClientId = target.dataset.clientId ?? this.state.selectedClientId;
        this.render();
        this.querySelector("#client-profile")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }

      if (target.dataset.action === "select-profile") {
        this.state.profileId = target.dataset.profileId ?? "visitante";
        void this.activateProfile();
      }

      if (target.dataset.action === "select-equipment") {
        this.state.selectedEquipmentIndex = Number(target.dataset.index ?? 0);
        this.render();
      }

      if (target.dataset.action === "toggle-program-layer") {
        const layer = target.dataset.layer ?? null;
        this.state.selectedProgramLayer = this.state.selectedProgramLayer === layer ? null : layer;
        this.render();
      }

      if (target.dataset.action === "select-kaizen-stage") {
        this.state.selectedKaizenStage = target.dataset.stage ?? "K0";
        this.render();
      }

      if (target.dataset.action === "select-partner") {
        const partnerId = target.dataset.partnerId ?? "tch";
        const partner = partnerProgramPartners.find((item) => item.id === partnerId) ?? partnerProgramPartners[0];
        this.state.selectedPartnerId = partner.id;
        this.state.selectedPartnerActionId = partner.actions[0]?.id ?? null;
        this.render();
      }

      if (target.dataset.action === "select-partner-action") {
        this.state.selectedPartnerId = target.dataset.partnerId ?? this.state.selectedPartnerId;
        this.state.selectedPartnerActionId = target.dataset.actionId ?? this.state.selectedPartnerActionId;
        this.render();
      }

      if (target.dataset.action === "add-live-item") {
        const client = this.currentClient();
        const list = target.dataset.list;
        const workspace = this.clientWorkspace(client);
        if (list === "history") workspace.history.unshift(this.defaultHistoryItem());
        if (list === "quotes") workspace.quotes.unshift(this.defaultQuoteItem());
        if (list === "tasks") workspace.tasks.unshift(this.defaultTaskItem());
        this.saveClientWorkspace(client.id, workspace);
        this.render();
      }

      if (target.dataset.action === "add-calendar-task") {
        const client = this.currentClient();
        const workspace = this.clientWorkspace(client);
        workspace.tasks.unshift(this.taskFromCadence(target.dataset.cadence));
        this.saveClientWorkspace(client.id, workspace);
        this.render();
      }

      if (target.dataset.action === "remove-live-item") {
        const client = this.currentClient();
        const list = target.dataset.list;
        const index = Number(target.dataset.index ?? -1);
        const workspace = this.clientWorkspace(client);
        if (Array.isArray(workspace[list]) && index >= 0) workspace[list].splice(index, 1);
        this.saveClientWorkspace(client.id, workspace);
        this.render();
      }

      if (target.dataset.action === "cycle-task-status") {
        const client = this.currentClient();
        const index = Number(target.dataset.index ?? -1);
        const workspace = this.clientWorkspace(client);
        const task = workspace.tasks[index];
        if (task) {
          const statuses = ["A fazer", "Em andamento", "Concluido"];
          task.status = statuses[(statuses.indexOf(task.status) + 1) % statuses.length] ?? "A fazer";
          this.saveClientWorkspace(client.id, workspace);
          this.render();
        }
      }
    });

    this.addEventListener("input", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLInputElement)) return;
      if (target.id !== "clientSearch") return;

      this.state.search = target.value;
      this.render();
      const input = this.querySelector("#clientSearch");
      input?.focus();
      input?.setSelectionRange(input.value.length, input.value.length);
    });

    this.addEventListener("input", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement)) return;
      if (!target.dataset.liveField && !target.dataset.liveList) return;
      const client = this.currentClient();
      const workspace = this.clientWorkspace(client);
      if (target.dataset.liveField) {
        workspace[target.dataset.liveField] = target.type === "number" ? Number(target.value) || 0 : target.value;
      }
      if (target.dataset.liveList) {
        const list = target.dataset.liveList;
        const index = Number(target.dataset.index ?? -1);
        const field = target.dataset.field;
        if (Array.isArray(workspace[list]) && workspace[list][index] && field) {
          workspace[list][index][field] = target.type === "number" ? Number(target.value) || 0 : target.value;
        }
      }
      this.saveClientWorkspace(client.id, workspace);
    });

    this.addEventListener("change", (event) => {
      const target = event.target;

      if (target instanceof HTMLSelectElement && target.id === "profileLogin") {
        this.state.profileId = target.value || "visitante";
        void this.activateProfile();
      }

      if (target instanceof HTMLSelectElement && target.dataset.control === "client-select") {
        if (!this.canUseAdminFeatures() || !this.orizonData) return;
        this.state.selectedClientId = target.value || null;
        this.render();
      }

      if (target instanceof HTMLSelectElement && target.id === "levelFilter") {
        if (!this.orizonData) return;
        this.state.level = target.value;
        this.render();
      }

      if ((target instanceof HTMLSelectElement || target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) && (target.dataset.liveField || target.dataset.liveList)) {
        const client = this.currentClient();
        const workspace = this.clientWorkspace(client);
        if (target.dataset.liveField) workspace[target.dataset.liveField] = target.value;
        if (target.dataset.liveList) {
          const list = target.dataset.liveList;
          const index = Number(target.dataset.index ?? -1);
          const field = target.dataset.field;
          if (Array.isArray(workspace[list]) && workspace[list][index] && field) workspace[list][index][field] = target.value;
        }
        this.saveClientWorkspace(client.id, workspace);
        this.render();
      }
    });
  }

  async loadData() {
    try {
      const publicResponse = await fetch("./data/public-summary.json?v=20260527-governance");
      if (!publicResponse.ok) throw new Error("Falha ao carregar resumo publico ORIZON");
      this.publicData = await publicResponse.json();
      const saasPublicResponse = await fetch(SAAS_PUBLIC_URL);
      if (saasPublicResponse.ok) this.saasPublicData = await saasPublicResponse.json();
      await this.activateProfile();
      this.render();
    } catch (error) {
      this.innerHTML = `
        <main class="load-state">
          <img src="./assets/orizon-logo.svg" alt="ORIZON">
          <h1>Nao foi possivel carregar a base ORIZON.</h1>
          <p>${safe(error instanceof Error ? error.message : "Erro desconhecido")}</p>
        </main>
      `;
    }
  }

  currentProfile() {
    return activeAccessProfiles.find((profile) => profile.id === this.state.profileId) ?? activeAccessProfiles[0];
  }

  canUseAdminFeatures() {
    return this.currentProfile().role === "admin";
  }

  canViewRestricted() {
    return ["admin", "client"].includes(this.currentProfile().role);
  }

  async activateProfile() {
    const profile = this.currentProfile();
    if (profile.role === "admin" && !this.orizonData) {
      const response = await fetch(DATA_URL);
      if (!response.ok) throw new Error(`Falha ao carregar ${DATA_URL}`);
      this.orizonData = await response.json();
    }
    if (profile.role === "admin" && !this.saasData) {
      const response = await fetch(SAAS_DATA_URL);
      if (!response.ok) throw new Error(`Falha ao carregar ${SAAS_DATA_URL}`);
      this.saasData = await response.json();
    }
    if (profile.role === "client" && profile.clientId) {
      const response = await fetch(`./data/clients/${profile.clientId}.json?v=20260527-governance`);
      if (!response.ok) throw new Error("Falha ao carregar dados sanitizados do cliente");
      this.clientPayload = await response.json();
    }
    if (profile.role === "partner") {
      const file = profile.partner === "TCH" ? "tch" : "mais-maquinas";
      const response = await fetch(`./data/partners/${file}.json?v=20260527-governance`);
      if (!response.ok) throw new Error("Falha ao carregar payload do parceiro");
      this.partnerPayload = await response.json();
    }
    this.applyProfileDefaults();
    this.render();
  }

  applyProfileDefaults() {
    const profile = this.currentProfile();
    if (profile.role === "client" && profile.clientId) {
      this.state.selectedClientId = profile.clientId;
    }
    if (!this.canUseAdminFeatures()) {
      this.state.search = "";
      this.state.level = "TODOS";
    }
  }

  visibleClients(data) {
    const profile = this.currentProfile();
    if (profile.role === "admin") return data.clients;
    if (profile.role === "client" && profile.clientId) {
      return data.clients.filter((client) => client.id === profile.clientId);
    }
    if (profile.role === "partner" && profile.partner === "TCH") {
      return data.clients.filter((client) => String(client.partner).toLowerCase().includes("tch"));
    }
    if (profile.role === "partner" && profile.partner === "Mais Maquinas") {
      return data.clients.filter((client) => `${client.partner} ${client.businessModel}`.toLowerCase().includes("maquinas"));
    }
    return [];
  }

  currentClient() {
    const profile = this.currentProfile();
    if (profile.role === "admin" && this.orizonData && this.state.selectedClientId) {
      return this.orizonData.clients.find((client) => client.id === this.state.selectedClientId) ?? this.placeholderClient(profile);
    }
    if (profile.role === "client" && this.clientPayload) {
      return this.clientFromPayload(this.clientPayload);
    }
    return this.placeholderClient(profile);
  }

  clientFromPayload(payload) {
    const stage = payload.assistStage ?? {
      current: "Diagnosticar",
      progress: 34,
      steps: [
        { name: "Diagnosticar", status: "current" },
        { name: "Corrigir", status: "next" },
        { name: "Evoluir", status: "next" },
      ],
    };
    return {
      id: payload.id,
      rank: 0,
      name: payload.name,
      level: payload.level ?? "START",
      sourceLevel: payload.level ?? "START",
      score: 0,
      priority: "",
      owner: "",
      areaHa: payload.areaHa ?? 0,
      canaPlanta: 0,
      canaSoca: 0,
      situation: payload.clientReport?.thesis ?? "",
      proposedAction: payload.clientReport?.nextCycle ?? "",
      governanceStatus: payload.approvalStatus ?? "",
      businessModel: "Plano tecnico ORIZON",
      maturityFactor: 0,
      potential: payload.potential ?? "",
      adoptionStage: payload.adoptionStage ?? "",
      technologyEntry: payload.technologyEntry ?? "",
      adoptionDirective: payload.adoptionDirective ?? "",
      partner: payload.partner ?? "TCH + NOOA Tecnica",
      evolutionTrack: payload.evolutionTrack ?? "",
      executiveSpecification: payload.clientReport?.thesis ?? "",
      governance: payload.governance ?? "Plano assistido por marcos",
      scoreBreakdown: { porte: 0, prioridade: 0, adocaoTecnica: 0, conversao: 0, fitOrizon: 0 },
      queue: "Plano externo sanitizado",
      nextDecision: payload.clientReport?.nextCycle ?? "Validar proximo marco tecnico",
      creditRecommended: 0,
      creditControl: { recommended: 0, approvable: 0, approved: 0, pending: 0, blocked: 0 },
      assistStage: stage,
      approval: {
        status: payload.approvalStatus ?? "Plano por fase",
        authority: "",
        rule: "Dados financeiros e criterios internos ficam restritos aos administradores ORIZON.",
      },
      followUp: payload.followUp ?? {
        cadence: "Cadencia assistida",
        trigger: "Proximo marco tecnico",
        nextAction: payload.clientReport?.nextCycle ?? "",
      },
      productVolumes: {},
    };
  }

  placeholderClient(profile) {
    return {
      id: "publico",
      rank: 0,
      name: profile.role === "admin" ? "Overview da carteira" : profile.role === "partner" ? `Visao ${profile.partner}` : "Visao publica ORIZON",
      level: "START",
      sourceLevel: "START",
      score: 0,
      priority: "",
      owner: "",
      areaHa: 0,
      canaPlanta: 0,
      canaSoca: 0,
      situation: "Visao sem dados sensiveis.",
      proposedAction: "Selecionar perfil autorizado para acessar camadas profundas.",
      governanceStatus: "Publico",
      businessModel: "Programa assistido",
      maturityFactor: 0,
      potential: "Conceito ORIZON",
      adoptionStage: "Diagnosticar",
      technologyEntry: "TCH como entrada recomendada",
      adoptionDirective: "Diagnosticar, corrigir e evoluir por evidencia.",
      partner: "TCH + Mais Maquinas",
      evolutionTrack: "TCH valida e corrige; Mais Maquinas estrutura quando houver maturidade.",
      executiveSpecification: "A visao publica explica o programa sem expor carteira, credito, score ou estrategia comercial.",
      governance: "Acesso por perfil",
      scoreBreakdown: { porte: 0, prioridade: 0, adocaoTecnica: 0, conversao: 0, fitOrizon: 0 },
      queue: "Publico",
      nextDecision: "Selecionar uma sessao ou perfil autorizado.",
      creditRecommended: 0,
      creditControl: { recommended: 0, approvable: 0, approved: 0, pending: 0, blocked: 0 },
      assistStage: {
        current: "Diagnosticar",
        progress: 34,
        steps: [
          { name: "Diagnosticar", status: "current" },
          { name: "Corrigir", status: "next" },
          { name: "Evoluir", status: "next" },
        ],
      },
      approval: { status: "Sem dados sensiveis", authority: "", rule: "Acesso restrito por perfil." },
      followUp: { cadence: "Publico", trigger: "Sem dados sensiveis", nextAction: "" },
      productVolumes: {},
    };
  }

  workspaceKey(clientId) {
    return `orizon-live-plan:${clientId || "publico"}`;
  }

  clientWorkspace(client) {
    const defaults = this.defaultClientWorkspace(client);
    try {
      const raw = window.localStorage?.getItem(this.workspaceKey(client.id));
      if (!raw) return defaults;
      const saved = JSON.parse(raw);
      if (!saved.targetSeedVersion) {
        const oldSeed = Math.max(1000, Math.round((Number(client.areaHa) || 0) * 0.18));
        if (Number(saved.targetHa) === oldSeed) saved.targetHa = defaults.targetHa;
        saved.targetSeedVersion = defaults.targetSeedVersion;
      }
      return {
        ...defaults,
        ...saved,
        history: Array.isArray(saved.history) ? saved.history : defaults.history,
        quotes: Array.isArray(saved.quotes) ? saved.quotes : defaults.quotes,
        tasks: Array.isArray(saved.tasks) ? saved.tasks.map((task) => this.normalizeTask(task)) : defaults.tasks,
      };
    } catch {
      return defaults;
    }
  }

  saveClientWorkspace(clientId, workspace) {
    try {
      window.localStorage?.setItem(this.workspaceKey(clientId), JSON.stringify(workspace));
    } catch {
      // Local persistence is optional in the static prototype.
    }
  }

  defaultClientWorkspace(client) {
    const area = Number(client.areaHa) || 0;
    const targetHa = Math.round(area);
    const today = new Date().toISOString().slice(0, 10);
    return {
      targetSeedVersion: 2,
      targetHa,
      mapAreaNote: "Mapear unidades, talhoes prioritarios e area alvo por ciclo de safra.",
      qualityScore: Math.max(35, Math.min(92, Math.round((Number(client.score) || 45) * 0.8))),
      relationshipScore: Math.max(40, Math.min(95, Math.round((Number(client.score) || 50) * 0.9))),
      currentCycle: "Safra 2026",
      historyNote: client.situation || "Historico em construcao no plano ORIZON.",
      partnerScope: "TCH para diagnostico e padronizacao; Mais Maquinas somente quando o plano indicar restricao estrutural.",
      history: [
        {
          date: today,
          title: "Entrada no plano ORIZON",
          type: "Diagnostico",
          note: client.nextDecision || "Validar proximo marco tecnico com responsavel da conta.",
        },
        {
          date: "2026-06-15",
          title: "Leitura tecnica inicial",
          type: "Campo",
          note: "Consolidar areas alvo, frente operacional, parceiro indicado e evidencia necessaria.",
        },
      ],
      quotes: [
        {
          date: today,
          code: "COT-ORIZON-001",
          scope: "Diagnostico tecnico operacional",
          status: "Em construcao",
          nextAction: "Validar hectares alvo e unidade responsavel.",
        },
        {
          date: "2026-07-01",
          code: "COT-ORIZON-002",
          scope: "Plano de correcao assistida",
          status: "Prevista",
          nextAction: "Liberar apos laudo e prioridade operacional.",
        },
      ],
      tasks: this.defaultTasks(client),
    };
  }

  defaultHistoryItem() {
    return {
      date: new Date().toISOString().slice(0, 10),
      title: "Novo registro",
      type: "Relacionamento",
      note: "Registrar conversa, decisao, objecao, evidencia ou aprendizagem do cliente.",
    };
  }

  defaultQuoteItem() {
    return {
      date: new Date().toISOString().slice(0, 10),
      code: "COT-NOVA",
      scope: "Escopo da cotacao",
      status: "Em construcao",
      nextAction: "Definir proximo movimento comercial e tecnico.",
    };
  }

  defaultTaskItem() {
    const cadence = "Mensal";
    return this.taskFromCadence(cadence);
  }

  normalizeTask(task = {}) {
    return {
      date: task.date || this.dateAfter(14),
      cadence: task.cadence || "Mensal",
      stage: task.stage || "Governanca",
      objective: task.objective || this.objectiveFromCadence(task.cadence),
      timing: task.timing || "Proxima janela",
      action: task.action || "Atualizar follow-up do cliente",
      owner: task.owner || "Responsavel da conta",
      status: task.status || "A fazer",
    };
  }

  taskFromCadence(cadence = "Mensal") {
    const option = followUpCadenceOptions.find((item) => item.value === cadence) ?? followUpCadenceOptions[2];
    const daysByCadence = {
      Semanal: 7,
      Quinzenal: 14,
      Mensal: 30,
      Bimestral: 60,
      Trimestral: 90,
      "Inicio de safra": 120,
      "Fim de safra": 210,
    };
    const stageByCadence = {
      Semanal: "Corrigir",
      Quinzenal: "Diagnosticar",
      Mensal: "Governanca",
      Bimestral: "Corrigir",
      Trimestral: "Evoluir",
      "Inicio de safra": "Safra",
      "Fim de safra": "Safra",
    };
    return {
      date: this.dateAfter(daysByCadence[option.value] ?? 30),
      cadence: option.value,
      stage: stageByCadence[option.value] ?? "Governanca",
      objective: this.objectiveFromCadence(option.value),
      timing: option.moment,
      action: option.objective,
      owner: "Responsavel da conta",
      status: "A fazer",
    };
  }

  dateAfter(days) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().slice(0, 10);
  }

  objectiveFromCadence(cadence = "Mensal") {
    const found = followUpCadenceOptions.find((item) => item.value === cadence);
    if (!found) return "Relacionamento";
    if (found.value.includes("safra")) return "Safra";
    if (found.value === "Trimestral") return "Evolution Report";
    if (found.value === "Mensal") return "Comite";
    return "Correcao operacional";
  }

  defaultTasks(client) {
    return [
      {
        cadence: "Quinzenal",
        date: "2026-06-15",
        stage: "Diagnosticar",
        objective: "Diagnostico",
        timing: "Durante diagnostico e correcao",
        action: "Revisar pendencias, evidencias de campo, cotacoes abertas e proxima visita.",
        owner: client.owner || "Comercial/DTM",
        status: "A fazer",
      },
      {
        cadence: "Mensal",
        date: "2026-07-01",
        stage: "Governanca",
        objective: "Comite",
        timing: "Comite operacional",
        action: "Consolidar score, hectares mapeados, riscos, parceiro acionado e decisao pendente.",
        owner: "NOOA ORIZON",
        status: "A fazer",
      },
      {
        cadence: "Bimestral",
        date: "2026-08-01",
        stage: "Corrigir",
        objective: "Correcao operacional",
        timing: "Apos ciclo de execucao",
        action: "Reavaliar qualidade operacional, relacionamento, aderencia ao plano e necessidade de treinamento.",
        owner: "NOOA + cliente",
        status: "A fazer",
      },
      {
        cadence: "Trimestral",
        date: "2026-09-01",
        stage: "Evoluir",
        objective: "Evolution Report",
        timing: "Revisao executiva",
        action: "Atualizar Evolution Report, oportunidades de expansao e governanca de pontos.",
        owner: "Diretoria/gestao",
        status: "A fazer",
      },
      {
        cadence: "Inicio de safra",
        date: "2026-10-01",
        stage: "Safra",
        objective: "Safra",
        timing: "Planejamento agricola",
        action: "Definir unidades, hectares alvo, janelas criticas, produtos e parceiro tecnico.",
        owner: "Cliente + NOOA",
        status: "A fazer",
      },
      {
        cadence: "Fim de safra",
        date: "2027-03-30",
        stage: "Safra",
        objective: "Safra",
        timing: "Fechamento e benchmark",
        action: "Medir resultado, validar ganhos, registrar aprendizados e preparar proximo ciclo.",
        owner: "Comite ORIZON",
        status: "A fazer",
      },
    ];
  }

  quoteStatusSummary(quotes) {
    const labels = ["Prevista", "Em construcao", "Enviada", "Aprovada"];
    return labels.map((label) => ({
      label,
      count: quotes.filter((quote) => quote.status === label).length,
    }));
  }

  renderLoading() {
    this.innerHTML = `
      <main class="load-state">
        <img src="./assets/orizon-logo.svg" alt="ORIZON">
        <h1>Carregando cockpit ORIZON</h1>
        <p>Carregando carteira, score, credito, pipeline e planos cliente a cliente.</p>
      </main>
    `;
  }

  render() {
    if (!this.publicData) {
      this.renderLoading();
      return;
    }

    const profile = this.currentProfile();
    const isAdmin = this.canUseAdminFeatures();
    const canViewRestricted = this.canViewRestricted();
    const data = this.orizonData;
    const saasDataset = this.saasData ?? this.saasPublicData;
    const selectedClient = this.currentClient();
    const portfolio = data ? OrizonAgents.biScore.portfolio(data) : null;
    const hasSelectedClient = Boolean(isAdmin && this.state.selectedClientId);
    const focusedClientMode = (isAdmin && hasSelectedClient) || profile.role === "client";
    const filteredClients = isAdmin
      ? OrizonAgents.crm.filterClients(data, this.state.search, this.state.level)
      : [];
    const creditTotals = data ? OrizonAgents.credit.totals(data) : null;
    const sourceDate = new Date((data ?? this.publicData).generatedAt).toLocaleDateString("pt-BR");
    const availableNav = navItems.filter((item) => {
      if (focusedClientMode) return ["client-profile", "live-plan", "gis", "report"].includes(item.href);
      if (item.scope === "public") return true;
      if (item.scope === "restricted") return canViewRestricted && (!isAdmin || hasSelectedClient);
      if (item.scope === "admin") return isAdmin && (item.href === "admin-overview" || hasSelectedClient);
      return false;
    });

    this.innerHTML = `
      <div class="app-shell">
        ${this.renderAreaDock(availableNav, profile)}

        <div class="workspace">
          ${this.renderTopBar(profile, isAdmin, selectedClient, data)}

          <main class="dashboard">
            ${focusedClientMode ? `
              ${this.renderClientProfile(selectedClient, isAdmin)}
              ${this.renderLivePlan(selectedClient, isAdmin)}
              ${data ? this.renderGis(data, selectedClient, true) : ""}
              ${this.renderReport(data, selectedClient, isAdmin)}
            ` : `
              ${this.renderProgramVision()}
              ${saasDataset ? this.renderSaasOperatingSystem(saasDataset, isAdmin) : ""}
              ${isAdmin && data && portfolio ? this.renderAdminOverview(data, portfolio, hasSelectedClient) : ""}
              ${canViewRestricted && (!isAdmin || hasSelectedClient) ? this.renderClientProfile(selectedClient, isAdmin) : ""}
              ${canViewRestricted && (!isAdmin || hasSelectedClient) ? this.renderLivePlan(selectedClient, isAdmin) : ""}
              ${this.renderPartners(selectedClient, profile)}
              ${isAdmin && data && portfolio && hasSelectedClient ? this.renderCockpit(data, portfolio) : ""}
              ${isAdmin && data && hasSelectedClient ? this.renderPortfolio(filteredClients) : ""}
              ${isAdmin && data && creditTotals && hasSelectedClient ? this.renderCredit(data, creditTotals, selectedClient) : ""}
              ${isAdmin && data && hasSelectedClient ? this.renderGis(data, selectedClient) : ""}
              ${canViewRestricted ? this.renderReport(data, selectedClient, isAdmin) : ""}
              ${isAdmin && hasSelectedClient ? this.renderAutomation() : ""}
            `}
          </main>
        </div>
      </div>
    `;
    queueMicrotask(() => this.initMotion());
  }

  cleanupMotion() {
    this.motionObserver?.disconnect();
    this.motionObserver = null;
    if (this.scrollHandler) {
      window.removeEventListener("scroll", this.scrollHandler);
      this.scrollHandler = null;
    }
    if (this.scrollRaf) {
      window.cancelAnimationFrame(this.scrollRaf);
      this.scrollRaf = 0;
    }
  }

  initMotion() {
    this.cleanupMotion();
    const motionTargets = this.querySelectorAll(".reveal-on-scroll");
    if ("IntersectionObserver" in window) {
      this.motionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("is-visible");
        });
      }, { rootMargin: "0px 0px -12% 0px", threshold: 0.18 });
      motionTargets.forEach((target) => this.motionObserver.observe(target));
    } else {
      motionTargets.forEach((target) => target.classList.add("is-visible"));
    }

    const updateProgress = () => {
      this.scrollRaf = 0;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      this.style.setProperty("--scroll-progress", String(Math.min(1, window.scrollY / maxScroll)));
    };
    this.scrollHandler = () => {
      if (!this.scrollRaf) this.scrollRaf = window.requestAnimationFrame(updateProgress);
    };
    window.addEventListener("scroll", this.scrollHandler, { passive: true });
    updateProgress();
  }

  renderAreaDock(availableNav, profile) {
    return `
      <aside class="area-dock" aria-label="Areas principais ORIZON">
        <details>
          <summary>
            <span>Areas</span>
            <strong>ORIZON OS</strong>
          </summary>
          <nav class="module-nav" aria-label="Modulos ORIZON">
            ${availableNav.map((item) => `<a href="#${item.href}">${safe(item.label)}</a>`).join("")}
          </nav>
          <div class="dock-status">
            <span>${profile.role === "public" ? "Sem login" : "Sessao ativa"}</span>
            <strong>${safe(profile.label)}</strong>
          </div>
        </details>
      </aside>
    `;
  }

  renderTopBar(profile, isAdmin, selectedClient, data) {
    const loggedLabel = profile.role === "public" ? "Entrar" : profile.label;
    return `
      <header class="command-bar">
        <a class="brand-lockup" href="#program" aria-label="ORIZON">
          <img src="./assets/orizon-logo.svg" alt="ORIZON">
        </a>
        <div class="topbar-title">
          <span>ORIZON OS</span>
          <strong>${isAdmin ? "Cockpit executivo de evolucao operacional agricola" : "Plataforma de evolucao operacional agricola"}</strong>
        </div>
        <div class="login-zone" aria-label="Sessao de login">
          ${
            IS_PUBLIC_DEPLOY
              ? `<div class="login-select is-public"><span>Acesso institucional</span><strong>Publico</strong></div>`
              : `<label class="login-select">
                  <span>${safe(loggedLabel)}</span>
                  <select id="profileLogin" aria-label="Login ORIZON">
                    ${activeAccessProfiles.map((item) => `<option value="${safe(item.id)}" ${item.id === profile.id ? "selected" : ""}>${safe(item.label)}</option>`).join("")}
                  </select>
                </label>`
          }
        </div>
      </header>
    `;
  }

  renderProgramVision() {
    const program = this.publicData?.program;
    return `
      <section id="program" class="panel-section public-hero clean-hero">
        <video
          class="hero-video"
          src="./assets/nooa-institucional-loop.mp4"
          poster="./assets/nooa-institucional-poster.jpeg"
          autoplay
          muted
          loop
          playsinline
          preload="metadata"
          aria-hidden="true"
        ></video>
        <div class="hero-scrim"></div>
        <div class="public-copy hero-content">
          <span>ORIZON | evolucao operacional assistida</span>
          <h1>Voce sabe onde esta, o que corrigir e como evoluir.</h1>
          <p>${safe(program?.positioning ?? "Um programa assistido para diagnosticar gargalos, corrigir operacoes e evoluir a maturidade operacional com evidencia.")}</p>
          <div class="hero-actions">
            <a href="#saas-os">Entender o programa</a>
            <a href="#partners">Ver parceiros</a>
          </div>
        </div>
        <div class="hero-proof">
          ${(program?.stages ?? []).map((stage) => `
            <article>
              <span>${safe(stage.name)}</span>
              <p>${safe(stage.description)}</p>
            </article>
          `).join("")}
        </div>
      </section>
    `;
  }

  renderInstitutionalMotion() {
    return `
      <section id="institutional" class="panel-section institutional-cinema reveal-on-scroll">
        <video
          class="cinema-video"
          src="./assets/nooa-institucional-loop.mp4"
          poster="./assets/nooa-institucional-poster.jpeg"
          autoplay
          muted
          loop
          playsinline
          preload="metadata"
          aria-hidden="true"
        ></video>
        <div class="cinema-scrim"></div>
        <div class="cinema-content">
          <div class="cinema-copy">
            <span>Institucional NOOA | base tecnologica</span>
            <h2>O ORIZON nasce da ciencia aplicada ao campo e evolui como sistema operacional assistido.</h2>
            <p>O institucional reforca a origem biologica, a independencia tecnica e o relacionamento assistido como fundamentos para transformar diagnostico em evolucao operacional.</p>
          </div>
          <div class="cinema-signal-rail" aria-label="Sinais institucionais NOOA">
            ${institutionalSignals.map(([value, label]) => `
              <article>
                <strong>${safe(value)}</strong>
                <span>${safe(label)}</span>
              </article>
            `).join("")}
          </div>
        </div>
      </section>

      <section class="panel-section institutional-story" aria-label="Leitura institucional aplicada ao ORIZON">
        ${institutionalChapters.map((chapter, index) => `
          <article class="story-chapter reveal-on-scroll" style="--chapter-index: ${index}">
            <span>${safe(chapter.kicker)}</span>
            <h3>${safe(chapter.title)}</h3>
            <p>${safe(chapter.body)}</p>
          </article>
        `).join("")}
      </section>
    `;
  }

  renderSaasOperatingSystem(dataset, isAdmin) {
    const executive = dataset.executive;
    const selectedLayer = programLevelLayers.find((layer) => layer.level === this.state.selectedProgramLayer);
    const kaizenStages = dataset.kaizenJourney ?? [];
    const selectedKaizenStage = this.state.selectedKaizenStage || "K0";
    const selectedKaizen = kaizenStages.find((stage) => stage.stage === selectedKaizenStage) ?? kaizenStages[0];
    const selectedKaizenMove = kaizenStageMoves[selectedKaizen?.stage] ?? kaizenStageMoves.K0;
    const topClients = executive.topClients ?? dataset.clients?.slice(0, 6) ?? [];
    const maxPotential = Math.max(...topClients.map((client) => client.potentialEcosystem ?? 0), 1);

    return `
      <section id="saas-os" class="panel-section saas-os clean-saas">
        <div class="section-title">
          <div>
            <span>Arquitetura do programa</span>
            <h2>Potencial, evidencia e evolucao em uma trilha operacional clara.</h2>
          </div>
          <p>ORIZON separa categoria estrategica, maturidade Kaizen e uso de pontos para decidir o melhor proximo movimento sem forcar investimento estrutural.</p>
        </div>

        <div class="reader-map quiet-map kaizen-principles">
          <article>
            <span>OPI</span>
            <strong>Potencial</strong>
            <p>Mostra o tamanho da oportunidade e ajuda a priorizar energia tecnica e comercial.</p>
          </article>
          <article>
            <span>K0-K5</span>
            <strong>Evidencia</strong>
            <p>Mostra em que ponto a operacao esta: sem diagnostico, com plano, em execucao ou com resultado validado.</p>
          </article>
          <article>
            <span>Pontos</span>
            <strong>Evolucao</strong>
            <p>Direcionam trabalho tecnico, parceiros e projetos liberados por marco validado.</p>
          </article>
        </div>

        <div class="clean-saas-grid">
          <article class="saas-panel maturity-card">
            <div class="card-head">
              <span>Camadas do programa</span>
              <strong>Clique para abrir</strong>
            </div>
            <div class="public-layer-grid" aria-label="Camadas de maturidade ORIZON">
              ${programLevelLayers.map((layer) => `
                <button
                  class="program-layer-card ${levelClass(layer.level)}-edge ${this.state.selectedProgramLayer === layer.level ? "active" : ""}"
                  type="button"
                  data-action="toggle-program-layer"
                  data-layer="${safe(layer.level)}"
                  aria-expanded="${this.state.selectedProgramLayer === layer.level ? "true" : "false"}"
                >
                  <strong>${safe(layer.level)}</strong>
                </button>
              `).join("")}
            </div>
            ${selectedLayer ? `
              <article class="program-layer-detail ${levelClass(selectedLayer.level)}-edge">
                <div class="layer-card-head">
                  <span class="tier-pill ${levelClass(selectedLayer.level)}">${safe(selectedLayer.level)}</span>
                  <small>${safe(selectedLayer.stage)}</small>
                </div>
                <h3>${safe(selectedLayer.possibility)}</h3>
                <ul>
                  ${selectedLayer.characteristics.map((item) => `<li>${safe(item)}</li>`).join("")}
                </ul>
                <p>${safe(selectedLayer.unlock)}</p>
              </article>
            ` : `<p>Escolha uma camada para entender o que ela libera e quando faz sentido avancar.</p>`}
          </article>

          <article class="saas-panel kaizen-panel kaizen-decision">
            <div class="card-head">
              <span>Sistema Kaizen</span>
              <strong>Selecione o estagio operacional</strong>
            </div>
            <div class="kaizen-choice-grid" aria-label="Estagios Kaizen ORIZON">
              ${kaizenStages.map((stage) => `
                <button
                  class="kaizen-choice ${stage.stage === selectedKaizen?.stage ? "active" : ""}"
                  type="button"
                  data-action="select-kaizen-stage"
                  data-stage="${safe(stage.stage)}"
                >
                  <strong>${safe(stage.stage)}</strong>
                  <span>${safe(kaizenStageMoves[stage.stage]?.title ?? stage.name)}</span>
                </button>
              `).join("")}
            </div>
            <div class="kaizen-detail">
              <span>${safe(selectedKaizen?.stage ?? "K0")} | ${safe(selectedKaizenMove.title)}</span>
              <h3>${safe(selectedKaizenMove.movement)}</h3>
              <p>${safe(selectedKaizenMove.fit)}</p>
              <div class="kaizen-proof-grid">
                <article>
                  <small>Parceiro indicado</small>
                  <strong>${safe(selectedKaizenMove.partner)}</strong>
                </article>
                <article>
                  <small>Entrega esperada</small>
                  <strong>${safe(selectedKaizenMove.output)}</strong>
                </article>
                <article>
                  <small>Responsavel</small>
                  <strong>${safe(selectedKaizen?.owner ?? "NOOA")}</strong>
                </article>
              </div>
            </div>
          </article>
        </div>

        ${isAdmin && topClients.length ? `
          <div class="admin-focus-panel">
            <div class="card-head">
              <span>Visao administradora</span>
              <strong>Top potencial da base V2</strong>
            </div>
            ${topClients.slice(0, 5).map((client) => `
              <div class="saas-client-rank">
                <div>
                  <strong>${safe(client.name)}</strong>
                  <small>${safe(client.orizonCategory)} | OPI ${formatNumber(client.opi)} | ${safe(client.kaizenStage)}</small>
                </div>
                <i><b style="width: ${percent(client.potentialEcosystem, maxPotential)}%"></b></i>
                <span>${formatPotential(client.potentialEcosystem)}</span>
              </div>
            `).join("")}
          </div>
        ` : ""}
      </section>
    `;
  }

  renderAdminOverview(data, portfolio, hasSelectedClient) {
    const clients = data.clients;
    const totalArea = clients.reduce((sum, client) => sum + client.areaHa, 0);
    const totalBudget = clients.reduce((sum, client) => sum + client.creditRecommended, 0);
    const approved = clients.filter((client) => client.creditControl?.approved > 0).length;
    const pending = clients.filter((client) => client.creditControl?.pending > 0).length;
    const levels = [...levelOrder].reverse().map((level) => ({
      level,
      count: clients.filter((client) => client.level === level).length,
    }));
    const selectedClient = this.state.selectedClientId
      ? clients.find((client) => client.id === this.state.selectedClientId)
      : null;

    return `
      <section id="admin-overview" class="panel-section admin-overview">
        <div class="section-title">
          <div>
            <span>Overview administrador</span>
            <h2>${hasSelectedClient ? "Usina selecionada: camadas profundas liberadas." : "Visao agregada da carteira antes da selecao."}</h2>
          </div>
          <p>${hasSelectedClient ? "Os modulos abaixo passam a exibir dados completos do cliente escolhido." : "Rodolfo e Marcia enxergam primeiro apenas numeros consolidados. Dados sensiveis aparecem somente apos selecionar uma usina no topo."}</p>
        </div>
        <div class="overview-metrics">
          <article>
            <span>Usinas mapeadas</span>
            <strong>${formatNumber(clients.length)}</strong>
            <p>Carteira completa carregada para administradores.</p>
          </article>
          <article>
            <span>Area potencial</span>
            <strong>${formatHa(totalArea)}</strong>
            <p>Base estimada da evolucao operacional.</p>
          </article>
          <article>
            <span>PRIME + LEGACY</span>
            <strong>${formatNumber(data.executive.primePlusClients)}</strong>
            <p>Contas com maior maturidade para escala.</p>
          </article>
          <article>
            <span>Budget tecnico</span>
            <strong>${formatCompactCurrency(totalBudget)}</strong>
            <p>Pontos consolidados, sem abertura por cliente.</p>
          </article>
        </div>
        <div class="overview-board">
          <article>
            <span>Distribuicao por nivel</span>
            ${levels.map((item) => `
              <div class="overview-level-row">
                <span class="tier-pill ${levelClass(item.level)}">${safe(item.level)}</span>
                <i class="overview-level-meter"><b style="width: ${percent(item.count, clients.length)}%"></b></i>
                <strong>${formatNumber(item.count)}</strong>
                <small>${formatNumber(percent(item.count, clients.length))}%</small>
              </div>
            `).join("")}
          </article>
          <article>
            <span>Governanca consolidada</span>
            <div class="governance-number">
              <strong>${formatNumber(approved)}</strong>
              <p>clientes com algum valor aprovado</p>
            </div>
            <div class="governance-number">
              <strong>${formatNumber(pending)}</strong>
              <p>clientes com etapa pendente</p>
            </div>
          </article>
          <article class="selection-callout">
            <span>Proximo passo</span>
            <h3>${selectedClient ? safe(selectedClient.name) : "Selecione a usina para abrir as camadas."}</h3>
            <p>${selectedClient ? "Camadas profundas liberadas para o cliente selecionado." : "O overview permanece consolidado ate uma usina ser escolhida."}</p>
            <label class="client-switcher inline-client-switcher">
              <span>Usina em analise</span>
              <select id="overviewClientSelect" data-control="client-select" aria-label="Selecionar usina para analise">
                <option value="" ${!this.state.selectedClientId ? "selected" : ""}>Overview da carteira</option>
                ${clients.map((client) => `
                  <option value="${safe(client.id)}" ${client.id === this.state.selectedClientId ? "selected" : ""}>
                    ${safe(client.name)}
                  </option>
                `).join("")}
              </select>
            </label>
          </article>
        </div>
      </section>
    `;
  }

  renderCockpit(data, portfolio) {
    const levels = [...portfolio.levels].reverse();
    const maxLevel = Math.max(...levels.map((item) => item.clients), 1);
    const maxPipeline = Math.max(...data.pipeline.map((item) => item.potential), 1);
    const alerts = OrizonAgents.followUp.alerts(data);

    return `
      <section id="cockpit" class="panel-section cockpit">
        <div class="section-title">
          <span>Cockpit executivo</span>
          <h1>Carteira ORIZON em operacao assistida.</h1>
          <p>Visao viva da base Excel: score, potencial, credito tecnico, prioridade e cadencia assistida cliente a cliente.</p>
        </div>

        <div class="kpi-grid">
          ${portfolio.kpis.map(([label, value, detail]) => `
            <article class="kpi-card">
              <span>${safe(label)}</span>
              <strong>${safe(value)}</strong>
              <p>${safe(detail)}</p>
            </article>
          `).join("")}
        </div>

        <div class="cockpit-grid">
          <article class="panel-card levels-card">
            <div class="card-head">
              <span>Distribuicao por nivel</span>
              <strong>LEGACY / PRIME / FLOW / START</strong>
            </div>
            ${levels.map((item) => `
              <div class="level-row">
                <span class="tier-pill ${levelClass(item.level)}">${item.level}</span>
                <div class="level-meter"><i style="width: ${percent(item.clients, maxLevel)}%"></i></div>
                <strong>${item.clients}</strong>
                <small>${formatNumber(percent(item.clients, data.clients.length))}%</small>
              </div>
            `).join("")}
          </article>

          <article class="panel-card pipeline-card">
            <div class="card-head">
              <span>Pipeline mensal</span>
              <strong>${formatCompactCurrency(data.executive.pipelinePotential)}</strong>
            </div>
            <div class="pipeline-bars">
              ${data.pipeline.map((item) => `
                <div class="pipeline-month">
                  <i style="height: ${percent(item.potential, maxPipeline)}%"></i>
                  <span>${safe(String(item.month).slice(0, 3))}</span>
                </div>
              `).join("")}
            </div>
          </article>

          <article class="panel-card alerts-card">
            <div class="card-head">
              <span>Follow-up assistido</span>
              <strong>Contas criticas</strong>
            </div>
            ${alerts.map((alert) => `
              <div class="alert-item">
                <strong>${safe(alert.client)}</strong>
                <p>${safe(alert.cadence)}</p>
                <span>${safe(alert.trigger)}</span>
              </div>
            `).join("")}
          </article>
        </div>
      </section>
    `;
  }

  renderPortfolio(clients) {
    return `
      <section id="portfolio" class="panel-section">
        <div class="section-title compact">
          <span>Carteira 2026</span>
          <h2>Todos os 45 clientes em plano de negocio cliente a cliente.</h2>
          <p>Filtro operacional por nivel, responsavel, modelo de negocio e proxima decisao.</p>
        </div>

        <div class="portfolio-toolbar">
          <label>
            <span>Buscar cliente</span>
            <input id="clientSearch" type="search" value="${safe(this.state.search)}" placeholder="Grupo, usina, responsavel ou modelo">
          </label>
          <label>
            <span>Nivel</span>
            <select id="levelFilter">
              ${["TODOS", ...levelOrder].map((level) => `<option value="${level}" ${this.state.level === level ? "selected" : ""}>${level}</option>`).join("")}
            </select>
          </label>
          <strong>${clients.length} clientes filtrados</strong>
        </div>

        <div class="client-table" role="table" aria-label="Carteira ORIZON">
          <div class="table-head" role="row">
            <span>Cliente</span>
            <span>Nivel</span>
            <span>Score</span>
            <span>Area</span>
            <span>Credito</span>
            <span>Proxima decisao</span>
          </div>
          ${clients.map((client) => `
            <button class="client-row" type="button" data-action="select-client" data-client-id="${safe(client.id)}" role="row">
              <span>
                <strong>${safe(client.name)}</strong>
                <small>${safe(client.owner)} | ${safe(client.businessModel)}</small>
              </span>
              <span class="tier-pill ${levelClass(client.level)}">${safe(client.level)}</span>
              <span>
                <strong>${formatNumber(client.score)}</strong>
                <i class="mini-score"><b style="width: ${client.score}%"></b></i>
              </span>
              <span>${formatHa(client.areaHa)}</span>
              <span>${formatCompactCurrency(client.creditRecommended)}</span>
              <span>${safe(client.nextDecision)}</span>
            </button>
          `).join("")}
        </div>
      </section>
    `;
  }

  renderClientProfile(client, isAdmin = false) {
    const stage = OrizonAgents.technical.stageSummary(client);
    const route = OrizonAgents.approval.route(client);
    const path = OrizonAgents.maestro.composeClientPath(client);
    const report = OrizonAgents.report.client(client);

    return `
      <section id="client-profile" class="panel-section client-profile">
        <div class="profile-hero">
          <div>
            <span>Cliente vivo</span>
            <h2>${safe(client.name)}</h2>
            <p>${safe(client.executiveSpecification || client.situation)}</p>
          </div>
          <div class="score-gauge" style="--score: ${client.score * 3.6}deg">
            <span>ORIZON Score</span>
            <strong>${formatNumber(client.score)}</strong>
            <small>${safe(client.level)}</small>
          </div>
        </div>

        <div class="profile-grid">
          <article class="panel-card profile-summary">
            <div class="card-head">
              <span>Plano de conta</span>
              <strong>${safe(client.businessModel)}</strong>
            </div>
            <dl>
              ${isAdmin ? `<div><dt>Responsavel</dt><dd>${safe(client.owner)}</dd></div>` : ""}
              <div><dt>Area</dt><dd>${formatHa(client.areaHa)}</dd></div>
              <div><dt>Parceiro indicado</dt><dd>${safe(client.partner)}</dd></div>
              <div><dt>Governanca</dt><dd>${safe(client.governance)}</dd></div>
            </dl>
          </article>

          <article class="panel-card stage-card">
            <div class="card-head">
              <span>Etapa assistida atual</span>
              <strong>${safe(stage.title)}</strong>
            </div>
            <div class="stage-progress"><i style="width: ${stage.progress}%"></i></div>
            <div class="stage-steps">
              ${client.assistStage.steps.map((step) => `<span class="${step.status}">${safe(step.name)}</span>`).join("")}
            </div>
            <p>${safe(stage.headline)}</p>
          </article>

          <article class="panel-card next-action-card">
            <div class="card-head">
              <span>Proxima decisao</span>
              <strong>${safe(client.queue)}</strong>
            </div>
            <p>${safe(client.nextDecision)}</p>
            <strong class="recommendation">${safe(OrizonAgents.maestro.recommendation(client))}</strong>
          </article>
        </div>

        <div class="path-board">
          ${path.map((step) => `
            <div class="path-step ${step.status}">
              <span>${safe(step.label)}</span>
              <strong>${safe(step.agent)}</strong>
            </div>
          `).join("")}
        </div>

        <div class="profile-grid lower">
          <article class="panel-card">
            <div class="card-head">
              <span>${isAdmin ? "Credito e assinatura" : "Apoio tecnico e assinatura"}</span>
              <strong>${safe(route.status)}</strong>
            </div>
            ${isAdmin ? this.renderCreditBars(client.creditControl) : `<p>O apoio ORIZON e liberado por fase, apos diagnostico tecnico, plano aprovado e evidencias de execucao.</p>`}
            <p>${safe(isAdmin ? route.rule : "Pontos internos, ranking e politica de credito ficam restritos aos administradores ORIZON.")}</p>
          </article>

          ${isAdmin ? `<article class="panel-card">
            <div class="card-head">
              <span>Score por camada</span>
              <strong>Modelo Pontuacao</strong>
            </div>
            ${Object.entries(client.scoreBreakdown).map(([label, value]) => `
              <div class="score-line">
                <span>${safe(label)}</span>
                <i><b style="width: ${percent(Number(value), 25)}%"></b></i>
                <strong>${formatNumber(Number(value))}</strong>
              </div>
            `).join("")}
          </article>` : `<article class="panel-card">
            <div class="card-head">
              <span>Progresso operacional</span>
              <strong>${safe(client.assistStage.current)}</strong>
            </div>
            <p>Seu relatorio externo prioriza evidencias, proximos marcos e ganhos operacionais, sem comparacao com outras contas.</p>
          </article>`}

          <article class="panel-card">
            <div class="card-head">
              <span>Evolution Report</span>
              <strong>${safe(report.title)}</strong>
            </div>
            <p>${safe(report.thesis)}</p>
            <strong class="recommendation">${safe(report.nextCycle)}</strong>
          </article>
        </div>
      </section>
    `;
  }

  renderLivePlan(client, isAdmin = false) {
    const workspace = this.clientWorkspace(client);
    const canEdit = isAdmin;
    const disabled = canEdit ? "" : "disabled";
    const readonly = canEdit ? "" : "readonly";
    const area = Number(client.areaHa) || 0;
    const targetPct = percent(Number(workspace.targetHa) || 0, area || Number(workspace.targetHa) || 1);
    const quality = Number(workspace.qualityScore) || 0;
    const relationship = Number(workspace.relationshipScore) || 0;
    const quoteSummary = this.quoteStatusSummary(workspace.quotes);
    const maxQuote = Math.max(...quoteSummary.map((item) => item.count), 1);
    const doneTasks = workspace.tasks.filter((task) => task.status === "Concluido").length;
    const activeTasks = workspace.tasks.filter((task) => task.status === "Em andamento").length;
    const pendingTasks = Math.max(0, workspace.tasks.length - doneTasks - activeTasks);
    const cadenceSummary = followUpCadenceOptions.map((cadence) => ({
      ...cadence,
      count: workspace.tasks.filter((task) => task.cadence === cadence.value).length,
    }));
    const partnerModels = [
      {
        partner: "TCH",
        moment: "Diagnostico e correcao",
        model: "Laudo, afericao, treinamento, reafericao e Evolution Report tecnico.",
        duties: "Enviar agenda, liberar acesso a area, acompanhar equipe, anexar evidencias e fechar plano de correcao.",
      },
      {
        partner: "Mais Maquinas",
        moment: "Estrutura por evidencia",
        model: "Selecionar implemento, validar encaixe operacional, estimar ganho e submeter comite.",
        duties: "Usar somente quando o gargalo for equipamento, frota, preparo, aplicacao ou padronizacao fisica.",
      },
      {
        partner: "NOOA",
        moment: "Governanca ORIZON",
        model: "Conduzir score, cronograma, cotacoes, pontos, aprovacoes e relatorio executivo.",
        duties: "Manter plano vivo atualizado, registrar interacoes e alinhar proximo marco com cliente e parceiro.",
      },
    ];

    return `
      <section id="live-plan" class="panel-section live-plan-section">
        <div class="section-title">
          <div>
            <span>Plano vivo da usina</span>
            <h2>Hectares, historico, cotacoes e follow-up em uma rotina editavel.</h2>
          </div>
          <p>O plano acompanha mudancas de area, novas unidades, qualidade do relacionamento, evolucao das cotacoes e tarefas por ciclo de safra.</p>
        </div>

        <div class="live-plan-grid">
          <article class="live-panel live-target-panel">
            <div class="card-head">
              <span>Target agricola</span>
              <strong>${formatHa(Number(workspace.targetHa) || 0)}</strong>
            </div>
            <div class="target-chart">
              <i><b style="width: ${targetPct}%"></b></i>
              <div>
                <span>Area base</span>
                <strong>${formatHa(area)}</strong>
              </div>
              <div>
                <span>Target mapeado</span>
                <strong>${formatNumber(targetPct)}%</strong>
              </div>
            </div>
            <label>
              <span>Target de hectares a mapear</span>
              <input ${readonly} data-live-field="targetHa" type="number" min="0" value="${safe(workspace.targetHa)}">
            </label>
            <label>
              <span>Ciclo em acompanhamento</span>
              <input ${readonly} data-live-field="currentCycle" value="${safe(workspace.currentCycle)}">
            </label>
            <label>
              <span>Observacao territorial</span>
              <textarea ${readonly} data-live-field="mapAreaNote" rows="3">${safe(workspace.mapAreaNote)}</textarea>
            </label>
          </article>

          <article class="live-panel relationship-panel">
            <div class="card-head">
              <span>Qualidade e relacionamento</span>
              <strong>${formatNumber(Math.round((quality + relationship) / 2))}/100</strong>
            </div>
            <div class="relationship-gauges">
              <div style="--value:${quality * 3.6}deg">
                <strong>${formatNumber(quality)}</strong>
                <span>Qualidade</span>
              </div>
              <div style="--value:${relationship * 3.6}deg">
                <strong>${formatNumber(relationship)}</strong>
                <span>Relacionamento</span>
              </div>
            </div>
            <label>
              <span>Qualidade operacional percebida</span>
              <input ${readonly} data-live-field="qualityScore" type="number" min="0" max="100" value="${safe(workspace.qualityScore)}">
            </label>
            <label>
              <span>Relacionamento atual</span>
              <input ${readonly} data-live-field="relationshipScore" type="number" min="0" max="100" value="${safe(workspace.relationshipScore)}">
            </label>
            <label>
              <span>Leitura executiva do historico</span>
              <textarea ${readonly} data-live-field="historyNote" rows="3">${safe(workspace.historyNote)}</textarea>
            </label>
          </article>
        </div>

        <div class="live-model-grid">
          ${partnerModels.map((model) => `
            <article class="live-model-card">
              <span>${safe(model.partner)} | ${safe(model.moment)}</span>
              <h3>${safe(model.model)}</h3>
              <p>${safe(model.duties)}</p>
            </article>
          `).join("")}
        </div>

        <div class="live-board-grid">
          <article class="live-panel">
            <div class="card-head">
              <span>Historico e acoes</span>
              <button type="button" ${disabled} data-action="add-live-item" data-list="history">Adicionar</button>
            </div>
            <div class="live-record-list">
              ${workspace.history.map((item, index) => `
                <div class="live-record">
                  <input ${readonly} data-live-list="history" data-index="${index}" data-field="date" type="date" value="${safe(item.date)}">
                  <input ${readonly} data-live-list="history" data-index="${index}" data-field="title" value="${safe(item.title)}">
                  <select ${disabled} data-live-list="history" data-index="${index}" data-field="type">
                    ${["Diagnostico", "Campo", "Relacionamento", "Cotacao", "Comite", "Safra"].map((type) => `<option value="${type}" ${item.type === type ? "selected" : ""}>${type}</option>`).join("")}
                  </select>
                  <textarea ${readonly} data-live-list="history" data-index="${index}" data-field="note" rows="2">${safe(item.note)}</textarea>
                  ${canEdit ? `<button type="button" data-action="remove-live-item" data-list="history" data-index="${index}">Remover</button>` : ""}
                </div>
              `).join("")}
            </div>
          </article>

          <article class="live-panel quote-panel">
            <div class="card-head">
              <span>Flow-up de cotacoes</span>
              <button type="button" ${disabled} data-action="add-live-item" data-list="quotes">Adicionar</button>
            </div>
            <div class="quote-chart">
              ${quoteSummary.map((item) => `
                <div>
                  <i><b style="height: ${percent(item.count, maxQuote)}%"></b></i>
                  <span>${safe(item.label)}</span>
                  <strong>${formatNumber(item.count)}</strong>
                </div>
              `).join("")}
            </div>
            <div class="live-record-list">
              ${workspace.quotes.map((quote, index) => `
                <div class="live-record quote-record">
                  <input ${readonly} data-live-list="quotes" data-index="${index}" data-field="date" type="date" value="${safe(quote.date)}">
                  <input ${readonly} data-live-list="quotes" data-index="${index}" data-field="code" value="${safe(quote.code)}">
                  <input ${readonly} data-live-list="quotes" data-index="${index}" data-field="scope" value="${safe(quote.scope)}">
                  <select ${disabled} data-live-list="quotes" data-index="${index}" data-field="status">
                    ${["Prevista", "Em construcao", "Enviada", "Aprovada", "Pausada"].map((status) => `<option value="${status}" ${quote.status === status ? "selected" : ""}>${status}</option>`).join("")}
                  </select>
                  <textarea ${readonly} data-live-list="quotes" data-index="${index}" data-field="nextAction" rows="2">${safe(quote.nextAction)}</textarea>
                  ${canEdit ? `<button type="button" data-action="remove-live-item" data-list="quotes" data-index="${index}">Remover</button>` : ""}
                </div>
              `).join("")}
            </div>
          </article>
        </div>

        <div class="live-followup">
          <div class="card-head">
            <span>Cronograma de follow-up</span>
            <button type="button" ${disabled} data-action="add-live-item" data-list="tasks">Adicionar marco</button>
          </div>
          <div class="followup-summary">
            <article><strong>${formatNumber(pendingTasks)}</strong><span>A fazer</span></article>
            <article><strong>${formatNumber(activeTasks)}</strong><span>Em andamento</span></article>
            <article><strong>${formatNumber(doneTasks)}</strong><span>Concluidos</span></article>
          </div>
          <div class="program-calendar">
            ${cadenceSummary.map((item) => `
              <article class="${item.count ? "active" : ""}">
                <span>${safe(item.label)}</span>
                <strong>${safe(item.moment)}</strong>
                <p>${safe(item.objective)}</p>
                <small>${formatNumber(item.count)} marco${item.count === 1 ? "" : "s"}</small>
                <button
                  type="button"
                  ${disabled}
                  data-action="add-calendar-task"
                  data-cadence="${safe(item.value)}"
                >
                  Adicionar ao cronograma
                </button>
              </article>
            `).join("")}
          </div>
          <div class="followup-grid">
            ${workspace.tasks.map((task, index) => `
              <article class="followup-card ${task.status.toLowerCase().replace(/[^a-z0-9]+/g, "-")}">
                <div class="task-meta-grid">
                  <label>
                    <span>Data</span>
                    <input ${readonly} data-live-list="tasks" data-index="${index}" data-field="date" type="date" value="${safe(task.date)}">
                  </label>
                  <label>
                    <span>Cadencia</span>
                    <select ${disabled} data-live-list="tasks" data-index="${index}" data-field="cadence">
                      ${followUpCadenceOptions.map((option) => `<option value="${safe(option.value)}" ${task.cadence === option.value ? "selected" : ""}>${safe(option.label)}</option>`).join("")}
                    </select>
                  </label>
                  <label>
                    <span>Status</span>
                    <select ${disabled} data-live-list="tasks" data-index="${index}" data-field="status">
                      ${followUpStatusOptions.map((status) => `<option value="${safe(status)}" ${task.status === status ? "selected" : ""}>${safe(status)}</option>`).join("")}
                    </select>
                  </label>
                  <label>
                    <span>Etapa</span>
                    <select ${disabled} data-live-list="tasks" data-index="${index}" data-field="stage">
                      ${followUpStageOptions.map((stage) => `<option value="${safe(stage)}" ${task.stage === stage ? "selected" : ""}>${safe(stage)}</option>`).join("")}
                    </select>
                  </label>
                  <label>
                    <span>Objetivo</span>
                    <select ${disabled} data-live-list="tasks" data-index="${index}" data-field="objective">
                      ${followUpObjectiveOptions.map((objective) => `<option value="${safe(objective)}" ${task.objective === objective ? "selected" : ""}>${safe(objective)}</option>`).join("")}
                    </select>
                  </label>
                </div>
                <input ${readonly} data-live-list="tasks" data-index="${index}" data-field="timing" value="${safe(task.timing)}">
                <textarea ${readonly} data-live-list="tasks" data-index="${index}" data-field="action" rows="3">${safe(task.action)}</textarea>
                <input ${readonly} data-live-list="tasks" data-index="${index}" data-field="owner" value="${safe(task.owner)}">
                ${canEdit ? `<button type="button" data-action="remove-live-item" data-list="tasks" data-index="${index}">Remover</button>` : ""}
              </article>
            `).join("")}
          </div>
        </div>
      </section>
    `;
  }

  renderPartners(client, profile) {
    const selectedPartner = partnerProgramPartners.find((partner) => partner.id === this.state.selectedPartnerId) ?? partnerProgramPartners[0];
    const selectedAction = selectedPartner.actions.find((action) => action.id === this.state.selectedPartnerActionId) ?? selectedPartner.actions[0];

    return `
      <section id="partners" class="panel-section partners-section partner-clean">
        <div class="section-title">
          <div>
            <span>Ecossistema de parceria</span>
            <h2>Parceiros conectados ao programa ORIZON.</h2>
          </div>
          <p>O programa governa a jornada como um todo. Cada parceiro entra com modelos de atuacao especificos, acionados por evidencia, etapa e necessidade operacional.</p>
        </div>

        <div class="partner-program-grid" aria-label="Parceiros do programa ORIZON">
          ${partnerProgramPartners.map((partner) => {
            const activeAction = partner.id === selectedPartner.id
              ? selectedAction
              : partner.actions[0];
            return `
            <article class="program-partner-card ${partner.id === selectedPartner.id ? "active" : ""}">
              <div class="partner-logo-frame">
                <img src="${safe(partner.logo)}" alt="${safe(partner.partner)}">
              </div>
              <div class="program-partner-copy">
                <span>Parceiro</span>
                <h3>${safe(partner.partner)}</h3>
                <p>${safe(partner.summary)}</p>
              </div>
              <button
                class="partner-open-button"
                type="button"
                data-action="select-partner"
                data-partner-id="${safe(partner.id)}"
              >
                Ver modelos
              </button>
              <div class="partner-action-tabs" aria-label="Modelos de atuacao ${safe(partner.partner)}">
                ${partner.actions.map((action) => `
                  <button
                    class="${partner.id === selectedPartner.id && action.id === selectedAction.id ? "active" : ""}"
                    type="button"
                    data-action="select-partner-action"
                    data-partner-id="${safe(partner.id)}"
                    data-action-id="${safe(action.id)}"
                  >
                    ${safe(action.label)}
                  </button>
                `).join("")}
              </div>
              <div class="partner-action-preview">
                <span>${safe(activeAction.stage)}</span>
                <strong>${safe(activeAction.model)}</strong>
              </div>
            </article>`;
          }).join("")}
        </div>

        <div class="partner-detail partner-process-detail">
          <div class="partner-detail-logo">
            <img src="${safe(selectedPartner.logo)}" alt="${safe(selectedPartner.partner)}">
          </div>
          <div>
            <span>${safe(selectedPartner.partner)} | ${safe(selectedAction.stage)}</span>
            <h3>${safe(selectedAction.label)}</h3>
            <p>${safe(selectedAction.model)}</p>
          </div>
          <div class="partner-output-list">
            <strong>${safe(selectedAction.evidence)}</strong>
          </div>
        </div>

        ${this.renderPartnerMedia(selectedPartner)}

        <div class="partner-principle">
          <span>Programa ORIZON</span>
          <strong>A NOOA conduz a jornada; parceiros ampliam a capacidade de execucao.</strong>
          <p>TCH aprofunda leitura tecnica e padronizacao. Mais Maquinas apresenta alternativas estruturais quando o plano comprova necessidade de equipamento.</p>
        </div>
      </section>
    `;
  }

  renderPartnerMedia(partner) {
    const media = partner.media;
    if (!media) return "";
    const mediaElement = media.type === "video"
      ? `
        <video
          src="${safe(media.src)}"
          autoplay
          muted
          loop
          playsinline
          preload="metadata"
        ></video>`
      : `<img src="${safe(media.src)}" alt="${safe(media.label)}" loading="lazy">`;

    return `
      <div class="partner-media-showcase">
        <div class="partner-media-copy">
          <span>Material do parceiro</span>
          <h3>${safe(media.label)}</h3>
          <p>${safe(media.caption)}</p>
        </div>
        <div class="partner-media-frame">
          ${mediaElement}
        </div>
      </div>
    `;
  }

  renderDiagnostics(client, profile) {
    return `
      <div id="partner-tch" class="partner-panel diagnostics-section">
        <div class="section-title compact">
          <span>Parceiro recomendado para entrada</span>
          <h2>TCH valida o diagnostico antes da evolucao estrutural.</h2>
          <p>A progressao recomendada e iniciar com leitura tecnica independente, corrigir gargalos e so depois habilitar usos estruturais com pontos ORIZON.</p>
        </div>

        <div class="diagnostic-layout">
          ${tchDiagnosticModels.map((model) => `
            <article class="diagnostic-card">
              <span>${safe(model.stage)}</span>
              <h3>${safe(model.title)}</h3>
              <p>${safe(model.scope)}</p>
              <strong>Entregaveis</strong>
              <ul>${model.outputs.map((item) => `<li>${safe(item)}</li>`).join("")}</ul>
            </article>
          `).join("")}
        </div>

        <div class="commercial-options">
          ${tchCommercialOptions.map((option) => `
            <article>
              <span>${safe(option.stage)}</span>
              <h3>${safe(option.product)}</h3>
              <p>${safe(option.specification)}</p>
              <strong>${safe(option.points)}</strong>
              <small>${safe(option.maxOrizon)} | ${safe(option.decision)}</small>
            </article>
          `).join("")}
        </div>

        <div class="service-library">
          <article>
            <span>Laudos possiveis</span>
            <strong>Qualidade, eficiencia, sanidade, padronizacao e executivo.</strong>
            <p>Os modelos ja recebem o padrao do relatorio TCH: afericao, evidencia, desvio, correcao e reafericao.</p>
          </article>
          <article>
            <span>Cliente em foco</span>
            <strong>${safe(profile.role === "admin" || profile.role === "client" ? client.name : "Sem dados sensiveis")}</strong>
            <p>${safe(profile.role === "client" ? "Visualizacao externa: somente marcos e evidencias do proprio plano." : "Administradores poderao anexar diagnosticos, evidencias e relatórios ao cliente selecionado.")}</p>
          </article>
        </div>

        <div class="report-library">
          ${tchReportTypes.map((report) => `
            <article>
              <span>${safe(report.type)}</span>
              <p>${safe(report.useWhen)}</p>
              <strong>${safe(report.output)}</strong>
            </article>
          `).join("")}
        </div>

        <div class="service-groups">
          ${tchServiceGroups.map((group) => `
            <article>
              <span>${safe(group.category)}</span>
              <ul>${group.items.map((item) => `<li>${safe(item)}</li>`).join("")}</ul>
            </article>
          `).join("")}
        </div>
      </div>
    `;
  }

  renderEquipment(client, profile) {
    return `
      <div id="partner-mais-maquinas" class="partner-panel equipment-section">
        <div class="section-title compact">
          <span>Trilha estrutural Mais Maquinas</span>
          <h2>Equipamentos entram como evolucao futura, por pontos e coparticipacao tecnica.</h2>
          <p>O cliente nao fica preso a um parceiro. A sugestao e diagnosticar com TCH, corrigir gargalos e depois selecionar equipamentos ou implementos quando houver evidencia.</p>
        </div>

        <div class="points-policy">
          <article>
            <span>${safe(technicalPointsPolicy.name)}</span>
            <h3>Lastro tecnico para planos aprovados.</h3>
            <p>${safe(technicalPointsPolicy.positioning)}</p>
          </article>
          <article>
            <span>Regra de entrada</span>
            <h3>PRIME/LEGACY ou plano validado.</h3>
            <p>Equipamentos estruturais devem ser priorizados apos diagnostico TCH, correcao assistida e aprovacao por comite.</p>
          </article>
        </div>

        <div class="equipment-grid">
          ${equipmentModels.map((item, index) => `
            <button class="equipment-option ${index === this.state.selectedEquipmentIndex ? "active" : ""}" type="button" data-action="select-equipment" data-index="${index}">
              <span>${safe(item.stage)}</span>
              <h3>${safe(item.title)}</h3>
              <strong>${safe(item.points)}</strong>
              ${index === this.state.selectedEquipmentIndex ? `
                <div class="equipment-inline-detail">
                  <span>Modelo de sugestao a seguir</span>
                  <em>${safe(item.specification)}</em>
                  <p>${safe(item.fit)}</p>
                  <small>${safe(item.maxOrizon)} | ${safe(item.note)}</small>
                </div>
              ` : `<small>Clique para ver especificacao</small>`}
            </button>
          `).join("")}
        </div>

        <div class="catalog-grid">
          ${structuralCatalog.map((item) => `
            <article>
              <span>${safe(item.group)}</span>
              <p>${safe(item.eligibility)}</p>
              <strong>${item.examples.map((example) => safe(example)).join(" | ")}</strong>
            </article>
          `).join("")}
        </div>

        <div class="points-rules">
          <article>
            <span>Como gerar lastro</span>
            <ul>${technicalPointsPolicy.earnRules.map((rule) => `<li>${safe(rule)}</li>`).join("")}</ul>
          </article>
          <article>
            <span>Como usar</span>
            <ul>${technicalPointsPolicy.useRules.map((rule) => `<li>${safe(rule)}</li>`).join("")}</ul>
          </article>
        </div>

        <div class="client-agent-strip">
          <strong>${safe(profile.role === "client" || profile.role === "admin" ? client.name : "Trilha sem cliente exposto")}</strong>
          <span>Progressao recomendada</span>
          <p>TCH valida e corrige; Mais Maquinas escala e estrutura; ORIZON governa o budget por evidencia.</p>
        </div>
      </div>
    `;
  }

  renderCredit(data, totals, client) {
    const maxProductCredit = Math.max(...data.products.map((product) => product.creditPerUnit), 1);

    return `
      <section id="credit" class="panel-section credit-section">
        <div class="section-title compact">
          <span>Governanca de credito</span>
          <h2>Budget tecnico-operacional por governanca.</h2>
          <p>Separacao entre recomendado, aprovavel, pendente, aprovado e bloqueado por governanca.</p>
        </div>

        <div class="credit-layout">
          <article class="panel-card credit-master">
            <div class="card-head">
              <span>Carteira total</span>
              <strong>${formatCompactCurrency(totals.recommended)}</strong>
            </div>
            ${this.renderCreditBars(totals)}
          </article>

          <article class="panel-card credit-master selected-credit">
            <div class="card-head">
              <span>Cliente selecionado</span>
              <strong>${safe(client.name)}</strong>
            </div>
            ${this.renderCreditBars(client.creditControl)}
          </article>
        </div>

        <div class="policy-grid">
          ${data.policy.map((policy) => `
            <article>
              <span class="tier-pill ${levelClass(policy.level)}">${policy.level}</span>
              <strong>${formatPercent(policy.capPercent)}</strong>
              <p>${safe(policy.purchaseRequirement)}</p>
              <small>${safe(policy.protectionRule)}</small>
            </article>
          `).join("")}
        </div>

        <div class="product-table">
          ${data.products.map((product) => `
            <article>
              <div>
                <strong>${safe(product.product)}</strong>
                <span>${safe(product.role)}</span>
              </div>
              <div class="product-meter"><i style="width: ${percent(product.creditPerUnit, maxProductCredit)}%"></i></div>
              <span>${product.eligible ? "Gera pontos ORIZON" : "Nao gera pontos"}</span>
              <small>${product.eligible ? "Elegivel" : "Bloqueado"}</small>
            </article>
          `).join("")}
        </div>
      </section>
    `;
  }

  renderGis(data, selectedClient, focused = false) {
    const layers = OrizonAgents.gis.layers(data);
    const nodes = OrizonAgents.gis.nodes(data);
    const workspace = this.clientWorkspace(selectedClient);
    const selectedNode = nodes.find((node) => node.id === selectedClient.id) ?? {
      id: selectedClient.id,
      name: selectedClient.name,
      level: selectedClient.level,
      x: 50,
      y: 50,
      size: 1.2,
    };
    const targetPct = percent(Number(workspace.targetHa) || 0, Number(selectedClient.areaHa) || 1);

    if (focused) {
      return `
        <section id="gis" class="panel-section gis-section focused-gis">
          <div class="section-title compact">
            <span>Mapa / GIS da usina</span>
            <h2>${safe(selectedClient.name)} em leitura territorial.</h2>
            <p>Modo foco: somente as caracteristicas da usina selecionada aparecem. A carteira completa fica fora da tela para preservar a leitura operacional.</p>
          </div>

          <div class="focused-gis-layout">
            <div class="field-map selected-only-map" aria-label="Mapa simulado da usina selecionada">
              <div class="field-band band-one"></div>
              <div class="field-band band-two"></div>
              <div class="field-band band-three"></div>
              <button
                type="button"
                class="map-node ${levelClass(selectedClient.level)} active"
                style="left: ${selectedNode.x}%; top: ${selectedNode.y}%; --size: ${selectedNode.size}"
                title="${safe(selectedClient.name)}"
              ></button>
            </div>

            <div class="selected-gis-panel">
              <article>
                <span>Usina selecionada</span>
                <strong>${safe(selectedClient.name)}</strong>
                <p>${safe(selectedClient.businessModel)}</p>
              </article>
              <article>
                <span>Area base</span>
                <strong>${formatHa(selectedClient.areaHa)}</strong>
                <p>Numero ajustavel quando o grupo vende, compra ou reorganiza unidades.</p>
              </article>
              <article>
                <span>Target a mapear</span>
                <strong>${formatHa(Number(workspace.targetHa) || 0)}</strong>
                <i class="gis-target-meter"><b style="width:${targetPct}%"></b></i>
                <p>${formatNumber(targetPct)}% da area base atual.</p>
              </article>
              <article>
                <span>Etapa assistida</span>
                <strong>${safe(selectedClient.assistStage.current)}</strong>
                <p>${safe(selectedClient.nextDecision)}</p>
              </article>
              <article>
                <span>Parceiro indicado</span>
                <strong>${safe(selectedClient.partner)}</strong>
                <p>${safe(workspace.partnerScope)}</p>
              </article>
              <article>
                <span>Observacao territorial</span>
                <strong>${safe(workspace.currentCycle)}</strong>
                <p>${safe(workspace.mapAreaNote)}</p>
              </article>
            </div>
          </div>
        </section>
      `;
    }

    return `
      <section id="gis" class="panel-section gis-section">
        <div class="section-title compact">
          <span>Mapas / GIS Agricola</span>
          <h2>Camada territorial preparada para a segunda onda.</h2>
          <p>Visual inicial sem API externa: clientes, niveis, areas potenciais e estados de evolucao operacional.</p>
        </div>

        <div class="gis-layout">
          <div class="field-map" aria-label="Mapa simulado ORIZON">
            ${nodes.map((node) => `
              <button
                type="button"
                class="map-node ${levelClass(node.level)} ${node.id === selectedClient.id ? "active" : ""}"
                style="left: ${node.x}%; top: ${node.y}%; --size: ${node.size}"
                data-action="select-client"
                data-client-id="${safe(node.id)}"
                title="${safe(node.name)}"
              ></button>
            `).join("")}
          </div>

          <div class="layer-panel">
            ${layers.map((layer) => `
              <article>
                <span>${safe(layer.label)}</span>
                <strong>${layer.value}</strong>
              </article>
            `).join("")}
            <div class="selected-area">
              <span>Area selecionada</span>
              <strong>${safe(selectedClient.name)}</strong>
              <p>${formatHa(selectedClient.areaHa)} | ${safe(selectedClient.assistStage.current)}</p>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  renderReport(data, client, isAdmin = false) {
    const report = OrizonAgents.report.client(client);

    return `
      <section id="report" class="panel-section report-section">
        <div class="section-title compact">
          <span>Evolution Report</span>
          <h2>Narrativa executiva automatizada por cliente.</h2>
          <p>Relatorio mensal/trimestral para diretoria, com score, credito, evidencias e proximo ciclo.</p>
        </div>

        <div class="report-layout">
          <article class="report-page">
            <span>${safe(report.title)}</span>
            <h3>${safe(client.level)} | Score ${formatNumber(client.score)}</h3>
            <p>${safe(report.thesis)}</p>
            <div class="report-metrics">
              <strong>${formatHa(client.areaHa)}<small>area potencial</small></strong>
              <strong>${formatCompactCurrency(client.creditRecommended)}<small>credito recomendado</small></strong>
              <strong>${safe(client.assistStage.current)}<small>etapa assistida</small></strong>
            </div>
            <p>${safe(report.nextCycle)}</p>
            <em>${safe(report.proof)}</em>
          </article>

          <article class="panel-card raizen-card">
            <div class="card-head">
              <span>Piloto ancora</span>
              <strong>${isAdmin ? "Grupo Raizen LEGACY" : "Modelo LEGACY"}</strong>
            </div>
            <p>${isAdmin ? "Cliente ancora enterprise para validar governanca, diagnosticos TCH, areas semi-comerciais e expansao plurianual." : "A versao externa mostra evolucao, evidencias e proximos marcos sem expor carteira, politica interna ou orcamentos sensiveis."}</p>
            <strong>${isAdmin ? `${data?.raizenPilot?.budget?.length ?? 0} blocos de budget tecnico mapeados` : "Relatorio sanitizado para cliente"}</strong>
          </article>
        </div>
      </section>
    `;
  }

  renderAutomation() {
    return `
      <section id="automation" class="panel-section automation-section">
        <div class="section-title compact">
          <span>Automacao futura</span>
          <h2>Blueprint pronto para integrar sistemas reais.</h2>
          <p>Na v1 o site e estatico. A arquitetura ja mostra como BI, CRM, assinatura, GIS e follow-up entram sem mudar a logica dos agentes.</p>
        </div>

        <div class="automation-grid">
          ${automationBlueprint.map((item) => `
            <article>
              <span>${safe(item.name)}</span>
              <strong>${safe(item.agent)}</strong>
              <p>${safe(item.flow)}</p>
            </article>
          `).join("")}
        </div>
      </section>
    `;
  }

  renderCreditBars(control) {
    const total = control.recommended || 1;
    return `
      <div class="credit-stack" aria-label="Composicao do credito">
        <i class="approved" style="width: ${percent(control.approved, total)}%"></i>
        <i class="pending" style="width: ${percent(control.pending, total)}%"></i>
        <i class="blocked" style="width: ${percent(control.blocked, total)}%"></i>
      </div>
      <div class="credit-legend">
        <span><b class="approved"></b>Aprovado ${formatCompactCurrency(control.approved)}</span>
        <span><b class="pending"></b>Pendente ${formatCompactCurrency(control.pending)}</span>
        <span><b class="blocked"></b>Bloqueado ${formatCompactCurrency(control.blocked)}</span>
      </div>
    `;
  }
}

customElements.define("orizon-cockpit-app", OrizonCockpitApp);
