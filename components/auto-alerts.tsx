"use client"

import { Card } from "@/components/ui/card"
import { useRecentTransactions } from "@/hooks/use-recent-transactions"
import { CheckCircle2, ExternalLink, Clock, Loader2, AlertCircle } from "lucide-react"
import { useMemo } from "react"
import { ARC_TESTNET_CONFIG } from "@/config/arc-testnet"
import { formatAddress } from "@/lib/utils"

export function AutoAlerts() {
  const { data: transactions, isLoading } = useRecentTransactions()

  // Sempre mostrar as 10 transações mais recentes
  const displayTransactions = useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return []
    }
    return transactions.slice(0, 10)
  }, [transactions])

  const formatTime = (timestamp: number) => {
    try {
      const date = new Date(timestamp * 1000)
      return date.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
      })
    } catch {
      return '--:--:--'
    }
  }

  if (isLoading) {
    return (
      <section className="py-8 border-b border-border/40 bg-gradient-to-b from-background to-transparent">
        <div className="container mx-auto px-4">
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-foreground">Transações Recentes</h3>
            <p className="text-sm text-muted-foreground">Carregando transações da rede ARC...</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
            {Array.from({ length: 10 }).map((_, index) => (
              <Card key={index} className="p-4 border-2 border-border/60 bg-card/50">
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="size-4 animate-spin text-blue-600" />
                  <span className="text-xs text-muted-foreground">Carregando...</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (!displayTransactions || displayTransactions.length === 0) {
    return (
      <section className="py-8 border-b border-border/40 bg-gradient-to-b from-background to-transparent">
        <div className="container mx-auto px-4">
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-foreground">Transações Recentes</h3>
            <p className="text-sm text-muted-foreground">Aguardando transações na rede ARC...</p>
          </div>
          <Card className="p-8 text-center border-2 border-border/60">
            <AlertCircle className="size-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Nenhuma transação disponível no momento</p>
          </Card>
        </div>
      </section>
    )
  }

  // Garantir que sempre temos 10 cards (preencher com placeholders se necessário)
  const cardsToShow = Array.from({ length: 10 }).map((_, index) => {
    if (index < displayTransactions.length) {
      return displayTransactions[index]
    }
    return null // Placeholder para manter sempre 10 cards
  })

  return (
    <section className="py-8 border-b border-border/40 bg-gradient-to-b from-background to-transparent">
      <div className="container mx-auto px-4">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-foreground">Transações Recentes</h3>
            <p className="text-sm text-muted-foreground">
              Últimas 10 transações da rede ARC Testnet • Atualização automática
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/10 border border-blue-600/20">
            <div className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-600 opacity-75"></span>
              <span className="relative inline-flex size-2 rounded-full bg-blue-600"></span>
            </div>
            <span className="text-xs font-semibold text-blue-600">Ao vivo</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          {cardsToShow.map((tx, index) => {
            if (!tx) {
              // Placeholder para manter sempre 10 cards
              return (
                <Card
                  key={`placeholder-${index}`}
                  className="p-4 border-2 border-border/30 bg-card/30 opacity-50"
                >
                  <div className="flex flex-col gap-2">
                    <div className="h-4 bg-muted/30 rounded w-3/4"></div>
                    <div className="h-3 bg-muted/20 rounded w-1/2"></div>
                  </div>
                </Card>
              )
            }

            const explorerUrl = `${ARC_TESTNET_CONFIG.blockExplorerUrls[0]}/tx/${tx.hash}`

            return (
              <Card
                key={tx.hash}
                className="p-4 border-2 border-blue-600/20 bg-card/70 hover:border-blue-600/40 hover:shadow-lg transition-all duration-300 group animate-in slide-in-from-bottom-4 fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex flex-col gap-3">
                  {/* Status e Hash */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {tx.status === 'success' ? (
                        <CheckCircle2 className="size-4 text-green-500 flex-shrink-0" />
                      ) : tx.status === 'pending' ? (
                        <Loader2 className="size-4 text-yellow-500 animate-spin flex-shrink-0" />
                      ) : (
                        <AlertCircle className="size-4 text-red-500 flex-shrink-0" />
                      )}
                      <a
                        href={explorerUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-xs text-foreground hover:text-blue-600 transition-colors break-all group/link"
                        title={tx.hash}
                      >
                        {formatAddress(tx.hash, 6, 4)}
                        <ExternalLink className="size-2.5 inline-block ml-1 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                      </a>
                    </div>
                  </div>

                  {/* Tipo */}
                  <div>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-600/10 text-blue-600 text-xs font-medium">
                      {tx.type || 'Transfer'}
                    </span>
                  </div>

                  {/* Valor */}
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Valor</p>
                    <p className="text-sm font-semibold text-foreground break-words">
                      {(() => {
                        try {
                          let numValue = typeof tx.value === 'string' ? parseFloat(tx.value) : Number(tx.value)
                          
                          // Verificar se o valor parece estar incorreto (muito grande)
                          // Se for maior que 1000, pode estar com decimais errados
                          if (numValue > 1000) {
                            // Dividir por 10^12 se parecer estar usando 18 decimais em vez de 6
                            const adjusted = numValue / 1000000000000
                            if (adjusted > 0 && adjusted <= 1000) {
                              numValue = adjusted
                            }
                          }
                          
                          if (isNaN(numValue) || numValue <= 0) {
                            return '0,00'
                          }
                          
                          // Formatar com 2 casas decimais para valores pequenos
                          // Exemplo: 0,001 USDC = 0,00 USDC (arredondado) ou 0,001 USDC (com mais casas)
                          // Para valores muito pequenos, mostrar mais casas decimais
                          let formatted
                          if (numValue < 0.01) {
                            // Valores muito pequenos: mostrar até 6 casas decimais
                            formatted = numValue.toLocaleString('pt-BR', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 6,
                            })
                          } else {
                            // Valores normais: 2 casas decimais
                            formatted = numValue.toLocaleString('pt-BR', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })
                          }
                          return formatted
                        } catch {
                          return '0,00'
                        }
                      })()} USDC
                    </p>
                  </div>

                  {/* Tempo */}
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="size-3" />
                    <span>{formatTime(tx.timestamp)}</span>
                  </div>

                  {/* Link para ARC Scan */}
                  <a
                    href={explorerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md bg-blue-600/10 hover:bg-blue-600/20 text-blue-600 hover:text-blue-700 transition-colors text-xs font-medium mt-1"
                  >
                    Ver no ARC Scan
                    <ExternalLink className="size-3" />
                  </a>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}

