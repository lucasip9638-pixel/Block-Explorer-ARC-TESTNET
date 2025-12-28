import { useQuery } from '@tanstack/react-query'
import { createPublicClient, http, formatUnits, Address, erc20Abi } from 'viem'
import { useAccount, useBalance } from 'wagmi'
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

// Endereços dos contratos de tokens na ARC Testnet
const TOKEN_CONTRACTS = {
  USDC: '0x3600000000000000000000000000000000000000' as Address,
  EURC: '0x89B50855Aa3bE2F677cD6303Cec089B5F319D72a' as Address,
} as const

export interface TokenBalance {
  symbol: string
  balance: string
  decimals: number
  address?: string
}

/**
 * Busca saldo de um token ERC-20
 */
async function fetchERC20Balance(
  tokenAddress: Address,
  walletAddress: Address,
  symbol: string,
  decimals: number = 18
): Promise<TokenBalance> {
  try {
    const balance = await publicClient.readContract({
      address: tokenAddress,
      abi: erc20Abi,
      functionName: 'balanceOf',
      args: [walletAddress],
    })

    return {
      symbol,
      balance: formatUnits(balance, decimals),
      decimals,
      address: tokenAddress,
    }
  } catch (error) {
    console.error(`Erro ao buscar saldo de ${symbol}:`, error)
    return {
      symbol,
      balance: '0',
      decimals,
      address: tokenAddress,
    }
  }
}

/**
 * Busca saldo nativo (USDC na ARC é a moeda nativa)
 */
async function fetchNativeUSDCBalance(address: string): Promise<TokenBalance> {
  try {
    // USDC na ARC Testnet é a moeda nativa, buscar diretamente
    const balance = await publicClient.getBalance({
      address: address as Address,
    })
    
    // USDC usa 6 decimais na ARC Testnet
    const formattedBalance = formatUnits(balance, 6)
    
    return {
      symbol: 'USDC',
      balance: formattedBalance,
      decimals: 6,
    }
  } catch (error) {
    console.error('Erro ao buscar saldo nativo de USDC:', error)
    return {
      symbol: 'USDC',
      balance: '0',
      decimals: 6,
    }
  }
}

/**
 * Busca todos os saldos de uma wallet (tokens ERC-20)
 */
async function fetchWalletBalances(address: string): Promise<TokenBalance[]> {
  const balances: TokenBalance[] = []

  try {
    // Buscar saldos de todos os tokens em paralelo
    const balancePromises = [
      // 1. Buscar saldo NATIVO de USDC (moeda nativa da ARC)
      fetchNativeUSDCBalance(address),
      
      // 2. Buscar saldo de EURC (token ERC-20)
      (async () => {
        try {
          const decimals = await publicClient.readContract({
            address: TOKEN_CONTRACTS.EURC,
            abi: erc20Abi,
            functionName: 'decimals',
          }).catch(() => 6)

          const symbol = await publicClient.readContract({
            address: TOKEN_CONTRACTS.EURC,
            abi: erc20Abi,
            functionName: 'symbol',
          }).catch(() => 'EURC')

          return await fetchERC20Balance(
            TOKEN_CONTRACTS.EURC,
            address as Address,
            typeof symbol === 'string' ? symbol : 'EURC',
            typeof decimals === 'number' ? decimals : 6
          )
        } catch (error) {
          console.error('Erro ao buscar saldo de EURC:', error)
          return {
            symbol: 'EURC',
            balance: '0',
            decimals: 6,
            address: TOKEN_CONTRACTS.EURC,
          }
        }
      })(),
    ]

    const results = await Promise.all(balancePromises)
    balances.push(...results)

    return balances
  } catch (error) {
    console.error('Erro ao buscar saldos:', error)
    return balances
  }
}

/**
 * Busca saldos usando a API do Blockscout (ARC Scan)
 * Igual ao que aparece em https://testnet.arcscan.app/
 */
async function fetchBalancesFromBlockscout(address: string): Promise<TokenBalance[]> {
  const explorerUrl = ARC_TESTNET_CONFIG.blockExplorerUrls[0]
  const balances: TokenBalance[] = []
  
  try {
    // Tentar buscar da API do Blockscout
    const apiUrl = `${explorerUrl}/api/v2/addresses/${address}/token-balances`
    console.log('🔍 Buscando saldos via Blockscout API:', apiUrl)
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    if (response.ok) {
      const data = await response.json()
      
      // Blockscout retorna os tokens em data.items ou data
      const tokens = data.items || data || []
      
      // Processar cada token - APENAS USDC e EURC
      for (const token of tokens) {
        if (token.token && token.value) {
          try {
            const decimals = token.token.decimals || token.token.contract_decimals || 6
            const symbol = token.token.symbol || token.token.name || 'UNKNOWN'
            const tokenAddress = (token.token.address || token.token.contract_address || '').toLowerCase()
            
            // FILTRAR: Mostrar APENAS USDC e EURC
            const isUSDC = symbol.toUpperCase() === 'USDC' || 
                          tokenAddress === TOKEN_CONTRACTS.USDC.toLowerCase() ||
                          tokenAddress === '0x0000000000000000000000000000000000000000' // Endereço zero = nativo
            
            const isEURC = symbol.toUpperCase() === 'EURC' || 
                          tokenAddress === TOKEN_CONTRACTS.EURC.toLowerCase()
            
            if (!isUSDC && !isEURC) {
              console.log(`⏭️ Ignorando token ${symbol} (${tokenAddress}) - apenas USDC e EURC são exibidos`)
              continue // Pular tokens que não são USDC ou EURC
            }
            
            // Converter o valor para BigInt corretamente
            const valueBigInt = typeof token.value === 'string' 
              ? BigInt(token.value) 
              : BigInt(token.value.toString())
            const balance = formatUnits(valueBigInt, decimals)
            
            balances.push({
              symbol: symbol.toUpperCase(),
              balance,
              decimals: Number(decimals),
              address: tokenAddress,
            })
          } catch (error) {
            console.warn('⚠️ Erro ao processar token:', token, error)
          }
        }
      }
      
      console.log('✅ Saldos encontrados via Blockscout:', balances.length)
      return balances
    }
  } catch (error) {
    console.warn('⚠️ Erro ao buscar via Blockscout API:', error)
  }
  
  return []
}

/**
 * Hook para buscar saldos de uma wallet
 * FOCO: Usar API do Blockscout (como ARC Scan) + fallback para RPC direto
 */
export function useWalletBalance(address: string | undefined) {
  const { address: connectedAddress } = useAccount()
  const walletAddress = address || connectedAddress

  return useQuery({
    queryKey: ['wallet-balance', walletAddress],
    queryFn: async () => {
      if (!walletAddress) throw new Error('Endereço não fornecido')
      
      console.log('🚀 INICIANDO BUSCA DE SALDO NA BLOCKCHAIN ARC TESTNET')
      console.log('📋 Endereço:', walletAddress)
      console.log('🌐 RPC:', ARC_TESTNET_CONFIG.rpcUrls[0])
      console.log('🔗 Chain ID:', ARC_TESTNET_CONFIG.chainId)
      console.log('🔍 Explorer:', ARC_TESTNET_CONFIG.blockExplorerUrls[0])
      
      const finalBalances: TokenBalance[] = []
      
      // PRIORIDADE 1: Tentar buscar via Blockscout API (igual ao ARC Scan)
      const blockscoutBalances = await fetchBalancesFromBlockscout(walletAddress)
      
      if (blockscoutBalances.length > 0) {
        console.log('✅ Usando saldos do Blockscout API')
        
        // FILTRAR: Garantir que apenas USDC e EURC sejam retornados
        const filteredBalances = blockscoutBalances.filter(b => 
          b.symbol === 'USDC' || b.symbol === 'EURC'
        )
        
        // Adicionar saldo nativo USDC se não estiver presente
        const hasUSDC = filteredBalances.some(b => b.symbol === 'USDC')
        if (!hasUSDC) {
          try {
            const nativeBalance = await publicClient.getBalance({
              address: walletAddress as Address,
            })
            const usdcBalance = formatUnits(nativeBalance, 6)
            filteredBalances.unshift({
              symbol: 'USDC',
              balance: usdcBalance,
              decimals: 6,
            })
          } catch (error) {
            console.warn('⚠️ Erro ao buscar saldo nativo:', error)
            filteredBalances.unshift({
              symbol: 'USDC',
              balance: '0',
              decimals: 6,
            })
          }
        }
        
        // Garantir que EURC está presente
        const hasEURC = filteredBalances.some(b => b.symbol === 'EURC')
        if (!hasEURC) {
          filteredBalances.push({
            symbol: 'EURC',
            balance: '0',
            decimals: 6,
            address: TOKEN_CONTRACTS.EURC,
          })
        }
        
        // Ordenar: USDC primeiro, depois EURC
        filteredBalances.sort((a, b) => {
          if (a.symbol === 'USDC') return -1
          if (b.symbol === 'USDC') return 1
          return 0
        })
        
        return filteredBalances
      }
      
      // PRIORIDADE 2: Fallback - Buscar diretamente via RPC
      console.log('🔄 Blockscout não retornou saldos, usando RPC direto...')
      
      try {
        // 1. BUSCAR SALDO NATIVO DE USDC DIRETAMENTE VIA RPC
        console.log('💰 Buscando saldo nativo de USDC...')
        const nativeBalance = await publicClient.getBalance({
          address: walletAddress as Address,
        })
        
        const usdcBalanceFormatted = formatUnits(nativeBalance, 6) // USDC usa 6 decimais
        
        console.log('✅ Saldo nativo encontrado!')
        console.log('   Valor bruto:', nativeBalance.toString())
        console.log('   Valor formatado:', usdcBalanceFormatted, 'USDC')
        
        finalBalances.push({
          symbol: 'USDC',
          balance: usdcBalanceFormatted,
          decimals: 6,
        })
        
      } catch (error: any) {
        console.error('❌ Erro ao buscar saldo nativo de USDC:', error)
        finalBalances.push({
          symbol: 'USDC',
          balance: '0',
          decimals: 6,
        })
      }
      
      try {
        // 2. BUSCAR SALDO DE EURC (token ERC-20)
        console.log('💰 Buscando saldo de EURC...')
        const eurcBalance = await fetchERC20Balance(
          TOKEN_CONTRACTS.EURC,
          walletAddress as Address,
          'EURC',
          6 // EURC também usa 6 decimais
        )
        
        console.log('✅ Saldo EURC encontrado:', eurcBalance.balance)
        finalBalances.push(eurcBalance)
        
      } catch (error: any) {
        console.error('❌ Erro ao buscar saldo de EURC:', error)
        finalBalances.push({
          symbol: 'EURC',
          balance: '0',
          decimals: 6,
          address: TOKEN_CONTRACTS.EURC,
        })
      }
      
      // GARANTIR: Apenas USDC e EURC são retornados
      const onlyUSDCAndEURC = finalBalances.filter(b => 
        b.symbol === 'USDC' || b.symbol === 'EURC'
      )
      
      // Garantir que ambos estão presentes
      const hasUSDC = onlyUSDCAndEURC.some(b => b.symbol === 'USDC')
      const hasEURC = onlyUSDCAndEURC.some(b => b.symbol === 'EURC')
      
      if (!hasUSDC) {
        onlyUSDCAndEURC.unshift({
          symbol: 'USDC',
          balance: '0',
          decimals: 6,
        })
      }
      
      if (!hasEURC) {
        onlyUSDCAndEURC.push({
          symbol: 'EURC',
          balance: '0',
          decimals: 6,
          address: TOKEN_CONTRACTS.EURC,
        })
      }
      
      // Ordenar: USDC primeiro, depois EURC
      onlyUSDCAndEURC.sort((a, b) => {
        if (a.symbol === 'USDC') return -1
        if (b.symbol === 'USDC') return 1
        return 0
      })
      
      console.log('✅ ✅ ✅ BUSCA CONCLUÍDA!')
      console.log(`📊 Tokens exibidos (apenas USDC e EURC): ${onlyUSDCAndEURC.length}`)
      onlyUSDCAndEURC.forEach(b => {
        console.log(`   ${b.symbol}: ${b.balance}`)
      })
      
      return onlyUSDCAndEURC
    },
    enabled: !!walletAddress && walletAddress.startsWith('0x'),
    staleTime: 5000, // 5 segundos
    refetchInterval: 15000, // Refetch a cada 15 segundos
    retry: 3, // Tentar 3 vezes em caso de erro
    retryDelay: 1000, // Esperar 1 segundo entre tentativas
  })
}

/**
 * Hook simples para buscar apenas saldo nativo (USDC)
 */
export function useNativeBalance(address: string | undefined) {
  return useBalance({
    address: address as Address,
    enabled: !!address && address.startsWith('0x'),
  })
}
