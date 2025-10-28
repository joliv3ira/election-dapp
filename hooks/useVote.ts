import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { contractConfig } from '@/lib/contract-config';

export function useVote() {
  const { writeContract, data: hash, error, isPending } = useWriteContract();
  
  const { data: receipt, isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash,
  });

  const vote = async (candidateId: number) => {
    const voteFee = parseEther('0.025'); // 0.025 ETH
    
    writeContract({
      address: contractConfig.address,
      abi: contractConfig.abi,
      functionName: 'vote',
      args: [BigInt(candidateId)],
      value: voteFee,
    });
  };

  return {
    vote,
    hash,
    receipt,
    error,
    isPending,
    isConfirming,
    isSuccess: !!receipt,
  };
}