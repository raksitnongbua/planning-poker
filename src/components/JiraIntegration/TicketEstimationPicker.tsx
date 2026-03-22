'use client'

import { useEffect, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'

import { JiraIssue, TicketEstimation } from './types'

interface JiraField {
  id: string
  name: string
}

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  isJiraConnected: boolean
  cloudId: string
  onSelect: (estimation: TicketEstimation) => void
}

const DEFAULT_FIELD_ID = 'customfield_10016'
const FIELD_STORAGE_KEY = 'jira_story_points_field'

type Tab = 'text' | 'jira'

function GenericTicketIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  )
}

function JiraIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M11.53 2c0 2.4 1.97 4.35 4.35 4.35h1.78v1.7c0 2.4 1.95 4.34 4.34 4.35V2.84a.84.84 0 0 0-.84-.84zM6.77 6.8c0 2.4 1.96 4.34 4.35 4.34h1.78v1.71c0 2.4 1.95 4.34 4.35 4.35V7.63a.84.84 0 0 0-.84-.83zM2 11.6c0 2.4 1.95 4.34 4.35 4.34h1.78v1.71A4.35 4.35 0 0 0 12.48 22v-9.57a.84.84 0 0 0-.84-.83z" />
    </svg>
  )
}

export function TicketEstimationPicker({ open, onOpenChange, isJiraConnected, cloudId, onSelect }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('text')
  const [freeText, setFreeText] = useState('')

  // Jira search state
  const [query, setQuery] = useState('')
  const [issues, setIssues] = useState<JiraIssue[]>([])
  const [loading, setLoading] = useState(false)
  const [fields, setFields] = useState<JiraField[]>([])
  const [selectedFieldId, setSelectedFieldId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(FIELD_STORAGE_KEY) ?? DEFAULT_FIELD_ID
    }
    return DEFAULT_FIELD_ID
  })
  const [showFieldPicker, setShowFieldPicker] = useState(false)
  const [fieldSearch, setFieldSearch] = useState('')
  const [fieldsLoading, setFieldsLoading] = useState(false)

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Reset on close; default to Jira tab when connected
  useEffect(() => {
    if (!open) {
      setFreeText('')
      setQuery('')
      setIssues([])
      setShowFieldPicker(false)
    } else {
      setActiveTab(isJiraConnected ? 'jira' : 'text')
    }
  }, [open, isJiraConnected])

  // Load fields as soon as Jira tab is active (not just when picker opens)
  useEffect(() => {
    if (activeTab !== 'jira' || !cloudId || fields.length > 0) return
    setFieldsLoading(true)
    fetch(`/api/jira/fields?cloudId=${cloudId}`)
      .then((r) => r.json())
      .then((data: JiraField[]) => setFields(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setFieldsLoading(false))
  }, [activeTab, cloudId, fields.length])

  // Debounced Jira issue search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (!query.trim()) {
      setIssues([])
      setLoading(false)
      return
    }

    setLoading(true)
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/jira/issues?q=${encodeURIComponent(query)}&cloudId=${cloudId}`
        )
        if (res.ok) {
          const data: JiraIssue[] = await res.json()
          setIssues(data.map((i) => ({ ...i, storyPointsField: selectedFieldId })))
        }
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query, cloudId, selectedFieldId])

  function handleFreeTextSubmit() {
    const name = freeText.trim()
    if (!name) return
    onSelect({ name, source: '' })
    onOpenChange(false)
  }

  function handleJiraSelect(issue: JiraIssue) {
    onSelect({
      name: issue.summary,
      source: 'jira',
      jiraKey: issue.key,
      jiraIssueId: issue.id,
      jiraCloudId: issue.cloudId,
      jiraUrl: issue.url,
      jiraType: issue.type,
      storyPointsField: selectedFieldId,
    })
    onOpenChange(false)
  }

  function selectField(field: JiraField) {
    setSelectedFieldId(field.id)
    localStorage.setItem(FIELD_STORAGE_KEY, field.id)
    setShowFieldPicker(false)
    setFieldSearch('')
  }

  const selectedField = fields.find((f) => f.id === selectedFieldId)
  const filteredFields = fieldSearch.trim()
    ? fields.filter((f) => f.name.toLowerCase().includes(fieldSearch.toLowerCase()))
    : fields

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-border/40 bg-background sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-base">Set Ticket</DialogTitle>
        </DialogHeader>

        {/* Tab switcher — only shown when Jira is connected */}
        {isJiraConnected && (
          <div className="flex rounded-lg border border-border/40 bg-muted/10 p-0.5">
            <button
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-1.5 text-xs font-medium transition-colors ${
                activeTab === 'jira'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setActiveTab('jira')}
            >
              <JiraIcon className="size-3.5 text-blue-400" />
              Jira
            </button>
            <button
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-1.5 text-xs font-medium transition-colors ${
                activeTab === 'text'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setActiveTab('text')}
            >
              <GenericTicketIcon className="size-3.5" />
              Free text
            </button>
          </div>
        )}

        {/* Free text panel */}
        {activeTab === 'text' && (
          <div className="flex flex-col gap-3">
            {!isJiraConnected && (
              <p className="text-xs text-muted-foreground">
                Enter a ticket name to display on the table for all voters.
              </p>
            )}
            <Input
              autoFocus
              placeholder="e.g. Fix login bug, PROJ-42, Sprint 5 API..."
              value={freeText}
              onChange={(e) => setFreeText(e.target.value)}
              className="border-border/40 bg-muted/20"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleFreeTextSubmit()
              }}
            />
            <Button
              size="sm"
              onClick={handleFreeTextSubmit}
              disabled={!freeText.trim()}
            >
              Set Ticket
            </Button>
          </div>
        )}

        {/* Jira search panel */}
        {activeTab === 'jira' && (
          <div className="flex flex-col gap-3">
            {/* Story points field selector */}
            <div className="flex items-center justify-between rounded-lg border border-border/40 bg-muted/20 px-3 py-2">
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                  Story Points Field
                </span>
                {fieldsLoading ? (
                  <Skeleton className="mt-0.5 h-4 w-32" />
                ) : (
                  <span className="text-xs text-foreground">
                    {selectedField?.name ?? selectedFieldId}
                    {selectedField && (
                      <span className="ml-1 font-mono text-[10px] text-muted-foreground/50">({selectedField.id})</span>
                    )}
                  </span>
                )}
              </div>
              <button
                className="text-xs text-primary hover:underline"
                onClick={() => { setShowFieldPicker((v) => !v); setFieldSearch('') }}
              >
                {showFieldPicker ? 'Cancel' : 'Change'}
              </button>
            </div>

            {showFieldPicker && (
              <div className="rounded-lg border border-border/40 bg-muted/10">
                <div className="border-b border-border/40 p-1.5">
                  <Input
                    autoFocus
                    placeholder="Search field..."
                    value={fieldSearch}
                    onChange={(e) => setFieldSearch(e.target.value)}
                    className="h-7 border-border/40 bg-muted/20 text-xs"
                  />
                </div>
                <div className="max-h-40 overflow-y-auto py-1">
                  {fieldsLoading && (
                    <div className="flex flex-col gap-1.5 p-2">
                      {[0, 1, 2].map((i) => <Skeleton key={i} className="h-8 w-full rounded" />)}
                    </div>
                  )}
                  {!fieldsLoading && filteredFields.length === 0 && (
                    <p className="py-3 text-center text-xs text-muted-foreground">No fields found</p>
                  )}
                  {!fieldsLoading && filteredFields.map((field) => (
                    <button
                      key={field.id}
                      className={`flex w-full items-center justify-between px-3 py-2 text-left transition-colors hover:bg-muted/40 ${
                        field.id === selectedFieldId ? 'text-primary' : 'text-foreground'
                      }`}
                      onClick={() => selectField(field)}
                    >
                      <span className="text-sm">{field.name}</span>
                      {field.id === selectedFieldId && (
                        <svg className="size-3 shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <Input
              autoFocus
              placeholder="Search by key or title..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="border-border/40 bg-muted/20"
            />

            <div className="max-h-72 overflow-y-auto">
              {loading && (
                <div className="flex flex-col gap-2 py-2">
                  {[0, 1, 2].map((i) => (
                    <Skeleton key={i} className="h-12 w-full rounded-lg" />
                  ))}
                </div>
              )}

              {!loading && !query.trim() && (
                <p className="py-6 text-center text-sm text-muted-foreground">Type to search issues</p>
              )}

              {!loading && query.trim() && issues.length === 0 && (
                <p className="py-6 text-center text-sm text-muted-foreground">No issues found</p>
              )}

              {!loading && issues.length > 0 && (
                <div className="flex flex-col gap-1 py-1">
                  {issues.map((issue) => (
                    <button
                      key={issue.id}
                      className="flex w-full items-start gap-2.5 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-muted/40"
                      onClick={() => handleJiraSelect(issue)}
                    >
                      <JiraIcon className="mt-0.5 size-3.5 shrink-0 text-blue-400" />
                      <div className="min-w-0">
                        <span className="font-mono text-xs font-bold text-primary">{issue.key}</span>
                        <p className="mt-0.5 line-clamp-2 text-sm text-foreground">{issue.summary}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
