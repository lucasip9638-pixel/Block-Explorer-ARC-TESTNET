"use client"

import { Card } from "@/components/ui/card"
import { ARC_TESTNET_CONFIG } from "@/config/arc-testnet"
import { useRecentBlocks } from "@/hooks/use-recent-blocks"
import { Blocks, Clock, Loader2, ExternalLink, Hash } from "lucide-react"
import { formatAddress } from "@/lib/utils"

export function RecentBlocks() {
  const { data: blocks, isLoading, error } = useRecentBlocks()

  const explorerUrl = ARC_TESTNET_CONFIG.blockExplorerUrls[0]

  // Mostrar loading state se estiver carregando
  if (isLoading && !blocks) {
    return (
      <section className="py-20 bg-gradient-to-b from-background via-blue-50/30 dark:via-blue-950/20 to-secondary/10">
        <div className="container mx-auto px-4">
          <div className="mb-14 text-center">
            <div className="inline-flex items-center gap-3 mb-5">
              <div className="p-2 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-lg">
                <Blocks className="size-6 text-white" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">Blocos Mais Recentes</h2>
            </div>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-light">
              Últimos blocos minerados na rede ARC Testnet
            </p>
          </div>
          <Card className="p-8">
            <div className="flex items-center justify-center gap-3">
              <Loader2 className="size-6 animate-spin text-blue-600" />
              <p className="text-muted-foreground">Carregando blocos recentes...</p>
            </div>
          </Card>
        </div>
      </section>
    )
  }

  // Mostrar mensagem se houver erro ou não houver blocos
  if (error || !blocks || blocks.length === 0) {
    return (
      <section className="py-20 bg-gradient-to-b from-background via-blue-50/30 dark:via-blue-950/20 to-secondary/10">
        <div className="container mx-auto px-4">
          <div className="mb-14 text-center">
            <div className="inline-flex items-center gap-3 mb-5">
              <div className="p-2 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-lg">
                <Blocks className="size-6 text-white" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">Blocos Mais Recentes</h2>
            </div>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-light">
              Últimos blocos minerados na rede ARC Testnet
            </p>
          </div>
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">Nenhum bloco disponível no momento.</p>
          </Card>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-gradient-to-b from-background via-blue-50/30 dark:via-blue-950/20 to-secondary/10">
      <div className="container mx-auto px-4">
        <div className="mb-14 text-center">
          <div className="inline-flex items-center gap-3 mb-5">
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-lg">
              <Blocks className="size-6 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">Blocos Mais Recentes</h2>
          </div>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-light">
            Últimos blocos minerados na rede ARC Testnet
          </p>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/10 border border-blue-600/20">
            <div className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-600 opacity-75"></span>
              <span className="relative inline-flex size-2 rounded-full bg-blue-600"></span>
            </div>
            <span className="text-sm font-medium text-blue-600">Atualizando em tempo real</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {blocks?.map((block, index) => {
            const isNewestBlock = index === 0 // O primeiro bloco é o mais recente

            return (
              <Card
                key={block.number.toString()}
                className={`p-5 border-2 transition-all duration-300 group bg-card/70 backdrop-blur-md hover-lift relative overflow-hidden text-center ${
                  isNewestBlock 
                    ? 'border-blue-600/70 shadow-lg shadow-blue-600/20 animate-pulse-glow' 
                    : 'border-border/60 hover:border-blue-600/50 hover:shadow-xl'
                }`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br transition-all duration-300 ${
                  isNewestBlock 
                    ? 'from-blue-600/10 to-cyan-500/10' 
                    : 'from-blue-600/0 to-cyan-500/0 group-hover:from-blue-600/5 group-hover:to-cyan-500/5'
                }`}></div>
                {isNewestBlock && (
                  <div className="absolute top-2 right-2">
                    <span className="inline-flex items-center rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-bold text-white shadow-lg animate-pulse">
                      NOVO
                    </span>
                  </div>
                )}
                <div className="relative z-10">
                  <div className="mb-3">
                    <p className="text-xs text-muted-foreground font-medium mb-2">Altura do bloco</p>
                    <a
                      href={`${explorerUrl}/block/${block.number}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-2xl md:text-3xl font-bold transition-colors flex items-center justify-center gap-2 group/link ${
                        isNewestBlock ? 'text-blue-600' : 'text-foreground hover:text-blue-600'
                      }`}
                    >
                      {block.number.toLocaleString()}
                      <ExternalLink className="size-3 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                    </a>
                  </div>
                  
                  {block.hash && (
                    <div className="mb-3 pt-2 border-t border-border/30">
                      <p className="text-xs text-muted-foreground font-medium mb-1 flex items-center justify-center gap-1">
                        <Hash className="size-3" />
                        Hash
                      </p>
                      <a
                        href={`${explorerUrl}/block/${block.hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-[10px] text-muted-foreground hover:text-blue-600 transition-colors break-all group/hash"
                        title={block.hash}
                      >
                        {formatAddress(block.hash, 6, 4)}
                        <ExternalLink className="size-2.5 inline-block ml-1 opacity-0 group-hover/hash:opacity-100 transition-opacity" />
                      </a>
                    </div>
                  )}
                  
                  <div className="pt-3 border-t border-border/50">
                    <p className="text-xs text-muted-foreground flex items-center justify-center gap-1.5 font-medium">
                      <Clock className="size-3" />
                      {block.formattedTime}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1.5">
                      {block.transactionCount} tx
                    </p>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}

