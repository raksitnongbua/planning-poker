'use client'

import { useSession } from 'next-auth/react'
import { useEffect } from 'react'

export function useSignInPopup(onSuccess?: () => void) {
  const { update } = useSession()

  // Listen for auth:success posted by /auth/callback when popup completes
  useEffect(() => {
    const handleMessage = async (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return
      if (e.data === 'auth:success') {
        await update()
        onSuccess?.()
      }
    }
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [update, onSuccess])

  const signInWithPopup = async () => {
    const callbackUrl = `${window.location.origin}/auth/callback`
    const width = 500
    const height = 600
    const left = Math.round(window.screenX + (window.outerWidth - width) / 2)
    const top = Math.round(window.screenY + (window.outerHeight - height) / 2)

    let oauthUrl: string
    try {
      const csrfRes = await fetch('/api/auth/csrf')
      const { csrfToken } = await csrfRes.json()
      const signinRes = await fetch('/api/auth/signin/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ csrfToken, callbackUrl, json: 'true' }),
      })
      const { url } = await signinRes.json()
      oauthUrl = url
    } catch {
      // Fallback: full redirect
      window.location.href = `/api/auth/signin/google?callbackUrl=${encodeURIComponent(callbackUrl)}`
      return
    }

    const popup = window.open(
      oauthUrl,
      'google-signin',
      `width=${width},height=${height},left=${left},top=${top},popup=1,scrollbars=yes`,
    )

    if (!popup) {
      window.location.href = oauthUrl
    }
  }

  return { signInWithPopup }
}
