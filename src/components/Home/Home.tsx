'use client'

import {
  faBolt,
  faClockRotateLeft,
  faCode,
  faCodeBranch,
  faEye,
  faInfinity,
  faLayerGroup,
  faSyncAlt,
  faUnlockKeyhole,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Image from 'next/image'
import Link from 'next/link'


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
    icon: faSyncAlt,
    title: 'Cross-platform sync',
    description:
      'Sign in with Google to link your identity across devices. Resume any room from your phone, tablet, or laptop — your history follows you.',
  },
  {
    icon: faEye,
    title: 'Spectator mode',
    description:
      "Join a room as a silent observer without casting votes. Sit down at any time when you're ready to participate.",
  },
  {
    icon: faCode,
    title: 'Open source',
    description: 'The full source code is publicly available on GitHub. Found a bug? Open an issue. Want to improve the app? Submit a pull request.',
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
    a: 'No account is required. Every visitor is automatically assigned a unique guest ID so you can create and join rooms instantly. Signing in with Google links that ID to your Google account, which syncs your identity across browsers and devices — so you can resume any recent room from your phone, laptop, or any other device without losing your history. In our experience, removing this barrier is the single most impactful change for teams adopting a new estimation tool.',
  },
  {
    q: 'What card decks are available?',
    a: 'Four preset decks are built in: Fibonacci (1, 2, 3, 5, 8, 13, 21, 34), T-Shirt (XS, S, M, L, XL, XXL), Powers of 2 (1, 2, 4, 8, 16, 32, 64), and Hours (1, 2, 4, 8, 16, 24, 40). You can also create a fully custom deck by entering any comma-separated values. Mark any deck as a favourite and it will be auto-selected the next time you create a room.',
  },
  {
    q: 'Can I watch a session without voting?',
    a: 'Yes. When joining a room you can choose "Watch as spectator" to observe without casting a vote. You can sit down and join the voting at any point during the session.',
  },
  {
    q: 'How long does a room last?',
    a: 'Rooms are automatically removed after 30 days of inactivity. As long as your team uses a room at least once a month, it stays available.',
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
        <div className="duration-700 animate-in fade-in slide-in-from-bottom-6">
          <div className="my-5 grid max-w-[500px] gap-4">
            <h1 className="text-7xl font-bold leading-tight">
              <span
                className="duration-600 inline-block text-primary drop-shadow-[0_0_12px_hsl(var(--primary)/0.6)] animate-in fade-in slide-in-from-left-8"
                style={{ animationFillMode: 'both' }}
              >
                Free
              </span>
              <br />
              <span
                className="duration-600 inline-block animate-in fade-in slide-in-from-bottom-6"
                style={{ animationDelay: '150ms', animationFillMode: 'both' }}
              >
                Online
              </span>{' '}
              <span
                className="duration-600 inline-block animate-in fade-in slide-in-from-right-8"
                style={{ animationDelay: '300ms', animationFillMode: 'both' }}
              >
                Planning Poker
              </span>
            </h1>
            <h2
              className="text-lg font-light duration-500 animate-in fade-in slide-in-from-bottom-3"
              style={{ animationDelay: '500ms', animationFillMode: 'both' }}
            >
              by Corgi — estimate story points with your scrum team, no registration required.
            </h2>
          </div>
          <div
            className="flex gap-2"
            style={{ animationDelay: '700ms', animationFillMode: 'both' }}
          >
            <div className="relative">
              {/* Glow halo */}
              <div
                className="absolute inset-[-4px] animate-pulse rounded-lg bg-primary/40 blur-xl"
                style={{ animationDuration: '2s' }}
              />
              {/* Shine + button */}
              <div className="relative overflow-hidden rounded-md">
                <span
                  className="pointer-events-none absolute inset-0 z-10 animate-shine bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  style={{ animationDuration: '3s' }}
                />
                <Button
                  asChild
                  className="relative h-11 w-52 border-0 bg-gradient-to-r from-orange-500 via-primary to-orange-400 transition-transform duration-200 hover:scale-[1.03] hover:shadow-lg hover:shadow-primary/40"
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
        <div className="hidden duration-700 animate-in fade-in slide-in-from-right-10 lg:block">
          <Image
            src="/images/corgi-banner.png"
            className="animate-sway lg:h-[477px] lg:w-[600px]"
            style={{ animationDuration: '8s' }}
            alt="Free online planning poker — agile estimation tool illustration"
            priority={true}
            width={600}
            height={477}
          />
        </div>
      </div>

      {/* Content sections */}
      <section className="mx-auto max-w-[1100px] space-y-20 pb-24 pt-4">
        {/* What is Planning Poker? */}
        <div className="space-y-4">
          <h2 className="flex items-center gap-2 text-2xl font-semibold">
            <span className="inline-block size-2 animate-pulse rounded-full bg-primary" />
            What is Planning Poker?
          </h2>
          <div className="space-y-3 border-l-2 border-primary pl-5 transition-all duration-300 hover:[box-shadow:-3px_0_16px_hsl(var(--primary)/0.35)]">
            <p className="leading-relaxed text-muted-foreground">
              Planning poker is a consensus-based agile estimation technique used by scrum teams
              during sprint planning. Each team member privately selects a card representing their
              estimate for a user story or task — typically using a Fibonacci-like sequence (1, 2,
              3, 5, 8, 13…) or T-shirt sizes (XS, S, M, L, XL). Cards are revealed simultaneously to
              prevent anchoring bias, then the team discusses any large discrepancies before
              reaching a shared estimate.
            </p>
            <p className="leading-relaxed text-muted-foreground">
              The technique was introduced by James Grenning in 2002 and popularised by Mike Cohn
              in <em>Agile Estimating and Planning</em> (2005). It has since become the de-facto
              standard for story point estimation across scrum, kanban, and SAFe teams worldwide.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="space-y-6">
          <h2 className="flex items-center gap-2 text-2xl font-semibold">
            <span className="inline-block size-2 animate-pulse rounded-full bg-primary" />
            How It Works
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {HOW_IT_WORKS.map(({ step, title, description }, i) => (
              <Card
                key={step}
                className="transition-shadow duration-500 animate-in fade-in slide-in-from-bottom-4 hover:shadow-md"
                style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'both' }}
              >
                <CardContent className="pt-6">
                  <div className="relative mb-4 inline-flex">
                    <span className="absolute inline-flex size-full animate-aura rounded-full bg-primary" />
                    <div className="relative flex size-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                      {step}
                    </div>
                  </div>
                  <h3 className="mb-2 font-semibold">{title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Why Use Corgi Planning Poker? */}
        <div className="space-y-6">
          <h2 className="flex items-center gap-2 text-2xl font-semibold">
            <span className="inline-block size-2 animate-pulse rounded-full bg-primary" />
            Why Use Corgi Planning Poker?
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ icon, title, description, link }, i) => (
              <Card
                key={title}
                className="group transition-all duration-500 animate-in fade-in slide-in-from-bottom-4 hover:border-primary/30 hover:shadow-md"
                style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'both' }}
              >
                <CardContent className="pt-6">
                  <div className="relative mb-3 flex size-11 items-center justify-center transition-transform duration-300 group-hover:scale-110">
                    <span
                      className="absolute inset-0 animate-spin-slow rounded-full bg-[conic-gradient(from_0deg,transparent_25%,hsl(var(--primary)/0.3)_60%,hsl(var(--primary))_100%)]"
                      style={{ animationDuration: '3s' }}
                    />
                    <div className="relative z-10 flex size-9 items-center justify-center rounded-full bg-background">
                      <div className="flex size-full items-center justify-center rounded-full bg-primary/10">
                        <FontAwesomeIcon icon={icon} className="size-4 text-primary" />
                      </div>
                    </div>
                  </div>
                  <h3 className="mb-1 font-semibold">{title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
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

        {/* Our Story */}
        <div className="space-y-4">
          <h2 className="flex items-center gap-2 text-2xl font-semibold">
            <span className="inline-block size-2 animate-pulse rounded-full bg-primary" />
            The Story Behind Corgi Planning Poker
          </h2>
          <div className="space-y-4 rounded-xl border border-border/40 bg-muted/20 px-6 py-6">
            <p className="leading-relaxed text-muted-foreground">
              Like most agile teams, I started out using whatever free planning poker tool came up first in
              search. They worked great — until they didn&apos;t. One by one, the tools I relied on started
              rolling out paywalls: caps on how many sessions you could run per month, limits on room count,
              limits on how many people could vote, and the ability to customise your point values locked
              behind a subscription. For a practice that&apos;s supposed to be lightweight and collaborative,
              that felt like the wrong direction.
            </p>
            <p className="leading-relaxed text-muted-foreground">
              So I built one from scratch — permanently free, no artificial limits, and full control over
              your card deck so you can match the scale your team actually uses. The result is what
              you&apos;re using now.
            </p>
            <p className="leading-relaxed text-muted-foreground">
              The corgi theme is personal. I have a corgi at home named{' '}
              <a
                href="https://www.instagram.com/kimicorgi_?igsh=MWc4bjRneHg4NmdjaA=="
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline-offset-4 hover:underline"
              >
                Kimi
              </a>{' '}
              — and naming a side project after your dog is basically mandatory. Corgi Planning Poker
              started as a tool for my own team and a way to keep sharpening my skills, and it continues
              to grow in both directions.
            </p>
            <p className="text-sm italic text-muted-foreground/70">— Raksit, builder &amp; corgi dad</p>
          </div>
        </div>

        {/* FAQ */}
        <div className="space-y-6">
          <h2 className="flex items-center gap-2 text-2xl font-semibold">
            <span className="inline-block size-2 animate-pulse rounded-full bg-primary" />
            Frequently Asked Questions
          </h2>
          <div className="divide-y divide-border overflow-hidden rounded-xl border">
            {FAQS.map(({ q, a }) => (
              <div
                key={q}
                className="group cursor-default px-5 py-4 transition-colors duration-200 hover:bg-primary/5"
              >
                <h3 className="font-semibold transition-colors duration-200 group-hover:text-primary">
                  {q}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{a}</p>
              </div>
            ))}
            <div className="group cursor-default px-5 py-4 transition-colors duration-200 hover:bg-primary/5">
              <h3 className="font-semibold transition-colors duration-200 group-hover:text-primary">
                What is the difference between story points and hours?
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                Story points measure relative effort and complexity rather than clock time. A
                5-point story is roughly twice as complex as a 2-point story for <em>your</em> team,
                but the actual hours vary by person. Using story points removes pressure to commit
                to specific durations and focuses the conversation on scope and risk instead.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Open Source */}
      <section className="mx-auto max-w-[1100px] pb-4">
        <div className="flex flex-col gap-6 rounded-2xl border border-primary/20 bg-primary/5 px-8 py-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faCodeBranch} className="size-4 text-primary" />
              <p className="text-lg font-semibold">This app is open source</p>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Found a bug or have an idea for improvement? Open an issue on GitHub. Want to
              contribute code? Pull requests are welcome — check the repo for contribution
              guidelines.
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            <a
              href="https://github.com/raksitnongbua/planning-poker/issues/new"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-primary/40 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/20"
            >
              <FontAwesomeIcon icon={faBolt} className="size-3" />
              Open an Issue
            </a>
            <a
              href="https://github.com/raksitnongbua/planning-poker/pulls"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <FontAwesomeIcon icon={faCodeBranch} className="size-3" />
              Contribute via PR
            </a>
          </div>
        </div>
      </section>

      {/* Explore More */}
      <section className="mx-auto max-w-[1100px] pb-24">
        <h2 className="mb-6 flex items-center gap-2 text-2xl font-semibold">
          <span className="inline-block size-2 animate-pulse rounded-full bg-primary" />
          Explore More
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link href="/scrum-poker" className="group flex flex-col gap-2 rounded-xl border border-border/40 bg-muted/20 p-5 transition-all duration-200 hover:border-primary/40 hover:bg-primary/5">
            <p className="font-semibold transition-colors group-hover:text-primary">Scrum Poker Online</p>
            <p className="text-sm text-muted-foreground">Run real-time scrum poker sessions with your agile team.</p>
          </Link>
          <Link href="/agile-estimation" className="group flex flex-col gap-2 rounded-xl border border-border/40 bg-muted/20 p-5 transition-all duration-200 hover:border-primary/40 hover:bg-primary/5">
            <p className="font-semibold transition-colors group-hover:text-primary">Agile Estimation Tool</p>
            <p className="text-sm text-muted-foreground">Estimate user stories collaboratively using proven agile techniques.</p>
          </Link>
          <Link href="/story-points-estimator" className="group flex flex-col gap-2 rounded-xl border border-border/40 bg-muted/20 p-5 transition-all duration-200 hover:border-primary/40 hover:bg-primary/5">
            <p className="font-semibold transition-colors group-hover:text-primary">Story Points Estimator</p>
            <p className="text-sm text-muted-foreground">Calculate story points as a team with simultaneous card reveal.</p>
          </Link>
          <Link href="/sprint-planning" className="group flex flex-col gap-2 rounded-xl border border-border/40 bg-muted/20 p-5 transition-all duration-200 hover:border-primary/40 hover:bg-primary/5">
            <p className="font-semibold transition-colors group-hover:text-primary">Sprint Planning Poker</p>
            <p className="text-sm text-muted-foreground">Make sprint planning faster and more collaborative.</p>
          </Link>
          <Link href="/blog" className="group flex flex-col gap-2 rounded-xl border border-border/40 bg-muted/20 p-5 transition-all duration-200 hover:border-primary/40 hover:bg-primary/5">
            <p className="font-semibold transition-colors group-hover:text-primary">Planning Poker Blog</p>
            <p className="text-sm text-muted-foreground">Guides on agile estimation, Fibonacci scales, and scrum best practices.</p>
          </Link>
        </div>
      </section>
    </>
  )
}

export default Home
