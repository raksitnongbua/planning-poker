'use client'

import * as DialogPrimitive from '@radix-ui/react-dialog'
import { Bookmark, Filter, Search } from 'lucide-react'
import { useTranslations } from 'next-intl'
import React, { useEffect, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

import { DEFAULT_FIELD_ID, FIELD_STORAGE_KEY, JQL_MODE_STORAGE_KEY, JQL_QUERY_STORAGE_KEY, JQL_SAVED_FILTERS_KEY, MAX_QUEUE_SIZE, MAX_SAVED_JQL_FILTERS, PROJECT_STORAGE_KEY } from './constants'
import { JiraConnectButton } from './JiraConnectButton'
import { getIssueTypeIcon } from './jiraIssueTypeIcon'
import { JiraIssue, JiraProject, JiraSprint, TicketEstimation } from './types'

interface SavedJqlFilter {
  id: string
  name: string
  jql: string
}

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  isJiraConnected: boolean
  cloudId: string
  roomId: string
  currentQueueSize?: number
  existingQueue?: TicketEstimation[]
  onSelect: (estimations: TicketEstimation[]) => void
  onJiraConnected: () => void
  onJiraDisconnected: () => void
}


function FilterSection({
  label, expanded, onToggle, hasSelection, onClear, children,
}: {
  label: string
  expanded: boolean
  onToggle: () => void
  hasSelection: boolean
  onClear: () => void
  children: React.ReactNode
}) {
  return (
    <div className="border-b border-border/30 last:border-0">
      <div className="flex w-full items-center gap-1.5 px-3 py-2 transition-colors hover:bg-muted/20">
        <button className="flex flex-1 items-center gap-1.5 text-left" onClick={onToggle}>
          <svg
            className={cn('size-3 shrink-0 text-muted-foreground/50 transition-transform duration-200', expanded ? 'rotate-90' : 'rotate-0')}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70">{label}</span>
        </button>
        {hasSelection && (
          <button
            onClick={onClear}
            className="rounded px-1 text-[9px] font-semibold text-primary/70 transition-colors hover:text-primary"
          >
            clear
          </button>
        )}
      </div>
      {expanded && children}
    </div>
  )
}

// Special sentinel value meaning "sprint is EMPTY" (no sprint assigned)
const UNSET_SPRINT_JQL = '__UNSET_SPRINT__'

function FilterRow({
  selected, onClick, icon, label, badge, variant = 'checkbox',
}: {
  selected: boolean
  onClick: () => void
  icon: React.ReactNode
  label: React.ReactNode
  badge?: React.ReactNode
  variant?: 'checkbox' | 'radio'
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-2 border-l-2 px-2.5 py-1.5 text-left text-xs transition-all duration-100',
        selected
          ? 'border-l-primary bg-primary/12 text-foreground'
          : 'border-l-transparent text-muted-foreground hover:bg-muted/30 hover:text-foreground'
      )}
    >
      {variant === 'radio' ? (
        <div className={cn(
          'flex size-3.5 shrink-0 items-center justify-center rounded-full border transition-colors',
          selected ? 'border-primary bg-primary' : 'border-border/50 bg-transparent'
        )}>
          {selected && <div className="size-1.5 rounded-full bg-white" />}
        </div>
      ) : (
        <div className={cn(
          'flex size-3.5 shrink-0 items-center justify-center rounded-sm border transition-colors',
          selected ? 'border-primary bg-primary' : 'border-border/50 bg-transparent'
        )}>
          {selected && (
            <svg viewBox="0 0 10 8" className="size-full p-0.5 text-white" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 4l2.5 2.5L9 1" />
            </svg>
          )}
        </div>
      )}
      {icon}
      <span className="min-w-0 flex-1 truncate">{label}</span>
      {badge}
    </button>
  )
}

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

export function TicketEstimationPicker({ open, onOpenChange, isJiraConnected, cloudId, roomId, currentQueueSize = 0, existingQueue = [], onSelect, onJiraConnected, onJiraDisconnected }: Props) {
  const t = useTranslations('room.jira')
  const [activeTab, setActiveTab] = useState<Tab>('text')
  const [freeText, setFreeText] = useState('')
  const [freeTextAdded, setFreeTextAdded] = useState(false)

  // Jira search state
  const [searchMode, setSearchMode] = useState<'text' | 'jql'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem(JQL_MODE_STORAGE_KEY) as 'text' | 'jql') ?? 'text'
    }
    return 'text'
  })
  const [query, setQuery] = useState('')
  const [jqlQuery, setJqlQuery] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(JQL_QUERY_STORAGE_KEY) ?? ''
    }
    return ''
  })
  const [issues, setIssues] = useState<JiraIssue[]>([])
  const [startAt, setStartAt] = useState(0)
  const [loading, setLoading] = useState(false)
  const [paginating, setPaginating] = useState(false)
  const [isError, setIsError] = useState(false)
  const [hasMore, setHasMore] = useState(false)
  // Cursor-based pagination — Jira search/jql uses nextPageToken, not startAt
  const [currentPage, setCurrentPage] = useState(0) // 0-indexed
  // pageTokens[i] = token needed to fetch page i (null = page 0, no token)
  const [pageTokens, setPageTokens] = useState<(string | null)[]>([null])
  const [pageSize, setPageSize] = useState<25 | 50 | 100>(25)

  // Project + sprint + type filter state
  const [projects, setProjects] = useState<JiraProject[]>([])
  const [projectsLoading, setProjectsLoading] = useState(false)
  const [selectedProjectKey, setSelectedProjectKey] = useState<string | null>(() =>
    typeof window !== 'undefined' ? localStorage.getItem(PROJECT_STORAGE_KEY) : null
  )
  const [projectSearch, setProjectSearch] = useState('')
  const [sprintSearch, setSprintSearch] = useState('')
  const [isFilterOpen, setIsFilterOpen] = useState(true)
  const [sprints, setSprints] = useState<JiraSprint[]>([])
  const [sprintsLoading, setSprintsLoading] = useState(false)
  const [selectedSprintJql, setSelectedSprintJql] = useState<string | null>(null)
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(new Set())
  // Collapsible filter sections
  const [projectExpanded, setProjectExpanded] = useState(true)
  const [sprintExpanded, setSprintExpanded] = useState(true)
  const [typeExpanded, setTypeExpanded] = useState(false)

  // Multi-select state
  const [selectedIssueIds, setSelectedIssueIds] = useState<Set<string>>(new Set())
  // Preserves the full JiraIssue object for every selected id across page navigations,
  // so handleConfirm doesn't silently drop issues that are no longer on the current page.
  const [allSelectedIssues, setAllSelectedIssues] = useState<Map<string, JiraIssue>>(new Map())

  // JQL saved filters
  const [savedFilters, setSavedFilters] = useState<SavedJqlFilter[]>(() => {
    if (typeof window === 'undefined') return []
    try { return JSON.parse(localStorage.getItem(JQL_SAVED_FILTERS_KEY) ?? '[]') } catch { return [] }
  })
  const [isSavingFilter, setIsSavingFilter] = useState(false)
  const [saveFilterName, setSaveFilterName] = useState('')
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false)

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Reset on close; default to Jira tab when connected
  useEffect(() => {
    if (!open) {
      setFreeText('')
      setFreeTextAdded(false)
      setQuery('')
      setIssues([])
      setHasMore(false)
      setStartAt(0)
      setCurrentPage(0)
      setPageTokens([null])
      setIsError(false)
      setIsSavingFilter(false)
      setSaveFilterName('')
      setIsFilterDropdownOpen(false)
      // jqlQuery and searchMode intentionally kept — restored from localStorage on next open
      // selectedProjectKey intentionally kept — restored from localStorage on next open
      setSelectedIssueIds(new Set())
      setAllSelectedIssues(new Map())
      setProjects([])
      setProjectSearch('')
      setSprintSearch('')
      setIsFilterOpen(true)
      setSprints([])
      setSelectedSprintJql(null)
      setSelectedTypes(new Set())
    } else {
      setActiveTab(isJiraConnected ? 'jira' : 'text')
    }
  }, [open, isJiraConnected])

  // Persist JQL query and mode to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(JQL_QUERY_STORAGE_KEY, jqlQuery)
  }, [jqlQuery])

  useEffect(() => {
    localStorage.setItem(JQL_MODE_STORAGE_KEY, searchMode)
  }, [searchMode])

  useEffect(() => {
    localStorage.setItem(JQL_SAVED_FILTERS_KEY, JSON.stringify(savedFilters))
  }, [savedFilters])

  // Load projects when filter panel is opened
  useEffect(() => {
    if (!open || !isJiraConnected || activeTab !== 'jira' || projects.length > 0) return
    if (!isFilterOpen) return
    setProjectsLoading(true)
    fetch(`/api/jira/projects?cloudId=${cloudId}`)
      .then((r) => r.json())
      .then((data) => setProjects(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setProjectsLoading(false))
  }, [open, isJiraConnected, activeTab, cloudId, projects.length, isFilterOpen])

  // Load sprints when a project is selected — scoped to that project's boards
  useEffect(() => {
    if (!open || !isJiraConnected || activeTab !== 'jira') return
    if (!selectedProjectKey) {
      setSprints([])
      setSelectedSprintJql(null)
      return
    }
    setSprintsLoading(true)
    setSprints([])
    setSelectedSprintJql(null)
    fetch(`/api/jira/sprints?cloudId=${cloudId}&projectKey=${encodeURIComponent(selectedProjectKey)}`)
      .then((r) => r.json())
      .then((data: JiraSprint[]) => {
        if (!Array.isArray(data)) return
        setSprints(data)
        // Auto-select: favourite board future → favourite board active → any future → any active
        const defaultSprint =
          data.find((s) => s.isFavouriteBoard && s.state === 'future') ??
          data.find((s) => s.isFavouriteBoard && s.state === 'active') ??
          data.find((s) => s.state === 'future') ??
          data.find((s) => s.state === 'active')
        if (defaultSprint) setSelectedSprintJql(defaultSprint.jqlValue)
      })
      .catch(() => {})
      .finally(() => setSprintsLoading(false))
  }, [open, isJiraConnected, activeTab, cloudId, selectedProjectKey])

  function buildJqlFromCurrentFilters(): string {
    const clauses: string[] = []
    if (selectedProjectKey) clauses.push(`project = "${selectedProjectKey}"`)
    if (selectedSprintJql === UNSET_SPRINT_JQL) clauses.push('sprint is EMPTY')
    else if (selectedSprintJql) clauses.push(`sprint = ${selectedSprintJql}`)
    if (selectedTypes.size > 0) clauses.push(`issuetype in (${Array.from(selectedTypes).map((t) => `"${t}"`).join(',')})`)
    if (query.trim()) clauses.push(`text ~ "${query.trim()}"`)
    if (clauses.length === 0) return ''
    return clauses.join(' AND ') + ' ORDER BY updated DESC'
  }

  function buildIssueUrl(pageToken: string | null = null, ps = pageSize) {
    const tokenSuffix = pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : ''
    if (searchMode === 'jql') {
      return `/api/jira/issues?jql=${encodeURIComponent(jqlQuery)}&cloudId=${cloudId}&pageSize=${ps}${tokenSuffix}`
    }
    if (selectedSprintJql !== null || selectedTypes.size > 0 || selectedProjectKey !== null) {
      const jql = buildJqlFromCurrentFilters()
      return `/api/jira/issues?jql=${encodeURIComponent(jql)}&cloudId=${cloudId}&pageSize=${ps}${tokenSuffix}`
    }
    return `/api/jira/issues?q=${encodeURIComponent(query)}&cloudId=${cloudId}`
  }

  // Debounced issue search — resets pagination on every filter/query change.
  // Also re-runs when the dialog opens (open/activeTab in deps) so existing filters
  // auto-trigger a fetch + skeleton immediately — no free fetch when nothing is set.
  useEffect(() => {
    if (!open || activeTab !== 'jira') return
    // Wait for sprints to finish loading before searching — prevents a double fetch
    // (one without sprint filter, one with) when the dialog opens with a saved project.
    if (selectedProjectKey && sprintsLoading) return
    if (debounceRef.current) clearTimeout(debounceRef.current)

    const activeQuery = searchMode === 'jql' ? jqlQuery : query
    const hasActiveFilter = selectedSprintJql !== null || selectedProjectKey !== null || selectedTypes.size > 0
    if (!activeQuery.trim() && !hasActiveFilter) {
      setIssues([])
      setHasMore(false)
      setStartAt(0)
      setCurrentPage(0)
      setPageTokens([null])
      setLoading(false)
      setIsError(false)
      return
    }

    setLoading(true)
    setIsError(false)
    setStartAt(0)
    setCurrentPage(0)
    setPageTokens([null])

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(buildIssueUrl(null))
        if (res.ok) {
          const data = await res.json()
          const raw: JiraIssue[] = data.issues ?? (Array.isArray(data) ? data : [])
          const seen = new Set<string>()
          const unique = raw.filter((i) => (seen.has(i.id) ? false : seen.add(i.id)))
          setIssues(unique.map((i) => ({ ...i, storyPointsField: localStorage.getItem('jira_story_points_field') ?? 'customfield_10016' })))
          setHasMore(data.hasMore ?? false)
          setPageTokens([null, data.nextPageToken ?? null])
        } else {
          setIsError(true)
          setIssues([])
          setHasMore(false)
        }
      } catch {
        setIsError(true)
        setIssues([])
        setHasMore(false)
      } finally {
        setLoading(false)
      }
    }, searchMode === 'jql' ? 600 : 300)

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, activeTab, sprintsLoading, query, jqlQuery, searchMode, selectedProjectKey, selectedSprintJql, selectedTypes, pageSize, cloudId])

  async function goToNext() {
    const token = pageTokens[currentPage + 1] ?? null
    setPaginating(true)
    try {
      const res = await fetch(buildIssueUrl(token))
      if (res.ok) {
        const data = await res.json()
        const raw: JiraIssue[] = data.issues ?? []
        const seen = new Set<string>()
        const unique = raw.filter((i) => (seen.has(i.id) ? false : seen.add(i.id)))
        setIssues(unique.map((i) => ({ ...i, storyPointsField: localStorage.getItem('jira_story_points_field') ?? 'customfield_10016' })))
        setHasMore(data.hasMore ?? false)
        const newPage = currentPage + 1
        setCurrentPage(newPage)
        setStartAt(newPage * pageSize)
        // Store nextPageToken for the page after this one
        setPageTokens(prev => {
          const copy = [...prev]
          copy[newPage + 1] = data.nextPageToken ?? null
          return copy
        })
        scrollContainerRef.current?.scrollTo({ top: 0 })
      }
    } catch { /* ignore */ } finally {
      setPaginating(false)
    }
  }

  async function goToPrev() {
    if (currentPage === 0) return
    const newPage = currentPage - 1
    const token = pageTokens[newPage] ?? null
    setPaginating(true)
    try {
      const res = await fetch(buildIssueUrl(token))
      if (res.ok) {
        const data = await res.json()
        const raw: JiraIssue[] = data.issues ?? []
        const seen = new Set<string>()
        const unique = raw.filter((i) => (seen.has(i.id) ? false : seen.add(i.id)))
        setIssues(unique.map((i) => ({ ...i, storyPointsField: localStorage.getItem('jira_story_points_field') ?? 'customfield_10016' })))
        setHasMore(data.hasMore ?? false)
        setCurrentPage(newPage)
        setStartAt(newPage * pageSize)
        scrollContainerRef.current?.scrollTo({ top: 0 })
      }
    } catch { /* ignore */ } finally {
      setPaginating(false)
    }
  }

  const isCurrentJqlSaved = savedFilters.some((f) => f.jql === jqlQuery.trim())
  const canSaveMoreFilters = savedFilters.length < MAX_SAVED_JQL_FILTERS

  function handleOpenSaveFilter() {
    setSaveFilterName(jqlQuery.slice(0, 40))
    setIsSavingFilter(true)
  }

  function handleSaveFilter() {
    const trimmedName = saveFilterName.trim()
    if (!trimmedName || !jqlQuery.trim()) return
    const newFilter: SavedJqlFilter = { id: Date.now().toString(), name: trimmedName, jql: jqlQuery.trim() }
    setSavedFilters((prev) => [newFilter, ...prev.slice(0, MAX_SAVED_JQL_FILTERS - 1)])
    setIsSavingFilter(false)
    setSaveFilterName('')
  }

  function handleDeleteSavedFilter(id: string) {
    setSavedFilters((prev) => prev.filter((f) => f.id !== id))
  }

  function handleApplySavedFilter(filter: SavedJqlFilter) {
    setJqlQuery(filter.jql)
  }

  function handleFreeTextSubmit() {
    const name = freeText.trim()
    if (!name) return
    onSelect([{ name, source: '' }])
    setFreeText('')
    setFreeTextAdded(true)
    setTimeout(() => setFreeTextAdded(false), 2000)
  }

  function handleConfirm() {
    const selectedIssues = Array.from(selectedIssueIds)
      .map((id) => allSelectedIssues.get(id))
      .filter((i): i is JiraIssue => i !== undefined)
    const storyField = typeof window !== 'undefined'
      ? localStorage.getItem(FIELD_STORAGE_KEY) ?? DEFAULT_FIELD_ID
      : DEFAULT_FIELD_ID
    const estimations: TicketEstimation[] = selectedIssues.map((issue) => ({
      name: issue.summary,
      source: 'jira',
      jiraKey: issue.key,
      jiraIssueId: issue.id,
      jiraCloudId: issue.cloudId,
      jiraUrl: issue.url,
      jiraType: issue.type,
      storyPointsField: storyField,
    }))
    onSelect(estimations)
  }

  function selectProject(key: string | null) {
    setSelectedProjectKey(key)
    setSprints([])
    setSelectedSprintJql(null)
    setSprintSearch('')
    if (key) {
      localStorage.setItem(PROJECT_STORAGE_KEY, key)
      setSprintExpanded(true)
    } else {
      localStorage.removeItem(PROJECT_STORAGE_KEY)
    }
  }

  function toggleIssue(id: string) {
    const issue = issues.find((i) => i.id === id)
    setSelectedIssueIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
    setAllSelectedIssues((prev) => {
      const next = new Map(prev)
      if (next.has(id)) next.delete(id)
      else if (issue) next.set(id, issue)
      return next
    })
  }

  const queuedJiraKeys = new Set(existingQueue.map((t) => t.jiraKey).filter((k): k is string => Boolean(k)))

  const toggleableIssues = issues.filter((i) => !queuedJiraKeys.has(i.key))

  const toggleSelectAll = () => {
    const allSelected = toggleableIssues.every((i) => selectedIssueIds.has(i.id))
    if (allSelected) {
      setSelectedIssueIds((prev) => {
        const next = new Set(prev)
        toggleableIssues.forEach((i) => next.delete(i.id))
        return next
      })
      setAllSelectedIssues((prev) => {
        const next = new Map(prev)
        toggleableIssues.forEach((i) => next.delete(i.id))
        return next
      })
    } else {
      setSelectedIssueIds((prev) => {
        const next = new Set(prev)
        toggleableIssues.forEach((i) => next.add(i.id))
        return next
      })
      setAllSelectedIssues((prev) => {
        const next = new Map(prev)
        toggleableIssues.forEach((i) => next.set(i.id, i))
        return next
      })
    }
  }

  const allOnPageSelected = toggleableIssues.length > 0 && toggleableIssues.every((i) => selectedIssueIds.has(i.id))

  const allPageQueued = toggleableIssues.length === 0 && issues.length > 0
  const partiallyQueued = toggleableIssues.length > 0 && toggleableIssues.length < issues.length
  const alreadyQueuedIssues = issues.filter((i) => queuedJiraKeys.has(i.key))
  // Selectable issues first, already-queued pushed to the bottom with a divider between groups
  const displayOrder = [...toggleableIssues, ...alreadyQueuedIssues]
  const selectAllLabel = partiallyQueued
    ? `Select remaining ${toggleableIssues.length}`
    : !hasMore
      ? `Select all ${issues.length} issues`
      : `Select these ${issues.length} issues`

  const filteredProjects = (projectSearch.trim()
    ? projects.filter((p) => p.name.toLowerCase().includes(projectSearch.toLowerCase()) || p.key.toLowerCase().includes(projectSearch.toLowerCase()))
    : [...projects]
  ).sort((a, b) => {
    if (a.key === selectedProjectKey) return -1
    if (b.key === selectedProjectKey) return 1
    return 0
  })

  const filteredSprints = sprintSearch.trim()
    ? sprints.filter((s) =>
        s.name.toLowerCase().includes(sprintSearch.toLowerCase()) ||
        (s.boardName ?? '').toLowerCase().includes(sprintSearch.toLowerCase())
      )
    : sprints

  const activeQuery = searchMode === 'jql' ? jqlQuery : query
  const hasQuery = activeQuery.trim().length > 0 || selectedSprintJql !== null || selectedTypes.size > 0 || selectedProjectKey !== null

  // Filter label text
  const selectedSprint = selectedSprintJql === UNSET_SPRINT_JQL
    ? { name: 'Unset sprint', state: undefined, jqlValue: UNSET_SPRINT_JQL, boardName: undefined, isFavouriteBoard: undefined }
    : sprints.find((s) => s.jqlValue === selectedSprintJql)
  const filterLabelText = searchMode === 'jql'
    ? 'JQL mode active — results driven by your query'
    : [
        selectedSprint ? `Sprint: ${selectedSprint.name}` : null,
        selectedProjectKey ? `Project: ${selectedProjectKey}` : null,
        selectedTypes.size > 0 ? `Type: ${Array.from(selectedTypes).join(', ')}` : null,
      ].filter(Boolean).join(' · ') || 'No filters active'

  const wouldExceedLimit = currentQueueSize + selectedIssueIds.size > MAX_QUEUE_SIZE
  const remainingSlots = MAX_QUEUE_SIZE - currentQueueSize

  // Confirm button label
  const confirmLabel = selectedIssueIds.size === 0
    ? t('addTicket')
    : selectedIssueIds.size === 1
      ? `Add ${issues.find((i) => selectedIssueIds.has(i.id))?.key ?? 'ticket'}`
      : `Add ${selectedIssueIds.size} tickets`

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby={undefined} className="flex h-[76vh] max-h-[720px] min-h-[520px] flex-col gap-0 border-border/60 bg-[hsl(20,8%,9%)] p-0 shadow-2xl shadow-black/70 sm:max-w-3xl [&>button:first-of-type]:hidden">

        {/* Top accent line */}
        <div className="absolute inset-x-0 top-0 h-[2px] rounded-t-lg bg-gradient-to-r from-primary/20 via-primary/50 to-primary/20" />

        {/* ── Header zone ── */}
        <div className="flex items-center gap-3 border-b border-border/50 bg-[hsl(20,6%,7%)] px-5 py-3.5">
          <DialogTitle className="flex-1 text-base font-bold text-foreground tracking-tight">
            {t('setTicketTitle')}
          </DialogTitle>

          <div role="tablist" aria-label="Add ticket source" className="flex rounded-lg border border-border/40 bg-muted/20 p-0.5">
            <button
              role="tab"
              aria-selected={activeTab === 'jira'}
              className={cn(
                'relative flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-150',
                activeTab === 'jira'
                  ? 'bg-muted/40 text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
                !isJiraConnected && activeTab !== 'jira' && 'opacity-60'
              )}
              onClick={() => setActiveTab('jira')}
            >
              <JiraIcon className="size-3 text-blue-400" />
              {t('tabJira')}
            </button>
            <button
              role="tab"
              aria-selected={activeTab === 'text'}
              className={cn(
                'relative flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-150',
                activeTab === 'text'
                  ? 'bg-muted/40 text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
              onClick={() => setActiveTab('text')}
            >
              <GenericTicketIcon className="size-3" />
              {t('tabFreeText')}
            </button>
          </div>

          {/* Close button */}
          <DialogPrimitive.Close className="flex size-7 items-center justify-center rounded-lg border border-border/40 bg-muted/20 text-muted-foreground transition-colors hover:border-border/60 hover:bg-muted/40 hover:text-foreground">
            <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        </div>

        {/* ── Jira connect prompt (Jira tab selected but not connected) ── */}
        {activeTab === 'jira' && !isJiraConnected && (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-8 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-blue-500/10">
              <JiraIcon className="size-6 text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Connect Jira to search issues</p>
              <p className="mt-1 text-xs text-muted-foreground">Search your backlog, filter by project and sprint, and add multiple issues at once.</p>
            </div>
            <JiraConnectButton
              isConnected={false}
              roomId={roomId}
              onConnected={onJiraConnected}
              onDisconnected={onJiraDisconnected}
            />
          </div>
        )}

        {/* ── Free text panel ── */}
        {activeTab === 'text' && (
          <div className="flex flex-1 flex-col gap-3 px-5 py-4">
            <Input
              autoFocus
              placeholder={t('freeTextPlaceholder')}
              value={freeText}
              onChange={(e) => setFreeText(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleFreeTextSubmit() }}
              className="border-border/40 bg-[hsl(20,6%,12%)] focus-visible:border-primary/40 focus-visible:ring-primary/30"
            />
            {freeTextAdded && (
              <div className="animate-in fade-in flex items-center gap-1.5 rounded-lg border border-green-500/30 bg-green-500/10 px-3 py-2 duration-200">
                <svg className="size-3 shrink-0 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-xs text-green-400">Added to queue — keep adding or close when done</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onOpenChange(false)}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                {t('cancel')}
              </Button>
              <Button
                size="sm"
                disabled={!freeText.trim()}
                onClick={handleFreeTextSubmit}
                className="transition-transform duration-150 hover:scale-[1.02]"
              >
                {t('setTicketButton')}
              </Button>
            </div>
          </div>
        )}

        {/* ── Jira search panel ── */}
        {activeTab === 'jira' && isJiraConnected && (
          <>
            {/* Search row */}
            <div className="flex items-center gap-2 border-b border-border/50 px-4 py-3">
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground/50" />
                {searchMode === 'text' ? (
                  <Input
                    autoFocus
                    placeholder={t('searchPlaceholder')}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && debounceRef.current) {
                        clearTimeout(debounceRef.current)
                        debounceRef.current = null
                      }
                    }}
                    className="h-8 border-border/40 bg-[hsl(20,6%,12%)] pl-8 text-sm focus-visible:border-primary/40 focus-visible:ring-primary/30"
                    aria-label="Keyword search input"
                  />
                ) : (
                  <Input
                    autoFocus
                    placeholder={t('jqlPlaceholder')}
                    value={jqlQuery}
                    onChange={(e) => setJqlQuery(e.target.value)}
                    className="h-8 border-border/40 bg-[hsl(20,6%,12%)] pl-8 font-mono text-xs focus-visible:border-primary/40 focus-visible:ring-primary/30"
                    aria-label="JQL query input"
                  />
                )}
              </div>

              {/* Filter by project toggle — hidden in JQL mode */}
              {searchMode !== 'jql' && (
                <button
                  aria-label={t('filterByProject')}
                  aria-pressed={isFilterOpen}
                  onClick={() => setIsFilterOpen((v) => !v)}
                  className={cn(
                    'flex size-8 items-center justify-center rounded-md border transition-all duration-150',
                    isFilterOpen
                      ? 'border-primary/50 bg-primary/15 text-primary'
                      : 'border-border/40 bg-muted/20 text-muted-foreground hover:border-border/60 hover:text-foreground'
                  )}
                >
                  <Filter className="size-3.5" />
                </button>
              )}

              {/* Saved filters dropdown — visible in JQL mode or whenever there are saved filters */}
              {(searchMode === 'jql' || savedFilters.length > 0) && (
                <div className="relative">
                  <button
                    aria-label="Saved filters"
                    aria-expanded={isFilterDropdownOpen}
                    onClick={() => setIsFilterDropdownOpen((v) => !v)}
                    className={cn(
                      'flex size-8 items-center justify-center rounded-md border transition-all duration-150',
                      isFilterDropdownOpen
                        ? 'border-amber-500/50 bg-amber-500/15 text-amber-400'
                        : savedFilters.length > 0
                          ? 'border-amber-500/40 bg-amber-500/10 text-amber-400 hover:border-amber-500/60 hover:bg-amber-500/15'
                          : 'border-border/40 bg-muted/20 text-muted-foreground hover:border-border/60 hover:bg-muted/40 hover:text-foreground'
                    )}
                  >
                    <Bookmark className={cn('size-3.5', savedFilters.length > 0 && 'fill-current')} />
                  </button>

                  {isFilterDropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setIsFilterDropdownOpen(false)} />
                      <div className="absolute right-0 top-full z-50 mt-1 w-64 rounded-lg border border-border/60 bg-[hsl(20,8%,9%)] shadow-xl shadow-black/50">
                        <div className="flex items-center justify-between border-b border-border/40 px-3 py-2">
                          <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70">Saved filters</span>
                          {searchMode === 'jql' && jqlQuery.trim() && !isCurrentJqlSaved && canSaveMoreFilters && (
                            <button
                              onClick={() => { setIsFilterDropdownOpen(false); handleOpenSaveFilter() }}
                              className="flex items-center gap-1 text-[10px] font-semibold text-amber-400 transition-colors hover:text-amber-300"
                            >
                              <Bookmark className="size-2.5" />
                              Save current
                            </button>
                          )}
                        </div>

                        {savedFilters.length === 0 ? (
                          <p className="py-6 text-center text-xs text-muted-foreground/50">No saved filters yet</p>
                        ) : (
                          <div className="max-h-48 overflow-y-auto py-1">
                            {savedFilters.map((filter) => {
                              const isActive = filter.jql === jqlQuery.trim() && searchMode === 'jql'
                              return (
                                <div
                                  key={filter.id}
                                  className={cn(
                                    'flex items-center gap-2 px-3 py-2 transition-colors',
                                    isActive ? 'bg-primary/10' : 'hover:bg-muted/30'
                                  )}
                                >
                                  <button
                                    onClick={() => {
                                      handleApplySavedFilter(filter)
                                      if (searchMode !== 'jql') {
                                        setSearchMode('jql')
                                        setQuery('')
                                        setIsFilterOpen(false)
                                      }
                                      setIsFilterDropdownOpen(false)
                                    }}
                                    aria-label={`Apply saved filter: ${filter.name}`}
                                    className="flex min-w-0 flex-1 items-center gap-2 text-left"
                                  >
                                    <Bookmark className={cn('size-3 shrink-0', isActive ? 'fill-current text-primary' : 'text-amber-400/70')} />
                                    <span className={cn('min-w-0 flex-1 truncate text-xs', isActive ? 'font-semibold text-primary' : 'text-foreground/80')}>{filter.name}</span>
                                  </button>
                                  <button
                                    onClick={() => handleDeleteSavedFilter(filter.id)}
                                    aria-label={`Remove saved filter: ${filter.name}`}
                                    className="flex size-4 shrink-0 items-center justify-center rounded text-muted-foreground/30 transition-colors hover:bg-muted/40 hover:text-foreground"
                                  >
                                    <svg viewBox="0 0 10 10" className="size-2.5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                                      <path d="M2 2l6 6M8 2l-6 6" />
                                    </svg>
                                  </button>
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* JQL mode toggle */}
              <button
                aria-label="Use JQL"
                aria-pressed={searchMode === 'jql'}
                onClick={() => {
                  if (searchMode === 'jql') {
                    setSearchMode('text')
                    setIssues([])
                    setIsSavingFilter(false)
                    setIsFilterDropdownOpen(false)
                    setIsFilterOpen(true)
                  } else {
                    const converted = buildJqlFromCurrentFilters()
                    if (converted) setJqlQuery(converted)
                    setSearchMode('jql')
                    setQuery('')
                    setIssues([])
                    setIsFilterOpen(false)
                  }
                }}
                className={cn(
                  'flex h-8 items-center gap-1.5 rounded-md border px-2.5 text-xs font-medium transition-all duration-150',
                  searchMode === 'jql'
                    ? 'border-primary/50 bg-primary/15 text-primary'
                    : 'border-border/40 bg-muted/20 text-muted-foreground hover:border-border/60 hover:text-foreground'
                )}
              >
                <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                JQL
              </button>
            </div>

            {/* Inline save filter form */}
            {isSavingFilter && searchMode === 'jql' && (
              <div className="flex items-center gap-2 border-b border-border/40 bg-[hsl(20,6%,7%)] px-4 py-2">
                <Bookmark className="size-3.5 shrink-0 text-amber-400" />
                <Input
                  autoFocus
                  placeholder="Filter name…"
                  value={saveFilterName}
                  onChange={(e) => setSaveFilterName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveFilter()
                    if (e.key === 'Escape') setIsSavingFilter(false)
                  }}
                  maxLength={40}
                  className="h-7 flex-1 border-border/40 bg-[hsl(20,6%,12%)] text-xs focus-visible:ring-amber-500/30"
                />
                <button
                  onClick={handleSaveFilter}
                  disabled={!saveFilterName.trim()}
                  className="rounded-md border border-amber-500/40 bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-400 transition-colors hover:bg-amber-500/15 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsSavingFilter(false)}
                  className="rounded-md border border-border/40 bg-muted/20 px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  Cancel
                </button>
              </div>
            )}

            {/* Active filter chips row — text mode only, shown when any filter is active */}
            {searchMode !== 'jql' && (selectedSprint || selectedProjectKey || selectedTypes.size > 0) && (
              <div className="flex flex-wrap items-center gap-2 border-b border-border/40 px-4 py-2">
                {selectedSprint && (
                  <span className="flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/15 px-2.5 py-0.5 text-[10px] font-semibold text-blue-300">
                    <span className="size-1.5 rounded-full bg-blue-400" />
                    {selectedSprint.name}
                    <button
                      onClick={() => setSelectedSprintJql(null)}
                      className="ml-0.5 flex size-3 items-center justify-center rounded-full text-blue-300/60 transition-colors hover:bg-blue-400/20 hover:text-blue-200"
                      aria-label="Remove sprint filter"
                    >
                      <svg viewBox="0 0 10 10" className="size-2" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                        <path d="M2 2l6 6M8 2l-6 6" />
                      </svg>
                    </button>
                  </span>
                )}
                {selectedProjectKey && (
                  <span className="flex items-center gap-1.5 rounded-full border border-violet-500/30 bg-violet-500/15 px-2.5 py-0.5 text-[10px] font-semibold text-violet-300">
                    <JiraIcon className="size-2.5 text-violet-400" />
                    {selectedProjectKey}
                    <button
                      onClick={() => selectProject(null)}
                      className="ml-0.5 flex size-3 items-center justify-center rounded-full text-violet-300/60 transition-colors hover:bg-violet-400/20 hover:text-violet-200"
                      aria-label="Remove project filter"
                    >
                      <svg viewBox="0 0 10 10" className="size-2" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                        <path d="M2 2l6 6M8 2l-6 6" />
                      </svg>
                    </button>
                  </span>
                )}
                {selectedTypes.size > 0 && (
                  <span className="flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/15 px-2.5 py-0.5 text-[10px] font-semibold text-amber-300">
                    <span className="size-1.5 rounded-full bg-amber-400" />
                    {selectedTypes.size} type{selectedTypes.size > 1 ? 's' : ''}
                    <button
                      onClick={() => setSelectedTypes(new Set())}
                      className="ml-0.5 flex size-3 items-center justify-center rounded-full text-amber-300/60 transition-colors hover:bg-amber-400/20 hover:text-amber-200"
                      aria-label="Remove type filter"
                    >
                      <svg viewBox="0 0 10 10" className="size-2" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                        <path d="M2 2l6 6M8 2l-6 6" />
                      </svg>
                    </button>
                  </span>
                )}
              </div>
            )}

            {/* Body: filter panel + issue list */}
            <div className="flex min-h-0 flex-1 flex-col sm:flex-row">

              {/* Filter panel — not rendered in JQL mode */}
              {searchMode !== 'jql' && <div
                className={cn(
                  'relative flex shrink-0 flex-col overflow-hidden border-b border-border/40 transition-[width] duration-300 sm:border-b-0 sm:border-r sm:border-border/40',
                  isFilterOpen ? 'sm:w-[200px] w-full' : 'sm:w-7 w-0'
                )}
                role="region"
                aria-label="Filters"
              >
                {/* Collapse handle — right edge */}
                <button
                    onClick={() => setIsFilterOpen((v) => !v)}
                    aria-label={isFilterOpen ? 'Collapse filters' : 'Expand filters'}
                    className="absolute right-0 top-1/2 z-10 -translate-y-1/2 hidden h-12 w-6 items-center justify-center rounded-l border border-r-0 border-border/30 bg-[hsl(20,6%,7%)] text-muted-foreground/40 transition-colors hover:bg-muted/40 hover:text-foreground sm:flex"
                  >
                    <svg
                      className={cn('size-3 transition-transform duration-200', isFilterOpen ? 'rotate-0' : 'rotate-180')}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                {/* Panel content — hidden when collapsed */}
                {isFilterOpen && (
                  <div className="flex flex-1 flex-col overflow-y-auto bg-[hsl(20,6%,7%)] pr-6">

                    {/* ── Project (top, always open) ── */}
                    <div className="border-b border-border/30 px-2 pb-1 pt-2">
                      <div className="mb-1.5 flex items-center justify-between px-1">
                        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70">Project</span>
                        {selectedProjectKey && (
                          <button onClick={() => selectProject(null)} className="text-[9px] font-semibold text-primary/70 transition-colors hover:text-primary">clear</button>
                        )}
                      </div>
                      <Input
                        placeholder="Search projects"
                        value={projectSearch}
                        onChange={(e) => setProjectSearch(e.target.value)}
                        className="mb-1 h-7 border-border/40 bg-[hsl(20,6%,12%)] text-xs focus-visible:ring-primary/30"
                      />
                      <div className="max-h-32 overflow-y-auto">
                        {projectsLoading
                          ? [0, 1, 2].map((i) => <Skeleton key={i} className="my-0.5 h-6 rounded" />)
                          : filteredProjects.length === 0
                            ? <p className="py-2 text-center text-xs text-muted-foreground/50">{t('noProjectsFound')}</p>
                            : filteredProjects.map((project) => (
                              <FilterRow
                                key={project.id}
                                selected={selectedProjectKey === project.key}
                                onClick={() => selectProject(selectedProjectKey === project.key ? null : project.key)}
                                icon={
                                  project.avatarUrl
                                    ? <img src={project.avatarUrl} width={14} height={14} className="size-3.5 rounded-sm" alt="" />
                                    : <span className="flex size-3.5 shrink-0 items-center justify-center rounded-sm bg-primary/15"><JiraIcon className="size-2 text-primary" /></span>
                                }
                                label={project.name}
                              />
                            ))
                        }
                      </div>
                    </div>

                    {/* ── Sprint section ── */}
                    <FilterSection
                      label="Sprint"
                      expanded={sprintExpanded}
                      onToggle={() => setSprintExpanded((v) => !v)}
                      hasSelection={selectedSprintJql !== null}
                      onClear={() => setSelectedSprintJql(null)}
                    >
                      {!selectedProjectKey ? (
                        <p className="px-3 py-3 text-center text-xs text-muted-foreground/40">Select a project first</p>
                      ) : (
                      <>
                        {/* Sprint search input */}
                        {!sprintsLoading && sprints.length > 0 && (
                          <div className="px-2 pb-1 pt-1">
                            <Input
                              placeholder="Search sprints or board…"
                              value={sprintSearch}
                              onChange={(e) => setSprintSearch(e.target.value)}
                              className="h-7 border-muted-foreground/25 bg-muted/20 text-xs focus-visible:ring-primary/30"
                            />
                          </div>
                        )}

                        {/* Sprint list */}
                        <div className="max-h-36 overflow-y-auto">
                          {sprintsLoading
                            ? [0, 1, 2].map((i) => <Skeleton key={i} className="mx-2 my-0.5 h-6 rounded" />)
                            : filteredSprints.length === 0
                              ? <p className="px-3 py-3 text-center text-xs text-muted-foreground/50">{sprints.length === 0 ? 'No sprints found' : 'No matches'}</p>
                              : filteredSprints.map((sprint) => (
                                <FilterRow
                                  key={sprint.jqlValue}
                                  variant="radio"
                                  selected={selectedSprintJql === sprint.jqlValue}
                                  onClick={() => setSelectedSprintJql(sprint.jqlValue)}
                                  icon={<span className={cn('size-1.5 shrink-0 rounded-full', sprint.state === 'active' ? 'bg-green-400' : sprint.state === 'future' ? 'bg-blue-400' : 'bg-muted-foreground/30')} />}
                                  label={
                                    <span className="flex min-w-0 flex-1 flex-col">
                                      <span className="truncate">{sprint.name}</span>
                                      {sprint.boardName && (
                                        <span className="truncate text-[9px] text-muted-foreground/50">{sprint.boardName}</span>
                                      )}
                                    </span>
                                  }
                                  badge={sprint.state && (
                                    <span className={cn('shrink-0 text-[9px] font-semibold uppercase tracking-wide', sprint.state === 'active' ? 'text-green-400' : sprint.state === 'future' ? 'text-blue-400' : 'text-muted-foreground/40')}>
                                      {sprint.state}
                                    </span>
                                  )}
                                />
                              ))
                          }
                        </div>

                        {/* Fixed options: All sprints + Unset sprint */}
                        <div className="border-t border-border/20 pb-0.5 pt-0.5">
                          <FilterRow
                            variant="radio"
                            selected={selectedSprintJql === null}
                            onClick={() => setSelectedSprintJql(null)}
                            icon={<span className="size-1.5 shrink-0 rounded-full bg-muted-foreground/30" />}
                            label={<span className="font-semibold uppercase tracking-wider text-[10px]">All sprints</span>}
                          />
                          <FilterRow
                            variant="radio"
                            selected={selectedSprintJql === UNSET_SPRINT_JQL}
                            onClick={() => setSelectedSprintJql(UNSET_SPRINT_JQL)}
                            icon={<span className="size-1.5 shrink-0 rounded-full ring-1 ring-muted-foreground/40" />}
                            label={<span className="font-semibold uppercase tracking-wider text-[10px]">Unset sprint</span>}
                          />
                        </div>
                      </>
                      )}
                    </FilterSection>

                    {/* ── Type section ── */}
                    <FilterSection
                      label="Type"
                      expanded={typeExpanded}
                      onToggle={() => setTypeExpanded((v) => !v)}
                      hasSelection={selectedTypes.size > 0}
                      onClear={() => setSelectedTypes(new Set())}
                    >
                      <div className="pb-1">
                        {['Story', 'Bug', 'Task', 'Epic', 'Sub-task'].map((name) => (
                          <FilterRow
                            key={name}
                            selected={selectedTypes.has(name)}
                            onClick={() => setSelectedTypes((prev) => { const n = new Set(prev); n.has(name) ? n.delete(name) : n.add(name); return n })}
                            icon={getIssueTypeIcon(name)}
                            label={name}
                          />
                        ))}
                      </div>
                    </FilterSection>
                  </div>
                )}
              </div>}

              {/* Issue list */}
              <div className="flex min-h-0 min-w-0 flex-1 flex-col">
                {/* Screen reader live region */}
                <p className="sr-only" aria-live="polite" aria-atomic="true">
                  {loading ? 'Searching…' : `${issues.length} issues found`}
                </p>
                <p className="sr-only" aria-live="polite" aria-atomic="true">
                  {selectedIssueIds.size > 0
                    ? `${selectedIssueIds.size} issue${selectedIssueIds.size > 1 ? 's' : ''} selected`
                    : 'No issues selected'}
                </p>

                <div
                  ref={scrollContainerRef}
                  className="min-h-0 flex-1 overflow-y-auto"
                  role="listbox"
                  aria-multiselectable="true"
                  aria-label="Jira issues"
                >
                  {/* Loading skeleton */}
                  {loading && (
                    <div className="flex flex-col gap-0 py-1">
                      {[0, 1, 2, 3].map((i) => (
                        <div key={i} className="flex items-start gap-3 px-4 py-2.5">
                          <Skeleton className="mt-0.5 size-3.5 shrink-0 rounded-sm" />
                          <div className="flex-1 space-y-1.5">
                            <Skeleton className="h-3.5 w-full rounded" />
                            <Skeleton className="h-3 w-2/3 rounded" />
                            <Skeleton className="h-2.5 w-14 rounded" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Error state */}
                  {!loading && isError && (
                    <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-12 text-center">
                      <div className="flex size-10 items-center justify-center rounded-full bg-destructive/10">
                        <svg className="size-5 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Failed to load issues</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">Check your Jira connection and try again</p>
                      </div>
                    </div>
                  )}

                  {/* Empty — project selected but sprints still loading (auto-load pending) */}
                  {!loading && !isError && !hasQuery && selectedProjectKey && sprintsLoading && (
                    <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 py-12 text-center">
                      <svg className="size-6 animate-spin text-muted-foreground/30" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                      </svg>
                      <p className="text-sm text-muted-foreground/60">Loading sprints…</p>
                    </div>
                  )}

                  {/* Empty — no query */}
                  {!loading && !isError && !hasQuery && !(selectedProjectKey && sprintsLoading) && (
                    <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 py-12 text-center">
                      <div className="animate-pulse">
                        <Search className="size-8 text-muted-foreground/25" />
                      </div>
                      <p className="text-sm font-medium text-muted-foreground">{t('typeToSearch')}</p>
                      <p className="text-xs text-muted-foreground/50">
                        Search by issue key, title, or switch to JQL for advanced queries
                      </p>
                    </div>
                  )}

                  {/* Empty — query but no results */}
                  {!loading && !isError && hasQuery && issues.length === 0 && (
                    <p className="py-6 text-center text-sm text-muted-foreground">{t('noIssuesFound')}</p>
                  )}

                  {/* Results */}
                  {!loading && !isError && issues.length > 0 && (
                    <div className="flex flex-col py-1">

                      {/* Select all row — non-interactive when all issues on page are already queued */}
                      {allPageQueued ? (
                        <div className="flex items-center gap-2.5 border-b border-border/40 bg-green-500/[0.04] px-4 py-2">
                          <div className="flex size-4 shrink-0 items-center justify-center rounded-sm border border-green-500/40 bg-green-500/15">
                            <svg viewBox="0 0 10 8" className="size-full p-0.5 text-green-400" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                              <path d="M1 4l2.5 2.5L9 1" />
                            </svg>
                          </div>
                          <span className="text-xs font-semibold text-muted-foreground/50">
                            All on this page are already in your queue
                          </span>
                        </div>
                      ) : (
                        <div
                          role="button"
                          tabIndex={0}
                          onClick={toggleSelectAll}
                          onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggleSelectAll() } }}
                          className="flex cursor-pointer items-center gap-2.5 border-b border-border/40 bg-muted/20 px-4 py-2 transition-colors hover:bg-muted/30"
                        >
                          <div
                            className={cn(
                              'size-4 flex-shrink-0 rounded-sm border transition-all duration-100',
                              allOnPageSelected
                                ? 'border-primary bg-primary shadow-sm shadow-primary/30'
                                : 'border-muted-foreground/40 bg-muted/40'
                            )}
                          >
                            {allOnPageSelected && (
                              <svg viewBox="0 0 10 8" className="size-full p-0.5 text-primary-foreground" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                                <path d="M1 4l2.5 2.5L9 1" />
                              </svg>
                            )}
                          </div>
                          <span className="text-xs font-semibold text-muted-foreground">
                            {selectAllLabel}
                          </span>
                        </div>
                      )}

                      {/* Issue rows — selectable first, already-queued at bottom with a section divider */}
                      <div className="divide-y divide-border/20">
                        {displayOrder.map((issue, displayIndex) => {
                          const isSelected = selectedIssueIds.has(issue.id)
                          const isAlreadyQueued = queuedJiraKeys.has(issue.key)
                          const isFirstQueued = isAlreadyQueued && displayIndex === toggleableIssues.length && alreadyQueuedIssues.length > 0 && toggleableIssues.length > 0
                          return (
                            <React.Fragment key={issue.id}>
                              {isFirstQueued && (
                                <div className="flex items-center gap-2 bg-muted/10 px-4 py-1.5">
                                  <div className="h-px flex-1 bg-border/30" />
                                  <span className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground/40">Already in queue</span>
                                  <div className="h-px flex-1 bg-border/30" />
                                </div>
                              )}
                              <label
                                className={cn(
                                  'flex items-center gap-3 border-l-2 px-4 py-2.5 transition-all duration-100',
                                  isAlreadyQueued
                                    ? 'cursor-default border-l-green-500/50 bg-green-500/[0.04] pointer-events-none'
                                    : isSelected
                                      ? 'cursor-pointer border-l-primary/80 bg-primary/10 hover:bg-primary/15'
                                      : 'cursor-pointer border-l-transparent hover:bg-muted/25'
                                )}
                                role="option"
                                aria-selected={isSelected}
                                aria-disabled={isAlreadyQueued}
                                onClick={isAlreadyQueued ? undefined : () => toggleIssue(issue.id)}
                              >
                                {/* Checkbox slot — green checkmark for queued, interactive checkbox otherwise */}
                                {isAlreadyQueued ? (
                                  <div className="flex size-3.5 shrink-0 items-center justify-center rounded-sm border border-green-500/40 bg-green-500/15">
                                    <svg viewBox="0 0 10 8" className="size-full p-0.5 text-green-400" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                      <path d="M1 4l2.5 2.5L9 1" />
                                    </svg>
                                  </div>
                                ) : (
                                  <div
                                    className={cn(
                                      'size-3.5 flex-shrink-0 rounded-sm border transition-all duration-100',
                                      isSelected
                                        ? 'border-primary bg-primary shadow-sm shadow-primary/30'
                                        : 'border-border/50 bg-muted/30 hover:border-muted-foreground/70'
                                    )}
                                  >
                                    {isSelected && (
                                      selectedIssueIds.size > 1 ? (
                                        <span className="flex size-full items-center justify-center text-[9px] font-bold leading-none text-white">
                                          {Array.from(selectedIssueIds).indexOf(issue.id) + 1}
                                        </span>
                                      ) : (
                                        <svg viewBox="0 0 10 8" className="size-full p-0.5 text-white" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                          <path d="M1 4l2.5 2.5L9 1" />
                                        </svg>
                                      )
                                    )}
                                  </div>
                                )}

                                {/* Issue type icon — faded for queued rows */}
                                <div className={cn('shrink-0', isAlreadyQueued && 'opacity-40')}>
                                  {getIssueTypeIcon(issue.type)}
                                </div>

                                {/* Issue info */}
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-baseline gap-2">
                                    <span className={cn(
                                      'min-w-[68px] shrink-0 font-mono text-[10px] font-bold',
                                      isAlreadyQueued ? 'text-green-400/60' : 'text-primary'
                                    )}>
                                      {issue.key}
                                    </span>
                                    <p className={cn(
                                      'truncate text-xs leading-snug',
                                      isAlreadyQueued ? 'text-foreground/40' : 'text-foreground/80'
                                    )}>
                                      {issue.summary}
                                    </p>
                                  </div>
                                  {isAlreadyQueued && (
                                    <p className="mt-0.5 text-[10px] font-medium text-green-400/50">In queue</p>
                                  )}
                                </div>
                              </label>
                            </React.Fragment>
                          )
                        })}
                      </div>
                    </div>
                  )}

                </div>

                {/* Selection summary bar */}
                {selectedIssueIds.size > 0 && (
                  <div className="flex shrink-0 items-center justify-between border-t border-border/60 bg-muted/10 px-4 py-1.5">
                    <span className="text-xs text-muted-foreground">
                      {selectedIssueIds.size} issue{selectedIssueIds.size > 1 ? 's' : ''} selected
                    </span>
                    <button
                      onClick={() => setSelectedIssueIds(new Set())}
                      className="text-xs text-primary hover:underline"
                    >
                      Clear selection
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* ── Pagination bar ── */}
            {!loading && !isError && issues.length > 0 && (
              <div className="flex shrink-0 items-center justify-between border-t border-border/40 bg-[hsl(20,6%,7%)] px-4 py-1.5">
                <span className="text-[11px] tabular-nums text-muted-foreground/60">
                  {startAt + 1}–{startAt + issues.length}{hasMore ? <span className="text-blue-400/70">+</span> : ''}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    disabled={currentPage === 0 || paginating}
                    onClick={goToPrev}
                    className="flex h-7 items-center gap-0.5 rounded-lg border border-border/40 bg-muted/20 px-2.5 text-[11px] font-medium text-muted-foreground transition-colors hover:border-border/60 hover:bg-muted/40 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-25"
                    aria-label="Previous page"
                  >
                    {paginating ? (
                      <svg className="size-3 animate-spin text-primary/60" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                      </svg>
                    ) : (
                      <>
                        <svg className="size-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                        Prev
                      </>
                    )}
                  </button>
                  <button
                    disabled={!hasMore || paginating}
                    onClick={goToNext}
                    className="flex h-7 items-center gap-0.5 rounded-lg border border-border/40 bg-muted/20 px-2.5 text-[11px] font-medium text-muted-foreground transition-colors hover:border-border/60 hover:bg-muted/40 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-25"
                    aria-label="Next page"
                  >
                    {paginating ? (
                      <svg className="size-3 animate-spin text-primary/60" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                      </svg>
                    ) : (
                      <>
                        Next
                        <svg className="size-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </>
                    )}
                  </button>
                  <select
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value) as 25 | 50 | 100)}
                    className="h-7 rounded-md border border-border/40 bg-muted/20 px-1.5 text-[11px] text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
                    title="Items per page"
                  >
                    <option value={25}>25 / page</option>
                    <option value={50}>50 / page</option>
                    <option value={100}>100 / page</option>
                  </select>
                </div>
              </div>
            )}

            {/* ── Footer bar ── */}
            <div className="flex items-center justify-between border-t border-border/60 bg-[hsl(20,6%,7%)] px-4 py-3">

              {/* Over-limit warning */}
              {wouldExceedLimit && selectedIssueIds.size > 0 && (
                <span className="text-[10px] font-medium text-amber-400">
                  Adding {selectedIssueIds.size} would exceed the {MAX_QUEUE_SIZE}-ticket limit ({remainingSlots} slot{remainingSlots !== 1 ? 's' : ''} left)
                </span>
              )}

              {/* Right: Cancel + Confirm */}
              <div className="ml-auto flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onOpenChange(false)}
                  className="h-8 text-xs text-muted-foreground hover:text-foreground"
                >
                  {t('cancel')}
                </Button>
                <Button
                  size="sm"
                  disabled={selectedIssueIds.size === 0 || wouldExceedLimit}
                  onClick={handleConfirm}
                  className="h-8 gap-1.5 text-xs transition-transform duration-150 hover:scale-[1.02]"
                >
                  {selectedIssueIds.size > 0 && (
                    <span className="flex size-4 items-center justify-center rounded-full bg-white/25 text-[10px] font-bold tabular-nums">
                      {selectedIssueIds.size}
                    </span>
                  )}
                  {confirmLabel}
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
