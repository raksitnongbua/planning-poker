'use client'
import { usePathname, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import React, { useEffect, useMemo, useState } from 'react'
import useWebSocket, { ReadyState } from 'react-use-websocket'

import { useToast } from '@/components/ui/use-toast'
import { useLoadingStore, useUserInfoStore } from '@/store/zustand'

import Dialog from '../common/Dialog'
import JoinRoomDialog from '../JoinRoomDialog'
import RoomCards from '../RoomCards'
import RoomMembers from '../RoomMembers'
import RoomTable from '../RoomTable'
import { Button } from '../ui/button'
import { Member, Props, Status } from './types'

const Room = ({ roomId }: Props) => {
  const { uid } = useUserInfoStore()
  const { data: session } = useSession()

  const id = session?.user?.id ?? uid

  const socketUrl = `${process.env.NEXT_PUBLIC_WS_ENDPOINT}/room/${id}/${roomId}`
  const { sendJsonMessage, lastMessage, readyState } = useWebSocket(socketUrl)
  const { toast } = useToast()
  const pathname = usePathname()
  const router = useRouter()
  const { setLoadingOpen } = useLoadingStore()

  const [openJoinRoomDialog, setOpenJoinRoomDialog] = useState(false)
  const [members, setMembers] = useState<Member[]>([])
  const [roomStatus, setRoomStatus] = useState<Status>(Status.None)
  const [cardChoosing, setCardChoosing] = useState<string | null>(null)
  const [roomName, setRoomName] = useState<string>('')
  const [openRefreshDialog, setOpenRefreshDialog] = useState(false)
  const [isEditPointMode, setIsEditEstimateValue] = useState<boolean>(false)
  const [cardOptions, setCardOptions] = useState<string[]>([])
  const [result, setResult] = useState<Map<string, number>>(new Map<string, number>())

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState]

  const handleClickJoinRoom = (name: string) => {
    const profile = session?.user?.image ?? ''
    sendJsonMessage({ action: 'JOIN_ROOM', payload: { name, profile } })
    setOpenJoinRoomDialog(false)
  }

  const transformMembers = (members: []): Member[] => {
    return members.map((member: any) => {
      return {
        id: member.id,
        name: member.name,
        estimatedValue: member.estimated_value,
        lastActiveAt: new Date(member.last_active_at),
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
  }, [lastMessage, lastMessage?.data, roomStatus, router, toast, uid])

  return (
    <>
      <div className="grid min-w-[600px] grid-cols-3 items-start gap-y-2 px-2 sm:px-8">
        <RoomMembers
          members={members}
          isCardReveled={roomStatus === Status.RevealedCards}
          inviteLink={process.env.NEXT_PUBLIC_ORIGIN_URL + pathname}
        />
        {roomStatus !== Status.None && (
          <>
            <RoomTable
              result={result}
              isRevealable={members.some((member) => member.estimatedValue !== '')}
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
              cardChoosing={String(cardChoosing) ?? '-1'}
              cardOptions={cardOptions}
              isEditPointMode={isEditPointMode}
              onClickFlipCards={() => setIsEditEstimateValue((preVal) => !preVal)}
              onClickVote={(value) => {
                sendJsonMessage({
                  action: 'UPDATE_ESTIMATED_VALUE',
                  payload: { value },
                })
                setIsEditEstimateValue(false)
              }}
              status={roomStatus}
            />
          </>
        )}
        <p className="fixed bottom-2 right-2 text-xs text-muted-foreground">
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
