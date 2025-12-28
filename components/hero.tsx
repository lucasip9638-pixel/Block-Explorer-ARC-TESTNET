"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, TrendingUp, Activity } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useArcScanStats } from "@/hooks/use-arc-scan-stats"
import { ARC_TESTNET_CONFIG } from "@/config/arc-testnet"

export function Hero() {
  const [address, setAddress] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const router = useRouter()
  const { data: networkStats, isLoading: isLoadingStats } = useArcScanStats()

  const handleSearch = () => {
    if (address.trim()) {
      setIsSearching(true)
      const trimmedAddress = address.trim()
      
      // Verificar se é um endereço de wallet (começa com 0x e tem 42 caracteres)
      const walletAddressPattern = /^0x[a-fA-F0-9]{40}$/
      // Verificar se é um hash de transação (começa com 0x e tem 66 caracteres ou mais)
      const transactionHashPattern = /^0x[a-fA-F0-9]{64}$/
      
      if (walletAddressPattern.test(trimmedAddress)) {
        // Redirecionar para página de wallet
        router.push(`/wallet/${trimmedAddress}`)
      } else if (transactionHashPattern.test(trimmedAddress)) {
        // Redirecionar para página de transação
        router.push(`/tx/${trimmedAddress}`)
      } else if (trimmedAddress.startsWith('0x') && trimmedAddress.length >= 10) {
        // Assumir que é um hash de transação (pode estar incompleto) e tentar buscar
        router.push(`/tx/${trimmedAddress}`)
      } else {
        // Formato inválido
        alert('Formato inválido. Por favor, insira:\n- Endereço de wallet (0x...)\n- Hash de transação (0x...)')
        setIsSearching(false)
      }
    }
  }

  return (
    <section className="relative overflow-hidden border-b border-border/40">
      {/* Animated background gradients - Blue theme */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/15 via-blue-400/8 to-cyan-500/12" />
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
      
      {/* Beautiful ARC Text Background - Behind "ARC Testnet Block Explorer" title */}
      <div className="absolute top-[30%] md:top-[28%] left-1/2 -translate-x-1/2 pointer-events-none z-0">
        <div className="relative">
          {/* Main ARC Text with gradient */}
          <div 
            className="text-[120px] sm:text-[160px] md:text-[220px] lg:text-[280px] xl:text-[340px] font-black tracking-tighter leading-none select-none whitespace-nowrap"
            style={{
              background: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 50%, #06B6D4 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              opacity: 0.1,
              filter: 'blur(1px)',
              textShadow: '0 0 60px rgba(37, 99, 235, 0.5)',
            }}
          >
            ARC
          </div>
          
          {/* Glow effect behind text */}
          <div 
            className="absolute inset-0 text-[120px] sm:text-[160px] md:text-[220px] lg:text-[280px] xl:text-[340px] font-black tracking-tighter leading-none whitespace-nowrap"
            style={{
              background: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 50%, #06B6D4 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              opacity: 0.18,
              filter: 'blur(30px)',
              transform: 'translateZ(0)',
            }}
          >
            ARC
          </div>
        </div>
      </div>
      
      {/* Floating orbs - ARC colors */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '0s' }}></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>

      <div className="container relative mx-auto px-4 py-24 md:py-32">
        <div className="mx-auto max-w-4xl">
          <div className="mb-10 flex items-center justify-center gap-3 animate-slide-up">
            <div className="flex items-center gap-2 rounded-full bg-green-500/10 px-6 py-3 text-green-500 border-2 border-green-500/30 backdrop-blur-md shadow-xl glow-purple hover:scale-105 transition-transform">
              <span className="relative flex size-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75"></span>
                <span className="relative inline-flex size-3 rounded-full bg-green-500"></span>
              </span>
              <span className="font-bold text-sm">Network Online</span>
            </div>
          </div>

          <h1 className="relative mb-8 text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-balance text-center animate-slide-up z-10" style={{ animationDelay: '0.1s' }}>
            <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto] drop-shadow-lg">
              ARC Testnet
            </span>
            <br />
            <span className="text-foreground drop-shadow-sm">Block Explorer</span>
          </h1>

          <p className="mb-12 text-lg md:text-xl text-muted-foreground text-balance leading-relaxed text-center max-w-3xl mx-auto font-light animate-slide-up" style={{ animationDelay: '0.2s' }}>
            Track transactions and monitor wallet activity on the ARC blockchain test network.
          </p>

          <div className="mx-auto max-w-2xl animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="relative flex-1 group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-500/20 rounded-xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 size-5 text-muted-foreground group-focus-within:text-blue-600 transition-all duration-300 z-10" />
                <Input
                  placeholder="Search by Address or Transaction Hash"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="relative h-18 pl-14 pr-4 text-base bg-card/90 backdrop-blur-md border-2 border-border/60 focus:border-blue-600/70 shadow-2xl hover:shadow-[0_0_30px_rgba(37,99,235,0.3)] transition-all duration-300 rounded-xl"
                />
              </div>
              <Button
                size="lg"
                onClick={handleSearch}
                disabled={isSearching || !address.trim()}
                className="h-18 px-12 bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:opacity-90 hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] shadow-xl transition-all duration-300 font-bold text-base disabled:opacity-50 disabled:cursor-not-allowed rounded-xl hover:scale-105 active:scale-95"
                style={{ boxShadow: '0 0 20px rgba(37, 99, 235, 0.3)' }}
              >
                {isSearching ? "Searching..." : "Search"}
              </Button>
            </div>

            <div className="text-sm text-muted-foreground text-center space-x-3">
              <span className="font-medium">Try example:</span>
              <button
                onClick={() => setAddress("0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb")}
                className="text-blue-600 hover:text-cyan-500 hover:underline font-semibold transition-all duration-200 hover:scale-105"
              >
                Wallet Address
              </button>
              <span>·</span>
              <button
                onClick={() => setAddress("0xece82f767458db22e8ca03412ca1f3bc0fefc313ea1ed2e403658b00e1332a20")}
                className="text-blue-600 hover:text-cyan-500 hover:underline font-semibold transition-all duration-200 hover:scale-105"
              >
                Transaction Hash
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
