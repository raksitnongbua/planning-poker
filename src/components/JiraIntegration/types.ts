export interface JiraIssue {
  id: string
  key: string
  summary: string
  type: string
  cloudId: string
  storyPointsField: string
  url: string
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
}
