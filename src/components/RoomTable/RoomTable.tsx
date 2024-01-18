import React from 'react'
import CorgiFeeling from '../CorgiFeeling'
import { Table } from '../Table'
import { Button } from '../ui/button'
import { Status } from '../Room/types'

export interface RoomTableProps {
  averagePoint: number
  isRevealable: boolean
  maxPoint: number
  onClickResetRoom: () => void
  onClickRevealCards: () => void
  roomName: string
  status: Status
}

const RoomTable: React.FC<RoomTableProps> = ({
  averagePoint,
  isRevealable,
  maxPoint,
  onClickResetRoom,
  onClickRevealCards,
  roomName,
  status,
}) => {
  return (
    <div
      data-section="room-table"
      className="col-span-3 flex items-center flex-col gap-4 mb-3 min-h-[200px]"
    >
      {status === Status.Voting ? (
        <>
          <Table name={roomName} />
          <div>
            {isRevealable && (
              <Button
                variant="outline"
                className="text-orange-400 border-orange-400 hover:text-orange-300 hover:text-orange-300"
                onClick={onClickRevealCards}
              >
                REVEAL
              </Button>
            )}
          </div>
        </>
      ) : (
        <div className="flex items-center gap-3">
          <div className="h-[180px] w-[200px] flex justify-center">
            <CorgiFeeling badlyPercentage={(averagePoint / maxPoint) * 100} />
          </div>
          <div className="flex flex-col justify-end min-w-[120px] gap-5">
            <p className="text-2xl min-w-[200px]">{`Average: ${averagePoint.toFixed(2)} point`}</p>
            <Button
              variant="outline"
              className="text-orange-400 border-orange-400 hover:text-orange-300 hover:text-orange-300"
              onClick={onClickResetRoom}
            >
              CLEAR
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default RoomTable
