import React from 'react'
import ReactCardFlip from 'react-card-flip'
import { twMerge } from 'tailwind-merge'

import BackCard from '../BackCard'
import FrontCard from '../FrontCard'
import { PokerCardProps } from './types'

const PokerCard = (props: PokerCardProps) => {
  const { label, onClick, value, isRevealed, isChosen } = props

  const buttonClass = twMerge(
    'w-[80px] h-[120px] flex justify-center items-center disabled:hover:translate-y-0 scale-20 disabled:scale-100 hover:-translate-y-1 transition hover:scale-105 hover:z-10 ',
    isChosen && 'scale-105 -translate-y-4 hover:-translate-y-4'
  )
  const handleClick = () => {
    onClick?.(value)
  }

  return (
    <button className={buttonClass} onClick={handleClick} disabled={!isRevealed}>
      <ReactCardFlip isFlipped={isRevealed}>
        <BackCard />
        <FrontCard label={label} />
      </ReactCardFlip>
    </button>
  )
}

export default PokerCard
