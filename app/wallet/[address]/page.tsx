"use client"

import { Header } from "@/components/header"
import { WalletActivity } from "@/components/wallet-activity"
import { WalletBalance } from "@/components/wallet-balance"
import { Footer } from "@/components/footer"
import { useParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Copy, ExternalLink, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ARC_TESTNET_CONFIG } from "@/config/arc-testnet"
import { formatAddress } from "@/lib/utils"
import { useState } from "react"

export default function WalletPage() {
  const params = useParams()
  const address = params?.address as string
  const [copied, setCopied] = useState(false)

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const explorerUrl = `${ARC_TESTNET_CONFIG.blockExplorerUrls[0]}/address/${address}`

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <section className="py-16 border-b border-border/40">
          <div className="container mx-auto px-4">
            <Card className="p-8 bg-card">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="size-16 rounded-full bg-gradient-to-br from-[#9333EA] to-[#EC4899] flex items-center justify-center">
                    <Wallet className="size-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">Endereço da Wallet</h1>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-lg text-foreground">{address ? formatAddress(address, 10, 8) : 'Carregando...'}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={copyAddress}
                        className="size-8"
                      >
                        <Copy className={`size-4 ${copied ? 'text-green-500' : 'text-muted-foreground'}`} />
                      </Button>
                      <a
                        href={explorerUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-[#9333EA] hover:underline"
                      >
                        Ver no Explorer
                        <ExternalLink className="size-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              
              {address && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="p-4 rounded-lg bg-secondary/50">
                    <p className="text-sm text-muted-foreground mb-1">Endereço Completo</p>
                    <p className="font-mono text-sm break-all">{address}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-secondary/50">
                    <p className="text-sm text-muted-foreground mb-1">Rede</p>
                    <p className="font-semibold">ARC Testnet</p>
                  </div>
                  <div className="p-4 rounded-lg bg-secondary/50">
                    <p className="text-sm text-muted-foreground mb-1">Explorer</p>
                    <a
                      href={explorerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#9333EA] hover:underline text-sm"
                    >
                      ARC Scan
                    </a>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </section>

        {address && (
          <>
            <section className="py-8 border-b border-border/40">
              <div className="container mx-auto px-4">
                <WalletBalance address={address} showAddress={false} />
              </div>
            </section>
            <WalletActivity address={address} title="Histórico de Transações" />
          </>
        )}
      </main>
      <Footer />
    </div>
  )
}

