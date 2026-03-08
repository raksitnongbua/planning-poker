'use client'
import { faRotateRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useMutation, useQuery } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
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
  { id: 'fibo-manday', displayName: '📅 Fibo + Manday', value: '0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 8, 13', group: 'preset' },
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

  const { data: recentRooms } = useQuery({
    queryKey: ['recent-rooms-preview', uid],
    queryFn: async () => {
      if (!uid) return []
      try {
        const res = await axios(`/api/v1/room/recent-rooms/${uid}`)
        const data = res.data?.data
        if (!data) return []
        return data.slice(0, 1).map((room: any) => ({
          id: room.id,
          name: room.name,
          totalMembers: room.members.length,
          updatedAt: new Date(room.updated_at),
        }))
      } catch {
        return []
      }
    },
    enabled: !!uid,
    gcTime: 30_000,
    staleTime: 30_000,
  })

  const timeAgo = (date: Date) => {
    const s = Math.floor((Date.now() - date.getTime()) / 1000)
    if (s < 60) return 'Just now'
    if (s < 3600) return `${Math.floor(s / 60)}m ago`
    if (s < 86400) return `${Math.floor(s / 3600)}h ago`
    return `${Math.floor(s / 86400)}d ago`
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
  const selectedConfig = options.find((o) => o.id === deskSelectedId)
  const previewValues = selectedConfig?.value
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean)
    .slice(0, 6) ?? []

  return (
    <div className="relative flex min-h-[calc(100dvh-92px*2)] items-center justify-center py-8">
      {/* Single subtle background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/3 size-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/8 blur-[120px]" />
      </div>

      <div className="relative w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Brand header */}
        <div className="mb-6 text-center">
          <div className="mb-3 inline-flex size-14 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 shadow-lg shadow-primary/10">
            <span className="text-2xl">🃏</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Create a Room</h1>
          <p className="mt-1 text-sm text-muted-foreground">Set up your planning session in seconds</p>
        </div>

        <Card className="border-border/30 bg-background/60 backdrop-blur-md shadow-2xl shadow-black/80">
          <CardContent className="flex flex-col gap-5 p-6">
            {/* Room name */}
            <div className="space-y-2">
              <Label htmlFor="room-name" className="text-sm font-semibold">
                Room name
              </Label>
              <Input
                id="room-name"
                maxLength={25}
                placeholder="e.g. Sprint 42 Planning"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                autoFocus
                disabled={disabledInputs}
                onKeyDown={(e) => e.code === 'Enter' && !isPending && createRoom()}
                className="border-border/50 bg-background/80 transition-colors focus:bg-background"
              />
              <p className="text-right text-[11px] text-muted-foreground/50">{roomName.length}/25</p>
            </div>

            {/* Divider */}
            <div className="h-px bg-border/40" />

            {/* Deck selection */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Card deck</Label>
              <CardConfigSelect
                value={deskSelectedId}
                options={options}
                onValueChange={setDeskSelectedId}
                disabled={disabledInputs}
                onCreateCustomDesk={handleCreateCustomDesk}
                favoriteIds={favoriteIds}
                onToggleFavorite={handleToggleFavorite}
              />

              {/* Deck preview chips */}
              {previewValues.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {previewValues.map((v) => (
                    <span
                      key={v}
                      className="rounded-lg border border-border/50 bg-background/70 px-2.5 py-1 text-xs font-medium tabular-nums text-foreground/70"
                    >
                      {v}
                    </span>
                  ))}
                  {(selectedConfig?.value.split(',').length ?? 0) > 6 && (() => {
                    const remaining = selectedConfig!.value.split(',').map((v) => v.trim()).filter(Boolean).slice(6)
                    return (
                      <div className="group relative">
                        <span className="cursor-default rounded-lg border border-border/30 bg-muted/20 px-2.5 py-1 text-xs text-muted-foreground/50 transition-colors group-hover:border-border/60 group-hover:text-muted-foreground">
                          +{remaining.length} more
                        </span>
                        <div className="invisible absolute bottom-full left-0 z-10 mb-2 flex w-max max-w-[200px] flex-wrap gap-1 rounded-xl border border-border/60 bg-popover p-2.5 opacity-0 shadow-xl transition-all duration-150 group-hover:visible group-hover:opacity-100">
                          {remaining.map((v) => (
                            <span
                              key={v}
                              className="rounded-md border border-border/40 bg-muted/40 px-2 py-0.5 text-xs font-medium tabular-nums text-muted-foreground"
                            >
                              {v}
                            </span>
                          ))}
                        </div>
                      </div>
                    )
                  })()}
                </div>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-3 px-6 pb-6 pt-0">
            <div className="relative w-full overflow-hidden rounded-lg">
              {!disabledInputs && roomName !== '' && (
                <span className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-transparent via-white/15 to-transparent animate-shine" />
              )}
              <Button
                size="lg"
                className="w-full gap-2 font-semibold tracking-wide"
                onClick={createRoom}
                disabled={disabledInputs || roomName === ''}
              >
                {disabledInputs ? (
                  <FontAwesomeIcon icon={faRotateRight} className="size-4 animate-spin" />
                ) : (
                  <span className="text-base">🚀</span>
                )}
                {disabledInputs ? 'Creating…' : 'Create Room'}
              </Button>
            </div>
            <p className="text-center text-[11px] text-muted-foreground/40">
              No account required · Free forever
            </p>
          </CardFooter>
        </Card>

        {recentRooms && recentRooms.length > 0 && (
          <div className="mt-4 space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <p className="text-center text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/50">
              Continue a Room
            </p>
            <div className="space-y-1.5">
              {recentRooms.map((room) => (
                <button
                  key={room.id}
                  onClick={() => router.push(`/room/${room.id}`)}
                  className="flex w-full items-center gap-3 rounded-xl border border-border/30 bg-background/40 px-4 py-3 text-left backdrop-blur-sm transition-all duration-200 hover:border-border/60 hover:bg-background/60"
                >
                  <div className="flex size-8 flex-shrink-0 items-center justify-center rounded-lg border border-border/40 bg-muted/20 text-base">
                    🃏
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{room.name}</p>
                    <p className="text-[10px] text-muted-foreground/50">
                      {room.totalMembers} player{room.totalMembers !== 1 ? 's' : ''} · {timeAgo(room.updatedAt)}
                    </p>
                  </div>
                  <span className="flex-shrink-0 text-[10px] text-muted-foreground/40">→</span>
                </button>
              ))}
            </div>
            <button
              onClick={() => router.push('/')}
              className="mt-1 flex w-full items-center justify-center gap-1 py-1.5 text-[11px] text-muted-foreground/50 transition-colors duration-200 hover:text-muted-foreground"
            >
              View all rooms
              <span className="text-[10px]">→</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default NewRoom
