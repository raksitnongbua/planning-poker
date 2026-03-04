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

export interface ChatMessage {
  id: string
  memberId: string
  name: string
  avatar?: string
  text: string
  at: Date
}

export enum Status {
  None = 'NONE',
  Voting = 'VOTING',
  RevealedCards = 'REVEALED_CARDS',
}
