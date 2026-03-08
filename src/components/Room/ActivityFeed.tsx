'use client'
import { faCircleCheck, faEye, faRightToBracket, faRotate } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export type ActivityEventType = 'join' | 'vote' | 'reveal' | 'reset' | 'spectate'
export interface RoundResult {
  votes: { name: string; value: string }[]
  avg: number
}
export interface ActivityEvent {
  id: string
  type: ActivityEventType
  actor?: string
  at: Date
  roundResult?: RoundResult
}

export const INITIAL_ACTIVITY: ActivityEvent[] = (() => {
  const t = (minAgo: number) => new Date(Date.now() - minAgo * 60_000)
  const MEMBERS = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Henry']

  const voteEvents = (round: number, baseMin: number): ActivityEvent[] =>
    MEMBERS.map((name, i) => ({
      id: `v${round}_${i}`,
      type: 'vote' as ActivityEventType,
      actor: name,
      at: t(baseMin - i * 0.4),
    }))

  return [
    // — Joins —
    { id: 'j1', type: 'join', actor: 'Alice',   at: t(75) },
    { id: 'j2', type: 'join', actor: 'Bob',     at: t(74) },
    { id: 'j3', type: 'join', actor: 'Charlie', at: t(73) },
    { id: 'j4', type: 'join', actor: 'Diana',   at: t(72) },
    { id: 'j5', type: 'join', actor: 'Eve',     at: t(71) },
    { id: 'j6', type: 'join', actor: 'Frank',   at: t(70) },
    { id: 'j7', type: 'join', actor: 'Grace',   at: t(69) },
    { id: 'j8', type: 'join', actor: 'Henry',   at: t(68) },

    // Round 1 — spread opinions
    ...voteEvents(1, 67),
    { id: 'r1', type: 'reveal', actor: 'Alice', at: t(63),
      roundResult: { votes: [
        {name:'Alice',value:'5'},{name:'Bob',value:'3'},{name:'Charlie',value:'8'},{name:'Diana',value:'8'},
        {name:'Eve',value:'8'},{name:'Frank',value:'13'},{name:'Grace',value:'5'},{name:'Henry',value:'8'},
      ], avg: 7.25 } },
    { id: 's1', type: 'reset', actor: 'Alice', at: t(62) },

    // Round 2 — leaning toward 8
    ...voteEvents(2, 61),
    { id: 'r2', type: 'reveal', actor: 'Bob', at: t(57),
      roundResult: { votes: [
        {name:'Alice',value:'8'},{name:'Bob',value:'8'},{name:'Charlie',value:'5'},{name:'Diana',value:'8'},
        {name:'Eve',value:'8'},{name:'Frank',value:'8'},{name:'Grace',value:'8'},{name:'Henry',value:'13'},
      ], avg: 8.25 } },
    { id: 's2', type: 'reset', actor: 'Bob', at: t(56) },

    // Round 3 — full consensus
    ...voteEvents(3, 55),
    { id: 'r3', type: 'reveal', actor: 'Charlie', at: t(51),
      roundResult: { votes: MEMBERS.map((name) => ({ name, value: '8' })), avg: 8 } },
    { id: 's3', type: 'reset', actor: 'Charlie', at: t(50) },

    // Round 4 — slight split (Eve low, Henry high)
    ...voteEvents(4, 49),
    { id: 'r4', type: 'reveal', actor: 'Alice', at: t(45),
      roundResult: { votes: [
        {name:'Alice',value:'8'},{name:'Bob',value:'8'},{name:'Charlie',value:'8'},{name:'Diana',value:'8'},
        {name:'Eve',value:'5'},{name:'Frank',value:'8'},{name:'Grace',value:'8'},{name:'Henry',value:'13'},
      ], avg: 8.25 } },
    { id: 's4', type: 'reset', actor: 'Alice', at: t(44) },

    // Round 5 — debate, pulls lower
    ...voteEvents(5, 43),
    { id: 'r5', type: 'reveal', actor: 'Diana', at: t(39),
      roundResult: { votes: [
        {name:'Alice',value:'5'},{name:'Bob',value:'5'},{name:'Charlie',value:'8'},{name:'Diana',value:'8'},
        {name:'Eve',value:'8'},{name:'Frank',value:'8'},{name:'Grace',value:'3'},{name:'Henry',value:'5'},
      ], avg: 6.25 } },
    { id: 's5', type: 'reset', actor: 'Diana', at: t(38) },

    // Round 6 — Bob and Frank go 13
    ...voteEvents(6, 37),
    { id: 'r6', type: 'reveal', actor: 'Eve', at: t(33),
      roundResult: { votes: [
        {name:'Alice',value:'8'},{name:'Bob',value:'13'},{name:'Charlie',value:'8'},{name:'Diana',value:'8'},
        {name:'Eve',value:'8'},{name:'Frank',value:'13'},{name:'Grace',value:'8'},{name:'Henry',value:'8'},
      ], avg: 9.25 } },
    { id: 's6', type: 'reset', actor: 'Eve', at: t(32) },

    // Round 7 — consensus again after discussion
    ...voteEvents(7, 31),
    { id: 'r7', type: 'reveal', actor: 'Frank', at: t(27),
      roundResult: { votes: MEMBERS.map((name) => ({ name, value: '8' })), avg: 8 } },
    { id: 's7', type: 'reset', actor: 'Frank', at: t(26) },

    // Round 8 — Grace outlier high
    ...voteEvents(8, 25),
    { id: 'r8', type: 'reveal', actor: 'Grace', at: t(21),
      roundResult: { votes: [
        {name:'Alice',value:'8'},{name:'Bob',value:'8'},{name:'Charlie',value:'5'},{name:'Diana',value:'8'},
        {name:'Eve',value:'8'},{name:'Frank',value:'8'},{name:'Grace',value:'13'},{name:'Henry',value:'8'},
      ], avg: 8.25 } },
    { id: 's8', type: 'reset', actor: 'Grace', at: t(20) },

    // Round 9 — all converge on 8
    ...voteEvents(9, 19),
    { id: 'r9', type: 'reveal', actor: 'Henry', at: t(15),
      roundResult: { votes: [
        {name:'Alice',value:'8'},{name:'Bob',value:'8'},{name:'Charlie',value:'8'},{name:'Diana',value:'8'},
        {name:'Eve',value:'8'},{name:'Frank',value:'8'},{name:'Grace',value:'5'},{name:'Henry',value:'13'},
      ], avg: 8.25 } },
    { id: 's9', type: 'reset', actor: 'Henry', at: t(14) },

    // Round 10 — in progress, 6 of 8 voted
    ...(['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank'] as const).map((name, i) => ({
      id: `v10_${i}`,
      type: 'vote' as ActivityEventType,
      actor: name,
      at: t(13 - i * 0.4),
    })),
  ] as ActivityEvent[]
})()

const voteChipStyle = (value: string) => {
  const n = Number(value)
  if (isNaN(n))  return { bg: 'bg-muted/40',          text: 'text-muted-foreground' }
  if (n <= 3)    return { bg: 'bg-blue-500/15',        text: 'text-blue-400' }
  if (n <= 8)    return { bg: 'bg-emerald-500/15',     text: 'text-emerald-400' }
  return               { bg: 'bg-orange-500/15',       text: 'text-orange-400' }
}

const avgStyle = (avg: number) => {
  if (avg <= 5)  return 'text-blue-400'
  if (avg <= 10) return 'text-emerald-400'
  return 'text-orange-400'
}

const AVATAR_PALETTES = [
  'bg-violet-500/20 text-violet-400', 'bg-blue-500/20 text-blue-400',
  'bg-emerald-500/20 text-emerald-400', 'bg-amber-500/20 text-amber-400',
  'bg-pink-500/20 text-pink-400', 'bg-cyan-500/20 text-cyan-400',
  'bg-rose-500/20 text-rose-400', 'bg-indigo-500/20 text-indigo-400',
]
const avatarPalette = (name: string) => AVATAR_PALETTES[(name?.charCodeAt(0) ?? 0) % AVATAR_PALETTES.length]

const activityConfig: Record<ActivityEventType, { icon: typeof faEye; color: string; bgColor: string; label: (actor?: string) => string }> = {
  join:     { icon: faRightToBracket, color: 'text-blue-400',   bgColor: 'bg-blue-500/15',    label: (a) => `${a ?? 'Someone'} joined` },
  vote:     { icon: faCircleCheck,    color: 'text-emerald-400', bgColor: 'bg-emerald-500/15', label: (a) => `${a ?? 'Someone'} voted` },
  reveal:   { icon: faEye,            color: 'text-yellow-400', bgColor: 'bg-yellow-500/15',  label: (a) => `${a ?? 'Someone'} revealed` },
  reset:    { icon: faRotate,         color: 'text-orange-400', bgColor: 'bg-orange-500/15',  label: (a) => `${a ?? 'Someone'} new round` },
  spectate: { icon: faEye,            color: 'text-purple-400', bgColor: 'bg-purple-500/15',  label: (a) => `${a ?? 'Someone'} watching` },
}

interface ActivityFeedProps {
  activeTab: 'room' | 'personal'
  roundGroups: { round: number; events: ActivityEvent[] }[]
  personalEvents: ActivityEvent[]
  now: number
  armedEmoji: string | null
  formatTimeAgo: (ms: number) => string
  onTabChange: (tab: 'room' | 'personal') => void
}

const ActivityFeed = ({
  activeTab,
  roundGroups,
  personalEvents,
  now,
  armedEmoji,
  formatTimeAgo,
  onTabChange,
}: ActivityFeedProps) => {
  return (
    <div
      className={`hidden md:flex absolute right-3 top-6 bottom-6 w-52 flex-col transition-opacity duration-200 ${
        armedEmoji ? 'pointer-events-none opacity-20' : 'opacity-100'
      }`}
    >
      <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-border/50 bg-background/90 shadow-xl shadow-black/20 backdrop-blur-md">

        {/* Segmented tabs */}
        <div className="mx-3 mt-3 flex flex-shrink-0 gap-1 rounded-xl bg-muted/40 p-1">
          {(['room', 'personal'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`flex-1 rounded-lg py-1.5 text-[10px] font-semibold transition-all duration-200 ${
                activeTab === tab
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground/60 hover:text-muted-foreground'
              }`}
            >
              {tab === 'room' ? 'Room' : 'Members'}
            </button>
          ))}
        </div>

        {/* ── Room tab ── */}
        {activeTab === 'room' && (
          <div className="flex flex-1 flex-col gap-1 overflow-y-auto py-2 min-h-0">
            {[...roundGroups].reverse().map(({ round, events }) => (
              <div key={round} className="px-3">

                {/* Round header */}
                <div className="flex items-center gap-2 py-2">
                  <span className={`rounded-full px-2.5 py-0.5 text-[9px] font-bold tabular-nums transition-colors ${
                    events.length === 0
                      ? 'bg-primary/20 text-primary'
                      : 'bg-muted/60 text-muted-foreground'
                  }`}>
                    Round {round}
                  </span>
                  {events.length === 0 && (
                    <span className="animate-pulse text-[9px] font-semibold text-primary/70">live</span>
                  )}
                  <div className="h-px flex-1 bg-border/40" />
                </div>

                {/* In progress */}
                {events.length === 0 ? (
                  <div className="mb-2 flex items-center gap-2.5 rounded-xl border border-primary/25 bg-primary/8 px-3 py-2.5">
                    <span className="relative flex size-2 flex-shrink-0">
                      <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary/50" />
                      <span className="relative inline-flex size-2 rounded-full bg-primary" />
                    </span>
                    <span className="text-[11px] font-medium text-primary/80">Voting in progress</span>
                  </div>
                ) : (
                  events.map((event) => {
                    const cfg = activityConfig[event.type]
                    return (
                      <div key={event.id}>

                        {/* Event row */}
                        <div className="flex items-center gap-2.5 rounded-xl px-2 py-1.5 transition-colors hover:bg-muted/30">
                          <div className={`flex size-6 flex-shrink-0 items-center justify-center rounded-lg ${cfg.bgColor}`}>
                            <FontAwesomeIcon icon={cfg.icon} className={`size-3 ${cfg.color}`} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-[11px] font-medium leading-tight text-foreground/80">{cfg.label(event.actor)}</p>
                            <p className="text-[9px] text-muted-foreground/50">{formatTimeAgo(now - event.at.getTime())}</p>
                          </div>
                        </div>

                        {/* Round result card */}
                        {event.roundResult && (
                          <div className="mb-2 mt-1 overflow-hidden rounded-xl border border-border/40 bg-muted/20">

                            {/* 2-col vote grid */}
                            <div className="grid grid-cols-2 gap-1 p-2">
                              {event.roundResult.votes.map((v) => {
                                const chip = voteChipStyle(v.value)
                                return (
                                  <div key={v.name} className={`flex items-center justify-between rounded-lg px-2 py-1 ${chip.bg}`}>
                                    <span className="max-w-[52px] truncate text-[9px] text-foreground/50">{v.name}</span>
                                    <span className={`text-[11px] font-bold tabular-nums ${chip.text}`}>{v.value}</span>
                                  </div>
                                )
                              })}
                            </div>

                            {/* Avg row */}
                            <div className="flex items-center justify-between border-t border-border/30 bg-muted/20 px-3 py-2">
                              <div>
                                <p className="text-[8px] font-semibold uppercase tracking-widest text-muted-foreground/50">Average</p>
                                <p className={`text-xl font-bold tabular-nums leading-tight ${avgStyle(event.roundResult.avg)}`}>
                                  {Number.isInteger(event.roundResult.avg) ? event.roundResult.avg : event.roundResult.avg.toFixed(1)}
                                </p>
                              </div>
                              {/* Mini vote distribution bars */}
                              <div className="flex items-end gap-0.5 h-7 pb-0.5">
                                {(() => {
                                  const counts: Record<string, number> = {}
                                  event.roundResult!.votes.forEach(v => { counts[v.value] = (counts[v.value] ?? 0) + 1 })
                                  const maxCount = Math.max(...Object.values(counts))
                                  return Object.entries(counts)
                                    .sort(([, a], [, b]) => a - b)
                                    .map(([val, cnt]) => {
                                      const chip = voteChipStyle(val)
                                      const h = Math.max(4, Math.round((cnt / maxCount) * 20))
                                      return (
                                        <div
                                          key={val}
                                          style={{ height: h }}
                                          className={`w-2 rounded-sm ${chip.bg}`}
                                          title={`${val}: ${cnt}`}
                                        />
                                      )
                                    })
                                })()}
                              </div>
                            </div>

                          </div>
                        )}
                      </div>
                    )
                  })
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── Members tab ── */}
        {activeTab === 'personal' && (
          <div className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-2 py-2 min-h-0">
            {personalEvents.length === 0 && (
              <p className="mt-8 text-center text-[11px] text-muted-foreground/40">No activity yet</p>
            )}
            {[...personalEvents].reverse().map((event) => {
              const palette = avatarPalette(event.actor ?? '')
              return (
                <div key={event.id} className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 transition-colors hover:bg-muted/30">
                  <div className={`flex size-7 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${palette}`}>
                    {event.actor?.[0]?.toUpperCase() ?? '?'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[11px] font-semibold text-foreground/80">{event.actor ?? 'Someone'}</p>
                    <p className="text-[9px] text-muted-foreground/50">{event.type === 'join' ? 'joined the room' : 'cast a vote'}</p>
                  </div>
                  <span className="flex-shrink-0 text-[9px] text-muted-foreground/40">{formatTimeAgo(now - event.at.getTime())}</span>
                </div>
              )
            })}
          </div>
        )}

      </div>
    </div>
  )
}

export default ActivityFeed
