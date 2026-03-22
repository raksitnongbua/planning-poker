'use client'

import { useEffect } from 'react'

import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'

interface Props {
  isConnected: boolean
  roomId: string
  onConnected: () => void
  onDisconnected: () => void
}

export function JiraConnectButton({ isConnected, roomId, onConnected, onDisconnected }: Props) {
  const { toast } = useToast()

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
        title: 'Popup blocked',
        description: 'Allow popups for this site, then try again.',
        duration: 4000,
      })
    }
  }

  async function handleDisconnect() {
    await fetch('/api/jira/disconnect', { method: 'POST' })
    onDisconnected()
  }

  if (isConnected) {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 rounded-lg border border-green-500/30 bg-green-500/10 px-3 py-2">
          <span className="size-2 animate-heartbeat rounded-full bg-green-400" />
          <span className="text-xs font-medium text-green-400">Jira Connected</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full border-border/40 text-muted-foreground hover:text-foreground"
          onClick={handleDisconnect}
        >
          Disconnect
        </Button>
      </div>
    )
  }

  return (
    <Button
      size="sm"
      className="w-full"
      onClick={openOAuthPopup}
    >
      <svg className="mr-2 size-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.53 2c0 2.4 1.97 4.35 4.35 4.35h1.78v1.7c0 2.4 1.95 4.34 4.34 4.35V2.84a.84.84 0 0 0-.84-.84zM6.77 6.8c0 2.4 1.96 4.34 4.35 4.34h1.78v1.71c0 2.4 1.95 4.34 4.35 4.35V7.63a.84.84 0 0 0-.84-.83zM2 11.6c0 2.4 1.95 4.34 4.35 4.34h1.78v1.71A4.35 4.35 0 0 0 12.48 22v-9.57a.84.84 0 0 0-.84-.83z" />
      </svg>
      Connect Jira
    </Button>
  )
}
