import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

import { applyRefreshedCookies, getValidJiraSession } from '@/lib/jiraAuth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ issueId: string }> }
) {
  const { issueId } = await params
  const { searchParams } = new URL(request.url)
  const cloudId = searchParams.get('cloudId')
  const fieldId = searchParams.get('fieldId') ?? 'customfield_10016'

  if (!cloudId) {
    return NextResponse.json({ error: 'Missing cloudId' }, { status: 400 })
  }

  const cookieStore = await cookies()
  const { entry, refreshed } = await getValidJiraSession(cookieStore)

  if (!entry) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const res = await fetch(
    `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/issue/${issueId}?fields=${fieldId}`,
    { headers: { Authorization: `Bearer ${entry.accessToken}`, Accept: 'application/json' } }
  )

  if (!res.ok) {
    return NextResponse.json({ error: 'Jira API error' }, { status: res.status })
  }

  const data = await res.json()
  const value: number | null = data.fields?.[fieldId] ?? null
  const response = NextResponse.json({ value })
  if (refreshed) applyRefreshedCookies(response, refreshed)
  return response
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ issueId: string }> }
) {
  const { issueId } = await params

  const cookieStore = await cookies()
  const { entry, refreshed: refreshedPatch } = await getValidJiraSession(cookieStore)

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

  const response = NextResponse.json({ ok: true })
  if (refreshedPatch) applyRefreshedCookies(response, refreshedPatch)
  return response
}
