export type Level = "START" | "FLOW" | "PRIME" | "LEGACY";
export type AssistedStageName = "Diagnosticar" | "Corrigir" | "Evoluir";

export type ExecutiveSummary = {
  clientCount: number;
  areaTotalHa: number;
  pipelinePotential: number;
  scoreAverage: number;
  creditRecommended: number;
  primePlusClients: number;
  immediateQueue: number;
  anchorClient: string;
  levels: Record<Level, { clients: number; credit: number }>;
};

export type ClientPlan = {
  id: string;
  rank: number;
  name: string;
  level: Level;
  sourceLevel: string;
  score: number;
  priority: string;
  owner: string;
  areaHa: number;
  canaPlanta: number;
  canaSoca: number;
  situation: string;
  proposedAction: string;
  governanceStatus: string;
  businessModel: string;
  maturityFactor: number;
  potential: string;
  adoptionStage: string;
  technologyEntry: string;
  adoptionDirective: string;
  partner: string;
  evolutionTrack: string;
  executiveSpecification: string;
  governance: string;
  scoreBreakdown: {
    porte: number;
    prioridade: number;
    adocaoTecnica: number;
    conversao: number;
    fitOrizon: number;
  };
  queue: string;
  nextDecision: string;
  creditRecommended: number;
  creditControl: CreditControl;
  assistStage: {
    current: AssistedStageName;
    progress: number;
    steps: Array<{ name: AssistedStageName; status: "done" | "current" | "next" }>;
  };
  approval: {
    status: string;
    authority: string;
    rule: string;
  };
  followUp: {
    cadence: string;
    trigger: string;
    nextAction: string;
  };
  productVolumes: Record<string, number>;
};

export type CreditControl = {
  recommended: number;
  approvable: number;
  approved: number;
  pending: number;
  blocked: number;
};

export type ProductPolicy = {
  product: string;
  role: string;
  creditFactor: number;
  currentValue: number;
  doseHa: number;
  estimatedRevenueHa: number;
  creditPerUnit: number;
  creditPerHa: number;
  usageRule: string;
  eligible: boolean;
};

export type CreditPolicy = {
  level: Level;
  sourceLevel: string;
  scoreRange: string;
  capPercent: number;
  purchaseRequirement: string;
  monthlyCap: number;
  liberableCredit: number;
  usageTrigger: string;
  governance: string;
  protectionRule: string;
};

export type MonthlyPipeline = {
  month: string;
  potential: number;
  share: number;
};

export type OperationalPartner = {
  name: string;
  role: string;
  when: string;
  deliverable: string;
  recommendedLevel: string;
};

export type BusinessAction = {
  model: string;
  objective: string;
  healthyPolicy: string;
  nextAction: string;
  indicator: string;
};

export type ScoreModel = {
  components: Array<{ component: string; maxWeight: number; source: string; rule: string }>;
  levels: Array<{ range: string; level: Level; queue: string; conduct: string }>;
  topClients: Array<{
    name: string;
    score: number;
    level: Level;
    queue: string;
    areaHa: number;
    priority: string;
    model: string;
    nextDecision: string;
  }>;
};

export type RaizenPilot = {
  clientId: string | null;
  decisions: Record<string, unknown>[];
  budget: Record<string, unknown>[];
};

export type OrizonDataset = {
  generatedAt: string;
  sourceWorkbook: string;
  executive: ExecutiveSummary;
  clients: ClientPlan[];
  products: ProductPolicy[];
  policy: CreditPolicy[];
  pipeline: MonthlyPipeline[];
  partners: OperationalPartner[];
  businessActions: BusinessAction[];
  scoreModel: ScoreModel;
  raizenPilot: RaizenPilot;
};
