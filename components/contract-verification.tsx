"use client"

import { Card } from "@/components/ui/card"
import { createPublicClient, http } from "viem"
import { ARC_TESTNET_CONFIG } from "@/config/arc-testnet"
import { useQuery } from "@tanstack/react-query"
import { CheckCircle2, FileCode, Shield, Verified, ExternalLink } from "lucide-react"

const publicClient = createPublicClient({
  chain: {
    id: ARC_TESTNET_CONFIG.chainId,
    name: ARC_TESTNET_CONFIG.chainName,
    nativeCurrency: ARC_TESTNET_CONFIG.nativeCurrency,
    rpcUrls: {
      default: {
        http: [ARC_TESTNET_CONFIG.rpcUrls[0]],
      },
    },
  },
  transport: http(ARC_TESTNET_CONFIG.rpcUrls[0]),
})

interface ContractInfo {
  address: string
  name?: string
  verified: boolean
  transactionCount: number
  creator?: string
}

async function fetchVerifiedContracts(): Promise<ContractInfo[]> {
  try {
    const latestBlock = await publicClient.getBlockNumber()
    const contracts: ContractInfo[] = []
    const seenAddresses = new Set<string>()

    // Buscar contratos dos últimos blocos
    for (let i = 0; i < 50 && contracts.length < 6; i++) {
      try {
        const block = await publicClient.getBlock({
          blockNumber: latestBlock - BigInt(i),
          includeTransactions: true,
        })

        if (block.transactions) {
          for (const tx of block.transactions) {
            if (typeof tx === "object" && "to" in tx && tx.to && !seenAddresses.has(tx.to.toLowerCase())) {
              try {
                const code = await publicClient.getBytecode({ address: tx.to })
                if (code && code !== "0x") {
                  seenAddresses.add(tx.to.toLowerCase())
                  contracts.push({
                    address: tx.to,
                    verified: false, // Seria verificado via API do explorer
                    transactionCount: 0,
                  })
                }
              } catch {
                continue
              }
            }
          }
        }
      } catch {
        continue
      }
    }

    return contracts.slice(0, 6)
  } catch (error) {
    console.error("Erro ao buscar contratos:", error)
    return []
  }
}

export function ContractVerification() {
  const { data: contracts, isLoading } = useQuery({
    queryKey: ["verified-contracts"],
    queryFn: fetchVerifiedContracts,
    refetchInterval: 30000,
    staleTime: 10000,
  })

  const explorerUrl = ARC_TESTNET_CONFIG.blockExplorerUrls[0]

  if (isLoading && !contracts) {
    return null
  }

  if (!contracts || contracts.length === 0) {
    return null
  }

  return (
    <section className="py-16 bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <Shield className="size-6 text-[#9333EA]" />
            <h2 className="text-4xl font-bold text-foreground">Smart Contracts</h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Verified smart contracts deployed on ARC Testnet
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contracts.map((contract, index) => (
            <Card
              key={index}
              className="p-6 border-2 border-border/60 hover:border-[#9333EA]/50 hover:shadow-xl transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-[#9333EA] to-[#EC4899]">
                    <FileCode className="size-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-bold text-foreground">
                        {contract.name || `Contract ${index + 1}`}
                      </h3>
                      {contract.verified && (
                        <Verified className="size-4 text-green-500" title="Verified" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground font-mono break-all">
                      {contract.address.slice(0, 10)}...{contract.address.slice(-8)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <span
                    className={`flex items-center gap-1 font-semibold ${
                      contract.verified ? "text-green-500" : "text-yellow-500"
                    }`}
                  >
                    <CheckCircle2 className="size-3" />
                    {contract.verified ? "Verified" : "Unverified"}
                  </span>
                </div>

                <a
                  href={`${explorerUrl}/address/${contract.address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 text-sm text-[#9333EA] hover:underline font-medium pt-2 border-t border-border/50"
                >
                  View Contract
                  <ExternalLink className="size-4" />
                </a>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Smart contracts enable programmable money and decentralized applications on ARC Testnet
          </p>
        </div>
      </div>
    </section>
  )
}

