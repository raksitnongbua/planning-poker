'use client'

import type { DragEndEvent } from '@dnd-kit/core'
import {
  closestCenter,
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useEffect, useMemo, useRef, useState } from 'react'

import { cn } from '@/lib/utils'

import { JiraConnectButton } from './JiraConnectButton'
import type { TicketEstimation } from './types'

interface Props {
  queue: TicketEstimation[]
  activeKey?: string | null
  panelWidth: number
  isCollapsed: boolean
  isDragging: boolean
  isJiraConnected?: boolean
  isSpectator?: boolean
  roomId: string
  onCollapse: (collapsed: boolean) => void
  onWidthChange: (width: number) => void
  onDragStart: () => void
  onDragEnd: () => void
  onSelectTicket: (t: TicketEstimation) => void
  onQueueChange: (queue: TicketEstimation[]) => void
  onAdd?: () => void
  onJiraConnected: () => void
  onJiraDisconnected: () => void
  onSaveToJira?: (ticket: TicketEstimation, value: number, fieldId: string) => Promise<void>
}

function JiraIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M11.53 2c0 2.4 1.97 4.35 4.35 4.35h1.78v1.7c0 2.4 1.95 4.34 4.34 4.35V2.84a.84.84 0 0 0-.84-.84zM6.77 6.8c0 2.4 1.96 4.34 4.35 4.34h1.78v1.71c0 2.4 1.95 4.34 4.35 4.35V7.63a.84.84 0 0 0-.84-.83zM2 11.6c0 2.4 1.95 4.34 4.35 4.34h1.78v1.71A4.35 4.35 0 0 0 12.48 22v-9.57a.84.84 0 0 0-.84-.83z" />
    </svg>
  )
}

interface SortableItemProps {
  id: string
  ticket: TicketEstimation
  displayIdx: number
  isActive: boolean
  isSpectator: boolean
  isOverlay?: boolean
  canMoveUp: boolean
  jiraCurrentPoint?: number | null
  isSaving?: boolean
  onSelect: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  onRemove: () => void
  onSaveToJira?: () => void
}

function SortableTicketItem({
  id,
  ticket,
  displayIdx,
  isActive,
  isSpectator,
  isOverlay = false,
  canMoveUp,
  jiraCurrentPoint,
  isSaving,
  onSelect,
  onMoveUp,
  onMoveDown,
  onRemove,
  onSaveToJira,
}: SortableItemProps) {
  const showSaveToJira =
    !isSpectator &&
    !isOverlay &&
    !!ticket.finalScore &&
    !!ticket.jiraKey &&
    jiraCurrentPoint !== undefined &&
    Number(ticket.finalScore) !== jiraCurrentPoint
  const isVoted = !!ticket.avgScore || !!ticket.finalScore
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
    disabled: isVoted || isSpectator,
  })

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      data-active={isActive && !isOverlay ? 'true' : undefined}
      className={cn(
        'group relative flex items-center gap-1.5 px-2.5 py-2 select-none',
        isDragging
          ? 'rounded-lg border border-dashed border-border/40 bg-muted/10 [&>*]:invisible'
          : cn(
              'transition-colors',
              isActive ? 'bg-primary/10' : 'hover:bg-muted/30',
            ),
        !isSpectator && !isVoted ? 'cursor-grab active:cursor-grabbing' : '',
      )}
      {...(!isSpectator ? { ...attributes, ...listeners } : {})}
    >
      {isActive && !isOverlay && (
        <span className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-r bg-primary" />
      )}
      {!isActive && (!!ticket.avgScore || !!ticket.finalScore) && !isOverlay && (
        <span className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-r bg-green-500/50" />
      )}

      {/* Drag handle — only for non-voted, non-spectator */}
      {!isSpectator && !isVoted && (
        <span className="flex size-4 shrink-0 items-center justify-center text-muted-foreground/20 transition-colors group-hover:text-muted-foreground/45">
          <svg className="size-3" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="9" cy="6" r="1.5" /><circle cx="9" cy="12" r="1.5" /><circle cx="9" cy="18" r="1.5" />
            <circle cx="15" cy="6" r="1.5" /><circle cx="15" cy="12" r="1.5" /><circle cx="15" cy="18" r="1.5" />
          </svg>
        </span>
      )}
      {(!isSpectator && isVoted) && <span className="size-4 shrink-0" />}

      {/* Ticket text */}
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div className="flex items-center gap-1.5">
          <span className={cn('font-mono text-[10px] font-bold leading-none', isActive ? 'text-primary' : (!!ticket.avgScore || !!ticket.finalScore) ? 'text-green-400/60' : 'text-muted-foreground/50')}>
            {ticket.jiraKey ?? `#${displayIdx + 1}`}
          </span>
          {jiraCurrentPoint !== undefined && jiraCurrentPoint !== null && (
            <span className="tabular-nums text-[8px] font-semibold text-muted-foreground/35">
              {jiraCurrentPoint}sp
            </span>
          )}
        </div>
        <span className={cn('line-clamp-2 text-[11px] leading-snug', isActive ? 'text-foreground' : (!!ticket.avgScore || !!ticket.finalScore) ? 'text-muted-foreground/50' : 'text-muted-foreground')}>
          {ticket.name}
        </span>
        {(!!ticket.avgScore || !!ticket.finalScore) && (
          <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
            <svg className="size-2.5 shrink-0 text-green-500/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            {ticket.avgScore !== undefined && (
              <span className="text-[9px] text-muted-foreground/40">
                avg <span className="font-bold text-muted-foreground/60">{ticket.avgScore}</span>
              </span>
            )}
            {ticket.finalScore && (
              <span className="text-[9px] text-green-400/70">
                final <span className="font-bold">{ticket.finalScore}</span>
              </span>
            )}
            {showSaveToJira && (
              <button
                onClick={(e) => { e.stopPropagation(); onSaveToJira?.() }}
                disabled={isSaving}
                className="flex items-center gap-0.5 rounded px-1 py-0.5 text-[8px] font-semibold text-amber-400/80 bg-amber-500/10 hover:bg-amber-500/20 hover:text-amber-300 transition-colors disabled:opacity-40"
                title={jiraCurrentPoint === null ? `Jira: (none) → ${ticket.finalScore}` : `Jira: ${jiraCurrentPoint} → ${ticket.finalScore}`}
              >
                <svg className="size-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                {isSaving ? '…' : 'Save to Jira'}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Action buttons — appear on hover */}
      {!isSpectator && !isOverlay && (
        <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
          {/* Move up */}
          {canMoveUp && !isVoted && (
            <button
              onClick={(e) => { e.stopPropagation(); onMoveUp() }}
              className="flex size-5 items-center justify-center rounded text-muted-foreground/40 transition-colors hover:bg-muted/40 hover:text-foreground"
              aria-label="Move up"
              title="Move up"
            >
              <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
              </svg>
            </button>
          )}
          {/* Move down */}
          {!isVoted && (
            <button
              onClick={(e) => { e.stopPropagation(); onMoveDown() }}
              className="flex size-5 items-center justify-center rounded text-muted-foreground/40 transition-colors hover:bg-muted/40 hover:text-foreground"
              aria-label="Move down"
              title="Move down"
            >
              <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          )}
          {/* Remove */}
          <button
            onClick={(e) => { e.stopPropagation(); onRemove() }}
            className="flex size-5 items-center justify-center rounded text-muted-foreground/30 transition-colors hover:bg-red-500/10 hover:text-red-400"
            aria-label="Remove ticket"
            title="Remove"
          >
            <svg className="size-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}

export function TicketQueuePanel({
  queue, activeKey, panelWidth, isCollapsed, isDragging,
  isJiraConnected = false, isSpectator = false, roomId,
  onCollapse, onWidthChange, onDragStart, onDragEnd,
  onSelectTicket, onQueueChange, onAdd, onJiraConnected, onJiraDisconnected,
  onSaveToJira,
}: Props) {
  const [hideVoted, setHideVoted] = useState(false)
  const [jiraPoints, setJiraPoints] = useState<Map<string, number | null>>(new Map())
  const [savingKey, setSavingKey] = useState<string | null>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const jiraFetchKey = queue.filter(t => t.jiraKey).map(t => t.jiraKey).join(',')

  useEffect(() => {
    if (isCollapsed) return
    const el = scrollContainerRef.current?.querySelector<HTMLElement>('[data-active="true"]')
    el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [activeKey, isCollapsed])

  useEffect(() => {
    if (!isJiraConnected || !jiraFetchKey) return
    const fetchable = queue.filter(t => t.jiraKey && t.jiraCloudId && t.storyPointsField)
    if (fetchable.length === 0) return
    Promise.all(
      fetchable.map(async t => {
        try {
          const res = await fetch(`/api/jira/issues/${t.jiraKey}/estimate?cloudId=${t.jiraCloudId}&fieldId=${t.storyPointsField}`)
          if (!res.ok) return [t.jiraKey!, undefined] as const
          const data = await res.json()
          return [t.jiraKey!, data.value as number | null] as const
        } catch {
          return [t.jiraKey!, undefined] as const
        }
      })
    ).then(results => {
      setJiraPoints(new Map(results.filter(([, v]) => v !== undefined) as [string, number | null][]))
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isJiraConnected, jiraFetchKey])

  async function saveToJira(ticket: TicketEstimation) {
    const key = ticket.jiraKey!
    setSavingKey(key)
    try {
      await onSaveToJira!(ticket, Number(ticket.finalScore), ticket.storyPointsField!)
      setJiraPoints(prev => new Map(prev).set(key, Number(ticket.finalScore)))
    } catch {
      // leave button visible so user can retry
    } finally {
      setSavingKey(null)
    }
  }

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  )

  const isVotedTicket = (t: TicketEstimation) => !!t.avgScore || !!t.finalScore

  const visibleIndices = useMemo(
    () => queue.map((t, idx) => ({ t, idx })).filter(({ t }) => !hideVoted || !isVotedTicket(t)),
    [queue, hideVoted],
  )

  const sortableIds = visibleIndices.map(({ idx }) => String(idx))
  const votedCount = queue.filter(isVotedTicket).length

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = parseInt(String(active.id))
    const newIndex = parseInt(String(over.id))
    // Prevent dragging above a voted ticket
    if (newIndex < oldIndex && queue.slice(newIndex, oldIndex).some(isVotedTicket)) return
    onQueueChange(arrayMove(queue, oldIndex, newIndex))
  }

  function remove(idx: number) {
    onQueueChange(queue.filter((_, i) => i !== idx))
  }

  function moveUp(idx: number) {
    if (idx === 0) return
    if (isVotedTicket(queue[idx - 1])) return
    const next = [...queue]
    ;[next[idx - 1], next[idx]] = [next[idx], next[idx - 1]]
    onQueueChange(next)
  }

  function moveDown(idx: number) {
    if (idx === queue.length - 1) return
    const next = [...queue]
    ;[next[idx], next[idx + 1]] = [next[idx + 1], next[idx]]
    onQueueChange(next)
  }

  return (
    <div
      className={cn(
        'fixed left-0 top-[64px] z-20 hidden flex-col border-r border-border/40 bg-background/95 backdrop-blur-md md:flex',
        !isDragging ? 'transition-[width] duration-300' : '',
        isCollapsed ? 'w-10' : panelWidth === 240 ? 'w-[240px]' : '',
      )}
      style={{ bottom: '40px', ...(!isCollapsed && panelWidth !== 240 ? { width: panelWidth } : {}) }}
    >
      {/* Drag-resize handle — right edge, only when expanded and not spectator */}
      {!isCollapsed && !isSpectator && (
        <div
          className="absolute right-0 top-0 bottom-0 w-3 cursor-col-resize z-20 group flex items-center justify-center"
          onMouseDown={(e) => {
            e.preventDefault()
            const startX = e.clientX
            const startWidth = panelWidth
            onDragStart()
            const onMove = (ev: MouseEvent) => {
              const next = Math.min(320, Math.max(160, startWidth + (ev.clientX - startX)))
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
          <svg className="size-2.5 text-border/0 group-hover:text-primary/40 transition-colors duration-150 pointer-events-none" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="9" cy="6" r="1.5"/><circle cx="9" cy="12" r="1.5"/><circle cx="9" cy="18" r="1.5"/>
            <circle cx="15" cy="6" r="1.5"/><circle cx="15" cy="12" r="1.5"/><circle cx="15" cy="18" r="1.5"/>
          </svg>
        </div>
      )}

      {/* Collapsed state — full-strip clickable */}
      {isCollapsed && (
        <button
          onClick={() => onCollapse(false)}
          className="group relative flex flex-col items-center justify-center gap-3 h-full w-full py-4 hover:bg-muted/10 transition-colors"
          aria-label="Expand queue"
        >
          {/* Hover preview */}
          <div className="invisible absolute left-full top-0 ml-1.5 w-52 rounded-xl border border-border/40 bg-background/95 py-2 opacity-0 shadow-xl shadow-black/40 backdrop-blur-md transition-all duration-200 group-hover:visible group-hover:opacity-100 pointer-events-none">
            <p className="mb-1.5 px-3 text-[9px] font-semibold uppercase tracking-widest text-muted-foreground/50">
              To Estimate · {queue.length}
            </p>
            <div className="flex flex-col gap-0.5 px-2 max-h-60 overflow-y-auto">
              {queue.length === 0 && (
                <p className="px-2 py-1 text-[10px] text-muted-foreground/40">No tickets in queue</p>
              )}
              {queue.map((t, i) => {
                const isActive = t.jiraKey ? t.jiraKey === activeKey : t.name === activeKey
                return (
                  <div key={i} className="flex items-center gap-2 rounded-lg px-2 py-1.5">
                    {(!!t.avgScore || !!t.finalScore) ? (
                      <svg className="size-2.5 shrink-0 text-green-500/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <JiraIcon className={cn('size-2.5 shrink-0', isActive ? 'text-blue-400' : 'text-muted-foreground/40')} />
                    )}
                    <span className={cn('min-w-0 flex-1 truncate text-[11px] font-medium', (!!t.avgScore || !!t.finalScore) ? 'text-foreground/50' : 'text-foreground/80')}>{t.jiraKey ?? `#${i + 1}`}</span>
                    {(!!t.avgScore || !!t.finalScore) && t.finalScore && (
                      <span className="flex-shrink-0 text-[9px] font-bold text-green-400/70">{t.finalScore}</span>
                    )}
                    {isActive && !(!!t.avgScore || !!t.finalScore) && <span className="flex-shrink-0 size-1.5 rounded-full bg-primary" />}
                  </div>
                )
              })}
            </div>
          </div>
          <svg className="size-2.5 text-muted-foreground/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          <span className="flex size-5 items-center justify-center rounded-full bg-primary/20 text-[9px] font-bold tabular-nums text-primary">
            {queue.length}
          </span>
          <span
            className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground/60"
            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
          >
            Backlog
          </span>
        </button>
      )}

      {/* Expanded state */}
      {!isCollapsed && (
        <div className="flex flex-1 flex-col overflow-hidden gap-0">
          {/* Header */}
          <div className="shrink-0 border-b border-border/40">
            {/* Top accent line */}
            <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
            <div className="flex items-center justify-between gap-1 px-3 pb-2.5 pt-4">
              <div className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden">
                <div className="flex size-5 shrink-0 items-center justify-center rounded bg-primary/15">
                  <svg className="size-3 text-primary/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div className="flex min-w-0 items-baseline gap-1.5">
                  <span className="text-[11px] font-semibold tracking-wide text-foreground/80">To Estimate</span>
                  <span className="tabular-nums text-[10px] font-bold text-primary/70">
                    {queue.length}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-0.5">
                {!isSpectator && votedCount > 0 && (
                  <button
                    onClick={() => setHideVoted((v) => !v)}
                    className={cn(
                      'flex size-6 shrink-0 items-center justify-center rounded-md transition-colors',
                      hideVoted
                        ? 'text-primary/70 hover:bg-primary/10 hover:text-primary'
                        : 'text-muted-foreground/40 hover:bg-muted/40 hover:text-foreground',
                    )}
                    aria-label={hideVoted ? 'Show voted tickets' : 'Hide voted tickets'}
                    title={hideVoted ? `Show voted (${votedCount})` : `Hide voted (${votedCount})`}
                  >
                    {hideVoted ? (
                      <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                )}
                {!isSpectator && onAdd && (
                  <button
                    onClick={onAdd}
                    className="flex size-6 shrink-0 items-center justify-center rounded-md text-muted-foreground/40 transition-colors hover:bg-primary/10 hover:text-primary"
                    aria-label="Add tickets"
                    title="Add tickets"
                  >
                    <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                )}
                {!isSpectator && (
                  <button
                    onClick={() => onQueueChange([])}
                    className="flex size-6 shrink-0 items-center justify-center rounded-md text-muted-foreground/30 transition-colors hover:bg-red-500/10 hover:text-red-400"
                    aria-label="Clear all tickets"
                    title="Clear all"
                  >
                    <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
                <button
                  onClick={() => onCollapse(true)}
                  className="flex size-6 shrink-0 items-center justify-center rounded-md text-muted-foreground/40 transition-colors hover:bg-muted/40 hover:text-foreground"
                  aria-label="Collapse panel"
                >
                  <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Queue list — scrollable */}
          <div ref={scrollContainerRef} className="flex min-h-0 flex-1 flex-col overflow-y-auto py-1">
            {queue.length === 0 && (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 px-4 py-6 text-center">
                <svg className="size-8 text-muted-foreground/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span className="text-[10px] leading-snug text-muted-foreground/40">No tasks queued for estimation</span>
                {!isSpectator && onAdd && (
                  <button
                    onClick={onAdd}
                    className="flex items-center gap-1.5 rounded-lg border border-dashed border-primary/40 px-3 py-1.5 text-[11px] font-medium text-primary/70 transition-all hover:border-primary/70 hover:bg-primary/5 hover:text-primary"
                  >
                    <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    Add tickets
                  </button>
                )}
                {!isSpectator && !isJiraConnected && (
                  <JiraConnectButton
                    isConnected={false}
                    roomId={roomId}
                    onConnected={onJiraConnected}
                    onDisconnected={onJiraDisconnected}
                  />
                )}
              </div>
            )}

            {queue.length > 0 && (
              <>
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext items={sortableIds} strategy={verticalListSortingStrategy}>
                    {visibleIndices.map(({ t, idx }) => {
                      const isActive = t.jiraKey ? t.jiraKey === activeKey : t.name === activeKey
                      const canMoveUp = idx > 0 && !isVotedTicket(queue[idx - 1])
                      const jiraCurrentPoint = t.jiraKey ? jiraPoints.get(t.jiraKey) : undefined
                      return (
                        <SortableTicketItem
                          key={`${t.jiraKey ?? t.name}-${idx}`}
                          id={String(idx)}
                          ticket={t}
                          displayIdx={idx}
                          isActive={isActive}
                          isSpectator={isSpectator}
                          canMoveUp={canMoveUp}
                          jiraCurrentPoint={jiraCurrentPoint}
                          isSaving={savingKey === (t.jiraKey ?? t.name)}
                          onSelect={() => onSelectTicket(t)}
                          onMoveUp={() => moveUp(idx)}
                          onMoveDown={() => moveDown(idx)}
                          onRemove={() => remove(idx)}
                          onSaveToJira={onSaveToJira && t.jiraKey && t.storyPointsField ? () => saveToJira(t) : undefined}
                        />
                      )
                    })}
                  </SortableContext>
                </DndContext>
                {hideVoted && votedCount > 0 && (
                  <div className="px-3 py-1.5">
                    <button
                      onClick={() => setHideVoted(false)}
                      className="text-[9px] text-muted-foreground/40 transition-colors hover:text-muted-foreground/70"
                    >
                      {votedCount} voted hidden — show
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
