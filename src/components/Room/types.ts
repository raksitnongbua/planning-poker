export interface Props {
  roomId?: string
}

export interface Member {
  name: string
  id: string
  estimatedValue: string
  lastActiveAt: Date
}

export enum Status {
  None = 'NONE',
  Voting = 'VOTING',
  RevealedCards = 'REVEALED_CARDS',
}
