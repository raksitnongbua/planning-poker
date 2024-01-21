import { hasCookie, setCookie } from 'cookies-next'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { UID_COOKIE_KEY } from '@/constant/cookies'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const hasUID = hasCookie(UID_COOKIE_KEY, { res, req })
  if (!hasUID) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/guest/sign-in`)
    const jsonRes = await response.json()
    setCookie(UID_COOKIE_KEY, jsonRes.uuid, { res, req })
  }
  return res
}
