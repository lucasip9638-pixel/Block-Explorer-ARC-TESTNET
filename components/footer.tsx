import { Twitter, FileText, BookOpen, Globe } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-blue-200/30 dark:border-blue-800/30 bg-gradient-to-b from-card/80 via-blue-50/10 dark:via-blue-950/5 to-card/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 pt-6 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-0">
          {/* Brand Section */}
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="size-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg">
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
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4 font-light">
              The premier blockchain explorer for ARC Testnet. Track transactions, explore DApps, and monitor network
              activity with real-time analytics and comprehensive blockchain data.
            </p>
            <div className="flex gap-3">
              <a
                href="https://x.com/arc"
                target="_blank"
                rel="noopener noreferrer"
                className="size-10 rounded-xl bg-secondary/80 flex items-center justify-center text-foreground hover:bg-blue-600 hover:text-white hover:scale-110 transition-all duration-300 shadow-sm hover:shadow-lg"
                title="X (Twitter)"
              >
                <Twitter className="size-5" />
              </a>
              <a
                href="https://discord.com/invite/buildonarc"
                target="_blank"
                rel="noopener noreferrer"
                className="size-10 rounded-xl bg-secondary/80 flex items-center justify-center text-foreground hover:bg-blue-600 hover:text-white hover:scale-110 transition-all duration-300 shadow-sm hover:shadow-lg"
                title="Discord"
              >
                <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
              </a>
              <a
                href="https://www.arc.network/"
                target="_blank"
                rel="noopener noreferrer"
                className="size-10 rounded-xl bg-secondary/80 flex items-center justify-center text-foreground hover:bg-blue-600 hover:text-white hover:scale-110 transition-all duration-300 shadow-sm hover:shadow-lg"
                title="ARC Website"
              >
                <Globe className="size-5" />
              </a>
            </div>
          </div>

          {/* Resources Section - Centered */}
          <div className="flex flex-col items-center md:items-center">
            <h4 className="font-semibold text-foreground mb-3 text-base text-center">
              Resources
            </h4>
            <ul className="space-y-1.5 flex flex-col items-center">
              <li className="text-center">
                <a
                  href="https://docs.arc.network"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-blue-600 transition-colors font-medium"
                >
                  Documentation
                </a>
              </li>
              <li className="text-center">
                <a
                  href="https://docs.arc.network/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-blue-600 transition-colors font-medium"
                >
                  Terms of Service
                </a>
              </li>
              <li className="text-center">
                <a
                  href="https://www.circle.com/pt-br/legal/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-blue-600 transition-colors font-medium whitespace-nowrap"
                >
                  Privacy Policy
                </a>
              </li>
              <li className="text-center">
                <a
                  href="https://www.circle.com/pt-br/legal/cookie-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-blue-600 transition-colors font-medium"
                >
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Developer Section - Right aligned */}
          <div className="flex flex-col items-end md:items-end">
            <h4 className="font-semibold text-foreground mb-3 text-base">
              Developer
            </h4>
            <div className="flex gap-3">
              <a
                href="https://x.com/lucas9879171721"
                target="_blank"
                rel="noopener noreferrer"
                className="size-10 rounded-xl bg-secondary/80 flex items-center justify-center text-foreground hover:bg-blue-600 hover:text-white hover:scale-110 transition-all duration-300 shadow-sm hover:shadow-lg"
                title="X (Twitter)"
              >
                <Twitter className="size-5" />
              </a>
              <a
                href="http://discordapp.com/users/1304074522067996854"
                target="_blank"
                rel="noopener noreferrer"
                className="size-10 rounded-xl bg-secondary/80 flex items-center justify-center text-foreground hover:bg-blue-600 hover:text-white hover:scale-110 transition-all duration-300 shadow-sm hover:shadow-lg"
                title="Discord"
              >
                <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

      </div>
    </footer>
  )
}
