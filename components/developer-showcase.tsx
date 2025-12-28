"use client"

import { Card } from "@/components/ui/card"
import { Trophy, Code, Zap, Star } from "lucide-react"

const developerHighlights = [
  {
    icon: Code,
    title: "Build on ARC",
    description: "Deploy smart contracts with predictable USDC gas fees",
    highlight: "Enterprise-ready infrastructure",
  },
  {
    icon: Zap,
    title: "Sub-second Finality",
    description: "Instant settlement with deterministic finality",
    highlight: "Production-grade performance",
  },
  {
    icon: Star,
    title: "Verified DApps",
    description: "Join 12+ verified applications on ARC Testnet",
    highlight: "Trusted ecosystem",
  },
  {
    icon: Trophy,
    title: "Developer Support",
    description: "Comprehensive docs, SDKs, and community resources",
    highlight: "Full developer toolkit",
  },
]

export function DeveloperShowcase() {
  return (
    <section className="py-16 bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold text-foreground mb-4">Why Build on ARC?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join leading developers building the future of programmable money
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {developerHighlights.map((item, index) => {
            const Icon = item.icon
            return (
              <Card
                key={index}
                className="p-6 border-2 border-border/60 hover:border-[#9333EA]/50 hover:shadow-xl transition-all duration-300 group"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="p-4 rounded-xl bg-gradient-to-br from-[#9333EA] to-[#EC4899] mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="size-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                  <span className="text-xs font-semibold text-[#9333EA] bg-[#9333EA]/10 px-3 py-1 rounded-full">
                    {item.highlight}
                  </span>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}



