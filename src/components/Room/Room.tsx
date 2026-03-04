'use client'
import { faChair, faCircleCheck, faCommentDots, faEye, faPaperPlane, faUserPlus } from '@fortawesome/free-solid-svg-icons'
import { faCircle } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect, useMemo, useState } from 'react'
import useWebSocket, { ReadyState } from 'react-use-websocket'

import { useToast } from '@/components/ui/use-toast'
import { useLoadingStore, useUserInfoStore } from '@/store/zustand'

import { ThrowOverlay, ThrowPanel, useThrowLauncher } from '../ThrowLauncher'
import Dialog from '../common/Dialog'
import JoinRoomDialog from '../JoinRoomDialog'
import RoomCards from '../RoomCards'
import RoomTable from '../RoomTable'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'
import { ChatMessage, Member, Props, Status } from './types'

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

const Room = ({ roomId, sessionId, avatar, userName }: Props) => {
  const { uid } = useUserInfoStore()
  const id = sessionId ?? uid

  const socketUrl = `${process.env.NEXT_PUBLIC_WS_ENDPOINT}/room/${id}/${roomId}`
  const { sendJsonMessage, lastMessage, readyState } = useWebSocket(socketUrl, {
    shouldReconnect: (_closeEvent) => true,
    reconnectAttempts: 5,
    onReconnectStop: (_attempt) => {
      setLoadingOpen(false)
      setOpenRefreshDialog(true)
    },
  })
  const { toast } = useToast()
  const pathname = usePathname()
  const router = useRouter()
  const { setLoadingOpen } = useLoadingStore()

  const [openJoinRoomDialog, setOpenJoinRoomDialog] = useState(false)
  const [isSpectator, setIsSpectator] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const myCardRef = React.useRef<HTMLDivElement>(null)
  const launcher = useThrowLauncher(myCardRef, {
    onThrow: (emoji, targetX, targetY, targetMemberId, targetContext) => {
      let payload: Record<string, unknown>
      if (targetMemberId && targetContext === 'table') {
        payload = { emoji, target_table_member_id: targetMemberId }
      } else if (targetMemberId && targetContext === 'panel') {
        payload = { emoji, target_panel_member_id: targetMemberId }
      } else {
        payload = { emoji, target_x_ratio: targetX / window.innerWidth, target_y_ratio: targetY / window.innerHeight }
      }
      sendJsonMessage({ action: 'THROW_EMOJI', payload })
    },
  })
  const [members, setMembers] = useState<Member[]>([])
  const [roomStatus, setRoomStatus] = useState<Status>(Status.None)
  const [cardChoosing, setCardChoosing] = useState<string | null>(null)
  const [roomName, setRoomName] = useState<string>('')
  const [openRefreshDialog, setOpenRefreshDialog] = useState(false)
  const [isEditPointMode, setIsEditEstimateValue] = useState<boolean>(false)
  const [cardOptions, setCardOptions] = useState<string[]>([])
  const [result, setResult] = useState<Map<string, number>>(new Map<string, number>())
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [chatInput, setChatInput] = useState('')
  const chatEndRef = React.useRef<HTMLDivElement>(null)
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 30_000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])
  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState]

  const wsStatusConfig: Record<string, { dot: string; pulse: string; text: string; label: string }> = {
    Open: { dot: 'bg-green-500', pulse: 'bg-green-500/40', text: 'text-green-400', label: 'WS Connected' },
    Connecting: { dot: 'bg-yellow-400', pulse: 'bg-yellow-400/40', text: 'text-yellow-400', label: 'WS Connecting' },
    Closing: { dot: 'bg-orange-400', pulse: 'bg-orange-400/40', text: 'text-orange-400', label: 'WS Closing' },
    Closed: { dot: 'bg-red-500', pulse: 'bg-red-500/40', text: 'text-red-400', label: 'WS Disconnected' },
    Uninstantiated: { dot: 'bg-neutral-500', pulse: 'bg-neutral-500/40', text: 'text-neutral-400', label: 'WS Offline' },
  }

  const handleClickJoinRoom = (name: string, isCheckedUseAvatar: boolean) => {
    const canUseAvatar = isCheckedUseAvatar && Boolean(avatar)
    const profile = canUseAvatar ? avatar : ''
    sendJsonMessage({ action: 'JOIN_ROOM', payload: { name, profile } })
    setOpenJoinRoomDialog(false)
  }

  const transformMembers = (members: []): Member[] => {
    return members.map((member: any) => {

      const avatar = Boolean(member.picture) ? member.picture : undefined
      return {
        id: member.id,
        name: member.name,
        estimatedValue: member.estimated_value,
        lastActiveAt: new Date(member.last_active_at),
        avatar,
      }
    })
  }
  const maxPoint = useMemo(() => {
    const mappedNumberOptions = cardOptions
      .map((option) => Number(option))
      .filter((option) => !!option)
    return Math.max(...mappedNumberOptions)
  }, [cardOptions])

  useEffect(() => {
    if (readyState !== ReadyState.OPEN) return
    const MIN_PING_INTERVAL = 15_000
    let lastPingAt = 0
    const sendPing = () => {
      sendJsonMessage({ action: 'PING' })
      lastPingAt = Date.now()
    }
    const sendPingIfReady = () => {
      if (Date.now() - lastPingAt >= MIN_PING_INTERVAL) sendPing()
    }
    sendPing()
    let timer = setInterval(sendPing, 30_000)
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        sendPingIfReady()
        timer = setInterval(sendPing, 30_000)
      } else {
        clearInterval(timer)
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => {
      clearInterval(timer)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [readyState, sendJsonMessage])

  useEffect(() => {
    switch (readyState) {
      case ReadyState.CONNECTING:
        setLoadingOpen(true)
        break
      case ReadyState.OPEN:
        setLoadingOpen(false)
        break
      case ReadyState.UNINSTANTIATED:
        router.push('/')
        break
      default:
        break
    }
  }, [pathname, readyState, router, setLoadingOpen, toast])

  useEffect(() => {
    if (!lastMessage) {
      return
    }

    const jsonMessage = JSON.parse(lastMessage.data)
    const action = jsonMessage.action
    switch (action) {
      case 'NEED_TO_JOIN':
        if (!isSpectator) {
          setOpenJoinRoomDialog(true)
        }
        break
      case 'EMOJI_THROWN': {
        const { from_user_id, emoji, target_table_member_id, target_panel_member_id, target_x_ratio, target_y_ratio } = jsonMessage.payload

        // Origin: always the right-panel member card
        const fromEl = document.querySelector<HTMLElement>(`[data-panel-member-id="${from_user_id}"]`)
        const fromRect = fromEl?.getBoundingClientRect()
        const fromX = fromRect ? fromRect.left + fromRect.width / 2 : window.innerWidth - 80
        const fromY = fromRect ? fromRect.top + fromRect.height / 2 : window.innerHeight / 2

        // Target: resolve to correct element on this client's screen
        let targetX: number
        let targetY: number
        if (target_table_member_id) {
          const el = document.querySelector<HTMLElement>(`[data-table-member-id="${target_table_member_id}"]`)
          const r = el?.getBoundingClientRect()
          targetX = r ? r.left + r.width / 2 : window.innerWidth / 2
          targetY = r ? r.top + r.height / 2 : window.innerHeight / 2
        } else if (target_panel_member_id) {
          const el = document.querySelector<HTMLElement>(`[data-panel-member-id="${target_panel_member_id}"]`)
          const r = el?.getBoundingClientRect()
          targetX = r ? r.left + r.width / 2 : window.innerWidth - 80
          targetY = r ? r.top + r.height / 2 : window.innerHeight / 2
        } else {
          targetX = target_x_ratio * window.innerWidth
          targetY = target_y_ratio * window.innerHeight
        }

        launcher.fireRemote(emoji, fromX, fromY, targetX, targetY)
        break
      }
      case 'CHAT_MESSAGE': {
        const { member_id, name, avatar: msgAvatar, text, at } = jsonMessage.payload
        setChatMessages((prev) => [
          ...prev,
          { id: `${member_id}-${at}`, memberId: member_id, name, avatar: msgAvatar || undefined, text, at: new Date(at) },
        ])
        setIsChatOpen((open) => {
          if (!open) setUnreadCount((n) => n + 1)
          return open
        })
        break
      }
      case 'UPDATE_ROOM':
        const payload = jsonMessage.payload
        const transformedMembers = transformMembers(payload.members ?? [])
        setMembers(transformedMembers)
        const meData = transformedMembers.find((member) => member.id === uid)
        const myEstimatedPoint = meData?.estimatedValue ?? null
        setCardChoosing(String(myEstimatedPoint))
        const newRoomState = payload.status
        setRoomStatus(newRoomState)
        if (newRoomState === Status.Voting) {
          setIsEditEstimateValue(false)
        }
        setRoomName(payload.name)
        const options = payload.desk_config
        setCardOptions(options.split(',').map((option: string) => option.trim()))

        if (payload.result) {
          const newResult = new Map<string, number>()
          Object.keys(payload.result).forEach((key: string) => {
            newResult.set(key, payload.result[key])
          })
          setResult(newResult)
        }

        break
      default:
        break
    }

    const error = jsonMessage.error
    if (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error,
        duration: 4000,
      })
      router.push('/')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSpectator, lastMessage, lastMessage?.data, roomStatus, router, toast, uid])

  const inviteLink = process.env.NEXT_PUBLIC_ORIGIN_URL + pathname
  const isRevealed = roomStatus === Status.RevealedCards

  const handleSendChat = () => {
    const text = chatInput.trim()
    if (!text) return
    sendJsonMessage({ action: 'SEND_CHAT', payload: { text } })
    setChatInput('')
  }

  const formatTimeAgo = (msDiff: number): string => {
    if (msDiff < 60_000) return 'Just now'
    if (msDiff < 3_600_000) return `${Math.floor(msDiff / 60_000)}m ago`
    return `${Math.floor(msDiff / 3_600_000)}h ago`
  }

  const activityTier = (lastActiveAt: Date): number => {
    const ms = now - lastActiveAt.getTime()
    if (ms <= 1 * 60_000) return 0   // green
    if (ms <= 10 * 60_000) return 1  // orange
    return 2                          // offline
  }

  const sortedMembers = [...members].sort((a, b) => {
    const tierDiff = activityTier(a.lastActiveAt) - activityTier(b.lastActiveAt)
    if (tierDiff !== 0) return tierDiff
    return a.name.localeCompare(b.name)
  })

  return (
    <>
      <div className="flex min-h-[calc(100dvh-92px*2)] min-w-[700px] rounded-t-2xl bg-muted/10 shadow-md">

        {/* ── Main column ── */}
        <div className="flex flex-1 flex-col">

          {/* Table centered in main space */}
          <div
            className="flex flex-1 items-center justify-center py-8"
            style={launcher.armedEmoji ? { cursor: ARMED_CURSOR } : undefined}
            onClick={(e) => {
              if (!launcher.armedEmoji) return
              let el: HTMLElement | null = e.target as HTMLElement
              let memberId: string | undefined
              while (el && el !== e.currentTarget) {
                if (el.dataset.tableMemberId) { memberId = el.dataset.tableMemberId; break }
                el = el.parentElement
              }
              launcher.handleFire(e.clientX, e.clientY, memberId, memberId ? 'table' : undefined)
            }}
          >
            {roomStatus !== Status.None && (
              <RoomTable
                result={result}
                maxPoint={maxPoint}
                members={members}
                roomName={roomName}
                status={roomStatus}
                isSpectator={isSpectator}
                onReveal={() => sendJsonMessage({ action: 'REVEAL_CARDS' })}
                onReset={() => sendJsonMessage({ action: 'RESET_ROOM' })}
              />
            )}
          </div>

          {/* Sticky bottom — cards bar */}
          {roomStatus !== Status.None && (
            <div className="sticky bottom-0 z-20">
              <div className="border-t border-border/40 bg-background/90 backdrop-blur-md px-6 py-4">
              <div className="flex items-center justify-center gap-4">
                {!isSpectator && (
                  <RoomCards
                    cardChoosing={String(cardChoosing) ?? '-1'}
                    cardOptions={cardOptions}
                    isEditPointMode={isEditPointMode}
                    onClickFlipCards={() => setIsEditEstimateValue((preVal) => !preVal)}
                    onClickVote={(value) => {
                      sendJsonMessage({ action: 'UPDATE_ESTIMATED_VALUE', payload: { value } })
                      setIsEditEstimateValue(false)
                    }}
                    status={roomStatus}
                  />
                )}
                {isSpectator && (
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-3 py-1">
                      <FontAwesomeIcon icon={faEye} className="size-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Watching as spectator</span>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-[-4px] rounded-lg bg-primary/30 blur-xl animate-pulse" style={{ animationDuration: '2s' }} />
                      <div className="relative overflow-hidden rounded-md">
                        <span className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-transparent via-white/25 to-transparent animate-shine" style={{ animationDuration: '3s' }} />
                        <Button
                          className="relative gap-2 border-0 bg-gradient-to-r from-orange-500 via-primary to-orange-400 transition-transform duration-200 hover:scale-[1.04] hover:shadow-lg hover:shadow-primary/40"
                          style={{ backgroundSize: '200% 200%', animation: 'gradient-shift 4s ease infinite' }}
                          onClick={() => { setIsSpectator(false); setOpenJoinRoomDialog(true) }}
                        >
                          <FontAwesomeIcon icon={faChair} className="size-4" />
                          Sit Down
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* ── Fixed player panel ── */}
      <div className="fixed right-0 top-[64px] z-20 flex flex-col border-l border-border/40 bg-background/95 backdrop-blur-md w-60"
        style={{ bottom: '64px' }}
      >
        <div className="flex flex-col gap-3 overflow-hidden p-5 h-full" style={{ width: 240 }}>

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">In Room</p>
              <p className="text-lg font-bold tabular-nums leading-tight">{members.length} <span className="text-xs font-normal text-muted-foreground">players</span></p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(inviteLink)
                  setIsCopied(true)
                  setTimeout(() => setIsCopied(false), 3000)
                }}
                className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs transition-all duration-300 ${
                  isCopied
                    ? 'border-green-500/60 bg-green-500/10 text-green-400'
                    : 'border-dashed border-primary/50 text-primary/70 hover:border-primary hover:text-primary'
                }`}
              >
                <FontAwesomeIcon icon={isCopied ? faCircleCheck : faUserPlus} className="size-3" />
                {isCopied ? 'Copied!' : 'Invite'}
              </button>
            </div>
          </div>

          {/* Vote progress bar */}
          {roomStatus === Status.Voting && members.length > 0 && (() => {
            const votedCount = members.filter(m => m.estimatedValue !== '').length
            return (
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{votedCount} voted</span>
                  <span>{members.length - votedCount} waiting</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-muted/40">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-500"
                    style={{ width: `${(votedCount / members.length) * 100}%` }}
                  />
                </div>
              </div>
            )
          })()}

          {/* Player list — scrollable */}
          <div className="flex flex-col gap-1.5 overflow-y-auto pr-1 flex-1">
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
                  ref={member.id === id ? myCardRef : undefined}
                  data-panel-member-id={member.id}
                  className={`relative flex items-center gap-3 rounded-xl border px-3 py-2.5 transition-all duration-200 ${
                    launcher.armedEmoji && launcher.hoveredMemberId === member.id
                      ? 'border-orange-400/70 bg-orange-400/10 ring-2 ring-orange-400/30 shadow-md shadow-orange-500/20'
                      : launcher.armedEmoji
                      ? 'border-orange-400/25 bg-orange-400/5 hover:border-orange-400/60 hover:bg-orange-400/10'
                      : 'border-border/40 bg-muted/20 hover:border-border/70 hover:bg-muted/40'
                  }`}
                  style={launcher.armedEmoji ? { cursor: ARMED_CURSOR } : undefined}
                  onMouseEnter={(e) => {
                    if (!launcher.armedEmoji) return
                    const r = e.currentTarget.getBoundingClientRect()
                    launcher.setHoveredMemberId(member.id)
                    launcher.setHoveredCardCenter({ x: r.left + r.width / 2, y: r.top })
                  }}
                  onMouseLeave={() => {
                    launcher.setHoveredMemberId(null)
                    launcher.setHoveredCardCenter(null)
                  }}
                  onClick={(e) => {
                    if (!launcher.armedEmoji) return
                    const r = e.currentTarget.getBoundingClientRect()
                    launcher.handleFire(r.left + r.width / 2, r.top + r.height / 2, member.id, 'panel')
                  }}
                >
                  <div className="relative flex-shrink-0">
                    <Avatar className="size-8 ring-1 ring-border">
                      <AvatarImage src={member.avatar ?? '/images/corgi-tood-cute.png'} alt={member.name} />
                      <AvatarFallback className="text-xs">{member.name[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className={`absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full ring-2 ring-background ${activeDot}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium leading-tight">{member.name}</p>
                    <p className="text-[10px] text-muted-foreground">{activeLabel}</p>
                  </div>
                  {isRevealed && picked ? (
                    <span className="min-w-[24px] rounded-md bg-primary/20 px-1.5 py-0.5 text-center text-xs font-bold text-primary">
                      {member.estimatedValue}
                    </span>
                  ) : picked ? (
                    <FontAwesomeIcon icon={faCircleCheck} className="size-4 flex-shrink-0 text-primary" />
                  ) : (
                    <FontAwesomeIcon icon={faCircle} className="size-4 flex-shrink-0 text-muted-foreground/25" />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="fixed bottom-4 right-4 flex items-center gap-1.5 rounded-full border border-white/10 bg-black/40 px-3 py-1.5 backdrop-blur-sm">
          <span className="relative flex size-2">
            <span className={`absolute inline-flex size-full animate-ping rounded-full ${wsStatusConfig[connectionStatus]?.pulse ?? 'bg-neutral-500/40'}`} />
            <span className={`relative inline-flex size-2 rounded-full animate-heartbeat ${wsStatusConfig[connectionStatus]?.dot ?? 'bg-neutral-500'}`} />
          </span>
          <span className={`text-xs font-medium ${wsStatusConfig[connectionStatus]?.text ?? 'text-neutral-400'}`}>
            {wsStatusConfig[connectionStatus]?.label ?? connectionStatus}
          </span>
        </div>

      {/* ── Floating chat widget ── */}
      <div className="fixed bottom-20 left-4 z-30 flex flex-col items-start gap-2">
        {isChatOpen && (
          <div className="flex flex-col w-64 h-80 rounded-2xl border border-border/50 bg-background/95 backdrop-blur-md shadow-2xl shadow-black/40 overflow-hidden animate-in slide-in-from-bottom-2 duration-200">
            {/* Chat header */}
            <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-border/40 flex-shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-foreground">Chat</span>
                <span className="rounded-full border border-primary/40 bg-primary/10 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-primary/70">Coming soon</span>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors text-xs leading-none">✕</button>
            </div>

            {/* Messages */}
            <div className="flex flex-col gap-2 overflow-y-auto flex-1 min-h-0 px-3 py-2">
              {chatMessages.length === 0 && (
                <p className="text-center text-[11px] text-muted-foreground/40 mt-6">No messages yet</p>
              )}
              {chatMessages.map((msg) => {
                const isMe = msg.memberId === id
                return (
                  <div key={msg.id} className={`flex gap-1.5 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                    <Avatar className="size-5 flex-shrink-0 mt-0.5">
                      <AvatarImage src={msg.avatar ?? '/images/corgi-tood-cute.png'} alt={msg.name} />
                      <AvatarFallback className="text-[7px]">{msg.name[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className={`flex flex-col gap-0.5 min-w-0 ${isMe ? 'items-end' : 'items-start'}`}>
                      {!isMe && <span className="text-[10px] text-muted-foreground/60 leading-none">{msg.name}</span>}
                      <div className={`rounded-2xl px-2.5 py-1.5 text-xs leading-snug break-words max-w-[168px] ${
                        isMe ? 'bg-primary text-primary-foreground rounded-tr-sm' : 'bg-muted/60 text-foreground rounded-tl-sm'
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  </div>
                )
              })}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div className="flex gap-1.5 px-3 py-2.5 border-t border-border/40 flex-shrink-0">
              <input
                className="flex-1 min-w-0 rounded-lg border border-border/50 bg-muted/20 px-2.5 py-1.5 text-xs placeholder:text-muted-foreground/25 cursor-not-allowed opacity-50"
                placeholder="Coming soon…"
                disabled
              />
              <button
                disabled
                className="flex-shrink-0 rounded-lg bg-primary/80 px-2.5 py-1.5 text-primary-foreground opacity-30 cursor-not-allowed"
              >
                <FontAwesomeIcon icon={faPaperPlane} className="size-3" />
              </button>
            </div>
          </div>
        )}

        {/* Toggle button */}
        <button
          onClick={() => { setIsChatOpen((o) => !o); setUnreadCount(0) }}
          className="relative flex items-center justify-center size-10 rounded-full border border-border/50 bg-background/95 backdrop-blur-md shadow-lg text-muted-foreground hover:text-foreground transition-colors"
        >
          <FontAwesomeIcon icon={faCommentDots} className="size-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex items-center justify-center size-4 rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      </div>

      <JoinRoomDialog
        open={openJoinRoomDialog}
        onClickConfirm={handleClickJoinRoom}
        onClickSpectate={() => {
          setIsSpectator(true)
          setOpenJoinRoomDialog(false)
          launcher.disarm()
        }}
        hasAvatar={Boolean(avatar)}
        defaultName={userName ?? undefined}
        signedIn={Boolean(sessionId)}
      />
      {!isSpectator && (
        <>
          <ThrowPanel
            armedEmoji={launcher.armedEmoji}
            isExpanded={launcher.isExpanded}
            onToggleExpand={launcher.toggleExpanded}
            onArmEmoji={launcher.handleArmEmoji}
            onDisarm={launcher.disarm}
          />
          <ThrowOverlay
            armedEmoji={launcher.armedEmoji}
            hoveredCardCenter={launcher.hoveredCardCenter}
            thrown={launcher.thrown}
            impacts={launcher.impacts}
          />
        </>
      )}

      <Dialog
        open={openRefreshDialog}
        title="Connection lost"
        content="Oops! it seems like the connection was lost. Please refresh the page."
        action={
          <>
            <Button variant="outline" onClick={() => router.push('/')}>
              Home
            </Button>
            <Button onClick={() => window.location.reload()}>Refresh</Button>
          </>
        }
      />
    </>
  )
}

export default Room
