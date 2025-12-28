"use client"

import { Card } from "@/components/ui/card"
import { Coins, ExternalLink } from "lucide-react"

interface Token {
  symbol: string
  name: string
  address: string
  decimals: number
  logo?: string
}

const popularTokens: Token[] = [
  {
    symbol: "USDC",
    name: "USD Coin",
    address: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
    decimals: 6,
  },
  {
    symbol: "EURC",
    name: "Euro Coin",
    address: "0xE4d517785D091D3c54818832dB6094bcc2744545",
    decimals: 6,
  },
  {
    symbol: "WUSDC",
    name: "Wrapped USDC",
    address: "0x...", // Endereço real se disponível
    decimals: 6,
  },
]

export function TokenList() {
  const explorerUrl = "https://testnet.arcscan.app"

  return (
    <section className="py-16 bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <Coins className="size-6 text-[#9333EA]" />
            <h2 className="text-4xl font-bold text-foreground">Popular Tokens</h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Most used tokens on ARC Testnet
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {popularTokens.map((token, index) => (
            <Card
              key={index}
              className="p-6 border-2 border-border/60 hover:border-[#9333EA]/50 hover:shadow-xl transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-[#9333EA] to-[#EC4899]">
                    <Coins className="size-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">{token.symbol}</h3>
                    <p className="text-xs text-muted-foreground">{token.name}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Decimals</span>
                  <span className="font-semibold text-foreground">{token.decimals}</span>
                </div>
              </div>

              <a
                href={`${explorerUrl}/token/${token.address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 text-sm text-[#9333EA] hover:underline font-medium"
              >
                View on Explorer
                <ExternalLink className="size-4" />
              </a>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            ARC Testnet supports stablecoins and tokenized assets for seamless DeFi operations
          </p>
        </div>
      </div>
    </section>
  )
}





