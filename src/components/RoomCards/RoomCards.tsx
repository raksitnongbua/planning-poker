import { faPenToSquare, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
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
          variant="ghost"
          className="self-end gap-1.5 text-muted-foreground transition-colors duration-200 hover:text-foreground"
          onClick={onClickFlipCards}
        >
          <FontAwesomeIcon icon={isEditPointMode ? faXmark : faPenToSquare} className="size-3.5" />
          {isEditPointMode ? 'Cancel' : 'Edit Point'}
        </Button>
      )}
    </div>
  )
}

export default RoomCards
