"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Clock, CheckCircle2, ArrowUpRight, ArrowDownRight, ExternalLink, Loader2, AlertCircle } from "lucide-react"
import { useWalletTransactions } from "@/hooks/use-wallet-transactions"
import { useAccount } from "wagmi"
import { ARC_TESTNET_CONFIG } from "@/config/arc-testnet"
import { formatDistanceToNow } from "date-fns"
import { formatAddress } from "@/lib/utils"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface WalletActivityProps {
  address?: string
  title?: string
}

const TRANSACTIONS_PER_PAGE = 15

export function WalletActivity({ address, title = "Minhas Transações" }: WalletActivityProps) {
  const { address: connectedAddress } = useAccount()
  const walletAddress = address || connectedAddress
  const [currentPage, setCurrentPage] = useState(1)
  
  const { data: transactions, isLoading, error, refetch } = useWalletTransactions(walletAddress)
  
  // Calcular paginação
  const totalTransactions = transactions?.length || 0
  const totalPages = Math.ceil(totalTransactions / TRANSACTIONS_PER_PAGE)
  const startIndex = (currentPage - 1) * TRANSACTIONS_PER_PAGE
  const endIndex = startIndex + TRANSACTIONS_PER_PAGE
  const currentTransactions = transactions?.slice(startIndex, endIndex) || []
  
  // Resetar para página 1 quando as transações mudarem
  useEffect(() => {
    if (transactions && currentPage > Math.ceil(transactions.length / TRANSACTIONS_PER_PAGE)) {
      setCurrentPage(1)
    }
  }, [transactions, currentPage])

  const formatTime = (timestamp: number) => {
    try {
      return formatDistanceToNow(new Date(timestamp * 1000), { addSuffix: true })
    } catch {
      return new Date(timestamp * 1000).toLocaleString()
    }
  }

  const getExplorerUrl = (txHash: string) => {
    return `${ARC_TESTNET_CONFIG.blockExplorerUrls[0]}/tx/${txHash}`
  }

  if (!walletAddress) {
    return (
      <Card className="p-10 text-center border-2 border-border/60 bg-card/50">
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 rounded-full bg-[#9333EA]/10 border-2 border-[#9333EA]/20">
            <AlertCircle className="size-8 text-[#9333EA]" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Wallet Verification Required</h3>
            <p className="text-sm text-muted-foreground">Verifique sua wallet para visualizar transações</p>
          </div>
        </div>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card className="p-8">
        <div className="flex items-center justify-center gap-3">
          <Loader2 className="size-6 animate-spin text-[#9333EA]" />
          <p className="text-muted-foreground">Carregando transações...</p>
        </div>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="p-8">
        <div className="text-center">
          <AlertCircle className="size-12 text-yellow-500 mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">
            Erro ao carregar transações. Tentando método alternativo...
          </p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-[#9333EA] text-white rounded-lg hover:opacity-90"
          >
            Tentar Novamente
          </button>
        </div>
      </Card>
    )
  }

  if (!transactions || transactions.length === 0) {
    return (
      <Card className="p-8 text-center">
        <AlertCircle className="size-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground mb-2">Nenhuma transação encontrada</p>
        <p className="text-sm text-muted-foreground">
          Este endereço ainda não possui transações na ARC Testnet
        </p>
      </Card>
    )
  }

  return (
    <section className="py-16 border-b border-border/40 bg-secondary/20">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">{title}</h2>
            <p className="text-muted-foreground">
              {totalTransactions} transação{totalTransactions !== 1 ? 'ões' : ''} encontrada{totalTransactions !== 1 ? 's' : ''}
              {totalPages > 1 && (
                <span className="ml-2">
                  • Página {currentPage} de {totalPages} • Mostrando {startIndex + 1}-{Math.min(endIndex, totalTransactions)} de {totalTransactions}
                </span>
              )}
            </p>
          </div>
          <button
            onClick={() => refetch()}
            className="hidden md:flex items-center gap-2 text-sm font-medium text-[#9333EA] hover:underline"
          >
            Atualizar
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
                    Tipo
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    De
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Para
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Valor
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Quando
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Ação
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {currentTransactions.map((tx) => {
                  const isSent = tx.from.toLowerCase() === walletAddress?.toLowerCase()
                  
                  return (
                    <tr key={tx.hash} className="hover:bg-secondary/30 transition-colors">
                      <td className="px-6 py-4">
                        {tx.status === 'success' ? (
                          <CheckCircle2 className="size-5 text-green-500" />
                        ) : tx.status === 'pending' ? (
                          <Loader2 className="size-5 text-yellow-500 animate-spin" />
                        ) : (
                          <AlertCircle className="size-5 text-red-500" />
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#9333EA]/10 text-[#9333EA] text-xs font-medium">
                          {tx.type || (isSent ? 'Enviado' : 'Recebido')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <ArrowUpRight className="size-4 text-red-500" />
                          <span className="font-mono text-sm text-foreground" title={tx.from}>
                            {formatAddress(tx.from)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <ArrowDownRight className="size-4 text-green-500" />
                          <span className="font-mono text-sm text-foreground" title={tx.to || 'Contract Creation'}>
                            {tx.to ? formatAddress(tx.to) : 'Contract'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`font-semibold ${isSent ? 'text-red-500' : 'text-green-500'}`}>
                          {isSent ? '-' : '+'}{parseFloat(tx.value).toFixed(4)} USDC
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="size-4" />
                          {formatTime(tx.timestamp)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <a
                          href={getExplorerUrl(tx.hash)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[#9333EA] hover:underline text-sm"
                        >
                          Ver
                          <ExternalLink className="size-3" />
                        </a>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      if (currentPage > 1) {
                        setCurrentPage(currentPage - 1)
                      }
                    }}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>

                {/* Mostrar números das páginas */}
                {(() => {
                  const pages: (number | 'ellipsis')[] = []
                  
                  if (totalPages <= 7) {
                    // Se tiver 7 ou menos páginas, mostrar todas
                    for (let i = 1; i <= totalPages; i++) {
                      pages.push(i)
                    }
                  } else {
                    // Sempre mostrar primeira página
                    pages.push(1)
                    
                    if (currentPage > 3) {
                      pages.push('ellipsis')
                    }
                    
                    // Mostrar páginas ao redor da atual
                    const start = Math.max(2, currentPage - 1)
                    const end = Math.min(totalPages - 1, currentPage + 1)
                    
                    for (let i = start; i <= end; i++) {
                      if (i !== 1 && i !== totalPages) {
                        pages.push(i)
                      }
                    }
                    
                    if (currentPage < totalPages - 2) {
                      pages.push('ellipsis')
                    }
                    
                    // Sempre mostrar última página
                    if (totalPages > 1) {
                      pages.push(totalPages)
                    }
                  }
                  
                  return pages.map((page, index) => {
                    if (page === 'ellipsis') {
                      return (
                        <PaginationItem key={`ellipsis-${index}`}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )
                    }
                    
                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault()
                            setCurrentPage(page)
                          }}
                          isActive={currentPage === page}
                          className={
                            currentPage === page
                              ? 'bg-gradient-to-r from-[#9333EA] to-[#EC4899] text-white border-none hover:opacity-90'
                              : ''
                          }
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  })
                })()}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      if (currentPage < totalPages) {
                        setCurrentPage(currentPage + 1)
                      }
                    }}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </section>
  )
}

