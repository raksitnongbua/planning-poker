'use client'

import { useEffect, useRef, useState } from 'react'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'

import { JiraIssue } from './types'

interface JiraField {
  id: string
  name: string
}

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  cloudId: string
  onSelect: (issue: JiraIssue) => void
}

const DEFAULT_FIELD_ID = 'customfield_10016'
const FIELD_STORAGE_KEY = 'jira_story_points_field'

export function JiraIssuePicker({ open, onOpenChange, cloudId, onSelect }: Props) {
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
  const [fieldsLoading, setFieldsLoading] = useState(false)

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Reset on close
  useEffect(() => {
    if (!open) {
      setQuery('')
      setIssues([])
      setShowFieldPicker(false)
    }
  }, [open])

  // Load fields when field picker opens
  useEffect(() => {
    if (!showFieldPicker || !cloudId || fields.length > 0) return
    setFieldsLoading(true)
    fetch(`/api/jira/fields?cloudId=${cloudId}`)
      .then((r) => r.json())
      .then((data: JiraField[]) => setFields(data))
      .catch(() => {})
      .finally(() => setFieldsLoading(false))
  }, [showFieldPicker, cloudId, fields.length])

  // Debounced issue search
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
          // Attach the currently selected story points field to each issue
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

  function handleSelect(issue: JiraIssue) {
    onSelect({ ...issue, storyPointsField: selectedFieldId })
    onOpenChange(false)
  }

  function selectField(field: JiraField) {
    setSelectedFieldId(field.id)
    localStorage.setItem(FIELD_STORAGE_KEY, field.id)
    setShowFieldPicker(false)
  }

  const selectedField = fields.find((f) => f.id === selectedFieldId)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-border/40 bg-background sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-base">Search Jira Issues</DialogTitle>
        </DialogHeader>

        {/* Story points field selector */}
        <div className="flex items-center justify-between rounded-lg border border-border/40 bg-muted/20 px-3 py-2">
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
              Story Points Field
            </span>
            <span className="text-xs text-foreground">
              {selectedField?.name ?? selectedFieldId}
              {selectedField && (
                <span className="ml-1 font-mono text-[10px] text-muted-foreground/50">({selectedField.id})</span>
              )}
            </span>
          </div>
          <button
            className="text-xs text-primary hover:underline"
            onClick={() => setShowFieldPicker((v) => !v)}
          >
            {showFieldPicker ? 'Cancel' : 'Change'}
          </button>
        </div>

        {/* Field picker list */}
        {showFieldPicker && (
          <div className="max-h-40 overflow-y-auto rounded-lg border border-border/40 bg-muted/10">
            {fieldsLoading && (
              <div className="flex flex-col gap-1.5 p-2">
                {[0, 1, 2].map((i) => <Skeleton key={i} className="h-8 w-full rounded" />)}
              </div>
            )}
            {!fieldsLoading && fields.length === 0 && (
              <p className="py-4 text-center text-xs text-muted-foreground">
                No numeric custom fields found
              </p>
            )}
            {!fieldsLoading && fields.map((field) => (
              <button
                key={field.id}
                className={`flex w-full items-center justify-between px-3 py-2 text-left transition-colors hover:bg-muted/40 ${
                  field.id === selectedFieldId ? 'text-primary' : 'text-foreground'
                }`}
                onClick={() => selectField(field)}
              >
                <span className="text-sm">{field.name} <span className="font-mono text-[10px] text-muted-foreground/50">({field.id})</span></span>
              </button>
            ))}
          </div>
        )}

        <Input
          autoFocus
          placeholder="Search by key or title..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border-border/40 bg-muted/20"
        />

        <div className="max-h-80 overflow-y-auto">
          {loading && (
            <div className="flex flex-col gap-2 py-2">
              {[0, 1, 2].map((i) => (
                <Skeleton key={i} className="h-12 w-full rounded-lg" />
              ))}
            </div>
          )}

          {!loading && !query.trim() && (
            <p className="py-6 text-center text-sm text-muted-foreground">
              Type to search issues
            </p>
          )}

          {!loading && query.trim() && issues.length === 0 && (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No issues found
            </p>
          )}

          {!loading && issues.length > 0 && (
            <div className="flex flex-col gap-1 py-1">
              {issues.map((issue) => (
                <button
                  key={issue.id}
                  className="flex w-full flex-col items-start rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-muted/40"
                  onClick={() => handleSelect(issue)}
                >
                  <span className="font-mono text-xs font-bold text-primary">
                    {issue.key}
                  </span>
                  <span className="mt-0.5 line-clamp-2 text-sm text-foreground">
                    {issue.summary}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
