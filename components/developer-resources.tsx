"use client"

import { Card } from "@/components/ui/card"
import { BookOpen, Github, FileText, ExternalLink, Code2, Zap, Globe } from "lucide-react"

const resources = [
  {
    icon: BookOpen,
    title: "Documentation",
    description: "Complete guide to building on ARC Testnet",
    url: "https://docs.arc.network",
    category: "Docs",
  },
  {
    icon: Github,
    title: "GitHub",
    description: "Open source repositories and examples",
    url: "https://github.com/arcnetwork",
    category: "Code",
  },
  {
    icon: FileText,
    title: "API Reference",
    description: "REST API documentation and endpoints",
    url: "https://docs.arc.network/api",
    category: "API",
  },
  {
    icon: Code2,
    title: "SDK & Libraries",
    description: "Development kits and client libraries",
    url: "https://docs.arc.network/sdk",
    category: "Tools",
  },
  {
    icon: Zap,
    title: "Quick Start",
    description: "Get started building in minutes",
    url: "https://docs.arc.network/quickstart",
    category: "Guide",
  },
  {
    icon: Globe,
    title: "ARC Website",
    description: "Official ARC Network website",
    url: "https://www.arc.network",
    category: "Info",
  },
]

export function DeveloperResources() {
  return (
    <section className="py-16 bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <Code2 className="size-6 text-[#9333EA]" />
            <h2 className="text-4xl font-bold text-foreground">Developer Resources</h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to build on ARC Testnet
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource, index) => {
            const Icon = resource.icon
            return (
              <Card
                key={index}
                className="p-6 border-2 border-border/60 hover:border-[#9333EA]/50 hover:shadow-xl transition-all duration-300 group"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-[#9333EA] to-[#EC4899]">
                    <Icon className="size-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-xs font-semibold text-[#9333EA] bg-[#9333EA]/10 px-2 py-1 rounded-md mb-2 inline-block">
                          {resource.category}
                        </span>
                        <h3 className="text-lg font-bold text-foreground mb-1">{resource.title}</h3>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">{resource.description}</p>
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-[#9333EA] hover:underline group-hover:gap-3 transition-all"
                    >
                      Visit Resource
                      <ExternalLink className="size-4" />
                    </a>
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





