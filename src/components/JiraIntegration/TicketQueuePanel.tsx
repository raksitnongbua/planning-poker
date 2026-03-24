'use client'

import type { DragEndEvent } from '@dnd-kit/core'
import {
  closestCenter,
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { restrictToParentElement, restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useEffect, useMemo, useRef, useState } from 'react'

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

import { JiraConnectButton } from './JiraConnectButton'
import { MAX_QUEUE_SIZE } from './constants'
import { getIssueTypeIcon } from './jiraIssueTypeIcon'
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
  onRevoteTicket?: (cleaned: TicketEstimation, cleanedQueue: TicketEstimation[]) => void
  onAdd?: () => void
  onJiraConnected: () => void
  onJiraDisconnected: () => void
  onSaveToJira?: (ticket: TicketEstimation, value: number, fieldId: string) => Promise<void>
  jiraPointOverride?: { key: string; value: number } | null
  onOpenTicketInfo?: (ticket: TicketEstimation) => void
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
  onMoveToTop: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  onRemove: () => void
  onRevote?: () => void
  onSaveToJira?: () => void
  onOpenInfo?: () => void
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
  onMoveToTop,
  onMoveUp,
  onMoveDown,
  onRemove,
  onRevote,
  onSaveToJira,
  onOpenInfo,
}: SortableItemProps) {
  const showSaveToJira =
    !isSpectator &&
    !isOverlay &&
    !!ticket.finalScore &&
    !!ticket.jiraKey &&
    jiraCurrentPoint !== undefined &&
    Number(ticket.finalScore) !== (jiraCurrentPoint ?? 0)
  const isVoted = !!ticket.avgScore || !!ticket.finalScore
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
    disabled: isVoted || isSpectator,
  })

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, height: '100px' }}
      data-active={isActive && !isOverlay ? 'true' : undefined}
      className={cn(
        'group relative flex shrink-0 items-stretch gap-1.5 overflow-hidden px-2.5 select-none',
        isDragging
          ? 'z-10 rounded-lg border border-primary/30 bg-background shadow-lg shadow-black/40'
          : cn('transition-colors border-b border-border/30', isActive ? 'bg-primary/10' : displayIdx % 2 === 0 ? 'bg-muted/[0.06] hover:bg-muted/30' : 'hover:bg-muted/30'),
        !isSpectator && !isVoted ? 'cursor-grab active:cursor-grabbing' : '',
      )}
      {...(!isSpectator ? { ...attributes, ...listeners } : {})}
    >
      {/* Left accent bar */}
      {isActive && !isOverlay && (
        <span className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-r bg-primary" />
      )}
      {!isActive && isVoted && !isOverlay && (
        <span className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-r bg-green-500/50" />
      )}

      {/* Drag handle */}
      <span className={cn(
        'flex shrink-0 items-center justify-center',
        !isSpectator && !isVoted
          ? 'text-muted-foreground/20 transition-colors group-hover:text-muted-foreground/45'
          : 'invisible w-4',
      )}>
        {!isSpectator && !isVoted && (
          <svg className="size-3" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="9" cy="6" r="1.5" /><circle cx="9" cy="12" r="1.5" /><circle cx="9" cy="18" r="1.5" />
            <circle cx="15" cy="6" r="1.5" /><circle cx="15" cy="12" r="1.5" /><circle cx="15" cy="18" r="1.5" />
          </svg>
        )}
      </span>

      {/* Main content */}
      <div className="flex min-w-0 flex-1 flex-col justify-between gap-0.5 overflow-hidden py-2">
        {/* Row 1: key + Jira badge + top-right controls */}
        <div className="flex items-center justify-between gap-1">
          {/* Left: type icon + key + inline Jira badge */}
          <div className="flex min-w-0 shrink items-center gap-1 overflow-hidden">
          {ticket.jiraKey && <span className="[&>svg]:size-3 shrink-0">{getIssueTypeIcon(ticket.jiraType)}</span>}
          {onOpenInfo ? (
            <button
              onClick={(e) => { e.stopPropagation(); onOpenInfo() }}
              className={cn(
                'font-mono text-[10px] font-bold leading-none shrink-0 transition-colors hover:text-primary/80',
                isActive ? 'text-primary' : isVoted ? 'text-green-400/60' : 'text-muted-foreground/50',
              )}
            >
              {ticket.jiraKey}
            </button>
          ) : (
            <span className={cn('font-mono text-[10px] font-bold leading-none shrink-0', isActive ? 'text-primary' : isVoted ? 'text-green-400/60' : 'text-muted-foreground/50')}>
              {ticket.jiraKey ?? `#${displayIdx + 1}`}
            </span>
          )}

          {/* Jira point badge — inline after key; null = Jira has no value (out of sync if voted) */}
          {jiraCurrentPoint !== undefined && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={(e) => { e.stopPropagation(); if (showSaveToJira) onSaveToJira?.() }}
                    disabled={!showSaveToJira || isSaving}
                    className={cn(
                      'flex shrink-0 items-center gap-0.5 rounded px-1 py-0.5 text-[8px] font-semibold tabular-nums transition-colors',
                      showSaveToJira
                        ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 hover:bg-amber-500/25 cursor-pointer'
                        : 'bg-muted/20 text-muted-foreground/35 border border-transparent cursor-default',
                    )}
                  >
                    <JiraIcon className={cn('size-2 shrink-0', showSaveToJira ? 'text-amber-400/80' : 'text-muted-foreground/30')} />
                    {isSaving ? '…' : (jiraCurrentPoint ?? '—')}
                    {showSaveToJira && (
                      <svg className="size-2 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                      </svg>
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  {showSaveToJira
                    ? `Out of sync — Jira: ${jiraCurrentPoint} · Final: ${ticket.finalScore} · Click to save`
                    : `Jira: ${jiraCurrentPoint} sp`}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          </div>{/* end left group */}

          {/* Top-right: action buttons (non-voted) or remove (voted) */}
          <div className="flex shrink-0 items-center gap-1">

            {/* Non-voted action buttons: move up / move down / remove — inline in top-right */}
            {!isSpectator && !isOverlay && !isVoted && (
              <>
                {canMoveUp && (
                  <>
                    <button
                      onClick={(e) => { e.stopPropagation(); onMoveToTop() }}
                      className="flex size-5 items-center justify-center rounded text-muted-foreground/40 opacity-0 transition-all hover:bg-muted/40 hover:text-foreground group-hover:opacity-100"
                      aria-label="Move to top"
                      title="Move to top"
                    >
                      <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 11l7-7 7 7M5 19l7-7 7 7" />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); onMoveUp() }}
                      className="flex size-5 items-center justify-center rounded text-muted-foreground/40 opacity-0 transition-all hover:bg-muted/40 hover:text-foreground group-hover:opacity-100"
                      aria-label="Move up"
                      title="Move up"
                    >
                      <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                      </svg>
                    </button>
                  </>
                )}
                <button
                  onClick={(e) => { e.stopPropagation(); onMoveDown() }}
                  className="flex size-5 items-center justify-center rounded text-muted-foreground/40 opacity-0 transition-all hover:bg-muted/40 hover:text-foreground group-hover:opacity-100"
                  aria-label="Move down"
                  title="Move down"
                >
                  <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onRemove() }}
                  className="flex size-5 items-center justify-center rounded text-muted-foreground/30 opacity-0 transition-all hover:bg-red-500/10 hover:text-red-400 group-hover:opacity-100"
                  aria-label="Remove ticket"
                  title="Remove"
                >
                  <svg className="size-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </>
            )}

            {/* Voted ticket: re-vote + remove buttons */}
            {!isSpectator && !isOverlay && isVoted && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); onRevote?.() }}
                  className="flex size-5 items-center justify-center rounded text-muted-foreground/30 opacity-0 transition-all hover:bg-muted/40 hover:text-foreground group-hover:opacity-100"
                  aria-label="Re-vote"
                  title="Re-vote"
                >
                  <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onRemove() }}
                  className="flex size-5 items-center justify-center rounded text-muted-foreground/30 opacity-0 transition-all hover:bg-red-500/10 hover:text-red-400 group-hover:opacity-100"
                  aria-label="Remove ticket"
                  title="Remove"
                >
                  <svg className="size-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Row 2: ticket name */}
        <div className="flex-1 min-h-0 overflow-hidden">
          {onOpenInfo ? (
            <button
              onClick={(e) => { e.stopPropagation(); onOpenInfo() }}
              className={cn('text-left w-full line-clamp-3 text-[11px] leading-snug transition-colors hover:text-foreground', isActive ? 'text-foreground' : isVoted ? 'text-muted-foreground/50' : 'text-muted-foreground')}
            >
              {ticket.name}
            </button>
          ) : (
            <span className={cn('line-clamp-3 text-[11px] leading-snug', isActive ? 'text-foreground' : isVoted ? 'text-muted-foreground/50' : 'text-muted-foreground')}>
              {ticket.name}
            </span>
          )}
        </div>

        {/* Row 3: voted scores or more-detail button */}
        {isVoted ? (
          <div className="flex items-center gap-1">
            <svg className="size-2 shrink-0 text-green-500/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            {ticket.avgScore !== undefined && (
              <span className="rounded bg-muted/40 px-1 py-0.5 text-[9px] font-semibold tabular-nums text-muted-foreground/50">
                avg {ticket.avgScore}
              </span>
            )}
            {ticket.avgScore !== undefined && ticket.finalScore && (
              <span className="text-[9px] text-muted-foreground/30">·</span>
            )}
            {ticket.finalScore && (
              <span className="rounded border border-green-500/25 bg-green-500/15 px-1.5 py-0.5 text-[9px] font-bold tabular-nums text-green-400">
                {ticket.finalScore}
              </span>
            )}
          </div>
        ) : null}
      </div>

    </div>
  )
}

export function TicketQueuePanel({
  queue, activeKey, panelWidth, isCollapsed, isDragging,
  isJiraConnected = false, isSpectator = false, roomId,
  onCollapse, onWidthChange, onDragStart, onDragEnd,
  onSelectTicket, onQueueChange, onRevoteTicket, onAdd, onJiraConnected, onJiraDisconnected,
  onSaveToJira, jiraPointOverride, onOpenTicketInfo,
}: Props) {
  const [hideVoted, setHideVoted] = useState(false)
  const [jiraPoints, setJiraPoints] = useState<Map<string, number | null>>(new Map())
  const [savingKey, setSavingKey] = useState<string | null>(null)
  const [confirmClear, setConfirmClear] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const jiraFetchKey = queue.filter(t => t.jiraKey).map(t => t.jiraKey).join(',')

  useEffect(() => {
    if (isCollapsed) return
    const el = scrollContainerRef.current?.querySelector<HTMLElement>('[data-active="true"]')
    el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [activeKey, isCollapsed])

  useEffect(() => {
    if (!jiraPointOverride) return
    setJiraPoints(prev => new Map(prev).set(jiraPointOverride.key, jiraPointOverride.value))
  }, [jiraPointOverride])

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

  const sortableIds = visibleIndices.filter(({ t }) => !isVotedTicket(t)).map(({ idx }) => String(idx))
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

  function moveToTop(idx: number) {
    if (idx === 0) return
    const firstUnvotedIdx = queue.findIndex(t => !isVotedTicket(t))
    if (idx === firstUnvotedIdx) return
    const next = [...queue]
    const [item] = next.splice(idx, 1)
    next.splice(firstUnvotedIdx, 0, item)
    onQueueChange(next)
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

  function revote(idx: number) {
    const ticket = queue[idx]
    const cleaned = { ...ticket, avgScore: undefined, finalScore: undefined }
    const withoutTicket = queue.filter((_, i) => i !== idx)
    const firstUnvotedIdx = withoutTicket.findIndex(t => !isVotedTicket(t))
    const insertAt = firstUnvotedIdx === -1 ? 0 : firstUnvotedIdx
    const next = [...withoutTicket]
    next.splice(insertAt, 0, cleaned)
    if (onRevoteTicket) {
      onRevoteTicket(cleaned, next)
    } else {
      onQueueChange(next)
      onSelectTicket(cleaned)
    }
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
                  <span className={cn(
                    'tabular-nums text-[10px] font-bold',
                    queue.length >= MAX_QUEUE_SIZE ? 'text-red-400' : queue.length >= 180 ? 'text-amber-400' : 'text-primary/70',
                  )}>
                    {queue.length >= 180 ? `${queue.length}/${MAX_QUEUE_SIZE}` : queue.length}
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
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span>
                          <button
                            onClick={queue.length < MAX_QUEUE_SIZE ? onAdd : undefined}
                            disabled={queue.length >= MAX_QUEUE_SIZE}
                            className={cn(
                              'flex size-6 shrink-0 items-center justify-center rounded-md transition-colors',
                              queue.length >= MAX_QUEUE_SIZE
                                ? 'cursor-not-allowed text-muted-foreground/20'
                                : 'text-muted-foreground/40 hover:bg-primary/10 hover:text-primary',
                            )}
                            aria-label="Add tickets"
                          >
                            <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                          </button>
                        </span>
                      </TooltipTrigger>
                      {queue.length >= MAX_QUEUE_SIZE && (
                        <TooltipContent>Queue full ({MAX_QUEUE_SIZE}/{MAX_QUEUE_SIZE}) — remove tickets first</TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>
                )}
                {!isSpectator && (
                  <button
                    onClick={() => setConfirmClear(true)}
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

            {/* Confirm clear bar */}
            {confirmClear && (
              <div className="flex items-center justify-between gap-2 border-t border-border/40 bg-red-500/5 px-3 py-2">
                <span className="text-[10px] font-medium text-red-400/80">Clear all tickets?</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => { onQueueChange([]); setConfirmClear(false) }}
                    className="rounded px-2 py-0.5 text-[10px] font-semibold text-red-400 transition-colors hover:bg-red-500/20"
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setConfirmClear(false)}
                    className="rounded px-2 py-0.5 text-[10px] font-semibold text-muted-foreground/60 transition-colors hover:bg-muted/40 hover:text-foreground"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Jira integration row */}
            <div className="flex items-center justify-between gap-2 border-t border-border/30 px-3 py-2">
              <span className="text-[10px] font-semibold tracking-wide text-muted-foreground/40">Integration</span>
              <JiraConnectButton
                isConnected={isJiraConnected}
                roomId={roomId}
                onConnected={onJiraConnected}
                onDisconnected={onJiraDisconnected}
              />
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
              </div>
            )}

            {queue.length > 0 && (
              <>
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  modifiers={[restrictToVerticalAxis, restrictToParentElement]}
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
                          onMoveToTop={() => moveToTop(idx)}
                          onMoveUp={() => moveUp(idx)}
                          onMoveDown={() => moveDown(idx)}
                          onRemove={() => remove(idx)}
                          onRevote={isVotedTicket(t) && !isSpectator ? () => revote(idx) : undefined}
                          onSaveToJira={onSaveToJira && t.jiraKey && t.storyPointsField ? () => saveToJira(t) : undefined}
                          onOpenInfo={t.jiraKey ? () => onOpenTicketInfo?.(t) : undefined}
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
