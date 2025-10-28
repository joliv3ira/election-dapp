import { useReadContract } from 'wagmi';
import { contractConfig } from '@/lib/contract-config';
import { VotingStats } from '@/types';

export function useGetVotingStatistics() {
  const { data, isLoading, error, refetch } = useReadContract({
    address: contractConfig.address,
    abi: contractConfig.abi,
    functionName: 'getVotingStats'
  });

  return { 
    data: data ? {
      totalVotes: (data as [bigint, bigint, bigint, boolean])[0],
      totalFunds: (data as [bigint, bigint, bigint, boolean])[1],
      candidateCount: (data as [bigint, bigint, bigint, boolean])[2],
      votingActive: (data as [bigint, bigint, bigint, boolean])[3]
    } as VotingStats : undefined,
    isLoading, 
    error, 
    refetch 
  };
}