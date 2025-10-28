import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Medal, Award } from "lucide-react"
import Image from "next/image"

interface RankingSectionProps {
  candidates: any[]
}

export function RankingSection({ candidates }: RankingSectionProps) {
  const sortedCandidates = [...candidates].sort((a, b) => Number(b.voteCount) - Number(a.voteCount))
  const totalVotes = candidates.reduce((sum, c) => sum + Number(c.voteCount), 0)

  const getPositionIcon = (position: number) => {
    switch (position) {
      case 0:
        return <Trophy className="w-5 h-5 text-yellow-500" />
      case 1:
        return <Medal className="w-5 h-5 text-gray-400" />
      case 2:
        return <Award className="w-5 h-5 text-amber-600" />
      default:
        return null
    }
  }

  const getPositionColor = (position: number) => {
    switch (position) {
      case 0:
        return "bg-yellow-500/10 border-yellow-500/20"
      case 1:
        return "bg-gray-400/10 border-gray-400/20"
      case 2:
        return "bg-amber-600/10 border-amber-600/20"
      default:
        return "bg-muted/50 border-border"
    }
  }

  return (
    <section className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-foreground">Ranking</h2>
        <p className="text-muted-foreground">Acompanhe a classificação em tempo real</p>
      </div>

      <div className="space-y-4">
        {sortedCandidates.map((candidate, index) => {
          const voteCount = Number(candidate.voteCount);
          const percentage = candidate.votePercentage || (totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0);

          return (
            <Card key={String(candidate.id)} className={`p-6 ${getPositionColor(index)}`}>
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-background border-2 border-border font-bold text-lg">
                  {index === 0 || index === 1 || index === 2 ? (
                    getPositionIcon(index)
                  ) : (
                    <span className="text-muted-foreground">{index + 1}</span>
                  )}
                </div>

                <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-border">
                  <Image
                    src={candidate.imageUrl || "/placeholder.svg"}
                    alt={candidate.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="font-bold text-foreground text-lg">{candidate.name}</h3>
                      <p className="text-sm text-muted-foreground truncate max-w-md">
                        {candidate.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-foreground text-lg">
                        {candidate.formattedVoteCount || voteCount}
                      </p>
                      <p className="text-xs text-muted-foreground">votos</p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Percentual</span>
                      <Badge variant="secondary">{percentage.toFixed(1)}%</Badge>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
