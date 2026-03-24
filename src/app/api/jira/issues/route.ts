import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

import { applyRefreshedCookies, getValidJiraSession } from '@/lib/jiraAuth'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q') ?? ''
  const cloudId = searchParams.get('cloudId')
  const jql = searchParams.get('jql')
  const project = searchParams.get('project')
  const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get('pageSize') ?? '25', 10)))
  const pageToken = searchParams.get('pageToken') // cursor token for Jira cursor-based pagination

  if (!cloudId) return NextResponse.json({ error: 'Missing cloudId' }, { status: 400 })

  const cookieStore = await cookies()
  const { entry, refreshed } = await getValidJiraSession(cookieStore)
  if (!entry) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  const jiraHeaders = { Authorization: `Bearer ${entry.accessToken}`, Accept: 'application/json' }
  const base = `https://api.atlassian.com/ex/jira/${cloudId}`

  // ── JQL search (cursor-based pagination via nextPageToken) ──
  if (jql !== null) {
    const fullJql = project ? `project = "${project}" AND (${jql})` : jql
    const jiraParams: Record<string, string> = { jql: fullJql, fields: 'summary,issuetype', maxResults: String(pageSize) }
    // Use cursor token for subsequent pages; startAt=0 only for first page
    if (pageToken) jiraParams.nextPageToken = pageToken
    const params = new URLSearchParams(jiraParams)
    let res = await fetch(`${base}/rest/api/3/search/jql?${params}`, { headers: jiraHeaders })
    if (!res.ok) res = await fetch(`${base}/rest/api/3/search?${params}`, { headers: jiraHeaders })
    if (!res.ok) return NextResponse.json({ error: 'Jira API error' }, { status: res.status })

    const data = await res.json()
    const issues = (data.issues ?? []).map(
      (i: { id: string; key: string; fields: { summary: string; issuetype: { name: string } } }) => ({
        id: i.id, key: i.key, summary: i.fields.summary, type: i.fields.issuetype.name,
        cloudId, storyPointsField: 'customfield_10016', url: `${entry.siteUrl}/browse/${i.key}`,
      })
    )
    const isLast: boolean = data.isLast ?? !data.nextPageToken
    const response = NextResponse.json({ issues, hasMore: !isLast, nextPageToken: data.nextPageToken ?? null })
    if (refreshed) applyRefreshedCookies(response, refreshed)
    return response
  }

  // ── Text search via issue/picker (no pagination — quick keyword search) ──
  const currentJQL = project ? `project = "${project}" ORDER BY updated DESC` : 'order by updated DESC'
  const params = new URLSearchParams({ query: q, currentJQL })
  const res = await fetch(`${base}/rest/api/3/issue/picker?${params}`, { headers: jiraHeaders })
  if (!res.ok) return NextResponse.json({ error: 'Jira API error' }, { status: res.status })

  const data = await res.json()
  const issues = (data.sections ?? []).flatMap(
    (section: { issues?: { id: string; key: string; summaryText: string }[] }) =>
      (section.issues ?? []).map((issue) => ({
        id: String(issue.id), key: issue.key, summary: issue.summaryText, type: 'Task',
        cloudId, storyPointsField: 'customfield_10016', url: `${entry.siteUrl}/browse/${issue.key}`,
      }))
  )
  const response = NextResponse.json({ issues, total: issues.length, startAt: 0 })
  if (refreshed) applyRefreshedCookies(response, refreshed)
  return response
}
