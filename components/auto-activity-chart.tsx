"use client"

import { Card } from "@/components/ui/card"
import { useRecentTransactions } from "@/hooks/use-recent-transactions"
import { Activity, TrendingUp } from "lucide-react"
import { useEffect, useMemo, useState } from "react"

interface ActivityData {
  hour: number
  count: number
}

export function AutoActivityChart() {
  const { data: transactions } = useRecentTransactions()
  const [activityData, setActivityData] = useState<ActivityData[]>([])

  // Agrupar transações por hora
  useEffect(() => {
    if (transactions && transactions.length > 0) {
      const now = new Date()
      const hours: { [key: number]: number } = {}
      
      // Inicializar últimas 24 horas
      for (let i = 0; i < 24; i++) {
        const hour = new Date(now.getTime() - i * 60 * 60 * 1000)
        hours[hour.getHours()] = 0
      }

      // Contar transações por hora
      transactions.forEach(tx => {
        const txDate = new Date(tx.timestamp * 1000)
        const hour = txDate.getHours()
        if (hours[hour] !== undefined) {
          hours[hour]++
        }
      })

      // Converter para array e ordenar
      const data = Object.entries(hours)
        .map(([hour, count]) => ({
          hour: parseInt(hour),
          count,
        }))
        .sort((a, b) => a.hour - b.hour)
        .slice(-12) // Últimas 12 horas

      setActivityData(data)
    }
  }, [transactions])

  const maxCount = useMemo(() => {
    return Math.max(...activityData.map(d => d.count), 1)
  }, [activityData])

  if (activityData.length === 0) {
    return null
  }

  return (
    <section className="py-8 border-b border-border/40 bg-gradient-to-br from-background via-secondary/20 to-background">
      <div className="container mx-auto px-4">
        <Card className="p-6 bg-card/70 backdrop-blur-md border-2 border-border/60">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500">
                <Activity className="size-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Atividade da Rede</h3>
                <p className="text-sm text-muted-foreground">
                  Transações por hora (últimas 12 horas)
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="size-4" />
              <span>Atualização automática</span>
            </div>
          </div>

          <div className="flex items-end justify-between gap-2 h-32">
            {activityData.map((data, index) => {
              const height = (data.count / maxCount) * 100
              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex items-end justify-center h-full">
                    <div
                      className="w-full rounded-t-md bg-gradient-to-t from-blue-600 to-cyan-500 transition-all duration-500 hover:opacity-80"
                      style={{
                        height: `${Math.max(height, 5)}%`,
                        minHeight: '4px',
                      }}
                      title={`${data.hour}h: ${data.count} transações`}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">
                    {data.hour}h
                  </span>
                  {data.count > 0 && (
                    <span className="text-xs font-bold text-blue-600">
                      {data.count}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </Card>
      </div>
    </section>
  )
}

