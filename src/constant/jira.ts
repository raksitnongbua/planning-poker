// Stores AES-256-GCM encrypted Jira session data (accessToken, refreshToken, cloudId, siteUrl).
export const JIRA_SESSION_COOKIE = 'jira_session'

export const JIRA_RT_COOKIE = 'jira_rt'

// Legacy cookies — cleared on disconnect to prevent 431 errors from old sessions.
export const JIRA_TOKEN_COOKIE = 'jira_token'
export const JIRA_REFRESH_TOKEN_COOKIE = 'jira_refresh_token'
export const JIRA_CLOUD_ID_COOKIE = 'jira_cloud_id'
