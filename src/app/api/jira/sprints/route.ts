import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

import { applyRefreshedCookies, getValidJiraSession } from '@/lib/jiraAuth'

interface JiraSprint {
  id: number | null
  name: string
  state?: 'active' | 'future' | 'closed'
  boardName?: string
  isFavouriteBoard?: boolean
  jqlValue: string
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const cloudId = searchParams.get('cloudId')
  const projectKey = searchParams.get('projectKey')
  if (!cloudId) return NextResponse.json({ error: 'Missing cloudId' }, { status: 400 })

  const cookieStore = await cookies()
  const { entry, refreshed } = await getValidJiraSession(cookieStore)
  if (!entry) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  const headers = { Authorization: `Bearer ${entry.accessToken}`, Accept: 'application/json' }
  const base = `https://api.atlassian.com/ex/jira/${cloudId}`

  // Fetch scrum boards; scope to project when projectKey is provided
  const boardParams = new URLSearchParams({ maxResults: '50', type: 'scrum' })
  if (projectKey) boardParams.set('projectKeyOrId', projectKey)
  const boardRes = await fetch(`${base}/rest/agile/1.0/board?${boardParams}`, { headers })
  if (!boardRes.ok) {
    return NextResponse.json({ error: 'Failed to fetch boards' }, { status: boardRes.status })
  }

  const boardData = await boardRes.json()
  const allBoards: { id: number; name: string; favourite?: boolean }[] = boardData.values ?? []

  if (allBoards.length === 0) {
    return NextResponse.json([])
  }

  // Sort: favourite boards first, then cap at 20
  allBoards.sort((a, b) => {
    if (a.favourite === b.favourite) return 0
    return a.favourite ? -1 : 1
  })
  const boards = allBoards.slice(0, 20)

  // Fetch active+future sprints for each board in parallel; maxResults=50 per board
  const sprintResults = await Promise.allSettled(
    boards.map((board) =>
      fetch(`${base}/rest/agile/1.0/board/${board.id}/sprint?state=active,future&maxResults=50`, { headers })
        .then(async (r) => {
          if (!r.ok) return []
          const data = await r.json()
          return (data.values ?? []).map((s: { id: number; name: string; state: string }) => ({
            id: s.id,
            name: s.name,
            state: s.state as JiraSprint['state'],
            boardName: board.name,
            isFavouriteBoard: board.favourite === true,
            jqlValue: String(s.id),
          }))
        })
    )
  )

  // Deduplicate sprints that appear on multiple boards
  const sprints: JiraSprint[] = []
  const seen = new Set<number>()
  for (const result of sprintResults) {
    if (result.status === 'rejected') continue
    for (const s of result.value) {
      if (!seen.has(s.id!)) {
        seen.add(s.id!)
        sprints.push(s)
      }
    }
  }

  // Sort: favourite board sprints first, then future before active
  sprints.sort((a, b) => {
    if (a.isFavouriteBoard !== b.isFavouriteBoard) return a.isFavouriteBoard ? -1 : 1
    const order: Record<string, number> = { future: 0, active: 1, closed: 2 }
    return (order[a.state ?? ''] ?? 3) - (order[b.state ?? ''] ?? 3)
  })

  const response = NextResponse.json(sprints)
  if (refreshed) applyRefreshedCookies(response, refreshed)
  return response
}
