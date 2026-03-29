import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const state = searchParams.get('state') ?? 'demo'

  const params = new URLSearchParams({
    audience: 'api.atlassian.com',
    client_id: process.env.JIRA_CLIENT_ID!,
    scope: 'read:jira-work write:jira-work read:jira-user read:board-scope:jira-software read:sprint:jira-software read:project:jira read:project.avatar:jira offline_access',
    redirect_uri: process.env.JIRA_CALLBACK_URL!,
    response_type: 'code',
    prompt: 'consent',
    state,
  })

  const url = `https://auth.atlassian.com/authorize?${params.toString()}`
  return NextResponse.redirect(url)
}
