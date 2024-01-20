'use client'
import { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

import { useCustomSWR } from '@/lib/swr'
import { useLoadingStore, useUserInfoStore } from '@/store/zustand'

import { RoomHistory } from '../RoomHistory'
import { Room } from '../RoomHistory/RoomHistory'
import { Button } from '../ui/button'
import { ToastAction } from '../ui/toast'
import { useToast } from '../ui/use-toast'

const RecentRooms = () => {
  const { uid } = useUserInfoStore()
  const { setLoadingOpen } = useLoadingStore()
  const router = useRouter()
  const { toast } = useToast()

  const handleError = (err: AxiosError<unknown, any>) => {
    if (!err) {
      return
    }
    const errorMessage = err.message
    toast({
      variant: 'destructive',
      title: 'Error',
      description: errorMessage,
      duration: 4000,
      action: (
        <ToastAction altText={'Retry fetch recent rooms'} onClick={() => mutate()}>
          Retry
        </ToastAction>
      ),
    })
  }

  const { data, isLoading, mutate } = useCustomSWR(
    { url: `/api/v1/room/recent-rooms/${uid}` },
    {
      revalidateOnMount: Boolean(uid),
      shouldRetryOnError: false,
      onError: handleError,
    }
  )

  const transformRoom = (data: any): Room[] => {
    if (!data) return []
    const rooms: Room[] = data.map((room: any) => ({
      id: room.id,
      createdAt: new Date(room.created_at),
      updatedAt: new Date(room.updated_at),
      name: room.name,
      totalMembers: room.members.length,
    }))

    return rooms
  }

  useEffect(() => {
    setLoadingOpen(isLoading)
  }, [isLoading, setLoadingOpen])

  const transformedRooms = transformRoom(data?.data)

  const handleClickJoinRoom = (roomId: string) => {
    router.push(`/room/${roomId}`)
  }

  return (
    <main className="mx-auto flex max-w-screen-lg flex-col items-start justify-center gap-y-2 px-2 sm:px-8">
      <div className="flex w-full justify-between">
        <h2 className="text-2xl">Recent Rooms</h2>
        <Button onClick={() => router.push('new-room')} variant="outline">
          New Room
        </Button>
      </div>
      <RoomHistory rooms={transformedRooms} onClickJoinRoom={handleClickJoinRoom} />
    </main>
  )
}

export default RecentRooms
