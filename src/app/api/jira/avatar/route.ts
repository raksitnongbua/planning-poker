import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

import { applyRefreshedCookies, getValidJiraSession } from '@/lib/jiraAuth'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url')

  if (!url) return new NextResponse(null, { status: 400 })

  // Only proxy Atlassian URLs
  if (!url.startsWith('https://api.atlassian.com/') && !url.startsWith('https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/')) {
    return new NextResponse(null, { status: 403 })
  }

  const cookieStore = await cookies()
  const { entry, refreshed } = await getValidJiraSession(cookieStore)
  if (!entry) return new NextResponse(null, { status: 401 })

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${entry.accessToken}`, Accept: 'image/*' },
  })

  if (!res.ok) return new NextResponse(null, { status: res.status })

  const contentType = res.headers.get('content-type') ?? 'image/png'
  const buffer = await res.arrayBuffer()

  const response = new NextResponse(buffer, {
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=86400',
    },
  })
  if (refreshed) applyRefreshedCookies(response, refreshed)
  return response
}
