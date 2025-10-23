"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2 } from "lucide-react"
import type { Candidate } from "@/app/page"
import Image from "next/image"

interface CandidatesGridProps {
  candidates: Candidate[]
  onVote: (candidate: Candidate) => void
  isConnected: boolean
}

export function CandidatesGrid({ candidates, onVote, isConnected }: CandidatesGridProps) {
  return (
    <section className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-foreground">Candidatos</h2>
        <p className="text-muted-foreground">Conheça as propostas e vote no seu candidato preferido</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {candidates.map((candidate) => (
          <Card key={candidate.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-64 bg-muted">
              <Image src={candidate.image || "/placeholder.svg"} alt={candidate.name} fill className="object-cover" />
              <div className="absolute top-4 right-4">
                <Badge className="bg-primary text-primary-foreground">{candidate.votes} votos</Badge>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-2xl font-bold text-foreground">{candidate.name}</h3>
                <p className="text-sm text-muted-foreground">{candidate.party}</p>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-semibold text-foreground">Propostas de Governo:</p>
                <ul className="space-y-2">
                  {candidate.proposals.map((proposal, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="leading-relaxed">{proposal}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button onClick={() => onVote(candidate)} className="w-full" size="lg" disabled={!isConnected}>
                {isConnected ? "Votar (0.025 ETH)" : "Conecte sua carteira"}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </section>
  )
}
