// Define the types for our smart contract

export type Candidate = {
  id: bigint;
  name: string;
  description: string;
  imageUrl: string;
  voteCount: bigint;
};

export type ContractCandidate = Candidate;

export type VotingStats = {
  totalVotes: bigint;
  totalFunds: bigint;
  candidateCount: bigint;
  votingActive: boolean;
};

export type VoteEventArgs = {
  voter: string;
  candidateId: bigint;
  timestamp: bigint;
};

// Type for UI components that might use different field names
export type UICandidate = {
  id: number | bigint;
  name: string;
  party?: string;
  image: string;
  votes: number;
  proposals?: string[];
  formattedVoteCount?: string;
  votePercentage?: number;
};