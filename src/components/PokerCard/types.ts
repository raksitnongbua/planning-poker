export interface PokerCardProps {
  id: string
  label: string
  onClick?: (id: string) => void
  isRevealed: boolean
  isChosen: boolean
}
