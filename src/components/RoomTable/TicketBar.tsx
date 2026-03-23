'use client'

import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'
import { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'

import type { TicketEstimation } from '@/components/JiraIntegration'
import { JiraConnectButton } from '@/components/JiraIntegration'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface JiraField {
  id: string
  name: string
}

const FIELD_STORAGE_KEY = 'jira_story_points_field'
const DEFAULT_FIELD_ID = 'customfield_10016'

interface Props {
  estimation: TicketEstimation | null
  isJiraConnected: boolean
  jiraSiteUrl: string
  cloudId: string
  roomId: string
  roomStatus: 'VOTING' | 'REVEALED_CARDS'
  consensusValue?: string
  finalStoryPoint?: string
  onSet: () => void
  onRemove: () => void
  onSaveToJira: (estimation: TicketEstimation, value: number, fieldId: string) => Promise<void>
  onJiraConnected: () => void
  onJiraDisconnected: () => void
}

function JiraIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M11.53 2c0 2.4 1.97 4.35 4.35 4.35h1.78v1.7c0 2.4 1.95 4.34 4.34 4.35V2.84a.84.84 0 0 0-.84-.84zM6.77 6.8c0 2.4 1.96 4.34 4.35 4.34h1.78v1.71c0 2.4 1.95 4.34 4.35 4.35V7.63a.84.84 0 0 0-.84-.83zM2 11.6c0 2.4 1.95 4.34 4.35 4.34h1.78v1.71A4.35 4.35 0 0 0 12.48 22v-9.57a.84.84 0 0 0-.84-.83z" />
    </svg>
  )
}

function TicketIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  )
}

export function TicketBar({
  estimation,
  isJiraConnected,
  jiraSiteUrl,
  cloudId,
  roomId,
  roomStatus,
  consensusValue,
  finalStoryPoint,
  onSet,
  onRemove,
  onSaveToJira,
  onJiraConnected,
  onJiraDisconnected,
}: Props) {
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState(false)
  const [descDialogOpen, setDescDialogOpen] = useState(false)
  const [descState, setDescState] = useState<'idle' | 'loading' | 'loaded' | 'error'>('idle')
  const [fullDescription, setFullDescription] = useState<string | null>(null)
  const [currentFieldValue, setCurrentFieldValue] = useState<number | null | undefined>(undefined)
  const [fetchingCurrentValue, setFetchingCurrentValue] = useState(false)
  const [showFieldPicker, setShowFieldPicker] = useState(false)
  const [fieldSearch, setFieldSearch] = useState('')
  const [fields, setFields] = useState<JiraField[]>([])
  const [fieldsLoading, setFieldsLoading] = useState(false)
  const [selectedFieldId, setSelectedFieldId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(FIELD_STORAGE_KEY) ?? DEFAULT_FIELD_ID
    }
    return DEFAULT_FIELD_ID
  })

  const prevKey = useRef('')

  // Use finalStoryPoint when set, otherwise fall back to consensusValue
  const saveValue = (finalStoryPoint && finalStoryPoint !== '') ? finalStoryPoint : consensusValue

  useEffect(() => {
    const key = `${estimation?.name ?? ''}-${saveValue ?? ''}`
    if (key !== prevKey.current) {
      prevKey.current = key
      setSaved(false)
      setShowFieldPicker(false)
    }
  }, [estimation?.name, saveValue])

  useEffect(() => {
    setFields([])
    setDescState('idle')
    setFullDescription(null)
    setDescDialogOpen(false)
  }, [estimation?.name])

  useEffect(() => {
    const jiraCloudId = estimation?.jiraCloudId ?? cloudId
    if (!isJiraConnected || !jiraCloudId || fields.length > 0) return
    setFieldsLoading(true)
    fetch(`/api/jira/fields?cloudId=${jiraCloudId}`)
      .then((r) => r.json())
      .then((data: JiraField[]) => setFields(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setFieldsLoading(false))
  }, [isJiraConnected, estimation?.jiraCloudId, cloudId, fields.length])

  const isNumericSaveValue =
    saveValue !== undefined &&
    !isNaN(Number(saveValue)) &&
    isFinite(Number(saveValue))

  const isJira = estimation?.source === 'jira'
  const canSave = isJira && isJiraConnected && roomStatus === 'REVEALED_CARDS' && isNumericSaveValue

  useEffect(() => {
    if (!canSave || !estimation?.jiraIssueId) {
      setCurrentFieldValue(undefined)
      return
    }
    const jiraCloudId = estimation.jiraCloudId ?? cloudId
    setFetchingCurrentValue(true)
    fetch(`/api/jira/issues/${estimation.jiraIssueId}/estimate?cloudId=${jiraCloudId}&fieldId=${selectedFieldId}`)
      .then((r) => r.json())
      .then((data) => setCurrentFieldValue(data.value ?? null))
      .catch(() => setCurrentFieldValue(null))
      .finally(() => setFetchingCurrentValue(false))
  }, [canSave, estimation?.jiraIssueId, estimation?.jiraCloudId, cloudId, selectedFieldId])

  function selectField(field: JiraField) {
    setSelectedFieldId(field.id)
    localStorage.setItem(FIELD_STORAGE_KEY, field.id)
    setShowFieldPicker(false)
    setFieldSearch('')
    setSaved(false)
    setCurrentFieldValue(undefined)
  }

  async function handleReadMore() {
    setDescDialogOpen(true)
    if (descState === 'loaded' || descState === 'loading') return
    setDescState('loading')
    try {
      const jiraCloudId = estimation?.jiraCloudId ?? cloudId
      const res = await fetch(`/api/jira/issues/${estimation!.jiraKey}?cloudId=${jiraCloudId}`)
      if (!res.ok) throw new Error()
      const data = await res.json()
      setFullDescription(data.description ?? null)
      setDescState('loaded')
    } catch {
      setDescState('error')
      setDescDialogOpen(false)
    }
  }

  async function handleSave() {
    if (!estimation || !saveValue) return
    setSaving(true)
    setSaveError(false)
    try {
      await onSaveToJira(estimation, Number(saveValue), selectedFieldId)
      setSaved(true)
      setCurrentFieldValue(Number(saveValue))
    } catch {
      setSaveError(true)
    } finally {
      setSaving(false)
    }
  }

  const isSameValue = currentFieldValue != null && Number(saveValue) === currentFieldValue
  const selectedField = fields.find((f) => f.id === selectedFieldId)
  const filteredFields = fieldSearch.trim()
    ? fields.filter((f) => f.name.toLowerCase().includes(fieldSearch.toLowerCase()))
    : fields

  const issueUrl = isJira
    ? estimation?.jiraUrl?.startsWith('http')
      ? estimation.jiraUrl
      : jiraSiteUrl ? `${jiraSiteUrl}/browse/${estimation?.jiraKey}` : ''
    : ''

  return (
    // All content stacked vertically, centered — rendered in the table center area
    <>
      {/* Ticket info row */}
      <TooltipProvider delayDuration={500}>
        <div className="flex items-center gap-1.5">
          {/* Source icon */}
          {isJira
            ? <JiraIcon className="size-3 shrink-0 text-blue-400" />
            : <TicketIcon className="size-3 shrink-0 text-muted-foreground/40" />
          }

          {/* Ticket identity */}
          {estimation ? (
            <div className="flex min-w-0 items-center gap-1 overflow-hidden">
              {isJira && estimation.jiraKey && (
                issueUrl ? (
                  <a href={issueUrl} target="_blank" rel="noopener noreferrer"
                    className="shrink-0 font-mono text-[10px] font-bold text-primary/80 hover:underline"
                    onClick={(e) => e.stopPropagation()}>
                    {estimation.jiraKey}
                  </a>
                ) : (
                  <span className="shrink-0 font-mono text-[10px] font-bold text-primary/80">{estimation.jiraKey}</span>
                )
              )}
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="max-w-[160px] cursor-default truncate text-[11px] text-muted-foreground">{estimation.name}</span>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-[280px] whitespace-normal break-words">
                  {estimation.name}
                </TooltipContent>
              </Tooltip>
            </div>
          ) : (
            <span className="text-[11px] text-muted-foreground/40">No ticket linked</span>
          )}

          {/* Action icons */}
          <div className="ml-auto flex shrink-0 items-center gap-1">
            {/* Read more */}
            {isJira && isJiraConnected && descState !== 'error' && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className="flex size-5 items-center justify-center rounded text-muted-foreground/40 transition-colors hover:bg-muted/40 hover:text-foreground"
                    onClick={handleReadMore}
                  >
                    <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top">Description</TooltipContent>
              </Tooltip>
            )}

            {/* Change / Set */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="flex size-5 items-center justify-center rounded text-muted-foreground/40 transition-colors hover:bg-muted/40 hover:text-foreground"
                  onClick={onSet}
                >
                  <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">{estimation ? 'Change ticket' : 'Set ticket'}</TooltipContent>
            </Tooltip>

            {/* Remove */}
            {estimation && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className="flex size-5 items-center justify-center rounded text-muted-foreground/30 transition-colors hover:bg-red-500/10 hover:text-red-400"
                    onClick={onRemove}
                  >
                    <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top">Remove ticket</TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>
      </TooltipProvider>

      {/* Save to Jira row — only after reveal with numeric consensus */}
      {canSave && (
        <div className="flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-2 rounded-lg border border-border/40 bg-muted/10 px-2.5 py-1.5">
            {/* Field selector — portal dropdown, won't be clipped */}
            <DropdownMenuPrimitive.Root
              open={showFieldPicker}
              onOpenChange={(v) => { setShowFieldPicker(v); if (!v) setFieldSearch('') }}
            >
              <DropdownMenuPrimitive.Trigger asChild>
                <button className="flex items-center gap-0.5 text-[10px] text-muted-foreground/60 transition-colors hover:text-foreground">
                  <span className="max-w-[120px] truncate">{selectedField?.name ?? selectedFieldId}</span>
                  <svg className="size-2 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </DropdownMenuPrimitive.Trigger>
              <DropdownMenuPrimitive.Portal>
                <DropdownMenuPrimitive.Content
                  side="top"
                  align="center"
                  sideOffset={6}
                  className="z-[9999] w-56 rounded-lg border border-border/60 bg-popover shadow-xl animate-in fade-in-0 zoom-in-95"
                >
                  <div className="border-b border-border/40 p-1.5">
                    <Input
                      autoFocus
                      placeholder="Search field..."
                      value={fieldSearch}
                      onChange={(e) => setFieldSearch(e.target.value)}
                      className="h-7 border-border/40 bg-muted/20 text-xs"
                      onKeyDown={(e) => e.stopPropagation()}
                    />
                  </div>
                  <div className="max-h-48 overflow-y-auto py-1">
                    {fieldsLoading && (
                      <div className="flex flex-col gap-1 p-2">
                        {[0, 1, 2].map((i) => <Skeleton key={i} className="h-6 w-full" />)}
                      </div>
                    )}
                    {!fieldsLoading && filteredFields.length === 0 && (
                      <p className="px-3 py-2 text-xs text-muted-foreground">No fields found</p>
                    )}
                    {!fieldsLoading && filteredFields.map((f) => (
                      <DropdownMenuPrimitive.Item
                        key={f.id}
                        className={`flex cursor-pointer select-none items-center justify-between px-3 py-1.5 text-xs outline-none transition-colors hover:bg-muted/40 focus:bg-muted/40 ${f.id === selectedFieldId ? 'text-primary' : 'text-foreground'}`}
                        onSelect={() => selectField(f)}
                      >
                        <span>{f.name}</span>
                        {f.id === selectedFieldId && (
                          <svg className="size-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </DropdownMenuPrimitive.Item>
                    ))}
                  </div>
                </DropdownMenuPrimitive.Content>
              </DropdownMenuPrimitive.Portal>
            </DropdownMenuPrimitive.Root>

            <span className="h-3 w-px bg-border/40" />

            {/* Current → new value display */}
            <div className="flex items-center gap-1">
              {fetchingCurrentValue ? (
                <span className="inline-block h-3 w-5 animate-pulse rounded bg-muted/40" />
              ) : currentFieldValue != null ? (
                <>
                  <span className="font-mono text-[10px] text-muted-foreground/50">{currentFieldValue}</span>
                  <span className="text-[9px] text-muted-foreground/30">→</span>
                </>
              ) : null}
              <span className="rounded bg-primary/10 px-1.5 py-0.5 font-mono text-[10px] font-bold text-primary">
                {saveValue}
              </span>
            </div>

            <span className="h-3 w-px bg-border/40" />

            {/* Save button */}
            <Button
              size="sm"
              className="h-5 px-2 text-[10px]"
              onClick={handleSave}
              disabled={saving || isSameValue || saved}
            >
              {saving ? '...' : saved || isSameValue ? 'No change' : 'Save to Jira'}
            </Button>
          </div>
          {saveError && <p className="text-[10px] text-red-400">Failed. Check Jira permissions.</p>}
        </div>
      )}

      {/* Jira connect */}
      <JiraConnectButton
        isConnected={isJiraConnected}
        roomId={roomId}
        onConnected={onJiraConnected}
        onDisconnected={onJiraDisconnected}
      />

      {/* Description dialog */}
      {isJira && estimation && (
        <Dialog open={descDialogOpen} onOpenChange={setDescDialogOpen}>
          <DialogContent className="border-border/40 bg-background sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-mono text-sm text-primary">{estimation.jiraKey}</DialogTitle>
            </DialogHeader>
            <p className="text-sm font-medium text-foreground">{estimation.name}</p>
            <div className="max-h-96 overflow-y-auto pr-1">
              {descState === 'loading' && (
                <div className="flex flex-col gap-2 pt-1">
                  {[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-3.5 w-full rounded" />)}
                </div>
              )}
              {descState === 'loaded' && (
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
                  <p className="text-sm text-muted-foreground">No description available.</p>
                )
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
