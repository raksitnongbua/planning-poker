import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import { JIRA_RT_COOKIE, JIRA_SESSION_COOKIE } from '@/constant/jira'
import {
  decodeJiraRefresh,
  decodeJiraSession,
  encodeJiraRefresh,
  encodeJiraSession,
  refreshJiraTokens,
} from '@/lib/jiraTokenStore'

const NO_CACHE = { headers: { 'Cache-Control': 'no-store' } }

const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 60 * 60 * 24 * 7,
  path: '/api/jira',
}

const RT_COOKIE_OPTIONS = {
  ...SESSION_COOKIE_OPTIONS,
  maxAge: 60 * 60 * 24 * 365,
}

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get(JIRA_SESSION_COOKIE)?.value

  if (!token) {
    return NextResponse.json({ connected: false }, NO_CACHE)
  }

  const entry = decodeJiraSession(token)
  if (!entry) {
    return NextResponse.json({ connected: false }, NO_CACHE)
  }

  // Verify the access token is still valid
  const verify = await fetch('https://api.atlassian.com/oauth/token/accessible-resources', {
    headers: { Authorization: `Bearer ${entry.accessToken}`, Accept: 'application/json' },
  })

  if (verify.ok) {
    return NextResponse.json(
      { connected: true, cloudId: entry.cloudId, siteUrl: entry.siteUrl },
      NO_CACHE
    )
  }

  // AT expired — try silent refresh using RT
  const rtRaw = cookieStore.get(JIRA_RT_COOKIE)?.value
  if (!rtRaw) {
    const response = NextResponse.json({ connected: false }, NO_CACHE)
    response.cookies.set(JIRA_SESSION_COOKIE, '', { maxAge: 0, path: '/api/jira' })
    return response
  }

  const rt = decodeJiraRefresh(rtRaw)
  if (!rt) {
    const response = NextResponse.json({ connected: false }, NO_CACHE)
    response.cookies.set(JIRA_SESSION_COOKIE, '', { maxAge: 0, path: '/api/jira' })
    response.cookies.set(JIRA_RT_COOKIE, '', { maxAge: 0, path: '/api/jira' })
    return response
  }

  const refreshed = await refreshJiraTokens(rt, entry.cloudId, entry.siteUrl)
  if (!refreshed) {
    // RT expired or revoked — force re-auth
    const response = NextResponse.json({ connected: false }, NO_CACHE)
    response.cookies.set(JIRA_SESSION_COOKIE, '', { maxAge: 0, path: '/api/jira' })
    response.cookies.set(JIRA_RT_COOKIE, '', { maxAge: 0, path: '/api/jira' })
    return response
  }

  // Update both cookies with refreshed tokens
  const response = NextResponse.json(
    { connected: true, cloudId: refreshed.cloudId, siteUrl: refreshed.siteUrl },
    NO_CACHE
  )
  response.cookies.set(
    JIRA_SESSION_COOKIE,
    encodeJiraSession({ accessToken: refreshed.accessToken, cloudId: refreshed.cloudId, siteUrl: refreshed.siteUrl }),
    SESSION_COOKIE_OPTIONS
  )
  response.cookies.set(JIRA_RT_COOKIE, encodeJiraRefresh(refreshed.refreshToken), RT_COOKIE_OPTIONS)
  return response
}
