'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

export default function JiraCallbackPage() {
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (window.opener) {
      window.opener.postMessage('jira:success', window.location.origin)
    }

    const t = setTimeout(() => {
      setDone(true)
      setTimeout(() => window.close(), 600)
    }, 800)

    return () => clearTimeout(t)
  }, [])

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-background">
      <Image
        src="/images/corgi-logo.png"
        alt="Corgi Planning Poker"
        width={72}
        height={72}
        priority
        className={`transition-all duration-500 ${done ? 'scale-110 opacity-100' : 'animate-pulse opacity-80'}`}
      />
      {done ? (
        <div className="flex flex-col items-center gap-3 duration-300 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex size-12 items-center justify-center rounded-full bg-green-500/15 ring-1 ring-green-500/40">
            <svg className="size-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-sm font-medium text-foreground">Connected to Jira!</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 duration-300 animate-in fade-in">
          <div className="size-7 animate-spin rounded-full border-2 border-border border-t-primary" />
          <p className="text-sm text-muted-foreground">Connecting to Jira...</p>
        </div>
      )}
    </div>
  )
}
