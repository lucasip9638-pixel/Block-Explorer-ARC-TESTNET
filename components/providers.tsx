"use client"

import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { config } from '@/lib/wagmi-config'
import { useState } from 'react'
import { DAppFilterProvider } from '@/contexts/dapp-filter-context'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <DAppFilterProvider>
          {children}
        </DAppFilterProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}






