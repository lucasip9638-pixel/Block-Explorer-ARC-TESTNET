import { useQuery } from '@tanstack/react-query'
import { ARC_TESTNET_CONFIG } from '@/config/arc-testnet'
import { createPublicClient, http } from 'viem'

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
  },
  transport: http(ARC_TESTNET_CONFIG.rpcUrls[0]),
})

export interface NetworkUtilization {
  utilization: number // Porcentagem de utilização (ex: 4.00)
  gasUsed: bigint
  gasLimit: bigint
  currentBlock: bigint
}

/**
 * Busca utilização da rede via API do Blockscout
 * Igual ao que aparece em https://testnet.arcscan.app/
 */
async function fetchNetworkUtilizationFromBlockscout(): Promise<NetworkUtilization | null> {
  const explorerUrl = ARC_TESTNET_CONFIG.blockExplorerUrls[0]
  
  try {
    console.log('🔍 Buscando utilização da rede via Blockscout API...')
    
    // Buscar bloco mais recente
    const latestBlock = await publicClient.getBlockNumber()
    
    // Buscar informações do bloco mais recente
    const block = await publicClient.getBlock({
      blockNumber: latestBlock,
    })
    
    const gasUsed = block.gasUsed
    const gasLimit = block.gasLimit
    
    // Calcular utilização da rede
    const utilization = gasLimit > 0n 
      ? Number((gasUsed * 10000n) / gasLimit) / 100 // Arredondar para 2 casas decimais
      : 0
    
    console.log(`✅ Utilização da rede: ${utilization.toFixed(2)}%`)
    console.log(`   Gas usado: ${gasUsed.toString()}`)
    console.log(`   Gas limite: ${gasLimit.toString()}`)
    
    return {
      utilization,
      gasUsed,
      gasLimit,
      currentBlock: latestBlock,
    }
  } catch (error: any) {
    console.error('❌ Erro ao buscar utilização da rede:', error)
    return null
  }
}

/**
 * Hook para buscar utilização da rede
 */
export function useNetworkUtilization() {
  return useQuery({
    queryKey: ['network-utilization'],
    queryFn: fetchNetworkUtilizationFromBlockscout,
    staleTime: 0,
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

