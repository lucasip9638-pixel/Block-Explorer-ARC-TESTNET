import { useQuery } from '@tanstack/react-query'
import { ARC_TESTNET_CONFIG } from '@/config/arc-testnet'
import { formatDistanceToNow } from 'date-fns'

export interface BlockInfo {
  number: bigint
  hash: string
  timestamp: number
  transactionCount: number
  gasUsed: bigint
  gasLimit: bigint
  miner: string
  formattedTime: string
}

/**
 * Busca blocos recentes via API do Blockscout (ARC Scan)
 * Igual ao que aparece em https://testnet.arcscan.app/
 */
async function fetchRecentBlocksFromBlockscout(): Promise<BlockInfo[]> {
  const explorerUrl = ARC_TESTNET_CONFIG.blockExplorerUrls[0]
  
  try {
    console.log('🔍 Buscando blocos recentes via Blockscout API...')
    
    // API do Blockscout para blocos recentes
    const apiEndpoints = [
      `${explorerUrl}/api/v2/blocks?page=1&page_size=10`,
      `${explorerUrl}/api/v1/blocks?limit=10&sort=desc`,
      `${explorerUrl}/api/blocks?limit=10`,
    ]
    
    for (const endpoint of apiEndpoints) {
      try {
        console.log(`   Tentando: ${endpoint}`)
        const response = await fetch(endpoint, {
          method: 'GET',
          headers: { 
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          signal: AbortSignal.timeout(10000),
        })
        
        if (response.ok) {
          const data = await response.json()
          console.log('✅ Resposta recebida da API:', Object.keys(data))
          
          // Blockscout retorna em diferentes formatos
          let blocks: any[] = []
          if (data.items && Array.isArray(data.items)) {
            blocks = data.items
            console.log(`   Encontrado ${blocks.length} blocos em data.items`)
          } else if (data.data && Array.isArray(data.data)) {
            blocks = data.data
            console.log(`   Encontrado ${blocks.length} blocos em data.data`)
          } else if (Array.isArray(data)) {
            blocks = data
            console.log(`   Encontrado ${blocks.length} blocos no array direto`)
          } else if (data.result && Array.isArray(data.result)) {
            blocks = data.result
            console.log(`   Encontrado ${blocks.length} blocos em data.result`)
          }
          
          if (blocks.length > 0) {
            console.log(`✅ ✅ ✅ ${blocks.length} blocos encontrados via Blockscout API!`)
            
            const formattedBlocks = blocks.slice(0, 10).map((block: any) => {
              const number = BigInt(block.number || block.block_number || block.height || '0')
              // Buscar hash do bloco - pode estar em diferentes campos
              const hash = block.hash || 
                          block.block_hash || 
                          block.blockHash || 
                          block.header?.hash ||
                          ''
              const timestamp = block.timestamp || block.block_timestamp || Date.now() / 1000
              const transactionCount = block.transaction_count || block.transactions_count || block.tx_count || 0
              const gasUsed = BigInt(block.gas_used || block.gasUsed || '0')
              const gasLimit = BigInt(block.gas_limit || block.gasLimit || block.size || '0')
              const miner = block.miner?.hash || block.miner || block.author || ''
              
              console.log(`📦 Bloco ${number.toString()}: hash=${hash.slice(0, 10)}...`)
              
              return {
                number,
                hash: hash || '', // Sempre retornar hash, mesmo que vazio
                timestamp: typeof timestamp === 'number' ? timestamp : Number(timestamp),
                transactionCount: Number(transactionCount),
                gasUsed,
                gasLimit,
                miner,
                formattedTime: formatDistanceToNow(new Date(Number(timestamp) * 1000), { addSuffix: true }),
              }
            })
            
            return formattedBlocks
          }
        } else {
          console.warn(`   Resposta não OK: ${response.status} ${response.statusText}`)
        }
      } catch (error: any) {
        console.warn(`   Erro ao buscar de ${endpoint}:`, error.message)
        continue
      }
    }
    
    console.warn('⚠️ Nenhum bloco encontrado via Blockscout API')
    return []
  } catch (error: any) {
    console.error('❌ Erro ao buscar blocos via Blockscout API:', error)
    return []
  }
}

/**
 * Busca blocos via RPC direto (fallback)
 */
async function fetchRecentBlocksViaRPC(): Promise<BlockInfo[]> {
  const { createPublicClient, http } = await import('viem')
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
    },
    transport: http(ARC_TESTNET_CONFIG.rpcUrls[0]),
  })

  try {
    const latestBlock = await publicClient.getBlockNumber()
    const blocks: BlockInfo[] = []

    // Buscar últimos 10 blocos
    for (let i = 0; i < 10; i++) {
      try {
        const blockNumber = latestBlock - BigInt(i)
        const block = await publicClient.getBlock({
          blockNumber,
          includeTransactions: true,
        })

        blocks.push({
          number: block.number,
          hash: block.hash || '',
          timestamp: Number(block.timestamp),
          transactionCount: block.transactions?.length || 0,
          gasUsed: block.gasUsed,
          gasLimit: block.gasLimit,
          miner: '',
          formattedTime: formatDistanceToNow(new Date(Number(block.timestamp) * 1000), { addSuffix: true }),
        })
      } catch {
        continue
      }
    }

    return blocks
  } catch (error) {
    console.error('Erro ao buscar blocos via RPC:', error)
    return []
  }
}

/**
 * Hook para buscar blocos recentes
 */
export function useRecentBlocks() {
  return useQuery({
    queryKey: ['recent-blocks'],
    queryFn: async () => {
      // Tentar Blockscout API primeiro
      const blockscoutBlocks = await fetchRecentBlocksFromBlockscout()
      if (blockscoutBlocks.length > 0) {
        return blockscoutBlocks
      }
      
      // Fallback para RPC direto
      return await fetchRecentBlocksViaRPC()
    },
    staleTime: 0, // Sempre considerar stale para atualização constante
    refetchInterval: 2000, // Atualizar a cada 2 segundos
    refetchIntervalInBackground: true,
    retry: 2,
    retryDelay: 500,
    gcTime: 10000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
  })
}

