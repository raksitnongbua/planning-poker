import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

import { applyRefreshedCookies, getValidJiraSession } from '@/lib/jiraAuth'

export interface JiraProject {
  id: string
  key: string
  name: string
  avatarUrl?: string
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const cloudId = searchParams.get('cloudId')

  if (!cloudId) {
    return NextResponse.json({ error: 'Missing cloudId' }, { status: 400 })
  }

  const cookieStore = await cookies()
  const { entry, refreshed } = await getValidJiraSession(cookieStore)

  if (!entry) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const res = await fetch(
    `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/project/search?maxResults=50&orderBy=name`,
    { headers: { Authorization: `Bearer ${entry.accessToken}`, Accept: 'application/json' } }
  )

  if (!res.ok) {
    return NextResponse.json({ error: 'Jira API error' }, { status: res.status })
  }

  const data = await res.json()

  const projects: JiraProject[] = (data.values ?? []).map(
    (v: { id: string; key: string; name: string; avatarUrls?: Record<string, string> }) => ({
      id: v.id,
      key: v.key,
      name: v.name,
      avatarUrl: v.avatarUrls?.['16x16']
        ? `/api/jira/avatar?url=${encodeURIComponent(v.avatarUrls['16x16'])}`
        : undefined,
    })
  )

  const response = NextResponse.json(projects)
  if (refreshed) applyRefreshedCookies(response, refreshed)
  return response
}
