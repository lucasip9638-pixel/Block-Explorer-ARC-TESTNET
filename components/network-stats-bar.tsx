"use client"

import { useArcScanStats } from "@/hooks/use-arc-scan-stats"
import { Activity, Blocks, Users, Zap } from "lucide-react"
import { Card } from "@/components/ui/card"

export function NetworkStatsBar() {
  const { data: stats, isLoading } = useArcScanStats()

  const formatNumber = (num: number): string => {
    if (num >= 1_000_000) {
      return `${(num / 1_000_000).toFixed(2)}M`
    }
    if (num >= 1_000) {
      return `${(num / 1_000).toFixed(1)}K`
    }
    return num.toLocaleString()
  }

  const statsItems = [
    {
      icon: Blocks,
      label: "Current Block",
      value: isLoading ? "..." : stats?.currentBlock.toLocaleString() || "0",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
    },
    {
      icon: Activity,
      label: "Total Transactions",
      value: isLoading
        ? "..."
        : stats?.totalTransactions
          ? formatNumber(stats.totalTransactions)
          : "0",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20",
    },
    {
      icon: Users,
      label: "Active Wallets",
      value: isLoading ? "..." : formatNumber(stats?.activeWallets || 0),
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
    },
    {
      icon: Zap,
      label: "Network TPS",
      value: isLoading ? "..." : (stats?.networkTPS || 0).toFixed(2),
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/20",
    },
  ]

  return (
    <section className="py-8 bg-gradient-to-br from-background via-secondary/40 to-background border-b-2 border-border/60 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {statsItems.map((item, index) => {
            const Icon = item.icon
            return (
              <Card
                key={index}
                className={`p-5 md:p-6 border-2 ${item.borderColor} ${item.bgColor} hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group bg-card/80 backdrop-blur-sm`}
              >
                <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${item.color} shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon className="size-5 md:size-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs md:text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                      {item.label}
                    </p>
                    <p className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground leading-tight">{item.value}</p>
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

