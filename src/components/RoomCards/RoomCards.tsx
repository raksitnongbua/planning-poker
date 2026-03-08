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
    <div data-section="room-cards" className="flex flex-col items-center gap-2">
      {/* Scrollable on mobile, natural width on desktop */}
      <div className="-mx-4 px-4 overflow-x-auto overflow-y-visible md:mx-0 md:px-0 md:overflow-visible">
        <div className="flex items-end gap-2 md:gap-3 min-w-max" style={{ height: 'clamp(5.5rem, 12vw, 8rem)' }}>
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
      </div>
      {status === Status.RevealedCards && (
        <Button
          size="sm"
          variant="ghost"
          className="gap-1.5 text-muted-foreground transition-colors duration-200 hover:text-foreground"
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
