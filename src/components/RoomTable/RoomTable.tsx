'use client'
import { faEye, faRotateRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useTranslations } from 'next-intl'
import React, { useEffect, useRef, useState } from 'react'
import ReactCardFlip from 'react-card-flip'

import type { TicketEstimation } from '@/components/JiraIntegration'

import CorgiFeeling from '../CorgiFeeling'
import { Member, Status } from '../Room/types'
import { Table } from '../Table'
import { Button } from '../ui/button'
import { TicketBar } from './TicketBar'

export interface RoomTableProps {
  result: Map<string, number>
  maxPoint: number
  members: Member[]
  roomName: string
  status: Status
  isSpectator: boolean
  ticketEstimation?: TicketEstimation | null
  isJiraConnected?: boolean
  jiraSiteUrl?: string
  cloudId?: string
  roomId?: string
  consensusValue?: string
  finalStoryPoint?: string
  deckOptions?: string[]
  ticketQueue?: TicketEstimation[]
  onReveal: () => void
  onReset: () => void
  onSetTicket?: () => void
  onRemoveTicket?: () => void
  onSaveToJira?: (estimation: TicketEstimation, value: number, fieldId: string) => Promise<void>
  onSetFinalStoryPoint?: (value: string) => void
  onTicketSelect?: (estimation: TicketEstimation) => void
  onOpenTicketInfo?: (ticket: TicketEstimation) => void
}

const TABLE_W = 600
const TABLE_H = 212
const TABLE_PAD = 60

function getScoreGradient(pct: number): string {
  if (pct <= 20) return 'from-green-400 via-emerald-400 to-green-300'
  if (pct <= 40) return 'from-lime-400 via-yellow-400 to-lime-300'
  if (pct <= 60) return 'from-yellow-400 via-orange-400 to-yellow-300'
  if (pct <= 80) return 'from-orange-500 via-primary to-orange-400'
  return 'from-red-500 via-rose-500 to-red-400'
}

// Hoisted outside the component so it is stable across renders and
// can be passed as a useState initializer without a deps-lint escape.
function calcTableScale(): number {
  return typeof window !== 'undefined' && window.innerWidth < 768
    ? Math.min(1, (window.innerWidth - 32) / (TABLE_W + TABLE_PAD * 2))
    : 1
}

const RoomTable: React.FC<RoomTableProps> = ({
  result, maxPoint, members, roomName, status, isSpectator,
  ticketEstimation, isJiraConnected = false, jiraSiteUrl = '', cloudId = '',
  roomId = '', consensusValue, finalStoryPoint, deckOptions,
  ticketQueue = [], onReveal, onReset, onSetTicket, onRemoveTicket, onSaveToJira,
  onSetFinalStoryPoint, onTicketSelect, onOpenTicketInfo,
}) => {
  const t = useTranslations('room')
  const [tableScale, setTableScale] = useState(calcTableScale)

  useEffect(() => {
    const updateScale = () => setTableScale(calcTableScale())
    window.addEventListener('resize', updateScale)
    return () => window.removeEventListener('resize', updateScale)
  }, [])
  let votingCount = 0
  let summaryPoint = 0
  result.forEach((value, key) => {
    summaryPoint += Number(key) * value
    votingCount += value
  })
  const averagePoint = summaryPoint / votingCount

  const badlyPercentage = (averagePoint / maxPoint) * 100

  const scoreGradient = getScoreGradient(badlyPercentage)

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

  // Story point picker state
  const [customInput, setCustomInput] = useState('')
  const [pickerOpen, setPickerOpen] = useState(false)
  const customInputRef = useRef<HTMLInputElement>(null)

  const showFinalPicker = isRevealed && deckOptions && deckOptions.length > 0
  const prevIsRevealedRef = useRef(false)

  useEffect(() => {
    const justRevealed = isRevealed && !prevIsRevealedRef.current
    prevIsRevealedRef.current = isRevealed

    if (!isRevealed) { setPickerOpen(false); return }
    if (!justRevealed) return
    if (!deckOptions || deckOptions.length === 0) return
    const numericOpts = deckOptions.map(Number).filter((v) => !isNaN(v) && isFinite(v)).sort((a, b) => a - b)
    if (numericOpts.length === 0) return
    const nearest = numericOpts.reduce((prev, cur) =>
      Math.abs(cur - averagePoint) < Math.abs(prev - averagePoint) ? cur : prev
    )
    const matched = deckOptions.find((opt) => Number(opt) === nearest)
    if (matched) onSetFinalStoryPoint?.(matched)
  }, [isRevealed, averagePoint, deckOptions, onSetFinalStoryPoint])

  function handlePickFinalPoint(value: string) {
    onSetFinalStoryPoint?.(value)
    setCustomInput('')
    setPickerOpen(false)
  }

  function handleCustomConfirm() {
    const trimmed = customInput.trim()
    if (!trimmed) return
    handlePickFinalPoint(trimmed)
  }

  // Frozen snapshot of the last revealed state — never resets during the flip-back animation.
  // Only captured once when the round is first revealed (not on every displayedScore animation tick).
  const [frozenScore, setFrozenScore] = useState(0)
  const [frozenBadlyPct, setFrozenBadlyPct] = useState(50)
  const [frozenResult, setFrozenResult] = useState(new Map<string, number>())
  const prevIsRevealedForFreezeRef = useRef(false)

  useEffect(() => {
    const justRevealed = isRevealed && !prevIsRevealedForFreezeRef.current
    prevIsRevealedForFreezeRef.current = isRevealed
    if (!justRevealed) return
    setFrozenScore(averagePoint)
    setFrozenBadlyPct(badlyPercentage)
    setFrozenResult(new Map(result))
  }, [isRevealed, averagePoint, badlyPercentage, result])

  const frozenGradient = getScoreGradient(frozenBadlyPct)

  // Shared jumbo card JSX — rendered at different sizes for mobile vs desktop
  const jumboCardBack = (w: number, h: number) => (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-b from-muted/60 to-background shadow-2xl shadow-black/40 flex flex-col items-center justify-center"
      style={{ width: w, height: h }}>
      <span className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shine" style={{ animationDuration: '4s' }} />
      <span className="absolute left-2.5 top-2.5 select-none text-[11px] leading-none text-muted-foreground/30">•</span>
      <span className="absolute bottom-2.5 right-2.5 rotate-180 select-none text-[11px] leading-none text-muted-foreground/30">•</span>
      <span className="select-none font-black leading-none text-muted-foreground/20" style={{ fontSize: h * 0.4 }}>?</span>
    </div>
  )

  const jumboCardFront = (w: number, h: number) => (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-b from-muted/60 to-background shadow-2xl shadow-black/60 flex flex-col"
      style={{ width: w, height: h }}>
      <div className={`pointer-events-none absolute bottom-0 left-1/2 h-24 w-36 -translate-x-1/2 rounded-full opacity-30 blur-2xl bg-gradient-to-r ${frozenGradient}`} />
      <span className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-transparent via-white/8 to-transparent animate-shine" style={{ animationDuration: '4s' }} />
      <span className={`absolute left-2.5 top-2.5 select-none text-[10px] font-bold leading-none bg-gradient-to-r ${frozenGradient} bg-clip-text text-transparent`}>•</span>
      <span className={`absolute bottom-2.5 right-2.5 rotate-180 select-none text-[10px] font-bold leading-none bg-gradient-to-r ${frozenGradient} bg-clip-text text-transparent`}>•</span>
      <div className="flex flex-1 items-center justify-center overflow-hidden">
        <CorgiFeeling badlyPercentage={frozenBadlyPct} width={w * 0.7} height={h * 0.45} />
      </div>
      <div className={`mx-3 h-px bg-gradient-to-r ${frozenGradient} opacity-25`} />
      <div className="flex flex-col items-center gap-1 px-3 pb-3 pt-2">
        <span className="text-[8px] font-semibold uppercase tracking-[0.14em] text-white/30">Average</span>
        <div className="flex items-end gap-1 leading-none">
          <span className={`bg-gradient-to-r ${frozenGradient} bg-clip-text text-3xl font-black text-transparent tabular-nums`}
            style={{ backgroundSize: '200% 200%', animation: 'gradient-shift 3s ease infinite' }}>
            {frozenScore.toFixed(1)}
          </span>
          <span className="mb-0.5 text-[9px] font-medium text-white/30">pts</span>
        </div>
        <div className="flex flex-wrap justify-center gap-1">
          {Array.from(frozenResult.entries()).sort(([a], [b]) => Number(a) - Number(b)).map(([score, count]) => (
            <div key={score} className="flex items-center gap-0.5 rounded-full border border-white/10 bg-white/5 px-2 py-0.5">
              <span className="text-[9px] font-bold text-white/70">{score}</span>
              <span className="text-[8px] text-white/30">×{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const actionButtons = (
    <>
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
              {t('revealCards')}
            </Button>
          </div>
        </div>
      )}
      {!isSpectator && status === Status.RevealedCards && (() => {
        const hasNextTicket = (ticketQueue ?? []).some((t) => !t.avgScore && !t.finalScore)
        return (
          <Button
            variant="outline"
            className="gap-2 border-border text-muted-foreground transition-all duration-200 hover:border-destructive/60 hover:text-destructive"
            onClick={onReset}
          >
            {hasNextTicket ? (
              <>
                <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
                Next
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faRotateRight} className="size-3.5" />
                New Round
              </>
            )}
          </Button>
        )
      })()}
    </>
  )

  // Final story point picker section
  const finalPickerSection = showFinalPicker ? (
    <div className="mt-2 w-full max-w-[200px]">
      {/* Avg row */}
      <div className="flex items-center justify-between rounded-t-lg border border-border/40 bg-muted/10 px-2.5 py-1.5">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">Avg</span>
        <span className="font-mono text-xs font-bold text-muted-foreground">{averagePoint.toFixed(1)}</span>
      </div>
      {/* Final row */}
      <div className="flex flex-col gap-1.5 rounded-b-lg border-x border-b border-border/40 bg-muted/10 px-2.5 py-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">Final</span>
          {!pickerOpen && (
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-xs font-bold text-primary">{finalStoryPoint}</span>
              <button
                className="flex items-center justify-center rounded p-0.5 text-muted-foreground/50 transition-colors hover:text-foreground"
                onClick={() => setPickerOpen(true)}
              >
                <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 11l6-6 3 3-6 6H9v-3z" />
                </svg>
              </button>
            </div>
          )}
        </div>
        {pickerOpen && (
          <div className="flex flex-wrap gap-1">
            {deckOptions?.map((opt) => (
              <button
                key={opt}
                className={`rounded-full border px-2 py-0.5 text-[10px] font-bold transition-colors ${
                  finalStoryPoint === opt
                    ? 'border-primary/40 bg-primary/20 text-primary'
                    : 'border-border/40 bg-muted/20 text-muted-foreground hover:border-primary/30 hover:bg-primary/10 hover:text-primary'
                }`}
                onClick={() => handlePickFinalPoint(opt)}
              >
                {opt}
              </button>
            ))}
            {/* Custom input */}
            <div className="flex items-center gap-0.5">
              <input
                ref={customInputRef}
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleCustomConfirm() }}
                placeholder="…"
                className="w-10 rounded-full border border-border/40 bg-muted/20 px-1.5 py-0.5 text-center text-[10px] text-foreground outline-none placeholder:text-muted-foreground/30 focus:border-primary/40 focus:bg-primary/5"
              />
              {customInput.trim() && (
                <button
                  className="text-[10px] text-primary hover:text-primary/80 transition-colors"
                  onClick={handleCustomConfirm}
                >
                  ✓
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  ) : null

  return (
    <div data-section="room-table" className="flex flex-col items-center gap-3 w-full">

      {/* ── Card + Table row ── */}
      <div className="flex flex-col items-center gap-4 w-full md:flex-row md:items-center md:justify-center md:gap-12">

        {/* Mobile: card + action buttons above the table */}
        <div className="flex flex-col items-center gap-2 md:hidden">
          <ReactCardFlip isFlipped={isRevealed} flipDirection="horizontal" containerStyle={{ width: '90px', height: '135px' }}>
            {jumboCardBack(90, 135)}
            {jumboCardFront(90, 135)}
          </ReactCardFlip>
          <div className="flex h-10 items-center justify-center">{actionButtons}</div>
          {finalPickerSection}
        </div>

        {/* Desktop: card + action buttons to the left of the table */}
        <div className="hidden md:flex flex-col items-center gap-2 flex-shrink-0">
          {roomName && (
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/40">
              {roomName}
            </p>
          )}
          <div className="w-[158px] h-[238px] transition-transform duration-1000 hover:scale-110 animate-card-idle">
            <ReactCardFlip isFlipped={isRevealed} flipDirection="horizontal" containerStyle={{ width: '158px', height: '238px' }}>
              {jumboCardBack(158, 238)}
              {jumboCardFront(158, 238)}
            </ReactCardFlip>
          </div>
          <div className="mt-2 flex h-10 w-full items-center justify-center">{actionButtons}</div>
          {finalPickerSection}
        </div>

        {/* Table: scaled on mobile, natural size on desktop */}
        <div
          className="flex-shrink-0"
          style={{
            width: Math.round(tableScale * (TABLE_W + TABLE_PAD * 2)),
            minHeight: Math.round(tableScale * (TABLE_H + TABLE_PAD * 2)),
          }}
        >
          <div style={{ transform: `scale(${tableScale})`, transformOrigin: 'top left', width: TABLE_W + TABLE_PAD * 2, minHeight: TABLE_H + TABLE_PAD * 2, paddingLeft: TABLE_PAD, paddingTop: TABLE_PAD }}>
            <Table
              name={roomName}
              members={members}
              isRevealed={isRevealed}
              ticketEstimation={ticketEstimation}
              bottomSlot={onSetTicket && onRemoveTicket && onSaveToJira ? (
                <TicketBar
                  estimation={ticketEstimation ?? null}
                  isJiraConnected={isJiraConnected}
                  jiraSiteUrl={jiraSiteUrl}
                  cloudId={cloudId}
                  roomId={roomId}
                  roomStatus={status === Status.RevealedCards ? 'REVEALED_CARDS' : 'VOTING'}
                  consensusValue={consensusValue}
                  finalStoryPoint={finalStoryPoint}
                  isSpectator={isSpectator}
                  onSet={onSetTicket}
                  onRemove={onRemoveTicket}
                  onSaveToJira={onSaveToJira}
                  onOpenTicketInfo={onOpenTicketInfo}
                />
              ) : undefined}
            />
          </div>
        </div>
      </div>

    </div>
  )
}

export default RoomTable
