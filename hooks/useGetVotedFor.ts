import { useReadContract } from 'wagmi';
import { contractConfig } from '@/lib/contract-config';

export function useGetVotedFor(voterAddress?: string) {
  const { data, isLoading, error, refetch } = useReadContract({
    address: contractConfig.address,
    abi: contractConfig.abi,
    functionName: 'votedForCandidateId',
    args: voterAddress ? [voterAddress as `0x${string}`] : undefined,
    query: {
      enabled: !!voterAddress
    }
  });

  return { 
    data: data as bigint | undefined, 
    isLoading, 
    error, 
    refetch 
  };
}

