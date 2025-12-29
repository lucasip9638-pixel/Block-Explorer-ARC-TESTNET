"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ExternalLink, Star, TrendingUp, Shield, Verified } from "lucide-react"

const categories = ["All", "NFT", "Bridge", "DEX", "Domain", "Deploy", "Wallet", "Faucet"]

// DApps organizados por categoria: NFT, DEX, Bridge, Domain, Deploy, Wallet, Faucet
// Dentro de cada categoria, em ordem alfabética
const dapps = [
  // NFT (1 DApp) - ordem alfabética
  {
    name: "Omni Hub",
    category: "NFT",
    description: "NFT marketplace and management platform on ARC Testnet.",
    image: "/dapps/logos/omni-logo.jpg",
    url: "https://omnihub.xyz/create/arc-testnet",
    tvl: "N/A",
    volume24h: "N/A",
    verified: true,
    featured: false,
  },
  // DEX (3 DApps) - ordem alfabética: Curve Finance, Defionarc, Synthra
  {
    name: "Curve Finance",
    category: "DEX",
    description: "DEX USDC/WUSDC with deep liquidity pools.",
    image: "/dapps/logos/curve-logo.jpg",
    url: "https://curve.fi",
    tvl: "N/A",
    volume24h: "N/A",
    verified: true,
    featured: false,
  },
  {
    name: "Defionarc",
    category: "DEX",
    description: "Decentralized exchange on ARC Testnet.",
    image: "/dapps/logos/circle-logo.png",
    url: "https://www.arcflow.finance/",
    tvl: "N/A",
    volume24h: "N/A",
    verified: true,
    featured: false,
  },
  {
    name: "Synthra",
    category: "DEX",
    description: "A CEX-like DEX experience. Smooth swap, clear LP insight.",
    image: "/dapps/logos/synthra-logo.jpg",
    url: "https://app.synthra.org",
    tvl: "N/A",
    volume24h: "N/A",
    verified: true,
    featured: false,
  },
  // Bridge (1 DApp)
  {
    name: "Superbridge",
    category: "Bridge",
    description: "Bridge to transfer ETH Sepolia to ARC Testnet.",
    image: "/dapps/logos/superbridge-logo.jpg",
    url: "https://superbridge.app",
    tvl: "N/A",
    volume24h: "N/A",
    verified: true,
    featured: false,
  },
  // Domain (2 DApps) - ordem alfabética: InfinityName, ZNS
  {
    name: "InfinityName",
    category: "Domain",
    description: "Register custom domain on ARC Testnet with AI integration.",
    image: "/dapps/logos/infinity-logo.jpg",
    url: "https://infinityname.com",
    tvl: "N/A",
    volume24h: "N/A",
    verified: true,
    featured: false,
  },
  {
    name: "ZNS",
    category: "Domain",
    description: "Experience true digital ownership with domain.",
    image: "/dapps/logos/ZNS_Connect-logo.jpg",
    url: "https://infinityname.com",
    tvl: "N/A",
    volume24h: "N/A",
    verified: true,
    featured: false,
  },
  // Deploy (1 DApp)
  {
    name: "zkCodex",
    category: "Deploy",
    description: "Deploy NFT collection on ARC Testnet.",
    image: "/dapps/logos/zkCodex-logo.jpg",
    url: "https://zkcodex.com",
    tvl: "N/A",
    volume24h: "N/A",
    verified: true,
    featured: false,
  },
  // Wallet (2 DApps) - ordem alfabética: Gateway, zkCodex
  {
    name: "Gateway",
    category: "Wallet",
    description: "Acesso cross-chain instantâneo ao USDC. Saldo unificado de USDC cross-chain.",
    image: "/dapps/logos/circle-logo.png",
    url: "https://www.circle.com/pt-br/gateway",
    tvl: "N/A",
    volume24h: "N/A",
    verified: true,
    featured: false,
  },
  {
    name: "zkCodex",
    category: "Wallet",
    description: "Wallet and development tools for ARC Testnet.",
    image: "/dapps/logos/zkCodex-logo.jpg",
    url: "https://zkcodex.com",
    tvl: "N/A",
    volume24h: "N/A",
    verified: true,
    featured: false,
  },
  // Faucet (2 DApps) - ordem alfabética: Circle Testnet Faucet, Easy Faucet Arc
  {
    name: "Circle Testnet Faucet",
    category: "Faucet",
    description: "Send testnet USDC and EURC to your wallet to experiment.",
    image: "/dapps/logos/circle-logo.png",
    url: "https://faucet.circle.com",
    tvl: "N/A",
    volume24h: "N/A",
    verified: true,
    featured: false,
  },
  {
    name: "Easy Faucet Arc",
    category: "Faucet",
    description: "Get up to 100 USDC (testnet) to develop on the ARC Network. The official faucet only provides 1 USDC per hour.",
    image: "/dapps/logos/circle-logo.png",
    url: "https://easyfaucetarc.xyz",
    tvl: "N/A",
    volume24h: "N/A",
    verified: true,
    featured: false,
  },
]

export function DAppGrid() {
  const [selectedCategory, setSelectedCategory] = useState("All")

  // Ordem de categorias: NFT, DEX, Bridge, Domain, Deploy, Wallet, Faucet
  const categoryOrder = ["NFT", "DEX", "Bridge", "Domain", "Deploy", "Wallet", "Faucet"]
  
  // Filtrar e ordenar
  const filteredDapps = useMemo(() => {
    let result = []
    
    if (selectedCategory === "All") {
      result = [...dapps]
      // Ordenar por categoria primeiro, depois alfabeticamente dentro de cada categoria
      result.sort((a, b) => {
        const categoryIndexA = categoryOrder.indexOf(a.category)
        const categoryIndexB = categoryOrder.indexOf(b.category)
        
        if (categoryIndexA !== categoryIndexB) {
          return categoryIndexA - categoryIndexB
        }
        
        return a.name.localeCompare(b.name)
      })
    } else {
      result = dapps.filter((dapp) => dapp.category === selectedCategory)
      // Ordenar alfabeticamente dentro da categoria
      result.sort((a, b) => a.name.localeCompare(b.name))
    }
    
    return result
  }, [selectedCategory])

  // Handler para mudança de categoria
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
  }


  return (
    <section id="ecosystem" className="py-12 sm:py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="mb-8 sm:mb-12">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mb-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">DApps</h2>
            <span className="px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-blue-400/10 text-blue-500 dark:text-blue-400 text-xs sm:text-sm font-semibold border border-blue-400/20 shadow-sm">
              {filteredDapps.length} {selectedCategory === "All" ? "Apps" : `${selectedCategory} Apps`}
            </span>
          </div>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-3xl mx-auto text-center px-4">
            Explore verified decentralized applications built on ARC Testnet. From DeFi protocols to NFT marketplaces,
            discover the future of blockchain technology.
          </p>
        </div>

        <div className="mb-6 sm:mb-8 flex flex-wrap gap-2 justify-center items-center px-2">
          {categories.map((category) => {
            const isActive = selectedCategory === category
            return (
              <button
                key={category}
                type="button"
                onClick={() => handleCategoryChange(category)}
                className={`
                  px-3 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-all duration-300 ease-in-out
                  cursor-pointer select-none
                  ${isActive 
                    ? "bg-gradient-to-r from-blue-500 to-blue-400 text-white shadow-lg scale-105 font-semibold" 
                    : "bg-background border border-border text-foreground hover:bg-blue-50 dark:hover:bg-blue-950/20 hover:border-blue-400/50 hover:text-blue-500 dark:hover:text-blue-400 hover:shadow-md"
                  }
                  active:scale-95
                  hover:scale-105
                `}
                aria-pressed={isActive}
                aria-label={`Filtrar por ${category}`}
              >
                {category}
              </button>
            )
          })}
        </div>

        {filteredDapps.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground text-lg">
              Nenhum DApp encontrado na categoria "{selectedCategory === "All" ? "All" : selectedCategory}"
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredDapps.map((dapp, index) => (
              <Card
                key={`${dapp.name}-${dapp.category}-${index}`}
                className="group overflow-hidden border-2 border-border/60 hover:border-blue-400/40 hover:shadow-2xl transition-all duration-300 bg-card/95 backdrop-blur-sm"
              >
              <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20">
                <img
                  src={dapp.image || "/placeholder.svg"}
                  alt={dapp.name}
                  className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/10 transition-colors duration-300" />
                {dapp.featured && (
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-500 to-blue-400 text-white text-xs font-semibold shadow-lg backdrop-blur-sm">
                    <Star className="size-3 fill-white" />
                    Featured
                  </div>
                )}
                {dapp.verified && (
                  <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-green-500/90 dark:bg-green-600 text-white text-xs font-medium shadow-md backdrop-blur-sm">
                    <Verified className="size-3" />
                    Verified
                  </div>
                )}
              </div>

              <div className="p-6 bg-gradient-to-b from-card to-card/95">
                <div className="mb-4 flex items-start justify-between gap-2">
                  <h3 className="text-xl font-bold text-foreground group-hover:text-blue-500 dark:group-hover:text-blue-300 transition-colors duration-300 leading-tight">
                    {dapp.name}
                  </h3>
                  <span className="px-2.5 py-1 rounded-md bg-blue-400/10 text-blue-500 dark:text-blue-400 text-xs font-semibold border border-blue-400/20 whitespace-nowrap shrink-0">
                    {dapp.category}
                  </span>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed mb-6 min-h-[60px] line-clamp-3">
                  {dapp.description}
                </p>

                {(dapp.tvl !== "N/A" || dapp.volume24h !== "N/A") && (
                  <div className="grid grid-cols-2 gap-3 mb-4 p-3 rounded-lg bg-secondary/50 border border-border">
                    {dapp.tvl !== "N/A" && (
                      <div>
                        <div className="flex items-center gap-1 mb-1">
                          <Shield className="size-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">TVL</span>
                        </div>
                        <p className="text-sm font-bold text-foreground">{dapp.tvl}</p>
                      </div>
                    )}
                    {dapp.volume24h !== "N/A" && (
                      <div>
                        <div className="flex items-center gap-1 mb-1">
                          <TrendingUp className="size-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">24h Vol</span>
                        </div>
                        <p className="text-sm font-bold text-foreground">{dapp.volume24h}</p>
                      </div>
                    )}
                  </div>
                )}

                <Button
                  variant="ghost"
                  className="w-full justify-between bg-gradient-to-r from-blue-500 to-blue-400 hover:from-blue-500 hover:to-blue-400/90 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02]"
                  onClick={() => window.open(dapp.url, '_blank')}
                >
                  <span>Visit DApp</span>
                  <ExternalLink className="size-4" />
                </Button>
              </div>
            </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
