'use client'
import { faRotateRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { getCookie, hasCookie, setCookie } from 'cookies-next'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { DESK_CONFIG_KEY } from '@/constant/cookies'
import { useUserInfoStore } from '@/store/zustand'
import { httpClient } from '@/utils/httpClient'

import { CardConfigSelect } from '../CardConfigSelect'
import { DeskConfig } from '../CardConfigSelect/CardConfigSelect'
import { Button } from '../ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { useToast } from '../ui/use-toast'

const FAVORITES_STORAGE_KEY = 'desk-favorites'

const PRESET_DESK_CONFIGS: DeskConfig[] = [
  { id: 'fibonacci', displayName: '🃏 Fibonacci', value: '1, 2, 3, 5, 8, 13, 21, 34', group: 'preset' },
  { id: 'tshirt', displayName: '👕 T-Shirt', value: 'XS, S, M, L, XL, XXL', group: 'preset' },
  { id: 'powers-of-2', displayName: '⚡ Powers of 2', value: '1, 2, 4, 8, 16, 32, 64', group: 'preset' },
  { id: 'hours', displayName: '⏱️ Hours', value: '1, 2, 4, 8, 16, 24, 40', group: 'preset' },
]

const NewRoom = ({ }) => {
  const { uid } = useUserInfoStore()
  const { toast } = useToast()
  const router = useRouter()

  const [roomName, setRoomName] = useState<string>('Planning Room')
  const [deskSelectedId, setDeskSelectedId] = useState<string>('fibonacci')
  const [isRouting, setIsRouting] = useState<boolean>(false)
  const [options, setOptions] = useState<DeskConfig[]>(PRESET_DESK_CONFIGS)
  const [favoriteIds, setFavoriteIds] = useState<string[]>(['fibonacci'])

  useEffect(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY)
      if (stored) {
        const parsed: string[] = JSON.parse(stored)
        setFavoriteIds(parsed)
        if (parsed.length > 0) setDeskSelectedId(parsed[0])
      }
    } catch {}
  }, [])

  const handleToggleFavorite = useCallback((id: string) => {
    setFavoriteIds((prev) => {
      const next = prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
      try { localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(next)) } catch {}
      return next
    })
  }, [])

  const { mutate, isPending } = useMutation<{ room_id: string }, unknown, Record<string, unknown>>({
    mutationFn: (variables) =>
      httpClient.post('/api/v1/new-room', variables).then((res) => res.data),
    onSuccess(data) {
      const roomId = data.room_id
      router.push(`/room/${roomId}`)
      setIsRouting(true)
    },
    onError(error) {
      const axiosError = error as AxiosError
      if (axiosError.code === 'ERR_NETWORK') {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Sorry, the service is currently unavailable. Please try again later.',
          duration: 4000,
        })
      }
    },
  })

  useEffect(() => {
    if (!hasCookie(DESK_CONFIG_KEY) || options.length > PRESET_DESK_CONFIGS.length) {
      return
    }
    try {
      const deskConfigCookie = getCookie(DESK_CONFIG_KEY)
      const cookieOptions = deskConfigCookie
        ?.split('&')
        .map((config) => JSON.parse(config) as DeskConfig)

      if (cookieOptions && cookieOptions.length > 0) {
        setOptions([...options, ...cookieOptions])
      }
    } catch (error) {
      console.error('Cannot fetch desk custom config:', error)
    }
  }, [options])

  const createRoom = () => {
    mutate({
      room_name: roomName,
      hosting_id: uid,
      desk_config: options.find((option) => option.id === deskSelectedId)?.value.trim(),
    })
  }

  const disabledInputs = isPending || isRouting

  const handleCreateCustomDesk = (deskName: string, deskValue: string) => {
    const newDeskConfig: DeskConfig = {
      id: uuidv4(),
      value: deskValue,
      displayName: deskName,
      group: 'custom',
    }
    setOptions([...options, newDeskConfig])
    setDeskSelectedId(newDeskConfig.id)
    const deskConfig = getCookie(DESK_CONFIG_KEY)
    const mergedDeskConfig =
      (Boolean(deskConfig) ? `${deskConfig}&` : '') + JSON.stringify(newDeskConfig)
    setCookie(DESK_CONFIG_KEY, mergedDeskConfig)
  }
  return (
    <div className="flex min-h-[calc(100dvh-92px*2)] items-center justify-center">
      <Card className="w-full max-w-screen-sm animate-in fade-in zoom-in-95 duration-300">
        <CardHeader>
          <h1 className="text-xl">Create Room</h1>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div>
            <Label htmlFor="room-name">Room name</Label>
            <Input
              id="room-name"
              maxLength={25}
              placeholder="Enter room name"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              autoFocus
              disabled={disabledInputs}
              onKeyDown={(e) => e.code === 'Enter' && !isPending && createRoom()}
            />
          </div>
          <div>
            <Label>Desk</Label>
            <CardConfigSelect
              value={deskSelectedId}
              options={options}
              onValueChange={setDeskSelectedId}
              disabled={disabledInputs}
              onCreateCustomDesk={handleCreateCustomDesk}
              favoriteIds={favoriteIds}
              onToggleFavorite={handleToggleFavorite}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            size="lg"
            className="w-full gap-2"
            onClick={createRoom}
            disabled={disabledInputs || roomName === ''}
          >
            {disabledInputs && (
              <FontAwesomeIcon icon={faRotateRight} className="size-5 animate-spin" />
            )}
            Create Room
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default NewRoom
