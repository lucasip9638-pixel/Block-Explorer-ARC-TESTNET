# 🚀 Guia de Deploy - ARC Testnet dApp

## 📋 Status Atual

✅ **O dApp está pronto para deploy!**

### Sobre a Wallet
- ❌ **NÃO criamos uma wallet** - e isso está correto!
- ✅ **O dApp conecta com wallets existentes** (MetaMask, etc.)
- ✅ **Usuários usam suas próprias wallets** para interagir com o dApp
- ✅ **Isso é o padrão correto** para dApps descentralizados

## 🎯 Opções de Deploy

### 1. Vercel (Recomendado - Já configurado)

O projeto já tem `@vercel/analytics` instalado, então está preparado para Vercel.

**Deploy na Vercel:**

```bash
# Opção 1: Via CLI
npm i -g vercel
vercel

# Opção 2: Via GitHub
# 1. Faça push do código para GitHub
# 2. Acesse https://vercel.com
# 3. Importe o repositório
# 4. Deploy automático!
```

**Configurações na Vercel:**
- Framework: Next.js (detecta automaticamente)
- Build Command: `npm run build` (padrão)
- Output Directory: `.next` (padrão)

**Variáveis de Ambiente (Opcional):**
Se quiser usar WalletConnect, adicione no painel da Vercel:
```
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=seu_project_id_aqui
```

### 2. Netlify

**Deploy na Netlify:**

```bash
# Via CLI
npm i -g netlify-cli
netlify deploy --prod
```

**Configurações:**
- Build command: `npm run build`
- Publish directory: `.next`
- Framework: Next.js

### 3. Outras Plataformas

- **Railway**: Suporta Next.js nativamente
- **Render**: Suporta Next.js
- **AWS Amplify**: Suporta Next.js
- **Cloudflare Pages**: Suporta Next.js (mas pode ter limitações com SSR)

## ✅ Checklist Antes do Deploy

- [x] Projeto compila sem erros (`npm run build`)
- [x] Configuração da rede ARC Testnet completa
- [x] Integração Web3 funcionando
- [x] Conexão de wallet implementada
- [ ] (Opcional) Variáveis de ambiente configuradas
- [ ] (Opcional) Domínio personalizado configurado

## 📝 Notas Importantes

### 1. Wallet dos Usuários
- **Não precisamos criar wallet** - os usuários usam suas próprias (MetaMask, etc.)
- O dApp apenas **conecta** com wallets existentes
- Isso é o comportamento padrão e correto para dApps

### 2. Variáveis de Ambiente
- **NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID**: Opcional (só se usar WalletConnect)
- Sem variáveis de ambiente, o dApp funciona perfeitamente com MetaMask/Injected wallets

### 3. Build
- O projeto já compila com sucesso
- Os avisos do MetaMask SDK são normais (só funciona no cliente)

### 4. HTTPS
- **Obrigatório** para conexão de wallets
- Todas as plataformas de deploy oferecem HTTPS por padrão

## 🧪 Testar Localmente Antes do Deploy

```bash
# Build de produção
npm run build

# Executar build de produção localmente
npm start
```

Acesse: http://localhost:3000

## 🚀 Deploy Rápido (Vercel)

1. **Instale a CLI da Vercel:**
   ```bash
   npm i -g vercel
   ```

2. **Faça login:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```

4. **Para produção:**
   ```bash
   vercel --prod
   ```

Pronto! Seu dApp estará online! 🎉

## 📚 Recursos

- **Vercel Docs**: https://vercel.com/docs
- **Netlify Docs**: https://docs.netlify.com
- **Next.js Deploy**: https://nextjs.org/docs/deployment

---

**Status**: ✅ **PRONTO PARA DEPLOY**








