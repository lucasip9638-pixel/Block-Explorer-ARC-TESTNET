"use client"

import { Card } from "@/components/ui/card"
import { useArcScanStats } from "@/hooks/use-arc-scan-stats"
import { CheckCircle2, AlertCircle, Activity, Server } from "lucide-react"
import { Loader2 } from "lucide-react"

export function NetworkHealth() {
  const { data: stats, isLoading } = useArcScanStats()

  const getHealthStatus = () => {
    if (!stats) return { status: "unknown", color: "gray", label: "Unknown" }

    // Calcular saúde baseado em múltiplos fatores
    let score = 100

    // Verificar TPS (ARC tem alta performance)
    if (stats.networkTPS < 1) score -= 20
    else if (stats.networkTPS < 5) score -= 10

    // Verificar se há transações recentes
    if (stats.dailyTransactions === 0) score -= 30

    // Verificar se há blocos sendo minerados
    if (stats.currentBlock === 0) score -= 50

    if (score >= 90) return { status: "excellent", color: "green", label: "Excellent" }
    if (score >= 70) return { status: "good", color: "blue", label: "Good" }
    if (score >= 50) return { status: "fair", color: "yellow", label: "Fair" }
    return { status: "poor", color: "red", label: "Poor" }
  }

  const health = getHealthStatus()

  const healthIndicators = [
    {
      label: "Network Status",
      value: health.label,
      status: health.status,
      icon: Server,
      description: "Overall network health",
    },
    {
      label: "Block Production",
      value: stats?.currentBlock ? "Active" : "Inactive",
      status: stats?.currentBlock ? "excellent" : "poor",
      icon: Activity,
      description: `Current block: ${stats?.currentBlock.toLocaleString() || "N/A"}`,
    },
    {
      label: "Transaction Throughput",
      value: `${stats?.networkTPS || 0} TPS`,
      status: stats && stats.networkTPS > 5 ? "excellent" : stats && stats.networkTPS > 0 ? "good" : "fair",
      icon: CheckCircle2,
      description: "Transactions per second",
    },
  ]

  if (isLoading) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="size-8 animate-spin text-[#9333EA]" />
          </div>
        </div>
      </section>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "text-green-500 bg-green-500/10 border-green-500/20"
      case "good":
        return "text-blue-500 bg-blue-500/10 border-blue-500/20"
      case "fair":
        return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20"
      default:
        return "text-red-500 bg-red-500/10 border-red-500/20"
    }
  }

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <Activity className="size-6 text-[#9333EA]" />
            <h2 className="text-4xl font-bold text-foreground">Network Health</h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real-time monitoring of ARC Testnet network status and performance
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {healthIndicators.map((indicator, index) => {
            const Icon = indicator.icon
            return (
              <Card
                key={index}
                className={`p-6 border-2 ${getStatusColor(indicator.status)} hover:shadow-xl transition-all`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-2 rounded-lg ${getStatusColor(indicator.status)}`}>
                    <Icon className="size-5" />
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                    {indicator.label}
                  </p>
                  <p className="text-xl font-bold text-foreground mb-1">{indicator.value}</p>
                  <p className="text-xs text-muted-foreground">{indicator.description}</p>
                </div>
              </Card>
            )
          })}
        </div>

        <div className="mt-8 flex items-center justify-center gap-4">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${getStatusColor(health.status)}`}>
            <div className={`size-2 rounded-full ${health.status === "excellent" ? "bg-green-500" : health.status === "good" ? "bg-blue-500" : health.status === "fair" ? "bg-yellow-500" : "bg-red-500"} animate-pulse`} />
            <span className="text-sm font-semibold">Network Status: {health.label}</span>
          </div>
        </div>
      </div>
    </section>
  )
}





