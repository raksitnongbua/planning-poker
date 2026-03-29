'use client'

import { useTranslations } from 'next-intl'
import { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'

import { JiraIssue } from './types'

interface JiraField {
  id: string
  name: string
}

const FIELD_STORAGE_KEY = 'jira_story_points_field'
const DEFAULT_FIELD_ID = 'customfield_10016'

interface Props {
  issue: JiraIssue | null
  siteUrl?: string
  roomStatus: 'VOTING' | 'REVEALED_CARDS'
  consensusValue?: string
  canEdit?: boolean
  onPickIssue: () => void
  onSaveToJira: (issue: JiraIssue, value: number, fieldId: string) => Promise<void>
}

type DescriptionState = 'idle' | 'loading' | 'loaded' | 'error'

export function JiraIssuePanel({
  issue,
  siteUrl = '',
  roomStatus,
  consensusValue,
  canEdit = true,
  onPickIssue,
  onSaveToJira,
}: Props) {
  const t = useTranslations('room.jira')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState(false)
  const [showFieldPicker, setShowFieldPicker] = useState(false)
  const [fields, setFields] = useState<JiraField[]>([])
  const [fieldsLoading, setFieldsLoading] = useState(false)
  const [selectedFieldId, setSelectedFieldId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(FIELD_STORAGE_KEY) ?? DEFAULT_FIELD_ID
    }
    return DEFAULT_FIELD_ID
  })
  const [descriptionState, setDescriptionState] = useState<DescriptionState>('idle')
  const [fullDescription, setFullDescription] = useState<string | null>(null)
  const [descDialogOpen, setDescDialogOpen] = useState(false)

  const prevKey = useRef<string>('')

  // Reset saved state when issue or consensus changes
  useEffect(() => {
    const key = `${issue?.id ?? ''}-${consensusValue ?? ''}`
    if (key !== prevKey.current) {
      prevKey.current = key
      setSaved(false)
      setShowFieldPicker(false)
    }
  }, [issue?.id, consensusValue])

  // Reset description state and fields on issue change
  useEffect(() => {
    setDescriptionState('idle')
    setFullDescription(null)
    setDescDialogOpen(false)
    setFields([])
  }, [issue?.id])

  // Load fields as soon as an issue is linked so the field name is ready
  useEffect(() => {
    if (!canEdit || !issue?.cloudId || fields.length > 0) return
    setFieldsLoading(true)
    fetch(`/api/jira/fields?cloudId=${issue.cloudId}`)
      .then((r) => r.json())
      .then((data: JiraField[]) => setFields(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setFieldsLoading(false))
  }, [canEdit, issue?.cloudId, fields.length])

  function selectField(field: JiraField) {
    setSelectedFieldId(field.id)
    localStorage.setItem(FIELD_STORAGE_KEY, field.id)
    setShowFieldPicker(false)
    setSaved(false)
  }

  async function handleReadMore() {
    setDescDialogOpen(true)
    if (descriptionState === 'loaded' || descriptionState === 'loading') return
    setDescriptionState('loading')
    try {
      const res = await fetch(`/api/jira/issues/${issue!.key}?cloudId=${issue!.cloudId}`)
      if (!res.ok) throw new Error()
      const data = await res.json()
      setFullDescription(data.description ?? null)
      setDescriptionState('loaded')
    } catch {
      setDescriptionState('error')
      setDescDialogOpen(false)
    }
  }

  async function handleSave() {
    if (!issue || !consensusValue) return
    setSaving(true)
    setSaveError(false)
    try {
      await onSaveToJira(issue, Number(consensusValue), selectedFieldId)
      setSaved(true)
    } catch {
      setSaveError(true)
    } finally {
      setSaving(false)
    }
  }

  const isNumericConsensus =
    consensusValue !== undefined &&
    !isNaN(Number(consensusValue)) &&
    isFinite(Number(consensusValue))

  const selectedField = fields.find((f) => f.id === selectedFieldId)

  // Derive Jira URL: use stored url if valid, otherwise build from siteUrl
  const issueUrl = issue
    ? issue.url?.startsWith('http')
      ? issue.url
      : siteUrl
        ? `${siteUrl}/browse/${issue.key}`
        : ''
    : ''

  if (!issue) {
    if (!canEdit) return null
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border/40 p-6 text-center">
        <div className="flex size-10 items-center justify-center rounded-full bg-blue-500/10">
          <svg className="size-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M11.53 2c0 2.4 1.97 4.35 4.35 4.35h1.78v1.7c0 2.4 1.95 4.34 4.34 4.35V2.84a.84.84 0 0 0-.84-.84zM6.77 6.8c0 2.4 1.96 4.34 4.35 4.34h1.78v1.71c0 2.4 1.95 4.34 4.35 4.35V7.63a.84.84 0 0 0-.84-.83zM2 11.6c0 2.4 1.95 4.34 4.35 4.34h1.78v1.71A4.35 4.35 0 0 0 12.48 22v-9.57a.84.84 0 0 0-.84-.83z" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">{t('noIssueLinked')}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{t('noIssueLinkedDesc')}</p>
        </div>
        <Button size="sm" variant="outline" className="border-border/40" onClick={onPickIssue}>
          {t('pickIssue')}
        </Button>
      </div>
    )
  }

  return (
    <div className="animate-in fade-in rounded-xl border border-border/40 bg-muted/20 p-4">
      {/* Issue header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded bg-blue-500/10">
            <svg className="size-3.5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.53 2c0 2.4 1.97 4.35 4.35 4.35h1.78v1.7c0 2.4 1.95 4.34 4.34 4.35V2.84a.84.84 0 0 0-.84-.84zM6.77 6.8c0 2.4 1.96 4.34 4.35 4.34h1.78v1.71c0 2.4 1.95 4.34 4.35 4.35V7.63a.84.84 0 0 0-.84-.83zM2 11.6c0 2.4 1.95 4.34 4.35 4.34h1.78v1.71A4.35 4.35 0 0 0 12.48 22v-9.57a.84.84 0 0 0-.84-.83z" />
            </svg>
          </div>
          <div className="min-w-0">
            {issueUrl ? (
              <a
                href={issueUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-mono text-sm font-bold text-primary underline-offset-2 transition-colors duration-150 hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                {issue.key}
                <svg className="size-3 shrink-0 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            ) : (
              <span className="font-mono text-sm font-bold text-primary">{issue.key}</span>
            )}
            <p className="mt-1 line-clamp-2 text-sm text-foreground">{issue.summary}</p>

            {canEdit && descriptionState !== 'error' && (
              <button
                className="mt-1.5 text-xs text-primary/70 transition-colors duration-150 hover:text-primary"
                onClick={handleReadMore}
              >
                {t('readMore')}
              </button>
            )}
          </div>
        </div>
        {canEdit && (
          <Button
            variant="ghost"
            size="sm"
            className="shrink-0 text-xs text-muted-foreground hover:text-foreground"
            onClick={onPickIssue}
          >
            {t('change')}
          </Button>
        )}
      </div>

      {/* Save row — only after reveal with numeric consensus, and only for connected users */}
      {canEdit && roomStatus === 'REVEALED_CARDS' && isNumericConsensus && (
        <div className="mt-4 space-y-3 border-t border-border/40 pt-4">

          {/* Field selector */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                {t('updatingField')}
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
              {showFieldPicker ? t('cancel') : t('changeField')}
            </button>
          </div>

          {/* Dropdown field list */}
          {showFieldPicker && (
            <div className="rounded-lg border border-border/60 bg-background">
              {fieldsLoading && (
                <div className="flex flex-col gap-1.5 p-2">
                  {[0, 1, 2].map((i) => (
                    <Skeleton key={i} className="h-8 w-full rounded" />
                  ))}
                </div>
              )}
              {!fieldsLoading && fields.length === 0 && (
                <p className="py-3 text-center text-xs text-muted-foreground">
                  {t('noNumericFieldsShort')}
                </p>
              )}
              {!fieldsLoading &&
                fields.map((field) => (
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

          {/* Estimate + save button */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">{t('estimate')}</span>
              <span className="rounded-md bg-primary/10 px-2 py-0.5 font-mono text-sm font-bold text-primary ring-1 ring-inset ring-primary/30">
                {consensusValue}
              </span>
            </div>

            {saved ? (
              <div className="animate-in fade-in flex items-center gap-1.5 rounded-md bg-green-500/10 px-2.5 py-1 text-xs font-medium text-green-400 duration-300">
                <svg
                  className="size-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {t('savedToJira')}
              </div>
            ) : (
              <Button size="sm" onClick={handleSave} disabled={saving}>
                {saving ? t('saving') : t('saveToJira')}
              </Button>
            )}
          </div>

          {saveError && (
            <p className="mt-1 text-[11px] text-red-400">{t('saveFailed')}</p>
          )}
        </div>
      )}

      {/* Description popup */}
      <Dialog open={descDialogOpen} onOpenChange={setDescDialogOpen}>
        <DialogContent className="border-border/40 bg-background sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-mono text-sm text-primary">{issue.key}</DialogTitle>
          </DialogHeader>
          <p className="text-sm font-medium text-foreground">{issue.summary}</p>
          <div className="max-h-96 overflow-y-auto pr-1">
            {descriptionState === 'loading' && (
              <div className="flex flex-col gap-2 pt-1">
                <Skeleton className="h-3.5 w-full rounded" />
                <Skeleton className="h-3.5 w-full rounded" />
                <Skeleton className="h-3.5 w-4/5 rounded" />
                <Skeleton className="h-3.5 w-3/5 rounded" />
              </div>
            )}
            {descriptionState === 'loaded' && (
              fullDescription ? (
                <ReactMarkdown
                  components={{
                    p: ({ children }) => <p className="mb-2 text-sm leading-relaxed text-muted-foreground">{children}</p>,
                    h1: ({ children }) => <h1 className="mb-2 text-base font-bold text-foreground">{children}</h1>,
                    h2: ({ children }) => <h2 className="mb-2 text-sm font-bold text-foreground">{children}</h2>,
                    h3: ({ children }) => <h3 className="mb-1 text-sm font-semibold text-foreground">{children}</h3>,
                    ul: ({ children }) => <ul className="mb-2 list-disc pl-4 text-sm text-muted-foreground">{children}</ul>,
                    ol: ({ children }) => <ol className="mb-2 list-decimal pl-4 text-sm text-muted-foreground">{children}</ol>,
                    li: ({ children }) => <li className="mb-0.5">{children}</li>,
                    code: ({ children, className }) =>
                      className ? (
                        <pre className="mb-2 overflow-x-auto rounded-md bg-muted/40 p-3 text-xs text-foreground"><code>{children}</code></pre>
                      ) : (
                        <code className="rounded bg-muted/40 px-1 py-0.5 font-mono text-xs text-foreground">{children}</code>
                      ),
                    blockquote: ({ children }) => <blockquote className="mb-2 border-l-2 border-border/60 pl-3 text-sm italic text-muted-foreground">{children}</blockquote>,
                    a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2 hover:text-primary/80">{children}</a>,
                    hr: () => <hr className="my-3 border-border/40" />,
                  }}
                >
                  {fullDescription}
                </ReactMarkdown>
              ) : (
                <p className="text-sm text-muted-foreground">{t('noDescription')}</p>
              )
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
