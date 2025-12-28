"use client"

import { useConnect } from "wagmi"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Wallet, Download } from "lucide-react"
import { useState } from "react"

interface WalletOption {
  id: string
  name: string
  icon: string
  downloadUrl?: string
  isInstalled?: boolean
}

const WALLET_OPTIONS: Record<string, WalletOption> = {
  metaMask: {
    id: "metaMask",
    name: "MetaMask",
    icon: "🦊",
    downloadUrl: "https://metamask.io/download/",
  },
  phantom: {
    id: "phantom",
    name: "Phantom",
    icon: "👻",
    downloadUrl: "https://phantom.app/",
  },
  coinbaseWalletSDK: {
    id: "coinbaseWalletSDK",
    name: "Coinbase Wallet",
    icon: "🔵",
    downloadUrl: "https://www.coinbase.com/wallet",
  },
  injected: {
    id: "injected",
    name: "Outras Wallets",
    icon: "💼",
  },
  walletConnect: {
    id: "walletConnect",
    name: "WalletConnect",
    icon: "🔗",
    downloadUrl: "https://walletconnect.com/",
  },
}

export function WalletConnectModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { connect, connectors, isPending } = useConnect()
  const [connectingId, setConnectingId] = useState<string | null>(null)

  const handleConnect = async (connectorId: string) => {
    const connector = connectors.find((c) => c.id === connectorId)
    if (!connector) return

    setConnectingId(connectorId)
    try {
      connect({ connector })
      onOpenChange(false)
    } catch (error) {
      console.error("Erro ao conectar wallet:", error)
    } finally {
      setConnectingId(null)
    }
  }

  const getWalletInfo = (connectorId: string): WalletOption => {
    // Mapear IDs dos connectors para as opções de wallet
    if (connectorId.includes("metaMask") || connectorId === "metaMask") {
      return WALLET_OPTIONS.metaMask
    }
    if (connectorId.includes("coinbase") || connectorId === "coinbaseWalletSDK") {
      return WALLET_OPTIONS.coinbaseWalletSDK
    }
    if (connectorId.includes("walletConnect") || connectorId === "walletConnect") {
      return WALLET_OPTIONS.walletConnect
    }
    // Se for injected e tiver Phantom, mostrar Phantom
    if (connectorId === "injected") {
      if (typeof window !== "undefined" && (window as any).phantom?.ethereum) {
        return WALLET_OPTIONS.phantom
      }
    }
    return WALLET_OPTIONS.injected
  }

  const checkWalletInstalled = (connectorId: string): boolean => {
    if (typeof window === "undefined") return false
    
    const ethereum = (window as any).ethereum
    const phantom = (window as any).phantom
    
    // Verificar MetaMask
    if (connectorId.includes("metaMask")) {
      return !!ethereum?.isMetaMask
    }
    
    // Verificar Coinbase Wallet
    if (connectorId.includes("coinbase")) {
      return !!ethereum?.isCoinbaseWallet
    }
    
    // Verificar Phantom
    if (connectorId === "injected") {
      // Phantom tem seu próprio objeto
      if (phantom?.ethereum || ethereum?.isPhantom) return true
      // Outras wallets injected (mas não MetaMask, que já tem connector próprio)
      if (ethereum && !ethereum.isMetaMask) {
        if (ethereum.isCoinbaseWallet) return true
        if (ethereum.isTrust) return true
        if (ethereum.isBraveWallet) return true
        return true // Qualquer outra wallet injected
      }
      return false
    }
    
    return true // WalletConnect sempre disponível
  }

  const getWalletName = (connectorId: string): string => {
    if (typeof window === "undefined") return "Outras Wallets"
    
    const ethereum = (window as any).ethereum
    const phantom = (window as any).phantom
    
    if (connectorId === "injected" && (ethereum || phantom)) {
      // Verificar Phantom primeiro (tem seu próprio objeto)
      if (phantom?.ethereum || ethereum?.isPhantom) return "Phantom"
      if (ethereum?.isMetaMask) return "MetaMask"
      if (ethereum?.isCoinbaseWallet) return "Coinbase Wallet"
      if (ethereum?.isTrust) return "Trust Wallet"
      if (ethereum?.isBraveWallet) return "Brave Wallet"
      return "Outras Wallets"
    }
    
    const walletInfo = getWalletInfo(connectorId)
    return walletInfo.name
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="size-5" />
            Conectar Wallet
          </DialogTitle>
          <DialogDescription>
            Escolha uma wallet para conectar à ARC Testnet
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-2 mt-4">
          {connectors
            .filter((connector) => {
              // Filtrar duplicatas: se MetaMask está instalado, não mostrar injected genérico
              if (connector.id === "injected") {
                const ethereum = typeof window !== "undefined" ? (window as any).ethereum : null
                const phantom = typeof window !== "undefined" ? (window as any).phantom : null
                // Mostrar injected apenas se não for MetaMask (já tem connector específico)
                // ou se for Phantom
                if (ethereum?.isMetaMask) return false // MetaMask já tem connector próprio
                if (phantom?.ethereum || ethereum?.isPhantom) return true // Phantom usa injected
                return true // Outras wallets injected
              }
              return true
            })
            .map((connector) => {
              const walletInfo = getWalletInfo(connector.id)
              const isInstalled = checkWalletInstalled(connector.id)
              const isConnecting = connectingId === connector.id && isPending
              const walletName = getWalletName(connector.id)

              return (
                <Button
                  key={connector.id}
                  variant="outline"
                  className="w-full justify-start h-auto py-4 px-4 hover:bg-secondary/50"
                  onClick={() => handleConnect(connector.id)}
                  disabled={isPending || isConnecting}
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className="text-2xl">{walletInfo.icon}</div>
                    <div className="flex-1 text-left">
                      <div className="font-semibold">{walletName}</div>
                      {!isInstalled && walletInfo.downloadUrl && (
                        <a
                          href={walletInfo.downloadUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-xs text-muted-foreground flex items-center gap-1 mt-1 hover:text-[#9333EA]"
                        >
                          <Download className="size-3" />
                          Instalar extensão
                        </a>
                      )}
                      {isInstalled && (
                        <div className="text-xs text-green-500 mt-1">Instalado</div>
                      )}
                    </div>
                    {isConnecting && (
                      <div className="text-sm text-muted-foreground">Conectando...</div>
                    )}
                  </div>
                </Button>
              )
            })}
        </div>

        <div className="mt-4 p-3 rounded-lg bg-secondary/50 border border-border">
          <p className="text-xs text-muted-foreground text-center">
            Ao conectar, você concorda com os termos de uso. Certifique-se de estar na rede ARC Testnet.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

