"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Copy, ExternalLink, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ARC_TESTNET_CONFIG } from "@/config/arc-testnet"
import { useState } from "react"
import { useTransactionDetails } from "@/hooks/use-transaction-details"

export default function TransactionPage() {
  const params = useParams()
  const txHash = params?.hash as string
  const { data: tx, isLoading, error } = useTransactionDetails(txHash)
  const [copied, setCopied] = useState(false)

  const copyHash = () => {
    if (txHash) {
      navigator.clipboard.writeText(txHash)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const explorerUrl = `${ARC_TESTNET_CONFIG.blockExplorerUrls[0]}/tx/${txHash}`

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main>
          <section className="py-16 border-b border-border/40">
            <div className="container mx-auto px-4">
              <Card className="p-12 text-center">
                <Loader2 className="size-12 animate-spin text-blue-600 mx-auto mb-4" />
                <p className="text-muted-foreground">Carregando detalhes da transação...</p>
              </Card>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !tx) {
    return (
      <div className="min-h-screen">
        <Header />
        <main>
          <section className="py-16 border-b border-border/40">
            <div className="container mx-auto px-4">
              <Card className="p-12 text-center">
                <AlertCircle className="size-12 text-red-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-foreground mb-2">Transação não encontrada</h2>
                <p className="text-muted-foreground mb-4">
                  Não foi possível encontrar a transação com o hash fornecido.
                </p>
                <Button onClick={() => window.location.href = '/'}>
                  Voltar para Início
                </Button>
              </Card>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-blue-50/20 dark:via-blue-950/10 to-background">
      <Header />
      <main>
        <section className="py-16 border-b border-border/40">
          <div className="container mx-auto px-4">
            {/* Hash da Transação - Simplificado */}
            <Card className="p-8 bg-card border-2 border-blue-600/20 shadow-xl">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-foreground mb-6">Hash da Transação</h1>
                
                <div className="mb-6 p-6 rounded-xl bg-gradient-to-br from-blue-600/10 to-cyan-500/10 border-2 border-blue-600/20">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-semibold text-muted-foreground uppercase">Hash</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={copyHash}
                      className="h-8"
                    >
                      <Copy className={`size-4 ${copied ? 'text-green-500' : 'text-muted-foreground'}`} />
                    </Button>
                  </div>
                  <p className="font-mono text-base break-all text-foreground mb-4">{txHash}</p>
                  
                  <a
                    href={explorerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors shadow-lg hover:shadow-xl"
                  >
                    Ver no ARC Scan
                    <ExternalLink className="size-4" />
                  </a>
                </div>
              </div>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
