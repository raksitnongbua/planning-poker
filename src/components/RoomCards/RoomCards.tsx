import React from 'react'

import PokerCard from '../PokerCard'
import { Status } from '../Room/types'
import { Button } from '../ui/button'

export interface RoomCardsProps {
  cardChoosing: number
  cardOptions: number[]
  isEditPointMode: boolean
  onClickFlipCards: () => void
  onClickVote: (point: number) => void
  status: Status
}

const RoomCards: React.FC<RoomCardsProps> = ({
  cardChoosing,
  cardOptions,
  isEditPointMode,
  onClickFlipCards,
  onClickVote,
  status,
}) => {
  return (
    <div data-section="room-cards" className="h-36 mx-auto col-span-3 gap-4 flex flex-col">
      <div className="grid grid-flow-col auto-cols-fr content-end gap-4">
        {cardOptions.map((value) => {
          const isRevealed = status === Status.Voting || isEditPointMode
          return (
            <PokerCard
              key={`card-${value}`}
              label={String(value)}
              value={value}
              isRevealed={isRevealed}
              onClick={onClickVote}
              isChosen={cardChoosing === value && isRevealed}
            />
          )
        })}
      </div>
      {status === Status.RevealedCards && (
        <Button
          size="sm"
          variant="outline"
          className="text-red-500 p-1 border-red-500 self-end hover:text-red-400 uppercase"
          onClick={onClickFlipCards}
        >
          Flip Cards
        </Button>
      )}
    </div>
  )
}

export default RoomCards
