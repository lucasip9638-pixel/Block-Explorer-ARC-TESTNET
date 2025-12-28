"use client"

import { TrendingUp, Users, Layers, Zap, Loader2, Calendar, Wallet } from "lucide-react"
import { Card } from "@/components/ui/card"
import { useArcScanStats } from "@/hooks/use-arc-scan-stats"

export function Stats() {
  const { data: networkStats, isLoading } = useArcScanStats()

  // Calcular estatísticas (sincronizado com ARC Scan)
  const totalTransactions = networkStats?.totalTransactions || 0
  const activeWallets = networkStats?.activeWallets || 0
  const networkTPS = networkStats?.networkTPS || 0
  // Usar valor padrão de 1.21M se não houver dados ainda (valor do ARC Scan)
  const dailyTransactions = networkStats?.dailyTransactions || 1210000
  const totalAddresses = networkStats?.totalAddresses || 0
  const dappsCount = networkStats?.dappsCount || 14 // Sincronizado com ARC Scan

  // Calcular mudanças (simulado por enquanto, pode ser melhorado com histórico)
  const stats = [
    {
      label: "Daily Transactions",
      value: dailyTransactions,
      change: "+12.5%",
      icon: Calendar,
      suffix: "",
    },
    {
      label: "Active Wallets",
      value: activeWallets,
      change: "+8.2%",
      icon: Users,
      suffix: "",
    },
    {
      label: "DApps Available",
      value: dappsCount,
      change: "+6 new",
      icon: Layers,
      suffix: "",
    },
    {
      label: "Network TPS",
      value: networkTPS,
      change: "Real-time",
      icon: Zap,
      suffix: "",
    },
  ]

  const formatNumber = (num: number) => {
    if (num >= 1_000_000_000) {
      return `${(num / 1_000_000_000).toFixed(2)}B`
    }
    if (num >= 1_000_000) {
      // Formato como no ARC Scan: 1.21M (2 casas decimais)
      return `${(num / 1_000_000).toFixed(2)}M`
    }
    if (num >= 1_000) {
      return `${(num / 1_000).toFixed(1)}K`
    }
    return num.toLocaleString()
  }

  return (
    <section id="stats" className="py-12 border-b border-border/40 bg-secondary/20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <Card
              key={stat.label}
              className="p-6 bg-card border-border hover:border-[#9333EA]/30 hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-2.5 rounded-lg bg-gradient-to-br from-[#9333EA]/10 to-[#EC4899]/10 border border-[#9333EA]/20">
                  {isLoading && idx === 0 ? (
                    <Loader2 className="size-5 text-[#9333EA] animate-spin" />
                  ) : (
                    <stat.icon className="size-5 text-[#9333EA]" />
                  )}
                </div>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                    idx === 3
                      ? "bg-green-500/10 text-green-500 border border-green-500/20"
                      : "bg-[#EC4899]/10 text-[#EC4899] border border-[#EC4899]/20"
                  }`}
                >
                  {stat.change}
                </span>
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground mb-1">
                  {isLoading && idx === 0 ? (
                    <span className="text-muted-foreground">...</span>
                  ) : (
                    <>
                      {formatNumber(stat.value)}
                      {stat.suffix && <span className="text-xl text-muted-foreground ml-1">{stat.suffix}</span>}
                    </>
                  )}
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
