# Sistema de Pontuacao e Credito ORIZON

## Objetivo

Estruturar uma regra matematica-comercial para calcular o credito ORIZON por produto de forma operacional, auditavel e saudavel para a empresa.

O credito nao deve ser um desconto linear sobre faturamento. Ele deve nascer da combinacao entre:

- volume comercializado em L ou Kg;
- dosagem agronomica do produto;
- peso ORIZON do produto;
- elegibilidade estrategica;
- teto absoluto de credito por L ou Kg.

## Premissas obrigatorias

1. O produto deve ser medido em L ou Kg.
2. A dosagem deve influenciar o credito.
3. O peso ORIZON deve influenciar o credito.
4. Nenhum produto pode gerar mais de R$ 10,00 de credito por L ou Kg.
5. Produtos B2B, ou seja, produtos com peso ORIZON igual a 1, nao entram na equacao de pontuacao.
6. O credito ORIZON continua sendo budget tecnico-operacional, nao desconto, rebate ou bonificacao comercial automatica.

## Campos da base de produtos

Cada produto deve ter, no minimo:

| Campo | Descricao |
| --- | --- |
| Produto | Nome comercial do produto |
| Unidade | L ou Kg |
| Volume | Volume vendido/contratado na unidade do produto |
| Dose | Dose tecnica recomendada por hectare, em L/ha ou Kg/ha |
| Dose Base Categoria | Dose media/referencia da categoria tecnica do produto |
| Peso ORIZON | Peso estrategico do produto no programa |
| Elegivel ORIZON | Regra automatica: Sim se peso > 1, Nao se peso = 1 |
| Credito Unitario | Credito calculado por L ou Kg |
| Credito Total | Volume x Credito Unitario |

## Logica conceitual

O modelo deve evitar duas distorcoes:

1. Produto de baixa relevancia estrategica gerar credito apenas por ter volume alto.
2. Produto de alta dose gerar credito excessivo por consumir muitos L/Kg por hectare.

Por isso, o credito unitario deve ser ponderado pelo peso ORIZON e corrigido pela dosagem.

Produtos com peso 1 sao considerados B2B/transacionais e recebem credito zero.

## Formula recomendada

### 1. Elegibilidade

```excel
=IF([@[Peso ORIZON]]>1,1,0)
```

Interpretacao:

- Peso ORIZON = 1: produto B2B, nao pontua.
- Peso ORIZON > 1: produto elegivel para pontuacao.

### 2. Fator Peso

```excel
=IF([@[Peso ORIZON]]>1,([@[Peso ORIZON]]-1)/(Peso_Maximo-1),0)
```

Onde `Peso_Maximo` e o maior peso definido na politica ORIZON.

Exemplo com peso maximo 5:

| Peso ORIZON | Fator Peso |
| --- | ---: |
| 1 | 0,00 |
| 2 | 0,25 |
| 3 | 0,50 |
| 4 | 0,75 |
| 5 | 1,00 |

Essa regra garante que produto B2B nao pontue e que produtos mais estrategicos gerem maior credito.

### 3. Fator Dose

```excel
=MAX(0.60,MIN(1.40,SQRT([@[Dose Base Categoria]]/[@Dose])))
```

Interpretacao:

- Se a dose do produto for menor que a dose base da categoria, o produto ganha fator maior.
- Se a dose for maior que a dose base, o fator diminui.
- O intervalo de 0,60 a 1,40 evita distorcoes extremas.

Essa regra reconhece que produtos de menor dose podem ter maior intensidade tecnologica por L/Kg, mas sem criar premio exagerado.

### 4. Credito Unitario

```excel
=IF([@[Peso ORIZON]]=1,0,MIN(10,Credito_Base*[@[Fator Peso]]*[@[Fator Dose]]))
```

Premissa recomendada:

```text
Credito_Base = R$ 10,00
```

Assim, o teto fisico da formula ja nasce em R$ 10,00 por L ou Kg.

### 5. Credito Total

```excel
=[@Volume]*[@[Credito Unitario]]
```

## Formula consolidada

Versao direta em Excel:

```excel
=IF([@[Peso ORIZON]]=1,0,MIN(10,10*(([@[Peso ORIZON]]-1)/(Peso_Maximo-1))*MAX(0.60,MIN(1.40,SQRT([@[Dose Base Categoria]]/[@Dose])))))
```

Credito total:

```excel
=[@Volume]*IF([@[Peso ORIZON]]=1,0,MIN(10,10*(([@[Peso ORIZON]]-1)/(Peso_Maximo-1))*MAX(0.60,MIN(1.40,SQRT([@[Dose Base Categoria]]/[@Dose])))))
```

## Exemplo pratico

Considerando `Peso_Maximo = 5` e `Credito_Base = R$ 10,00`:

| Produto | Unidade | Volume | Dose | Dose Base | Peso | Fator Peso | Fator Dose | Credito Unitario | Credito Total |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Produto B2B | L | 10.000 | 1,00 | 1,00 | 1 | 0,00 | 1,00 | R$ 0,00 | R$ 0 |
| Produto Entrada | L | 5.000 | 1,50 | 1,00 | 2 | 0,25 | 0,82 | R$ 2,04 | R$ 10.200 |
| Produto Estrategico | L | 3.000 | 0,50 | 1,00 | 4 | 0,75 | 1,40 | R$ 10,00 | R$ 30.000 |
| Produto Core | Kg | 2.000 | 1,00 | 1,00 | 5 | 1,00 | 1,00 | R$ 10,00 | R$ 20.000 |

Observacao: o Produto Estrategico bateria R$ 10,50 antes do teto, mas fica limitado a R$ 10,00 por L.

## Leitura comercial

O credito ORIZON deve premiar tres dimensoes:

1. Aderencia estrategica do produto ao programa.
2. Intensidade tecnologica medida pela dose.
3. Volume real em L ou Kg, com teto de protecao financeira.

Esse modelo permite que a equipe comercial explique o credito de forma simples:

> Produto B2B nao gera credito. Produto elegivel gera credito conforme peso ORIZON e eficiencia de dose, sempre limitado a R$ 10 por L ou Kg.

## Regras de governanca

1. O peso ORIZON de cada produto deve ser aprovado pela direcao comercial/tecnica.
2. A dose base por categoria deve ser definida pela area tecnica.
3. Produtos B2B devem permanecer com peso 1.
4. A alteracao de peso de produto deve exigir justificativa tecnica.
5. O credito calculado e recomendado, nao automaticamente concedido.
6. Para PRIME e LEGACY, o credito deve ser liberado por plano tecnico e governanca de conta.

## Recomendacao para Excel

Criar ou atualizar uma aba `Produtos e Pesos` com:

- Produto
- Categoria
- Unidade
- Dose
- Dose Base Categoria
- Peso ORIZON
- Elegivel
- Fator Peso
- Fator Dose
- Credito Unitario
- Teto Unitario

Na aba de carteira/cotacao, buscar os campos por `XLOOKUP` e calcular o credito por produto.

O dashboard deve mostrar:

- credito total elegivel;
- credito bloqueado por B2B;
- credito medio por L/Kg;
- produtos que atingiram o teto de R$ 10;
- composicao do credito por produto;
- composicao do credito por cliente/usina.
