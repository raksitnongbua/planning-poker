import type { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'

export const metadata: Metadata = {
  title: 'Free Agile Estimation Tool — Corgi Planning Poker',
  description:
    'Free agile estimation tool for scrum teams. Real-time planning poker with Fibonacci, T-shirt sizes, and custom decks — no signup needed.',
  alternates: {
    canonical: 'https://www.corgiplanningpoker.com/agile-estimation',
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
      name: 'Agile Estimation',
      item: 'https://www.corgiplanningpoker.com/agile-estimation',
    },
  ],
}

const STEPS = [
  {
    step: '1',
    title: 'Create your room',
    description:
      'Open Corgi Planning Poker, name your session, and select a card deck. Your room is ready in seconds — no setup required.',
  },
  {
    step: '2',
    title: 'Invite the team',
    description:
      'Share the generated link with every participant. They join from any device without creating an account.',
  },
  {
    step: '3',
    title: 'Estimate together',
    description:
      'Each team member picks a card privately. Reveal simultaneously, discuss gaps, and agree on a final estimate.',
  },
]

const TECHNIQUES = [
  {
    title: 'Fibonacci (1, 2, 3, 5, 8, 13, 21…)',
    description:
      'The most widely used scale in agile. Increasing gaps reflect growing uncertainty — perfect for story point estimation.',
  },
  {
    title: 'T-shirt sizes (XS, S, M, L, XL, XXL)',
    description:
      'Intuitive for teams new to agile estimation. Great for high-level backlog sizing before committing to a sprint.',
  },
  {
    title: 'Powers of 2 (1, 2, 4, 8, 16, 32…)',
    description:
      'Common in engineering teams. Clean doubling increments make relative comparisons straightforward.',
  },
  {
    title: 'Custom deck',
    description:
      'Enter any comma-separated values to match your team\'s existing conventions — hours, points, risk ratings, or anything else.',
  },
]

const BENEFITS = [
  {
    title: 'Prevents anchoring bias',
    description:
      'Cards are hidden until everyone votes. No single voice sets the tone before others have committed to their own estimate.',
  },
  {
    title: 'Surfaces knowledge gaps early',
    description:
      'When estimates diverge widely, it usually means different team members understand the story differently — a valuable signal caught before development starts.',
  },
  {
    title: 'Engages every team member',
    description:
      'Everyone votes, not just the loudest voice in the room. Junior developers, QA engineers, and designers all contribute their perspective.',
  },
  {
    title: 'No setup, no cost',
    description:
      'Unlike tools that require Jira integrations or per-seat licensing, Corgi needs only a browser and a shared link.',
  },
]

const AgileEstimationPage = () => {
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
              Free Agile Estimation Tool
            </h1>
            <p className="text-lg leading-relaxed text-muted-foreground">
              Collaboratively estimate stories and tasks with your agile team in real time.
              No account needed — just create a room, share the link, and start estimating.
            </p>
          </div>
          <div className="relative inline-block">
            <div className="absolute inset-[-4px] animate-pulse rounded-lg bg-primary/40 blur-xl" style={{ animationDuration: '2s' }} />
            <div className="relative overflow-hidden rounded-md">
              <span className="pointer-events-none absolute inset-0 z-10 animate-shine bg-gradient-to-r from-transparent via-white/30 to-transparent" style={{ animationDuration: '3s' }} />
              <Link
                href="/new-room"
                className="relative inline-flex h-11 w-52 items-center justify-center rounded-md bg-primary px-6 text-sm font-semibold text-primary-foreground transition-transform duration-200 hover:scale-[1.03] hover:shadow-lg hover:shadow-primary/40"
              >
                Start Estimating →
              </Link>
            </div>
          </div>
        </section>

        {/* What is Agile Estimation? */}
        <section className="space-y-4">
          <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            <span className="inline-block size-2 rounded-full bg-primary" />
            What is Agile Estimation?
          </h2>
          <div className="space-y-3 border-l-2 border-primary pl-5">
            <p className="text-sm leading-relaxed text-muted-foreground">
              Agile estimation is the practice of sizing work items — user stories, tasks, bugs,
              or epics — in a way that helps a team plan and commit to a realistic amount of
              work for each sprint or iteration. Unlike traditional project management, which
              estimates in hours or days and expects precise commitments, agile estimation
              focuses on <em>relative sizing</em>: how large is this story compared to another
              story the team has already delivered?
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Relative sizing works because humans are naturally better at comparing things
              than measuring them in absolute terms. You may not know exactly how long it takes
              to build a login page, but you can easily judge whether it is bigger or smaller
              than a password reset flow your team built last sprint. This comparative intuition
              is the foundation of story point estimation and, by extension, of planning poker.
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Accurate agile estimation enables meaningful sprint planning, realistic velocity
              tracking, and honest stakeholder communication. When a team consistently estimates
              well, they can forecast how many stories they will deliver in the next sprint with
              reasonable confidence. When estimates are systematically off, it is usually a sign
              that stories are too large, that acceptance criteria are unclear, or that the
              team is under time pressure to underestimate.
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Agile estimation is also a knowledge-sharing exercise. When team members give
              wildly different estimates, the right response is not to average them — it is to
              ask why. The discussion that follows reveals assumptions, dependencies, and risks
              that might otherwise remain hidden until mid-sprint, when they are far more
              expensive to address.
            </p>
          </div>
        </section>

        {/* Techniques Supported */}
        <section className="space-y-6">
          <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            <span className="inline-block size-2 rounded-full bg-primary" />
            Estimation Techniques Supported
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {TECHNIQUES.map(({ title, description }) => (
              <div
                key={title}
                className="rounded-xl border border-border/40 bg-secondary p-5 space-y-2 hover:border-primary/30 transition-colors duration-200"
              >
                <h3 className="font-semibold text-sm">{title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="space-y-6">
          <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            <span className="inline-block size-2 rounded-full bg-primary" />
            How It Works
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {STEPS.map(({ step, title, description }) => (
              <div
                key={step}
                className="rounded-xl border border-border/40 bg-secondary p-5 space-y-3"
              >
                <div className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {step}
                </div>
                <h3 className="font-semibold">{title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Benefits */}
        <section className="space-y-6">
          <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            <span className="inline-block size-2 rounded-full bg-primary" />
            Benefits of Online Agile Estimation
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {BENEFITS.map(({ title, description }) => (
              <div
                key={title}
                className="rounded-xl border border-border/40 bg-secondary p-5 space-y-2 hover:border-primary/30 transition-colors duration-200"
              >
                <h3 className="font-semibold text-sm">{title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
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
                <Link href="/story-points-estimator" className="text-sm text-primary underline-offset-4 hover:underline">
                  Story Points Estimator
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

export default AgileEstimationPage
