import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import {
  JIRA_CLOUD_ID_COOKIE,
  JIRA_REFRESH_TOKEN_COOKIE,
  JIRA_SESSION_COOKIE,
  JIRA_TOKEN_COOKIE,
} from '@/constant/jira'
import { deleteJiraTokens } from '@/lib/jiraTokenStore'

export async function POST() {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get(JIRA_SESSION_COOKIE)?.value

  if (sessionId) {
    deleteJiraTokens(sessionId)
  }

  const response = NextResponse.json({ ok: true })
  // Clear current session cookie
  response.cookies.set(JIRA_SESSION_COOKIE, '', { maxAge: 0, path: '/' })
  // Clear legacy large-token cookies from old prototype sessions (prevent 431 errors)
  response.cookies.set(JIRA_TOKEN_COOKIE, '', { maxAge: 0, path: '/' })
  response.cookies.set(JIRA_REFRESH_TOKEN_COOKIE, '', { maxAge: 0, path: '/' })
  response.cookies.set(JIRA_CLOUD_ID_COOKIE, '', { maxAge: 0, path: '/' })
  return response
}
