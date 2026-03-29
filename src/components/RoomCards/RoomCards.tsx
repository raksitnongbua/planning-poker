import { faXmark } from '@fortawesome/free-solid-svg-icons'
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
  onNextRound?: () => void
  status: Status
}

const RoomCards: React.FC<RoomCardsProps> = ({
  cardChoosing,
  cardOptions,
  isEditPointMode,
  onClickFlipCards,
  onClickVote,
  onNextRound,
  status,
}) => {
  return (
    <div data-section="room-cards" className="flex w-full flex-col items-center gap-2">
      {/* w-full ensures scroll container fills parent width (not content width) so overflow-x-scroll works */}
      {/* overflow-x-scroll forces always-enabled scrolling and shows a thin scrollbar indicator */}
      <div
        className="w-full overflow-x-scroll scroll-smooth snap-x snap-proximity md:w-auto md:overflow-visible md:snap-none"
        style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.15) transparent' }}
      >
        {/* px-4 pads edge cards; pt-4 reserves headroom for chosen card's -translate-y-3 lift */}
        <div className="flex items-end gap-2 md:gap-3 min-w-max px-4 pt-4 md:px-0 md:pt-0" style={{ height: 'calc(clamp(5.5rem, 12vw, 8rem) + 1rem)' }}>
          {cardOptions.map((value, index) => {
            const isRevealed = status === Status.Voting || isEditPointMode
            const isLocked = status === Status.RevealedCards && !isEditPointMode
            return (
              <div key={`card-${index}`} className="snap-center flex-shrink-0">
                <PokerCard
                  label={String(value)}
                  value={value}
                  isRevealed={isRevealed}
                  onClick={onClickVote}
                  isChosen={cardChoosing === value && isRevealed}
                  disabled={isLocked}
                />
              </div>
            )
          })}
        </div>
      </div>
      {status === Status.RevealedCards && (
        <div className="flex flex-col items-center gap-1">
          {isEditPointMode ? (
            <Button
              size="sm"
              variant="ghost"
              className="gap-1.5 text-muted-foreground transition-colors duration-200 hover:text-foreground"
              onClick={onClickFlipCards}
            >
              <FontAwesomeIcon icon={faXmark} className="size-3.5" />
              Cancel
            </Button>
          ) : (
            <p className="text-[10px] text-muted-foreground/50">
              Cards locked —{' '}
              <button
                className="text-primary/70 underline-offset-2 hover:text-primary hover:underline transition-colors"
                onClick={onClickFlipCards}
              >
                Edit Point
              </button>
              {' '}to change or{' '}
              {onNextRound ? (
                <button
                  className="text-primary/70 underline-offset-2 hover:text-primary hover:underline transition-colors"
                  onClick={onNextRound}
                >
                  Next Round
                </button>
              ) : (
                <span className="text-muted-foreground/40">Next Round</span>
              )}
              {' '}to continue
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default RoomCards
