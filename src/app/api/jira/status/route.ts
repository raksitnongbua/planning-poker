import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import { JIRA_SESSION_COOKIE } from '@/constant/jira'
import { decodeJiraSession } from '@/lib/jiraTokenStore'

const NO_CACHE = { headers: { 'Cache-Control': 'no-store' } }

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

  return NextResponse.json({ connected: true, cloudId: entry.cloudId, siteUrl: entry.siteUrl }, NO_CACHE)
}
