'use client'
import { faChair, faEye, faUserPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { usePathname, useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import useWebSocket, { ReadyState } from 'react-use-websocket'

import type { TicketEstimation } from '@/components/JiraIntegration'
import { TicketEstimationPicker } from '@/components/JiraIntegration'
import { useToast } from '@/components/ui/use-toast'
import { useLoadingStore, useUserInfoStore } from '@/store/zustand'

import Dialog from '../common/Dialog'
import JoinRoomDialog from '../JoinRoomDialog'
import RoomCards from '../RoomCards'
import RoomTable from '../RoomTable'
import { ThrowOverlay, ThrowPanel, useThrowLauncher } from '../ThrowLauncher'
import { Button } from '../ui/button'
import ActivityFeed, { ActivityEvent, INITIAL_ACTIVITY } from './ActivityFeed'
import ChatWidget from './ChatWidget'
import MobilePlayersSheet from './MobilePlayersSheet'
import { ChatMessage, Member, Props, Status } from './types'
import VoterPanel from './VoterPanel'


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
  const t = useTranslations('room')
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
  const [activityLog, setActivityLog] = useState<ActivityEvent[]>(INITIAL_ACTIVITY)
  const [activeActivityTab, setActiveActivityTab] = useState<'room' | 'personal'>('room')
  const [isMobilePlayersOpen, setIsMobilePlayersOpen] = useState(false)
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false)
  const [panelWidth, setPanelWidth] = useState(200)
  const [isDraggingPanel, setIsDraggingPanel] = useState(false)
  const prevMembersRef = React.useRef<Member[]>([])
  const prevRoomStatusRef = React.useRef<Status>(Status.None)
  const pendingActionActorRef = React.useRef<string | null>(null)
  const [now, setNow] = useState(() => Date.now())
  const [ticketEstimation, setTicketEstimation] = useState<TicketEstimation | null>(null)
  const [finalStoryPoint, setFinalStoryPoint] = useState<string>('')
  const [isJiraConnected, setIsJiraConnected] = useState(false)
  const [cloudId, setCloudId] = useState('')
  const [jiraSiteUrl, setJiraSiteUrl] = useState('')
  const [isJiraPickerOpen, setIsJiraPickerOpen] = useState(false)

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
    Open: { dot: 'bg-green-500', pulse: 'bg-green-500/40', text: 'text-green-400', label: t('wsConnected') },
    Connecting: { dot: 'bg-yellow-400', pulse: 'bg-yellow-400/40', text: 'text-yellow-400', label: t('wsConnecting') },
    Closing: { dot: 'bg-orange-400', pulse: 'bg-orange-400/40', text: 'text-orange-400', label: t('wsClosing') },
    Closed: { dot: 'bg-red-500', pulse: 'bg-red-500/40', text: 'text-red-400', label: t('wsDisconnected') },
    Uninstantiated: { dot: 'bg-neutral-500', pulse: 'bg-neutral-500/40', text: 'text-neutral-400', label: t('wsOffline') },
  }

  useEffect(() => {
    fetch('/api/jira/status')
      .then((r) => r.json())
      .then((data) => {
        if (data.connected) {
          setIsJiraConnected(true)
          setCloudId(data.cloudId ?? '')
          setJiraSiteUrl(data.siteUrl ?? '')
        }
      })
      .catch(() => {})
  }, [])

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
        const meData = transformedMembers.find((member) => member.id === id)
        const myEstimatedPoint = meData?.estimatedValue ?? null
        const serverChoosing = String(myEstimatedPoint)
        const newRoomState = payload.status
        const isNewRound = prevRoomStatusRef.current === Status.RevealedCards && newRoomState === Status.Voting
        setCardChoosing(prev => {
          if (serverChoosing !== '' && serverChoosing !== 'null') return serverChoosing
          if (isNewRound) return serverChoosing
          return prev
        })
        setRoomStatus(newRoomState)
        if (newRoomState === Status.Voting) {
          setIsEditEstimateValue(false)
        }
        setRoomName(payload.name)
        const options = payload.desk_config
        const parsedOptions = options.split(',').map((option: string) => option.trim()).filter(Boolean)
        setCardOptions(Array.from(new Set(parsedOptions)))

        if (payload.result) {
          const newResult = new Map<string, number>()
          Object.keys(payload.result).forEach((key: string) => {
            newResult.set(key, payload.result[key])
          })
          setResult(newResult)
        }
        setTicketEstimation(payload.ticket_estimation ?? null)
        setFinalStoryPoint(payload.final_story_point ?? '')

        {
          const prevMembers = prevMembersRef.current
          const prevStatus = prevRoomStatusRef.current
          const ts = new Date()
          const addEvent = (event: Omit<ActivityEvent, 'id'>) =>
            setActivityLog((prev) => [...prev.slice(-200), { ...event, id: `${event.type}-${ts.getTime()}-${Math.random()}` }])

          transformedMembers.forEach((m) => {
            if (!prevMembers.some((pm) => pm.id === m.id)) {
              addEvent({ type: 'join', actor: m.name, at: ts })
            }
          })

          if (newRoomState === Status.Voting) {
            transformedMembers.forEach((m) => {
              const prev = prevMembers.find((pm) => pm.id === m.id)
              if (prev && prev.estimatedValue === '' && m.estimatedValue !== '') {
                addEvent({ type: 'vote', actor: m.name, at: ts })
              }
            })
          }

          if (prevStatus !== Status.RevealedCards && newRoomState === Status.RevealedCards) {
            const votes = transformedMembers
              .filter((m) => m.estimatedValue !== '')
              .map((m) => ({ name: m.name, value: m.estimatedValue }))
            const numericVotes = votes.map((v) => Number(v.value)).filter((v) => !isNaN(v) && isFinite(v))
            const avg = numericVotes.length > 0 ? numericVotes.reduce((s, v) => s + v, 0) / numericVotes.length : 0
            addEvent({ type: 'reveal', actor: pendingActionActorRef.current ?? undefined, at: ts, roundResult: { votes, avg } })
            pendingActionActorRef.current = null
          }

          if (prevStatus === Status.RevealedCards && newRoomState === Status.Voting) {
            addEvent({ type: 'reset', actor: pendingActionActorRef.current ?? undefined, at: ts })
            pendingActionActorRef.current = null
          }

          prevMembersRef.current = transformedMembers
          prevRoomStatusRef.current = newRoomState
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

  const handleJiraConnected = useCallback(() => {
    fetch('/api/jira/status')
      .then((r) => r.json())
      .then((data) => {
        if (data.connected) {
          setIsJiraConnected(true)
          setCloudId(data.cloudId ?? '')
          setJiraSiteUrl(data.siteUrl ?? '')
        }
      })
      .catch(() => {})
  }, [])

  const handleJiraDisconnected = useCallback(() => {
    setIsJiraConnected(false)
    setCloudId('')
    // Ticket stays visible for all — disconnect only clears local Jira connection
  }, [])

  const handleSetFinalStoryPoint = useCallback((value: string) => {
    sendJsonMessage({ action: 'SET_FINAL_STORY_POINT', payload: { value } })
  }, [sendJsonMessage])

  const handleRemoveTicket = useCallback(() => {
    setTicketEstimation(null)
    sendJsonMessage({ action: 'SET_TICKET_ESTIMATION', payload: { ticketEstimation: null } })
  }, [sendJsonMessage])

  const handleTicketSelect = useCallback((estimation: TicketEstimation) => {
    setTicketEstimation(estimation)
    sendJsonMessage({ action: 'SET_TICKET_ESTIMATION', payload: { ticketEstimation: estimation } })
  }, [sendJsonMessage])

  async function handleSaveToJira(estimation: TicketEstimation, value: number, fieldId: string) {
    const res = await fetch(`/api/jira/issues/${estimation.jiraKey}/estimate`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cloudId: estimation.jiraCloudId, value, storyPointsField: fieldId }),
    })
    if (!res.ok) throw new Error('save failed')
  }

  const inviteLink = process.env.NEXT_PUBLIC_ORIGIN_URL + pathname
  const isRevealed = roomStatus === Status.RevealedCards

  const consensusValue =
    roomStatus === Status.RevealedCards && result.size > 0
      ? Array.from(result.entries()).sort((a, b) => b[1] - a[1])[0]?.[0]
      : undefined

  const handleSendChat = () => {
    const text = chatInput.trim()
    if (!text) return
    sendJsonMessage({ action: 'SEND_CHAT', payload: { text } })
    setChatInput('')
  }

  const formatTimeAgo = (msDiff: number): string => {
    if (msDiff < 60_000) return 'Just now'
    if (msDiff < 3_600_000) return `${Math.floor(msDiff / 60_000)}m ago`
    if (msDiff < 86_400_000) return `${Math.floor(msDiff / 3_600_000)}h ago`
    if (msDiff < 2_592_000_000) return `${Math.floor(msDiff / 86_400_000)}d ago`
    return `${Math.floor(msDiff / 2_592_000_000)}mo ago`
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

  const { roundGroups, personalEvents } = useMemo(() => {
    const groups: { round: number; events: ActivityEvent[] }[] = [{ round: 1, events: [] }]
    const personal: ActivityEvent[] = []
    for (const event of activityLog) {
      if (event.type === 'reveal' || event.type === 'reset') {
        groups[groups.length - 1].events.push(event)
        if (event.type === 'reset') groups.push({ round: groups.length + 1, events: [] })
      } else {
        personal.push(event)
      }
    }
    return { roundGroups: groups, personalEvents: personal }
  }, [activityLog])

  return (
    <>
      <div
        className={`flex min-h-[calc(100dvh-92px*2)] overflow-x-hidden md:pl-14 ${!isDraggingPanel ? 'transition-[padding] duration-300' : ''} ${isPanelCollapsed ? 'md:pr-10' : panelWidth === 200 ? 'md:pr-[200px]' : ''}`}
        style={!isPanelCollapsed && panelWidth !== 200 ? { paddingRight: panelWidth } : {}}
      >

        {/* ── Main column ── */}
        <div className="flex flex-1 flex-col min-w-0">

          {/* Table centered in main space */}
          <div
            className="relative flex flex-1 flex-col items-center justify-center py-4 w-full overflow-hidden"
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
                ticketEstimation={ticketEstimation}
                isJiraConnected={isJiraConnected}
                jiraSiteUrl={jiraSiteUrl}
                cloudId={cloudId}
                roomId={roomId ?? ''}
                consensusValue={consensusValue}
                finalStoryPoint={finalStoryPoint}
                deckOptions={cardOptions}
                onSetFinalStoryPoint={handleSetFinalStoryPoint}
                onReveal={() => {
                  pendingActionActorRef.current = members.find((m) => m.id === id)?.name ?? null
                  sendJsonMessage({ action: 'REVEAL_CARDS' })
                }}
                onReset={() => {
                  pendingActionActorRef.current = members.find((m) => m.id === id)?.name ?? null
                  sendJsonMessage({ action: 'RESET_ROOM' })
                }}
                onSetTicket={() => setIsJiraPickerOpen(true)}
                onRemoveTicket={handleRemoveTicket}
                onSaveToJira={handleSaveToJira}
                onJiraConnected={handleJiraConnected}
                onJiraDisconnected={handleJiraDisconnected}
              />
            )}

            {/* Activity feed — right of table, within center area */}
            {roomStatus !== Status.None && process.env.NEXT_PUBLIC_ROOM_ACTIVITY_HISTORY_ENABLED === 'true' && (
              <ActivityFeed
                activeTab={activeActivityTab}
                roundGroups={roundGroups}
                personalEvents={personalEvents}
                now={now}
                armedEmoji={launcher.armedEmoji}
                formatTimeAgo={formatTimeAgo}
                onTabChange={setActiveActivityTab}
              />
            )}
          </div>

          {/* Sticky bottom — cards bar */}
          {roomStatus !== Status.None && (
            <div className="sticky bottom-0 z-20">
              <div className="border-t border-border/30 bg-background/95 backdrop-blur-md px-4 pb-5 pt-3">
                {/* Label row */}
                {!isSpectator && (
                  <div className="mb-2 flex items-center justify-center gap-2">
                    {roomStatus === Status.Voting && cardChoosing !== 'null' && cardChoosing !== '-1' && cardChoosing !== '' ? (
                      <>
                        <span className="size-1.5 rounded-full bg-primary animate-pulse inline-block" />
                        <span className="text-[11px] font-semibold text-primary/80 uppercase tracking-widest">{t('voted')}</span>
                      </>
                    ) : roomStatus === Status.Voting ? (
                      <>
                        <span className="size-1.5 rounded-full bg-muted-foreground/40 inline-block" />
                        <span className="text-[11px] font-medium text-muted-foreground/50 uppercase tracking-widest">{t('pickCard')}</span>
                      </>
                    ) : null}
                  </div>
                )}
              <div className="flex items-center justify-center gap-4">
                {!isSpectator && (
                  <RoomCards
                    cardChoosing={String(cardChoosing) ?? '-1'}
                    cardOptions={cardOptions}
                    isEditPointMode={isEditPointMode}
                    onClickFlipCards={() => setIsEditEstimateValue((preVal) => !preVal)}
                    onClickVote={(value) => {
                      setCardChoosing(value)
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
                      <span className="text-xs text-muted-foreground">{t('watchingAsSpectator')}</span>
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
                          {t('sitDown')}
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
      <VoterPanel
        members={members}
        sortedMembers={sortedMembers}
        panelWidth={panelWidth}
        isPanelCollapsed={isPanelCollapsed}
        isDraggingPanel={isDraggingPanel}
        myId={id}
        isRevealed={isRevealed}
        roomStatus={roomStatus}
        now={now}
        armedEmoji={launcher.armedEmoji}
        hoveredMemberId={launcher.hoveredMemberId}
        inviteLink={inviteLink}
        isCopied={isCopied}
        formatTimeAgo={formatTimeAgo}
        onCollapse={() => setIsPanelCollapsed(true)}
        onExpand={() => setIsPanelCollapsed(false)}
        onCopy={() => { navigator.clipboard.writeText(inviteLink); setIsCopied(true); setTimeout(() => setIsCopied(false), 3000) }}
        onWidthChange={setPanelWidth}
        onDragStart={() => setIsDraggingPanel(true)}
        onDragEnd={() => setIsDraggingPanel(false)}
        onHoverMember={launcher.setHoveredMemberId}
        onSetHoveredCardCenter={launcher.setHoveredCardCenter}
        onFireAt={(x, y, memberId, context) => launcher.handleFire(x, y, memberId, context)}
        myCardRef={myCardRef}
      />

      {/* Mobile players toggle button */}
      {roomStatus !== Status.None && (
        <button
          className="fixed top-[68px] right-3 z-30 md:hidden flex items-center gap-1.5 rounded-full border border-border/50 bg-background/95 px-3 py-1.5 text-xs text-muted-foreground shadow-md backdrop-blur-sm"
          onClick={() => setIsMobilePlayersOpen(true)}
        >
          <FontAwesomeIcon icon={faUserPlus} className="size-3.5" />
          <span>{members.length}</span>
        </button>
      )}

      {/* Mobile players bottom sheet */}
      {isMobilePlayersOpen && roomStatus !== Status.None && (
        <MobilePlayersSheet
          members={members}
          sortedMembers={sortedMembers}
          roomStatus={roomStatus}
          isRevealed={isRevealed}
          myId={id}
          now={now}
          inviteLink={inviteLink}
          isCopied={isCopied}
          formatTimeAgo={formatTimeAgo}
          onClose={() => setIsMobilePlayersOpen(false)}
          onCopy={() => { navigator.clipboard.writeText(inviteLink); setIsCopied(true); setTimeout(() => setIsCopied(false), 3000) }}
        />
      )}

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
      <ChatWidget
        isOpen={isChatOpen}
        messages={chatMessages}
        unreadCount={unreadCount}
        chatInput={chatInput}
        myId={id}
        chatEndRef={chatEndRef}
        onToggle={() => { setIsChatOpen((o) => !o); setUnreadCount(0) }}
        onInputChange={setChatInput}
        onSend={handleSendChat}
      />

      <TicketEstimationPicker
        open={isJiraPickerOpen}
        onOpenChange={setIsJiraPickerOpen}
        isJiraConnected={isJiraConnected}
        cloudId={cloudId}
        onSelect={(estimation) => {
          handleTicketSelect(estimation)
          setIsJiraPickerOpen(false)
        }}
      />

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
        title={t('connectionLost')}
        content={t('connectionLostDesc')}
        action={
          <>
            <Button variant="outline" onClick={() => router.push('/')}>
              Home
            </Button>
            <Button onClick={() => window.location.reload()}>{t('refresh')}</Button>
          </>
        }
      />
    </>
  )
}

export default Room
