import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

import { JIRA_SESSION_COOKIE } from '@/constant/jira'
import { decodeJiraSession } from '@/lib/jiraTokenStore'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q') ?? ''
  const cloudId = searchParams.get('cloudId')

  if (!cloudId) {
    return NextResponse.json({ error: 'Missing cloudId' }, { status: 400 })
  }

  const cookieStore = await cookies()
  const token = cookieStore.get(JIRA_SESSION_COOKIE)?.value
  const entry = token ? decodeJiraSession(token) : null

  if (!entry) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const params = new URLSearchParams({ query: q, currentJQL: 'order by updated DESC' })

  const res = await fetch(
    `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/issue/picker?${params.toString()}`,
    { headers: { Authorization: `Bearer ${entry.accessToken}`, Accept: 'application/json' } }
  )

  if (!res.ok) {
    return NextResponse.json({ error: 'Jira API error' }, { status: res.status })
  }

  const data = await res.json()

  const issues = (data.sections ?? []).flatMap(
    (section: { issues?: { id: string; key: string; summaryText: string }[] }) =>
      (section.issues ?? []).map((issue) => ({
        id: String(issue.id),
        key: issue.key,
        summary: issue.summaryText,
        type: 'Task',
        cloudId,
        storyPointsField: 'customfield_10016',
        url: `${entry.siteUrl}/browse/${issue.key}`,
      }))
  )

  return NextResponse.json(issues)
}
