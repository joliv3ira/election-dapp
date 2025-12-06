"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ContractCandidate } from "@/types"
import Image from "next/image"

interface CandidatesGridProps {
  candidates: any[]
  onVote: (candidate: ContractCandidate) => void
  isConnected: boolean
}

export function CandidatesGrid({ candidates, onVote, isConnected }: CandidatesGridProps) {
  return (
    <section className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-foreground">Candidates</h2>
        <p className="text-muted-foreground">Learn about the proposals and vote for your preferred candidate</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {candidates.map((candidate) => (
          <Card key={String(candidate.id)} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-64 bg-muted">
              <Image 
                src={candidate.imageUrl || "/placeholder.svg"} 
                alt={candidate.name} 
                fill 
                className="object-cover" 
              />
              <div className="absolute top-4 right-4">
                <Badge className="bg-primary text-primary-foreground">
                  {candidate.formattedVoteCount || Number(candidate.voteCount)} votes
                </Badge>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-2xl font-bold text-foreground">{candidate.name}</h3>
                {candidate.votePercentage !== undefined && (
                  <p className="text-sm text-primary font-semibold">
                    {candidate.votePercentage.toFixed(2)}% of votes
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <p className="text-sm font-semibold text-foreground">Description:</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {candidate.description}
                </p>
              </div>

              <Button onClick={() => onVote(candidate)} className="w-full" size="lg" disabled={!isConnected}>
                {isConnected ? "Vote (0.025 ETH)" : "Connect your wallet"}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </section>
  )
}
