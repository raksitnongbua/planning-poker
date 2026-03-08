'use client'
import { faAnglesLeft, faAnglesRight, faChair, faCircleCheck, faCommentDots, faEye, faGripVertical, faPaperPlane, faRightToBracket, faRotate, faUserPlus, faXmark } from '@fortawesome/free-solid-svg-icons'
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

type ActivityEventType = 'join' | 'vote' | 'reveal' | 'reset' | 'spectate'
interface RoundResult {
  votes: { name: string; value: string }[]
  avg: number
}
interface ActivityEvent {
  id: string
  type: ActivityEventType
  actor?: string
  at: Date
  roundResult?: RoundResult
}

const INITIAL_ACTIVITY: ActivityEvent[] = (() => {
  const t = (minAgo: number) => new Date(Date.now() - minAgo * 60_000)
  const MEMBERS = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Henry']

  const voteEvents = (round: number, baseMin: number): ActivityEvent[] =>
    MEMBERS.map((name, i) => ({
      id: `v${round}_${i}`,
      type: 'vote' as ActivityEventType,
      actor: name,
      at: t(baseMin - i * 0.4),
    }))

  return [
    // — Joins —
    { id: 'j1', type: 'join', actor: 'Alice',   at: t(75) },
    { id: 'j2', type: 'join', actor: 'Bob',     at: t(74) },
    { id: 'j3', type: 'join', actor: 'Charlie', at: t(73) },
    { id: 'j4', type: 'join', actor: 'Diana',   at: t(72) },
    { id: 'j5', type: 'join', actor: 'Eve',     at: t(71) },
    { id: 'j6', type: 'join', actor: 'Frank',   at: t(70) },
    { id: 'j7', type: 'join', actor: 'Grace',   at: t(69) },
    { id: 'j8', type: 'join', actor: 'Henry',   at: t(68) },

    // Round 1 — spread opinions
    ...voteEvents(1, 67),
    { id: 'r1', type: 'reveal', actor: 'Alice', at: t(63),
      roundResult: { votes: [
        {name:'Alice',value:'5'},{name:'Bob',value:'3'},{name:'Charlie',value:'8'},{name:'Diana',value:'8'},
        {name:'Eve',value:'8'},{name:'Frank',value:'13'},{name:'Grace',value:'5'},{name:'Henry',value:'8'},
      ], avg: 7.25 } },
    { id: 's1', type: 'reset', actor: 'Alice', at: t(62) },

    // Round 2 — leaning toward 8
    ...voteEvents(2, 61),
    { id: 'r2', type: 'reveal', actor: 'Bob', at: t(57),
      roundResult: { votes: [
        {name:'Alice',value:'8'},{name:'Bob',value:'8'},{name:'Charlie',value:'5'},{name:'Diana',value:'8'},
        {name:'Eve',value:'8'},{name:'Frank',value:'8'},{name:'Grace',value:'8'},{name:'Henry',value:'13'},
      ], avg: 8.25 } },
    { id: 's2', type: 'reset', actor: 'Bob', at: t(56) },

    // Round 3 — full consensus
    ...voteEvents(3, 55),
    { id: 'r3', type: 'reveal', actor: 'Charlie', at: t(51),
      roundResult: { votes: MEMBERS.map((name) => ({ name, value: '8' })), avg: 8 } },
    { id: 's3', type: 'reset', actor: 'Charlie', at: t(50) },

    // Round 4 — slight split (Eve low, Henry high)
    ...voteEvents(4, 49),
    { id: 'r4', type: 'reveal', actor: 'Alice', at: t(45),
      roundResult: { votes: [
        {name:'Alice',value:'8'},{name:'Bob',value:'8'},{name:'Charlie',value:'8'},{name:'Diana',value:'8'},
        {name:'Eve',value:'5'},{name:'Frank',value:'8'},{name:'Grace',value:'8'},{name:'Henry',value:'13'},
      ], avg: 8.25 } },
    { id: 's4', type: 'reset', actor: 'Alice', at: t(44) },

    // Round 5 — debate, pulls lower
    ...voteEvents(5, 43),
    { id: 'r5', type: 'reveal', actor: 'Diana', at: t(39),
      roundResult: { votes: [
        {name:'Alice',value:'5'},{name:'Bob',value:'5'},{name:'Charlie',value:'8'},{name:'Diana',value:'8'},
        {name:'Eve',value:'8'},{name:'Frank',value:'8'},{name:'Grace',value:'3'},{name:'Henry',value:'5'},
      ], avg: 6.25 } },
    { id: 's5', type: 'reset', actor: 'Diana', at: t(38) },

    // Round 6 — Bob and Frank go 13
    ...voteEvents(6, 37),
    { id: 'r6', type: 'reveal', actor: 'Eve', at: t(33),
      roundResult: { votes: [
        {name:'Alice',value:'8'},{name:'Bob',value:'13'},{name:'Charlie',value:'8'},{name:'Diana',value:'8'},
        {name:'Eve',value:'8'},{name:'Frank',value:'13'},{name:'Grace',value:'8'},{name:'Henry',value:'8'},
      ], avg: 9.25 } },
    { id: 's6', type: 'reset', actor: 'Eve', at: t(32) },

    // Round 7 — consensus again after discussion
    ...voteEvents(7, 31),
    { id: 'r7', type: 'reveal', actor: 'Frank', at: t(27),
      roundResult: { votes: MEMBERS.map((name) => ({ name, value: '8' })), avg: 8 } },
    { id: 's7', type: 'reset', actor: 'Frank', at: t(26) },

    // Round 8 — Grace outlier high
    ...voteEvents(8, 25),
    { id: 'r8', type: 'reveal', actor: 'Grace', at: t(21),
      roundResult: { votes: [
        {name:'Alice',value:'8'},{name:'Bob',value:'8'},{name:'Charlie',value:'5'},{name:'Diana',value:'8'},
        {name:'Eve',value:'8'},{name:'Frank',value:'8'},{name:'Grace',value:'13'},{name:'Henry',value:'8'},
      ], avg: 8.25 } },
    { id: 's8', type: 'reset', actor: 'Grace', at: t(20) },

    // Round 9 — all converge on 8
    ...voteEvents(9, 19),
    { id: 'r9', type: 'reveal', actor: 'Henry', at: t(15),
      roundResult: { votes: [
        {name:'Alice',value:'8'},{name:'Bob',value:'8'},{name:'Charlie',value:'8'},{name:'Diana',value:'8'},
        {name:'Eve',value:'8'},{name:'Frank',value:'8'},{name:'Grace',value:'5'},{name:'Henry',value:'13'},
      ], avg: 8.25 } },
    { id: 's9', type: 'reset', actor: 'Henry', at: t(14) },

    // Round 10 — in progress, 6 of 8 voted
    ...(['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank'] as const).map((name, i) => ({
      id: `v10_${i}`,
      type: 'vote' as ActivityEventType,
      actor: name,
      at: t(13 - i * 0.4),
    })),
  ] as ActivityEvent[]
})()

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

  const voteChipStyle = (value: string) => {
    const n = Number(value)
    if (isNaN(n))  return { bg: 'bg-muted/40',          text: 'text-muted-foreground' }
    if (n <= 3)    return { bg: 'bg-blue-500/15',        text: 'text-blue-400' }
    if (n <= 8)    return { bg: 'bg-emerald-500/15',     text: 'text-emerald-400' }
    return               { bg: 'bg-orange-500/15',       text: 'text-orange-400' }
  }
  const avgStyle = (avg: number) => {
    if (avg <= 5)  return 'text-blue-400'
    if (avg <= 10) return 'text-emerald-400'
    return 'text-orange-400'
  }
  const AVATAR_PALETTES = [
    'bg-violet-500/20 text-violet-400', 'bg-blue-500/20 text-blue-400',
    'bg-emerald-500/20 text-emerald-400', 'bg-amber-500/20 text-amber-400',
    'bg-pink-500/20 text-pink-400', 'bg-cyan-500/20 text-cyan-400',
    'bg-rose-500/20 text-rose-400', 'bg-indigo-500/20 text-indigo-400',
  ]
  const avatarPalette = (name: string) => AVATAR_PALETTES[(name?.charCodeAt(0) ?? 0) % AVATAR_PALETTES.length]

  const activityConfig: Record<ActivityEventType, { icon: typeof faEye; color: string; bgColor: string; label: (actor?: string) => string }> = {
    join:     { icon: faRightToBracket, color: 'text-blue-400',   bgColor: 'bg-blue-500/15',    label: (a) => `${a ?? 'Someone'} joined` },
    vote:     { icon: faCircleCheck,    color: 'text-emerald-400', bgColor: 'bg-emerald-500/15', label: (a) => `${a ?? 'Someone'} voted` },
    reveal:   { icon: faEye,            color: 'text-yellow-400', bgColor: 'bg-yellow-500/15',  label: (a) => `${a ?? 'Someone'} revealed` },
    reset:    { icon: faRotate,         color: 'text-orange-400', bgColor: 'bg-orange-500/15',  label: (a) => `${a ?? 'Someone'} new round` },
    spectate: { icon: faEye,            color: 'text-purple-400', bgColor: 'bg-purple-500/15',  label: (a) => `${a ?? 'Someone'} watching` },
  }

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
            className="relative flex flex-1 flex-col items-center justify-center py-8 w-full overflow-hidden"
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
                onReveal={() => {
                  pendingActionActorRef.current = members.find((m) => m.id === id)?.name ?? null
                  sendJsonMessage({ action: 'REVEAL_CARDS' })
                }}
                onReset={() => {
                  pendingActionActorRef.current = members.find((m) => m.id === id)?.name ?? null
                  sendJsonMessage({ action: 'RESET_ROOM' })
                }}
              />
            )}

            {/* Activity feed — right of table, within center area */}
            {roomStatus !== Status.None && process.env.NEXT_PUBLIC_ROOM_ACTIVITY_HISTORY_ENABLED === 'true' && (
              <div
                className={`hidden md:flex absolute right-3 top-6 bottom-6 w-52 flex-col transition-opacity duration-200 ${
                  launcher.armedEmoji ? 'pointer-events-none opacity-20' : 'opacity-100'
                }`}
              >
                <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-border/50 bg-background/90 shadow-xl shadow-black/20 backdrop-blur-md">

                  {/* Segmented tabs */}
                  <div className="mx-3 mt-3 flex flex-shrink-0 gap-1 rounded-xl bg-muted/40 p-1">
                    {(['room', 'personal'] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveActivityTab(tab)}
                        className={`flex-1 rounded-lg py-1.5 text-[10px] font-semibold transition-all duration-200 ${
                          activeActivityTab === tab
                            ? 'bg-background text-foreground shadow-sm'
                            : 'text-muted-foreground/60 hover:text-muted-foreground'
                        }`}
                      >
                        {tab === 'room' ? 'Room' : 'Members'}
                      </button>
                    ))}
                  </div>

                  {/* ── Room tab ── */}
                  {activeActivityTab === 'room' && (
                    <div className="flex flex-1 flex-col gap-1 overflow-y-auto py-2 min-h-0">
                      {[...roundGroups].reverse().map(({ round, events }) => (
                        <div key={round} className="px-3">

                          {/* Round header */}
                          <div className="flex items-center gap-2 py-2">
                            <span className={`rounded-full px-2.5 py-0.5 text-[9px] font-bold tabular-nums transition-colors ${
                              events.length === 0
                                ? 'bg-primary/20 text-primary'
                                : 'bg-muted/60 text-muted-foreground'
                            }`}>
                              Round {round}
                            </span>
                            {events.length === 0 && (
                              <span className="animate-pulse text-[9px] font-semibold text-primary/70">live</span>
                            )}
                            <div className="h-px flex-1 bg-border/40" />
                          </div>

                          {/* In progress */}
                          {events.length === 0 ? (
                            <div className="mb-2 flex items-center gap-2.5 rounded-xl border border-primary/25 bg-primary/8 px-3 py-2.5">
                              <span className="relative flex size-2 flex-shrink-0">
                                <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary/50" />
                                <span className="relative inline-flex size-2 rounded-full bg-primary" />
                              </span>
                              <span className="text-[11px] font-medium text-primary/80">Voting in progress</span>
                            </div>
                          ) : (
                            events.map((event) => {
                              const cfg = activityConfig[event.type]
                              return (
                                <div key={event.id}>

                                  {/* Event row */}
                                  <div className="flex items-center gap-2.5 rounded-xl px-2 py-1.5 transition-colors hover:bg-muted/30">
                                    <div className={`flex size-6 flex-shrink-0 items-center justify-center rounded-lg ${cfg.bgColor}`}>
                                      <FontAwesomeIcon icon={cfg.icon} className={`size-3 ${cfg.color}`} />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <p className="truncate text-[11px] font-medium leading-tight text-foreground/80">{cfg.label(event.actor)}</p>
                                      <p className="text-[9px] text-muted-foreground/50">{formatTimeAgo(now - event.at.getTime())}</p>
                                    </div>
                                  </div>

                                  {/* Round result card */}
                                  {event.roundResult && (
                                    <div className="mb-2 mt-1 overflow-hidden rounded-xl border border-border/40 bg-muted/20">

                                      {/* 2-col vote grid */}
                                      <div className="grid grid-cols-2 gap-1 p-2">
                                        {event.roundResult.votes.map((v) => {
                                          const chip = voteChipStyle(v.value)
                                          return (
                                            <div key={v.name} className={`flex items-center justify-between rounded-lg px-2 py-1 ${chip.bg}`}>
                                              <span className="max-w-[52px] truncate text-[9px] text-foreground/50">{v.name}</span>
                                              <span className={`text-[11px] font-bold tabular-nums ${chip.text}`}>{v.value}</span>
                                            </div>
                                          )
                                        })}
                                      </div>

                                      {/* Avg row */}
                                      <div className="flex items-center justify-between border-t border-border/30 bg-muted/20 px-3 py-2">
                                        <div>
                                          <p className="text-[8px] font-semibold uppercase tracking-widest text-muted-foreground/50">Average</p>
                                          <p className={`text-xl font-bold tabular-nums leading-tight ${avgStyle(event.roundResult.avg)}`}>
                                            {Number.isInteger(event.roundResult.avg) ? event.roundResult.avg : event.roundResult.avg.toFixed(1)}
                                          </p>
                                        </div>
                                        {/* Mini vote distribution bars */}
                                        <div className="flex items-end gap-0.5 h-7 pb-0.5">
                                          {(() => {
                                            const counts: Record<string, number> = {}
                                            event.roundResult!.votes.forEach(v => { counts[v.value] = (counts[v.value] ?? 0) + 1 })
                                            const maxCount = Math.max(...Object.values(counts))
                                            return Object.entries(counts)
                                              .sort(([, a], [, b]) => a - b)
                                              .map(([val, cnt]) => {
                                                const chip = voteChipStyle(val)
                                                const h = Math.max(4, Math.round((cnt / maxCount) * 20))
                                                return (
                                                  <div
                                                    key={val}
                                                    style={{ height: h }}
                                                    className={`w-2 rounded-sm ${chip.bg}`}
                                                    title={`${val}: ${cnt}`}
                                                  />
                                                )
                                              })
                                          })()}
                                        </div>
                                      </div>

                                    </div>
                                  )}
                                </div>
                              )
                            })
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* ── Members tab ── */}
                  {activeActivityTab === 'personal' && (
                    <div className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-2 py-2 min-h-0">
                      {personalEvents.length === 0 && (
                        <p className="mt-8 text-center text-[11px] text-muted-foreground/40">No activity yet</p>
                      )}
                      {[...personalEvents].reverse().map((event) => {
                        const palette = avatarPalette(event.actor ?? '')
                        return (
                          <div key={event.id} className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 transition-colors hover:bg-muted/30">
                            <div className={`flex size-7 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${palette}`}>
                              {event.actor?.[0]?.toUpperCase() ?? '?'}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-[11px] font-semibold text-foreground/80">{event.actor ?? 'Someone'}</p>
                              <p className="text-[9px] text-muted-foreground/50">{event.type === 'join' ? 'joined the room' : 'cast a vote'}</p>
                            </div>
                            <span className="flex-shrink-0 text-[9px] text-muted-foreground/40">{formatTimeAgo(now - event.at.getTime())}</span>
                          </div>
                        )
                      })}
                    </div>
                  )}

                </div>
              </div>
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
                        <span className="text-[11px] font-semibold text-primary/80 uppercase tracking-widest">Voted</span>
                      </>
                    ) : roomStatus === Status.Voting ? (
                      <>
                        <span className="size-1.5 rounded-full bg-muted-foreground/40 inline-block" />
                        <span className="text-[11px] font-medium text-muted-foreground/50 uppercase tracking-widest">Pick a card</span>
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
              setIsDraggingPanel(true)
              const onMove = (ev: MouseEvent) => {
                const next = Math.min(320, Math.max(160, startWidth + (startX - ev.clientX)))
                setPanelWidth(next)
              }
              const onUp = () => {
                setIsDraggingPanel(false)
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
          const me = sortedMembers.find((m) => m.id === id)
          const myVote = me?.estimatedValue && me.estimatedValue !== '' ? me.estimatedValue : null
          return (
            <button
              onClick={() => setIsPanelCollapsed(false)}
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
                        {picked && (isRevealed || member.id === id) ? (
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
                  onClick={() => {
                    navigator.clipboard.writeText(inviteLink)
                    setIsCopied(true)
                    setTimeout(() => setIsCopied(false), 3000)
                  }}
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
                  onClick={() => setIsPanelCollapsed(true)}
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
                    ref={member.id === id ? myCardRef : undefined}
                    data-panel-member-id={member.id}
                    className={`relative flex items-center rounded-xl border transition-all duration-200 ${
                      isCompact ? 'gap-2 px-2 py-1.5' : 'gap-3 px-3 py-2.5'
                    } ${
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
                    {picked && (isRevealed || member.id === id) ? (
                      <span className={`flex-shrink-0 rounded-md text-center font-bold tabular-nums ${
                        isCompact ? 'min-w-[20px] px-1 py-0.5 text-[10px]' : 'min-w-[24px] px-1.5 py-0.5 text-xs'
                      } ${
                        !isRevealed && member.id === id
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
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsMobilePlayersOpen(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 max-h-[75dvh] rounded-t-2xl border-t border-border/40 bg-background flex flex-col animate-in slide-in-from-bottom-4 duration-300">
            <div className="mx-auto mt-3 h-1 w-10 rounded-full bg-border/60 flex-shrink-0" />
            <div className="flex items-center justify-between px-5 py-4 flex-shrink-0">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">In Room</p>
                <p className="text-lg font-bold tabular-nums leading-tight">
                  {members.length} <span className="text-xs font-normal text-muted-foreground">players</span>
                </p>
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
                <button
                  onClick={() => setIsMobilePlayersOpen(false)}
                  className="flex size-7 items-center justify-center rounded-full bg-muted/40 text-muted-foreground"
                >
                  <FontAwesomeIcon icon={faXmark} className="size-3.5" />
                </button>
              </div>
            </div>
            {roomStatus === Status.Voting && members.length > 0 && (() => {
              const votedCount = members.filter(m => m.estimatedValue !== '').length
              return (
                <div className="px-5 pb-3 space-y-1.5 flex-shrink-0">
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
            <div className="flex flex-col gap-1.5 overflow-y-auto px-4 pb-8 flex-1 min-h-0">
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
                    className="relative flex items-center gap-3 rounded-xl border border-border/40 bg-muted/20 px-3 py-2.5"
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
