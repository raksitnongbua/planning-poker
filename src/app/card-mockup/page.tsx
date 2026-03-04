'use client'
import React, { useState } from 'react'

import CorgiFeeling from '@/components/CorgiFeeling'

const CARD_W = 158
const CARD_H = 238

interface CardCase {
  label: string
  badlyPct: number
  score: number
  result: [string, number][]
}

const CASES: CardCase[] = [
  { label: '≤20% — Smooth', badlyPct: 10,  score: 1,    result: [['1', 3]] },
  { label: '≤40% — Steady', badlyPct: 30,  score: 3,    result: [['2', 1], ['3', 2]] },
  { label: '≤60% — Discuss', badlyPct: 50, score: 5,    result: [['3', 1], ['5', 2], ['8', 1]] },
  { label: '≤80% — Risky',  badlyPct: 70,  score: 8,    result: [['5', 1], ['8', 2], ['13', 1]] },
  { label: '>80%  — Abort', badlyPct: 95,  score: 13,   result: [['8', 1], ['13', 3]] },
]

function gradient(pct: number) {
  if (pct <= 20) return 'from-green-400 via-emerald-400 to-green-300'
  if (pct <= 40) return 'from-lime-400 via-yellow-400 to-lime-300'
  if (pct <= 60) return 'from-yellow-400 via-orange-400 to-yellow-300'
  if (pct <= 80) return 'from-orange-500 via-primary to-orange-400'
  return 'from-red-500 via-rose-500 to-red-400'
}

function BackCard() {
  const g = gradient(50)
  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-b from-muted/60 to-background shadow-2xl shadow-black/40 flex flex-col items-center justify-center"
      style={{ width: CARD_W, height: CARD_H }}
    >
      <span className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-transparent via-white/8 to-transparent animate-shine" style={{ animationDuration: '4s' }} />
      <span className={`absolute left-2.5 top-2.5 select-none text-[10px] font-bold leading-none bg-gradient-to-r ${g} bg-clip-text text-transparent`}>♠</span>
      <span className={`absolute bottom-2.5 right-2.5 rotate-180 select-none text-[10px] font-bold leading-none bg-gradient-to-r ${g} bg-clip-text text-transparent`}>♠</span>
      <span className="select-none text-[96px] font-black leading-none text-muted-foreground/20">?</span>
    </div>
  )
}

function FrontCard({ badlyPct, score, result }: { badlyPct: number; score: number; result: [string, number][] }) {
  const g = gradient(badlyPct)
  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-b from-muted/60 to-background shadow-2xl shadow-black/40 flex flex-col"
      style={{ width: CARD_W, height: CARD_H }}
    >
      {/* Radial glow */}
      <div className={`pointer-events-none absolute bottom-0 left-1/2 h-24 w-36 -translate-x-1/2 rounded-full opacity-30 blur-2xl bg-gradient-to-r ${g}`} />
      {/* Shine */}
      <span className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-transparent via-white/8 to-transparent animate-shine" style={{ animationDuration: '4s' }} />
      {/* Corner marks */}
      <span className={`absolute left-2.5 top-2.5 select-none text-[10px] font-bold leading-none bg-gradient-to-r ${g} bg-clip-text text-transparent`}>♠</span>
      <span className={`absolute bottom-2.5 right-2.5 rotate-180 select-none text-[10px] font-bold leading-none bg-gradient-to-r ${g} bg-clip-text text-transparent`}>♠</span>

      {/* Corgi — fixed height so score section always has room */}
      <div className="flex h-[124px] items-center justify-center overflow-hidden">
        <CorgiFeeling badlyPercentage={badlyPct} width={110} height={110} />
      </div>

      {/* Divider */}
      <div className={`mx-3 h-px bg-gradient-to-r ${g} opacity-25`} />

      {/* Score */}
      <div className="flex flex-col items-center gap-1.5 px-3 pb-3 pt-2">
        <span className="text-[8px] font-semibold uppercase tracking-[0.14em] text-white/30">Average</span>
        <div className="flex items-end gap-1 leading-none">
          <span
            className={`bg-gradient-to-r ${g} bg-clip-text text-3xl font-black text-transparent tabular-nums`}
            style={{ backgroundSize: '200% 200%', animation: 'gradient-shift 3s ease infinite' }}
          >
            {score.toFixed(1)}
          </span>
          <span className="mb-0.5 text-[9px] font-medium text-white/30">pts</span>
        </div>
        <div className="flex flex-wrap justify-center gap-1">
          {result.map(([s, c]) => (
            <div key={s} className="flex items-center gap-0.5 rounded-full border border-white/10 bg-white/5 px-2 py-0.5">
              <span className="text-[9px] font-bold text-white/70">{s}</span>
              <span className="text-[8px] text-white/30">×{c}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function CardMockupPage() {
  const [showFront, setShowFront] = useState(true)

  return (
    <div className="min-h-screen bg-background p-10">
      <div className="mb-8 flex items-center gap-4">
        <h1 className="text-2xl font-bold">Result Card Mockup</h1>
        <button
          className="rounded-md border border-border px-3 py-1.5 text-sm transition-colors hover:bg-muted"
          onClick={() => setShowFront(v => !v)}
        >
          Show: {showFront ? 'Front (revealed)' : 'Back (voting)'}
        </button>
      </div>

      <div className="flex flex-wrap gap-8 items-end">
        {showFront ? (
          CASES.map(c => (
            <div key={c.label} className="flex flex-col items-center gap-3">
              <FrontCard badlyPct={c.badlyPct} score={c.score} result={c.result} />
              <span className="text-xs text-muted-foreground text-center">{c.label}</span>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center gap-3">
            <BackCard />
            <span className="text-xs text-muted-foreground">Voting state</span>
          </div>
        )}
      </div>

      <p className="mt-6 text-xs text-muted-foreground">
        Card dimensions: {CARD_W}×{CARD_H}px
      </p>
    </div>
  )
}
