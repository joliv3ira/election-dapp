import { Card } from "@/components/ui/card"
import { TrendingUp, Users } from "lucide-react"

interface MetricsSectionProps {
  totalVotes: number
  totalRaised: number
}

export function MetricsSection({ totalVotes, totalRaised }: MetricsSectionProps) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="w-4 h-4" />
              Total de Votos
            </p>
            <p className="text-4xl font-bold text-foreground">{totalVotes.toLocaleString("pt-BR")}</p>
            <p className="text-xs text-muted-foreground">Votos registrados na blockchain</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Users className="w-6 h-6 text-primary" />
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-accent/5 to-primary/5 border-accent/20">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Total Arrecadado
            </p>
            <p className="text-4xl font-bold text-foreground">{totalRaised.toFixed(3)} ETH</p>
            <p className="text-xs text-muted-foreground">
              ≈ ${(totalRaised * 2500).toLocaleString("pt-BR", { minimumFractionDigits: 2 })} USD
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-accent" />
          </div>
        </div>
      </Card>
    </section>
  )
}
