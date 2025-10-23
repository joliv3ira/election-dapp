"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { MetricsSection } from "@/components/metrics-section"
import { CandidatesGrid } from "@/components/candidates-grid"
import { RankingSection } from "@/components/ranking-section"
import { VoteConfirmationModal } from "@/components/vote-confirmation-modal"
import { toast } from "sonner"

export type Candidate = {
  id: number
  name: string
  party: string
  image: string
  votes: number
  proposals: string[]
}

export default function Home() {
  const [isConnected, setIsConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [candidates, setCandidates] = useState<Candidate[]>([
    {
      id: 1,
      name: "Ana Silva",
      party: "Partido Progressista",
      image: "/professional-woman-politician.jpg",
      votes: 1250,
      proposals: [
        "Investimento em educação digital e tecnologia nas escolas",
        "Programa de incentivo à energia renovável",
        "Criação de hub de inovação e startups",
        "Transparência total com blockchain em gastos públicos",
        "Modernização do transporte público com veículos elétricos",
      ],
    },
    {
      id: 2,
      name: "Carlos Mendes",
      party: "Partido da Inovação",
      image: "/professional-man-politician.jpg",
      votes: 980,
      proposals: [
        "Implementação de governo digital descentralizado",
        "Programa de capacitação em blockchain e Web3",
        "Incentivos fiscais para empresas de tecnologia",
        "Criação de fundo de investimento em criptomoedas",
        "Regulamentação clara para ativos digitais",
      ],
    },
    {
      id: 3,
      name: "Marina Costa",
      party: "Partido Sustentável",
      image: "/professional-woman-leader.png",
      votes: 1420,
      proposals: [
        "Tokenização de créditos de carbono",
        "Plataforma blockchain para rastreamento ambiental",
        "Incentivo à agricultura sustentável com NFTs",
        "Programa de reciclagem com recompensas em tokens",
        "Preservação de áreas verdes com DAOs comunitárias",
      ],
    },
    {
      id: 4,
      name: "Roberto Alves",
      party: "Partido Digital",
      image: "/professional-executive-man.png",
      votes: 1105,
      proposals: [
        "Identidade digital descentralizada para todos",
        "Sistema de saúde integrado via blockchain",
        "Votação eletrônica 100% transparente",
        "Programa de inclusão digital universal",
        "Smart contracts para contratos públicos",
      ],
    },
  ])

  const totalVotes = candidates.reduce((sum, c) => sum + c.votes, 0)
  const totalRaised = totalVotes * 0.025

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        })
        setWalletAddress(accounts[0])
        setIsConnected(true)
        toast.success("Carteira conectada com sucesso!")
      } catch (error) {
        toast.error("Erro ao conectar carteira")
        console.error(error)
      }
    } else {
      toast.error("MetaMask não detectada. Por favor, instale a extensão.")
    }
  }

  const handleVoteClick = (candidate: Candidate) => {
    if (!isConnected) {
      toast.error("Conecte sua carteira para votar")
      return
    }
    setSelectedCandidate(candidate)
    setIsModalOpen(true)
  }

  const handleConfirmVote = async () => {
    if (!selectedCandidate) return

    try {
      // Simulação de transação blockchain
      toast.loading("Processando transação...", { id: "vote-tx" })

      // Simular delay de transação
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Atualizar votos
      setCandidates((prev) => prev.map((c) => (c.id === selectedCandidate.id ? { ...c, votes: c.votes + 1 } : c)))

      toast.success(`Voto confirmado para ${selectedCandidate.name}!`, { id: "vote-tx" })
      setIsModalOpen(false)
      setSelectedCandidate(null)
    } catch (error) {
      toast.error("Erro ao processar voto", { id: "vote-tx" })
      console.error(error)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header isConnected={isConnected} walletAddress={walletAddress} onConnect={connectWallet} />

      <main className="container mx-auto px-4 py-8 space-y-12">
        <MetricsSection totalVotes={totalVotes} totalRaised={totalRaised} />

        <CandidatesGrid candidates={candidates} onVote={handleVoteClick} isConnected={isConnected} />

        <RankingSection candidates={candidates} />
      </main>

      <VoteConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmVote}
        candidate={selectedCandidate}
      />
    </div>
  )
}
