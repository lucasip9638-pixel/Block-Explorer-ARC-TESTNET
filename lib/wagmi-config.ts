import { http, createConfig } from 'wagmi'
import { injected, metaMask, walletConnect, coinbaseWallet } from 'wagmi/connectors'
import { ARC_TESTNET_CONFIG } from '@/config/arc-testnet'

// Definição da cadeia ARC Testnet
export const arcTestnet = {
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
  testnet: true,
} as const

// Configuração do Wagmi
export const config = createConfig({
  chains: [arcTestnet],
  connectors: [
    injected(),
    metaMask(),
    coinbaseWallet({
      appName: 'ARC Scout',
      appLogoUrl: typeof window !== 'undefined' ? `${window.location.origin}/icon.svg` : undefined,
    }),
    ...(process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
      ? [
          walletConnect({
            projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
          }),
        ]
      : []),
  ],
  transports: {
    [arcTestnet.id]: http(ARC_TESTNET_CONFIG.rpcUrls[0]),
  },
})

