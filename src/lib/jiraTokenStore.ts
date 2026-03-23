// Jira session stored in an httpOnly cookie as base64url-encoded JSON.
// Security boundary is the httpOnly + secure + sameSite flags — no server-side state needed.

export interface JiraTokenEntry {
  accessToken: string
  cloudId: string
  siteUrl: string
}

export function encodeJiraSession(entry: JiraTokenEntry): string {
  return Buffer.from(JSON.stringify(entry)).toString('base64url')
}

export function decodeJiraSession(token: string): JiraTokenEntry | null {
  try {
    return JSON.parse(Buffer.from(token, 'base64url').toString('utf8')) as JiraTokenEntry
  } catch {
    return null
  }
}

// --- Refresh token cookie helpers ---

export function encodeJiraRefresh(rt: string): string {
  return Buffer.from(rt).toString('base64url')
}

export function decodeJiraRefresh(value: string): string | null {
  try {
    return Buffer.from(value, 'base64url').toString('utf8')
  } catch {
    return null
  }
}

// --- Token refresh helper ---

export interface RefreshResult {
  accessToken: string
  refreshToken: string
  cloudId: string
  siteUrl: string
}

export async function refreshJiraTokens(
  refreshToken: string,
  cloudId: string,
  siteUrl: string
): Promise<RefreshResult | null> {
  const res = await fetch('https://auth.atlassian.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'refresh_token',
      client_id: process.env.JIRA_CLIENT_ID,
      client_secret: process.env.JIRA_CLIENT_SECRET,
      refresh_token: refreshToken,
    }),
  })

  if (!res.ok) return null

  const { access_token, refresh_token } = await res.json()
  if (!access_token) return null

  return {
    accessToken: access_token,
    refreshToken: refresh_token ?? refreshToken,
    cloudId,
    siteUrl,
  }
}
