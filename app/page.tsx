"use client"

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { useGetAllCandidates } from '@/hooks/useGetAllCandidates';
import { useGetVotingStatistics } from '@/hooks/useGetVotingStatistics';
import { useVote } from '@/hooks/useVote';
import { useVotingEligibility } from '@/hooks/useVotingEligibility';
import { useCandidatesWithFormatted } from '@/hooks/useCandidatesWithFormatted';
import { useWatchVoteCast } from '@/hooks/useWatchVoteCast';
import { useState, useEffect } from 'react';
import { toast } from "sonner";
import { Header } from "@/components/header";
import { MetricsSection } from "@/components/metrics-section";
import { CandidatesGrid } from "@/components/candidates-grid";
import { RankingSection } from "@/components/ranking-section";
import { VoteConfirmationModal } from "@/components/vote-confirmation-modal";

import { ContractCandidate, UICandidate } from '@/types';

export default function Home() {
  const { address, isConnected, isConnecting } = useAccount();
  const { connect, error: connectError } = useConnect();
  const { disconnect } = useDisconnect();
  
  const walletAddress = address ? address.toString() : "";
  
  const { data: candidates, isLoading: candidatesLoading, refetch: refetchCandidates } = useGetAllCandidates();
  const { data: votingStats, refetch: refetchStats } = useGetVotingStatistics();
  const { vote, isPending, isConfirming, isSuccess } = useVote();
  const { data: formattedCandidates, refetch: refetchFormatted } = useCandidatesWithFormatted();
  const eligibility = useVotingEligibility(walletAddress);
  
  const [selectedCandidate, setSelectedCandidate] = useState<ContractCandidate | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasShownConnectionToast, setHasShownConnectionToast] = useState(false);

  // Mostrar mensagem quando conectar com sucesso
  useEffect(() => {
    if (isConnected && address && !hasShownConnectionToast) {
      toast.success("Carteira conectada com sucesso!");
      setHasShownConnectionToast(true);
    }
    
    // Reset quando desconectar
    if (!isConnected && hasShownConnectionToast) {
      setHasShownConnectionToast(false);
    }
  }, [isConnected, address, hasShownConnectionToast]);

  const connectWallet = () => {
    // Verifica se MetaMask está instalado
    if (typeof window.ethereum === 'undefined') {
      toast.error("MetaMask não detectado. Por favor, instale o MetaMask!");
      return;
    }

    connect({ connector: injected() });
  };

  // Tratar erros de conexão
  useEffect(() => {
    if (connectError) {
      console.error("Erro de conexão:", connectError);
      toast.error("Erro ao conectar carteira. Verifique se o MetaMask está desbloqueado.");
    }
  }, [connectError]);

  const handleDisconnect = () => {
    disconnect();
  };

  const handleVoteClick = (candidate: ContractCandidate) => {
    if (!isConnected) {
      toast.error("Conecte sua carteira para votar");
      return;
    }
    
    if (!eligibility.canVote) {
      toast.error(eligibility.message);
      return;
    }
    
    setSelectedCandidate(candidate);
    setIsModalOpen(true);
  };

  const handleConfirmVote = async () => {
    if (!selectedCandidate) return;

    try {
      toast.loading("Processando transação na blockchain...", { id: "vote-tx" });
      vote(Number(selectedCandidate.id));
      setIsModalOpen(false);
      setSelectedCandidate(null);
    } catch (error) {
      toast.error("Erro ao processar voto", { id: "vote-tx" });
      console.error(error);
    }
  };

  // Watch for vote cast events
  useWatchVoteCast(() => {
    // Refetch data when a vote is cast
    refetchCandidates();
    refetchStats();
    refetchFormatted();
  });

  // Update UI when transaction is confirmed
  useEffect(() => {
    if (isSuccess) {
      toast.success("Voto confirmado na blockchain!", { id: "vote-tx" });
      // Refetch após confirmação
      refetchCandidates();
      refetchStats();
      refetchFormatted();
    } else if (isConfirming) {
      toast.loading("Confirmando transação na blockchain...", { id: "vote-tx" });
    }
  }, [isSuccess, isConfirming, refetchCandidates, refetchStats, refetchFormatted]);

  if (candidatesLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-lg">Carregando dados da blockchain...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        isConnected={isConnected} 
        walletAddress={walletAddress} 
        onConnect={connectWallet} 
        onDisconnect={handleDisconnect}
        isConnecting={isConnecting}
      />

      <main className="container mx-auto px-4 py-8 space-y-12">
        <MetricsSection 
          totalVotes={votingStats ? Number(votingStats.totalVotes) : 0} 
          totalRaised={votingStats ? Number(votingStats.totalFunds) / 1e18 : 0} 
        />

        {formattedCandidates && (
          <CandidatesGrid 
            candidates={formattedCandidates} 
            onVote={handleVoteClick} 
            isConnected={isConnected} 
          />
        )}

        {formattedCandidates && <RankingSection candidates={formattedCandidates} />}
      </main>

      <VoteConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmVote}
        candidate={selectedCandidate ? {
          ...selectedCandidate,
          name: selectedCandidate.name,
          image: selectedCandidate.imageUrl,
          votes: Number(selectedCandidate.voteCount)
        } : null}
        isPending={isPending}
      />
    </div>
  );
}
