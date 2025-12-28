/**
 * ARC Testnet Configuration
 * 
 * Configuração da rede ARC Testnet para integração com wallets e RPC.
 * 
 * IMPORTANTE: Esta é uma configuração base. Você precisa preencher os valores
 * corretos baseados na documentação oficial da ARC testnet.
 */

export const ARC_TESTNET_CONFIG = {
  // Chain ID da ARC Testnet (oficial)
  chainId: 5042002,
  
  // Nome da rede
  chainName: "ARC Testnet",
  
  // Símbolo nativo da moeda (USDC conforme documentação oficial)
  // IMPORTANTE: USDC na ARC Testnet usa 6 decimais, não 18!
  nativeCurrency: {
    name: "USDC",
    symbol: "USDC",
    decimals: 6, // USDC usa 6 decimais na ARC Testnet
  },
  
  // URLs do RPC (oficial)
  rpcUrls: [
    "https://rpc.testnet.arc.network",
  ],
  
  // URLs do Block Explorer (oficial)
  blockExplorerUrls: [
    "https://testnet.arcscan.app",
  ],
  
  // Informações adicionais
  networkType: "testnet",
  
  // Faucet URL
  faucetUrl: "https://faucet.circle.com",
  
  // Metadados para MetaMask e outras wallets
  iconUrls: [], // URLs para ícones da rede (opcional)
}

/**
 * Configuração para adicionar a rede no MetaMask
 * Formata o objeto no formato esperado pelo MetaMask
 */
export const getMetaMaskChainConfig = () => ({
  chainId: `0x${ARC_TESTNET_CONFIG.chainId.toString(16)}`,
  chainName: ARC_TESTNET_CONFIG.chainName,
  nativeCurrency: ARC_TESTNET_CONFIG.nativeCurrency,
  rpcUrls: ARC_TESTNET_CONFIG.rpcUrls,
  blockExplorerUrls: ARC_TESTNET_CONFIG.blockExplorerUrls,
})

export const addArcTestnetToWallet = async () => {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("MetaMask ou outra wallet não detectada")
  }

  try {
    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [getMetaMaskChainConfig()],
    })
  } catch (error) {
    console.error("Erro ao adicionar rede ARC Testnet:", error)
    throw error
  }
}

/**
 * Verifica se a wallet está conectada à ARC Testnet
 */
export const isArcTestnet = async (): Promise<boolean> => {
  if (typeof window === "undefined" || !window.ethereum) {
    return false
  }

  try {
    const chainId = await window.ethereum.request({ method: "eth_chainId" })
    return parseInt(chainId as string, 16) === ARC_TESTNET_CONFIG.chainId
  } catch (error) {
    console.error("Erro ao verificar rede:", error)
    return false
  }
}

/**
 * Solicita mudança para ARC Testnet
 */
export const switchToArcTestnet = async (): Promise<void> => {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("MetaMask ou outra wallet não detectada")
  }

  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: `0x${ARC_TESTNET_CONFIG.chainId.toString(16)}` }],
    })
  } catch (switchError: any) {
    // Se a rede não existe, tenta adicionar
    if (switchError.code === 4902) {
      await addArcTestnetToWallet()
    } else {
      throw switchError
    }
  }
}

// Declaração de tipo para window.ethereum
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>
      isMetaMask?: boolean
    }
  }
}
