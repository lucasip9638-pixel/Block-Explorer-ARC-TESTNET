"use client"

import { Card } from "@/components/ui/card"
import { ArrowRight, Clock, CheckCircle2, ArrowUpRight, ArrowDownRight, ExternalLink, Loader2, AlertCircle } from "lucide-react"
import { ARC_TESTNET_CONFIG } from "@/config/arc-testnet"
import { useRecentTransactions } from "@/hooks/use-recent-transactions"
import { formatAddress } from "@/lib/utils"
import { useEffect, useState } from "react"

export function RecentActivity() {
  const { data: transactions, isLoading, error, refetch, isError } = useRecentTransactions()
  const [hasShownEmpty, setHasShownEmpty] = useState(false)
  
  // O hook já atualiza automaticamente a cada 2 segundos
  // Apenas forçar refetch ao montar
  useEffect(() => {
    refetch()
  }, [refetch])
  
  // Resetar flag quando transações aparecerem
  useEffect(() => {
    if (transactions && transactions.length > 0) {
      setHasShownEmpty(false)
    }
  }, [transactions])
  
  // Log para debug detalhado
  useEffect(() => {
    console.log('📊 Estado do RecentActivity:', {
      isLoading,
      hasTransactions: !!transactions && transactions.length > 0,
      transactionCount: transactions?.length || 0,
      error: error?.message || null,
    })
    
    if (transactions && transactions.length > 0) {
      console.log('✅ ✅ ✅ TRANSAÇÕES ENCONTRADAS! Total:', transactions.length)
      console.log('📋 Primeiras 3 transações:', transactions.slice(0, 3).map(tx => ({
        hash: tx.hash.slice(0, 10) + '...',
        from: tx.from.slice(0, 10) + '...',
        type: tx.type,
        value: tx.value,
      })))
    } else if (!isLoading && !error) {
      console.warn('⚠️ Nenhuma transação encontrada. Verifique os logs acima para mais detalhes.')
    }
  }, [isLoading, transactions, error])
  
  // Auto-refresh quando a janela ganha foco
  useEffect(() => {
    const handleFocus = () => {
      console.log('🔄 Janela ganhou foco, atualizando transações...')
      refetch()
    }
    
    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [refetch])

  if (isLoading) {
    return (
      <section id="explorer" className="py-16 border-b border-border/40 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">Recent Transactions</h2>
            <p className="text-muted-foreground">Conectando à blockchain ARC Testnet...</p>
          </div>
          <Card className="p-8">
            <div className="flex items-center justify-center gap-3">
              <Loader2 className="size-6 animate-spin text-blue-600" />
              <p className="text-muted-foreground">Buscando transações diretamente da blockchain ARC Testnet...</p>
            </div>
          </Card>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section id="explorer" className="py-16 border-b border-border/40 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">Recent Transactions</h2>
            <p className="text-muted-foreground">Conectando à blockchain ARC Testnet...</p>
          </div>
          <Card className="p-8">
            <div className="text-center">
              <AlertCircle className="size-12 text-yellow-500 mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                Erro ao carregar transações. Verificando a rede ARC Testnet...
              </p>
              <button
                onClick={() => refetch()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                Tentar Novamente
              </button>
            </div>
          </Card>
        </div>
      </section>
    )
  }

  // Se não há transações mas não está carregando, mostrar mensagem informativa
  if (!isLoading && (!transactions || transactions.length === 0)) {
    return (
      <section id="explorer" className="py-20 border-b border-border/40 bg-gradient-to-b from-background via-blue-50/20 dark:via-blue-950/10 to-background">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-3xl font-bold text-foreground">Transações Recentes</h2>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/10 border border-blue-600/20">
                  <div className="relative flex size-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-600 opacity-75"></span>
                    <span className="relative inline-flex size-2 rounded-full bg-blue-600"></span>
                  </div>
                  <span className="text-xs font-semibold text-blue-600">ARC Testnet</span>
                </div>
              </div>
              <p className="text-muted-foreground">
                Transações reais atualizando a cada segundo da blockchain ARC Testnet
              </p>
            </div>
            <button
              onClick={() => {
                console.log('🔄 Forçando atualização manual...')
                refetch()
              }}
              className="hidden md:flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-cyan-500 hover:underline transition-colors"
            >
              Atualizar
              <ArrowRight className="size-4" />
            </button>
          </div>
          <Card className="p-12 text-center border-2 border-blue-600/20 bg-card/70 backdrop-blur-md">
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 rounded-full bg-blue-600/10 border-2 border-blue-600/20">
                <Loader2 className="size-8 text-blue-600 animate-spin" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {error ? 'Erro ao carregar transações' : 'Buscando transações...'}
                </h3>
                <p className="text-sm text-muted-foreground mb-1">
                  {error 
                    ? 'Não foi possível conectar à blockchain ARC Testnet no momento.'
                    : 'Conectando à blockchain ARC Testnet via API do Blockscout...'}
                </p>
                {error && (
                  <p className="text-xs text-red-500 mb-2">
                    Erro: {error.message || 'Erro ao conectar'}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  {error 
                    ? 'Verifique sua conexão e tente novamente.'
                    : 'Aguarde enquanto buscamos as transações mais recentes...'}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Abra o console do navegador (F12) para ver os logs detalhados
                </p>
              </div>
              <button
                onClick={() => {
                  console.log('🔄 Tentando novamente manualmente...')
                  refetch()
                }}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
              >
                Tentar Novamente
              </button>
            </div>
          </Card>
        </div>
      </section>
    )
  }

  return (
    <section id="explorer" className="py-20 border-b border-border/40 bg-gradient-to-b from-background via-blue-50/20 dark:via-blue-950/10 to-background">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-3xl font-bold text-foreground">Transações Recentes</h2>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/10 border border-blue-600/20">
                <div className="relative flex size-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-600 opacity-75"></span>
                  <span className="relative inline-flex size-2 rounded-full bg-blue-600"></span>
                </div>
                <span className="text-xs font-semibold text-blue-600">ARC Testnet</span>
              </div>
            </div>
            <p className="text-muted-foreground">
              Últimas {transactions.length} transação{transactions.length !== 1 ? 'ões' : ''} reais atualizando a cada segundo da blockchain ARC Testnet
              <span className="ml-2 inline-flex items-center gap-1 text-xs text-blue-600">
                <span className="relative flex size-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-600 opacity-75"></span>
                  <span className="relative inline-flex size-1.5 rounded-full bg-blue-600"></span>
                </span>
                Ao vivo
              </span>
            </p>
          </div>
          <button
            onClick={() => refetch()}
            className="hidden md:flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-cyan-500 hover:underline transition-colors"
          >
            Atualizar
            <ArrowRight className="size-4" />
          </button>
        </div>

        <Card className="overflow-hidden border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary/50 border-b border-border">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    From
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    To
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Ação
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {transactions.slice(0, 15).map((tx) => {
                  const explorerUrl = `${ARC_TESTNET_CONFIG.blockExplorerUrls[0]}/tx/${tx.hash}`
                  
                  return (
                    <tr key={tx.hash} className="hover:bg-secondary/30 transition-colors group">
                      <td className="px-6 py-4">
                        <a
                          href={explorerUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center hover:opacity-80 transition-opacity"
                          title={`Status: ${tx.status}`}
                        >
                          {tx.status === 'success' ? (
                            <CheckCircle2 className="size-5 text-green-500" />
                          ) : tx.status === 'pending' ? (
                            <Loader2 className="size-5 text-yellow-500 animate-spin" />
                          ) : (
                            <AlertCircle className="size-5 text-red-500" />
                          )}
                        </a>
                      </td>
                      <td className="px-6 py-4">
                        <a
                          href={explorerUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-600/10 text-blue-600 text-xs font-medium hover:bg-blue-600/20 transition-colors"
                        >
                          {tx.type}
                        </a>
                      </td>
                      <td className="px-6 py-4">
                        <a
                          href={`${ARC_TESTNET_CONFIG.blockExplorerUrls[0]}/address/${tx.from}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 hover:text-blue-600 transition-colors group/link"
                        >
                          <ArrowUpRight className="size-4 text-red-500" />
                          <span className="font-mono text-sm text-foreground" title={tx.from}>
                            {formatAddress(tx.from)}
                          </span>
                          <ExternalLink className="size-3 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                        </a>
                      </td>
                      <td className="px-6 py-4">
                        {tx.to ? (
                          <a
                            href={`${ARC_TESTNET_CONFIG.blockExplorerUrls[0]}/address/${tx.to}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 hover:text-blue-600 transition-colors group/link"
                          >
                            <ArrowDownRight className="size-4 text-green-500" />
                            <span className="font-mono text-sm text-foreground" title={tx.to}>
                              {formatAddress(tx.to)}
                            </span>
                            <ExternalLink className="size-3 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                          </a>
                        ) : (
                          <div className="flex items-center gap-2">
                            <ArrowDownRight className="size-4 text-green-500" />
                            <span className="font-mono text-sm text-muted-foreground">Contract</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <a
                          href={explorerUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold text-foreground hover:text-blue-600 transition-colors"
                        >
                          {parseFloat(tx.value) > 0 ? parseFloat(tx.value).toLocaleString('pt-BR', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 6,
                          }) : '0.00'} USDC
                        </a>
                      </td>
                      <td className="px-6 py-4">
                        <a
                          href={explorerUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-blue-600 transition-colors"
                        >
                          <Clock className="size-4" />
                          {tx.formattedTime}
                        </a>
                      </td>
                      <td className="px-6 py-4">
                        <a
                          href={explorerUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-blue-600 hover:text-cyan-500 hover:underline text-sm font-medium transition-colors group/link"
                          title="Ver transação no Block Explorer"
                        >
                          Ver Transação
                          <ExternalLink className="size-3.5 group-hover/link:scale-110 transition-transform" />
                        </a>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </section>
  )
}
