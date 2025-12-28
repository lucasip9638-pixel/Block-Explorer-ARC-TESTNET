"use client"

import { Card } from "@/components/ui/card"
import { useNetworkUtilization } from "@/hooks/use-network-utilization"
import { Activity, Loader2 } from "lucide-react"

export function NetworkUtilization() {
  const { data: utilization, isLoading } = useNetworkUtilization()

  return (
    <section className="py-8 border-b border-border/40 bg-gradient-to-br from-background via-secondary/20 to-background">
      <div className="container mx-auto px-4">
        <Card className="p-6 bg-card/70 backdrop-blur-md border-2 border-border/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-lg">
                <Activity className="size-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  Utilização da rede
                </h3>
                <p className="text-sm text-muted-foreground">
                  Capacidade de gás utilizada na ARC Testnet
                </p>
              </div>
            </div>
            <div className="text-right">
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="size-5 animate-spin text-blue-600" />
                  <span className="text-2xl font-bold text-muted-foreground">...</span>
                </div>
              ) : (
                <div>
                  <p className="text-3xl font-bold text-blue-600">
                    {utilization?.utilization.toFixed(2) || '0.00'}%
                  </p>
                  <div className="mt-2 w-32 h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 to-cyan-500 transition-all duration-500"
                      style={{
                        width: `${Math.min(utilization?.utilization || 0, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}

