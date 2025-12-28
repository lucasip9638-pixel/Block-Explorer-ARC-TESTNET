"use client"

import { Card } from "@/components/ui/card"
import { CheckCircle2, XCircle, AlertCircle, Server } from "lucide-react"
import { ARC_TESTNET_CONFIG } from "@/config/arc-testnet"
import { useState, useEffect } from "react"

interface ApiStatus {
  name: string
  url: string
  status: "online" | "offline" | "checking"
  responseTime?: number
}

export function ApiStatus() {
  const [apis, setApis] = useState<ApiStatus[]>([
    {
      name: "RPC Endpoint",
      url: ARC_TESTNET_CONFIG.rpcUrls[0],
      status: "checking",
    },
    {
      name: "Block Explorer API",
      url: ARC_TESTNET_CONFIG.blockExplorerUrls[0],
      status: "checking",
    },
  ])

  useEffect(() => {
    const checkApiStatus = async () => {
      const updatedApis = await Promise.all(
        apis.map(async (api) => {
          const startTime = Date.now()
          try {
            const controller = new AbortController()
            const timeoutId = setTimeout(() => controller.abort(), 5000)

            const response = await fetch(api.url, {
              method: "HEAD",
              signal: controller.signal,
            })

            clearTimeout(timeoutId)
            const responseTime = Date.now() - startTime

            return {
              ...api,
              status: response.ok ? ("online" as const) : ("offline" as const),
              responseTime,
            }
          } catch {
            return {
              ...api,
              status: "offline" as const,
            }
          }
        })
      )

      setApis(updatedApis)
    }

    checkApiStatus()
    const interval = setInterval(checkApiStatus, 30000) // Verificar a cada 30 segundos

    return () => clearInterval(interval)
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return <CheckCircle2 className="size-5 text-green-500" />
      case "offline":
        return <XCircle className="size-5 text-red-500" />
      default:
        return <AlertCircle className="size-5 text-yellow-500 animate-pulse" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "border-green-500/20 bg-green-500/5"
      case "offline":
        return "border-red-500/20 bg-red-500/5"
      default:
        return "border-yellow-500/20 bg-yellow-500/5"
    }
  }

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <Server className="size-6 text-[#9333EA]" />
            <h2 className="text-4xl font-bold text-foreground">API Status</h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real-time monitoring of ARC Testnet API endpoints
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {apis.map((api, index) => (
            <Card
              key={index}
              className={`p-6 border-2 ${getStatusColor(api.status)} hover:shadow-xl transition-all`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {getStatusIcon(api.status)}
                  <div>
                    <h3 className="text-lg font-bold text-foreground">{api.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1 font-mono break-all">
                      {api.url}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border/50">
                <span className="text-sm text-muted-foreground">Status</span>
                <span
                  className={`text-sm font-semibold ${
                    api.status === "online"
                      ? "text-green-500"
                      : api.status === "offline"
                        ? "text-red-500"
                        : "text-yellow-500"
                  }`}
                >
                  {api.status === "online"
                    ? "Online"
                    : api.status === "offline"
                      ? "Offline"
                      : "Checking..."}
                </span>
              </div>

              {api.responseTime && api.status === "online" && (
                <div className="flex items-center justify-between pt-2">
                  <span className="text-sm text-muted-foreground">Response Time</span>
                  <span className="text-sm font-semibold text-foreground">
                    {api.responseTime}ms
                  </span>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}





