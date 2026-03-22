import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

import { JIRA_SESSION_COOKIE } from '@/constant/jira'
import { getJiraTokens } from '@/lib/jiraTokenStore'

export interface JiraField {
  id: string
  name: string
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const cloudId = searchParams.get('cloudId')

  if (!cloudId) {
    return NextResponse.json({ error: 'Missing cloudId' }, { status: 400 })
  }

  const cookieStore = await cookies()
  const sessionId = cookieStore.get(JIRA_SESSION_COOKIE)?.value
  const entry = sessionId ? getJiraTokens(sessionId) : undefined

  if (!entry) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const res = await fetch(
    `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/field`,
    {
      headers: {
        Authorization: `Bearer ${entry.accessToken}`,
        Accept: 'application/json',
      },
    }
  )

  if (!res.ok) {
    return NextResponse.json({ error: 'Jira API error' }, { status: res.status })
  }

  const fields: { id: string; name: string; schema?: { type: string } }[] = await res.json()

  // Return only numeric custom fields likely to be story points
  const numericFields = fields.filter(
    (f) => f.schema?.type === 'number' && f.id.startsWith('customfield_')
  )

  return NextResponse.json(numericFields.map((f) => ({ id: f.id, name: f.name })))
}
