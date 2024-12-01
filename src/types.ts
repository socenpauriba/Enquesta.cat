export interface Poll {
  id: string;
  title: string;
  description: string;
  options: PollOption[];
  voteCodes: Set<string>;
  usedCodes: Set<string>;
  createdAt: Date;
  endsAt: Date;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}