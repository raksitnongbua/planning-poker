import { hasCookie, setCookie } from 'cookies-next'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { UID_KEY } from '@/constant/cookies'

import { SECONDS } from './utils/time'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const hasUID = hasCookie(UID_KEY, { res, req })
  if (!hasUID) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/guest/sign-in`, {
        signal: AbortSignal.timeout(9 * SECONDS),
      })
      const jsonRes = await response.json()
      setCookie(UID_KEY, jsonRes.uuid, { res, req })
    } catch (error) {
      console.error(error)
    }
  }
  return res
}
