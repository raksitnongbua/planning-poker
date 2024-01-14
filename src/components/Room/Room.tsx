import { useLoadingStore, useUserInfoStore } from '@/store/zustand'
import React, { useEffect, useMemo, useState } from 'react'
import useWebSocket, { ReadyState } from 'react-use-websocket'
import JoinRoomDialog from '../JoinRoomDialog'
import GuestAvatar from '../GuestAvatar'
import { Member, Props } from './types'
import PokerCard from '../PokerCard'
import { Table } from '../Table'
import { Button } from '../ui/button'
import CorgiFeeling from '../CorgiFeeling'
import { ActiveStatus } from '../GuestAvatar/types'
import { InviteButton } from '../InviteButton'
import { usePathname, useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'
import Dialog from '../common/Dialog'

enum Status {
  None = 'NONE',
  Voting = 'VOTING',
  RevealedCards = 'REVEALED_CARDS',
}

const CARD_OPTIONS = [0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 6]
const TIME_SECOND = 1000
const TIME_MINUTE = 60

const Room = ({ roomId }: Props) => {
  const { uid } = useUserInfoStore()
  const socketUrl = `${process.env.NEXT_PUBLIC_WS_ENDPOINT}/room/${uid}/${roomId}`
  const { sendJsonMessage, lastMessage, readyState } = useWebSocket(socketUrl)
  const { toast } = useToast()
  const pathname = usePathname()
  const router = useRouter()
  const { setLoadingOpen } = useLoadingStore()

  const [openJoinRoomDialog, setOpenJoinRoomDialog] = useState(false)
  const [members, setMembers] = useState<Member[]>([])
  const [roomState, setRoomState] = useState<Status>(Status.None)
  const [cardChoosing, setCardChoosing] = useState<string | null>(null)
  const [averagePoints, setAveragePoints] = useState<number>(0)
  const [roomName, setRoomName] = useState<string>('')
  const [openRefreshDialog, setOpenRefreshDialog] = useState(false)
  const [me, setMe] = useState<Member | null>(null)

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState]

  const handleClickJoinRoom = (name: string) => {
    sendJsonMessage({ action: 'JOIN_ROOM', payload: { name } })
    setOpenJoinRoomDialog(false)
  }

  const transformMembers = (members: []): Member[] => {
    return members.map((member: any) => {
      return {
        id: member.id,
        name: member.name,
        estimatedPoint: member.estimated_point,
        lastActiveAt: new Date(member.last_active_at),
      }
    })
  }
  const maxPoint = useMemo(() => Math.max(...CARD_OPTIONS), [])

  useEffect(() => {
    switch (readyState) {
      case ReadyState.CONNECTING:
        setLoadingOpen(true)
        break
      case ReadyState.OPEN:
        setLoadingOpen(false)
        break
      case ReadyState.CLOSED:
        setOpenRefreshDialog(true)
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
        setOpenJoinRoomDialog(true)
        break
      case 'UPDATE_ROOM':
        const payload = jsonMessage.payload
        const transformedMembers = transformMembers(payload.members ?? [])
        setMembers(transformedMembers)
        const meData = transformedMembers.find((member) => member.id === uid)
        setMe(meData ?? null)
        const myEstimatedPoint = String(meData?.estimatedPoint) ?? null
        setCardChoosing(myEstimatedPoint)
        setRoomState(payload.status)
        setAveragePoints(payload.avg_point)
        setRoomName(payload.name)
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
  }, [lastMessage, lastMessage?.data, roomState, router, toast, uid])

  useEffect(() => {
    if (roomState === Status.None || !me) return
    console.log('🚀 ~ useEffect ~ me:', me)

    const interval = setInterval(() => {
      sendJsonMessage({ action: 'UPDATE_ACTIVE_USER' })
    }, 10_000)

    return () => {
      clearInterval(interval)
    }
  }, [me, roomState, sendJsonMessage])

  const getActiveStatus = (lastActiveAt: Date): ActiveStatus => {
    const secDiff = (Date.now() - lastActiveAt.getTime()) / TIME_SECOND

    if (secDiff <= 15) {
      return ActiveStatus.Active
    } else if (secDiff <= 5 * TIME_MINUTE) {
      return ActiveStatus.Busy
    } else {
      return ActiveStatus.Inactive
    }
  }

  return (
    <>
      <div className="p-8 grid grid-cols-3 gap-y-10 items-start min-w-[600px]">
        <div data-section="room-members" className="flex gap-2 col-span-3 min-h-[200px]">
          {members.map(({ name, id, estimatedPoint, lastActiveAt }) => (
            <GuestAvatar
              name={name}
              key={id}
              estimatedPoint={estimatedPoint}
              isCardReveled={roomState === Status.RevealedCards}
              isShowingCard={estimatedPoint >= 0}
              activeStatus={getActiveStatus(lastActiveAt)}
            />
          ))}
          <InviteButton
            onClick={() => {
              navigator.clipboard.writeText(window.location.origin + pathname)
              toast({
                title: 'Invite link copied to clipboard',
              })
            }}
          />
        </div>
        {roomState !== Status.None && (
          <>
            <div
              data-section="room-table"
              className="col-span-3 flex items-center flex-col gap-4 mb-3 min-h-[200px]"
            >
              {roomState === Status.Voting ? (
                <>
                  <Table name={roomName} />
                  <div>
                    {members.some((member) => member.estimatedPoint >= 0) && (
                      <Button
                        variant="outline"
                        className="text-orange-400 border-orange-400 hover:text-orange-300 hover:text-orange-300"
                        onClick={() => {
                          sendJsonMessage({ action: 'REVEAL_CARDS' })
                        }}
                      >
                        REVEAL
                      </Button>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="h-[180px] w-[200px] flex justify-center">
                    <CorgiFeeling badlyPercentage={(averagePoints / maxPoint) * 100} />
                  </div>
                  <div className="flex flex-col justify-end min-w-[120px] gap-5">
                    <p className="text-2xl min-w-[200px]">{`Average: ${averagePoints.toFixed(2)} point`}</p>
                    <Button
                      variant="outline"
                      className="text-orange-400 border-orange-400 hover:text-orange-300 hover:text-orange-300"
                      onClick={() => {
                        sendJsonMessage({ action: 'RESET_ROOM' })
                      }}
                    >
                      CLEAR
                    </Button>
                  </div>
                </div>
              )}
            </div>
            <div
              data-section="room-cards"
              className="h-36 mx-auto col-span-3 justify-center gap-2 flex flex-col"
            >
              <div className="grid grid-flow-col auto-cols-fr content-end gap-4">
                {CARD_OPTIONS.map((label) => (
                  <PokerCard
                    key={`card-${label}`}
                    label={String(label)}
                    id={String(label)}
                    isRevealed={[Status.RevealedCards, Status.Voting].includes(roomState)}
                    onClick={(id) => {
                      sendJsonMessage({
                        action: 'UPDATE_ESTIMATED_POINT',
                        payload: { point: Number(id) },
                      })
                    }}
                    isChosen={cardChoosing === String(label)}
                  />
                ))}
              </div>
            </div>
          </>
        )}
        <p className="text-xs text-muted-foreground fixed bottom-2 right-2">
          The WebSocket is currently {connectionStatus}
        </p>
      </div>

      <JoinRoomDialog open={openJoinRoomDialog} onClickConfirm={handleClickJoinRoom} />
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
