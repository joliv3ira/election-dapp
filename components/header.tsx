"use client"

import { Button } from "@/components/ui/button"
import { Wallet, ExternalLink } from "lucide-react"

interface HeaderProps {
  isConnected: boolean
  walletAddress: string
  onConnect: () => void
}

export function Header({ isConnected, walletAddress, onConnect }: HeaderProps) {
  const contractAddress = "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
  const etherscanUrl = `https://etherscan.io/address/${contractAddress}`

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="w-6 h-6 text-primary-foreground"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 11L12 14L22 4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">VoteChain</h1>
              <p className="text-xs text-muted-foreground">Votação Transparente</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(etherscanUrl, "_blank")}
              className="hidden sm:flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="hidden md:inline">Ver Contrato</span>
            </Button>

            {isConnected ? (
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/20">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm font-mono text-foreground hidden sm:inline">
                  {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </span>
                <span className="text-sm font-mono text-foreground sm:hidden">Conectado</span>
              </div>
            ) : (
              <Button onClick={onConnect} className="gap-2">
                <Wallet className="w-4 h-4" />
                Conectar Carteira
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
