import React from 'react'

import type { TicketEstimation } from '@/components/JiraIntegration'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import PokerCard from '../PokerCard'
import { Member } from '../Room/types'

export interface TableProps {
  name: string
  members: Member[]
  isRevealed?: boolean
  ticketEstimation?: TicketEstimation | null
  bottomSlot?: React.ReactNode
}

// ─── Geometry ────────────────────────────────────────────────────────────────
const W = 600
const H = 212
const OFFSET = 60
const hw = W / 2 + OFFSET   // 360
const hh = H / 2 + OFFSET   // 166
const R = 76

interface SeatInfo {
  x: number
  y: number
  normalAngle: number
}

function buildSeats(n: number): SeatInfo[] {
  const sh = hw - R
  const sv = hh - R
  const arc = (Math.PI / 2) * R

  type SegFn = (t: number) => { x: number; y: number; nx: number; ny: number }

  const segs: { len: number; fn: SegFn }[] = [
    { len: sh,    fn: t => ({ x: t,          y: -hh,       nx: 0,  ny: -1 }) },
    { len: arc,   fn: t => { const a = -Math.PI / 2 + t / R; return { x: hw - R + R * Math.cos(a), y: -hh + R + R * Math.sin(a), nx: Math.cos(a), ny: Math.sin(a) } } },
    { len: 2*sv,  fn: t => ({ x: hw,         y: -hh+R+t,   nx: 1,  ny: 0  }) },
    { len: arc,   fn: t => { const a = t / R;               return { x: hw - R + R * Math.cos(a), y:  hh - R + R * Math.sin(a), nx: Math.cos(a), ny: Math.sin(a) } } },
    { len: 2*sh,  fn: t => ({ x: hw-R-t,     y:  hh,       nx: 0,  ny: 1  }) },
    { len: arc,   fn: t => { const a = Math.PI / 2 + t / R; return { x: -hw + R + R * Math.cos(a), y: hh - R + R * Math.sin(a), nx: Math.cos(a), ny: Math.sin(a) } } },
    { len: 2*sv,  fn: t => ({ x: -hw,        y:  hh-R-t,   nx: -1, ny: 0  }) },
    { len: arc,   fn: t => { const a = Math.PI + t / R;     return { x: -hw + R + R * Math.cos(a), y: -hh + R + R * Math.sin(a), nx: Math.cos(a), ny: Math.sin(a) } } },
    { len: sh,    fn: t => ({ x: -hw+R+t,    y: -hh,       nx: 0,  ny: -1 }) },
  ]

  const perim = segs.reduce((s, seg) => s + seg.len, 0)

  return Array.from({ length: n }, (_, i) => {
    let s = (perim / n) * i
    for (const seg of segs) {
      if (s <= seg.len) {
        const { x, y, nx, ny } = seg.fn(s)
        return { x, y, normalAngle: Math.atan2(ny, nx) }
      }
      s -= seg.len
    }
    return { x: 0, y: -hh, normalAngle: -Math.PI / 2 }
  })
}

// ─── SeatAvatar ───────────────────────────────────────────────────────────────
const AVATAR_R = 24
const NAME_H = 16
const CARD_OFFSET = OFFSET + 14
const CARD_SCALE = 0.55
const CARD_W = Math.round(80 * CARD_SCALE)
const CARD_H = Math.round(120 * CARD_SCALE)

const SeatAvatar = ({ member, normalAngle, isRevealed }: { member: Member; normalAngle: number; isRevealed?: boolean }) => {
  const hasVoted = member.estimatedValue !== ''
  const inwardAngle = normalAngle + Math.PI
  const rotateDeg = ((inwardAngle + Math.PI / 2) * 180) / Math.PI

  const cardX = CARD_OFFSET * Math.cos(inwardAngle)
  const cardY = CARD_OFFSET * Math.sin(inwardAngle)

  const nameAbove = Math.sin(normalAngle) < -0.3
  const avatarCenterY = nameAbove ? NAME_H + AVATAR_R : AVATAR_R

  const name = (
    <span title={member.name} className="max-w-[72px] truncate rounded-full border border-border/40 bg-background/80 px-2 py-0.5 text-center text-[10px] font-medium leading-tight text-foreground/80 backdrop-blur-sm shadow-sm">
      {member.name}
    </span>
  )

  return (
    <div className="relative flex flex-col items-center gap-0.5">
      {nameAbove && name}
      <Avatar className={`size-12 ring-2 transition-all duration-300 ${hasVoted ? 'ring-primary/60' : 'ring-border/40'}`}>
        <AvatarImage src={member.avatar ?? '/images/corgi-tood-cute.png'} alt={member.name} />
        <AvatarFallback className="text-xs">{member.name[0].toUpperCase()}</AvatarFallback>
      </Avatar>
      {!nameAbove && name}

      {hasVoted && (
        <div
          className="absolute animate-in fade-in duration-300 pointer-events-none"
          style={{
            left: `calc(50% + ${cardX}px)`,
            top: `${avatarCenterY + cardY}px`,
            transform: `translate(-50%, -50%) rotate(${rotateDeg}deg)`,
          }}
        >
          <div style={{ width: CARD_W, height: CARD_H, overflow: 'hidden' }}>
            <div style={{ transform: `scale(${CARD_SCALE})`, transformOrigin: 'top left' }}>
              <PokerCard label={member.estimatedValue} value={member.estimatedValue} isRevealed={!!isRevealed} isChosen={false} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Table ────────────────────────────────────────────────────────────────────
const Table = ({ members, isRevealed, bottomSlot }: TableProps) => {
  const seats = buildSeats(members.length)

  return (
    <div className="relative flex h-[212px] w-[600px] items-center justify-center rounded-[76px] border border-border bg-gradient-to-b from-muted/30 to-muted/10">
      <div className="pointer-events-none absolute inset-[7px] rounded-[69px] border border-border/30" />

      {/* Center — ticket controls or empty */}
      {bottomSlot && (
        <div className="relative z-10 flex max-w-[400px] flex-col items-center gap-2 px-6 text-center">
          {bottomSlot}
        </div>
      )}

      {/* Seat avatars */}
      {members.map((member, i) => {
        const { x, y, normalAngle } = seats[i]
        return (
          <div
            key={member.id}
            data-table-member-id={member.id}
            className="absolute z-10"
            style={{
              left: `${W / 2 + x}px`,
              top:  `${H / 2 + y}px`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <SeatAvatar member={member} normalAngle={normalAngle} isRevealed={isRevealed} />
          </div>
        )
      })}
    </div>
  )
}

export default Table
