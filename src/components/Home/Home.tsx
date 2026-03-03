'use client'

import {
  faBolt,
  faClockRotateLeft,
  faCode,
  faInfinity,
  faLayerGroup,
  faUnlockKeyhole,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import { Button } from '../ui/button'
import { Card, CardContent } from '../ui/card'

const HOW_IT_WORKS = [
  {
    step: '1',
    title: 'Create a room',
    description:
      'Click "Create Room", give it a name, and choose your card deck. You get a shareable link instantly — no account needed.',
  },
  {
    step: '2',
    title: 'Invite your team',
    description:
      'Share the room link with your colleagues. Anyone with the link can join from any browser or device.',
  },
  {
    step: '3',
    title: 'Vote and reveal',
    description:
      'Each participant picks a card privately. Reveal all cards at once, discuss outliers, and lock in your estimate.',
  },
]

const FEATURES = [
  {
    icon: faInfinity,
    title: 'Free forever',
    description: 'No subscription, no trial, no credit card required.',
  },
  {
    icon: faUnlockKeyhole,
    title: 'No registration',
    description: 'Start estimating in under 30 seconds. Just create a room and share the link.',
  },
  {
    icon: faBolt,
    title: 'Real-time sync',
    description: "All votes update live across every participant's screen without refreshing.",
  },
  {
    icon: faLayerGroup,
    title: 'Custom card decks',
    description: 'Use the default Fibonacci deck, T-shirt sizes, or create your own custom values.',
  },
  {
    icon: faCode,
    title: 'Open source',
    description: 'The full source code is publicly available on GitHub.',
    link: { href: 'https://github.com/raksitnongbua/planning-poker', label: 'View on GitHub' },
  },
]

const FAQS = [
  {
    q: 'How many people can join a room?',
    a: 'There is no hard limit. Rooms work well for teams of 3 to 20 people. For very large groups, consider splitting into smaller estimation sub-teams.',
  },
  {
    q: 'Do I need to create an account?',
    a: 'No account is required to create or join a room. You can optionally sign in with Google to save your recent rooms for quick access later.',
  },
  {
    q: 'What card decks are available?',
    a: 'Four preset decks are built in: Fibonacci (1, 2, 3, 5, 8, 13, 21, 34), T-Shirt (XS, S, M, L, XL, XXL), Powers of 2 (1, 2, 4, 8, 16, 32, 64), and Hours (1, 2, 4, 8, 16, 24, 40). You can also create a fully custom deck by entering any comma-separated values when creating a room.',
  },
  {
    q: 'Is Corgi Planning Poker free?',
    a: 'Yes, completely free. There are no paid plans, no advertisements, and no data is sold.',
  },
]

const Home = () => {
  return (
    <>
      {/* Hero */}
      <div className="mx-auto flex min-h-[calc(100dvh-92px*2)] max-w-[1100px] items-center justify-center">
        <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
          <div className="my-5 grid max-w-[500px] gap-4">
            <h1 className="text-7xl font-bold leading-tight">
              <span className="inline-block animate-in fade-in slide-in-from-left-8 duration-600 text-primary drop-shadow-[0_0_12px_hsl(var(--primary)/0.6)]" style={{ animationFillMode: 'both' }}>
                Corgi
              </span>
              <br />
              <span className="inline-block animate-in fade-in slide-in-from-bottom-6 duration-600" style={{ animationDelay: '150ms', animationFillMode: 'both' }}>
                Planning
              </span>{' '}
              <span className="inline-block animate-in fade-in slide-in-from-right-8 duration-600" style={{ animationDelay: '300ms', animationFillMode: 'both' }}>
                Poker
              </span>
            </h1>
            <h2
              className="text-lg font-light animate-in fade-in slide-in-from-bottom-3 duration-500"
              style={{ animationDelay: '500ms', animationFillMode: 'both' }}
            >
              Agile teams use this gamified technique to estimate task effort collaboratively,
              fostering consensus and efficient planning.
            </h2>
          </div>
          <div className="flex gap-2" style={{ animationDelay: '700ms', animationFillMode: 'both' }}>
            <div className="relative">
              {/* Glow halo */}
              <div
                className="absolute inset-[-4px] rounded-lg bg-primary/40 blur-xl animate-pulse"
                style={{ animationDuration: '2s' }}
              />
              {/* Shine + button */}
              <div className="relative overflow-hidden rounded-md">
                <span
                  className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shine"
                  style={{ animationDuration: '3s' }}
                />
                <Button
                  asChild
                  className="relative h-11 w-52 bg-gradient-to-r from-orange-500 via-primary to-orange-400 transition-transform duration-200 hover:scale-[1.03] hover:shadow-lg hover:shadow-primary/40 border-0"
                  style={{
                    backgroundSize: '200% 200%',
                    animation: 'gradient-shift 4s ease infinite',
                  }}
                >
                  <Link href="/new-room">Create Room</Link>
                </Button>
              </div>
            </div>
            <Button
              asChild
              variant="secondary"
              className="h-11 gap-2 px-4 transition-transform duration-200 hover:scale-[1.03]"
              id="button-recent-rooms"
              aria-label="Recent Rooms"
            >
              <Link href="/recent-rooms">
                <FontAwesomeIcon
                  icon={faClockRotateLeft}
                  className="size-4 animate-shake"
                  style={{ animationDuration: '2.5s' }}
                />
                Resume Room
              </Link>
            </Button>
          </div>
        </div>
        <div className="hidden animate-in fade-in slide-in-from-right-10 duration-700 lg:block">
          <Image
            src="/images/corgi-banner.png"
            className="animate-sway lg:h-[477px] lg:w-[600px]"
            style={{ animationDuration: '8s' }}
            alt="Corgi dog illustration for Corgi Planning Poker"
            priority={false}
            width={600}
            height={477}
          />
        </div>
      </div>

      {/* Content sections */}
      <section className="mx-auto max-w-[1100px] space-y-20 pb-24 pt-4">
        {/* What is Planning Poker? */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <span className="size-2 rounded-full bg-primary animate-pulse inline-block" />
            What is Planning Poker?
          </h2>
          <div className="space-y-3 border-l-2 border-primary pl-5 transition-all duration-300 hover:[box-shadow:-3px_0_16px_hsl(var(--primary)/0.35)]">
            <p className="text-muted-foreground leading-relaxed">
              Planning poker is a consensus-based agile estimation technique used by scrum teams
              during sprint planning. Each team member privately selects a card representing their
              estimate for a user story or task — typically using a Fibonacci-like sequence (1, 2,
              3, 5, 8, 13…) or T-shirt sizes (XS, S, M, L, XL). Cards are revealed simultaneously
              to prevent anchoring bias, then the team discusses any large discrepancies before
              reaching a shared estimate.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              The technique was popularised by James Grenning in 2002 and later described by Mike
              Cohn in <em>Agile Estimating and Planning</em>. It has since become the de-facto
              standard for story point estimation across scrum, kanban, and SAFe teams worldwide.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <span className="size-2 rounded-full bg-primary animate-pulse inline-block" />
            How It Works
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {HOW_IT_WORKS.map(({ step, title, description }, i) => (
              <Card
                key={step}
                className="animate-in fade-in slide-in-from-bottom-4 duration-500 transition-shadow hover:shadow-md"
                style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'both' }}
              >
                <CardContent className="pt-6">
                  <div className="relative mb-4 inline-flex">
                    <span className="absolute inline-flex size-full rounded-full bg-primary animate-aura" />
                    <div className="relative flex size-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                      {step}
                    </div>
                  </div>
                  <h3 className="mb-2 font-semibold">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Why Use Corgi Planning Poker? */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <span className="size-2 rounded-full bg-primary animate-pulse inline-block" />
            Why Use Corgi Planning Poker?
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ icon, title, description, link }, i) => (
              <Card
                key={title}
                className="group animate-in fade-in slide-in-from-bottom-4 duration-500 transition-all hover:shadow-md hover:border-primary/30"
                style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'both' }}
              >
                <CardContent className="pt-6">
                  <div className="relative mb-3 flex size-11 items-center justify-center transition-transform duration-300 group-hover:scale-110">
                    <span
                      className="absolute inset-0 rounded-full animate-spin-slow bg-[conic-gradient(from_0deg,transparent_25%,hsl(var(--primary)/0.3)_60%,hsl(var(--primary))_100%)]"
                      style={{ animationDuration: '3s' }}
                    />
                    <div className="relative z-10 flex size-9 items-center justify-center rounded-full bg-background">
                      <div className="flex size-full items-center justify-center rounded-full bg-primary/10">
                        <FontAwesomeIcon icon={icon} className="size-4 text-primary" />
                      </div>
                    </div>
                  </div>
                  <h3 className="mb-1 font-semibold">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {description}
                    {link && (
                      <>
                        {' '}
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary underline-offset-4 hover:underline"
                        >
                          {link.label}
                        </a>
                      </>
                    )}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <span className="size-2 rounded-full bg-primary animate-pulse inline-block" />
            Frequently Asked Questions
          </h2>
          <div className="divide-y divide-border overflow-hidden rounded-xl border">
            {FAQS.map(({ q, a }) => (
              <div key={q} className="group px-5 py-4 transition-colors duration-200 hover:bg-primary/5 cursor-default">
                <h3 className="font-semibold transition-colors duration-200 group-hover:text-primary">{q}</h3>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{a}</p>
              </div>
            ))}
            <div className="group px-5 py-4 transition-colors duration-200 hover:bg-primary/5 cursor-default">
              <h3 className="font-semibold transition-colors duration-200 group-hover:text-primary">What is the difference between story points and hours?</h3>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                Story points measure relative effort and complexity rather than clock time. A
                5-point story is roughly twice as complex as a 2-point story for <em>your</em>{' '}
                team, but the actual hours vary by person. Using story points removes pressure to
                commit to specific durations and focuses the conversation on scope and risk instead.
              </p>
            </div>
          </div>
        </div>
      </section>

    </>
  )
}

export default Home
