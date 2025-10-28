import { useGetAllCandidates } from './useGetAllCandidates';
import { useGetVotingStatistics } from './useGetVotingStatistics';
import { useMemo } from 'react';
import { Candidate } from '@/types';

type CandidateWithFormatted = Candidate & {
  formattedVoteCount: string;
  votePercentage: number;
};

export function useCandidatesWithFormatted() {
  const { data: candidates, isLoading, error, refetch } = useGetAllCandidates();
  const { data: statistics } = useGetVotingStatistics();

  const candidatesWithFormatted = useMemo(() => {
    if (!candidates || !statistics) return undefined;

    const totalVotes = Number(statistics.totalVotes);

    return candidates.map((candidate: Candidate) => {
      const voteCount = Number(candidate.voteCount);
      const votePercentage = totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0;

      return {
        ...candidate,
        formattedVoteCount: voteCount.toLocaleString(),      // "1,234"
        votePercentage: Math.round(votePercentage * 100) / 100  // 45.67%
      };
    });
  }, [candidates, statistics]);

  return { data: candidatesWithFormatted as CandidateWithFormatted[] | undefined, isLoading, error, refetch };
}