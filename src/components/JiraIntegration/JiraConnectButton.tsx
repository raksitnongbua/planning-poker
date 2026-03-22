'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'

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
      <div className="flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1">
        <span className="size-1.5 animate-heartbeat rounded-full bg-green-400" />
        <span className="text-[11px] font-medium text-green-400">{t('connected')}</span>
        <span className="text-muted-foreground/30">·</span>
        <button
          className="text-[10px] text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
          onClick={handleDisconnect}
          disabled={disconnecting}
        >
          {disconnecting ? '...' : t('disconnect')}
        </button>
      </div>
    )
  }

  return (
    <button
      className="flex items-center gap-2 rounded-lg border border-border/40 bg-transparent px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted/40"
      onClick={openOAuthPopup}
    >
      <svg className="size-3.5 shrink-0 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
        <path d="M11.53 2c0 2.4 1.97 4.35 4.35 4.35h1.78v1.7c0 2.4 1.95 4.34 4.34 4.35V2.84a.84.84 0 0 0-.84-.84zM6.77 6.8c0 2.4 1.96 4.34 4.35 4.34h1.78v1.71c0 2.4 1.95 4.34 4.35 4.35V7.63a.84.84 0 0 0-.84-.83zM2 11.6c0 2.4 1.95 4.34 4.35 4.34h1.78v1.71A4.35 4.35 0 0 0 12.48 22v-9.57a.84.84 0 0 0-.84-.83z" />
      </svg>
      {t('connectButton')}
    </button>
  )
}
