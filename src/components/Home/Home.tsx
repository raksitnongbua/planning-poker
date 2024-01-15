'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { RoomInfo } from '../NewRoomDialog/types'
import NewRoomDialog from '../NewRoomDialog'
import { httpClient } from '@/utils/httpClient'
import { useLoadingStore, useUserInfoStore } from '@/store/zustand'
import { Button } from '../ui/button'
import { Status } from '../ServiceStatus/types'
import ServiceStatus from '../ServiceStatus'

const Home = () => {
  const [isOpenCreateRoomDialog, setIsOpenCreateRoomDialog] = useState(false)
  const [serviceStatus, setServiceStatus] = useState<Status>('connecting')
  const { setLoadingOpen } = useLoadingStore()
  const { uid } = useUserInfoStore()
  const router = useRouter()

  const handleCreateRoom = async (room: RoomInfo) => {
    setLoadingOpen(true)
    try {
      const res = await httpClient.post('/api/v1/new-room', {
        room_name: room.name,
        hosting_id: uid,
      })
      if (res.status === 200) {
        const roomId = res.data.room_id
        router.push(`/room/${roomId}`)
        setIsOpenCreateRoomDialog(false)
      }
    } catch (error) {
      console.error('new room error:', error)
    }
    setLoadingOpen(false)
  }

  useEffect(() => {
    const checkServiceStatus = async () => {
      try {
        const res = await httpClient.get('/health')
        if (res.status === 200) {
          setServiceStatus('available')
        } else {
          setServiceStatus('unavailable')
        }
      } catch (error) {
        setServiceStatus('unavailable')
      }
    }
    checkServiceStatus()
  }, [])

  const handleClickCreateRoom = () => {
    setIsOpenCreateRoomDialog(true)
  }
  return (
    <main className="px-4 flex flex-col h-[75vh] justify-center">
      <div className="flex justify-center items-center mt-2 sm:mt-6 h-full">
        <div>
          <div className="my-5 grid gap-4 max-w-[500px]">
            <h1 className="text-7xl font-bold">Corgi Planning Poker</h1>
            <p className="text-md font-light">
              Agile project management technique where team members estimate task complexity through
              collaborative discussions and iterative refinement, using specially designed cards for
              consensus.
            </p>
          </div>
          <Button className="w-52 h-11" onClick={handleClickCreateRoom}>
            Create Room
          </Button>
        </div>
        <Image
          src="/images/corgi-banner.png"
          className="invisible w-0 lg:w-[600px] lg:h-[477px] lg:visible"
          alt="corgi-logo"
          width={600}
          height={477}
        />
      </div>

      <ServiceStatus status={serviceStatus} />

      <NewRoomDialog
        open={isOpenCreateRoomDialog}
        onClose={() => {
          setIsOpenCreateRoomDialog(false)
        }}
        onCreate={handleCreateRoom}
      />
    </main>
  )
}

export default Home
