import { useUserInfoStore } from '@/store/zustand'
import React, { useEffect, useMemo, useState } from 'react'
import useWebSocket, { ReadyState } from 'react-use-websocket'
import JoinRoomDialog from '../JoinRoomDialog'
import GuestAvatar from '../GuestAvatar'
import { Member, Props } from './types'
import PokerCard from '../PokerCard'
import { Table } from '../Table'
import { Button } from '../ui/button'
import CorgiFeeling from '../CorgiFeeling'

enum Status {
  None = 'NONE',
  Voting = 'VOTING',
  RevealedCards = 'REVEALED_CARDS',
}

const CARD_OPTIONS = [0.5, 1, 1.5, 2, 3, 4, 5, 6]

const Room = ({ roomId }: Props) => {
  const { uid } = useUserInfoStore()
  const [openJoinRoomDialog, setOpenJoinRoomDialog] = useState(false)
  const [members, setMembers] = useState<Member[]>([])
  const [roomState, setRoomState] = useState<Status>(Status.None)
  const [cardChoosing, setCardChoosing] = useState<string | null>(null)
  const [averagePoints, setAveragePoints] = useState<number>(0)
  const socketUrl = `${process.env.NEXT_PUBLIC_WS_ENDPOINT}/room/${uid}/${roomId}`
  const { sendJsonMessage, lastMessage, readyState } = useWebSocket(socketUrl)

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
        lastActiveAt: member.last_active_at,
      }
    })
  }
  const maxPoint = useMemo(() => Math.max(...CARD_OPTIONS), [])

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
        const myEstimatedPoint =
          String(transformedMembers.find((member) => member.id === uid)?.estimatedPoint) ?? null
        setCardChoosing(myEstimatedPoint)
        setRoomState(payload.status)
        setAveragePoints(payload.avg_point)
        break
      default:
        break
    }
  }, [lastMessage, lastMessage?.data, roomState, uid])

  useEffect(() => {
    if (roomState === Status.None) return
    const interval = setInterval(() => {
      sendJsonMessage({ action: 'UPDATE_ACTIVE_USER' })
    }, 10_000)

    return () => {
      clearInterval(interval)
    }
  }, [roomState, sendJsonMessage])

  return (
    <>
      <div className="p-8 grid grid-cols-3 gap-y-10 items-start">
        <div data-section="room-members" className="flex gap-2 col-span-3 min-h-[200px]">
          {members.map(({ name, id, estimatedPoint }) => (
            <GuestAvatar
              name={name}
              key={id}
              estimatedPoint={estimatedPoint}
              isCardReveled={roomState === Status.RevealedCards}
              isShowingCard={estimatedPoint >= 0}
            />
          ))}
        </div>
        {roomState !== Status.None && (
          <>
            <div
              data-section="room-table"
              className="col-span-3 flex items-center flex-col gap-4 mb-3 min-h-[200px]"
            >
              {roomState === Status.Voting ? (
                <>
                  <Table />
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
                  <div className="flex flex-col items-end justify-end min-w-[120px] gap-5">
                    <p className="text-xl">{`Average: ${averagePoints} point`}</p>
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
    </>
  )
}

export default Room
