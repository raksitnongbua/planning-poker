'use client'
import { useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

import { useLoadingStore, useUserInfoStore } from '@/store/zustand'
import { httpClient } from '@/utils/httpClient'
import { SECONDS } from '@/utils/time'

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

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['recent-rooms'],
    queryFn: async () => {
      try {
        const res = await httpClient(`/api/v1/room/recent-rooms/${uid}`)
        return transformRoom(res.data?.data)
      } catch (error) {
        handleError(error as AxiosError<unknown, any>)
      }
    },
    gcTime: 5 * SECONDS,
  })

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
        <ToastAction altText={'Retry fetch recent rooms'} onClick={() => refetch()}>
          Retry
        </ToastAction>
      ),
    })
  }

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
      <RoomHistory rooms={data ?? []} onClickJoinRoom={handleClickJoinRoom} />
    </main>
  )
}

export default RecentRooms
