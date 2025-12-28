# ARC Testnet Block Explorer

Um explorador de blocos completo e moderno para a rede ARC Testnet, construído com Next.js, React e TypeScript.

## 🚀 Funcionalidades

### 🔍 Pesquisa
- **Pesquisa por Endereço de Wallet**: Visualize saldos de USDC e EURC
- **Pesquisa por Hash de Transação**: Veja detalhes completos de transações
- Links diretos para o ARC Scan

### 💼 Wallet
- Visualização de saldos em tempo real (USDC e EURC)
- Histórico de transações
- Integração com carteiras Web3 (MetaMask, WalletConnect, etc.)

### 📊 Transações
- Detalhes completos de transações
- Status em tempo real
- Informações de gas, nonce, e índices
- Links para o explorador ARC Scan

### 🌐 DApps Ecosystem
- **12 DApps** organizados por categoria
- Categorias: NFT, DEX, Bridge, Domain, Deploy, Wallet, Faucet
- Filtros por categoria
- Layout profissional com design azul moderno

### 📈 Estatísticas da Rede
- Métricas em tempo real
- Dashboard para desenvolvedores
- Gráficos de atividade

## 🛠️ Tecnologias

- **Next.js 14** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Viem** - Biblioteca Ethereum
- **Wagmi** - Hooks React para Ethereum
- **React Query** - Gerenciamento de estado e cache
- **shadcn/ui** - Componentes UI

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build
```

## 🔧 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
# Opcional: API Key do OpenAI para chat (se desejar usar)
OPENAI_API_KEY=your_api_key_here
```

### Configuração da Rede ARC Testnet

A configuração da rede está em `config/arc-testnet.ts`:

- **RPC Endpoint**: `https://rpc.testnet.arc.network`
- **Chain ID**: `5042002`
- **Explorer**: `https://testnet.arcscan.app`

## 📁 Estrutura do Projeto

```
├── app/                    # Páginas Next.js
│   ├── page.tsx           # Página inicial
│   ├── tx/[hash]/         # Página de transação
│   └── wallet/[address]/  # Página de wallet
├── components/            # Componentes React
│   ├── dapp-grid.tsx     # Grid de DApps
│   ├── hero.tsx          # Seção hero
│   ├── header.tsx        # Cabeçalho
│   └── footer.tsx        # Rodapé
├── hooks/                 # Custom hooks
│   ├── use-wallet-balance.ts
│   ├── use-transaction-details.ts
│   └── use-recent-transactions.ts
├── config/                # Configurações
│   └── arc-testnet.ts    # Configuração da rede ARC
└── public/               # Arquivos estáticos
    └── dapps/            # Logos dos DApps
```

## 🌟 DApps Disponíveis

### DEX (3)
- Curve Finance
- Defionarc (ArcFlow Finance)
- Synthra

### Bridge (1)
- Superbridge

### Domain (2)
- InfinityName
- ZNS

### NFT (1)
- Omni Hub

### Deploy (1)
- zkCodex

### Wallet (2)
- Gateway (Circle)
- zkCodex

### Faucet (2)
- Circle Testnet Faucet
- Easy Faucet Arc

## 🚀 Deploy no Vercel

### Conectar GitHub ao Vercel

1. **Acesse o Vercel**: [https://vercel.com](https://vercel.com)
2. **Faça login** com sua conta GitHub
3. **Clique em "Add New Project"**
4. **Importe o repositório**: `lucasip9638-pixel/Block-Explorer-ARC-TESTNET`
5. **Configure o projeto**:
   - Framework Preset: **Next.js**
   - Root Directory: `./` (padrão)
   - Build Command: `npm run build` (automático)
   - Output Directory: `.next` (automático)
   - Install Command: `npm install` (automático)
6. **Variáveis de Ambiente** (opcional):
   - `OPENAI_API_KEY` - Se desejar usar o chat com IA
7. **Clique em "Deploy"**

### Deploy Automático

Após conectar, cada push para a branch `main` no GitHub irá:
- ✅ Disparar um novo deploy automaticamente
- ✅ Executar o build
- ✅ Fazer deploy da nova versão
- ✅ Atualizar o site em produção

### URLs de Deploy

Após o deploy, você terá:
- **Production URL**: `https://seu-projeto.vercel.app`
- **Preview URLs**: Para cada Pull Request

## 📝 Licença

Este projeto é open source e está disponível sob a licença MIT.

## 🔗 Links Úteis

- [ARC Testnet Explorer](https://testnet.arcscan.app)
- [ARC Network Docs](https://docs.arc.network)
- [Circle Gateway](https://www.circle.com/pt-br/gateway)
- [Vercel Documentation](https://vercel.com/docs)

## 👨‍💻 Desenvolvedor

Desenvolvido para a comunidade ARC Testnet.

---

**Status**: ✅ Em produção e funcionando
**GitHub**: [https://github.com/lucasip9638-pixel/Block-Explorer-ARC-TESTNET](https://github.com/lucasip9638-pixel/Block-Explorer-ARC-TESTNET)

