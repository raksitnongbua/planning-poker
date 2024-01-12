import { useUserInfoStore } from '@/store/zustand'
import React, { useEffect, useState } from 'react'
import useWebSocket, { ReadyState } from 'react-use-websocket'
import JoinRoomDialog from '../JoinRoomDialog'
import GuestAvatar from '../GuestAvatar'
import { Member, Props } from './types'
import PokerCard from '../PokerCard'
import { Table } from '../Table'
import { Button } from '../ui/button'

enum Status {
  None,
  Ready,
  Voting,
  Summary,
}

const CARD_OPTIONS = [0.5, 1, 2, 3, 4, 5, 6]

const Room = ({ roomId }: Props) => {
  const { uid } = useUserInfoStore()
  const [openJoinRoomDialog, setOpenJoinRoomDialog] = useState(false)
  const [members, setMembers] = useState<Member[]>([])
  const [roomState, setRoomState] = useState<Status>(Status.None)
  const [isRevealedCard, setIsRevealedCard] = useState(false)
  const [cardChoosing, setCardChoosing] = useState<string | null>(null)

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
    sendJsonMessage({ action: 'JOIN_ROOM', payload: { uid, name } })
    setOpenJoinRoomDialog(false)
  }

  useEffect(() => {
    const isSocketOpen = connectionStatus[readyState] === connectionStatus[ReadyState.OPEN]
    if (isSocketOpen) {
      setRoomState(Status.Ready)
      //TODO: move this function hook into websocket action
      setIsRevealedCard(true)
    }
  }, [connectionStatus, readyState])

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
        if (payload.members) {
          setMembers(payload.members)
        }
        break
      default:
        break
    }
  }, [lastMessage, lastMessage?.data, roomState])

  const handleClearClick = () => {
    setCardChoosing(null)
  }

  return (
    <>
      <div className="p-8 grid grid-cols-3 gap-y-24">
        <div data-section="room-members" className="flex gap-2 col-span-3 min-h-[96px]">
          {members.map(({ name, id }) => (
            <GuestAvatar name={name} key={id} />
          ))}
        </div>
        {roomState !== Status.None && (
          <>
            <div data-section="room-table" className="col-span-3 flex justify-center">
              <Table />
            </div>
            <div
              data-section="room-cards"
              className="max-w-96 h-36 mx-auto col-span-3 justify-center gap-2 flex flex-col"
            >
              <div className="grid grid-flow-col auto-cols-fr content-end gap-2">
                {CARD_OPTIONS.map((label) => (
                  <PokerCard
                    key={`card-${label}`}
                    label={String(label)}
                    id={String(label)}
                    isRevealed={isRevealedCard}
                    onClick={(id) => {
                      setCardChoosing(id)
                    }}
                    isChosen={cardChoosing === String(label)}
                  />
                ))}
              </div>
              <div className="min-h-14 self-end">
                {cardChoosing !== null && (
                  <Button size="sm" variant="outline" onClick={handleClearClick}>
                    OK
                  </Button>
                )}
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
