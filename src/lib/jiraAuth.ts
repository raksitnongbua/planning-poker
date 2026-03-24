import { NextResponse } from 'next/server'

import { JIRA_RT_COOKIE, JIRA_SESSION_COOKIE } from '@/constant/jira'

import {
  decodeJiraRefresh,
  decodeJiraSession,
  encodeJiraRefresh,
  encodeJiraSession,
  JiraTokenEntry,
  refreshJiraTokens,
  RefreshResult,
} from './jiraTokenStore'

type CookieStore = { get(name: string): { value: string } | undefined }

export const JIRA_COOKIE_BASE = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/api/jira',
}

/**
 * Returns the valid Jira session entry, proactively refreshing the access
 * token when it is expired (or within 60 s of expiry).
 */
export async function getValidJiraSession(
  cookieStore: CookieStore
): Promise<{ entry: JiraTokenEntry | null; refreshed: RefreshResult | null }> {
  const token = cookieStore.get(JIRA_SESSION_COOKIE)?.value
  const entry = token ? decodeJiraSession(token) : null
  if (!entry) return { entry: null, refreshed: null }

  // Decode JWT exp without verifying signature
  let isExpired = false
  try {
    const [, payloadB64] = entry.accessToken.split('.')
    const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'))
    const exp = payload.exp as number
    if (exp - Math.floor(Date.now() / 1000) <= 60) isExpired = true
  } catch {
    // Cannot decode — treat as valid and let the downstream API surface the 401
  }

  if (!isExpired) return { entry, refreshed: null }

  // Token expired — try silent refresh
  const rtRaw = cookieStore.get(JIRA_RT_COOKIE)?.value
  const rt = rtRaw ? decodeJiraRefresh(rtRaw) : null
  if (!rt) return { entry: null, refreshed: null }

  const result = await refreshJiraTokens(rt, entry.cloudId, entry.siteUrl)
  if (!result) return { entry: null, refreshed: null }

  return {
    entry: { accessToken: result.accessToken, cloudId: result.cloudId, siteUrl: result.siteUrl },
    refreshed: result,
  }
}

/** Write the refreshed access + refresh token cookies onto any NextResponse. */
export function applyRefreshedCookies(response: NextResponse, refreshed: RefreshResult): void {
  response.cookies.set(
    JIRA_SESSION_COOKIE,
    encodeJiraSession({ accessToken: refreshed.accessToken, cloudId: refreshed.cloudId, siteUrl: refreshed.siteUrl }),
    { ...JIRA_COOKIE_BASE, maxAge: 60 * 60 * 24 * 7 }
  )
  response.cookies.set(JIRA_RT_COOKIE, encodeJiraRefresh(refreshed.refreshToken), {
    ...JIRA_COOKIE_BASE,
    maxAge: 60 * 60 * 24 * 365,
  })
}
