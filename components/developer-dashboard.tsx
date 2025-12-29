"use client"

import { Card } from "@/components/ui/card"
import { useArcScanStats } from "@/hooks/use-arc-scan-stats"
import { Code, Zap, Database, GitBranch, Terminal, Rocket, Cpu, Network } from "lucide-react"
import { Loader2 } from "lucide-react"
import { ARC_TESTNET_CONFIG } from "@/config/arc-testnet"

export function DeveloperDashboard() {
  const { data: stats, isLoading } = useArcScanStats()

  const developerMetrics = [
    {
      icon: Code,
      label: "Smart Contracts",
      value: stats?.dappsCount || 0,
      description: "Verified contracts on ARC",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
    },
    {
      icon: Zap,
      label: "Network TPS",
      value: `${stats?.networkTPS || 0}`,
      suffix: " TPS",
      description: "Transactions per second",
      color: "from-yellow-500 to-orange-500",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/20",
    },
    {
      icon: Database,
      label: "Total Blocks",
      value: stats?.totalBlocks || 0,
      description: "Blocks mined on ARC",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
    },
    {
      icon: Network,
      label: "Active Addresses",
      value: stats?.totalAddresses || 0,
      description: "Unique addresses",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20",
    },
  ]

  const developerTools = [
    {
      icon: Terminal,
      title: "RPC Endpoint",
      description: "Connect your dApp to ARC Testnet",
      value: ARC_TESTNET_CONFIG.rpcUrls[0],
      copyable: true,
    },
    {
      icon: GitBranch,
      title: "Chain ID",
      description: "Network identifier",
      value: ARC_TESTNET_CONFIG.chainId.toString(),
      copyable: true,
    },
    {
      icon: Rocket,
      title: "Block Explorer",
      description: "Explore blocks and transactions",
      value: ARC_TESTNET_CONFIG.blockExplorerUrls[0],
      link: ARC_TESTNET_CONFIG.blockExplorerUrls[0],
    },
    {
      icon: Cpu,
      title: "Network Name",
      description: "Official network name",
      value: ARC_TESTNET_CONFIG.chainName,
      copyable: true,
    },
  ]

  const formatNumber = (num: number | string): string => {
    const numValue = typeof num === 'string' ? parseFloat(num) || 0 : num
    if (numValue >= 1_000_000) {
      return `${(numValue / 1_000_000).toFixed(2)}M`
    }
    if (numValue >= 1_000) {
      return `${(numValue / 1_000).toFixed(1)}K`
    }
    return numValue.toLocaleString()
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  if (isLoading) {
    return null
  }

  return (
    <section className="py-16 bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <Code className="size-6 text-[#9333EA]" />
            <h2 className="text-4xl font-bold text-foreground">Developer Dashboard</h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Essential metrics and tools for building on ARC Testnet
          </p>
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {developerMetrics.map((metric, index) => {
            const Icon = metric.icon
            return (
              <Card
                key={index}
                className={`p-6 border-2 ${metric.borderColor} ${metric.bgColor} hover:shadow-xl transition-all`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${metric.color} shadow-lg`}>
                    <Icon className="size-6 text-white" />
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                    {metric.label}
                  </p>
                  <p className="text-3xl font-bold text-foreground mb-1">
                    {formatNumber(metric.value)}
                    {metric.suffix || ""}
                  </p>
                  <p className="text-xs text-muted-foreground">{metric.description}</p>
                </div>
              </Card>
            )
          })}
        </div>

        {/* Ferramentas de Desenvolvimento */}
        <div>
          <h3 className="text-2xl font-bold text-foreground mb-6 text-center">Development Tools</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {developerTools.map((tool, index) => {
              const Icon = tool.icon
              return (
                <Card
                  key={index}
                  className="p-6 border-2 border-border/60 hover:border-[#9333EA]/50 hover:shadow-xl transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-[#9333EA] to-[#EC4899]">
                      <Icon className="size-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-foreground mb-1">{tool.title}</h4>
                      <p className="text-sm text-muted-foreground mb-3">{tool.description}</p>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 px-3 py-2 rounded-md bg-secondary/50 text-sm font-mono text-foreground break-all">
                          {tool.value}
                        </code>
                        {tool.copyable && (
                          <button
                            onClick={() => copyToClipboard(tool.value)}
                            className="px-3 py-2 rounded-md bg-[#9333EA]/10 text-[#9333EA] hover:bg-[#9333EA]/20 transition-colors text-sm font-medium"
                          >
                            Copy
                          </button>
                        )}
                        {tool.link && (
                          <a
                            href={tool.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-2 rounded-md bg-[#9333EA]/10 text-[#9333EA] hover:bg-[#9333EA]/20 transition-colors text-sm font-medium"
                          >
                            Open
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}





Nenhuma transação disponível no momento