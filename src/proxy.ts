import { hasCookie, setCookie } from 'cookies-next'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { UID_KEY } from '@/constant/cookies'

import { SECONDS } from './utils/time'

const CIRCUIT_COOLDOWN = 30 * SECONDS
let backendFailedAt = 0

export async function proxy(req: NextRequest) {
  const res = NextResponse.next()
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
