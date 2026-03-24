export interface JiraIssue {
  id: string
  key: string
  summary: string
  type: string
  cloudId: string
  storyPointsField: string
  url: string
}

export interface JiraProject {
  id: string
  key: string
  name: string
  avatarUrl?: string
}

export interface JiraSprint {
  id: number | null
  name: string
  state?: 'active' | 'future' | 'closed'
  boardName?: string
  isFavouriteBoard?: boolean
  jqlValue: string
}

export interface TicketEstimation {
  name: string
  source: 'jira' | ''
  jiraKey?: string
  jiraIssueId?: string
  jiraCloudId?: string
  jiraUrl?: string
  jiraType?: string
  storyPointsField?: string
  avgScore?: number
  finalScore?: string
}
