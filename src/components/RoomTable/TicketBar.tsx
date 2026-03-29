'use client'

import { useEffect, useRef, useState } from 'react'

import type { TicketEstimation } from '@/components/JiraIntegration'
import { JiraConnectButton } from '@/components/JiraIntegration'
import { DEFAULT_FIELD_ID, EstimationMode, ORIGINAL_ESTIMATE_FIELD_ID } from '@/components/JiraIntegration/constants'
import { getIssueTypeIcon } from '@/components/JiraIntegration/jiraIssueTypeIcon'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface JiraField {
  id: string
  name: string
}

interface Props {
  estimation: TicketEstimation | null
  isJiraConnected: boolean
  jiraSiteUrl: string
  cloudId: string
  roomId: string
  roomStatus: 'VOTING' | 'REVEALED_CARDS'
  consensusValue?: string
  finalStoryPoint?: string
  isSpectator?: boolean
  estimationMode?: EstimationMode
  storyFieldId?: string
  timeFieldId?: string
  onSet: () => void
  onRemove: () => void
  onSaveToJira: (estimation: TicketEstimation, value: number, fieldId: string) => Promise<void>
  onOpenTicketInfo?: (ticket: TicketEstimation) => void
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
  isSpectator = false,
  estimationMode = 'story_points',
  storyFieldId,
  timeFieldId = ORIGINAL_ESTIMATE_FIELD_ID,
  onSet,
  onRemove,
  onSaveToJira,
  onOpenTicketInfo,
}: Props) {
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState(false)
  const [currentFieldValue, setCurrentFieldValue] = useState<number | null | undefined>(undefined)
  const [fetchingCurrentValue, setFetchingCurrentValue] = useState(false)
  const [fields, setFields] = useState<JiraField[]>([])

  // Use prop-driven field IDs (from Room.tsx state) so changes in TicketQueuePanel
  // are reflected here immediately without requiring a remount.
  const selectedFieldId = estimationMode === 'time'
    ? timeFieldId
    : (storyFieldId ?? DEFAULT_FIELD_ID)

  const prevKey = useRef('')

  // Use finalStoryPoint when set, otherwise fall back to consensusValue
  const saveValue = (finalStoryPoint && finalStoryPoint !== '') ? finalStoryPoint : consensusValue

  useEffect(() => {
    const key = `${estimation?.name ?? ''}-${saveValue ?? ''}`
    if (key !== prevKey.current) {
      prevKey.current = key
      setSaved(false)
    }
  }, [estimation?.name, saveValue])

  // Load fields to resolve field name for display in the save row
  useEffect(() => {
    setFields([])
  }, [estimation?.name])

  useEffect(() => {
    const jiraCloudId = estimation?.jiraCloudId ?? cloudId
    if (!isJiraConnected || !jiraCloudId || fields.length > 0 || estimationMode === 'time') return
    fetch(`/api/jira/fields?cloudId=${jiraCloudId}`)
      .then((r) => r.json())
      .then((data: JiraField[]) => setFields(Array.isArray(data) ? data : []))
      .catch(() => {})
  }, [isJiraConnected, estimation?.jiraCloudId, cloudId, fields.length, estimationMode])

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

  async function handleSave() {
    if (!estimation || !saveValue) return
    const effectiveFieldId = estimationMode === 'time' ? ORIGINAL_ESTIMATE_FIELD_ID : selectedFieldId
    setSaving(true)
    setSaveError(false)
    try {
      await onSaveToJira(estimation, Number(saveValue), effectiveFieldId)
      setSaved(true)
      if (estimationMode === 'story_points') {
        setCurrentFieldValue(Number(saveValue))
      }
    } catch {
      setSaveError(true)
    } finally {
      setSaving(false)
    }
  }

  // In time mode skip numeric comparison — just show saved/not-saved state
  const isSameValue = estimationMode === 'story_points' && currentFieldValue != null && Number(saveValue) === currentFieldValue
  const selectedField = fields.find((f) => f.id === selectedFieldId)

  const issueUrl = isJira
    ? estimation?.jiraUrl?.startsWith('http')
      ? estimation.jiraUrl
      : jiraSiteUrl ? `${jiraSiteUrl}/browse/${estimation?.jiraKey}` : ''
    : ''

  return (
    <>
      {/* Ticket info row */}
      <TooltipProvider delayDuration={500}>
        <div className="flex items-start gap-1.5">
          {/* Ticket identity */}
          {estimation ? (
            <div className="flex min-w-0 flex-1 flex-col gap-0.5 overflow-hidden">
              {/* Row 1: icon + key */}
              <div className="flex items-center gap-1">
                {isJira
                  ? getIssueTypeIcon(estimation.jiraType)
                  : <TicketIcon className="size-4 shrink-0 text-muted-foreground/40" />
                }
                {isJira && estimation.jiraKey && (
                  isJiraConnected ? (
                    <button
                      onClick={() => onOpenTicketInfo?.(estimation)}
                      className="shrink-0 font-mono text-sm font-bold text-primary/80 transition-colors hover:text-primary"
                    >
                      {estimation.jiraKey}
                    </button>
                  ) : (
                    <span className="shrink-0 font-mono text-sm font-bold text-primary/80">
                      {estimation.jiraKey}
                    </span>
                  )
                )}
              </div>
              {/* Row 2: title */}
              <Tooltip>
                <TooltipTrigger asChild>
                  {isJira && isJiraConnected ? (
                    <button
                      onClick={() => onOpenTicketInfo?.(estimation)}
                      className="min-w-0 cursor-pointer text-left text-sm text-muted-foreground transition-colors line-clamp-2 hover:text-foreground"
                    >
                      {estimation.name}
                    </button>
                  ) : (
                    <span className="min-w-0 cursor-default text-sm text-muted-foreground line-clamp-2">{estimation.name}</span>
                  )}
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-[280px] whitespace-normal break-words">
                  {estimation.name}
                </TooltipContent>
              </Tooltip>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <TicketIcon className="size-4 shrink-0 text-muted-foreground/40" />
              {!isSpectator && (
                <button
                  onClick={onSet}
                  className="flex items-center gap-1.5 rounded-full border border-dashed border-primary/40 px-2.5 py-1 text-[11px] font-medium text-primary/60 transition-all duration-200 hover:border-primary hover:bg-primary/10 hover:text-primary"
                >
                  <svg className="size-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  Add ticket
                </button>
              )}
            </div>
          )}

          {/* Action icons */}
          <div className="flex shrink-0 items-center gap-1">
            {/* Remove — hidden for spectators */}
            {estimation && !isSpectator && (
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

      {/* Save to Jira row — only after reveal with numeric consensus, hidden for spectators */}
      {canSave && !isSpectator && (
        <div className="flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-2 rounded-lg border border-border/40 bg-muted/10 px-2.5 py-1.5">
            {/* Field label — read-only, configured in the queue panel */}
            <span className="max-w-[110px] truncate text-[10px] text-muted-foreground/50">
              {estimationMode === 'time'
                ? selectedFieldId === ORIGINAL_ESTIMATE_FIELD_ID ? 'Original Estimate' : (selectedField?.name ?? selectedFieldId)
                : (selectedField?.name ?? selectedFieldId)}
            </span>

            <span className="h-3 w-px bg-border/40" />

            {/* Current → new value display */}
            <div className="flex items-center gap-1">
              {estimationMode === 'story_points' && (
                fetchingCurrentValue ? (
                  <span className="inline-block h-3 w-5 animate-pulse rounded bg-muted/40" />
                ) : currentFieldValue != null ? (
                  <>
                    <span className="font-mono text-[10px] text-muted-foreground/50">{currentFieldValue}</span>
                    <span className="text-[9px] text-muted-foreground/30">→</span>
                  </>
                ) : null
              )}
              <span className="rounded bg-primary/10 px-1.5 py-0.5 font-mono text-[10px] font-bold text-primary">
                {estimationMode === 'time' ? `${saveValue}d` : saveValue}
              </span>
            </div>

            <span className="h-3 w-px bg-border/40" />

            {/* Save button — skeleton while current value is loading */}
            {fetchingCurrentValue ? (
              <span className="h-5 w-16 animate-pulse rounded bg-muted/40" />
            ) : (
              <Button
                size="sm"
                className="h-5 px-2 text-[10px]"
                onClick={handleSave}
                disabled={saving || isSameValue || saved}
              >
                {saving ? '...' : saved || isSameValue ? 'Saved' : 'Save to Jira'}
              </Button>
            )}
          </div>
          {saveError && <p className="text-[10px] text-red-400">Failed. Check Jira permissions.</p>}
        </div>
      )}

    </>
  )
}
