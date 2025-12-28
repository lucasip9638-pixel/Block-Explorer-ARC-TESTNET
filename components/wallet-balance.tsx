"use client"

import { Card } from "@/components/ui/card"
import { Wallet, DollarSign, Euro, Loader2 } from "lucide-react"
import { useWalletBalance } from "@/hooks/use-wallet-balance"
import { formatAddress } from "@/lib/utils"
import { formatUnits } from "viem"

interface WalletBalanceProps {
  address?: string
  showAddress?: boolean
}

export function WalletBalance({ address, showAddress = true }: WalletBalanceProps) {
  const { data: balances, isLoading, error } = useWalletBalance(address)

  const formatBalance = (balance: string, decimals: number = 18) => {
    // Se estiver carregando, mostrar "..."
    if (balance === '...') return '...'
    
    const num = parseFloat(balance)
    if (isNaN(num)) return '0.00'
    if (num === 0) return '0.00'
    if (num < 0.01) return num.toExponential(2)
    return num.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    })
  }

  // SEMPRE mostrar USDC e EURC, mesmo durante carregamento ou erro
  const displayBalances: Array<{ symbol: string; balance: string; decimals: number }> = 
    balances && balances.length > 0 
      ? balances 
      : [
          { symbol: 'USDC', balance: isLoading ? '...' : '0', decimals: 6 },
          { symbol: 'EURC', balance: isLoading ? '...' : '0', decimals: 6 },
        ]

  const getTokenIcon = (symbol: string) => {
    switch (symbol) {
      case 'USDC':
        return <DollarSign className="size-5 text-[#2775CA]" />
      case 'EURC':
        return <Euro className="size-5 text-[#0165E1]" />
      default:
        return <Wallet className="size-5 text-muted-foreground" />
    }
  }

  const getTokenColor = (symbol: string) => {
    switch (symbol) {
      case 'USDC':
        return 'text-[#2775CA]'
      case 'EURC':
        return 'text-[#0165E1]'
      default:
        return 'text-foreground'
    }
  }

  // Mostrar mensagem de erro, mas ainda exibir os tokens
  const showError = error && !isLoading

  return (
    <Card className="p-6 bg-card border-border">
      {showAddress && address && (
        <div className="mb-6 pb-4 border-b border-border">
          <p className="text-sm text-muted-foreground mb-1">Endereço</p>
          <p className="font-mono text-sm text-foreground">{formatAddress(address, 10, 8)}</p>
        </div>
      )}

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-foreground">Saldo de Tokens na ARC Testnet</h3>
          {isLoading && (
            <Loader2 className="size-4 animate-spin text-[#9333EA]" />
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          Saldos buscados diretamente da blockchain via RPC
        </p>
        {showError && (
          <p className="text-xs text-red-500 mt-2">
            ⚠️ Erro ao carregar alguns saldos: {error.message}
          </p>
        )}
      </div>

      <div className="flex flex-row gap-4">
        {displayBalances.map((token) => {
          const balance = formatBalance(token.balance, token.decimals)
          const hasBalance = parseFloat(token.balance) > 0

          return (
            <div
              key={token.symbol}
              className={`flex-1 p-4 rounded-lg border transition-all ${
                hasBalance
                  ? 'bg-secondary/50 border-[#9333EA]/20 hover:border-[#9333EA]/40'
                  : 'bg-secondary/20 border-border'
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg bg-background ${hasBalance ? getTokenColor(token.symbol) : 'text-muted-foreground'}`}>
                  {getTokenIcon(token.symbol)}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{token.symbol}</p>
                  <p className="text-xs text-muted-foreground">
                    {token.symbol === 'USDC' ? 'USD Coin' : 'Euro Coin'}
                  </p>
                </div>
              </div>
              <div>
                <p className={`text-2xl font-bold ${hasBalance ? getTokenColor(token.symbol) : 'text-muted-foreground'}`}>
                  {balance}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {token.decimals} decimais
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Total */}
      {displayBalances.length > 1 && (
        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">Total (estimado)</p>
            <p className="text-lg font-bold text-foreground">
              {displayBalances.reduce((sum, token) => {
                const usdValue = parseFloat(token.balance)
                return sum + (token.symbol === 'USDC' ? usdValue : usdValue) // EURC ≈ USD para estimativa
              }, 0).toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{' '}
              USDC
            </p>
          </div>
        </div>
      )}
    </Card>
  )
}
