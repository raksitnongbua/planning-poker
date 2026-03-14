import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Why Planning Poker Uses Fibonacci Numbers',
  description:
    'Understand why planning poker teams use the Fibonacci sequence for estimation and when to use T-shirt sizes or other scales instead.',
  alternates: {
    canonical: 'https://www.corgiplanningpoker.com/blog/planning-poker-fibonacci',
  },
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Why Planning Poker Uses Fibonacci Numbers (And When to Use Other Scales)',
  author: { '@type': 'Person', name: 'Raksit Nongbua', url: 'https://github.com/raksitnongbua' },
  publisher: {
    '@type': 'Organization',
    name: 'Corgi Planning Poker',
    url: 'https://www.corgiplanningpoker.com',
  },
  datePublished: '2026-02-01',
  dateModified: '2026-02-20',
  url: 'https://www.corgiplanningpoker.com/blog/planning-poker-fibonacci',
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
      name: 'Planning Poker Fibonacci',
      item: 'https://www.corgiplanningpoker.com/blog/planning-poker-fibonacci',
    },
  ],
}

export default function PlanningPokerFibonacciPage() {
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
            February 1, 2026 &middot; By Raksit Nongbua
          </p>
          <h1 className="text-2xl font-bold tracking-tight">
            Why Planning Poker Uses Fibonacci Numbers (And When to Use Other Scales)
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            If you have ever joined a planning poker session for the first time, the card deck looks
            odd. Why does it jump from 5 to 8, then from 8 to 13? Why not just use 1 through 10?
            The answer lies in a counterintuitive truth about human estimation: the more effort a
            task requires, the less precisely we can predict it. The Fibonacci sequence encodes that
            truth directly into the estimation tool, making it structurally harder for teams to
            claim false precision on large, uncertain work.
          </p>
        </header>

        <section className="mb-8">
          <h2 className="mb-3 mt-8 text-xl font-semibold">What Is the Fibonacci Sequence?</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            The Fibonacci sequence is a series of numbers where each value is the sum of the two
            preceding it: 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89 and so on, extending to
            infinity. It was described by the Italian mathematician Leonardo of Pisa (nicknamed
            Fibonacci) in his 1202 book <em>Liber Abaci</em>, though the pattern had been
            documented centuries earlier in Indian mathematics.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            The defining characteristic of the sequence is that the ratio between consecutive terms
            converges on approximately 1.618 — the golden ratio — as the numbers grow. This ratio
            appears throughout nature in spiral patterns, plant growth, and animal proportions. In
            planning poker, however, what matters is not the golden ratio but the growing gap
            between values. As you move up the scale, the distance between adjacent points
            increases, making it progressively harder to distinguish between consecutive values.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 mt-8 text-xl font-semibold">Why Fibonacci Works for Estimation</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            The core insight is that human estimation accuracy degrades as scope increases.
            Estimating whether a task takes one hour or two hours is reasonably tractable — you can
            reason about the specific steps involved. Estimating whether a large feature takes three
            weeks or four weeks is far less reliable, because at that scale there are too many
            unknowns, dependencies, and emergent complexities to reason about precisely.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            <strong className="font-semibold text-foreground">Uncertainty scales with complexity.</strong>{' '}
            When you choose between a 1-point story and a 2-point story, the difference is
            meaningful — you are describing work that is roughly twice as complex. When you are
            choosing between a 20-point story and a 21-point story, the difference is not
            meaningful. You cannot actually distinguish between those two effort levels in a piece
            of work that large. A linear scale from 1 to 21 creates the illusion of precision where
            none exists.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            <strong className="font-semibold text-foreground">
              Fibonacci forces natural grouping.
            </strong>{' '}
            When you can only choose 13 or 21 (not 14, 15, 16, 17, 18, 19, or 20), you are forced
            to make a coarser but more honest judgment: is this story solidly in the medium-large
            bucket or is it genuinely very large? That binary question is one most teams can answer
            reliably, whereas choosing from 13 distinct values between 13 and 21 produces
            meaningless distinctions.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            <strong className="font-semibold text-foreground">
              It discourages the precision illusion.
            </strong>{' '}
            When a stakeholder sees a story estimated at 7 story points on a linear scale, they
            often unconsciously think "so about 7 days." The Fibonacci scale disrupts this
            conversion by making the numbers non-intuitive as time units. It nudges teams and
            stakeholders back toward thinking in relative terms rather than absolute hours.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 mt-8 text-xl font-semibold">
            The Modified Planning Poker Fibonacci Scale
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            In practice, planning poker uses a modified Fibonacci sequence rather than the pure
            mathematical one. The standard planning poker deck looks like this:
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {['1', '2', '3', '5', '8', '13', '21', '34', '?', '∞', '☕'].map((card) => (
              <span
                key={card}
                className="flex h-10 w-8 items-center justify-center rounded-md border border-border/60 bg-secondary text-sm font-bold"
              >
                {card}
              </span>
            ))}
          </div>
          <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
            Notice a few things. The sequence starts at 1 rather than 0, because a story of zero
            effort should not be in the backlog. The 34 card is included as a signal that a story
            is very large but still theoretically estimable. In many teams, a 34-point story is
            an automatic trigger to break the story down before the next sprint.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            The three non-numeric cards deserve special attention. The{' '}
            <strong className="font-semibold text-foreground">? card</strong> means "I don't have
            enough information to estimate this story." When multiple team members play the ? card,
            it is a strong signal that the story needs more refinement before estimation is useful.
            Playing ? is not a failure — it is the correct response to an under-specified story.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            The <strong className="font-semibold text-foreground">infinity card</strong> (sometimes
            written as a very large number) means "this story is too large and too uncertain to
            estimate as a single unit." It is not a number but a request to split. If the whole
            team plays infinity, the story should go back to the product owner for decomposition.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            The <strong className="font-semibold text-foreground">coffee cup card</strong> is a
            request for a break. Estimation sessions that run too long without breaks produce
            declining estimate quality. The coffee cup acknowledges that humans are not estimation
            machines and that a five-minute break will improve the quality of subsequent estimates.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 mt-8 text-xl font-semibold">When to Use T-Shirt Sizes Instead</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            T-shirt sizes — XS, S, M, L, XL, and sometimes XXL — are an excellent alternative to
            Fibonacci for specific contexts. They strip away any lingering numerical intuition and
            make it nearly impossible for anyone to convert sizes into hours, which is their primary
            advantage.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            T-shirt sizing works best during early discovery and roadmap planning, when the team is
            trying to size epics or themes rather than individual user stories. At that level of
            abstraction, the precision of a Fibonacci scale is not just unnecessary — it is actively
            misleading. Saying an epic is "L" is more honest than saying it is "21 story points"
            when neither estimate will survive contact with actual implementation.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            T-shirt sizes are also valuable when non-technical stakeholders are present. Business
            stakeholders often do not have an intuitive sense of how story points map to effort, but
            everyone understands what "large" and "small" mean in relative terms. Using t-shirt
            sizes in mixed-audience sessions reduces the translation overhead and keeps conversation
            focused on priorities rather than point totals.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            The limitation of t-shirt sizes is that they are harder to aggregate into velocity
            metrics. If you need to track team velocity or forecast release dates, you will
            eventually need to map t-shirt sizes to numeric values — at which point the Fibonacci
            scale, or a team-specific mapping, becomes necessary.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 mt-8 text-xl font-semibold">Powers of 2</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            The powers-of-2 scale (1, 2, 4, 8, 16, 32) provides even wider gaps between values
            than Fibonacci and is favoured by teams doing coarse-grained capacity planning across
            quarters or program increments. Because each step doubles the previous value, the scale
            forces extremely honest acknowledgement of uncertainty at the high end — a 32-point
            story is literally 32 times the effort of a 1-point story, which in most team contexts
            should trigger an immediate decomposition conversation.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 mt-8 text-xl font-semibold">When to Use Hour-Based Estimation</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Hour-based estimation abandons relative sizing entirely and estimates in absolute time
            units. This is appropriate in some contexts — particularly when billing clients,
            complying with regulatory requirements, or managing fixed-price contracts where actual
            time commitment must be tracked. The significant downside is that hours correlate
            estimates to individual capacity rather than story complexity, which makes comparing
            velocity across team members or sprints much harder. See our full comparison in{' '}
            <Link href="/blog/story-points-vs-hours" className="text-primary hover:opacity-80">
              story points vs hours
            </Link>
            .
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            For a detailed comparison of story points and hours,{' '}
            <Link href="/blog/story-points-vs-hours" className="text-primary underline-offset-4 hover:underline">
              read our story points vs hours guide
            </Link>
            .
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 mt-8 text-xl font-semibold">Which Scale Should Your Team Use?</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            For most agile teams running sprint-level planning, the modified Fibonacci scale is the
            right default. It is widely understood, integrates naturally with story point velocity
            tracking, and its growing gaps keep estimation honest at every size level.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Use t-shirt sizes when you are working at the epic or theme level, when non-technical
            stakeholders are estimating, or when you want to completely remove the temptation to
            convert points to hours.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Use powers of 2 if your team tends to inflate estimates and you want structural pressure
            to decompose stories more aggressively.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Use hours only when external constraints require absolute time tracking. If you choose
            hours, be deliberate about separating estimation sessions from commitment conversations,
            since the natural tendency is for hourly estimates to become promises.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Whatever scale you choose, consistency matters more than perfection. A team that uses
            the same scale for six sprints and builds a velocity baseline will produce more reliable
            forecasts than a team that switches scales frequently in search of the optimal approach.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-3 mt-8 text-xl font-semibold">Try Different Scales with Your Team</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Corgi Planning Poker supports Fibonacci, T-shirt sizes, powers of 2, and custom decks.
            You can experiment with different scales in different sessions to find what works best
            for your team's context and communication style.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Try running one session with the Fibonacci scale and one with T-shirt sizes on the same
            set of stories — the difference in team conversation is immediately apparent.
          </p>
          <Link
            href="/new-room"
            className="mt-6 inline-block rounded-md bg-primary px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90"
          >
            Start a free planning poker room
          </Link>
        </section>

        <footer className="mt-12 flex flex-wrap gap-4 border-t border-border/40 pt-8 text-sm">
          <Link href="/blog" className="text-muted-foreground transition-colors hover:text-primary">
            &larr; All Articles
          </Link>
          <Link
            href="/story-points-estimator"
            className="text-muted-foreground transition-colors hover:text-primary"
          >
            Story Points Estimator
          </Link>
          <Link
            href="/agile-estimation"
            className="text-muted-foreground transition-colors hover:text-primary"
          >
            Agile Estimation
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
