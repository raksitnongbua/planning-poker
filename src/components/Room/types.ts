export interface Props {
  roomId?: string
}

export interface Member {
  name: string
  id: string
  estimatedPoint: number
  lastActiveAt: Date
}

export enum Status {
  None = 'NONE',
  Voting = 'VOTING',
  RevealedCards = 'REVEALED_CARDS',
}
