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
      } else {
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

  return (
    <>
      <header className="px-6 p-8 flex items-end gap-4 sm:px-16">
        <Image src="/images/corgi-good.png" alt="corgi-logo" width={30} height={30} />
        <span className="text-xl">Planning Poker</span>
      </header>
      <main className="p-6">
        <div className="flex justify-center mt-6 h-full">
          <div>
            <div className="my-5 grid gap-4 max-w-[500px]">
              <h1 className="text-6xl font-bold">Corgi Planning Poker</h1>
              <p className="text-md font-light">
                Agile teams playfully estimate tasks with cards, finding consensus one story point
                at a time.
              </p>
            </div>
            <Button className="w-52 h-11" onClick={() => setIsOpenCreateRoomDialog(true)}>
              Create Room
            </Button>
          </div>
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
    </>
  )
}

export default Home
