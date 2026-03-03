import React, { useEffect, useMemo, useState } from 'react'

import CorgiFeeling from '../CorgiFeeling'
import { Member, Status } from '../Room/types'
import { Table } from '../Table'

export interface RoomTableProps {
  result: Map<string, number>
  maxPoint: number
  members: Member[]
  roomName: string
  status: Status
}

const RoomTable: React.FC<RoomTableProps> = ({ result, maxPoint, members, roomName, status }) => {
  const averagePoint = useMemo(() => {
    let votingCount = 0
    let summaryPoint = 0
    result.forEach((value, key) => {
      summaryPoint += Number(key) * value
      votingCount += value
    })
    return summaryPoint / votingCount
  }, [result])

  const badlyPercentage = (averagePoint / maxPoint) * 100

  const scoreGradient =
    badlyPercentage <= 20 ? 'from-green-400 via-emerald-400 to-green-300' :
    badlyPercentage <= 40 ? 'from-lime-400 via-yellow-400 to-lime-300' :
    badlyPercentage <= 60 ? 'from-yellow-400 via-orange-400 to-yellow-300' :
    badlyPercentage <= 80 ? 'from-orange-500 via-primary to-orange-400' :
                            'from-red-500 via-rose-500 to-red-400'

  const [displayedScore, setDisplayedScore] = useState(0)

  useEffect(() => {
    if (status !== Status.RevealedCards) {
      setDisplayedScore(0)
      return
    }
    const duration = 1000
    const steps = 40
    let step = 0
    const timer = setInterval(() => {
      step++
      const eased = 1 - Math.pow(1 - step / steps, 3)
      setDisplayedScore(averagePoint * eased)
      if (step >= steps) {
        setDisplayedScore(averagePoint)
        clearInterval(timer)
      }
    }, duration / steps)
    return () => clearInterval(timer)
  }, [averagePoint, status])

  const gimmickMessage =
    badlyPercentage <= 20 ? { text: 'Smooth sailing — ship it! 🚀', color: 'text-green-400' } :
    badlyPercentage <= 40 ? { text: 'Nice and steady. Your team\'s got this 💪', color: 'text-lime-400' } :
    badlyPercentage <= 60 ? { text: 'Worth a good discussion — details matter 🤔', color: 'text-yellow-400' } :
    badlyPercentage <= 80 ? { text: 'This story needs some love ❤️‍🔥 Scope it down?', color: 'text-orange-400' } :
                            { text: 'Abort! Abort! Break it down! 🪓', color: 'text-red-400' }

  return (
    <div data-section="room-table" className="flex min-h-[200px] flex-col items-center gap-4">
      {status === Status.Voting ? (
        <Table name={roomName} members={members} />
      ) : (
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-8">
            <div className="flex h-[216px] w-[240px] justify-center">
              <CorgiFeeling badlyPercentage={badlyPercentage} />
            </div>
            <div className="animate-in fade-in zoom-in-75 duration-500 flex flex-col gap-1">
              <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Average</span>
              <div className="flex items-end gap-2 leading-none">
                <span
                  className={`bg-gradient-to-r ${scoreGradient} bg-clip-text text-7xl font-bold text-transparent tabular-nums`}
                  style={{ backgroundSize: '200% 200%', animation: 'gradient-shift 3s ease infinite' }}
                >
                  {displayedScore.toFixed(2)}
                </span>
                <span className="mb-2 text-base text-muted-foreground">pts</span>
              </div>
            </div>
          </div>
          <p className={`animate-in fade-in slide-in-from-bottom-2 duration-700 text-sm font-medium ${gimmickMessage.color}`}
            style={{ animationDelay: '800ms', animationFillMode: 'both' }}>
            {gimmickMessage.text}
          </p>
        </div>
      )}
    </div>
  )
}

export default RoomTable
