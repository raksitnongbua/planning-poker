import React from 'react'
import ReactCardFlip from 'react-card-flip'
import { twMerge } from 'tailwind-merge'

import BackCard from '../BackCard'
import FrontCard from '../FrontCard'
import { PokerCardProps } from './types'

const PokerCard = (props: PokerCardProps) => {
  const { label, onClick, value, isRevealed, isChosen, disabled } = props

  const buttonClass = twMerge(
    'w-14 h-[84px] md:w-[80px] md:h-[120px] overflow-hidden rounded-lg md:rounded-[10px] flex justify-center items-center disabled:hover:translate-y-0 scale-20 disabled:scale-100 hover:-translate-y-1 transition hover:scale-105 hover:z-10 ',
    isChosen && 'scale-105 -translate-y-3 md:-translate-y-4 hover:-translate-y-3 md:hover:-translate-y-4',
    disabled && 'opacity-40 saturate-0 cursor-not-allowed pointer-events-none'
  )
  const handleClick = () => {
    onClick?.(value)
  }

  return (
    <button className={buttonClass} onClick={handleClick} disabled={disabled}>
      <ReactCardFlip isFlipped={isRevealed}>
        <BackCard />
        <FrontCard label={label} />
      </ReactCardFlip>
    </button>
  )
}

export default PokerCard
