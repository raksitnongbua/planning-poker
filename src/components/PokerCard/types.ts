export interface PokerCardProps {
  value: string
  label: string
  onClick?: (value: string) => void
  isRevealed: boolean
  isChosen: boolean
}
