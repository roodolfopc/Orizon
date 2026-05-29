# ORIZON — Handoff Técnico para Codex

**Versão:** 2.0  
**Objetivo:** transferir a estrutura conceitual, matemática, operacional e de dados do Projeto Orizon para implementação em um app web SaaS.

---

## 1. Visão executiva do projeto

O **Orizon** deve ser desenvolvido como uma plataforma SaaS de evolução operacional para o agronegócio, com foco inicial em usinas e grupos de cana-de-açúcar.

A plataforma não deve ser apenas um CRM comercial. Ela deve funcionar como um **sistema operacional de desenvolvimento de mercado**, integrando:

- Cadastro de clientes, grupos e unidades;
- Área agrícola total, cana-planta e cana-soca;
- Potencial estratégico do cliente;
- Categoria Orizon;
- Créditos gerados por relacionamento, compras e engajamento;
- Jornada Kaizen iniciando sempre em K0;
- Diagnósticos técnicos;
- Projetos de evolução operacional;
- Produtos envolvidos;
- ROI, OES, KGI, OPI e indicadores executivos;
- Dashboard dinâmico para tomada de decisão.

---

## 2. Princípio central da arquitetura

O Orizon trabalha com duas dimensões independentes:

### 2.1 Categoria Orizon

Representa o **potencial estratégico e comercial** do cliente dentro do ecossistema.

Categorias:

| Level | Categoria | Conceito |
|---|---|---|
| Level 1 | Foundation | Áreas em estruturação operacional |
| Level 2 | Flow | Áreas em evolução contínua |
| Level 3 | Prime | Áreas de alta performance operacional |
| Level 4 | Legacy | Operações estratégicas Orizon |

### 2.2 Jornada Kaizen

Representa a **maturidade operacional real** do cliente dentro do programa.

Regra obrigatória:

> Todo cliente inicia a jornada Kaizen em K0, independentemente de ser Foundation, Flow, Prime ou Legacy.

Exemplos:

- Um cliente Legacy recém-cadastrado será **Legacy K0**.
- Um cliente Foundation com forte evolução operacional pode chegar a **Foundation K4** ou **Foundation K5**.

Isso evita confundir poder de compra com maturidade operacional.

---

## 3. Jornada Kaizen

| Nível | Nome técnico | Descrição | Critério de avanço |
|---|---|---|---|
| K0 | Sem diagnóstico | Cliente cadastrado, sem diagnóstico Orizon | Cadastro inicial |
| K1 | Diagnóstico realizado | Diagnóstico técnico/comercial concluído | Diagnóstico validado |
| K2 | Plano definido | Gargalos identificados e plano de ação montado | Plano de ação aprovado |
| K3 | Projeto implantado | Projeto em execução no campo | Projeto implantado |
| K4 | Resultado validado | Resultado técnico/econômico mensurado | ROI/OES validado |
| K5 | Benchmark operacional | Resultado replicável e utilizado como referência | Replicação ou vitrine técnica |

---

## 4. Índice principal: OPI — Orizon Potential Index

O OPI é o índice que define a categoria estratégica do cliente.

### 4.1 Fórmula

```text
OPI = (AreaScore × 0,30)
    + (ValidacaoTecnicaScore × 0,25)
    + (AberturaComercialScore × 0,20)
    + (PotencialPortfolioScore × 0,15)
    + (InfluenciaEstrategicaScore × 0,10)
```

### 4.2 Escala de área agrícola

| Área total | AreaScore |
|---|---:|
| < 20.000 ha | 20 |
| 20.000 a 50.000 ha | 40 |
| 50.001 a 100.000 ha | 60 |
| 100.001 a 200.000 ha | 80 |
| > 200.000 ha | 100 |

### 4.3 Escala de validação técnica

| Situação | ValidacaoTecnicaScore |
|---|---:|
| Sem protocolo | 0 |
| Campo previsto ou prospecção inicial | 15 |
| Campo instalado | 25 |
| Resultado parcial ou aguardando resultado | 50 |
| Resultado positivo | 75 |
| Compra comercial, área comercial ou produto validado | 100 |

### 4.4 Escala de abertura comercial

| Situação | AberturaComercialScore |
|---|---:|
| Cliente recluso, restrito ou sem acesso | 10 |
| Prospecção inicial | 30 |
| Relacionamento ativo | 60 |
| Comprador recorrente ou área semi-comercial | 80 |
| Parceiro estratégico ou cliente âncora | 100 |

### 4.5 Potencial de portfólio

Baseado na quantidade de produtos aplicáveis ao cliente.

Produtos do ecossistema:

- Auras
- Auba
- Tritter
- Aufix
- Artefato
- Bovettus
- Mettus
- Nerut

```text
PotencialPortfolioScore = (ProdutosAplicaveis / 8) × 100
```

### 4.6 Influência estratégica

Pontuação manual de 0 a 100, atribuída pela direção comercial.

Critérios:

- Escala regional ou nacional;
- Capacidade de influência sobre o setor;
- Capacidade de gerar vitrine técnica;
- Possibilidade de contrato plurianual;
- Potencial de integração com parceiros operacionais, como TCH ou Mais Máquinas.

---

## 5. Categoria Orizon calculada

| Faixa OPI | Categoria |
|---:|---|
| 0 a 49,99 | Foundation |
| 50 a 69,99 | Flow |
| 70 a 89,99 | Prime |
| 90 a 100 | Legacy |

### 5.1 Legacy Anchor

Status especial não obrigatório, aplicado manualmente.

Critérios:

- OPI acima de 95;
- Escala nacional;
- Resultado validado;
- Potencial de contrato estratégico;
- Cliente com capacidade de servir como âncora do projeto.

Cliente inicial sugerido:

- Grupo Raízen.

---

## 6. Créditos Orizon

Os créditos são a moeda de acesso à metodologia Kaizen, diagnósticos, projetos e serviços de evolução operacional.

### 6.1 Fórmula base

```text
CreditosTotais = CreditosCompra + CreditosEngajamento + CreditosCompartilhamento
```

### 6.2 Créditos por compra

```text
CreditosCompra = ValorCompra × MultiplicadorCategoria
```

Multiplicadores sugeridos:

| Categoria | Multiplicador |
|---|---:|
| Foundation | 1,00 |
| Flow | 1,20 |
| Prime | 1,50 |
| Legacy | 2,00 |

### 6.3 Créditos por engajamento

| Evento | Créditos |
|---|---:|
| Campo instalado | 500 |
| Diagnóstico concluído | 300 |
| Resultado compartilhado | 300 |
| Dia de campo | 200 |
| Treinamento técnico | 100 |
| Reunião executiva com suprimentos/diretoria | 100 |

---

## 7. Score Kaizen — KS

O Kaizen Score mede a evolução operacional do cliente.

### 7.1 Fórmula

```text
KS = PontosDiagnosticos + PontosProjetos + PontosResultados + PontosValidacoes + PontosReplicacao
```

### 7.2 Pontuação sugerida

| Evento | Pontos KS |
|---|---:|
| Diagnóstico realizado | 100 |
| Plano de ação aprovado | 150 |
| Projeto implantado | 150 |
| Resultado positivo | 200 |
| ROI validado | 200 |
| Validação estatística | 250 |
| Replicação em outra área/unidade | 300 |
| Benchmark ou vitrine técnica | 400 |

### 7.3 Conversão KS para nível Kaizen

| KS acumulado | Nível Kaizen |
|---:|---|
| 0 a 99 | K0 |
| 100 a 249 | K1 |
| 250 a 499 | K2 |
| 500 a 749 | K3 |
| 750 a 999 | K4 |
| ≥ 1000 | K5 |

---

## 8. OES — Orizon Evolution Score

O OES mede a qualidade operacional do projeto em escala de 0 a 100.

### 8.1 Fórmula

```text
OES = (Tecnico × 0,35)
    + (Operacional × 0,25)
    + (Economico × 0,30)
    + (Sustentabilidade × 0,10)
```

### 8.2 Pilares

| Pilar | Peso | Exemplos de indicadores |
|---|---:|---|
| Técnico | 35% | Perfilhamento, raiz, vigor, sanidade, desenvolvimento |
| Operacional | 25% | Janela correta, uniformidade de aplicação, qualidade operacional |
| Econômico | 30% | ROI, TCH, ATR, ganho líquido |
| Sustentabilidade | 10% | Uso de biológicos, redução química, eficiência nutricional |

---

## 9. KGI — Kaizen Growth Index

Mede a evolução do cliente na jornada.

```text
KGI = OES_Atual - OES_Inicial
```

Exemplo:

```text
OES inicial = 58
OES atual = 82
KGI = 24 pontos
```

---

## 10. ROI e Valor Gerado

### 10.1 Receita incremental por hectare

```text
ReceitaIncrementalHa = GanhoTCH × PrecoToneladaCana
```

### 10.2 Ganho líquido por hectare

```text
GanhoLiquidoHa = ReceitaIncrementalHa - CustoProjetoHa
```

### 10.3 ROI

```text
ROI = GanhoLiquidoHa / CustoProjetoHa
```

### 10.4 ROI percentual

```text
ROI_% = ROI × 100
```

### 10.5 Valor Gerado pelo Projeto

```text
ValorGeradoProjeto = GanhoLiquidoHa × AreaProjetoHa
```

### 10.6 VGO — Valor Gerado pelo Orizon

Indicador executivo principal da plataforma.

```text
VGO = Σ ValorGeradoProjetoValidado
```

---

## 11. Modelo de dados para app SaaS

### 11.1 Entidades principais

- Users
- Organizations
- Clients
- ClientUnits
- Products
- ProductPortfolio
- CustomerProductFit
- OrizonClassification
- KaizenJourney
- Diagnostics
- Projects
- ProjectMetrics
- CreditsLedger
- Interactions
- Attachments
- Dashboards

---

## 12. Estrutura de banco de dados sugerida

### 12.1 organizations

```sql
id UUID PRIMARY KEY
name TEXT NOT NULL
created_at TIMESTAMP
updated_at TIMESTAMP
```

### 12.2 users

```sql
id UUID PRIMARY KEY
organization_id UUID REFERENCES organizations(id)
name TEXT NOT NULL
email TEXT UNIQUE NOT NULL
role TEXT CHECK (role IN ('admin','executive','dtm','consultant','viewer'))
created_at TIMESTAMP
updated_at TIMESTAMP
```

### 12.3 clients

```sql
id UUID PRIMARY KEY
organization_id UUID REFERENCES organizations(id)
name TEXT NOT NULL
group_name TEXT
state TEXT
region TEXT
status TEXT DEFAULT 'active'
strategic_notes TEXT
created_at TIMESTAMP
updated_at TIMESTAMP
```

### 12.4 client_units

```sql
id UUID PRIMARY KEY
client_id UUID REFERENCES clients(id)
name TEXT NOT NULL
city TEXT
state TEXT
area_total_ha NUMERIC
cana_planta_ha NUMERIC
cana_soca_ha NUMERIC
priority_original TEXT
current_situation TEXT
proposed_action TEXT
created_at TIMESTAMP
updated_at TIMESTAMP
```

### 12.5 orizon_scores

```sql
id UUID PRIMARY KEY
client_unit_id UUID REFERENCES client_units(id)
area_score NUMERIC
validation_score NUMERIC
commercial_access_score NUMERIC
portfolio_score NUMERIC
strategic_influence_score NUMERIC
opi NUMERIC
category TEXT CHECK (category IN ('Foundation','Flow','Prime','Legacy'))
is_legacy_anchor BOOLEAN DEFAULT FALSE
icp_class TEXT CHECK (icp_class IN ('A','B','C'))
created_at TIMESTAMP
updated_at TIMESTAMP
```

### 12.6 kaizen_journeys

```sql
id UUID PRIMARY KEY
client_unit_id UUID REFERENCES client_units(id)
kaizen_score NUMERIC DEFAULT 0
kaizen_level TEXT DEFAULT 'K0'
oes_initial NUMERIC
oes_current NUMERIC
kgi NUMERIC
started_at TIMESTAMP
updated_at TIMESTAMP
```

### 12.7 products

```sql
id UUID PRIMARY KEY
name TEXT NOT NULL
category TEXT
margin_level TEXT CHECK (margin_level IN ('high','medium','low'))
positioning TEXT
active BOOLEAN DEFAULT TRUE
created_at TIMESTAMP
updated_at TIMESTAMP
```

Produtos iniciais:

| Produto | Tipo | Observação |
|---|---|---|
| Auras | Bioinsumo | Alta margem, eixo estratégico |
| Auba | Bioinsumo | Alta margem, eixo estratégico |
| Tritter | Bioinsumo | Alta margem, eixo estratégico |
| Aufix | Bioinsumo | Forte em B2B |
| Artefato | Bioinsumo/posicionamento técnico | Forte em B2B |
| Bovettus | Entomopatogênico | Margem baixa, usar estrategicamente |
| Mettus | Entomopatogênico | Margem baixa, usar estrategicamente |
| Nerut | Nematologia/soqueira | Complementar a Auras |

### 12.8 customer_product_fit

```sql
id UUID PRIMARY KEY
client_unit_id UUID REFERENCES client_units(id)
product_id UUID REFERENCES products(id)
fit_status TEXT CHECK (fit_status IN ('not_applicable','opportunity','protocol','validated','commercial','blocked'))
notes TEXT
created_at TIMESTAMP
updated_at TIMESTAMP
```

### 12.9 diagnostics

```sql
id UUID PRIMARY KEY
client_unit_id UUID REFERENCES client_units(id)
title TEXT NOT NULL
diagnostic_type TEXT
status TEXT CHECK (status IN ('planned','in_progress','completed','validated'))
identified_bottlenecks TEXT
estimated_impact_tch NUMERIC
estimated_impact_value NUMERIC
credits_cost NUMERIC
created_by UUID REFERENCES users(id)
created_at TIMESTAMP
updated_at TIMESTAMP
```

### 12.10 projects

```sql
id UUID PRIMARY KEY
client_unit_id UUID REFERENCES client_units(id)
diagnostic_id UUID REFERENCES diagnostics(id)
title TEXT NOT NULL
project_type TEXT
status TEXT CHECK (status IN ('planned','approved','in_progress','completed','validated','cancelled'))
area_ha NUMERIC
start_date DATE
end_date DATE
credits_cost NUMERIC
notes TEXT
created_at TIMESTAMP
updated_at TIMESTAMP
```

### 12.11 project_products

```sql
id UUID PRIMARY KEY
project_id UUID REFERENCES projects(id)
product_id UUID REFERENCES products(id)
dose TEXT
application_stage TEXT
notes TEXT
```

### 12.12 project_metrics

```sql
id UUID PRIMARY KEY
project_id UUID REFERENCES projects(id)
tch_standard NUMERIC
tch_treatment NUMERIC
gain_tch NUMERIC
price_per_ton NUMERIC
revenue_incremental_ha NUMERIC
cost_project_ha NUMERIC
gain_net_ha NUMERIC
roi NUMERIC
roi_percent NUMERIC
area_ha NUMERIC
value_generated NUMERIC
technical_score NUMERIC
operational_score NUMERIC
economic_score NUMERIC
sustainability_score NUMERIC
oes NUMERIC
created_at TIMESTAMP
updated_at TIMESTAMP
```

### 12.13 credits_ledger

```sql
id UUID PRIMARY KEY
client_unit_id UUID REFERENCES client_units(id)
event_type TEXT
source TEXT
amount NUMERIC
movement TEXT CHECK (movement IN ('credit','debit'))
description TEXT
related_project_id UUID REFERENCES projects(id)
created_at TIMESTAMP
```

### 12.14 interactions

```sql
id UUID PRIMARY KEY
client_unit_id UUID REFERENCES client_units(id)
interaction_type TEXT
interaction_date DATE
participants TEXT
summary TEXT
next_step TEXT
created_by UUID REFERENCES users(id)
created_at TIMESTAMP
updated_at TIMESTAMP
```

---

## 13. Regras automáticas do sistema

### 13.1 Cálculo automático da categoria

```typescript
function getOrizonCategory(opi: number): 'Foundation' | 'Flow' | 'Prime' | 'Legacy' {
  if (opi >= 90) return 'Legacy';
  if (opi >= 70) return 'Prime';
  if (opi >= 50) return 'Flow';
  return 'Foundation';
}
```

### 13.2 Cálculo automático do nível Kaizen

```typescript
function getKaizenLevel(ks: number): 'K0' | 'K1' | 'K2' | 'K3' | 'K4' | 'K5' {
  if (ks >= 1000) return 'K5';
  if (ks >= 750) return 'K4';
  if (ks >= 500) return 'K3';
  if (ks >= 250) return 'K2';
  if (ks >= 100) return 'K1';
  return 'K0';
}
```

### 13.3 Cálculo do OPI

```typescript
function calculateOPI(input: {
  areaScore: number;
  validationScore: number;
  commercialAccessScore: number;
  portfolioScore: number;
  strategicInfluenceScore: number;
}): number {
  return (
    input.areaScore * 0.30 +
    input.validationScore * 0.25 +
    input.commercialAccessScore * 0.20 +
    input.portfolioScore * 0.15 +
    input.strategicInfluenceScore * 0.10
  );
}
```

### 13.4 Cálculo do OES

```typescript
function calculateOES(input: {
  technical: number;
  operational: number;
  economic: number;
  sustainability: number;
}): number {
  return (
    input.technical * 0.35 +
    input.operational * 0.25 +
    input.economic * 0.30 +
    input.sustainability * 0.10
  );
}
```

### 13.5 Cálculo de ROI

```typescript
function calculateROI(input: {
  tchGain: number;
  pricePerTon: number;
  costPerHa: number;
}): {
  revenueIncrementalHa: number;
  gainNetHa: number;
  roi: number;
  roiPercent: number;
} {
  const revenueIncrementalHa = input.tchGain * input.pricePerTon;
  const gainNetHa = revenueIncrementalHa - input.costPerHa;
  const roi = gainNetHa / input.costPerHa;
  return {
    revenueIncrementalHa,
    gainNetHa,
    roi,
    roiPercent: roi * 100,
  };
}
```

---

## 14. Clientes iniciais cadastrados

Base inicial recebida pelo usuário. Todos devem iniciar com Kaizen K0.

| Cliente | Área ha | Cana planta | Cana soca | Prioridade original | Categoria Orizon sugerida | Kaizen inicial |
|---|---:|---:|---:|---|---|---|
| ALCOESTE | 33.000 | 4.950 | 28.050 | Baixa | Foundation | K0 |
| BP BIOENERGY | 200.000 | 30.000 | 170.000 | Média | Legacy | K0 |
| GRUPO ARALCO | 30.000 | 4.500 | 25.500 | Alta | Flow | K0 |
| GRUPO CLEALCO | 40.000 | 6.000 | 34.000 | Alta | Flow | K0 |
| Grupo CMAA | 120.000 | 18.000 | 102.000 | Alta | Prime | K0 |
| GRUPO CMNP | 50.000 | 7.500 | 42.500 | Alta | Flow | K0 |
| GRUPO COCAL | 140.000 | 21.000 | 119.000 | Alta | Prime | K0 |
| GRUPO COFCO | 90.000 | 13.500 | 76.500 | Alta | Prime | K0 |
| GRUPO COLOMBO | 60.000 | 9.000 | 51.000 | Média | Flow | K0 |
| GRUPO CORURIPE | 180.000 | 27.000 | 153.000 | Alta | Legacy | K0 |
| GRUPO ITAJOBI | 20.000 | 3.000 | 17.000 | Baixa | Foundation | K0 |
| GRUPO PEDRA | 95.000 | 14.250 | 80.750 | Alta | Prime | K0 |
| GRUPO SANTA TEREZINHA | 130.000 | 19.500 | 110.500 | Baixa | Prime | K0 |
| GRUPO TEREOS | 190.000 | 28.500 | 161.500 | Alta | Legacy | K0 |
| GRUPO VITERRA | 50.000 | 7.500 | 42.500 | Alta | Flow | K0 |
| USINA ALTA MOGIANA | 70.000 | 10.500 | 59.500 | Alta | Prime | K0 |
| USINA BATATAIS | 67.000 | 10.050 | 56.950 | Alta | Flow | K0 |
| USINA BEVAP | 32.000 | 4.800 | 27.200 | Baixa | Foundation | K0 |
| USINA BRANCO PERES | 30.000 | 4.500 | 25.500 | Alta | Prime | K0 |
| USINA CAFEALCOOL | 20.000 | 3.000 | 17.000 | Média | Foundation | K0 |
| USINA CALIFÓRNIA | 20.000 | 3.000 | 17.000 | Alta | Flow | K0 |
| USINA CERRADÃO | 80.000 | 12.000 | 68.000 | Baixa | Flow | K0 |
| USINA DA MATA | 50.000 | 7.500 | 42.500 | Baixa | Foundation | K0 |
| USINA DELTA | 120.000 | 18.000 | 102.000 | Média | Flow | K0 |
| USINA ESTIVA | 30.000 | 4.500 | 25.500 | Média | Flow | K0 |
| USINA LINS | 40.000 | 6.000 | 50.000 | Alta | Flow | K0 |
| USINA PIRASSUNUNGA 51 | 9.000 | 1.350 | 7.650 | Baixa | Foundation | K0 |
| USINA PITANGUEIRAS | 20.000 | 3.000 | 17.000 | Alta | Flow | K0 |
| USINA SANTA ADELIA | 50.000 | 7.500 | 42.500 | Alta | Prime | K0 |
| USINA SÃO DOMINGOS | 20.000 | 3.000 | 17.000 | Alta | Flow | K0 |
| USINA SÃO FRANCISCO | 20.000 | 3.000 | 17.000 | Baixa | Foundation | K0 |
| USINA SÃO MANOEL | 60.000 | 9.000 | 51.000 | Baixa | Foundation | K0 |
| USINA SÃO LUIZ | 35.000 | 5.250 | 29.750 | Baixa | Foundation | K0 |
| USINA SÃO LUIS/FERRARI | 50.000 | 7.500 | 42.500 | Baixa | Foundation | K0 |
| GRUPO VALE DO VERDÃO | 155.000 | 23.250 | 131.750 | Baixa | Foundation | K0 |
| GRUPO RAÍZEN | 1.000.000 | 150.000 | 850.000 | Alta | Legacy Anchor | K0 |
| USINA VIRALCOOL | 40.000 | 6.000 | 34.000 | Baixa | Foundation | K0 |
| USINA SANTA ISABEL | 90.000 | 13.500 | 76.500 | Baixa | Foundation | K0 |
| USINA SONORA | 30.000 | 4.500 | 25.500 | Baixa | Foundation | K0 |
| USINA USIBAN | 20.000 | 3.000 | 17.000 | Média | Flow | K0 |
| USINA CERRADINHO BIO | 115.000 | 17.250 | 97.750 | Baixa | Foundation | K0 |
| USINA ALCON | 15.000 | 2.250 | 12.750 | Alta | Flow | K0 |
| USINA IPIRANGA | 200.000 | 30.000 | 170.000 | Média | Legacy | K0 |
| USINA UBERABA | 40.000 | 6.000 | 34.000 | Baixa | Foundation | K0 |

---

## 15. Dashboard executivo — requisitos

### 15.1 Cards principais

- Área total cadastrada;
- Área cana-planta;
- Área cana-soca;
- Número de clientes;
- Distribuição por categoria Orizon;
- Distribuição por nível Kaizen;
- Créditos gerados;
- Créditos consumidos;
- Valor Gerado Orizon — VGO;
- Potencial total de receita;
- Potencial por produto.

### 15.2 Gráficos obrigatórios

1. Distribuição de clientes por categoria Orizon;
2. Distribuição de clientes por Kaizen K0-K5;
3. Área total por categoria;
4. Potencial financeiro por categoria;
5. Produtos mais recorrentes por oportunidade;
6. Pipeline de projetos;
7. ROI médio por projeto;
8. VGO acumulado por cliente;
9. Matriz Potencial x Abertura;
10. Ranking de clientes por OPI.

### 15.3 Medidores

- OPI Gauge;
- OES Gauge;
- KGI Gauge;
- ROI Gauge;
- Crédito disponível Gauge;
- Potencial de conversão Gauge.

---

## 16. Telas do app web SaaS

### 16.1 Login

- E-mail e senha;
- Recuperação de senha;
- Controle por organização.

### 16.2 Home executivo

- KPIs gerais;
- gráficos principais;
- ranking de clientes;
- alertas de clientes críticos.

### 16.3 Clientes

- Lista filtrável;
- filtros por categoria, OPI, Kaizen, área, prioridade original, produto, status;
- botão para cadastrar cliente.

### 16.4 Perfil do cliente

Abas:

- Visão geral;
- Unidades;
- OPI e categoria;
- Kaizen;
- Diagnósticos;
- Projetos;
- Produtos;
- Créditos;
- Interações;
- Resultados;
- Arquivos.

### 16.5 Diagnósticos

- Cadastro de diagnóstico;
- gargalos identificados;
- impacto estimado;
- créditos necessários;
- status.

### 16.6 Projetos

- Cadastro de projetos;
- área;
- produtos;
- métricas de produtividade;
- ROI;
- OES;
- status.

### 16.7 Créditos

- Extrato de créditos;
- entradas;
- saídas;
- consumo por diagnóstico/projeto;
- saldo.

### 16.8 Dashboard Kaizen

- Clientes por nível K;
- evolução de KS;
- evolução de OES;
- ranking KGI;
- clientes próximos de mudança de nível.

### 16.9 Configurações

- Produtos;
- pesos do OPI;
- pesos do OES;
- regras de crédito;
- usuários;
- permissões.

---

## 17. Stack técnica sugerida

### Frontend

- Next.js;
- TypeScript;
- Tailwind CSS;
- shadcn/ui;
- Recharts ou Tremor para gráficos;
- React Hook Form;
- Zod para validação.

### Backend

- Supabase ou PostgreSQL;
- Prisma ORM ou Supabase client;
- Row Level Security se usar Supabase;
- Auth integrada.

### Deploy

- Vercel para frontend;
- Supabase para banco e autenticação;
- GitHub para versionamento.

---

## 18. Prompt inicial recomendado para Codex

```text
Você está desenvolvendo o Orizon, uma plataforma SaaS de evolução operacional para clientes agrícolas do setor sucroenergético.

Objetivo: criar um app web com Next.js, TypeScript, Tailwind, shadcn/ui e banco PostgreSQL/Supabase.

A plataforma deve cadastrar clientes, unidades, áreas agrícolas, produtos, diagnósticos, projetos, créditos, jornada Kaizen e indicadores executivos.

Implementar inicialmente:

1. Estrutura de banco de dados conforme o arquivo ORIZON_CODEX_HANDOFF_V2.md.
2. CRUD de clientes e unidades.
3. Cálculo automático de OPI.
4. Classificação automática Foundation, Flow, Prime e Legacy.
5. Jornada Kaizen iniciando sempre em K0.
6. Cálculo de Kaizen Score e nível K0-K5.
7. Cálculo de OES, KGI e ROI.
8. Dashboard executivo com cards e gráficos.
9. Tela de detalhe do cliente com abas: visão geral, OPI, Kaizen, diagnósticos, projetos, créditos e produtos.
10. Seed inicial com os clientes listados neste documento.

Priorizar arquitetura limpa, componentes reutilizáveis, validação com Zod e funções matemáticas isoladas em /lib/calculations.
```

---

## 19. Estrutura de pastas sugerida

```text
orizon-app/
├── app/
│   ├── dashboard/
│   ├── clients/
│   ├── diagnostics/
│   ├── projects/
│   ├── credits/
│   ├── settings/
│   └── layout.tsx
├── components/
│   ├── charts/
│   ├── dashboards/
│   ├── forms/
│   ├── gauges/
│   ├── layout/
│   └── ui/
├── lib/
│   ├── calculations/
│   │   ├── opi.ts
│   │   ├── oes.ts
│   │   ├── kaizen.ts
│   │   ├── roi.ts
│   │   └── credits.ts
│   ├── db/
│   ├── validations/
│   └── utils.ts
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── types/
│   ├── client.ts
│   ├── kaizen.ts
│   ├── project.ts
│   └── scores.ts
└── README.md
```

---

## 20. Prioridades de desenvolvimento

### Sprint 1 — Fundação

- Criar projeto;
- configurar UI;
- banco de dados;
- autenticação;
- seed de clientes;
- CRUD clientes/unidades.

### Sprint 2 — Motor matemático

- Funções OPI;
- categoria Orizon automática;
- Kaizen Score;
- OES;
- ROI;
- créditos.

### Sprint 3 — Dashboard

- Cards executivos;
- gráficos;
- filtros;
- rankings.

### Sprint 4 — Diagnósticos e projetos

- Cadastro de diagnósticos;
- cadastro de projetos;
- vincular produtos;
- gerar ROI e OES por projeto.

### Sprint 5 — Camada executiva

- Relatórios;
- exportação CSV/Excel;
- simulações;
- alertas;
- VGO acumulado.

---

## 21. Critérios de sucesso da versão 1.0

A versão 1.0 estará funcional quando permitir:

1. Cadastrar cliente e unidade;
2. Calcular OPI automaticamente;
3. Classificar cliente em Foundation, Flow, Prime ou Legacy;
4. Iniciar todos os clientes em K0;
5. Criar diagnóstico e avançar Kaizen;
6. Criar projeto e calcular ROI;
7. Calcular OES e KGI;
8. Registrar créditos;
9. Visualizar dashboard executivo;
10. Exportar base para Excel/CSV.

---

## 22. Diretriz estratégica final

O Orizon deve ser tratado como uma plataforma que mede e organiza evolução operacional, não como um CRM de vendas.

A lógica central é:

```text
Cliente → Unidade → Área → Potencial → Categoria Orizon → Créditos → Diagnóstico Kaizen → Projeto → Resultado → Valor Gerado
```

A métrica mais importante do projeto deve ser:

```text
Valor Gerado pelo Orizon = soma dos ganhos econômicos comprovados nos projetos validados
```

