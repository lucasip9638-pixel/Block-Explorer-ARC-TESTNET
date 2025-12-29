import { useQuery } from '@tanstack/react-query'
import { createPublicClient, http, formatEther, formatUnits } from 'viem'
import { ARC_TESTNET_CONFIG } from '@/config/arc-testnet'
import { formatDistanceToNow } from 'date-fns'

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
  transport: http(ARC_TESTNET_CONFIG.rpcUrls[0], {
    timeout: 30000,
    retryCount: 3,
    retryDelay: 1000,
  }),
})

export interface RecentTransaction {
  hash: string
  from: string
  to: string | null
  value: string
  timestamp: number
  blockNumber: bigint
  status: 'success' | 'pending' | 'failed'
  type: string
  miner?: string
  formattedTime: string
}

/**
 * Busca transações recentes via API do Blockscout (ARC Scan)
 * Igual ao que aparece em https://testnet.arcscan.app/
 */
async function fetchRecentTransactionsFromExplorer(): Promise<RecentTransaction[]> {
  const explorerUrl = ARC_TESTNET_CONFIG.blockExplorerUrls[0]
  
  try {
    console.log('🔍 Buscando transações via ARC Scan API...')
    console.log('🌐 Explorer URL:', explorerUrl)
    
    // Método 1: Buscar transações diretamente via API do ARC Scan
    // API do Blockscout para transações recentes (múltiplos endpoints)
    // Priorizar endpoints que funcionam melhor com ARC Scan
    const apiEndpoints = [
      // Endpoints principais do Blockscout v2 (ARC Scan usa Blockscout)
      // Tentar sem parâmetros primeiro (alguns APIs retornam padrão)
      `${explorerUrl}/api/v2/transactions`,
      `${explorerUrl}/api/v2/transactions?page=1&page_size=50`,
      `${explorerUrl}/api/v2/transactions?page=1&page_size=50&sort=desc`,
      `${explorerUrl}/api/v2/transactions?filter=to%20OR%20from&page=1&page_size=50`,
      `${explorerUrl}/api/v2/transactions?page=1&page_size=100`,
      `${explorerUrl}/api/v2/transactions?page=1&page_size=20`,
      // Endpoints v1 (fallback)
      `${explorerUrl}/api/v1/transactions?limit=50&sort=desc`,
      `${explorerUrl}/api/v1/txs?limit=50&sort=desc`,
      `${explorerUrl}/api/transactions?limit=50`,
      // Endpoints alternativos do Blockscout
      `${explorerUrl}/api/v2/transactions?filter=to&page=1&page_size=50`,
      `${explorerUrl}/api/v2/transactions?filter=from&page=1&page_size=50`,
    ]
    
    for (const endpoint of apiEndpoints) {
      try {
        console.log(`   Tentando: ${endpoint}`)
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 15000)
        
        const response = await fetch(endpoint, {
          method: 'GET',
          headers: { 
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          },
          signal: controller.signal,
        })
        
        clearTimeout(timeoutId)
        
        if (response.ok) {
          const data = await response.json()
          console.log('✅ Resposta recebida da API:', Object.keys(data))
          
          // Blockscout retorna em diferentes formatos
          let txs: any[] = []
          
          // Tentar diferentes formatos de resposta
          if (data.items && Array.isArray(data.items)) {
            txs = data.items
            console.log(`   ✅ Encontrado ${txs.length} transações em data.items`)
          } else if (data.data && Array.isArray(data.data)) {
            txs = data.data
            console.log(`   ✅ Encontrado ${txs.length} transações em data.data`)
          } else if (Array.isArray(data)) {
            txs = data
            console.log(`   ✅ Encontrado ${txs.length} transações no array direto`)
          } else if (data.result && Array.isArray(data.result)) {
            txs = data.result
            console.log(`   ✅ Encontrado ${txs.length} transações em data.result`)
          } else if (data.transactions && Array.isArray(data.transactions)) {
            txs = data.transactions
            console.log(`   ✅ Encontrado ${txs.length} transações em data.transactions`)
          } else if (data.results && Array.isArray(data.results)) {
            txs = data.results
            console.log(`   ✅ Encontrado ${txs.length} transações em data.results`)
          }
          
          // Se ainda não encontrou, tentar buscar em objetos aninhados
          if (txs.length === 0 && typeof data === 'object') {
            for (const key in data) {
              if (Array.isArray(data[key]) && data[key].length > 0) {
                // Verificar se parece ser um array de transações
                const firstItem = data[key][0]
                if (firstItem && (firstItem.hash || firstItem.tx_hash || firstItem.transactionHash)) {
                  txs = data[key]
                  console.log(`   ✅ Encontrado ${txs.length} transações em data.${key}`)
                  break
                }
              }
            }
          }
          
          if (txs.length > 0) {
            console.log(`✅ ✅ ✅ ${txs.length} transações encontradas via Blockscout API!`)
            
            const formattedTxs = txs.slice(0, 50).map((tx: any) => {
              // Processar diferentes formatos de resposta do Blockscout
              const hash = tx.hash || tx.tx_hash || tx.transaction_hash || tx.transactionHash || ''
              const from = tx.from?.address || tx.from || tx.from_address || ''
              const to = tx.to?.address || tx.to || tx.to_address || null
              
              // Converter valor - USDC na ARC Testnet usa 6 decimais
              // SEMPRE usar 6 decimais para garantir valores corretos
              let value = '0'
              if (tx.value) {
                try {
                  const valueStr = typeof tx.value === 'string' ? tx.value.trim() : String(tx.value).trim()
                  
                  // Se já está formatado com ponto decimal, usar diretamente
                  if (valueStr.includes('.')) {
                    const numValue = parseFloat(valueStr)
                    if (!isNaN(numValue) && numValue > 0) {
                      value = numValue.toString()
                    }
                  } else {
                    // Valor em wei - SEMPRE converter usando 6 decimais para USDC
                    const valueBigInt = BigInt(valueStr)
                    // Converter de wei para USDC usando 6 decimais (padrão ARC Testnet)
                    const converted = formatUnits(valueBigInt, 6)
                    const numConverted = parseFloat(converted)
                    value = numConverted.toString()
                  }
                } catch (error: any) {
                  console.warn(`   ⚠️ Erro ao converter valor ${tx.value}:`, error.message)
                  value = '0'
                }
              }
              
              // Timestamp
              const timestamp = tx.timestamp || tx.block_timestamp || tx.timeStamp || Date.now() / 1000
              
              // Status
              let status: 'success' | 'pending' | 'failed' = 'pending'
              if (tx.status === 'success' || tx.status === 1 || tx.txreceipt_status === '1') {
                status = 'success'
              } else if (tx.status === 'failed' || tx.status === 0 || tx.txreceipt_status === '0') {
                status = 'failed'
              }
              
              // Tipo de transação
              let type = 'Transfer'
              if (tx.method) type = tx.method
              else if (tx.type) type = tx.type
              else if (!to) type = 'Contract Creation'
              else if (tx.input && tx.input !== '0x' && tx.input.length > 2) {
                const methodId = tx.input.slice(0, 10)
                if (methodId === '0xa9059cbb') type = 'Transfer'
                else if (methodId === '0x095ea7b3') type = 'Approve'
                else if (methodId === '0x7ff36ab5' || methodId === '0x38ed1739') type = 'Swap'
                else type = 'Contract Call'
              }
              
              // Buscar minerador do bloco
              const blockNumber = BigInt(tx.block_number || tx.blockNumber || tx.block || '0')
              const miner = tx.block?.miner || tx.miner || ''
              
              return {
                hash,
                from,
                to,
                value,
                timestamp: typeof timestamp === 'number' ? timestamp : Number(timestamp),
                blockNumber,
                status,
                type,
                miner,
                formattedTime: formatDistanceToNow(new Date(Number(timestamp) * 1000), { addSuffix: true }),
              }
            })
            // FILTRAR: Mostrar transferências e outras transações válidas
            const validTxs = formattedTxs.filter(tx => {
              // Filtrar transações inválidas
              if (!tx.hash || tx.hash.length === 0 || !tx.from || tx.from.length === 0) {
                return false
              }
              // Mostrar transferências e outras transações com valor ou tipo definido
              return tx.type === 'Transfer' || tx.type === 'Contract Call' || tx.type === 'Swap' || tx.value !== '0'
            })
            
            console.log(`📊 ${validTxs.length} transações válidas de ${formattedTxs.length} transações totais`)
            if (validTxs.length > 0) {
              console.log('✅ Primeiras transações:', validTxs.slice(0, 3).map(tx => ({
                hash: tx.hash.slice(0, 16) + '...',
                from: tx.from.slice(0, 10) + '...',
                to: tx.to?.slice(0, 10) + '...',
                value: tx.value,
                type: tx.type,
              })))
            }
            return validTxs
          }
        } else {
          console.warn(`   Resposta não OK: ${response.status} ${response.statusText}`)
          // Tentar ler o corpo da resposta para debug
          try {
            const errorText = await response.text()
            if (errorText) {
              console.warn(`   Corpo da resposta:`, errorText.substring(0, 200))
            }
          } catch {
            // Ignorar erros ao ler corpo
          }
        }
      } catch (error: any) {
        if (error.name === 'AbortError') {
          console.warn(`   Timeout ao buscar de ${endpoint}`)
        } else {
          console.warn(`   Erro ao buscar de ${endpoint}:`, error.message)
        }
        continue
      }
    }
    
    // Método 2: Buscar através de blocos recentes do ARC Scan
    console.log('🔄 Tentando buscar transações através de blocos recentes do ARC Scan...')
    const blocksController = new AbortController()
    const blocksTimeoutId = setTimeout(() => blocksController.abort(), 15000)
    
    let blocksResponse: Response | null = null
    try {
      blocksResponse = await fetch(`${explorerUrl}/api/v2/blocks?page=1&page_size=20`, {
        method: 'GET',
        headers: { 
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
        signal: blocksController.signal,
      })
      clearTimeout(blocksTimeoutId)
    } catch (error: any) {
      clearTimeout(blocksTimeoutId)
      console.warn('⚠️ Erro ao buscar blocos:', error.message)
      blocksResponse = null
    }
    
    if (blocksResponse && blocksResponse.ok) {
      const blocksData = await blocksResponse.json()
      const blocks = blocksData.items || blocksData.data || blocksData.results || []
      
      if (blocks.length > 0) {
        console.log(`✅ Encontrados ${blocks.length} blocos recentes, buscando transações...`)
        const transactions: RecentTransaction[] = []
        
        // Buscar transações de cada bloco
        for (const block of blocks.slice(0, 10)) {
          const blockNumber = block.number || block.block_number
          if (!blockNumber) continue
          
          try {
            const blockTxResponse = await fetch(
              `${explorerUrl}/api/v2/blocks/${blockNumber}/transactions`,
              {
                method: 'GET',
                headers: { 
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                },
                signal: AbortSignal.timeout(10000),
              }
            )
            
            if (blockTxResponse.ok) {
              const blockTxData = await blockTxResponse.json()
              const blockTxs = blockTxData.items || blockTxData.data || blockTxData.results || []
              
              for (const tx of blockTxs) {
                if (transactions.length >= 20) break
                
                const hash = tx.hash || tx.tx_hash || tx.transaction_hash || ''
                const from = tx.from?.address || tx.from || tx.from_address || ''
                
                if (hash && from) {
                  const to = tx.to?.address || tx.to || tx.to_address || null
                  
                  let value = '0'
                  if (tx.value) {
                    try {
                      const valueStr = typeof tx.value === 'string' ? tx.value.trim() : String(tx.value).trim()
                      if (valueStr.includes('.')) {
                        const numValue = parseFloat(valueStr)
                        if (!isNaN(numValue) && numValue > 0) {
                          value = numValue.toString()
                        }
                      } else {
                        const valueBigInt = BigInt(valueStr)
                        const converted = formatUnits(valueBigInt, 6)
                        const numConverted = parseFloat(converted)
                        value = numConverted.toString()
                      }
                    } catch {
                      value = '0'
                    }
                  }
                  
                  const timestamp = tx.timestamp || tx.block_timestamp || block.timestamp || Date.now() / 1000
                  
                  let status: 'success' | 'pending' | 'failed' = 'pending'
                  if (tx.status === 'success' || tx.status === 1 || tx.txreceipt_status === '1') {
                    status = 'success'
                  } else if (tx.status === 'failed' || tx.status === 0 || tx.txreceipt_status === '0') {
                    status = 'failed'
                  }
                  
                  let type = 'Transfer'
                  if (tx.method) type = tx.method
                  else if (tx.type) type = tx.type
                  else if (!to) type = 'Contract Creation'
                  else if (tx.input && tx.input !== '0x' && tx.input.length > 2) {
                    const methodId = tx.input.slice(0, 10)
                    if (methodId === '0xa9059cbb') type = 'Transfer'
                    else if (methodId === '0x095ea7b3') type = 'Approve'
                    else if (methodId === '0x7ff36ab5' || methodId === '0x38ed1739') type = 'Swap'
                    else type = 'Contract Call'
                  }
                  
                  transactions.push({
                    hash,
                    from,
                    to,
                    value,
                    timestamp: typeof timestamp === 'number' ? timestamp : Number(timestamp),
                    blockNumber: BigInt(blockNumber),
                    status,
                    type,
                    miner: block.miner || '',
                    formattedTime: formatDistanceToNow(new Date(Number(timestamp) * 1000), { addSuffix: true }),
                  })
                }
              }
            }
          } catch (error: any) {
            console.warn(`   Erro ao buscar transações do bloco ${blockNumber}:`, error.message)
            continue
          }
          
          if (transactions.length >= 20) break
        }
        
        if (transactions.length > 0) {
          console.log(`✅ ✅ ✅ ${transactions.length} transações encontradas através de blocos recentes!`)
          return transactions.slice(0, 20)
        }
      }
    }
    
    console.warn('⚠️ Nenhuma transação encontrada via ARC Scan API')
    return []
  } catch (error: any) {
    console.error('❌ Erro ao buscar via ARC Scan API:', error)
    return []
  }
}

/**
 * Busca transações diretamente via RPC da blockchain ARC Testnet
 * FALLBACK quando a API do Blockscout não funciona
 */
async function fetchRecentTransactionsViaRPC(): Promise<RecentTransaction[]> {
  console.log('🔄 Buscando transações via RPC direto (fallback)...')
  console.log('🔗 RPC:', ARC_TESTNET_CONFIG.rpcUrls[0])
  
  try {
    // Buscar bloco mais recente
    const latestBlock = await publicClient.getBlockNumber()
    console.log('✅ Bloco mais recente:', latestBlock.toString())
    
    // ESCANEAR BLOCOS para garantir que encontre transações REAIS
    const blocksToScan = 2000 // Escanear mais blocos para garantir transações REAIS
    const transactions: RecentTransaction[] = []
    const seenHashes = new Set<string>()
    
    console.log(`🔍 Escaneando ${blocksToScan} blocos da ARC Testnet para encontrar transações REAIS...`)
    console.log('🌐 RPC Endpoint:', ARC_TESTNET_CONFIG.rpcUrls[0])
    console.log('🔗 Chain ID:', ARC_TESTNET_CONFIG.chainId)
    
    // Buscar blocos sequencialmente (mais confiável)
    // Aumentar limite para garantir que encontre transações
    for (let i = 0; i < blocksToScan && transactions.length < 20; i++) {
      try {
        const blockNumber = latestBlock - BigInt(i)
        
        const block = await publicClient.getBlock({
          blockNumber,
          includeTransactions: true,
        })
        
        if (block.transactions && block.transactions.length > 0) {
          console.log(`📦 Bloco ${blockNumber.toString()}: ${block.transactions.length} transações REAIS encontradas`)
          
          for (const tx of block.transactions) {
            if (transactions.length >= 20) break
            
            if (typeof tx === 'object' && tx !== null && 'hash' in tx) {
              const txHash = tx.hash as string
              
              // Pular transações duplicadas
              if (seenHashes.has(txHash)) {
                continue
              }
              seenHashes.add(txHash)
              
              console.log(`   📝 Processando TX: ${txHash.slice(0, 16)}...`)
              
              // USDC na ARC Testnet usa 6 decimais - converter corretamente
              let value = '0'
              if (tx.value) {
                try {
                  // Converter de wei para USDC usando 6 decimais
                  const valueBigInt = typeof tx.value === 'bigint' 
                    ? tx.value 
                    : BigInt(String(tx.value))
                  value = formatUnits(valueBigInt, 6)
                  } catch {
                  value = '0'
                }
                  }
              const from = tx.from || ''
              const to = tx.to || null
              
              // Determinar tipo de transação
              let type = 'Transfer'
              if (!to) {
                type = 'Contract Creation'
              } else if (tx.input && tx.input !== '0x' && tx.input.length > 2) {
                const methodId = tx.input.slice(0, 10)
                if (methodId === '0xa9059cbb') type = 'Transfer'
                else if (methodId === '0x095ea7b3') type = 'Approve'
                else if (methodId === '0x7ff36ab5' || methodId === '0x38ed1739') type = 'Swap'
                else type = 'Contract Call'
              }
              
              // FILTRAR: apenas transferências e transações válidas
              if (!from || from.length === 0) {
                continue // Pular transações sem remetente
              }
              // Mostrar transferências e outras transações válidas
              if (type !== 'Transfer' && type !== 'Contract Call' && type !== 'Swap' && (!value || value === '0')) {
                continue // Pular apenas transações que não são relevantes
              }
              
              // Status (não bloquear se falhar)
              let status: 'success' | 'failed' | 'pending' = 'pending'
              try {
                const receipt = await Promise.race([
                  publicClient.getTransactionReceipt({ hash: txHash as `0x${string}` }),
                  new Promise<any>((_, reject) => setTimeout(() => reject(new Error('Timeout')), 2000))
                ])
                status = receipt.status === 'success' ? 'success' : 'failed'
              } catch {
                status = 'pending'
              }
              
              // Buscar minerador do bloco
              const miner = block.miner || ''
              
              transactions.push({
                hash: txHash,
                from,
                to,
                value,
                timestamp: Number(block.timestamp),
                blockNumber: block.number,
                status,
                type,
                miner,
                formattedTime: formatDistanceToNow(new Date(Number(block.timestamp) * 1000), {
                  addSuffix: true,
                }),
              })
              
              console.log(`✅ TX ${transactions.length}/20: ${txHash.slice(0, 10)}...`)
              
              if (transactions.length >= 20) break
            }
          }
        }
        
          if (transactions.length >= 15) break
      } catch (error: any) {
        // Continuar mesmo com erro
        if (i < 10) {
          console.warn(`⚠️ Erro no bloco ${i}:`, error.message)
        }
        continue
      }
    }
    
    // Ordenar por timestamp (mais recentes primeiro)
    transactions.sort((a, b) => b.timestamp - a.timestamp)
    const result = transactions.slice(0, 20)
    
    if (result.length > 0) {
      console.log(`✅ ✅ ✅ SUCESSO! ${result.length} transações encontradas via RPC`)
      console.log('📊 Primeira transação:', {
        hash: result[0].hash,
        from: result[0].from,
        to: result[0].to,
        value: result[0].value,
        type: result[0].type,
      })
      return result
    }
    
    console.warn(`⚠️ Nenhuma transação encontrada após escanear ${blocksToScan} blocos`)
    console.warn('💡 Isso pode significar que:')
    console.warn('   1. A rede ARC Testnet está com pouca atividade no momento')
    console.warn('   2. Os blocos escaneados não contêm transações')
    console.warn('   3. Há um problema de conexão com o RPC')
    
    return []
  } catch (error: any) {
    console.error('❌ Erro ao buscar via RPC:', error.message)
    return []
  }
}

/**
 * Busca transações recentes da blockchain ARC Testnet
 * ESTRATÉGIA: Priorizar ARC Scan API (rápido) > RPC direto (garante dados reais)
 */
async function fetchRecentTransactions(): Promise<RecentTransaction[]> {
  console.log('🚀 🚀 🚀 INICIANDO BUSCA DE TRANSAÇÕES REAIS DA BLOCKCHAIN ARC TESTNET')
  console.log('🔍 Explorer:', ARC_TESTNET_CONFIG.blockExplorerUrls[0])
  console.log('🔗 RPC:', ARC_TESTNET_CONFIG.rpcUrls[0])
  console.log('🔗 Chain ID:', ARC_TESTNET_CONFIG.chainId)
  
  // PRIORIDADE 1: Buscar via ARC Scan API (mais rápido e confiável)
  console.log('📡 Buscando transações via ARC Scan API...')
  try {
    const arcScanTxs = await Promise.race([
      fetchRecentTransactionsFromExplorer(),
      new Promise<RecentTransaction[]>((_, reject) => 
        setTimeout(() => reject(new Error('Timeout ARC Scan API')), 20000)
      )
    ])
    
    if (arcScanTxs && arcScanTxs.length > 0) {
      console.log(`✅ ✅ ✅ ${arcScanTxs.length} TRANSAÇÕES encontradas via ARC Scan API!`)
      console.log('📊 Primeiras transações:', arcScanTxs.slice(0, 3).map(tx => ({
        hash: tx.hash.slice(0, 16) + '...',
        from: tx.from.slice(0, 10) + '...',
        to: tx.to?.slice(0, 10) + '...',
        value: tx.value,
        type: tx.type,
      })))
      return arcScanTxs
    }
  } catch (error: any) {
    console.warn('⚠️ Erro ao buscar via ARC Scan API:', error.message)
  }
  
  // PRIORIDADE 2: Fallback para RPC direto (mais lento mas garante dados reais)
  console.log('🔄 ARC Scan API não retornou transações, tentando RPC direto...')
  console.log('🌐 Conectando diretamente à blockchain ARC Testnet via RPC...')
  try {
    const rpcTxs = await Promise.race([
      fetchRecentTransactionsViaRPC(),
      new Promise<RecentTransaction[]>((_, reject) => 
        setTimeout(() => reject(new Error('Timeout RPC')), 30000)
      )
    ])
    
    if (rpcTxs && rpcTxs.length > 0) {
      console.log(`✅ ${rpcTxs.length} TRANSAÇÕES REAIS encontradas diretamente da blockchain ARC Testnet!`)
      console.log('📊 Primeiras transações:', rpcTxs.slice(0, 3).map(tx => ({
        hash: tx.hash.slice(0, 16) + '...',
        from: tx.from.slice(0, 10) + '...',
        value: tx.value,
        type: tx.type,
        blockNumber: tx.blockNumber.toString(),
      })))
      return rpcTxs
    }
  } catch (error: any) {
    console.warn('⚠️ Erro ao buscar via RPC:', error.message)
  }
  
  console.warn('❌ Nenhuma transação encontrada após todas as tentativas')
  console.warn('💡 Verifique:')
  console.warn('   1. Conexão com o ARC Scan:', ARC_TESTNET_CONFIG.blockExplorerUrls[0])
  console.warn('   2. Conexão com o RPC:', ARC_TESTNET_CONFIG.rpcUrls[0])
  console.warn('   3. Se a rede ARC Testnet está ativa')
  console.warn('   4. Se há transações recentes na rede')
  console.warn('   5. Abra o console do navegador (F12) para ver logs detalhados')
  return []
}

/**
 * Hook para buscar transações recentes
 */
export function useRecentTransactions() {
  return useQuery({
    queryKey: ['recent-transactions-arc-testnet'],
    queryFn: fetchRecentTransactions,
    staleTime: 0, // Sempre considerar stale para atualização constante
    refetchInterval: 5000, // Atualizar a cada 5 segundos (como estava antes)
    refetchIntervalInBackground: true, // Continuar atualizando mesmo em background
    retry: 3, // Tentar 3 vezes em caso de erro (como estava antes)
    retryDelay: 1000, // Esperar 1s entre tentativas (como estava antes)
    gcTime: 10000, // Manter em cache por 10 segundos (como estava antes)
    refetchOnWindowFocus: true, // Atualizar quando janela ganha foco
    refetchOnMount: true, // Atualizar ao montar componente
    refetchOnReconnect: true, // Atualizar ao reconectar
    // Continuar tentando mesmo quando há erro
    retryOnMount: true,
  })
}
