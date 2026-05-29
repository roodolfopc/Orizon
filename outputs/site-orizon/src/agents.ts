import type { ClientPlan, CreditControl, Level, OrizonDataset } from "./types";

export const levelOrder: Level[] = ["START", "FLOW", "PRIME", "LEGACY"];

export const agentBlueprints = [
  {
    id: "maestro",
    name: "Maestro ORIZON",
    system: "ORIZON OS",
    role: "Coordena os agentes, valida a jornada e preserva a logica Diagnosticar, Corrigir e Evoluir.",
    monitors: "Score, etapa, credito, plano tecnico, governanca e proxima decisao.",
    cadence: "Revisao semanal e comite mensal.",
    decision: "Define o caminho cliente a cliente e a proxima liberacao de trabalho.",
  },
  {
    id: "bi-score",
    name: "BI / Score Agent",
    system: "Dashboard BI",
    role: "Consolida carteira, score, niveis, pipeline, credito recomendado e alertas executivos.",
    monitors: "Carteira 2026, Modelo Pontuacao, Pipeline Mensal e Resumo Programa.",
    cadence: "Atualizacao semanal e fechamento mensal para diretoria.",
    decision: "Prioriza fila de ataque e sinaliza desvio de score ou potencial.",
  },
  {
    id: "crm-conta",
    name: "CRM / Conta Agent",
    system: "CRM",
    role: "Monta a ficha viva por grupo, usina, responsavel, status e proxima acao.",
    monitors: "Carteira 2026, Especificacao Clientes e Acoes por Modelo.",
    cadence: "Atualizacao a cada interacao e revisao semanal.",
    decision: "Cria plano de conta e garante dono para cada movimento.",
  },
  {
    id: "tecnico",
    name: "Tecnico / Diagnostico Agent",
    system: "TCH + NOOA Tecnica",
    role: "Transforma interesse comercial em diagnostico operacional e recomendacao tecnica.",
    monitors: "Gargalos, qualidade de aplicacao, treinamento, area piloto e parceiro indicado.",
    cadence: "Diagnostico inicial, revisao de execucao e reavaliacao por safra.",
    decision: "Libera a passagem de Diagnosticar para Corrigir.",
  },
  {
    id: "credito",
    name: "Credito / Politica Agent",
    system: "Politica ORIZON",
    role: "Aplica teto, elegibilidade, peso de produto e regra de budget tecnico-operacional.",
    monitors: "Produtos e Pesos, Politica ORIZON, cotacao vigente e mix comprado.",
    cadence: "Recalculo por cotacao, compra ou mudanca de mix.",
    decision: "Recomenda credito sem transforma-lo em desconto automatico.",
  },
  {
    id: "aprovacao",
    name: "Aprovacao / Assinatura Agent",
    system: "Assinatura e aprovacao",
    role: "Garante trilha de auditoria e alcada antes da liberacao de budget.",
    monitors: "Plano tecnico, anexos, responsaveis, indicadores e limites por nivel.",
    cadence: "Fluxo continuo, com comite semanal PRIME e mensal LEGACY.",
    decision: "Aprova, devolve ou bloqueia budget tecnico-operacional.",
  },
  {
    id: "gis",
    name: "GIS / Areas Agent",
    system: "Mapas / GIS Agricola",
    role: "Prepara leitura territorial por grupo, usina, unidade, area e camada operacional.",
    monitors: "Area potencial, area evoluida, status por unidade e parceiro tecnico.",
    cadence: "Atualizacao mensal e revisao por safra.",
    decision: "Mostra onde expandir, medir ou acionar TCH/Mais Maquinas.",
  },
  {
    id: "follow-up",
    name: "Follow-up / Cadencia Agent",
    system: "Automacao de follow-up",
    role: "Mantem ritmo com alertas, comites, tarefas e revisoes de maturidade.",
    monitors: "Proxima acao, atraso, cliente sem interacao, plano em aprovacao e resultado pendente.",
    cadence: "Semanal, quinzenal, mensal e trimestral.",
    decision: "Dispara a proxima acao assistida e evita perda de cadencia.",
  },
  {
    id: "report",
    name: "Relatorio Executivo Agent",
    system: "Evolution Report",
    role: "Transforma dados em narrativa para diretoria, cliente e safra.",
    monitors: "Antes/depois, score, hectares, credito, evidencia e proxima tese.",
    cadence: "Mensal, trimestral e por ciclo PRIME/LEGACY.",
    decision: "Gera a leitura executiva e a tese de expansao.",
  },
] as const;

export function formatCurrency(value = 0): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatCompactCurrency(value = 0): string {
  if (Math.abs(value) >= 1_000_000) {
    return `${formatCurrency(value / 1_000_000).replace("R$", "R$ ")} mi`;
  }
  if (Math.abs(value) >= 1_000) {
    return `${formatCurrency(value / 1_000).replace("R$", "R$ ")} mil`;
  }
  return formatCurrency(value);
}

export function formatNumber(value = 0): string {
  return new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 }).format(value);
}

export function formatHa(value = 0): string {
  return `${new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 }).format(value)} ha`;
}

export function formatPercent(value = 0): string {
  return new Intl.NumberFormat("pt-BR", { style: "percent", maximumFractionDigits: 1 }).format(value);
}

export function levelClass(level: Level): string {
  return `level-${level.toLowerCase()}`;
}

function creditTotals(clients: ClientPlan[]): CreditControl {
  return clients.reduce(
    (total, client) => ({
      recommended: total.recommended + client.creditControl.recommended,
      approvable: total.approvable + client.creditControl.approvable,
      approved: total.approved + client.creditControl.approved,
      pending: total.pending + client.creditControl.pending,
      blocked: total.blocked + client.creditControl.blocked,
    }),
    { recommended: 0, approvable: 0, approved: 0, pending: 0, blocked: 0 },
  );
}

export const OrizonAgents = {
  maestro: {
    composeClientPath(client: ClientPlan) {
      return [
        { label: "Mapear", agent: "CRM / Conta", status: "done" },
        { label: "Diagnosticar", agent: "Tecnico", status: client.assistStage.steps[0].status },
        { label: "Pontuar", agent: "BI / Score", status: "done" },
        { label: "Aprovar", agent: "Aprovacao", status: client.creditRecommended > 0 ? "current" : "next" },
        { label: "Executar", agent: "Follow-up", status: client.assistStage.current === "Evoluir" ? "done" : "next" },
        { label: "Medir", agent: "Relatorio", status: client.assistStage.current === "Evoluir" ? "current" : "next" },
        { label: "Expandir", agent: "GIS / Areas", status: client.level === "LEGACY" ? "current" : "next" },
      ];
    },
    recommendation(client: ClientPlan) {
      if (client.level === "LEGACY") {
        return "Formalizar comite executivo, plano por unidade e liberacao por fase.";
      }
      if (client.level === "PRIME") {
        return "Conectar mix core, indicador tecnico e aprovacao gerencial.";
      }
      if (client.level === "FLOW") {
        return "Rodar prova de valor em ate 60 dias com criterio de continuidade.";
      }
      return "Qualificar dor, decisor e acesso antes de qualquer investimento relevante.";
    },
  },

  biScore: {
    portfolio(dataset: OrizonDataset) {
      return {
        kpis: [
          ["Clientes", dataset.executive.clientCount.toString(), "carteira mapeada no Excel"],
          ["Potencial", formatCompactCurrency(dataset.executive.pipelinePotential), "pipeline consolidado 2026"],
          ["Score medio", formatNumber(dataset.executive.scoreAverage), "media operacional reformulada"],
          ["Credito recomendado", formatCompactCurrency(dataset.executive.creditRecommended), "budget tecnico-operacional"],
        ],
        levels: levelOrder.map((level) => ({
          level,
          clients: dataset.executive.levels[level]?.clients ?? 0,
          credit: dataset.executive.levels[level]?.credit ?? 0,
        })),
        topClients: dataset.clients.slice(0, 8),
      };
    },
  },

  crm: {
    filterClients(dataset: OrizonDataset, search: string, level: string) {
      const normalized = search.trim().toLowerCase();
      return dataset.clients.filter((client) => {
        const matchesSearch = !normalized || `${client.name} ${client.owner} ${client.businessModel}`.toLowerCase().includes(normalized);
        const matchesLevel = level === "TODOS" || client.level === level;
        return matchesSearch && matchesLevel;
      });
    },
  },

  technical: {
    stageSummary(client: ClientPlan) {
      return {
        title: client.assistStage.current,
        progress: client.assistStage.progress,
        headline: client.evolutionTrack || client.adoptionDirective || "Trilha tecnica em estruturacao.",
      };
    },
  },

  credit: {
    totals(dataset: OrizonDataset) {
      return creditTotals(dataset.clients);
    },
    client(client: ClientPlan) {
      return client.creditControl;
    },
  },

  approval: {
    route(client: ClientPlan) {
      return client.approval;
    },
  },

  gis: {
    layers(dataset: OrizonDataset) {
      return [
        { label: "Diagnostico", value: dataset.clients.filter((client) => client.assistStage.current === "Diagnosticar").length },
        { label: "Correcao", value: dataset.clients.filter((client) => client.assistStage.current === "Corrigir").length },
        { label: "Evolucao", value: dataset.clients.filter((client) => client.assistStage.current === "Evoluir").length },
        { label: "PRIME+", value: dataset.executive.primePlusClients },
      ];
    },
    nodes(dataset: OrizonDataset) {
      return dataset.clients.slice(0, 18).map((client, index) => ({
        id: client.id,
        name: client.name,
        level: client.level,
        x: 8 + ((index * 19) % 78),
        y: 14 + ((index * 31) % 68),
        size: Math.max(0.65, Math.min(1.6, client.areaHa / 160000)),
      }));
    },
  },

  followUp: {
    alerts(dataset: OrizonDataset) {
      return dataset.clients
        .filter((client) => client.level === "LEGACY" || client.queue?.includes("Fila 1"))
        .slice(0, 6)
        .map((client) => ({
          client: client.name,
          cadence: client.followUp.cadence,
          trigger: client.followUp.trigger,
          action: client.nextDecision,
        }));
    },
  },

  report: {
    client(client: ClientPlan) {
      return {
        title: `Evolution Report | ${client.name}`,
        thesis: client.executiveSpecification || `${client.name} deve evoluir por adocao tecnologica e governanca de conta.`,
        nextCycle: OrizonAgents.maestro.recommendation(client),
        proof: "Credito ORIZON tratado como budget tecnico-operacional, liberado por marco e evidencia.",
      };
    },
  },
};
