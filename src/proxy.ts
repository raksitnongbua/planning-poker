import { hasCookie, setCookie } from 'cookies-next'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { UID_KEY } from '@/constant/cookies'

import { locales } from './i18n/request'
import { SECONDS } from './utils/time'

const CIRCUIT_COOLDOWN = 30 * SECONDS
let backendFailedAt = 0

export async function proxy(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const hl = searchParams.get('hl')

  // Handle hl query parameter for SEO / multi-language indexing
  if (hl && locales.includes(hl as any)) {
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-locale', hl)

    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
    response.cookies.set('locale', hl, { path: '/', maxAge: 60 * 60 * 24 * 365 })
    
    // Continue with proxy logic if needed
    return handleProxy(request, response)
  }

  return handleProxy(request, NextResponse.next())
}

async function handleProxy(req: NextRequest, res: NextResponse) {
  const hasUID = hasCookie(UID_KEY, { res, req })
  if (!hasUID) {
    if (Date.now() - backendFailedAt < CIRCUIT_COOLDOWN) {
      return res
    }
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/guest/sign-in`, {
        signal: AbortSignal.timeout(2 * SECONDS),
      })
      const jsonRes = await response.json()
      setCookie(UID_KEY, jsonRes.uuid, { res, req })
      backendFailedAt = 0
    } catch {
      backendFailedAt = Date.now()
    }
  }
  return res
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
