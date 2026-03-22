import { NextRequest, NextResponse } from 'next/server'

import { JIRA_SESSION_COOKIE } from '@/constant/jira'
import { encodeJiraSession } from '@/lib/jiraTokenStore'

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 60 * 60 * 24 * 7, // 7 days
  path: '/api/jira', // only sent for /api/jira/* requests — prevents 431 from large JWT in cookie header
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.json({ error: 'Missing code' }, { status: 400 })
  }

  const tokenRes = await fetch('https://auth.atlassian.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'authorization_code',
      client_id: process.env.JIRA_CLIENT_ID,
      client_secret: process.env.JIRA_CLIENT_SECRET,
      code,
      redirect_uri: process.env.JIRA_CALLBACK_URL,
    }),
  })

  if (!tokenRes.ok) {
    return NextResponse.json({ error: 'Token exchange failed' }, { status: 400 })
  }

  const { access_token, refresh_token } = await tokenRes.json()

  const resourcesRes = await fetch('https://api.atlassian.com/oauth/token/accessible-resources', {
    headers: { Authorization: `Bearer ${access_token}`, Accept: 'application/json' },
  })

  if (!resourcesRes.ok) {
    return NextResponse.json({ error: 'Failed to fetch resources' }, { status: 400 })
  }

  const resources = await resourcesRes.json()
  const cloudId = resources[0]?.id
  const siteUrl = resources[0]?.url ?? ''

  if (!cloudId) {
    return NextResponse.json({ error: 'No Atlassian cloud found' }, { status: 400 })
  }

  const encoded = encodeJiraSession({ accessToken: access_token, cloudId, siteUrl })

  const redirectUrl = new URL('/jira/callback', request.url)
  const response = NextResponse.redirect(redirectUrl)
  response.cookies.set(JIRA_SESSION_COOKIE, encoded, COOKIE_OPTIONS)

  return response
}
