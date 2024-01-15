'use client'
import { useLoadingStore, useUserInfoStore } from '@/store/zustand'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import useWebSocket, { ReadyState } from 'react-use-websocket'
import JoinRoomDialog from '../JoinRoomDialog'
import { Member, Props, Status } from './types'
import { Button } from '../ui/button'

import { usePathname, useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'
import Dialog from '../common/Dialog'
import RoomMembers from '../RoomMembers'
import RoomTable from '../RoomTable'
import RoomCards from '../RoomCards'

const CARD_OPTIONS = [0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 6]

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
  const [roomStatus, setRoomStatus] = useState<Status>(Status.None)
  const [cardChoosing, setCardChoosing] = useState<number | null>(null)
  const [averagePoint, setAveragePoints] = useState<number>(0)
  const [roomName, setRoomName] = useState<string>('')
  const [openRefreshDialog, setOpenRefreshDialog] = useState(false)
  const [me, setMe] = useState<Member | null>(null)
  const [isEditPointMode, setIsEditPointMode] = useState<boolean>(false)
  const updateUserActiveRef = useRef<NodeJS.Timeout>()

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
        const myEstimatedPoint = meData?.estimatedPoint ?? null
        setCardChoosing(myEstimatedPoint)
        const newRoomState = payload.status
        setRoomStatus(newRoomState)
        if (newRoomState === Status.Voting) {
          setIsEditPointMode(false)
        }
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
  }, [lastMessage, lastMessage?.data, roomStatus, router, toast, uid])

  useEffect(() => {
    if (roomStatus === Status.None || !me?.id || updateUserActiveRef.current) return

    sendJsonMessage({ action: 'UPDATE_ACTIVE_USER' })

    updateUserActiveRef.current = setInterval(() => {
      sendJsonMessage({ action: 'UPDATE_ACTIVE_USER' })
    }, 10_000)

    return () => {
      clearInterval(updateUserActiveRef.current)
    }
  }, [roomStatus, sendJsonMessage, me?.id])
  return (
    <>
      <div className="px-2 sm:px-8 grid grid-cols-3 gap-y-2 items-start min-w-[600px]">
        <RoomMembers
          members={members}
          isCardReveled={roomStatus === Status.RevealedCards}
          inviteLink={process.env.NEXT_PUBLIC_ORIGIN_URL + pathname}
        />
        {roomStatus !== Status.None && (
          <>
            <RoomTable
              averagePoint={averagePoint}
              isRevealable={members.some((member) => member.estimatedPoint >= 0)}
              maxPoint={maxPoint}
              onClickResetRoom={() => {
                sendJsonMessage({ action: 'RESET_ROOM' })
              }}
              onClickRevealCards={() => {
                sendJsonMessage({ action: 'REVEAL_CARDS' })
              }}
              roomName={roomName}
              status={roomStatus}
            />
            <RoomCards
              cardChoosing={cardChoosing ?? -1}
              cardOptions={CARD_OPTIONS}
              isEditPointMode={isEditPointMode}
              onClickFlipCards={() => setIsEditPointMode((preVal) => !preVal)}
              onClickVote={(value) => {
                sendJsonMessage({
                  action: 'UPDATE_ESTIMATED_POINT',
                  payload: { point: value },
                })
                setIsEditPointMode(false)
              }}
              status={roomStatus}
            />
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
