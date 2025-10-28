import { useWatchContractEvent } from 'wagmi';
import { contractConfig } from '@/lib/contract-config';
import { VoteEventArgs } from '@/types';

export function useWatchVoteCast(onVoteCast?: (args: VoteEventArgs) => void) {
  useWatchContractEvent({
    address: contractConfig.address,
    abi: contractConfig.abi,
    eventName: 'VoteCasted',
    onLogs: (logs) => {
      logs.forEach((log) => {
        if (onVoteCast && log.args) {
          onVoteCast({
            voter: log.args.voter as string,
            candidateId: log.args.candidateId as bigint,
            timestamp: log.args.timestamp as bigint
          })
        }
      })
    }
  })
}