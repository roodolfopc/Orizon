# Arquitetura de Microagentes ORIZON

## Objetivo

Transformar o ORIZON em uma operacao assistida por camadas: cada agente trabalha uma funcao especifica do Excel, do CRM ou dos sistemas futuros, enquanto o Maestro ORIZON coordena o caminho cliente a cliente.

## Camadas

| Agente | Sistema futuro | Entrada | Saida |
| --- | --- | --- | --- |
| Maestro ORIZON | ORIZON OS | Todas as camadas | Caminho do cliente e recomendacao final |
| BI / Score Agent | Dashboard BI | Excel, CRM, pipeline, score | KPIs, ranking, niveis, alertas |
| CRM / Conta Agent | CRM | Carteira, responsaveis, status | Ficha viva por cliente/usina |
| Tecnico / Diagnostico Agent | TCH + NOOA Tecnica | Situacao atual, parceiro, trilha | Diagnostico, gargalos e etapa assistida |
| Credito / Politica Agent | Politica ORIZON | Produtos, pesos, cotacao, compra | Budget tecnico-operacional recomendado |
| Aprovacao / Assinatura Agent | Assinatura digital | Plano tecnico, alçada, anexos | Aprovado, pendente, bloqueado |
| GIS / Areas Agent | Mapas / GIS Agricola | Grupo, usina, unidade, area | Camadas territoriais e oportunidades |
| Follow-up / Cadencia Agent | Automacao | Proxima acao, prazos, comites | Alertas e tarefas recorrentes |
| Relatorio Executivo Agent | Evolution Report | Score, credito, evidencias | Relatorio mensal/trimestral |

## Fluxo Cliente a Cliente

```text
Mapear -> Diagnosticar -> Pontuar -> Aprovar -> Executar -> Medir -> Expandir
```

1. CRM cria ou atualiza a conta.
2. BI calcula score, nivel, fila e potencial.
3. Tecnico classifica Diagnosticar, Corrigir ou Evoluir.
4. Credito calcula budget recomendado sem virar desconto.
5. Maestro define a proxima decisao.
6. Aprovacao valida plano tecnico e assinatura.
7. Follow-up garante cadencia.
8. GIS entra quando houver area/unidade mapeada.
9. Relatorio Executivo consolida a narrativa.

## Integracoes Futuras

- Dashboard BI deve consumir JSON/API com carteira, score, credito, pipeline e Evolution Report.
- CRM deve guardar grupo, usina, responsavel, etapa, plano tecnico e historico.
- Assinatura e aprovacao deve bloquear budget sem plano tecnico, marco e alcada.
- Mapas / GIS deve conectar grupo, usina, unidade agricola e area evoluida ORIZON.
- Follow-up deve disparar cadencia semanal, quinzenal, mensal e trimestral.

## Regra De Protecao

Credito ORIZON continua sendo budget tecnico-operacional. Nenhum agente deve apresentar credito como desconto, rebate, bonificacao automatica ou incentivo comercial isolado.
