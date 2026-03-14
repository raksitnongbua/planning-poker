import type { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'

export const metadata: Metadata = {
  title: 'Free Scrum Poker Online — Corgi Planning Poker',
  description:
    'Run scrum poker sessions online with your agile team. Real-time voting, Fibonacci cards, no registration. Free forever.',
  alternates: {
    canonical: 'https://www.corgiplanningpoker.com/scrum-poker',
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
      name: 'Scrum Poker',
      item: 'https://www.corgiplanningpoker.com/scrum-poker',
    },
  ],
}

const STEPS = [
  {
    step: '1',
    title: 'Create a room',
    description:
      'Click "Start Scrum Poker", give your room a name, and pick your card deck. A shareable link is generated instantly — no sign-up required.',
  },
  {
    step: '2',
    title: 'Invite your team',
    description:
      'Share the link with your scrum team. Anyone with the link can join from any browser or device, including phones and tablets.',
  },
  {
    step: '3',
    title: 'Vote and reveal',
    description:
      'Each player selects a card privately. Reveal all votes at once to surface outliers, spark discussion, and lock in a consensus estimate.',
  },
]

const FEATURES = [
  {
    title: 'Real-time sync',
    description:
      'Votes update live across every screen the moment a card is selected — no page refresh needed.',
  },
  {
    title: 'No registration',
    description:
      'Start a session in under 30 seconds. Every visitor is auto-assigned a guest identity so nothing blocks your planning flow.',
  },
  {
    title: 'Free forever',
    description:
      'No subscription, no trial period, no credit card. Corgi Planning Poker is completely free with no paid tiers.',
  },
  {
    title: 'Custom decks',
    description:
      'Use the built-in Fibonacci deck, T-shirt sizes, Powers of 2, or create a fully custom card set for your team.',
  },
]

const ScrumPokerPage = () => {
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
              Free Scrum Poker Online
            </h1>
            <p className="text-lg leading-relaxed text-muted-foreground">
              Run fast, focused scrum poker sessions with your agile team — real-time voting,
              Fibonacci cards, and zero friction. No account needed.
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
                Start Scrum Poker →
              </Link>
            </div>
          </div>
        </section>

        {/* What is Scrum Poker? */}
        <section className="space-y-4">
          <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            <span className="inline-block size-2 rounded-full bg-primary" />
            What is Scrum Poker?
          </h2>
          <div className="space-y-3 border-l-2 border-primary pl-5">
            <p className="text-sm leading-relaxed text-muted-foreground">
              Scrum poker — also called planning poker — is a consensus-based agile estimation
              technique used during sprint planning and backlog refinement. Each team member
              privately selects a card representing their effort estimate for a user story or task,
              then all cards are revealed simultaneously. This simultaneous reveal is the key
              mechanic: it prevents anchoring, the cognitive bias where the first number heard
              in a meeting pulls everyone else&apos;s estimate toward it.
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              The terms &quot;scrum poker&quot; and &quot;planning poker&quot; are used interchangeably across the
              industry. Strictly speaking, planning poker is the name coined by James Grenning in
              2002 and later popularised by Mike Cohn in <em>Agile Estimating and Planning</em>.
              &quot;Scrum poker&quot; emerged as a colloquial shorthand because the technique is most
              commonly used inside Scrum ceremonies — specifically sprint planning and backlog
              grooming. Both terms refer to exactly the same practice.
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Card values almost always follow a Fibonacci-like sequence: 1, 2, 3, 5, 8, 13, 21.
              The increasing gaps between values reflect a fundamental truth about estimation —
              the larger a piece of work is, the less precisely we can estimate it. Using
              Fibonacci numbers forces the team to accept that distinction and avoid false
              precision on large stories. Many teams also include special cards: a &quot;?&quot; for
              &quot;I have no idea&quot;, a coffee cup for &quot;I need a break&quot;, and an infinity symbol for
              &quot;this story is too large to estimate and must be split&quot;.
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Online scrum poker tools like Corgi Planning Poker replicate the physical card
              experience in a virtual environment — essential for remote and hybrid teams who
              cannot sit around a shared table. Everyone on the team picks their card privately,
              the facilitator triggers a reveal, and the results are shown to all participants
              simultaneously, preserving the anti-anchoring benefit of the original technique.
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {' '}
              <Link href="/blog/how-planning-poker-works" className="text-primary underline-offset-4 hover:underline">
                Read the complete guide to how planning poker works →
              </Link>
            </p>
          </div>
        </section>

        {/* How to Run a Scrum Poker Session */}
        <section className="space-y-6">
          <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            <span className="inline-block size-2 rounded-full bg-primary" />
            How to Run a Scrum Poker Session
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

        {/* Feature highlights */}
        <section className="space-y-6">
          <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            <span className="inline-block size-2 rounded-full bg-primary" />
            Built for Modern Agile Teams
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map(({ title, description }) => (
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

        {/* Why Corgi? */}
        <section className="space-y-4">
          <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            <span className="inline-block size-2 rounded-full bg-primary" />
            Why Corgi for Scrum Poker?
          </h2>
          <div className="space-y-3 border-l-2 border-primary pl-5">
            <p className="text-sm leading-relaxed text-muted-foreground">
              Corgi Planning Poker was built with one goal: get out of the way of your team.
              There are no accounts to create, no dashboards to configure, and no pricing plans
              to evaluate. You open the app, create a room in seconds, share a link, and your
              scrum poker session is live. The WebSocket-powered voting engine ensures every
              participant sees card selections and reveals in real time, keeping remote teams as
              synchronised as if they were in the same room. Whether your team uses Fibonacci
              for story points, T-shirt sizing for relative estimation, or a fully custom scale
              that matches your workflow, Corgi adapts. And because it is open source and
              completely free — no trials, no subscriptions — it stays out of budget conversations
              entirely. Teams using Corgi tell us that removing the sign-up step is the single biggest friction reduction — participants who might decline a tool requiring email verification join immediately via a shared link.
            </p>
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
                <Link href="/agile-estimation" className="text-sm text-primary underline-offset-4 hover:underline">
                  Agile Estimation Tool
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

export default ScrumPokerPage
