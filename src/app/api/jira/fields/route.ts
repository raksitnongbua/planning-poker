import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

import { applyRefreshedCookies, getValidJiraSession } from '@/lib/jiraAuth'

export interface JiraField {
  id: string
  name: string
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const cloudId = searchParams.get('cloudId')
  // mode=sp → number fields (story points); mode=time → string fields (duration notation like 1d 2h)
  const mode = searchParams.get('mode') ?? 'sp'

  if (!cloudId) {
    return NextResponse.json({ error: 'Missing cloudId' }, { status: 400 })
  }

  const cookieStore = await cookies()
  const { entry, refreshed } = await getValidJiraSession(cookieStore)

  if (!entry) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const res = await fetch(
    `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/field`,
    { headers: { Authorization: `Bearer ${entry.accessToken}`, Accept: 'application/json' } }
  )

  if (!res.ok) {
    return NextResponse.json({ error: 'Jira API error' }, { status: res.status })
  }

  const fields: { id: string; name: string; schema?: { type: string } }[] = await res.json()

  const filteredFields = mode === 'time'
    // time mode: include string (text fields accepting "1d 2h"), number (teams storing days as a number), and duration types
    ? fields.filter((f) => f.schema != null && (f.schema.type === 'string' || f.schema.type === 'number' || f.schema.type === 'duration') && f.id.startsWith('customfield_'))
    : fields.filter((f) => f.schema != null && f.schema.type === 'number' && f.id.startsWith('customfield_'))

  const response = NextResponse.json(filteredFields.map((f) => ({ id: f.id, name: f.name })))
  if (refreshed) applyRefreshedCookies(response, refreshed)
  return response
}
