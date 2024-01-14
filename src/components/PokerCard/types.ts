export interface PokerCardProps {
  value: number
  label: string
  onClick?: (value: number) => void
  isRevealed: boolean
  isChosen: boolean
}
