import React from 'react'
import { PokerCardProps } from './types'

import { twMerge } from 'tailwind-merge'

const PokerCard = (props: PokerCardProps) => {
  const { label, onClick, id, isRevealed, isChosen } = props

  const handleClick = () => {
    onClick?.(id)
  }

  return (
    <button
      className={twMerge(
        'rounded-md border bg-neutral-100 w-12 h-20 flex justify-center items-center hover:bg-white disabled:hover:translate-y-0 disabled:scale-100 hover:-translate-y-1 transition hover:scale-110 hover:z-10 disabled:bg-neutral-500',
        isChosen && 'scale-110 bg-white -translate-y-4 hover:-translate-y-4'
      )}
      onClick={handleClick}
      disabled={!isRevealed}
    >
      {isRevealed && (
        <span className="text-black text-lg font-bold pointer-events-none">{label}</span>
      )}
    </button>
  )
}

export default PokerCard
