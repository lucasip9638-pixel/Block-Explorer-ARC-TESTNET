"use client"

import { Card } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useTransactionHistory } from "@/hooks/use-transaction-history"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Loader2, TrendingUp } from "lucide-react"

const chartConfig = {
  transactions: {
    label: "Transactions",
    color: "hsl(var(--chart-1))",
  },
}

export function TransactionChart() {
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
      <section className="py-12 border-b border-border/40 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-2">Transaction History (30 Days)</h2>
            <p className="text-sm text-muted-foreground">Sincronizado com ARC Scan em tempo real</p>
          </div>
          <Card className="p-8">
            <div className="flex items-center justify-center gap-3">
              <Loader2 className="size-6 animate-spin text-[#9333EA]" />
              <p className="text-muted-foreground">Carregando histórico de transações...</p>
            </div>
          </Card>
        </div>
      </section>
    )
  }

  if (!history || history.length === 0) {
    return (
      <section className="py-12 border-b border-border/40 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-2">Transaction History (30 Days)</h2>
            <p className="text-sm text-muted-foreground">Sincronizado com ARC Scan em tempo real</p>
          </div>
          <Card className="p-8 text-center">
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

  return (
    <section className="py-12 border-b border-border/40 bg-secondary/20">
      <div className="container mx-auto px-4">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Transaction History (30 Days)</h2>
            <p className="text-sm text-muted-foreground">Sincronizado com ARC Scan em tempo real</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <TrendingUp className="size-4" />
            <span>Atualiza a cada 30s</span>
          </div>
        </div>

        <Card className="p-6 bg-card border-border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 rounded-lg bg-secondary/50">
              <p className="text-xs text-muted-foreground mb-1">Total (30 dias)</p>
              <p className="text-2xl font-bold text-foreground">{formatNumber(totalTransactions)}</p>
            </div>
            <div className="p-4 rounded-lg bg-secondary/50">
              <p className="text-xs text-muted-foreground mb-1">Média Diária</p>
              <p className="text-2xl font-bold text-foreground">{formatNumber(avgDaily)}</p>
            </div>
            <div className="p-4 rounded-lg bg-secondary/50">
              <p className="text-xs text-muted-foreground mb-1">Pico Diário</p>
              <p className="text-2xl font-bold text-foreground">{formatNumber(maxDaily)}</p>
            </div>
          </div>

          <ChartContainer config={chartConfig} className="h-[400px] w-full">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#9333EA" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#EC4899" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="date"
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                tickFormatter={(value) => formatNumber(value)}
              />
              <ChartTooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-card p-3 shadow-sm">
                        <div className="grid gap-2">
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-sm text-muted-foreground">Data</span>
                            <span className="text-sm font-medium">{payload[0].payload.fullDate}</span>
                          </div>
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-sm text-muted-foreground">Transações</span>
                            <span className="text-sm font-bold text-[#9333EA]">
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
              <Area
                type="monotone"
                dataKey="transactions"
                stroke="#9333EA"
                strokeWidth={2}
                fill="url(#gradient)"
                fillOpacity={0.6}
              />
            </AreaChart>
          </ChartContainer>
        </Card>
      </div>
    </section>
  )
}





