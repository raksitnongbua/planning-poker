import React from 'react'

// Shared Jira issue-type icon definitions.
// Each icon is an SVG with a coloured <rect> background (matches Jira's visual style).

const defaultIcon = (
  <svg className="size-3.5 shrink-0" viewBox="0 0 16 16" fill="none">
    <rect width="16" height="16" rx="3" fill="#626F86" />
    <rect x="4" y="4" width="8" height="1.5" rx="0.5" fill="#fff" />
    <rect x="4" y="7.25" width="8" height="1.5" rx="0.5" fill="#fff" />
    <rect x="4" y="10.5" width="5" height="1.5" rx="0.5" fill="#fff" />
  </svg>
)

const ISSUE_TYPES = [
  {
    name: 'Story',
    icon: (
      <svg className="size-3.5 shrink-0" viewBox="0 0 16 16" fill="none">
        <rect width="16" height="16" rx="3" fill="#22A06B" />
        <path d="M5 8.5l2 2 4-4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: 'Bug',
    icon: (
      <svg className="size-3.5 shrink-0" viewBox="0 0 16 16" fill="none">
        <rect width="16" height="16" rx="3" fill="#E5493A" />
        <circle cx="8" cy="8.5" r="2.5" stroke="#fff" strokeWidth="1.3" />
        <path d="M8 6V4.5M6 7.5L4.5 7M10 7.5L11.5 7M6.5 10.5L5 11.5M9.5 10.5L11 11.5" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: 'Task',
    icon: (
      <svg className="size-3.5 shrink-0" viewBox="0 0 16 16" fill="none">
        <rect width="16" height="16" rx="3" fill="#4BADE8" />
        <path d="M4.5 8l2.5 2.5 4.5-5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: 'Epic',
    icon: (
      <svg className="size-3.5 shrink-0" viewBox="0 0 16 16" fill="none">
        <rect width="16" height="16" rx="3" fill="#904EE2" />
        <path d="M9 3.5L5.5 9H8L7 12.5L10.5 7H8L9 3.5Z" fill="#fff" />
      </svg>
    ),
  },
  {
    name: 'Sub-task',
    icon: (
      <svg className="size-3.5 shrink-0" viewBox="0 0 16 16" fill="none">
        <rect width="16" height="16" rx="3" fill="#4BADE8" />
        <rect x="3.5" y="3.5" width="4" height="4" rx="0.5" stroke="#fff" strokeWidth="1.2" />
        <path d="M5.5 7.5v2H9M9 9l-1-1M9 9l-1 1" stroke="#fff" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="9" y="9" width="3.5" height="3.5" rx="0.5" stroke="#fff" strokeWidth="1.2" />
      </svg>
    ),
  },
]

export function getIssueTypeIcon(type: string | undefined): React.ReactElement {
  if (!type) return defaultIcon
  const found = ISSUE_TYPES.find((t) => t.name.toLowerCase() === type.toLowerCase())
  return found ? found.icon : defaultIcon
}
