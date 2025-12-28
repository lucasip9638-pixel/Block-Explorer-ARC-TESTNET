"use client"

import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {

  return (
    <header className="sticky top-0 z-50 w-full border-b border-blue-200/30 dark:border-blue-800/30 bg-gradient-to-r from-background/95 via-blue-50/5 dark:via-blue-950/5 to-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-18 items-center justify-between gap-4">
          <div className="flex items-center gap-6 lg:gap-8 flex-shrink-0">
            <a href="/" className="flex items-center gap-2.5 group">
              <div className="size-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
                <svg viewBox="0 0 24 24" fill="none" className="size-5 text-white">
                  <path
                    d="M12 2L2 7L12 12L22 7L12 2Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2 17L12 22L22 17"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2 12L12 17L22 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-foreground leading-none tracking-tight">ARC Scout</span>
                <span className="text-[10px] text-muted-foreground leading-none mt-0.5 font-medium">Testnet Explorer</span>
              </div>
            </a>

            <nav className="hidden lg:flex items-center gap-1">
              <a
                href="/"
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/60 rounded-lg transition-all duration-200"
                onClick={(e) => {
                  e.preventDefault()
                  window.location.href = '/'
                }}
              >
                Explorer
              </a>
              <a
                href="/#ecosystem"
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/60 rounded-lg transition-all duration-200"
                onClick={(e) => {
                  e.preventDefault()
                  const ecosystemSection = document.getElementById("ecosystem")
                  if (ecosystemSection) {
                    ecosystemSection.scrollIntoView({ behavior: "smooth" })
                  }
                }}
              >
                DApps
              </a>
              <a
                href="https://docs.arc.network"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/60 rounded-lg transition-all duration-200"
              >
                Docs
              </a>
            </nav>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <Button variant="ghost" size="icon" className="xl:hidden hover:bg-secondary/60">
              <Menu className="size-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
