import React from 'react'

import PokerCard from '../PokerCard'
import { Status } from '../Room/types'
import { Button } from '../ui/button'

export interface RoomCardsProps {
  cardChoosing: string
  cardOptions: string[]
  isEditPointMode: boolean
  onClickFlipCards: () => void
  onClickVote: (point: string) => void
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
    <div data-section="room-cards" className="col-span-3 mx-auto flex h-36 flex-col gap-4">
      <div className="grid auto-cols-fr grid-flow-col content-end gap-4">
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
          className="self-end border-red-500 p-3 uppercase text-red-500 hover:text-red-400"
          onClick={onClickFlipCards}
        >
          {isEditPointMode ? 'Cancel' : 'Edit Point'}
        </Button>
      )}
    </div>
  )
}

export default RoomCards
