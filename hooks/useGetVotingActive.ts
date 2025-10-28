import { useReadContract } from 'wagmi';
import { contractConfig } from '@/lib/contract-config';

export function useGetVotingActive() {
  const { data, isLoading, error, refetch } = useReadContract({
    address: contractConfig.address,
    abi: contractConfig.abi,
    functionName: 'votingActive'
  });

  return { 
    data: data as boolean | undefined, 
    isLoading, 
    error, 
    refetch 
  };
}

