import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

import { JIRA_SESSION_COOKIE } from '@/constant/jira'
import { getJiraTokens, setJiraTokens } from '@/lib/jiraTokenStore'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q') ?? ''
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

  // Back-fill siteUrl for sessions created before this field was added
  if (!entry.siteUrl && sessionId) {
    const resourcesRes = await fetch('https://api.atlassian.com/oauth/token/accessible-resources', {
      headers: { Authorization: `Bearer ${entry.accessToken}`, Accept: 'application/json' },
    })
    if (resourcesRes.ok) {
      const resources = await resourcesRes.json()
      const siteUrl = resources[0]?.url ?? ''
      setJiraTokens(sessionId, { ...entry, siteUrl })
      entry.siteUrl = siteUrl
    }
  }

  const params = new URLSearchParams({
    query: q,
    currentJQL: 'order by updated DESC',
  })

  const res = await fetch(
    `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/issue/picker?${params.toString()}`,
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
