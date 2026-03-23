import { NextResponse } from 'next/server'

import {
  JIRA_CLOUD_ID_COOKIE,
  JIRA_REFRESH_TOKEN_COOKIE,
  JIRA_RT_COOKIE,
  JIRA_SESSION_COOKIE,
  JIRA_TOKEN_COOKIE,
} from '@/constant/jira'

export async function POST() {
  const response = NextResponse.json({ ok: true })
  response.cookies.set(JIRA_SESSION_COOKIE, '', { maxAge: 0, path: '/api/jira' })
  response.cookies.set(JIRA_RT_COOKIE, '', { maxAge: 0, path: '/api/jira' })
  // Clear legacy large-token cookies from old prototype sessions (prevent 431 errors)
  response.cookies.set(JIRA_TOKEN_COOKIE, '', { maxAge: 0, path: '/' })
  response.cookies.set(JIRA_REFRESH_TOKEN_COOKIE, '', { maxAge: 0, path: '/' })
  response.cookies.set(JIRA_CLOUD_ID_COOKIE, '', { maxAge: 0, path: '/' })
  return response
}
