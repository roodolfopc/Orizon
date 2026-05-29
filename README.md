# ORIZON

Plataforma de evolucao operacional agricola assistida, estruturada em camadas de programa, carteira de clientes, governanca, parceiros, GIS e follow-up.

## Site

O site estatico principal esta em:

```text
outputs/site-orizon
```

Arquivos principais:

- `index.html`: entrada do cockpit.
- `styles.css`: identidade visual e UI responsiva.
- `app.js`: experiencia interativa, governanca, cliente selecionado, GIS e cronograma.
- `data/`: bases JSON derivadas do Excel.
- `assets/`: logos, videos e materiais dos parceiros.

## Executar Localmente

```powershell
cd outputs/site-orizon
npx serve -l 4173 .
```

Depois acesse:

```text
http://127.0.0.1:4173/
```

## Deploy Vercel

```powershell
cd outputs/site-orizon
npx vercel@28.20.0 login
npx vercel@28.20.0 deploy . --yes
```

Para producao:

```powershell
npx vercel@28.20.0 deploy . --yes --prod
```

## Observacao De Governanca

A v1 e estatica e simula perfis de acesso no front-end. Para producao, a autenticacao, permissao por cliente e dados sensiveis devem ser aplicados no backend ou em uma camada segura antes de expor APIs e arquivos de dados.
