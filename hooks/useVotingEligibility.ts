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
      message = 'Connect your wallet to vote';
    } else if (!votingActive) {
      status = 'voting_closed';
      message = 'Voting is currently closed';
    } else if (hasVoted) {
      status = 'already_voted';
      message = `You already voted for candidate ${votedFor ? Number(votedFor) : 'unknown'}`;
    } else {
      status = 'can_vote';
      message = 'You can vote';
    }

    return { canVote, status, message, votedFor: votedFor ? Number(votedFor) : null };
  }, [userAddress, votingActive, hasVoted, votedFor]);

  return eligibility;
}