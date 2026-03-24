'use client'
import { faChair, faEye, faUserPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { usePathname, useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import useWebSocket, { ReadyState } from 'react-use-websocket'

import type { TicketEstimation } from '@/components/JiraIntegration'
import { TicketEstimationPicker, TicketQueuePanel } from '@/components/JiraIntegration'
import { TicketInfoDialog } from '@/components/JiraIntegration/TicketInfoDialog'
import { useToast } from '@/components/ui/use-toast'
import { useLoadingStore, useUserInfoStore } from '@/store/zustand'

import Dialog from '../common/Dialog'
import { Footer } from '../Footer'
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
  // Stable refs used inside the onMessage callback so we never re-create the
  // WebSocket options object on re-renders.
  const isSpectatorRef = useRef(false)
  // handleMessageRef is populated via useLayoutEffect after each render so it
  // always points to the freshest closure without being in any dep array.
  const handleMessageRef = useRef<((event: MessageEvent) => void) | null>(null)
  const { sendJsonMessage, readyState } = useWebSocket(socketUrl, {
    shouldReconnect: (_closeEvent) => true,
    reconnectAttempts: 5,
    onReconnectStop: (_attempt) => {
      setLoadingOpen(false)
      setOpenRefreshDialog(true)
    },
    onMessage: (event) => { handleMessageRef.current?.(event) },
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
  // Stable refs so effects and callbacks always see the latest values without
  // requiring them in dependency arrays.
  const fireRemoteRef = useRef(launcher.fireRemote)
  useLayoutEffect(() => { fireRemoteRef.current = launcher.fireRemote })
  useLayoutEffect(() => { isSpectatorRef.current = isSpectator }, [isSpectator])
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
  const [ticketQueue, setTicketQueue] = useState<TicketEstimation[]>([])
  const [finalStoryPoint, setFinalStoryPoint] = useState<string>('')
  const [isJiraConnected, setIsJiraConnected] = useState(false)
  const [jiraPointOverride, setJiraPointOverride] = useState<{ key: string; value: number } | null>(null)
  const [cloudId, setCloudId] = useState('')
  const [jiraSiteUrl, setJiraSiteUrl] = useState('')
  const [isJiraPickerOpen, setIsJiraPickerOpen] = useState(false)
  const [isRemoveTicketConfirmOpen, setIsRemoveTicketConfirmOpen] = useState(false)
  const [ticketInfoOpen, setTicketInfoOpen] = useState(false)
  const [ticketInfoTarget, setTicketInfoTarget] = useState<TicketEstimation | null>(null)

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 30_000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])



  useEffect(() => {
    const checkJiraStatus = () => {
      fetch('/api/jira/status')
        .then((r) => r.json())
        .then((data) => {
          if (data.connected) {
            setIsJiraConnected(true)
            setCloudId(data.cloudId ?? '')
            setJiraSiteUrl(data.siteUrl ?? '')
          } else {
            setIsJiraConnected(false)
          }
        })
        .catch(() => {})
    }
    checkJiraStatus()
    // Re-check every 45 min so the access token (1 h TTL) stays fresh
    const timer = setInterval(checkJiraStatus, 45 * 60 * 1000)
    return () => clearInterval(timer)
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
  const maxPoint = Math.max(...cardOptions.map((option) => Number(option)).filter((option) => !!option))

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

  // Keep handleMessageRef pointing to the latest closure on every render so
  // the stable onMessage callback always has access to current state/props.
  useLayoutEffect(() => {
    handleMessageRef.current = (event: MessageEvent) => {
      const jsonMessage = JSON.parse(event.data)
      const action = jsonMessage.action
      switch (action) {
        case 'NEED_TO_JOIN':
          if (!isSpectatorRef.current) setOpenJoinRoomDialog(true)
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

          fireRemoteRef.current(emoji, fromX, fromY, targetX, targetY)
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
        case 'UPDATE_ROOM': {
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
          setFinalStoryPoint(payload.final_story_point ?? '')
          if (payload.ticket_queue !== undefined) {
            const serverQueue: TicketEstimation[] = payload.ticket_queue ?? []
            setTicketQueue((prev) =>
              serverQueue.map((serverTicket: TicketEstimation) => {
                const key = serverTicket.jiraKey ?? serverTicket.name
                const local = prev.find((t) => (t.jiraKey ?? t.name) === key)
                // Don't overwrite local optimistic finalScore/avgScore if the server
                // broadcast hasn't caught up yet (race between SET_FINAL_STORY_POINT
                // and SET_TICKET_QUEUE causing a visible blink).
                if (local?.finalScore && !serverTicket.finalScore) {
                  return { ...serverTicket, finalScore: local.finalScore, avgScore: local.avgScore ?? serverTicket.avgScore }
                }
                if (local?.avgScore && !serverTicket.avgScore) {
                  return { ...serverTicket, avgScore: local.avgScore }
                }
                return serverTicket
              }),
            )
          }

          if (isNewRound && Array.isArray(payload.ticket_queue)) {
            // On new round: always pick the first pending (not-yet-voted) ticket from the queue.
            // This is the source of truth — ignore backend's ticket_estimation to avoid race conditions.
            const firstPending = payload.ticket_queue.find((t: any) => !t.avgScore && !t.finalScore)
            setTicketEstimation(firstPending ?? null)
            if (firstPending) {
              sendJsonMessage({ action: 'SET_TICKET_ESTIMATION', payload: { ticketEstimation: firstPending } })
            }
          } else {
            setTicketEstimation(payload.ticket_estimation ?? null)
          }

          {
            const prevMembers = prevMembersRef.current
            const prevStatus = prevRoomStatusRef.current
            const ts = new Date()
            const addEvent = (ev: Omit<ActivityEvent, 'id'>) =>
              setActivityLog((prev) => [...prev.slice(-200), { ...ev, id: `${ev.type}-${ts.getTime()}-${Math.random()}` }])

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

              // Stamp avgScore on the active ticket in the queue.
              const currentQueue: TicketEstimation[] = payload.ticket_queue ?? []
              const currentEstimation: TicketEstimation | null = payload.ticket_estimation ?? null
              if (currentEstimation && currentQueue.length > 0) {
                const estKey = currentEstimation.jiraKey ?? currentEstimation.name
                const roundedAvg = Math.round(avg * 10) / 10
                const stamped = currentQueue.map((t: TicketEstimation) =>
                  (t.jiraKey ?? t.name) === estKey ? { ...t, avgScore: roundedAvg } : t,
                )
                setTicketQueue(stamped)
                sendJsonMessage({ action: 'SET_TICKET_QUEUE', payload: { ticketQueue: stamped } })
              }
            }

            if (prevStatus === Status.RevealedCards && newRoomState === Status.Voting) {
              addEvent({ type: 'reset', actor: pendingActionActorRef.current ?? undefined, at: ts })
              pendingActionActorRef.current = null
            }

            prevMembersRef.current = transformedMembers
            prevRoomStatusRef.current = newRoomState
          }
          break
        }
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
    }
  })

  const handleJiraConnected = () => {
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
  }

  const handleJiraDisconnected = () => {
    setIsJiraConnected(false)
    setCloudId('')
    // Ticket stays visible for all — disconnect only clears local Jira connection
  }

  const handleSetFinalStoryPoint = (value: string) => {
    sendJsonMessage({ action: 'SET_FINAL_STORY_POINT', payload: { value } })
    // Stamp finalScore + avgScore on the active ticket in the queue immediately
    // (event-handler update — avoids a derived-state useEffect).
    if (ticketEstimation && ticketQueue.length > 0) {
      const estKey = ticketEstimation.jiraKey ?? ticketEstimation.name
      const numericVotes = members
        .filter((m) => m.estimatedValue !== '')
        .map((m) => Number(m.estimatedValue))
        .filter((v) => !isNaN(v) && isFinite(v))
      const avg =
        numericVotes.length > 0
          ? Math.round((numericVotes.reduce((a, v) => a + v, 0) / numericVotes.length) * 10) / 10
          : 0
      const updated = ticketQueue.map((t) =>
        (t.jiraKey ?? t.name) === estKey ? { ...t, avgScore: avg, finalScore: value } : t,
      )
      setTicketQueue(updated)
      sendJsonMessage({ action: 'SET_TICKET_QUEUE', payload: { ticketQueue: updated } })
    }
  }

  const handleRemoveTicket = () => {
    setIsRemoveTicketConfirmOpen(true)
  }

  const handleConfirmRemoveTicket = () => {
    setIsRemoveTicketConfirmOpen(false)
    if (!ticketEstimation) return
    const key = ticketEstimation.jiraKey ?? ticketEstimation.name
    const updated = ticketQueue.filter((t) => (t.jiraKey ?? t.name) !== key)
    const next = updated.find((t) => !t.avgScore && !t.finalScore) ?? null
    setTicketQueue(updated)
    setTicketEstimation(next)
    sendJsonMessage({ action: 'SET_TICKET_QUEUE', payload: { ticketQueue: updated } })
    sendJsonMessage({ action: 'SET_TICKET_ESTIMATION', payload: { ticketEstimation: next } })
  }

  const handleTicketSelect = (estimation: TicketEstimation) => {
    const isVoted = !!estimation.avgScore || !!estimation.finalScore

    if (isVoted) {
      // Clear the ticket's scores so it's treated as unvoted
      const key = estimation.jiraKey ?? estimation.name
      const cleared = { ...estimation, avgScore: 0, finalScore: '' }
      const updated = ticketQueue.map((t) =>
        (t.jiraKey ?? t.name) === key ? cleared : t,
      )
      setTicketEstimation(cleared)
      setTicketQueue(updated)
      sendJsonMessage({ action: 'SET_TICKET_QUEUE', payload: { ticketQueue: updated } })

      if (roomStatus === Status.RevealedCards) {
        // In revealed state, clicking a voted ticket must start a new round first,
        // then explicitly set this ticket (overrides backend's auto-select from Restart())
        pendingActionActorRef.current = members.find((m) => m.id === id)?.name ?? null
        sendJsonMessage({ action: 'RESET_ROOM' })
      }
      sendJsonMessage({ action: 'SET_TICKET_ESTIMATION', payload: { ticketEstimation: cleared } })
    } else {
      setTicketEstimation(estimation)
      sendJsonMessage({ action: 'SET_TICKET_ESTIMATION', payload: { ticketEstimation: estimation } })
    }
  }

  const handleTicketQueueSelect = (estimations: TicketEstimation[]) => {
    if (estimations.length === 0) return
    const merged = [...ticketQueue]
    for (const est of estimations) {
      const key = est.jiraKey ?? est.name
      const alreadyExists = merged.some((t) => (t.jiraKey ?? t.name) === key)
      if (!alreadyExists) merged.push(est)
    }
    setTicketQueue(merged)
    sendJsonMessage({ action: 'SET_TICKET_QUEUE', payload: { ticketQueue: merged } })
    setIsJiraPickerOpen(false)
  }

  const handleQueueUpdate = (newQueue: TicketEstimation[]) => {
    if (roomStatus !== Status.RevealedCards) {
      const firstUnvoted = newQueue.find((t) => !t.avgScore && !t.finalScore)
      const newKey = firstUnvoted?.jiraKey ?? firstUnvoted?.name
      const currentKey = ticketEstimation?.jiraKey ?? ticketEstimation?.name
      if (firstUnvoted && newKey !== currentKey) {
        setTicketQueue(newQueue)
        setTicketEstimation(firstUnvoted)
        sendJsonMessage({ action: 'SET_TICKET_QUEUE_WITH_ESTIMATION', payload: { ticketQueue: newQueue, ticketEstimation: firstUnvoted } })
        return
      }
    }
    setTicketQueue(newQueue)
    sendJsonMessage({ action: 'SET_TICKET_QUEUE', payload: { ticketQueue: newQueue } })
  }

  const handleRevote = (cleaned: TicketEstimation, cleanedQueue: TicketEstimation[]) => {
    setTicketQueue(cleanedQueue)
    setTicketEstimation(cleaned)
    if (roomStatus === Status.RevealedCards) {
      pendingActionActorRef.current = members.find((m) => m.id === id)?.name ?? null
      sendJsonMessage({ action: 'RESET_ROOM' })
    }
    sendJsonMessage({ action: 'SET_TICKET_QUEUE_WITH_ESTIMATION', payload: { ticketQueue: cleanedQueue, ticketEstimation: cleaned } })
  }

  async function handleSaveToJira(estimation: TicketEstimation, value: number, fieldId: string) {
    const res = await fetch(`/api/jira/issues/${estimation.jiraKey}/estimate`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cloudId: estimation.jiraCloudId, value, storyPointsField: fieldId }),
    })
    if (!res.ok) throw new Error('save failed')
    if (estimation.jiraKey) setJiraPointOverride({ key: estimation.jiraKey, value })
  }

  function openTicketInfo(ticket: TicketEstimation) {
    setTicketInfoTarget(ticket)
    setTicketInfoOpen(true)
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

  const { roundGroups, personalEvents } = (() => {
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
  })()

  const [isQueueCollapsed, setIsQueueCollapsed] = useState(false)
  const [queuePanelExpandedWidth, setQueuePanelExpandedWidth] = useState(240)
  const [isDraggingQueuePanel, setIsDraggingQueuePanel] = useState(false)
  const queuePanelWidth = isQueueCollapsed ? 40 : queuePanelExpandedWidth

  return (
    <>
        {/* ── Main column ── */}
        <div
          className={`flex flex-1 flex-col min-w-0 overflow-x-hidden ${!isDraggingPanel && !isDraggingQueuePanel ? 'transition-[padding] duration-300' : ''} ${isPanelCollapsed ? 'md:pr-10' : panelWidth === 200 ? 'md:pr-[200px]' : ''}`}
          style={{
            ...((!isPanelCollapsed && panelWidth !== 200) ? { paddingRight: panelWidth } : {}),
            paddingLeft: queuePanelWidth > 0 ? queuePanelWidth : undefined,
          }}
        >

          {/* Table centered in available space */}
          <div
            className="relative flex flex-1 min-h-0 flex-col items-center justify-center pt-6 pb-2 w-full overflow-hidden"
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
                ticketQueue={ticketQueue}
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
                onOpenTicketInfo={openTicketInfo}
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

          {/* Cards bar — inside main column, naturally sits below the table */}
          {roomStatus !== Status.None && (
          <div className="flex-shrink-0 border-t border-border/30 bg-background/95 backdrop-blur-md w-full">
          <div className="px-4 pb-5 pt-3">
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
                    if (roomStatus === Status.RevealedCards && !isEditPointMode) {
                      pendingActionActorRef.current = members.find((m) => m.id === id)?.name ?? null
                      sendJsonMessage({ action: 'RESET_ROOM' })
                      sendJsonMessage({ action: 'UPDATE_ESTIMATED_VALUE', payload: { value } })
                      setCardChoosing(value)
                      setIsEditEstimateValue(false)
                    } else {
                      setCardChoosing(value)
                      sendJsonMessage({ action: 'UPDATE_ESTIMATED_VALUE', payload: { value } })
                      setIsEditEstimateValue(false)
                    }
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

          <Footer status={readyState === ReadyState.OPEN ? 'available' : readyState === ReadyState.CONNECTING ? 'connecting' : 'unavailable'} />

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
        roomId={roomId ?? ''}
        currentQueueSize={ticketQueue.length}
        existingQueue={ticketQueue}
        onSelect={handleTicketQueueSelect}
        onJiraConnected={handleJiraConnected}
        onJiraDisconnected={handleJiraDisconnected}
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
      <TicketQueuePanel
        queue={ticketQueue}
        activeKey={ticketEstimation?.jiraKey ?? ticketEstimation?.name ?? null}
        panelWidth={queuePanelExpandedWidth}
        isCollapsed={isQueueCollapsed}
        isDragging={isDraggingQueuePanel}
        isJiraConnected={isJiraConnected}
        isSpectator={isSpectator}
        roomId={roomId ?? ''}
        onCollapse={setIsQueueCollapsed}
        onWidthChange={setQueuePanelExpandedWidth}
        onDragStart={() => setIsDraggingQueuePanel(true)}
        onDragEnd={() => setIsDraggingQueuePanel(false)}
        onSelectTicket={handleTicketSelect}
        onQueueChange={handleQueueUpdate}
        onRevoteTicket={handleRevote}
        onAdd={() => setIsJiraPickerOpen(true)}
        onJiraConnected={handleJiraConnected}
        onJiraDisconnected={handleJiraDisconnected}
        onSaveToJira={handleSaveToJira}
        jiraPointOverride={jiraPointOverride}
        onOpenTicketInfo={openTicketInfo}
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
        open={isRemoveTicketConfirmOpen}
        title="Remove ticket"
        content="Remove this ticket from the queue?"
        action={
          <>
            <Button variant="outline" onClick={() => setIsRemoveTicketConfirmOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleConfirmRemoveTicket}>Remove</Button>
          </>
        }
      />

      <TicketInfoDialog
        ticket={ticketInfoTarget}
        open={ticketInfoOpen}
        onOpenChange={setTicketInfoOpen}
        cloudId={cloudId}
      />

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
