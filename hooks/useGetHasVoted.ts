import { useReadContract } from 'wagmi';
import { contractConfig } from '@/lib/contract-config';

export function useGetHasVoted(voterAddress?: `0x${string}`) {
  const { data, isLoading, error, refetch } = useReadContract({
    address: contractConfig.address,
    abi: contractConfig.abi,
    functionName: 'hasVoted',
    args: voterAddress ? [voterAddress] : undefined,
    query: {
      enabled: !!voterAddress
    }
  });

  return { 
    data: data as boolean | undefined, 
    isLoading, 
    error, 
    refetch 
  };
}