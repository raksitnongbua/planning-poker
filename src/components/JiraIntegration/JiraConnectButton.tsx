'use client'

import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'

import { useToast } from '@/components/ui/use-toast'

interface Props {
  isConnected: boolean
  roomId: string
  onConnected: () => void
  onDisconnected: () => void
}

export function JiraConnectButton({ isConnected, roomId, onConnected, onDisconnected }: Props) {
  const { toast } = useToast()
  const t = useTranslations('room.jira')
  const [disconnecting, setDisconnecting] = useState(false)

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin) return
      if (event.data === 'jira:success') {
        onConnected()
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [onConnected])

  function openOAuthPopup() {
    const popup = window.open(
      `/api/jira/auth?state=${roomId}`,
      'jira_oauth',
      'width=600,height=700,left=200,top=100'
    )
    if (!popup || popup.closed) {
      toast({
        title: t('popupBlocked'),
        description: t('popupBlockedDesc'),
        duration: 4000,
      })
    }
  }

  async function handleDisconnect() {
    setDisconnecting(true)
    try {
      await fetch('/api/jira/disconnect', { method: 'POST' })
      onDisconnected()
    } finally {
      setDisconnecting(false)
    }
  }

  if (isConnected) {
    return (
      <div className="flex items-center gap-1.5 rounded-lg border border-green-500/20 bg-green-500/8 px-2 py-1">
        <svg className="size-3 shrink-0 text-blue-400/70" fill="currentColor" viewBox="0 0 24 24">
          <path d="M11.53 2c0 2.4 1.97 4.35 4.35 4.35h1.78v1.7c0 2.4 1.95 4.34 4.34 4.35V2.84a.84.84 0 0 0-.84-.84zM6.77 6.8c0 2.4 1.96 4.34 4.35 4.34h1.78v1.71c0 2.4 1.95 4.34 4.35 4.35V7.63a.84.84 0 0 0-.84-.83zM2 11.6c0 2.4 1.95 4.34 4.35 4.34h1.78v1.71A4.35 4.35 0 0 0 12.48 22v-9.57a.84.84 0 0 0-.84-.83z" />
        </svg>
        <span className="size-1.5 animate-heartbeat rounded-full bg-green-400" />
        <span className="text-[10px] font-medium text-green-400">{t('connected')}</span>
        <button
          className="flex size-4 items-center justify-center rounded text-muted-foreground/40 transition-colors hover:bg-red-500/10 hover:text-red-400 disabled:opacity-40"
          onClick={handleDisconnect}
          disabled={disconnecting}
          title={t('disconnect')}
        >
          {disconnecting
            ? <span className="text-[8px]">…</span>
            : <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
          }
        </button>
      </div>
    )
  }

  return (
    <button
      className="flex items-center gap-1.5 rounded-md border border-blue-400/25 bg-blue-400/8 px-2 py-1 text-[10px] font-medium text-blue-400/70 transition-all hover:border-blue-400/50 hover:bg-blue-400/15 hover:text-blue-400"
      onClick={openOAuthPopup}
    >
      <svg className="size-3 shrink-0" fill="currentColor" viewBox="0 0 24 24">
        <path d="M11.53 2c0 2.4 1.97 4.35 4.35 4.35h1.78v1.7c0 2.4 1.95 4.34 4.34 4.35V2.84a.84.84 0 0 0-.84-.84zM6.77 6.8c0 2.4 1.96 4.34 4.35 4.34h1.78v1.71c0 2.4 1.95 4.34 4.35 4.35V7.63a.84.84 0 0 0-.84-.83zM2 11.6c0 2.4 1.95 4.34 4.35 4.34h1.78v1.71A4.35 4.35 0 0 0 12.48 22v-9.57a.84.84 0 0 0-.84-.83z" />
      </svg>
      {t('connectButton')}
    </button>
  )
}
