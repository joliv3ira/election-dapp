import { useReadContract } from 'wagmi';
import { contractConfig } from '@/lib/contract-config';
import { Candidate } from '@/types';

export function useGetAllCandidates() {
  const { data, isLoading, error, refetch } = useReadContract({
    address: contractConfig.address,
    abi: contractConfig.abi,
    functionName: 'getActiveCandidates'
  });

  return { 
    data: data as Candidate[] | undefined, 
    isLoading, 
    error, 
    refetch 
  };
}