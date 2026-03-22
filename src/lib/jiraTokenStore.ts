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
