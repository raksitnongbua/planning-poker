import React, { useMemo } from 'react'

import CorgiFeeling from '../CorgiFeeling'
import { Status } from '../Room/types'
import { Table } from '../Table'
import { Button } from '../ui/button'

export interface RoomTableProps {
  result: Map<string, number>
  isRevealable: boolean
  maxPoint: number
  onClickResetRoom: () => void
  onClickRevealCards: () => void
  roomName: string
  status: Status
}

const RoomTable: React.FC<RoomTableProps> = ({
  result,
  isRevealable,
  maxPoint,
  onClickResetRoom,
  onClickRevealCards,
  roomName,
  status,
}) => {
  const averagePoint = useMemo(() => {
    let votingCount = 0
    let summaryPoint = 0
    result.forEach((value, key) => {
      summaryPoint += Number(key) * value
      votingCount += value
    })

    return summaryPoint / votingCount
  }, [result])

  return (
    <div
      data-section="room-table"
      className="col-span-3 mb-3 flex min-h-[200px] flex-col items-center gap-4"
    >
      {status === Status.Voting ? (
        <>
          <Table name={roomName} />
          <div>
            {isRevealable && (
              <Button
                variant="outline"
                className="border-orange-400 text-orange-400 hover:text-orange-300"
                onClick={onClickRevealCards}
              >
                REVEAL
              </Button>
            )}
          </div>
        </>
      ) : (
        <div className="flex items-center gap-3">
          <div className="flex h-[180px] w-[200px] justify-center">
            <CorgiFeeling badlyPercentage={(averagePoint / maxPoint) * 100} />
          </div>
          <div className="flex min-w-[120px] flex-col justify-end gap-5">
            <p className="min-w-[200px] text-2xl">{`Average: ${averagePoint.toFixed(2)} point`}</p>
            <Button
              variant="outline"
              className="border-orange-400 text-orange-400 hover:text-orange-300"
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
