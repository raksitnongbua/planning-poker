// Server-side in-memory store for Jira tokens.
// Avoids storing large JWT tokens in cookies (which causes 431 errors).
// Note: tokens are cleared on server restart — acceptable for demo/dev use.

interface JiraTokenEntry {
  accessToken: string
  refreshToken: string
  cloudId: string
  siteUrl: string
}

const store = new Map<string, JiraTokenEntry>()

export function setJiraTokens(sessionId: string, entry: JiraTokenEntry) {
  store.set(sessionId, entry)
}

export function getJiraTokens(sessionId: string): JiraTokenEntry | undefined {
  return store.get(sessionId)
}

export function deleteJiraTokens(sessionId: string) {
  store.delete(sessionId)
}
