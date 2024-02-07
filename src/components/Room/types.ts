export interface Props {
  roomId?: string
  sessionId?: string
  avatar?: string | null
  userName?: string | null
}

export interface Member {
  name: string
  id: string
  estimatedValue: string
  avatar?: string
  lastActiveAt: Date
}

export enum Status {
  None = 'NONE',
  Voting = 'VOTING',
  RevealedCards = 'REVEALED_CARDS',
}
