import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Why We Built Corgi Planning Poker (And Why It\'s Free)',
  description:
    'The origin story of Corgi Planning Poker — how frustration with paywalled free tools, a love of corgis, and a desire to build something genuinely useful led to this app.',
  alternates: {
    canonical: 'https://www.corgiplanningpoker.com/blog/why-we-built-corgi-planning-poker',
  },
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Why We Built Corgi Planning Poker (And Why It\'s Free)',
  author: { '@type': 'Person', name: 'Raksit Nongbua', url: 'https://github.com/raksitnongbua' },
  publisher: {
    '@type': 'Organization',
    name: 'Corgi Planning Poker',
    url: 'https://www.corgiplanningpoker.com',
  },
  datePublished: '2026-03-14',
  dateModified: '2026-03-14',
  url: 'https://www.corgiplanningpoker.com/blog/why-we-built-corgi-planning-poker',
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
      name: 'Blog',
      item: 'https://www.corgiplanningpoker.com/blog',
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'Why We Built Corgi Planning Poker',
      item: 'https://www.corgiplanningpoker.com/blog/why-we-built-corgi-planning-poker',
    },
  ],
}

export default function WhyWeBuiltCorgiPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <Link
        href="/blog"
        className="mb-8 inline-block text-sm text-muted-foreground transition-colors hover:text-primary"
      >
        &larr; Back to Blog
      </Link>

      <article>
        <header className="mb-10">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
            March 14, 2026 &middot; By Raksit Nongbua
          </p>
          <h1 className="text-2xl font-bold tracking-tight">
            Why We Built Corgi Planning Poker (And Why It&apos;s Free)
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Most software is built to solve a problem someone else already has. This one was built
            to solve a problem I ran into myself — on a Tuesday afternoon, mid-sprint, when the
            planning poker tool my team had been using for months suddenly asked us to upgrade to
            continue. Here is how Corgi Planning Poker came to exist.
          </p>
        </header>

        <section className="mb-8">
          <h2 className="mb-3 mt-8 text-xl font-semibold">It Started With Frustration</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            For a long time, my team used free planning poker tools without thinking much about
            them. They were good enough. We&apos;d share a link, everyone would join, we&apos;d vote,
            reveal, discuss, and move on. It was exactly as lightweight as{' '}
            <Link href="/blog/how-planning-poker-works" className="text-primary hover:opacity-80">
              planning poker is supposed to be
            </Link>
            .
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Then the tools started changing. First it was subtle — a banner here, a prompt there.
            Then the limitations arrived in earnest:
          </p>
          <ul className="mt-4 flex flex-col gap-2 text-sm leading-relaxed text-muted-foreground">
            <li className="flex gap-2">
              <span className="mt-0.5 shrink-0 text-primary">&#8594;</span>
              <span>A cap on how many sessions you could run per month on the free tier.</span>
            </li>
            <li className="flex gap-2">
              <span className="mt-0.5 shrink-0 text-primary">&#8594;</span>
              <span>A limit on how many rooms you could create or keep active at once.</span>
            </li>
            <li className="flex gap-2">
              <span className="mt-0.5 shrink-0 text-primary">&#8594;</span>
              <span>
                A cap on the number of participants who could vote — fine for two-person startups,
                but a real problem for a team of eight or ten.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="mt-0.5 shrink-0 text-primary">&#8594;</span>
              <span>
                The ability to customise point values — locked. If your team uses a scale that
                doesn&apos;t match the preset Fibonacci deck, you&apos;d need to pay to change it.
              </span>
            </li>
          </ul>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            None of these restrictions are surprising from a business model perspective. But they
            are frustrating from a user perspective. Planning poker is supposed to reduce friction
            in sprint planning, not introduce new friction of its own. Every time a team hits a
            paywall mid-session, it undermines the whole point.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 mt-8 text-xl font-semibold">The Decision to Build It Myself</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            I&apos;m a software engineer. When a tool I rely on starts working against me, my
            natural instinct is to look at what it would take to replace it. Planning poker is not
            a technically complex problem: you need a room, a websocket connection, a way to hide
            votes until everyone has submitted, and a reveal mechanism. It is a great project for
            exploring real-time systems without the complexity of something like a collaborative
            document editor.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            So I built it. The backend is in Go — chosen for its concurrency model and small memory
            footprint when managing many simultaneous websocket connections. The frontend is
            Next.js. The whole thing runs without requiring an account: a guest identity is
            assigned automatically via a cookie, so you can create a room and share the link in
            under ten seconds.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            The constraints I set for myself were simple: no session limits, no room limits, no
            voter count limits, full control over{' '}
            <Link href="/blog/planning-poker-fibonacci" className="text-primary hover:opacity-80">
              your card deck and point scale
            </Link>
            , and permanently free. Not free-with-a-catch. Just free.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 mt-8 text-xl font-semibold">Why a Corgi?</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            I have a corgi at home named Kimi. If you have never spent time around a corgi, the
            short description is: relentlessly enthusiastic, surprisingly capable, and always making
            the people around them happier than they were before. That felt like a reasonable set of
            values for a planning tool.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Kimi has her own Instagram at{' '}
            <a
              href="https://www.instagram.com/kimicorgi_?igsh=MWc4bjRneHg4NmdjaA=="
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline-offset-4 hover:underline"
            >
              @kimicorgi_
            </a>{' '}
            and has been a source of daily distraction and joy throughout the development of this
            app. Naming the project after her was the easiest product decision I&apos;ve made.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 mt-8 text-xl font-semibold">What It Has Become</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            What started as a quick side project for my own team has grown into something I
            actively maintain and continue improving. Features I&apos;ve added since the first version
            include spectator mode (so product owners and stakeholders can observe without voting),
            Google sign-in to sync identity across devices, recent room history, a custom deck
            builder with favourites, round activity history, and a steadily improving mobile
            experience.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            The project is open source. The full source code is on{' '}
            <a
              href="https://github.com/raksitnongbua/planning-poker"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline-offset-4 hover:underline"
            >
              GitHub
            </a>
            . If you find a bug, open an issue. If you want to improve something, submit a pull
            request. The project exists to serve the people who use it, and contributions from
            those people make it better faster than I can alone.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 mt-8 text-xl font-semibold">Why It Will Stay Free</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            The reason I built this was that I was tired of free tools that quietly became
            not-free. I have no intention of doing the same thing. There are no paid plans, no
            advertisements, and no data sold to third parties. The app collects only what is
            necessary to make rooms work: a guest ID stored in a cookie, and — if you sign in with
            Google — your name and profile picture for display in the room.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Hosting costs for a tool at this scale are modest. The project is funded by nothing
            more than the time I choose to put into it. That&apos;s a sustainable model for a tool
            that does one focused thing well.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-3 mt-8 text-xl font-semibold">Try It With Your Team</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            If your current planning poker tool has started asking you for a credit card, or if
            you&apos;ve never tried it at all, Corgi Planning Poker takes about ten seconds to get
            started. No account, no trial, no limits.
          </p>
          <Link
            href="/new-room"
            className="mt-6 inline-block rounded-md bg-primary px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90"
          >
            Create a free room
          </Link>
        </section>

        <footer className="mt-12 flex flex-wrap gap-4 border-t border-border/40 pt-8 text-sm">
          <Link href="/blog" className="text-muted-foreground transition-colors hover:text-primary">
            &larr; All Articles
          </Link>
          <Link
            href="/blog/how-planning-poker-works"
            className="text-muted-foreground transition-colors hover:text-primary"
          >
            How Planning Poker Works
          </Link>
          <Link
            href="/blog/planning-poker-fibonacci"
            className="text-muted-foreground transition-colors hover:text-primary"
          >
            Why Fibonacci?
          </Link>
          <Link
            href="/blog/story-points-vs-hours"
            className="text-muted-foreground transition-colors hover:text-primary"
          >
            Story Points vs Hours
          </Link>
        </footer>
      </article>

      {/* Author Bio */}
      <div className="mt-12 flex items-start gap-4 rounded-xl border border-border/40 bg-muted/20 p-5">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/20 text-sm font-bold text-primary">
          R
        </div>
        <div>
          <p className="text-sm font-semibold">Raksit Nongbua</p>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            Raksit is the creator of Corgi Planning Poker and a software engineer who has facilitated
            planning poker sessions with distributed agile teams. He builds tools to make collaborative
            estimation faster and less painful.{' '}
            <a
              href="https://github.com/raksitnongbua"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline-offset-4 hover:underline"
            >
              View on GitHub
            </a>
          </p>
        </div>
      </div>
    </>
  )
}
