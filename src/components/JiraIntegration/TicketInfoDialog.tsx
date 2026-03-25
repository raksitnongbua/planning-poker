'use client'

import { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'

import { getIssueTypeIcon } from './jiraIssueTypeIcon'
import type { TicketEstimation } from './types'

interface Props {
  ticket: TicketEstimation | null
  open: boolean
  onOpenChange: (open: boolean) => void
  cloudId?: string
}

export function TicketInfoDialog({ ticket, open, onOpenChange, cloudId }: Props) {
  const [descState, setDescState] = useState<'idle' | 'loading' | 'loaded' | 'error'>('idle')
  const [fullDescription, setFullDescription] = useState<string | null>(null)
  // Track which key was last fetched so re-opening the same ticket is instant,
  // and switching tickets never hits the stale-closure guard bug.
  const fetchedKeyRef = useRef<string | null>(null)

  useEffect(() => {
    if (!open || !ticket?.jiraKey) return
    if (fetchedKeyRef.current === ticket.jiraKey) return  // already have it

    fetchedKeyRef.current = ticket.jiraKey
    setDescState('loading')
    setFullDescription(null)

    const jiraCloudId = cloudId ?? ticket.jiraCloudId ?? ''
    let cancelled = false
    fetch(`/api/jira/issues/${ticket.jiraKey}?cloudId=${jiraCloudId}`)
      .then((r) => r.ok ? r.json() : Promise.reject())
      .then((data) => {
        if (cancelled) return
        setFullDescription(data.description ?? null)
        setDescState('loaded')
      })
      .catch(() => {
        if (cancelled) return
        fetchedKeyRef.current = null  // allow retry next open
        setDescState('error')
        onOpenChange(false)
      })
    return () => { cancelled = true }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, ticket?.jiraKey])

  if (!ticket) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[580px] max-h-[85vh] flex-col gap-0 overflow-hidden border-border/40 bg-background p-0 sm:max-w-xl">
        {/* Accent gradient bar */}
        <div className="h-0.5 shrink-0 bg-gradient-to-r from-blue-500/60 via-primary/50 to-purple-500/40" />

        {/* Header section */}
        <div className="shrink-0 border-b border-border/30 px-5 pb-4 pt-4">
          {/* Key row */}
          <div className="flex items-center gap-2">
            {getIssueTypeIcon(ticket.jiraType)}
            <span className="font-mono text-sm font-bold text-blue-400">{ticket.jiraKey}</span>
            {ticket.jiraUrl && (
              <a
                href={ticket.jiraUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex size-5 items-center justify-center rounded text-muted-foreground/40 transition-colors hover:bg-blue-500/10 hover:text-blue-400"
                onClick={(e) => e.stopPropagation()}
                title="Open in Jira"
              >
                <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            )}
          </div>

          {/* Issue type pill */}
          {ticket.jiraType && (
            <div className="mt-1.5">
              <span className="rounded-sm bg-blue-500/20 px-1.5 py-0.5 text-[10px] font-medium text-blue-300">
                {ticket.jiraType}
              </span>
            </div>
          )}

          {/* Title */}
          <DialogTitle className="mt-2 text-sm font-semibold leading-snug text-foreground">
            {ticket.name}
          </DialogTitle>
        </div>

        {/* Description section */}
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-5 py-4">
          <p className="mb-3 text-[9px] font-semibold uppercase tracking-widest text-muted-foreground/40">
            Description
          </p>
          <div className="flex-1 overflow-y-auto">
            {descState === 'loading' && (
              <div className="flex flex-col gap-2 pt-1">
                {[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-3.5 w-full rounded" />)}
              </div>
            )}
            {descState === 'loaded' && (
              fullDescription ? (
                <div className="rounded-lg bg-muted/10 p-3">
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
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
                  <svg className="size-8 text-muted-foreground/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-sm text-muted-foreground/40">No description added yet.</p>
                </div>
              )
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
