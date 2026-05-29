# ORIZON OS - Deploy Vercel

Este diretorio ja esta pronto para deploy como site estatico na Vercel.

## Preview

```powershell
cd "C:\Users\Rodol\OneDrive - Auma Negocios e Participacoes LTDA\Documentos\Orizon\outputs\site-orizon"
npx vercel@28.20.0 login
npx vercel@28.20.0 deploy . --yes
```

## Producao

```powershell
cd "C:\Users\Rodol\OneDrive - Auma Negocios e Participacoes LTDA\Documentos\Orizon\outputs\site-orizon"
npx vercel@28.20.0 deploy . --yes --prod
```

## Observacao

O deploy completo inclui os videos em `assets/`. O endpoint claimable sem login recusou o pacote por tamanho; por isso o caminho correto e usar o CLI autenticado da Vercel.
