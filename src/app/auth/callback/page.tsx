'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

export default function AuthCallbackPage() {
  const [done, setDone] = useState(false)

  useEffect(() => {
    // Notify the opener tab that auth completed
    if (window.opener) {
      window.opener.postMessage('auth:success', window.location.origin)
    }

    // Brief success state, then close
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
        className={`transition-all duration-500 ${done ? 'scale-110 opacity-100' : 'animate-pulse opacity-80'}`}
      />

      {done ? (
        <div className="flex flex-col items-center gap-2 duration-300 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex size-10 items-center justify-center rounded-full bg-green-500/15 ring-1 ring-green-500/40">
            <svg className="size-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-sm font-medium text-foreground">Signed in successfully</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 duration-300 animate-in fade-in">
          <div className="size-6 animate-spin rounded-full border-2 border-border border-t-primary" />
          <p className="text-sm text-muted-foreground">Signing in...</p>
        </div>
      )}
    </div>
  )
}
