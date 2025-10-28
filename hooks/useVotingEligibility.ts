import { useGetVotingActive } from './useGetVotingActive';
import { useGetHasVoted } from './useGetHasVoted';
import { useGetVotedFor } from './useGetVotedFor';
import { useMemo } from 'react';

export function useVotingEligibility(userAddress?: string) {
  const { data: votingActive } = useGetVotingActive();
  const { data: hasVoted } = useGetHasVoted(userAddress);
  const { data: votedFor } = useGetVotedFor(userAddress);

  const eligibility = useMemo(() => {
    const isConnected = !!userAddress;
    const canVote = isConnected && votingActive && !hasVoted;

    let status: 'can_vote' | 'already_voted' | 'voting_closed' | 'not_connected';
    let message = '';

    if (!isConnected) {
      status = 'not_connected';
      message = 'Conecte sua carteira para votar';
    } else if (!votingActive) {
      status = 'voting_closed';
      message = 'A votação está fechada no momento';
    } else if (hasVoted) {
      status = 'already_voted';
      message = `Você já votou no candidato ${votedFor ? Number(votedFor) : 'desconhecido'}`;
    } else {
      status = 'can_vote';
      message = 'Você pode votar';
    }

    return { canVote, status, message, votedFor: votedFor ? Number(votedFor) : null };
  }, [userAddress, votingActive, hasVoted, votedFor]);

  return eligibility;
}