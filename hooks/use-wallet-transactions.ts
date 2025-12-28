import { useQuery } from '@tanstack/react-query'
import { createPublicClient, http, formatEther, formatUnits } from 'viem'
import { ARC_TESTNET_CONFIG } from '@/config/arc-testnet'

// Cliente público para interagir com a blockchain
const publicClient = createPublicClient({
  chain: {
    id: ARC_TESTNET_CONFIG.chainId,
    name: ARC_TESTNET_CONFIG.chainName,
    nativeCurrency: ARC_TESTNET_CONFIG.nativeCurrency,
    rpcUrls: {
      default: {
        http: [ARC_TESTNET_CONFIG.rpcUrls[0]],
      },
    },
    blockExplorers: {
      default: {
        name: 'ARC Scan',
        url: ARC_TESTNET_CONFIG.blockExplorerUrls[0],
      },
    },
  },
  transport: http(ARC_TESTNET_CONFIG.rpcUrls[0]),
})

export interface Transaction {
  hash: string
  from: string
  to: string | null
  value: string
  timestamp: number
  blockNumber: bigint
  status: 'success' | 'pending' | 'failed'
  type?: string
}

/**
 * Busca transações de uma wallet usando o block explorer API da ARC
 * Como o RPC direto não fornece histórico de transações, usamos o explorer
 */
async function fetchWalletTransactions(address: string): Promise<Transaction[]> {
  try {
    // Usar o explorer API da ARC Testnet
    const explorerUrl = `${ARC_TESTNET_CONFIG.blockExplorerUrls[0]}/api`
    
    // Tentar buscar via API do explorer (se disponível)
    const response = await fetch(
      `${explorerUrl}/v2/addresses/${address}/transactions?limit=50`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    if (response.ok) {
      const data = await response.json()
      
      if (data.items && Array.isArray(data.items)) {
        return data.items.map((tx: any) => ({
          hash: tx.hash || tx.tx_hash,
          from: tx.from?.address || tx.from_address || address,
          to: tx.to?.address || tx.to_address || null,
          value: tx.value ? formatEther(BigInt(tx.value)) : '0',
          timestamp: tx.timestamp || Date.now() / 1000,
          blockNumber: BigInt(tx.block || tx.block_number || 0),
          status: tx.status === 'success' || tx.success !== false ? 'success' : 'failed',
          type: tx.type || 'Transfer',
        }))
      }
    }

    // Fallback: buscar via RPC usando getBlock e scan blocks recentes
    // (limitado, mas funciona como alternativa)
    return await fetchTransactionsViaRPC(address)
  } catch (error) {
    console.error('Erro ao buscar transações:', error)
    // Fallback para RPC
    return await fetchTransactionsViaRPC(address)
  }
}

/**
 * Método alternativo: busca transações via Explorer API diretamente
 * Usa o endpoint do ARC Scan que geralmente está disponível
 */
async function fetchTransactionsViaRPC(address: string): Promise<Transaction[]> {
  try {
    // Tentar buscar do explorer usando fetch direto
    // ARC Scan geralmente tem uma API GraphQL ou REST
    const explorerUrl = ARC_TESTNET_CONFIG.blockExplorerUrls[0]
    
    // Tentar diferentes formatos de API
    const apiEndpoints = [
      `${explorerUrl}/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=desc`,
      `${explorerUrl}/api/v1/transactions?address=${address}&limit=50`,
      `https://api.testnet.arcscan.app/api/v1/transactions?address=${address}&limit=50`,
    ]
    
    for (const endpoint of apiEndpoints) {
      try {
        const response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        })
        
        if (response.ok) {
          const data = await response.json()
          
          // Formato Etherscan-like
          if (data.status === '1' && data.result && Array.isArray(data.result)) {
            return data.result.map((tx: any) => ({
              hash: tx.hash,
              from: tx.from,
              to: tx.to,
              value: formatEther(BigInt(tx.value || '0')),
              timestamp: parseInt(tx.timeStamp || '0'),
              blockNumber: BigInt(tx.blockNumber || '0'),
              status: tx.txreceipt_status === '1' ? 'success' : 'failed',
              type: tx.to ? 'Transfer' : 'Contract',
            }))
          }
          
          // Formato direto de array
          if (Array.isArray(data)) {
            return data.map((tx: any) => ({
              hash: tx.hash || tx.tx_hash,
              from: tx.from || tx.from_address,
              to: tx.to || tx.to_address || null,
              value: tx.value ? formatEther(BigInt(tx.value)) : '0',
              timestamp: tx.timestamp || Date.now() / 1000,
              blockNumber: BigInt(tx.blockNumber || tx.block || '0'),
              status: tx.status === 'success' || tx.success !== false ? 'success' : 'failed',
              type: tx.type || 'Transfer',
            }))
          }
          
          // Formato com items
          if (data.items && Array.isArray(data.items)) {
            return data.items.map((tx: any) => ({
              hash: tx.hash || tx.tx_hash,
              from: tx.from || tx.from_address,
              to: tx.to || tx.to_address || null,
              value: tx.value ? formatEther(BigInt(tx.value)) : '0',
              timestamp: tx.timestamp || Date.now() / 1000,
              blockNumber: BigInt(tx.blockNumber || tx.block || '0'),
              status: tx.status === 'success' || tx.success !== false ? 'success' : 'failed',
              type: tx.type || 'Transfer',
            }))
          }
        }
      } catch (err) {
        // Tentar próximo endpoint
        continue
      }
    }
    
    // Se nenhum endpoint funcionou, retornar array vazio
    return []
  } catch (error) {
    console.error('Erro ao buscar transações:', error)
    return []
  }
}

/**
 * Hook para buscar transações de uma wallet
 */
export function useWalletTransactions(address: string | undefined) {
  return useQuery({
    queryKey: ['wallet-transactions', address],
    queryFn: () => {
      if (!address) throw new Error('Endereço não fornecido')
      return fetchWalletTransactions(address)
    },
    enabled: !!address && address.startsWith('0x'),
    staleTime: 30000, // 30 segundos
    refetchInterval: 60000, // Refetch a cada minuto
  })
}

/**
 * Busca detalhes de uma transação específica
 */
export async function fetchTransactionDetails(txHash: string) {
  try {
    const tx = await publicClient.getTransaction({ hash: txHash as `0x${string}` })
    const receipt = await publicClient.getTransactionReceipt({ hash: txHash as `0x${string}` })
    const block = await publicClient.getBlock({ blockNumber: receipt.blockNumber })
    
    return {
      hash: tx.hash,
      from: tx.from,
      to: tx.to,
      value: formatEther(tx.value),
      gasUsed: receipt.gasUsed.toString(),
      gasPrice: tx.gasPrice ? formatUnits(tx.gasPrice, 'gwei') : '0',
      timestamp: Number(block.timestamp),
      blockNumber: receipt.blockNumber,
      status: receipt.status,
      data: tx.input,
    }
  } catch (error) {
    console.error('Erro ao buscar detalhes da transação:', error)
    throw error
  }
}

