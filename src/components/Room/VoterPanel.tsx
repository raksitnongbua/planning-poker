'use client'
import { faCircle } from '@fortawesome/free-regular-svg-icons'
import { faAnglesLeft, faAnglesRight, faCircleCheck, faGripVertical, faUserPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Member, Status } from './types'

const ARMED_CURSOR =
  `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'>` +
  `<circle cx='16' cy='16' r='11' stroke='%23f97316' stroke-width='1.5' fill='none' opacity='0.9'/>` +
  `<circle cx='16' cy='16' r='4' stroke='%23f97316' stroke-width='1' fill='none' opacity='0.6'/>` +
  `<line x1='16' y1='1' x2='16' y2='9' stroke='%23f97316' stroke-width='1.5' stroke-linecap='round'/>` +
  `<line x1='16' y1='23' x2='16' y2='31' stroke='%23f97316' stroke-width='1.5' stroke-linecap='round'/>` +
  `<line x1='1' y1='16' x2='9' y2='16' stroke='%23f97316' stroke-width='1.5' stroke-linecap='round'/>` +
  `<line x1='23' y1='16' x2='31' y2='16' stroke='%23f97316' stroke-width='1.5' stroke-linecap='round'/>` +
  `<circle cx='16' cy='16' r='1.5' fill='%23f97316'/>` +
  `</svg>") 16 16, crosshair`

interface VoterPanelProps {
  members: Member[]
  sortedMembers: Member[]
  panelWidth: number
  isPanelCollapsed: boolean
  isDraggingPanel: boolean
  myId: string
  isRevealed: boolean
  roomStatus: Status
  now: number
  armedEmoji: string | null
  hoveredMemberId: string | null
  inviteLink: string
  isCopied: boolean
  formatTimeAgo: (ms: number) => string
  onCollapse: () => void
  onExpand: () => void
  onCopy: () => void
  onWidthChange: (width: number) => void
  onDragStart: () => void
  onDragEnd: () => void
  onHoverMember: (id: string | null) => void
  onSetHoveredCardCenter: (center: { x: number; y: number } | null) => void
  onFireAt: (x: number, y: number, memberId: string, context: 'panel') => void
  myCardRef: React.RefObject<HTMLDivElement | null>
}

const VoterPanel = ({
  members,
  sortedMembers,
  panelWidth,
  isPanelCollapsed,
  isDraggingPanel,
  myId,
  isRevealed,
  roomStatus,
  now,
  armedEmoji,
  hoveredMemberId,
  inviteLink,
  isCopied,
  formatTimeAgo,
  onCollapse,
  onExpand,
  onCopy,
  onWidthChange,
  onDragStart,
  onDragEnd,
  onHoverMember,
  onSetHoveredCardCenter,
  onFireAt,
  myCardRef,
}: VoterPanelProps) => {
  return (
    <div
      className={`hidden md:flex fixed right-0 top-[64px] z-20 flex-col border-l border-border/40 bg-background/95 backdrop-blur-md ${!isDraggingPanel ? 'transition-[width] duration-300' : ''} ${isPanelCollapsed ? 'w-10' : panelWidth === 200 ? 'w-[200px]' : ''}`}
      style={{ bottom: '64px', ...(isPanelCollapsed || panelWidth === 200 ? {} : { width: panelWidth }) }}
    >
      {/* Drag-resize handle — visible grip on left edge when expanded */}
      {!isPanelCollapsed && (
        <div
          className="absolute left-0 top-0 bottom-0 w-3 cursor-col-resize z-20 group flex items-center justify-center"
          onMouseDown={(e) => {
            e.preventDefault()
            const startX = e.clientX
            const startWidth = panelWidth
            onDragStart()
            const onMove = (ev: MouseEvent) => {
              const next = Math.min(320, Math.max(160, startWidth + (startX - ev.clientX)))
              onWidthChange(next)
            }
            const onUp = () => {
              onDragEnd()
              document.removeEventListener('mousemove', onMove)
              document.removeEventListener('mouseup', onUp)
            }
            document.addEventListener('mousemove', onMove)
            document.addEventListener('mouseup', onUp)
          }}
        >
          {/* Grip dots — visible on hover */}
          <FontAwesomeIcon
            icon={faGripVertical}
            className="size-2.5 text-border/0 group-hover:text-primary/40 transition-colors duration-150 pointer-events-none"
          />
        </div>
      )}

      {/* Collapsed state — full-strip clickable to expand */}
      {isPanelCollapsed && (() => {
        const me = sortedMembers.find((m) => m.id === myId)
        const myVote = me?.estimatedValue && me.estimatedValue !== '' ? me.estimatedValue : null
        return (
          <button
            onClick={onExpand}
            className="group relative flex flex-col items-center justify-center gap-3 h-full w-full py-4 hover:bg-muted/10 transition-colors"
            aria-label="Expand panel"
          >
            <div className="invisible absolute right-full top-0 mr-1.5 w-52 rounded-xl border border-border/40 bg-background/95 py-2 opacity-0 shadow-xl shadow-black/40 backdrop-blur-md transition-all duration-200 group-hover:visible group-hover:opacity-100 pointer-events-none">
              <p className="mb-1.5 px-3 text-[9px] font-semibold uppercase tracking-widest text-muted-foreground/50">
                Players · {members.length}
              </p>
              <div className="flex flex-col gap-0.5 px-2 max-h-60 overflow-y-auto">
                {sortedMembers.map((member) => {
                  const picked = member.estimatedValue !== ''
                  const msDiff = now - member.lastActiveAt.getTime()
                  const dot =
                    msDiff <= 60_000 ? 'bg-green-500' :
                    msDiff <= 600_000 ? 'bg-orange-400' : 'bg-neutral-500'
                  return (
                    <div key={member.id} className="flex items-center gap-2 rounded-lg px-2 py-1.5">
                      <span className={`size-1.5 flex-shrink-0 rounded-full ${dot}`} />
                      <span className="min-w-0 flex-1 truncate text-[11px] font-medium text-foreground/80">{member.name}</span>
                      {picked && (isRevealed || member.id === myId) ? (
                        <span className={`flex-shrink-0 rounded px-1 text-[10px] font-bold tabular-nums ${isRevealed ? 'bg-primary/20 text-primary' : 'bg-primary/10 text-primary/70'}`}>
                          {member.estimatedValue}
                        </span>
                      ) : picked ? (
                        <span className="flex-shrink-0 text-[9px] text-primary/60">voted</span>
                      ) : (
                        <span className="flex-shrink-0 text-[9px] text-muted-foreground/30">–</span>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
            <FontAwesomeIcon icon={faAnglesLeft} className="size-2.5 text-muted-foreground/40 hover:text-muted-foreground" />
            {myVote ? (
              <>
                <span className={`text-xs font-bold tabular-nums rounded-md px-1.5 py-0.5 ${
                  isRevealed ? 'bg-primary/20 text-primary' : 'bg-primary/10 text-primary/70 ring-1 ring-inset ring-primary/25'
                }`}>
                  {myVote}
                </span>
                <span
                  className="text-[9px] font-semibold uppercase tracking-widest text-primary/50"
                  style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                >
                  My vote
                </span>
              </>
            ) : (
              <>
                <span className="text-sm font-bold tabular-nums text-foreground">{members.length}</span>
                <span
                  className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground/60"
                  style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                >
                  Players
                </span>
              </>
            )}
          </button>
        )
      })()}

      {/* Expanded state */}
      {!isPanelCollapsed && (() => {
        const isCompact = panelWidth < 210
        return (
        <div className={`flex flex-col overflow-hidden h-full ${isCompact ? 'gap-2 p-3' : 'gap-3 p-5'}`}>

          {/* Header */}
          <div className="flex items-center justify-between gap-1 flex-shrink-0">
            <div className="min-w-0">
              {!isCompact && <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">In Room</p>}
              <p className={`font-bold tabular-nums leading-tight ${isCompact ? 'text-sm' : 'text-lg'}`}>
                {members.length}
                <span className={`font-normal text-muted-foreground ${isCompact ? 'text-[10px] ml-1' : 'text-xs ml-1'}`}>players</span>
              </p>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button
                onClick={onCopy}
                className={`flex items-center gap-1 rounded-full border transition-all duration-300 ${
                  isCompact ? 'px-2 py-1 text-[10px]' : 'px-2.5 py-1 text-xs gap-1.5'
                } ${
                  isCopied
                    ? 'border-green-500/60 bg-green-500/10 text-green-400'
                    : 'border-dashed border-primary/50 text-primary/70 hover:border-primary hover:text-primary'
                }`}
              >
                <FontAwesomeIcon icon={isCopied ? faCircleCheck : faUserPlus} className="size-3" />
                {isCopied ? 'Copied!' : 'Invite'}
              </button>
              {/* Collapse button — inside header */}
              <button
                onClick={onCollapse}
                className="flex size-6 flex-shrink-0 items-center justify-center rounded-lg text-muted-foreground/50 transition-colors hover:bg-muted/40 hover:text-foreground"
                aria-label="Collapse panel"
              >
                <FontAwesomeIcon icon={faAnglesRight} className="size-3" />
              </button>
            </div>
          </div>

          {/* Vote progress bar */}
          {roomStatus === Status.Voting && members.length > 0 && (() => {
            const votedCount = members.filter(m => m.estimatedValue !== '').length
            return (
              <div className="flex-shrink-0 space-y-1">
                {!isCompact && (
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{votedCount} voted</span>
                    <span>{members.length - votedCount} waiting</span>
                  </div>
                )}
                <div className="h-1 overflow-hidden rounded-full bg-muted/40">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-500"
                    style={{ width: `${(votedCount / members.length) * 100}%` }}
                  />
                </div>
                {isCompact && (
                  <p className="text-[9px] text-muted-foreground/50 tabular-nums">{votedCount}/{members.length} voted</p>
                )}
              </div>
            )
          })()}

          {/* Player list — scrollable */}
          <div className={`flex flex-col overflow-y-auto flex-1 min-h-0 ${isCompact ? 'gap-1 pr-0.5' : 'gap-1.5 pr-1'}`}>
            {sortedMembers.map((member) => {
              const picked = member.estimatedValue !== ''
              const msDiff = now - member.lastActiveAt.getTime()
              const activeDot =
                msDiff <= 1 * 60_000 ? 'bg-green-500' :
                msDiff <= 10 * 60_000 ? 'bg-orange-400' :
                'bg-neutral-500'
              const activeLabel = formatTimeAgo(msDiff)
              return (
                <div
                  key={member.id}
                  ref={member.id === myId ? myCardRef : undefined}
                  data-panel-member-id={member.id}
                  className={`relative flex items-center rounded-xl border transition-all duration-200 ${
                    isCompact ? 'gap-2 px-2 py-1.5' : 'gap-3 px-3 py-2.5'
                  } ${
                    armedEmoji && hoveredMemberId === member.id
                      ? 'border-orange-400/70 bg-orange-400/10 ring-2 ring-orange-400/30 shadow-md shadow-orange-500/20'
                      : armedEmoji
                      ? 'border-orange-400/25 bg-orange-400/5 hover:border-orange-400/60 hover:bg-orange-400/10'
                      : 'border-border/40 bg-muted/20 hover:border-border/70 hover:bg-muted/40'
                  }`}
                  style={armedEmoji ? { cursor: ARMED_CURSOR } : undefined}
                  onMouseEnter={(e) => {
                    if (!armedEmoji) return
                    const r = e.currentTarget.getBoundingClientRect()
                    onHoverMember(member.id)
                    onSetHoveredCardCenter({ x: r.left + r.width / 2, y: r.top })
                  }}
                  onMouseLeave={() => {
                    onHoverMember(null)
                    onSetHoveredCardCenter(null)
                  }}
                  onClick={(e) => {
                    if (!armedEmoji) return
                    const r = e.currentTarget.getBoundingClientRect()
                    onFireAt(r.left + r.width / 2, r.top + r.height / 2, member.id, 'panel')
                  }}
                >
                  <div className="relative flex-shrink-0">
                    <Avatar className={`ring-1 ring-border ${isCompact ? 'size-6' : 'size-8'}`}>
                      <AvatarImage src={member.avatar ?? '/images/corgi-tood-cute.png'} alt={member.name} />
                      <AvatarFallback className={isCompact ? 'text-[9px]' : 'text-xs'}>{member.name[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className={`absolute rounded-full ring-background ${activeDot} ${isCompact ? '-bottom-px -right-px size-1.5 ring-1' : '-bottom-0.5 -right-0.5 size-2.5 ring-2'}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`truncate font-medium leading-tight ${isCompact ? 'text-xs' : 'text-sm'}`}>{member.name}</p>
                    <p className={`${isCompact ? 'text-[9px] text-muted-foreground/50' : 'text-[10px] text-muted-foreground'}`}>{activeLabel}</p>
                  </div>
                  {picked && (isRevealed || member.id === myId) ? (
                    <span className={`flex-shrink-0 rounded-md text-center font-bold tabular-nums ${
                      isCompact ? 'min-w-[20px] px-1 py-0.5 text-[10px]' : 'min-w-[24px] px-1.5 py-0.5 text-xs'
                    } ${
                      !isRevealed && member.id === myId
                        ? 'bg-primary/10 text-primary/70 ring-1 ring-inset ring-primary/30'
                        : 'bg-primary/20 text-primary'
                    }`}>
                      {member.estimatedValue}
                    </span>
                  ) : picked ? (
                    <FontAwesomeIcon icon={faCircleCheck} className={`flex-shrink-0 text-primary ${isCompact ? 'size-3' : 'size-4'}`} />
                  ) : (
                    <FontAwesomeIcon icon={faCircle} className={`flex-shrink-0 text-muted-foreground/25 ${isCompact ? 'size-3' : 'size-4'}`} />
                  )}
                </div>
              )
            })}
          </div>
        </div>
        )
      })()}
    </div>
  )
}

export default VoterPanel
