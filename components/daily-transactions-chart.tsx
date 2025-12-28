"use client"

import { Card } from "@/components/ui/card"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { useTransactionHistory } from "@/hooks/use-transaction-history"
import { CartesianGrid, XAxis, YAxis, Bar, BarChart } from "recharts"
import { Loader2, TrendingUp, Calendar } from "lucide-react"

const chartConfig = {
  transactions: {
    label: "Daily Transactions",
    color: "#9333EA",
  },
}

export function DailyTransactionsChart() {
  const { data: history, isLoading } = useTransactionHistory()

  const formatNumber = (num: number) => {
    if (num >= 1_000_000) {
      return `${(num / 1_000_000).toFixed(2)}M`
    }
    if (num >= 1_000) {
      return `${(num / 1_000).toFixed(1)}K`
    }
    return num.toLocaleString()
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
  }

  if (isLoading) {
    return (
      <section className="py-16 bg-gradient-to-br from-background via-background to-secondary/20">
        <div className="container mx-auto px-4">
          <div className="mb-8 text-center">
            <div className="inline-flex items-center gap-2 mb-4">
              <Calendar className="size-6 text-[#9333EA]" />
              <h2 className="text-4xl font-bold text-foreground">Daily Transactions</h2>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Transaction volume on ARC Testnet over the last 30 days
            </p>
          </div>
          <Card className="p-12">
            <div className="flex items-center justify-center gap-3">
              <Loader2 className="size-8 animate-spin text-[#9333EA]" />
              <p className="text-muted-foreground">Carregando dados de transações diárias...</p>
            </div>
          </Card>
        </div>
      </section>
    )
  }

  if (!history || history.length === 0) {
    return (
      <section className="py-16 bg-gradient-to-br from-background via-background to-secondary/20">
        <div className="container mx-auto px-4">
          <div className="mb-8 text-center">
            <div className="inline-flex items-center gap-2 mb-4">
              <Calendar className="size-6 text-[#9333EA]" />
              <h2 className="text-4xl font-bold text-foreground">Daily Transactions</h2>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Transaction volume on ARC Testnet over the last 30 days
            </p>
          </div>
          <Card className="p-12 text-center border-2 border-border/60">
            <p className="text-muted-foreground">Nenhum dado histórico disponível no momento</p>
          </Card>
        </div>
      </section>
    )
  }

  // Preparar dados para o gráfico
  const chartData = history.map((item) => ({
    date: formatDate(item.date),
    fullDate: item.date,
    transactions: item.transactions,
  }))

  // Calcular estatísticas
  const totalTransactions = history.reduce((sum, item) => sum + item.transactions, 0)
  const avgDaily = Math.round(totalTransactions / history.length)
  const maxDaily = Math.max(...history.map((item) => item.transactions))
  const minDaily = Math.min(...history.map((item) => item.transactions))
  const todayTransactions = history[history.length - 1]?.transactions || 0

  return (
    <section className="py-16 bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <Calendar className="size-6 text-[#9333EA]" />
            <h2 className="text-4xl font-bold text-foreground">Daily Transactions</h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Transaction volume on ARC Testnet over the last 30 days
          </p>
        </div>

        <Card className="p-8 bg-card border-2 border-border/60 shadow-xl">
          {/* Estatísticas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="p-5 rounded-xl bg-gradient-to-br from-[#9333EA]/10 to-[#EC4899]/10 border border-[#9333EA]/20">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Today</p>
              <p className="text-3xl font-bold text-foreground">{formatNumber(todayTransactions)}</p>
              <p className="text-xs text-muted-foreground mt-1">transactions</p>
            </div>
            <div className="p-5 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Total (30 days)</p>
              <p className="text-3xl font-bold text-foreground">{formatNumber(totalTransactions)}</p>
              <p className="text-xs text-muted-foreground mt-1">transactions</p>
            </div>
            <div className="p-5 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Daily Average</p>
              <p className="text-3xl font-bold text-foreground">{formatNumber(avgDaily)}</p>
              <p className="text-xs text-muted-foreground mt-1">transactions/day</p>
            </div>
            <div className="p-5 rounded-xl bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Peak Daily</p>
              <p className="text-3xl font-bold text-foreground">{formatNumber(maxDaily)}</p>
              <p className="text-xs text-muted-foreground mt-1">transactions</p>
            </div>
          </div>

          {/* Gráfico */}
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Transaction Volume (Last 30 Days)</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="size-4" />
              <span>Updated every 30s</span>
            </div>
          </div>

          <ChartContainer config={chartConfig} className="h-[450px] w-full">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 60 }}>
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#9333EA" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#EC4899" stopOpacity={0.6} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
              <XAxis
                dataKey="date"
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                angle={-45}
                textAnchor="end"
                height={80}
                interval={2}
              />
              <YAxis
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                tickFormatter={(value) => formatNumber(value)}
              />
              <ChartTooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border-2 border-[#9333EA]/20 bg-card p-4 shadow-xl">
                        <div className="grid gap-3">
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-sm font-medium text-muted-foreground">Date</span>
                            <span className="text-sm font-bold text-foreground">{payload[0].payload.fullDate}</span>
                          </div>
                          <div className="flex items-center justify-between gap-4 border-t border-border pt-2">
                            <span className="text-sm font-medium text-muted-foreground">Transactions</span>
                            <span className="text-lg font-bold text-[#9333EA]">
                              {formatNumber(payload[0].value as number)}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Bar
                dataKey="transactions"
                fill="url(#barGradient)"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ChartContainer>

          <div className="mt-6 pt-6 border-t border-border/50">
            <p className="text-xs text-center text-muted-foreground">
              Data synchronized with ARC Scan in real-time • Last 30 days of network activity
            </p>
          </div>
        </Card>
      </div>
    </section>
  )
}

