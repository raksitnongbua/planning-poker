import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

import { JIRA_SESSION_COOKIE } from '@/constant/jira'
import { getJiraTokens } from '@/lib/jiraTokenStore'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ issueId: string }> }
) {
  const { issueId } = await params

  const cookieStore = await cookies()
  const sessionId = cookieStore.get(JIRA_SESSION_COOKIE)?.value
  const entry = sessionId ? getJiraTokens(sessionId) : undefined

  if (!entry) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const body = await request.json()
  const { cloudId, value, storyPointsField = 'customfield_10016' } = body

  if (!cloudId || value === undefined) {
    return NextResponse.json({ error: 'Missing cloudId or value' }, { status: 400 })
  }

  const res = await fetch(
    `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/issue/${issueId}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${entry.accessToken}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ fields: { [storyPointsField]: Number(value) } }),
    }
  )

  if (!res.ok) {
    const error = await res.text()
    return NextResponse.json({ ok: false, error }, { status: res.status })
  }

  return NextResponse.json({ ok: true })
}
