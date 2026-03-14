import type { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'

export const metadata: Metadata = {
  title: 'Story Points Estimator for Agile Teams — Corgi Planning Poker',
  description:
    'Estimate story points collaboratively in real-time. Free online story points estimator for scrum and agile teams.',
  alternates: {
    canonical: 'https://www.corgiplanningpoker.com/story-points-estimator',
  },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://www.corgiplanningpoker.com',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Story Points Estimator',
      item: 'https://www.corgiplanningpoker.com/story-points-estimator',
    },
  ],
}

const SCALES = [
  {
    name: 'Fibonacci',
    values: '1, 2, 3, 5, 8, 13, 21, 34',
    best: 'Story point estimation in most scrum teams. The non-linear gaps force acceptance of uncertainty at large sizes.',
  },
  {
    name: 'T-shirt sizes',
    values: 'XS, S, M, L, XL, XXL',
    best: 'High-level backlog sizing and early-stage roadmap planning where precise point values are not yet needed.',
  },
  {
    name: 'Powers of 2',
    values: '1, 2, 4, 8, 16, 32, 64',
    best: 'Engineering teams who prefer clean doubling increments. Common in infrastructure and platform work.',
  },
]

const MISTAKES = [
  {
    title: 'Estimating in hours instead of relative effort',
    description:
      'Story points intentionally avoid time commitments. When teams map points directly to hours they lose the benefits of relative sizing and start over-committing. Keep story points abstract — they measure complexity and effort relative to your team\'s own history, not clock time.',
  },
  {
    title: 'Letting a single voice anchor the discussion',
    description:
      'If a senior engineer announces their estimate before everyone else has voted, the rest of the team gravitates toward that number. Always use simultaneous reveal — everyone picks a card privately and votes are shown all at once. This is the defining rule of planning poker and the main reason to use a tool like Corgi instead of a shared spreadsheet.',
  },
  {
    title: 'Estimating stories that are too large to size accurately',
    description:
      'If a story consistently receives wildly divergent estimates, the story is probably too large or too vague. An infinity-card vote is a healthy signal: the story needs to be split or refined before it can be estimated. Trying to force consensus on an oversized story wastes planning time and produces an unreliable number.',
  },
]

const StoryPointsEstimatorPage = () => {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="mx-auto max-w-[1100px] px-4 py-16 space-y-20">
        {/* Hero */}
        <section className="space-y-6">
          <div className="space-y-4 max-w-[680px]">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
              Story Points Estimator for Agile Teams
            </h1>
            <p className="text-lg leading-relaxed text-muted-foreground">
              Estimate story points collaboratively in real time with your scrum or agile team.
              Free, instant, and no registration required.
            </p>
          </div>
          <div className="relative inline-block">
            <div className="absolute inset-[-4px] animate-pulse rounded-lg bg-primary/40 blur-xl" style={{ animationDuration: '2s' }} />
            <div className="relative overflow-hidden rounded-md">
              <span className="pointer-events-none absolute inset-0 z-10 animate-shine bg-gradient-to-r from-transparent via-white/30 to-transparent" style={{ animationDuration: '3s' }} />
              <Link
                href="/new-room"
                className="relative inline-flex h-11 w-56 items-center justify-center rounded-md bg-primary px-6 text-sm font-semibold text-primary-foreground transition-transform duration-200 hover:scale-[1.03] hover:shadow-lg hover:shadow-primary/40"
              >
                Estimate Story Points →
              </Link>
            </div>
          </div>
        </section>

        {/* What Are Story Points? */}
        <section className="space-y-4">
          <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            <span className="inline-block size-2 rounded-full bg-primary" />
            What Are Story Points?
          </h2>
          <div className="space-y-3 border-l-2 border-primary pl-5">
            <p className="text-sm leading-relaxed text-muted-foreground">
              Story points are a unit of measure used in agile development to express the
              estimated effort required to complete a user story, task, or other work item.
              Unlike estimating in hours, story points are relative — they describe how large
              a piece of work is compared to other pieces of work your team has already
              completed, rather than predicting exactly how long the work will take.
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              This distinction matters enormously in practice. Hours-based estimates create an
              implicit commitment: if a developer estimates a task at &quot;four hours&quot; and it takes
              eight, both the developer and stakeholders feel that something went wrong. Story
              points sidestep this trap. A story estimated at 5 points and a story estimated
              at 3 points should have a roughly similar ratio of effort — but neither number
              implies a specific number of working hours.
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Story points capture three dimensions at once: the volume of work involved, its
              complexity (how hard is it to implement correctly?), and uncertainty (how well
              do we understand what needs to be done?). A story can have a small volume but
              high complexity — touching a fragile, undocumented legacy system, for example —
              and should receive a higher point value to reflect that. A straightforward CRUD
              endpoint might involve a lot of typing but little uncertainty, and should be
              sized accordingly.
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Over time, teams accumulate a <em>velocity</em> — the average number of story
              points they complete per sprint. Velocity becomes a reliable forecasting tool:
              if a team averages 32 points per sprint, and the remaining backlog totals
              128 points, they can reasonably estimate four more sprints to reach their
              release goal. This only works when estimates are consistent and honest, which
              is why the planning poker technique — with its simultaneous card reveal — is
              designed to protect estimate integrity.
            </p>
          </div>
        </section>

        {/* How to Estimate Story Points with Planning Poker */}
        <section className="space-y-4">
          <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            <span className="inline-block size-2 rounded-full bg-primary" />
            How to Estimate Story Points with Planning Poker
          </h2>
          <div className="space-y-3 border-l-2 border-primary pl-5">
            <p className="text-sm leading-relaxed text-muted-foreground">
              The facilitator reads a user story aloud — or pastes it into the shared room
              description — and answers any immediate clarifying questions. Each participant
              then privately selects a card from their deck that represents their effort
              estimate. When everyone has voted, all cards are revealed at the same time.
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              If all votes cluster within one or two values, the team has consensus and can
              accept the median or highest value as the story&apos;s estimate. If there is a wide
              spread — say, one person voted 2 and another voted 13 — the facilitator asks
              both extremes to explain their reasoning. This discussion is the most valuable
              part of the process. The low-voter may have a simpler implementation in mind
              that the high-voter has not considered. The high-voter may know about a
              dependency or edge case the rest of the team missed. After the discussion, the
              team votes again until consensus is reached.
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              The entire process is time-boxed. A single story should rarely take more than
              five to ten minutes to estimate. If discussion keeps escalating without
              consensus, it is usually a signal to table the story, schedule a separate
              refinement session with the product owner, and move on.
            </p>
          </div>
        </section>

        {/* Story Point Scales */}
        <section className="space-y-6">
          <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            <span className="inline-block size-2 rounded-full bg-primary" />
            Story Point Scales
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {SCALES.map(({ name, values, best }) => (
              <div
                key={name}
                className="rounded-xl border border-border/40 bg-secondary p-5 space-y-3 hover:border-primary/30 transition-colors duration-200"
              >
                <h3 className="font-semibold">{name}</h3>
                <p className="text-xs font-bold tabular-nums text-primary">{values}</p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  <span className="font-medium text-foreground">Best for: </span>
                  {best}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            For a deeper explanation of why the Fibonacci sequence works for estimation, read{' '}
            <Link href="/blog/planning-poker-fibonacci" className="text-primary underline-offset-4 hover:underline">
              Why Planning Poker Uses Fibonacci Numbers
            </Link>
            . To understand the difference between story points and hours, see{' '}
            <Link href="/blog/story-points-vs-hours" className="text-primary underline-offset-4 hover:underline">
              Story Points vs Hours
            </Link>
            .
          </p>
        </section>

        {/* Common Mistakes */}
        <section className="space-y-6">
          <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            <span className="inline-block size-2 rounded-full bg-primary" />
            Common Mistakes When Estimating Story Points
          </h2>
          <div className="space-y-4">
            {MISTAKES.map(({ title, description }, i) => (
              <div
                key={title}
                className="flex gap-4 rounded-xl border border-border/40 bg-secondary p-5"
              >
                <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  {i + 1}
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-sm">{title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Internal links */}
        <section className="space-y-4 border-t border-border/40 pt-10">
          <h2 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
            Explore More
          </h2>
          <nav aria-label="Related pages">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              <li>
                <Link href="/" className="text-sm text-primary underline-offset-4 hover:underline">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/scrum-poker" className="text-sm text-primary underline-offset-4 hover:underline">
                  Scrum Poker Online
                </Link>
              </li>
              <li>
                <Link href="/agile-estimation" className="text-sm text-primary underline-offset-4 hover:underline">
                  Agile Estimation Tool
                </Link>
              </li>
              <li>
                <Link href="/sprint-planning" className="text-sm text-primary underline-offset-4 hover:underline">
                  Sprint Planning Poker
                </Link>
              </li>
              <li>
                <Link href="/new-room" className="text-sm text-primary underline-offset-4 hover:underline">
                  Create a Room
                </Link>
              </li>
            </ul>
          </nav>
        </section>
      </div>
    </>
  )
}

export default StoryPointsEstimatorPage
