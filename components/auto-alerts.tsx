"use client"

import { Card } from "@/components/ui/card"
import { useRecentBlocks } from "@/hooks/use-recent-blocks"
import { useRecentTransactions } from "@/hooks/use-recent-transactions"
import { Bell, Sparkles, AlertCircle, CheckCircle2 } from "lucide-react"
import { useEffect, useState } from "react"

interface Alert {
  id: string
  type: 'new-block' | 'new-transaction' | 'network-status'
  message: string
  timestamp: Date
  icon: React.ReactNode
}

export function AutoAlerts() {
  const { data: blocks } = useRecentBlocks()
  const { data: transactions } = useRecentTransactions()
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [lastBlockNumber, setLastBlockNumber] = useState<bigint | null>(null)
  const [lastTxHash, setLastTxHash] = useState<string | null>(null)

  // Detectar novos blocos
  useEffect(() => {
    if (blocks && blocks.length > 0) {
      const newestBlock = blocks[0]
      
      if (lastBlockNumber === null) {
        setLastBlockNumber(newestBlock.number)
        return
      }

      if (newestBlock.number > lastBlockNumber) {
        const newAlert: Alert = {
          id: `block-${newestBlock.number}`,
          type: 'new-block',
          message: `Novo bloco minerado! #${newestBlock.number.toLocaleString()}`,
          timestamp: new Date(),
          icon: <Sparkles className="size-4 text-blue-600" />,
        }
        
        setAlerts(prev => [newAlert, ...prev.slice(0, 4)])
        setLastBlockNumber(newestBlock.number)
        
        // Remover alerta após 10 segundos
        setTimeout(() => {
          setAlerts(prev => prev.filter(a => a.id !== newAlert.id))
        }, 10000)
      }
    }
  }, [blocks, lastBlockNumber])

  // Detectar novas transações
  useEffect(() => {
    if (transactions && transactions.length > 0) {
      const newestTx = transactions[0]
      
      if (lastTxHash === null) {
        setLastTxHash(newestTx.hash)
        return
      }

      if (newestTx.hash !== lastTxHash) {
        const newAlert: Alert = {
          id: `tx-${newestTx.hash.slice(0, 10)}`,
          type: 'new-transaction',
          message: `Nova transação: ${newestTx.hash.slice(0, 10)}...${newestTx.hash.slice(-6)}`,
          timestamp: new Date(),
          icon: <CheckCircle2 className="size-4 text-green-600" />,
        }
        
        setAlerts(prev => [newAlert, ...prev.slice(0, 4)])
        setLastTxHash(newestTx.hash)
        
        // Remover alerta após 8 segundos
        setTimeout(() => {
          setAlerts(prev => prev.filter(a => a.id !== newAlert.id))
        }, 8000)
      }
    }
  }, [transactions, lastTxHash])

  if (alerts.length === 0) {
    return null
  }

  return (
    <section className="py-4 bg-gradient-to-b from-background to-transparent">
      <div className="container mx-auto px-4">
        <div className="space-y-2">
          {alerts.map((alert) => (
            <Card
              key={alert.id}
              className="p-3 border-l-4 border-blue-600 bg-blue-600/10 animate-in slide-in-from-right duration-300"
            >
              <div className="flex items-center gap-3">
                {alert.icon}
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{alert.message}</p>
                  <p className="text-xs text-muted-foreground">
                    {alert.timestamp.toLocaleTimeString('pt-BR')}
                  </p>
                </div>
                <Bell className="size-4 text-blue-600 animate-pulse" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

