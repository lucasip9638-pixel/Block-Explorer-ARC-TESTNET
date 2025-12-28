import { useQuery } from '@tanstack/react-query'
import { createPublicClient, http, formatUnits } from 'viem'
import { ARC_TESTNET_CONFIG } from '@/config/arc-testnet'
import { formatDistanceToNow } from 'date-fns'

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
  transport: http(ARC_TESTNET_CONFIG.rpcUrls[0], {
    timeout: 30000,
    retryCount: 3,
    retryDelay: 1000,
  }),
})

export interface TokenTransfer {
  from: string
  to: string
  token: {
    address: string
    symbol: string
    name: string
    decimals: number
  }
  value: string
  type: string
}

export interface TransactionDetails {
  hash: string
  from: string
  to: string | null
  value: string
  gasUsed: string
  gasPrice: string // Valor em Gwei (formatado)
  gasPriceRaw?: string // Valor original em wei
  gasLimit: string
  timestamp: number
  blockNumber: bigint
  blockHash: string
  status: 'success' | 'failed' | 'pending'
  type: string
  input: string
  nonce: number
  transactionIndex: number
  formattedTime: string
  // Campos adicionais do ARC Scan
  confirmations?: number
  fee?: string
  transactionBurntFee?: string
  maxFeePerGas?: string
  maxPriorityFeePerGas?: string
  baseFeePerGas?: string
  priorityFee?: string
  method?: string
  decodedInput?: {
    methodCall: string
    methodId: string
    parameters: Array<{ name: string; type: string; value: string }>
  }
  tokenTransfers?: TokenTransfer[]
  createdContract?: string | null
  revertReason?: string | null
  transactionTypes?: string[]
}

/**
 * Busca detalhes de uma transação via API do Blockscout (ARC Scan)
 */
async function fetchTransactionDetailsFromExplorer(txHash: string): Promise<TransactionDetails | null> {
  const explorerUrl = ARC_TESTNET_CONFIG.blockExplorerUrls[0]
  
  try {
    console.log('🔍 Buscando detalhes da transação via Blockscout API:', txHash)
    
    // Endpoints da API do Blockscout (ARC Scan) - EXATAMENTE como o ARC Scan usa
    // Prioridade: summary endpoint (mesmo que o ARC Scan usa) > outros endpoints
    const apiEndpoints = [
      // ENDPOINT PRINCIPAL: /summary (mesmo que o ARC Scan usa!)
      `${explorerUrl}/api/v2/transactions/${txHash}/summary`,
      // API v2 do Blockscout (formato completo)
      `${explorerUrl}/api/v2/transactions/${txHash}`,
      // API v2 com parâmetros
      `${explorerUrl}/api/v2/transactions/${txHash}?type=json`,
      // API v1 (fallback)
      `${explorerUrl}/api/v1/transactions/${txHash}`,
      // API direta
      `${explorerUrl}/api/transactions/${txHash}`,
      // Proxy Etherscan-like
      `${explorerUrl}/api?module=proxy&action=eth_getTransactionByHash&txhash=${txHash}`,
      // Endpoint alternativo (lowercase)
      `${explorerUrl}/api/v2/transactions/${txHash.toLowerCase()}/summary`,
      `${explorerUrl}/api/v2/transactions/${txHash.toLowerCase()}`,
    ]
    
    for (const endpoint of apiEndpoints) {
      try {
        console.log(`   🔗 Tentando endpoint: ${endpoint}`)
        const response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0',
          },
          signal: AbortSignal.timeout(15000), // Aumentado para 15 segundos
        })
        
        console.log(`   📊 Status da resposta: ${response.status} ${response.statusText}`)
        
        // Processar resposta mesmo se status não for 200 (algumas APIs retornam dados com outros status)
        const statusOk = response.ok || response.status === 200 || response.status === 201
        
        if (statusOk || response.status < 500) {
          let data: any
          try {
            data = await response.json()
          } catch (parseError) {
            const text = await response.text()
            console.warn(`   ⚠️ Resposta não é JSON válido:`, text.slice(0, 200))
            continue
          }
          
          console.log(`✅ Resposta recebida da API (status: ${response.status}):`, {
            keys: Object.keys(data),
            hasItem: !!data.item,
            hasData: !!data.data,
            hasResult: !!data.result,
            isArray: Array.isArray(data),
            hasHash: !!(data.hash || data.item?.hash || data.data?.hash),
            preview: JSON.stringify(data).slice(0, 500),
          })
          
          // Processar resposta do Blockscout em diferentes formatos
          // Suportar TODOS os formatos que o ARC Scan pode retornar
          let tx: any = null
          
          // Formato 1: Objeto direto (formato principal do ARC Scan v2)
          // O ARC Scan retorna os dados diretamente no objeto raiz
          if (data.hash || data.tx_hash || data.transaction_hash || data.transactionHash) {
            tx = data
            console.log('   📦 Usando objeto direto (formato ARC Scan v2)')
          }
          // Formato 2: data.transaction (summary endpoint)
          else if (data.transaction) {
            tx = data.transaction
            console.log('   📦 Usando formato data.transaction')
          }
          // Formato 3: data.item (formato Blockscout v2)
          else if (data.item) {
            tx = data.item
            console.log('   📦 Usando formato data.item')
          }
          // Formato 4: data.data
          else if (data.data) {
            tx = data.data
            console.log('   📦 Usando formato data.data')
          }
          // Formato 5: data.result
          else if (data.result) {
            tx = data.result
            console.log('   📦 Usando formato data.result')
          }
          // Formato 6: array com um item
          else if (Array.isArray(data) && data.length > 0) {
            tx = data[0]
            console.log('   📦 Usando array[0]')
          }
          // Formato 7: dados aninhados em summary
          else if (data.summary && data.summary.transaction) {
            tx = data.summary.transaction
            console.log('   📦 Usando formato data.summary.transaction')
          }
          
          // Verificar se encontrou uma transação válida
          if (tx && (tx.hash || tx.tx_hash || tx.transaction_hash || tx.transactionHash || txHash)) {
            // Normalizar hash - usar o hash da resposta ou o fornecido
            const hash = tx.hash || tx.tx_hash || tx.transaction_hash || tx.transactionHash || txHash
            
            console.log('   ✅ Transação encontrada! Hash:', hash.slice(0, 20) + '...')
            
            // Extrair endereços - suportar diferentes formatos (ARC Scan usa objeto com hash)
            let from = ''
            if (tx.from) {
              if (typeof tx.from === 'string') {
                from = tx.from
              } else if (tx.from.hash) {
                // Formato ARC Scan: { hash: "0x..." }
                from = tx.from.hash
              } else if (tx.from.address) {
                from = tx.from.address
              }
            } else if (tx.from_address) {
              from = tx.from_address
            } else if (tx.from_hash) {
              from = tx.from_hash
            }
            
            let to: string | null = null
            if (tx.to) {
              if (typeof tx.to === 'string') {
                to = tx.to
              } else if (tx.to.hash) {
                // Formato ARC Scan: { hash: "0x..." }
                to = tx.to.hash
              } else if (tx.to.address) {
                to = tx.to.address
              }
            } else if (tx.to_address) {
              to = tx.to_address
            } else if (tx.to_hash) {
              to = tx.to_hash
            }
            
            // Garantir que from não está vazio
            if (!from && tx.from) {
              from = String(tx.from)
            }
            
            console.log('   📍 Endereços extraídos:', {
              from: from.slice(0, 12) + '...',
              to: to?.slice(0, 12) + '...' || 'null',
            })
            
            // Converter valor (USDC usa 6 decimais na ARC Testnet)
            // O ARC Scan pode retornar valor em diferentes formatos
            let value = '0'
            if (tx.value) {
              try {
                const valueBigInt = typeof tx.value === 'string' 
                  ? BigInt(tx.value) 
                  : BigInt(tx.value.toString())
                // USDC na ARC Testnet usa 6 decimais
                value = formatUnits(valueBigInt, 6)
                console.log('   💰 Valor convertido:', value, 'USDC')
              } catch (error: any) {
                console.warn('   ⚠️ Erro ao converter valor:', error.message)
                value = '0'
              }
            }
            
            // Se não encontrou valor direto, tentar buscar de token_transfers
            if (value === '0' && tx.token_transfers && Array.isArray(tx.token_transfers) && tx.token_transfers.length > 0) {
              // Somar valores de todas as transferências de tokens
              try {
                let totalValue = BigInt(0)
                for (const transfer of tx.token_transfers) {
                  if (transfer.total && transfer.total.value) {
                    const transferValue = BigInt(transfer.total.value)
                    totalValue += transferValue
                  }
                }
                if (totalValue > 0) {
                  // Usar decimais do token (geralmente 6 para USDC)
                  const decimals = tx.token_transfers[0]?.token?.decimals || 6
                  value = formatUnits(totalValue, decimals)
                  console.log('   💰 Valor calculado de token_transfers:', value, 'USDC')
                }
              } catch (error: any) {
                console.warn('   ⚠️ Erro ao calcular valor de token_transfers:', error.message)
              }
            }
            
            // Timestamp - buscar em múltiplos campos e formatos
            // ARC Scan retorna timestamp em formato ISO string: "2025-12-28T16:48:07.000000Z"
            let timestamp: number = 0
            
            if (tx.timestamp) {
              if (typeof tx.timestamp === 'string' && tx.timestamp.includes('T')) {
                // Formato ISO string do ARC Scan
                timestamp = new Date(tx.timestamp).getTime() / 1000
                console.log('   🕐 Timestamp ISO convertido:', tx.timestamp, '->', timestamp)
              } else if (typeof tx.timestamp === 'number') {
                timestamp = tx.timestamp
              } else {
                timestamp = Number(tx.timestamp) || 0
              }
            } else if (tx.block_timestamp) {
              timestamp = typeof tx.block_timestamp === 'number' ? tx.block_timestamp : Number(tx.block_timestamp) || 0
            } else if (tx.timeStamp) {
              timestamp = typeof tx.timeStamp === 'number' ? tx.timeStamp : Number(tx.timeStamp) || 0
            }
            
            // Se ainda não encontrou, usar timestamp atual
            if (!timestamp || timestamp === 0) {
              timestamp = Date.now() / 1000
              console.warn('   ⚠️ Timestamp não encontrado, usando timestamp atual')
            }
            
            // Status - verificar múltiplos campos (ARC Scan usa "ok" e "success")
            let status: 'success' | 'failed' | 'pending' = 'pending'
            const statusValue = tx.status || tx.result || tx.txreceipt_status || tx.success
            
            // ARC Scan retorna status: "ok" ou result: "success"
            if (statusValue === 'success' || statusValue === 'ok' || statusValue === 1 || statusValue === '1' || statusValue === true) {
              status = 'success'
              console.log('   ✅ Status: Sucesso')
            } else if (statusValue === 'failed' || statusValue === 'error' || statusValue === 0 || statusValue === '0' || statusValue === false) {
              status = 'failed'
              console.log('   ❌ Status: Falhou')
            } else if (tx.confirmations !== undefined && tx.confirmations > 0) {
              // Se tem confirmações, provavelmente foi bem-sucedida
              status = 'success'
              console.log('   ✅ Status: Sucesso (baseado em confirmações)')
            } else {
              console.log('   ⏳ Status: Pendente')
            }
            
            // Tipo de transação (ARC Scan retorna method e transaction_types)
            let type = 'Transfer'
            let methodName = undefined
            
            // Prioridade 1: método decodificado (ARC Scan)
            // O ARC Scan pode retornar o método como hash (0x84a3bb6b) ou nome (onChainGM)
            if (tx.method) {
              // Se é um hash (começa com 0x e tem mais de 2 caracteres), tentar buscar o nome
              if (tx.method.startsWith('0x') && tx.method.length > 10) {
                // É um hash de método, vamos usar o decoded_input se disponível
                methodName = tx.method
                // Se tem decoded_input, usar o nome do método de lá
                if (tx.decoded_input && tx.decoded_input.method_call) {
                  methodName = tx.decoded_input.method_call.split('(')[0] // Pegar só o nome do método
                  type = methodName
                } else {
                  type = 'Contract Call'
                }
              } else {
                // É um nome de método direto
                methodName = tx.method
                type = tx.method
              }
              console.log('   📝 Método encontrado:', methodName)
            }
            // Prioridade 2: transaction_types array (ARC Scan)
            else if (tx.transaction_types && Array.isArray(tx.transaction_types) && tx.transaction_types.length > 0) {
              // Pegar o primeiro tipo mais relevante
              const types = tx.transaction_types.filter((t: string) => 
                t !== 'contract_call' && t !== 'token_transfer'
              )
              if (types.length > 0) {
                type = types[0].replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())
              } else {
                type = tx.transaction_types[0].replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())
              }
              console.log('   📝 Tipo dos transaction_types:', type)
            }
            // Prioridade 3: tipo direto
            else if (tx.type) {
              type = typeof tx.type === 'number' ? `Type ${tx.type}` : tx.type
            }
            // Prioridade 4: verificar se é criação de contrato
            else if (!to || tx.created_contract) {
              type = 'Contract Creation'
            }
            // Prioridade 5: verificar input data
            else if (tx.input && tx.input !== '0x' && tx.input.length > 2) {
              const methodId = tx.input.slice(0, 10)
              if (methodId === '0xa9059cbb') type = 'Transfer'
              else if (methodId === '0x095ea7b3') type = 'Approve'
              else if (methodId === '0x7ff36ab5' || methodId === '0x38ed1739') type = 'Swap'
              else type = 'Contract Call'
            }
            
            // Se tem token_transfers, pode ser Token Transfer
            if (tx.token_transfers && Array.isArray(tx.token_transfers) && tx.token_transfers.length > 0) {
              type = 'Token Transfer'
            }
            
            // Processar campos de gas (ARC Scan retorna como strings)
            const gasUsed = tx.gas_used || tx.gasUsed || tx.gas_used_raw || '0'
            const gasPrice = tx.gas_price || tx.gasPrice || tx.gas_price_raw || '0'
            const gasLimit = tx.gas_limit || tx.gasLimit || tx.gas || tx.gas_raw || '0'
            
            console.log('   ⛽ Gas:', {
              gasUsed,
              gasPrice,
              gasLimit,
              raw: {
                gas_used: tx.gas_used,
                gas_price: tx.gas_price,
                gas_limit: tx.gas_limit,
              }
            })
            
            // Processar número do bloco (ARC Scan retorna como número)
            const blockNumber = tx.block_number || tx.blockNumber || tx.block || tx.block_height || '0'
            
            console.log('   📦 Bloco:', {
              blockNumber,
              raw: {
                block_number: tx.block_number,
                blockNumber: tx.blockNumber,
                block: tx.block,
              }
            })
            
            // Processar hash do bloco
            const blockHash = tx.block_hash || tx.blockHash || ''
            
            // Processar input data
            const input = tx.input || tx.raw_input || tx.data || tx.input_data || '0x'
            
            // Processar nonce e índice
            const nonce = tx.nonce || tx.nonce_raw || 0
            const transactionIndex = tx.transaction_index || tx.transactionIndex || tx.index || tx.position || 0
            
            console.log('   🔢 Outros:', {
              nonce,
              transactionIndex,
              raw: {
                nonce: tx.nonce,
                transaction_index: tx.transaction_index,
                index: tx.index,
                position: tx.position,
              }
            })
            
            // Processar token transfers (ARC Scan fornece isso)
            const tokenTransfers: TokenTransfer[] = []
            if (tx.token_transfers && Array.isArray(tx.token_transfers)) {
              for (const transfer of tx.token_transfers) {
                try {
                  const transferFrom = typeof transfer.from === 'string' 
                    ? transfer.from 
                    : transfer.from?.hash || ''
                  const transferTo = typeof transfer.to === 'string' 
                    ? transfer.to 
                    : transfer.to?.hash || ''
                  const token = transfer.token || {}
                  const transferValue = transfer.total?.value || transfer.value || '0'
                  const decimals = transfer.total?.decimals || token.decimals || 6
                  
                  tokenTransfers.push({
                    from: transferFrom,
                    to: transferTo,
                    token: {
                      address: token.address_hash || token.address || '',
                      symbol: token.symbol || 'USDC',
                      name: token.name || 'USD Coin',
                      decimals: decimals,
                    },
                    value: formatUnits(BigInt(transferValue), decimals),
                    type: transfer.type || 'token_transfer',
                  })
                } catch (error: any) {
                  console.warn('   ⚠️ Erro ao processar token transfer:', error.message)
                }
              }
            }
            
            // Processar decoded input (ARC Scan fornece isso)
            let decodedInput = undefined
            if (tx.decoded_input) {
              decodedInput = {
                methodCall: tx.decoded_input.method_call || tx.decoded_input.methodCall || '',
                methodId: tx.decoded_input.method_id || tx.decoded_input.methodId || '',
                parameters: tx.decoded_input.parameters || [],
              }
            }
            
            // Processar fee (ARC Scan fornece isso)
            let fee = undefined
            if (tx.fee) {
              if (typeof tx.fee === 'object' && tx.fee.value) {
                fee = formatUnits(BigInt(tx.fee.value), 18) // Fee geralmente em wei (18 decimais)
              } else {
                fee = formatUnits(BigInt(tx.fee), 18)
              }
            }
            
            // Garantir que blockNumber seja um número válido
            let finalBlockNumber = blockNumber
            if (!finalBlockNumber || finalBlockNumber === '0') {
              // Tentar buscar de outros campos
              if (tx.block_number) finalBlockNumber = String(tx.block_number)
              else if (tx.blockNumber) finalBlockNumber = String(tx.blockNumber)
              else if (tx.block) finalBlockNumber = String(tx.block)
              else finalBlockNumber = '0'
            }
            
            // Garantir que gasPrice seja convertido corretamente para Gwei
            let gasPriceInGwei = '0'
            if (gasPrice && gasPrice !== '0') {
              try {
                // Converter de wei para Gwei (dividir por 10^9)
                const gasPriceBigInt = BigInt(gasPrice)
                gasPriceInGwei = formatUnits(gasPriceBigInt, 9)
              } catch {
                gasPriceInGwei = '0'
              }
            }
            
            console.log('   ✅ Valores finais processados:', {
              blockNumber: finalBlockNumber,
              gasUsed: String(gasUsed),
              gasPrice: String(gasPrice),
              gasPriceInGwei,
              gasLimit: String(gasLimit),
              nonce: Number(nonce),
              transactionIndex: Number(transactionIndex),
              timestamp,
            })
            
            const result: TransactionDetails = {
              hash,
              from,
              to,
              value,
              gasUsed: String(gasUsed),
              gasPrice: gasPriceInGwei, // Usar Gwei formatado
              gasPriceRaw: String(gasPrice), // Valor original em wei
              gasLimit: String(gasLimit),
              timestamp,
              blockNumber: BigInt(finalBlockNumber),
              blockHash: String(blockHash),
              status,
              type,
              input: String(input),
              nonce: Number(nonce),
              transactionIndex: Number(transactionIndex),
              formattedTime: formatDistanceToNow(new Date(timestamp * 1000), { addSuffix: true }),
              // Campos adicionais do ARC Scan
              confirmations: tx.confirmations || undefined,
              fee: fee,
              transactionBurntFee: tx.transaction_burnt_fee ? formatUnits(BigInt(tx.transaction_burnt_fee), 18) : undefined,
              maxFeePerGas: tx.max_fee_per_gas ? formatUnits(BigInt(tx.max_fee_per_gas), 9) : undefined,
              maxPriorityFeePerGas: tx.max_priority_fee_per_gas ? formatUnits(BigInt(tx.max_priority_fee_per_gas), 9) : undefined,
              baseFeePerGas: tx.base_fee_per_gas ? formatUnits(BigInt(tx.base_fee_per_gas), 9) : undefined,
              priorityFee: tx.priority_fee ? formatUnits(BigInt(tx.priority_fee), 9) : undefined,
              method: methodName || tx.method || undefined,
              decodedInput: decodedInput,
              tokenTransfers: tokenTransfers.length > 0 ? tokenTransfers : undefined,
              createdContract: tx.created_contract?.hash || tx.created_contract || null,
              revertReason: tx.revert_reason || undefined,
              transactionTypes: tx.transaction_types || undefined,
            }
            
            console.log('✅ ✅ ✅ Transação encontrada e formatada!', {
              hash: result.hash.slice(0, 16) + '...',
              from: result.from.slice(0, 10) + '...',
              blockNumber: result.blockNumber.toString(),
              status: result.status,
            })
            
            return result
          }
        }
      } catch (error: any) {
        console.warn(`   ⚠️ Erro ao buscar de ${endpoint}:`, error.message)
        if (error.name !== 'AbortError') {
          console.warn(`   📄 Detalhes do erro:`, error)
        }
        continue
      }
    }
    
    return null
  } catch (error: any) {
    console.error('❌ Erro ao buscar via Explorer API:', error)
    return null
  }
}

/**
 * Busca detalhes de uma transação via RPC direto (fallback)
 */
async function fetchTransactionDetailsViaRPC(txHash: string): Promise<TransactionDetails | null> {
  try {
    console.log('🔄 Buscando detalhes da transação via RPC direto:', txHash)
    
    const tx = await publicClient.getTransaction({ hash: txHash as `0x${string}` })
    const receipt = await publicClient.getTransactionReceipt({ hash: txHash as `0x${string}` })
    const block = await publicClient.getBlock({ blockNumber: receipt.blockNumber })
    
    // Converter valor (USDC usa 6 decimais)
    const value = tx.value ? formatUnits(tx.value, 6) : '0'
    const gasPrice = tx.gasPrice ? formatUnits(tx.gasPrice, 9) : '0' // Gwei = 9 decimais
    
    // Tipo de transação
    let type = 'Transfer'
    if (!tx.to) {
      type = 'Contract Creation'
    } else if (tx.input && tx.input !== '0x' && tx.input.length > 2) {
      const methodId = tx.input.slice(0, 10)
      if (methodId === '0xa9059cbb') type = 'Transfer'
      else if (methodId === '0x095ea7b3') type = 'Approve'
      else if (methodId === '0x7ff36ab5' || methodId === '0x38ed1739') type = 'Swap'
      else type = 'Contract Call'
    }
    
    return {
      hash: tx.hash,
      from: tx.from,
      to: tx.to,
      value,
      gasUsed: receipt.gasUsed.toString(),
      gasPrice,
      gasLimit: tx.gas.toString(),
      timestamp: Number(block.timestamp),
      blockNumber: receipt.blockNumber,
      blockHash: receipt.blockHash,
      status: receipt.status === 'success' ? 'success' : 'failed',
      type,
      input: tx.input,
      nonce: tx.nonce,
      transactionIndex: receipt.transactionIndex,
      formattedTime: formatDistanceToNow(new Date(Number(block.timestamp) * 1000), { addSuffix: true }),
    }
  } catch (error: any) {
    console.error('❌ Erro ao buscar via RPC:', error.message)
    return null
  }
}

/**
 * Busca detalhes de uma transação
 * PRIORIDADE: API do Blockscout (ARC Scan) > RPC direto
 * Integração completa com ARC Scan: https://testnet.arcscan.app/
 */
async function fetchTransactionDetails(txHash: string): Promise<TransactionDetails | null> {
  // Normalizar hash (remover espaços)
  const normalizedHash = txHash.trim()
  const hashLower = normalizedHash.toLowerCase()
  
  console.log('🚀 🚀 🚀 INICIANDO BUSCA DE TRANSAÇÃO (INTEGRAÇÃO ARC SCAN)')
  console.log('📋 Hash fornecido:', normalizedHash)
  console.log('📋 Hash length:', normalizedHash.length)
  console.log('🔍 Explorer URL:', ARC_TESTNET_CONFIG.blockExplorerUrls[0])
  console.log('🔗 RPC URL:', ARC_TESTNET_CONFIG.rpcUrls[0])
  console.log('🔗 Chain ID:', ARC_TESTNET_CONFIG.chainId)
  
  // Validar formato do hash
  if (!normalizedHash.startsWith('0x')) {
    console.error('❌ Hash inválido: deve começar com 0x')
    return null
  }
  
  if (normalizedHash.length < 10) {
    console.error('❌ Hash muito curto:', normalizedHash.length)
    return null
  }
  
  // PRIORIDADE 1: Buscar via API do Blockscout (igual ao ARC Scan)
  console.log('📡 PRIORIDADE 1: Buscando via Blockscout API (ARC Scan)...')
  const explorerTx = await fetchTransactionDetailsFromExplorer(normalizedHash)
  if (explorerTx) {
    console.log('✅ ✅ ✅ SUCESSO! Detalhes encontrados via Blockscout API')
    console.log('📊 Resumo da transação:', {
      hash: explorerTx.hash.slice(0, 20) + '...',
      from: explorerTx.from.slice(0, 12) + '...',
      to: explorerTx.to?.slice(0, 12) + '...' || 'null',
      blockNumber: explorerTx.blockNumber.toString(),
      status: explorerTx.status,
      value: explorerTx.value + ' USDC',
    })
    return explorerTx
  }
  
  // Tentar também com hash em lowercase se diferente
  if (normalizedHash !== hashLower) {
    console.log('🔄 Tentando com hash em lowercase...')
    const explorerTxLower = await fetchTransactionDetailsFromExplorer(hashLower)
    if (explorerTxLower) {
      console.log('✅ Detalhes encontrados via Blockscout API (lowercase)')
      return explorerTxLower
    }
  }
  
  // PRIORIDADE 2: Fallback para RPC direto
  console.log('🔄 PRIORIDADE 2: Blockscout API não retornou dados, tentando RPC direto...')
  try {
    const rpcTx = await fetchTransactionDetailsViaRPC(normalizedHash)
    if (rpcTx) {
      console.log('✅ ✅ ✅ SUCESSO! Detalhes encontrados via RPC direto')
      console.log('📊 Resumo da transação:', {
        hash: rpcTx.hash.slice(0, 20) + '...',
        from: rpcTx.from.slice(0, 12) + '...',
        blockNumber: rpcTx.blockNumber.toString(),
        status: rpcTx.status,
      })
      return rpcTx
    }
  } catch (rpcError: any) {
    console.error('❌ Erro ao buscar via RPC:', rpcError.message)
    if (rpcError.stack) {
      console.error('📄 Stack trace:', rpcError.stack.slice(0, 300))
    }
  }
  
  // Erro final
  console.error('❌ ❌ ❌ FALHA TOTAL - Nenhum detalhe encontrado após todas as tentativas')
  console.error('💡 Hash da transação:', normalizedHash)
  console.error('💡 Verificações:')
  console.error('   1. Formato do hash:', normalizedHash.startsWith('0x') ? '✓ Correto' : '✗ Inválido')
  console.error('   2. Tamanho do hash:', normalizedHash.length, normalizedHash.length === 66 ? '✓ Correto' : '⚠ Pode estar incompleto')
  console.error('   3. RPC disponível:', ARC_TESTNET_CONFIG.rpcUrls[0])
  console.error('   4. Explorer disponível:', ARC_TESTNET_CONFIG.blockExplorerUrls[0])
  console.error('   5. Chain ID:', ARC_TESTNET_CONFIG.chainId)
  
  return null
}

/**
 * Hook para buscar detalhes de uma transação
 */
export function useTransactionDetails(txHash: string | undefined) {
  return useQuery({
    queryKey: ['transaction-details', txHash],
    queryFn: () => {
      if (!txHash) throw new Error('Hash da transação não fornecido')
      return fetchTransactionDetails(txHash)
    },
    enabled: !!txHash && txHash.startsWith('0x') && txHash.length >= 10, // Aceitar hash mesmo se incompleto
    staleTime: 30000, // 30 segundos
    retry: 3, // Aumentar tentativas
    retryDelay: 2000, // Aumentar delay entre tentativas
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  })
}

