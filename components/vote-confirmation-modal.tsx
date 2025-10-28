"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react"
import type { Candidate } from "@/app/page"
import Image from "next/image"

interface VoteConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  candidate: Candidate | null
  isPending?: boolean
}

export function VoteConfirmationModal({ isOpen, onClose, onConfirm, candidate, isPending }: VoteConfirmationModalProps) {
  if (!candidate) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">Confirmar Voto</DialogTitle>
          <DialogDescription>Revise os detalhes antes de confirmar sua votação</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-primary">
              <Image src={candidate.image || "/placeholder.svg"} alt={candidate.name} fill className="object-cover" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">{candidate.name}</h3>
              <p className="text-sm text-muted-foreground">Candidato #{Number(candidate.id)}</p>
              <Badge className="mt-1 bg-primary/10 text-primary border-primary/20">
                {candidate.votes} votos atuais
              </Badge>
            </div>
          </div>

          <div className="space-y-3 p-4 rounded-lg bg-muted/50 border border-border">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Valor da votação</span>
              <span className="font-bold text-foreground">0.025 ETH</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Taxa de gas (estimada)</span>
              <span className="font-mono text-sm text-foreground">~0.002 ETH</span>
            </div>
            <div className="h-px bg-border" />
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">Total</span>
              <span className="font-bold text-lg text-foreground">~0.027 ETH</span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-lg bg-primary/5 border border-primary/20">
            <AlertCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">Atenção</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Esta ação é irreversível. Seu voto será registrado permanentemente na blockchain e não poderá ser
                alterado.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Cancelar
          </Button>
          <Button onClick={onConfirm} className="gap-2" disabled={isPending}>
            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            {isPending ? 'Confirmando...' : 'Confirmar Voto'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
