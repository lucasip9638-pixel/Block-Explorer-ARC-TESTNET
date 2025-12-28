"use client"

import { Card } from "@/components/ui/card"
import { useArcScanStats } from "@/hooks/use-arc-scan-stats"
import { useNetworkUtilization } from "@/hooks/use-network-utilization"
import { Activity, TrendingUp, Users, Zap, Database, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"

export function AutoStats() {
  const { data: stats, isLoading: statsLoading } = useArcScanStats()
  const { data: utilization, isLoading: utilLoading } = useNetworkUtilization()
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  // Atualizar timestamp a cada atualização
  useEffect(() => {
    if (stats || utilization) {
      setLastUpdate(new Date())
    }
  }, [stats, utilization])

  const formatNumber = (num: number | string): string => {
    const numValue = typeof num === 'string' ? parseFloat(num) || 0 : num
    if (isNaN(numValue) || numValue === 0) return "..."
    
    if (numValue >= 1_000_000_000) {
      return `${(numValue / 1_000_000_000).toFixed(2)}B`
    }
    if (numValue >= 1_000_000) {
      return `${(numValue / 1_000_000).toFixed(2)}M`
    }
    if (numValue >= 1_000) {
      return `${(numValue / 1_000).toFixed(1)}K`
    }
    return numValue.toLocaleString('pt-BR')
  }

  const statsItems = [
    {
      icon: Database,
      label: "Bloco Atual",
      value: stats?.currentBlock ? stats.currentBlock.toLocaleString('pt-BR') : "...",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
    },
    {
      icon: Activity,
      label: "Total Transações",
      value: stats?.totalTransactions ? formatNumber(stats.totalTransactions) : "...",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20",
    },
    {
      icon: Users,
      label: "Carteiras Ativas",
      value: stats?.activeWallets ? formatNumber(stats.activeWallets) : "...",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
    },
    {
      icon: Zap,
      label: "TPS da Rede",
      value: stats?.networkTPS ? `${stats.networkTPS.toFixed(2)} TPS` : "...",
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/20",
    },
    {
      icon: TrendingUp,
      label: "Utilização",
      value: utilization?.utilization ? `${utilization.utilization.toFixed(2)}%` : "...",
      color: "from-yellow-500 to-amber-500",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/20",
    },
  ]

  return (
    <section className="py-8 bg-gradient-to-br from-background via-secondary/40 to-background border-b-2 border-border/60">
      <div className="container mx-auto px-4">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-1">Estatísticas da Rede ARC</h2>
            <p className="text-sm text-muted-foreground">
              Atualização automática em tempo real
              {lastUpdate && (
                <span className="ml-2">
                  • Última atualização: {lastUpdate.toLocaleTimeString('pt-BR')}
                </span>
              )}
            </p>
          </div>
          {(statsLoading || utilLoading) && (
            <Loader2 className="size-5 animate-spin text-blue-600" />
          )}
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {statsItems.map((item, index) => {
            const Icon = item.icon
            return (
              <Card
                key={index}
                className={`p-4 border-2 ${item.borderColor} ${item.bgColor} hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group bg-card/80 backdrop-blur-sm`}
              >
                <div className="flex flex-col items-start gap-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${item.color} shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon className="size-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0 w-full">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                      {item.label}
                    </p>
                    <p className="text-xl font-bold text-foreground leading-tight">{item.value}</p>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}

