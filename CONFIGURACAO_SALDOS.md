# 💰 Configuração de Saldos de Tokens

## ✅ Funcionalidade Implementada

A funcionalidade de exibir saldos de tokens foi implementada com sucesso!

### Tokens Suportados

1. **USDC (Nativo)**
   - ✅ Funcionando completamente
   - Moeda nativa da ARC Testnet
   - Saldo buscado automaticamente

2. **EURC (Token ERC-20)**
   - ⚠️ Requer configuração do endereço do contrato
   - Uma vez configurado, funcionará automaticamente

## 📍 Onde os Saldos Aparecem

### 1. Página Principal (`/`)
- Quando você conecta sua wallet, os saldos aparecem na seção "Minhas Transações na ARC Testnet"
- Mostra USDC e EURC (se configurado) da wallet conectada

### 2. Página de Detalhes da Wallet (`/wallet/[address]`)
- Quando você pesquisa um endereço, os saldos aparecem no topo da página
- Mostra saldos de qualquer endereço pesquisado

## 🔧 Como Configurar o Endereço do EURC

Para habilitar a busca de saldo do EURC, você precisa configurar o endereço do contrato:

1. **Encontre o endereço do contrato EURC na ARC Testnet**
   - Verifique no ARC Scan Explorer: https://testnet.arcscan.app
   - Procure pelo contrato EURC ou consulte a documentação oficial

2. **Atualize o arquivo `hooks/use-wallet-balance.ts`**

   Encontre esta linha (aproximadamente linha 29-31):
   ```typescript
   const TOKEN_CONTRACTS = {
     EURC: null as string | null, // Configure aqui: '0x...' com o endereço do contrato EURC
   } as const
   ```

   E substitua `null` pelo endereço do contrato:
   ```typescript
   const TOKEN_CONTRACTS = {
     EURC: '0x1aBaEA1f7C830bD89Acc67eC4af516284b1bC33c', // Exemplo - substitua pelo endereço real
   } as const
   ```

3. **Salve o arquivo**
   - O sistema buscará automaticamente o saldo do EURC para todas as wallets
   - Não é necessário reiniciar o servidor, apenas recarregar a página

## 📊 Como Funciona

### Busca de Saldos

1. **USDC (Nativo)**
   - Busca direta via RPC usando `getBalance()`
   - Funciona imediatamente, sem configuração

2. **EURC (ERC-20)**
   - Busca via contrato inteligente usando função `balanceOf()`
   - Requer endereço do contrato configurado
   - Busca também `decimals()` e `symbol()` automaticamente

### Atualização Automática

- Saldos são atualizados automaticamente a cada 60 segundos
- Cache de 30 segundos para evitar muitas requisições
- Recarregamento manual disponível

## 🎨 Interface

O componente de saldos mostra:

- **Cards individuais** para cada token
- **Ícones** específicos (USDC: $, EURC: €)
- **Cores** diferentes para cada token
- **Formatação** de números com decimais corretos
- **Total estimado** quando há múltiplos tokens

### Estados Visuais

- **Com saldo**: Card destacado com borda colorida
- **Sem saldo**: Card com estilo mais sutil
- **Carregando**: Spinner com mensagem
- **Erro**: Mensagem de erro

## ⚠️ Notas Importantes

1. **Endereço do Contrato EURC**
   - Atualmente não configurado (null)
   - EURC não será mostrado até que o endereço seja configurado
   - USDC funciona normalmente mesmo sem EURC configurado

2. **Performance**
   - Cada token adicional adiciona uma chamada ao RPC
   - Atualização automática respeita os intervalos configurados

3. **Decimais**
   - USDC: 18 decimais (padrão da rede)
   - EURC: Geralmente 6 decimais (será detectado automaticamente)

## 🚀 Exemplo de Uso

Após configurar o EURC, quando você:

1. Conectar sua wallet → Verá saldos de USDC e EURC
2. Pesquisar um endereço → Verá saldos de USDC e EURC daquele endereço
3. Todos os saldos serão atualizados automaticamente

---

**Status**: ✅ **USDC FUNCIONANDO** | ⚠️ **EURC AGUARDANDO CONFIGURAÇÃO**

Para habilitar EURC, configure o endereço do contrato no arquivo `hooks/use-wallet-balance.ts`!








