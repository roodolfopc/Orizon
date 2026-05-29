# Plano de Sistemas e Plugins ORIZON

## Objetivo

Implantar uma camada simples, governada e escalavel de sistemas para operar o ORIZON como plataforma de evolucao operacional agricola, evitando que o programa seja tratado como desconto, rebate ou acao comercial isolada.

Premissa obrigatoria: o ORIZON deve ser 100% assistido em todos os casos. Cada cliente deve evoluir verticalmente por maturidade operacional, seguindo a mentalidade Diagnosticar, Corrigir e Evoluir.

O desenho recomendado considera cinco blocos:

1. Dashboard BI
2. CRM de contas estrategicas
3. Assinatura e aprovacao
4. Mapas / GIS agricola
5. Automacao de follow-up

## Ordem recomendada de implantacao

| Fase | Sistema / Plugin | Prioridade | Por que vem nessa ordem |
| --- | --- | --- | --- |
| 1 | Dashboard BI | Imediata | Da visibilidade executiva ao potencial, credito e pipeline |
| 2 | CRM | Imediata | Organiza cliente, responsavel, governanca e plano de conta |
| 3 | Assinatura e aprovacao | Imediata | Controla liberacao de budget tecnico-operacional |
| 4 | Mapas / GIS agricola | Segunda onda | Evolui a leitura por area, unidade e expansao territorial |
| 5 | Automacao de follow-up | Segunda onda | Garante cadencia de revisoes, comites e acoes tecnicas |

## 1. Dashboard BI

### Papel no ORIZON

O Dashboard BI deve ser a camada executiva do programa. Ele transforma a carteira, os produtos, os pesos ORIZON e o credito elegivel em indicadores de decisao.

Tambem deve mostrar em qual etapa assistida cada cliente esta: Diagnosticar, Corrigir ou Evoluir.

### Plugin ou modulo necessario

- Conector de Excel/planilhas
- Conector de CRM
- Painel executivo com filtros
- Atualizacao agendada
- Controle de acesso por perfil

### Passo a passo

1. Definir a base oficial do ORIZON.
   - Carteira de clientes/usinas
   - Produtos e pesos ORIZON
   - Volumes por produto
   - Credito recomendado
   - Nivel START/FLOW/PRIME/LEGACY
   - Responsavel comercial/tecnico

2. Padronizar os campos obrigatorios.
   - Cliente/usina
   - Grupo economico
   - Area potencial
   - Potencial financeiro
   - Produto
   - Unidade
   - Volume
   - Dose tecnica
   - Peso ORIZON
   - Credito unitario
   - Credito total
   - Status do plano tecnico
   - Etapa assistida atual
   - Proxima evolucao vertical

3. Criar os paineis principais.
   - Visao executiva: potencial, credito elegivel, clientes por nivel e pipeline
   - Visao por cliente: score, trilha, produtos, credito e proximas acoes
   - Visao por produto: mix, elegibilidade, teto e produtos B2B bloqueados
   - Visao por responsavel: carteira, prioridade, acoes abertas e conversao
   - Visao mensal: pipeline, comites, planos aprovados e budget comprometido

4. Definir indicadores de diretoria.
   - Potencial ORIZON total
   - Credito operacional recomendado
   - Credito aprovado
   - Credito em analise
   - Credito bloqueado por B2B
   - Clientes por nivel
   - Evolucao de clientes entre niveis
   - Areas evoluidas ORIZON
   - Taxa de planos tecnicos aprovados

5. Implantar rotina de atualizacao.
   - Atualizacao semanal para operacao
   - Fechamento mensal para diretoria
   - Trava de edicao para campos criticos
   - Log de alteracao de pesos e regras

### Resultado esperado

A diretoria passa a enxergar o ORIZON como uma carteira governada de evolucao operacional, com potencial, risco, budget e pipeline em tempo quase real.

## 2. CRM de contas estrategicas

### Papel no ORIZON

O CRM deve ser o sistema de relacionamento e governanca por usina. Ele registra o historico da conta, o estagio de adocao, o plano tecnico, os responsaveis e os proximos passos.

O CRM deve impedir que o ORIZON vire uma agenda solta. Cada conta precisa ter dono, etapa assistida e proxima acao tecnica.

### Plugin ou modulo necessario

- Cadastro de contas e grupos economicos
- Pipeline por oportunidade/projeto
- Campos customizados
- Tarefas e atividades
- Anexos de plano tecnico
- Integracao com BI

### Passo a passo

1. Criar estrutura de contas.
   - Grupo economico
   - Unidade/usina
   - Contatos-chave
   - Responsavel comercial
   - Responsavel tecnico
   - Parceiro indicado

2. Criar campos ORIZON no CRM.
   - Nivel ORIZON
   - Score de adocao
   - Estagio de maturidade
   - Potencial ORIZON
   - Credito recomendado
   - Credito aprovado
   - Tecnologia de entrada
   - Trilha de evolucao
   - Status do plano tecnico
   - Proximo comite
   - Etapa assistida: Diagnosticar, Corrigir ou Evoluir

3. Criar pipeline especifico ORIZON.
   - Diagnostico pendente
   - Diagnostico realizado
   - Plano tecnico em construcao
   - Plano tecnico em aprovacao
   - Plano aprovado
   - Execucao em campo
   - Resultado mensurado
   - Expansao de conta

4. Definir regras de movimentacao.
   - Nenhuma conta entra em PRIME ou LEGACY sem plano tecnico
   - Nenhum credito e aprovado sem responsavel tecnico
   - Nenhum plano avanca sem proxima acao definida
   - Mudanca de nivel exige justificativa

5. Integrar CRM ao BI.
   - O CRM envia status, responsavel, pipeline e proximas acoes
   - O BI devolve indicadores de potencial, credito e conversao

### Resultado esperado

O ORIZON deixa de depender de planilhas isoladas e passa a operar como carteira de contas estrategicas, com dono, etapa, governanca e historico.

## 3. Assinatura e aprovacao

### Papel no ORIZON

O sistema de assinatura e aprovacao protege a empresa. Ele garante que credito operacional seja liberado apenas depois de plano tecnico aprovado.

O plano tecnico deve declarar explicitamente a etapa assistida que justifica a liberacao do budget operacional.

### Plugin ou modulo necessario

- Workflow de aprovacao
- Assinatura digital
- Trilha de auditoria
- Anexos obrigatorios
- Niveis de aprovacao
- Integracao com CRM

### Passo a passo

1. Criar modelo de plano tecnico ORIZON.
   - Cliente/usina
   - Nivel ORIZON
   - Diagnostico resumido
   - Produtos elegiveis
   - Volumes
   - Credito recomendado
   - Contrapartida tecnica
   - Indicadores esperados
   - Responsaveis
   - Prazo de acompanhamento

2. Definir alcadas de aprovacao.
   - START/FLOW: aprovacao comercial e tecnica
   - PRIME: aprovacao comercial, tecnica e gerencial
   - LEGACY: aprovacao executiva

3. Criar regras de bloqueio.
   - Produto B2B nao gera credito
   - Credito acima do teto unitario nao pode ser aprovado
   - Plano sem diagnostico nao avanca
   - Plano sem indicador de resultado nao avanca

4. Integrar aprovacao ao CRM.
   - Plano enviado muda status para "em aprovacao"
   - Plano aprovado libera execucao
   - Plano recusado exige justificativa
   - Plano assinado fica anexado na conta

5. Criar relatorio de auditoria.
   - Quem solicitou
   - Quem aprovou
   - Quando aprovou
   - Valor aprovado
   - Indicadores associados

### Resultado esperado

O credito ORIZON fica juridica e comercialmente protegido como budget tecnico-operacional, e nao como desconto automatico.

## 4. Mapas / GIS agricola

### Papel no ORIZON

O GIS deve entrar depois que BI, CRM e aprovacao estiverem funcionando. Ele melhora a leitura por territorio, area, unidade agricola, expansao e acompanhamento operacional.

No ORIZON, o mapa deve mostrar a evolucao vertical por area: areas em diagnostico, areas em correcao operacional e areas em evolucao estrutural.

### Plugin ou modulo necessario

- Mapa com camadas
- Cadastro de areas/unidades
- Importacao de arquivos geograficos
- Filtros por cliente, nivel e produto
- Integracao com BI ou CRM

### Passo a passo

1. Definir o nivel geografico minimo.
   - Grupo
   - Usina
   - Unidade agricola
   - Area evoluida ORIZON

2. Criar camadas prioritarias.
   - Clientes ORIZON
   - Nivel START/FLOW/PRIME/LEGACY
   - Areas em diagnostico
   - Areas com plano aprovado
   - Areas em acompanhamento
   - Areas com resultado mensurado

3. Conectar mapa ao cadastro de clientes.
   - Cada area deve estar vinculada a uma usina
   - Cada usina deve estar vinculada a um grupo economico
   - Cada area deve ter responsavel e status

4. Criar visualizacoes executivas.
   - Mapa de cobertura ORIZON
   - Mapa de expansao por nivel
   - Mapa de areas com parceiro TCH
   - Mapa de oportunidades para Mais Maquinas

5. Definir governanca de dados geograficos.
   - Quem cadastra area
   - Quem valida informacao
   - Quem atualiza status
   - Qual periodicidade de revisao

### Resultado esperado

O ORIZON ganha uma camada territorial e operacional, facilitando a expansao por usina, por grupo e por janela agricola.

## 5. Automacao de follow-up

### Papel no ORIZON

A automacao de follow-up garante cadencia. Ela evita que diagnosticos, planos, comites e revisoes fiquem dependentes da memoria individual do time.

Os alertas devem preservar a disciplina das tres etapas: diagnosticar no prazo, corrigir com plano aprovado e evoluir com evidencia tecnica.

### Plugin ou modulo necessario

- Lembretes automaticos
- Regras por etapa do pipeline
- Notificacoes por responsavel
- Agenda de comites
- Alertas de atraso
- Integracao com CRM

### Passo a passo

1. Definir gatilhos automaticos.
   - Diagnostico criado
   - Diagnostico pendente ha mais de 15 dias
   - Plano tecnico enviado para aprovacao
   - Plano aprovado
   - Execucao em campo iniciada
   - Resultado pendente
   - Comite mensal proximo

2. Criar alertas por perfil.
   - Comercial: proxima acao, proposta e reuniao
   - Tecnico: diagnostico, plano e validacao
   - Gestor: aprovacoes, atrasos e budget
   - Diretoria: fechamento mensal e pontos criticos

3. Criar cadencia padrao.
   - Semanal: tarefas abertas e clientes prioritarios
   - Quinzenal: planos em aprovacao e execucao
   - Mensal: comite de governanca ORIZON
   - Trimestral: revisao de nivel e maturidade

4. Definir mensagens padrao.
   - Alerta de plano sem acao
   - Alerta de credito pendente de aprovacao
   - Alerta de diagnostico vencido
   - Convocacao de comite
   - Solicitacao de evidencia tecnica

5. Medir eficiencia da cadencia.
   - Tarefas vencidas
   - Tempo medio por etapa
   - Planos aprovados no prazo
   - Clientes sem interacao recente
   - Comites realizados

### Resultado esperado

O programa ganha ritmo operacional, reduz esquecimento, melhora previsibilidade e sustenta a evolucao multi-ano.

## Recomendacao de aquisicao

### Comprar ou ativar agora

1. Dashboard BI
2. CRM de contas estrategicas
3. Assinatura e aprovacao

Esses tres blocos formam a espinha dorsal do ORIZON. Sem eles, o programa pode virar planilha, desconto informal ou promessa sem governanca.

### Comprar ou ativar na segunda onda

1. Mapas / GIS agricola
2. Automacao de follow-up

Esses blocos aumentam sofisticacao, escala e disciplina operacional. Eles devem entrar quando a base de dados e o fluxo de aprovacao ja estiverem minimamente estaveis.

## Criterios para escolher fornecedores

Antes de contratar qualquer sistema, validar:

1. Permite campos customizados ORIZON.
2. Integra com Excel, CRM ou API.
3. Tem controle de acesso por perfil.
4. Tem trilha de auditoria.
5. Exporta dados para BI.
6. Permite anexar plano tecnico.
7. Registra historico por cliente/usina.
8. Suporta aprovacao com alcadas.
9. Funciona bem para uso comercial e tecnico.
10. Nao transforma o credito ORIZON em cupom, desconto ou bonificacao automatica.

## Arquitetura minima recomendada

```text
Planilhas ORIZON / ERP
        |
        v
Dashboard BI <---- CRM de contas estrategicas
        |                    |
        |                    v
        |          Assinatura e aprovacao
        |                    |
        v                    v
Mapas / GIS agricola  Automacao de follow-up
```

## Decisao executiva sugerida

Aprovar a implantacao em duas ondas:

- Onda 1: BI, CRM e aprovacao para governar potencial, carteira, credito e planos tecnicos.
- Onda 2: GIS e automacao para dar escala territorial e cadencia operacional.

Essa sequencia preserva margem, melhora controle, fortalece a narrativa de parceria tecnica e reduz o risco de o ORIZON ser interpretado como politica comercial de desconto.
