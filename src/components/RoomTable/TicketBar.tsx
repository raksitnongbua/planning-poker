'use client'

import { useEffect, useRef, useState } from 'react'

import type { TicketEstimation } from '@/components/JiraIntegration'
import { JiraConnectButton } from '@/components/JiraIntegration'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

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
  onSet,
  onRemove,
  onSaveToJira,
  onJiraConnected,
  onJiraDisconnected,
}: Props) {
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

  const prevKey = useRef('')

  useEffect(() => {
    const key = `${estimation?.name ?? ''}-${consensusValue ?? ''}`
    if (key !== prevKey.current) {
      prevKey.current = key
      setSaved(false)
      setShowFieldPicker(false)
    }
  }, [estimation?.name, consensusValue])

  useEffect(() => {
    setFields([])
  }, [estimation?.jiraCloudId])

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

  function selectField(field: JiraField) {
    setSelectedFieldId(field.id)
    localStorage.setItem(FIELD_STORAGE_KEY, field.id)
    setShowFieldPicker(false)
    setSaved(false)
  }

  async function handleSave() {
    if (!estimation || !consensusValue) return
    setSaving(true)
    setSaveError(false)
    try {
      await onSaveToJira(estimation, Number(consensusValue), selectedFieldId)
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

  const isJira = estimation?.source === 'jira'
  const canSave = isJira && isJiraConnected && roomStatus === 'REVEALED_CARDS' && isNumericConsensus
  const selectedField = fields.find((f) => f.id === selectedFieldId)

  const issueUrl = isJira
    ? estimation?.jiraUrl?.startsWith('http')
      ? estimation.jiraUrl
      : jiraSiteUrl ? `${jiraSiteUrl}/browse/${estimation?.jiraKey}` : ''
    : ''

  return (
    // All content stacked vertically, centered — rendered in the table center area
    <>
      {/* Ticket info row */}
      <div className="flex items-center gap-1.5">
        {isJira
          ? <JiraIcon className="size-3 shrink-0 text-blue-400" />
          : <TicketIcon className="size-3 shrink-0 text-muted-foreground/40" />
        }
        {estimation ? (
          <div className="flex items-center gap-1 overflow-hidden">
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
            <span className="max-w-[200px] truncate text-[11px] text-muted-foreground">{estimation.name}</span>
          </div>
        ) : (
          <span className="text-[11px] text-muted-foreground/40">No ticket linked</span>
        )}

        {/* Change / remove */}
        <button className="text-[10px] text-muted-foreground/50 transition-colors hover:text-foreground" onClick={onSet}>
          {estimation ? 'Change' : 'Set'}
        </button>
        {estimation && (
          <button className="text-muted-foreground/30 transition-colors hover:text-muted-foreground" onClick={onRemove}>
            <svg className="size-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Save to Jira row — only after reveal with numeric consensus */}
      {canSave && (
        <div className="flex items-center gap-2">
          {/* Field selector */}
          <div className="relative">
            <button
              className="flex items-center gap-0.5 text-[10px] text-muted-foreground/50 hover:text-foreground"
              onClick={() => setShowFieldPicker((v) => !v)}
            >
              {selectedField?.name ?? selectedFieldId}
              <svg className="size-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showFieldPicker && (
              <div className="absolute bottom-full left-1/2 z-50 mb-1 w-48 -translate-x-1/2 rounded-lg border border-border/60 bg-popover shadow-lg">
                {fieldsLoading && <div className="flex flex-col gap-1 p-2">{[0,1,2].map(i => <Skeleton key={i} className="h-6 w-full" />)}</div>}
                {!fieldsLoading && fields.length === 0 && <p className="p-3 text-xs text-muted-foreground">No numeric fields found</p>}
                {!fieldsLoading && fields.map(f => (
                  <button key={f.id} onClick={() => selectField(f)}
                    className={`flex w-full px-3 py-1.5 text-left text-xs transition-colors hover:bg-muted/40 ${f.id === selectedFieldId ? 'text-primary' : 'text-foreground'}`}>
                    {f.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <span className="rounded bg-primary/10 px-1.5 py-0.5 font-mono text-[10px] font-bold text-primary">
            {consensusValue}
          </span>

          {saved ? (
            <span className="flex items-center gap-1 text-[10px] font-medium text-green-400">
              <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              Saved!
            </span>
          ) : (
            <Button size="sm" className="h-5 px-2 text-[10px]" onClick={handleSave} disabled={saving}>
              {saving ? '...' : 'Save to Jira'}
            </Button>
          )}
        </div>
      )}
      {saveError && <p className="text-[10px] text-red-400">Failed. Check Jira permissions.</p>}

      {/* Jira connect */}
      <JiraConnectButton
        isConnected={isJiraConnected}
        roomId={roomId}
        onConnected={onJiraConnected}
        onDisconnected={onJiraDisconnected}
      />
    </>
  )
}
