# Governanca de Dados ORIZON

## Objetivo

Estruturar a plataforma ORIZON em camadas de acesso para preservar dados sensiveis, permitir operacao assistida e manter a experiencia inicial aberta somente para a visao do programa.

## Perfis

| Perfil | Acesso | Dados visiveis |
| --- | --- | --- |
| Visitante | Publico | Conceito ORIZON, Diagnosticar/Corrigir/Evoluir, microagentes, parceiros e trilhas sem carteira. |
| Cliente externo | Restrito ao proprio cadastro | Perfil do cliente selecionado, etapa assistida, plano tecnico, relatorio executivo sanitizado e proximos marcos. |
| Administrador | Total | Carteira completa, scores, rankings, credito tecnico-operacional, governanca, BI, CRM, GIS, follow-up e Evolution Report. |
| Parceiro TCH | Parceiro tecnico | Modelos de diagnostico, entregaveis, laudos e escopo assistido sem ranking, credito ou informacoes comerciais sensiveis. |
| Parceiro Mais Maquinas | Parceiro estrutural | Catalogo de equipamentos, criterios de elegibilidade e trilha de uso de pontos/coparticipacao sem dados comerciais sensiveis. |

Administradores iniciais definidos na v1: Rodolfo e Marcia.

## Hierarquia De Dados

| Camada | Arquivo gerado | Finalidade |
| --- | --- | --- |
| Publica | `outputs/site-orizon/data/public-summary.json` | Carrega na primeira visita. Nao contem carteira, credito, ranking ou informacao sensivel. |
| Cliente | `outputs/site-orizon/data/clients/{cliente}.json` | Payload sanitizado por cliente. Remove score detalhado, credito, fila, ranking e decisao comercial sensivel. |
| Parceiro | `outputs/site-orizon/data/partners/{parceiro}.json` | Payload operacional por parceiro. Mostra somente entregaveis e clientes atribuidos de forma sanitizada. |
| Admin | `outputs/site-orizon/data/orizon-data.json` | Base completa para Rodolfo/Marcia e diretoria. Deve ficar protegida por autenticacao real na producao. |

## Regras De Exposicao

- Visitante sempre entra pela pagina publica com a visao do programa e conceito ORIZON.
- Cliente externo nunca ve a carteira completa.
- Cliente externo nunca ve dados de outro cliente.
- Parceiro nao acessa credito, ranking, score detalhado ou politica comercial individual.
- Credito deve ser tratado como budget tecnico-operacional, nao desconto automatico.
- Pontos e coparticipacao da trilha Mais Maquinas dependem de evidencia tecnica e aprovacao.
- Dados sensiveis devem ser liberados apenas apos autenticacao e autorizacao por perfil.

## Subagentes Por Camada

| Subagente | Camada | Responsabilidade |
| --- | --- | --- |
| Maestro ORIZON | Admin/Cliente | Compor o caminho assistido do cliente e consolidar recomendacao final. |
| BI / Score Agent | Admin | Score, nivel, ranking, fila, alertas e visao executiva. |
| CRM / Conta Agent | Admin/Cliente | Ficha cliente a cliente, responsavel, etapa, status e proxima acao sanitizada. |
| Tecnico / Diagnostico Agent | Publico/Cliente/Parceiro/Admin | Diagnosticar, Corrigir, Evoluir e preparar modelos TCH. |
| Credito / Politica Agent | Admin | Teto, elegibilidade, budget tecnico-operacional e restricoes B2B. |
| Aprovacao / Assinatura Agent | Admin | Alcada, status de governanca, aprovacao e assinatura. |
| GIS / Areas Agent | Admin/Cliente sanitizado | Camadas territoriais, areas evoluidas e status operacional. |
| Follow-up Agent | Admin/Cliente | Cadencia semanal, quinzenal, mensal e trimestral. |
| Relatorio Executivo Agent | Admin/Cliente sanitizado | Evolution Report para diretoria ou relatorio externo controlado. |

## Progressao Recomendada De Parceiros

1. TCH inicia a camada de diagnostico com auditorias, laudos e plano de correcao assistida.
2. ORIZON mede maturidade, score, evidencia e governanca do plano.
3. Mais Maquinas entra como opcao futura para evolucao estrutural por equipamentos, implementos e sistemas, usando pontos/coparticipacao quando aprovado.

O parceiro nao fica preso a uma trilha unica: o sistema sugere a progressao tecnica, mas preserva opcao de escolha conforme maturidade, necessidade operacional e governanca.

## Observacao De Seguranca

A v1 estatica ja separa os arquivos carregados por perfil e evita expor a carteira completa na primeira visita. Em producao, a protecao definitiva deve ser feita no servidor/API, com login, autorizacao por papel, trilha de auditoria e bloqueio fisico do payload admin para usuarios nao autorizados.
