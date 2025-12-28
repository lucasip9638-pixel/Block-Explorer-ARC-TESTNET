import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { DAppGrid } from "@/components/dapp-grid"
import { AutoAlerts } from "@/components/auto-alerts"
import { AutoActivityChart } from "@/components/auto-activity-chart"
import { WalletActivity } from "@/components/wallet-activity"
import { Footer } from "@/components/footer"
import { ArcBackground } from "@/components/arc-background"

export default function Home() {
  return (
    <div className="min-h-screen relative bg-gradient-to-b from-blue-50/20 dark:from-blue-950/10 via-background to-background">
      <ArcBackground />
      <Header />
          <main className="relative z-10">
            <Hero />
            <AutoAlerts />
            <AutoActivityChart />
            <WalletActivity title="Minhas Transações na ARC Testnet" />
            <DAppGrid />
          </main>
      <Footer />
    </div>
  )
}
