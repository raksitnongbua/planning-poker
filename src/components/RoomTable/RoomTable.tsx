import { faEye, faRotateRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useMemo, useState } from 'react'
import ReactCardFlip from 'react-card-flip'

import CorgiFeeling from '../CorgiFeeling'
import { Member, Status } from '../Room/types'
import { Table } from '../Table'
import { Button } from '../ui/button'

export interface RoomTableProps {
  result: Map<string, number>
  maxPoint: number
  members: Member[]
  roomName: string
  status: Status
  isSpectator: boolean
  onReveal: () => void
  onReset: () => void
}

const RoomTable: React.FC<RoomTableProps> = ({ result, maxPoint, members, roomName, status, isSpectator, onReveal, onReset }) => {
  const averagePoint = useMemo(() => {
    let votingCount = 0
    let summaryPoint = 0
    result.forEach((value, key) => {
      summaryPoint += Number(key) * value
      votingCount += value
    })
    return summaryPoint / votingCount
  }, [result])

  const badlyPercentage = (averagePoint / maxPoint) * 100

  const scoreGradient =
    badlyPercentage <= 20 ? 'from-green-400 via-emerald-400 to-green-300' :
    badlyPercentage <= 40 ? 'from-lime-400 via-yellow-400 to-lime-300' :
    badlyPercentage <= 60 ? 'from-yellow-400 via-orange-400 to-yellow-300' :
    badlyPercentage <= 80 ? 'from-orange-500 via-primary to-orange-400' :
                            'from-red-500 via-rose-500 to-red-400'

  const [displayedScore, setDisplayedScore] = useState(0)

  useEffect(() => {
    if (status !== Status.RevealedCards) {
      setDisplayedScore(0)
      return
    }
    const duration = 1000
    const steps = 40
    let step = 0
    const timer = setInterval(() => {
      step++
      const eased = 1 - Math.pow(1 - step / steps, 3)
      setDisplayedScore(averagePoint * eased)
      if (step >= steps) {
        setDisplayedScore(averagePoint)
        clearInterval(timer)
      }
    }, duration / steps)
    return () => clearInterval(timer)
  }, [averagePoint, status])

  const isRevealed = status === Status.RevealedCards

  // Frozen snapshot of the last revealed state — never resets during the flip-back animation
  const [frozenScore, setFrozenScore] = useState(0)
  const [frozenBadlyPct, setFrozenBadlyPct] = useState(50)
  const [frozenResult, setFrozenResult] = useState(new Map<string, number>())

  useEffect(() => {
    if (!isRevealed) return
    setFrozenScore(displayedScore)
    setFrozenBadlyPct(badlyPercentage)
    setFrozenResult(new Map(result))
  }, [isRevealed, displayedScore, badlyPercentage, result])

  const frozenGradient =
    frozenBadlyPct <= 20 ? 'from-green-400 via-emerald-400 to-green-300' :
    frozenBadlyPct <= 40 ? 'from-lime-400 via-yellow-400 to-lime-300' :
    frozenBadlyPct <= 60 ? 'from-yellow-400 via-orange-400 to-yellow-300' :
    frozenBadlyPct <= 80 ? 'from-orange-500 via-primary to-orange-400' :
                            'from-red-500 via-rose-500 to-red-400'

  return (
    <div data-section="room-table" className="relative">
      {/* Jumbo result card — floats in the empty left space */}
      <div
        className="absolute flex flex-col items-center gap-4 px-5 pt-5 pb-4"
        style={{ right: 'calc(100% + 96px)', top: '50%', transform: 'translateY(-40%)' }}
      >
        <div className="w-[158px] h-[238px] transition-transform duration-300 hover:scale-110">
        <div className="animate-card-idle w-full h-full">
        <ReactCardFlip
          isFlipped={isRevealed}
          flipDirection="horizontal"
          containerStyle={{ width: '158px', height: '238px' }}
        >
          {/* ── Back face: voting state ── */}
          <div className="relative w-[158px] h-[238px] overflow-hidden rounded-2xl border border-border bg-gradient-to-b from-muted/60 to-background shadow-2xl shadow-black/40 flex flex-col items-center justify-center">
            {/* Shine sweep */}
            <span
              className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shine"
              style={{ animationDuration: '4s' }}
            />
            <span className="absolute left-2.5 top-2.5 select-none text-[11px] leading-none text-muted-foreground/30">•</span>
            <span className="absolute bottom-2.5 right-2.5 rotate-180 select-none text-[11px] leading-none text-muted-foreground/30">•</span>
            <span className="select-none text-[96px] font-black leading-none text-muted-foreground/20">?</span>
          </div>

          {/* ── Front face: revealed state ── */}
          <div className="relative w-[158px] h-[238px] overflow-hidden rounded-2xl border border-border bg-gradient-to-b from-muted/60 to-background shadow-2xl shadow-black/60 flex flex-col">
            {/* Score-colored radial glow behind score area */}
            <div
              className={`pointer-events-none absolute bottom-0 left-1/2 h-24 w-36 -translate-x-1/2 rounded-full opacity-30 blur-2xl bg-gradient-to-r ${frozenGradient}`}
            />
            {/* Shine sweep */}
            <span
              className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-transparent via-white/8 to-transparent animate-shine"
              style={{ animationDuration: '4s' }}
            />
            {/* Corner marks — score-colored */}
            <span className={`absolute left-2.5 top-2.5 select-none text-[10px] font-bold leading-none bg-gradient-to-r ${frozenGradient} bg-clip-text text-transparent`}>•</span>
            <span className={`absolute bottom-2.5 right-2.5 rotate-180 select-none text-[10px] font-bold leading-none bg-gradient-to-r ${frozenGradient} bg-clip-text text-transparent`}>•</span>

            {/* Corgi — fixed height so score section always has room */}
            <div className="flex h-[124px] items-center justify-center overflow-hidden">
              <CorgiFeeling badlyPercentage={frozenBadlyPct} width={110} height={110} />
            </div>

            {/* Gradient divider */}
            <div className={`mx-3 h-px bg-gradient-to-r ${frozenGradient} opacity-25`} />

            {/* Score section */}
            <div className="flex flex-col items-center gap-1.5 px-3 pb-3 pt-2">
              <span className="text-[8px] font-semibold uppercase tracking-[0.14em] text-white/30">Average</span>
              <div className="flex items-end gap-1 leading-none">
                <span
                  className={`bg-gradient-to-r ${frozenGradient} bg-clip-text text-3xl font-black text-transparent tabular-nums`}
                  style={{ backgroundSize: '200% 200%', animation: 'gradient-shift 3s ease infinite' }}
                >
                  {frozenScore.toFixed(1)}
                </span>
                <span className="mb-0.5 text-[9px] font-medium text-white/30">pts</span>
              </div>

              {/* Distribution chips */}
              <div className="flex flex-wrap justify-center gap-1">
                {Array.from(frozenResult.entries())
                  .sort(([a], [b]) => Number(a) - Number(b))
                  .map(([score, count]) => (
                    <div
                      key={score}
                      className="flex items-center gap-0.5 rounded-full border border-white/10 bg-white/5 px-2 py-0.5"
                    >
                      <span className="text-[9px] font-bold text-white/70">{score}</span>
                      <span className="text-[8px] text-white/30">×{count}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </ReactCardFlip>
        </div>
        </div>

        {/* Action buttons — fixed-height slot so the card never shifts position */}
        <div className="flex h-10 w-full items-center justify-center">
          {!isSpectator && status === Status.Voting && members.some((m) => m.estimatedValue !== '') && (
            <div className="relative">
              <div className="absolute inset-[-4px] rounded-lg bg-primary/30 blur-xl animate-pulse" style={{ animationDuration: '2s' }} />
              <div className="relative overflow-hidden rounded-md">
                <span className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-transparent via-white/25 to-transparent animate-shine" style={{ animationDuration: '3s' }} />
                <Button
                  className="relative gap-2 border-0 bg-gradient-to-r from-orange-500 via-primary to-orange-400 transition-transform duration-200 hover:scale-[1.04] hover:shadow-lg hover:shadow-primary/40"
                  style={{ backgroundSize: '200% 200%', animation: 'gradient-shift 4s ease infinite' }}
                  onClick={onReveal}
                >
                  <FontAwesomeIcon icon={faEye} className="size-4" />
                  Reveal Cards
                </Button>
              </div>
            </div>
          )}
          {!isSpectator && status === Status.RevealedCards && (
            <Button
              variant="outline"
              className="gap-2 border-border text-muted-foreground transition-all duration-200 hover:border-destructive/60 hover:text-destructive"
              onClick={onReset}
            >
              <FontAwesomeIcon icon={faRotateRight} className="size-3.5" />
              New Round
            </Button>
          )}
        </div>
      </div>

      {/* Table — centered by parent */}
      <Table name={roomName} members={members} isRevealed={isRevealed} />
    </div>
  )
}

export default RoomTable
