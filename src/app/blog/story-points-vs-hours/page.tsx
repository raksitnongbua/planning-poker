import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Story Points vs Hours: Which Should Your Team Use?',
  description:
    'Should your agile team estimate in story points or hours? Learn the pros and cons of each approach and when to use which.',
  alternates: {
    canonical: 'https://www.corgiplanningpoker.com/blog/story-points-vs-hours',
  },
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Story Points vs Hours: Which Should Your Team Use?',
  author: { '@type': 'Person', name: 'Raksit Nongbua', url: 'https://github.com/raksitnongbua' },
  publisher: {
    '@type': 'Organization',
    name: 'Corgi Planning Poker',
    url: 'https://www.corgiplanningpoker.com',
  },
  datePublished: '2026-02-15',
  dateModified: '2026-03-10',
  url: 'https://www.corgiplanningpoker.com/blog/story-points-vs-hours',
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
      name: 'Story Points vs Hours',
      item: 'https://www.corgiplanningpoker.com/blog/story-points-vs-hours',
    },
  ],
}

export default function StoryPointsVsHoursPage() {
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
            February 15, 2026 &middot; By Raksit Nongbua
          </p>
          <h1 className="text-2xl font-bold tracking-tight">
            Story Points vs Hours: Which Should Your Team Use?
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Few debates in agile circles run as long, or get as heated, as the question of story
            points versus hours. Both sides have well-reasoned arguments and practitioners who swear
            by their preferred approach. The reality is that neither is universally correct — the
            right choice depends on your team's size, maturity, client relationships, and what you
            are trying to achieve with estimation in the first place. This article lays out both
            approaches honestly, including the contexts where each one genuinely shines, so you can
            make an informed decision rather than following received wisdom.
          </p>
        </header>

        <section className="mb-8">
          <h2 className="mb-3 mt-8 text-xl font-semibold">What Are Story Points?</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Story points are a unit of measure for the relative effort, complexity, and risk
            involved in completing a user story. The key word is relative. A 5-point story is not
            five hours, five days, or any other absolute unit of time. It simply means the team
            believes this story is roughly five times as much work as a 1-point story, and somewhat
            less than an 8-point story.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Story points are inherently team-specific. A 5-point story for a senior team of eight
            engineers is a different absolute quantity of work than a 5-point story for a junior
            team of three. That is not a bug — it is a feature. Teams track their own velocity (how
            many points they complete per sprint) and use that baseline to forecast future sprints.
            The absolute scale does not matter as long as it is consistent within a team over time.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            This relative nature has an important practical benefit: story points do not get
            invalidated by changes in team composition. If a new engineer joins the team, the
            velocity will naturally adjust over a sprint or two rather than requiring a wholesale
            re-calibration of every estimate in the backlog. The estimation scale remains stable
            even as the team's absolute capacity changes.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 mt-8 text-xl font-semibold">What Is Hour-Based Estimation?</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Hour-based estimation is exactly what it sounds like: each story or task is given an
            estimate expressed in hours of work. A story might be estimated at eight hours, meaning
            the team expects it to consume roughly one developer-day of effort.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Hour estimates are absolute and, at least in theory, portable. A story estimated at
            eight hours should take roughly eight hours regardless of which developer implements it
            — although in practice this is rarely true, since different developers work at different
            speeds and have different levels of familiarity with different parts of the codebase.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            The appeal of hour estimation is its concreteness. Managers, clients, and stakeholders
            who are used to thinking in time-and-materials terms find hours immediately interpretable.
            "This feature will take 80 hours" translates directly into resource planning,
            scheduling, and budget calculations in ways that "this feature is 21 story points" does
            not.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 mt-8 text-xl font-semibold">
            Why Most Agile Teams Prefer Story Points
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            The majority of experienced agile teams settle on story points after experimenting with
            hours. Here are five reasons why.
          </p>

          <div className="mt-5 flex flex-col gap-4">
            <div>
              <p className="mb-1 text-sm font-semibold">
                1. Hours become commitments; points remain forecasts
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                When a developer says "this will take 8 hours," the estimate is heard as a promise.
                If the work takes 12 hours, someone has "gone over estimate." This turns estimation
                into a performance evaluation rather than a planning tool, which creates perverse
                incentives. Developers pad their estimates to protect themselves, or they cut
                corners to hit the number. Story points do not carry this baggage because they are
                not denominated in the same currency as deadlines and salaries.
              </p>
            </div>

            <div>
              <p className="mb-1 text-sm font-semibold">2. Teams are better at relative comparison</p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Research in cognitive psychology — including Kahneman and Tversky's foundational
                work on comparative judgment — show that humans are far better at comparative
                judgments than absolute ones. Asking "is this story bigger or smaller
                than that story?" is a question most developers can answer reliably. Asking "how
                many hours will this story take?" requires a confident prediction about the future
                that may depend on factors the developer cannot fully enumerate at planning time.
                Story points leverage our relative judgment strength instead of fighting our
                absolute judgment weakness.
              </p>
            </div>

            <div>
              <p className="mb-1 text-sm font-semibold">3. Velocity stabilises faster</p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                With story points, teams establish a stable velocity within three to five sprints
                that becomes a reliable forecasting tool. Hour-based estimates, by contrast, must
                account for meetings, code reviews, context switching, and other overhead that is
                difficult to predict at the story level. Teams using hours often find that their
                "actual hours" routinely exceed estimates by a significant margin, often 40–60% or
                more according to team retrospective data, even when the technical work itself is
                well understood, because the overhead is invisible at estimation time.
              </p>
            </div>

            <div>
              <p className="mb-1 text-sm font-semibold">
                4. Points focus discussion on complexity, not individual speed
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                When estimating in hours, teams often implicitly estimate for a specific person
                — "this will take Alice 4 hours but Bob 8 hours." This creates invisible
                dependencies and makes sprint planning awkward when workloads need to be
                redistributed. Story points describe the inherent difficulty of the work, which
                is a property of the story itself rather than the person implementing it.
              </p>
            </div>

            <div>
              <p className="mb-1 text-sm font-semibold">5. Re-estimation costs are lower</p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Backlogs evolve. Stories get refined, split, merged, and deprioritised. When
                estimates are in story points, a rough initial estimate remains useful even after
                significant refinement because the relative scale is self-calibrating. When
                estimates are in hours, even minor changes to the story definition often require
                a full re-estimate to avoid misleading capacity calculations.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 mt-8 text-xl font-semibold">
            When Hour Estimation Makes Sense
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Despite the advantages of story points, there are legitimate contexts where hour
            estimation is the correct tool.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            <strong className="font-semibold text-foreground">Billing clients on time and materials.</strong>{' '}
            If your team invoices clients based on hours worked, you need to track actual hours
            regardless of your estimation unit. In this context, estimating in hours provides a
            baseline for comparing estimated vs actual time, which feeds directly into pricing,
            staffing decisions, and client reporting. Story points, while useful for sprint
            planning, do not translate directly into invoice line items.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            <strong className="font-semibold text-foreground">Regulatory compliance and audits.</strong>{' '}
            Some industries — particularly government contracting, healthcare IT, and financial
            services — have audit requirements that mandate time tracking at the task level. In
            these contexts, hour estimates and actual hour logs are compliance artifacts, not just
            planning tools. Story points satisfy neither requirement.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            <strong className="font-semibold text-foreground">SLA contracts with defined response times.</strong>{' '}
            Service-level agreements that specify "bugs will be resolved within 48 hours" or
            "features will be delivered within two weeks" require the team to map work to calendar
            time. While story point velocity can inform this mapping, teams operating under strict
            SLAs often find it easier to maintain a parallel hour-based estimate for contractual
            commitments while using story points for internal planning.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            <strong className="font-semibold text-foreground">Very small teams or solo projects.</strong>{' '}
            Story points derive their power from team velocity — the statistical stability that
            comes from completing many stories over many sprints. A solo developer or a two-person
            team may find that tracking velocity in story points adds overhead without meaningfully
            improving forecast accuracy. For very small teams, estimating in hours and tracking
            actual time can be simpler and equally predictive.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 mt-8 text-xl font-semibold">Can You Use Both?</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Yes — and many mature teams do exactly this, using each metric for the purpose it is
            best suited to. The key is to keep the two systems separate and avoid creating
            conversion factors that implicitly tie points back to hours.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            A common pattern is to use story points for sprint planning, backlog prioritisation,
            and velocity tracking, while separately logging actual hours against tasks for billing
            or payroll purposes. The story point estimate answers "what fits in this sprint?" The
            hour log answers "what do we invoice this client for?"
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            The failure mode to watch for is when teams start calculating an "hours per point"
            conversion and using it in client-facing communications. This recreates all the
            drawbacks of hour estimation while adding the overhead of story points. If a stakeholder
            asks "how many hours is a story point?", the answer should be "that varies by sprint
            and depends on many factors" — not a fixed number.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 mt-8 text-xl font-semibold">
            How to Transition From Hours to Story Points
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Teams that have been estimating in hours for a long time sometimes find the transition
            to story points disorienting. Here is a four-step approach that makes the transition
            smoother.
          </p>

          <div className="mt-5 flex flex-col gap-4">
            <div className="rounded-xl border border-border/40 p-5">
              <p className="mb-1 text-xs font-bold uppercase tracking-widest text-primary">
                Step 1
              </p>
              <p className="mb-2 text-sm font-semibold">
                Establish a reference story as your baseline
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Find a recently completed story that most team members agree represents
                "medium" effort — not trivial but not large. Designate this story as a 5-point
                reference. All future estimates will be made relative to it. This anchors the scale
                in something the team already understands intuitively without requiring any
                conversion to hours.
              </p>
            </div>

            <div className="rounded-xl border border-border/40 p-5">
              <p className="mb-1 text-xs font-bold uppercase tracking-widest text-primary">
                Step 2
              </p>
              <p className="mb-2 text-sm font-semibold">
                Run two sprints in parallel estimation mode
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                For the first two sprints, estimate both in story points and in hours. Do not
                use the hours estimates for planning — use them only as a psychological safety net
                while the team builds confidence in the new system. After two sprints, drop the
                hour estimates and commit to story points only.
              </p>
            </div>

            <div className="rounded-xl border border-border/40 p-5">
              <p className="mb-1 text-xs font-bold uppercase tracking-widest text-primary">
                Step 3
              </p>
              <p className="mb-2 text-sm font-semibold">
                Resist the temptation to convert early velocity to hours
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                After the first sprint, someone will inevitably calculate "we completed 42 points
                and worked 320 hours, so each point is 7.6 hours." Shut this down firmly. Early
                velocity data is noisy and the calculation recreates exactly the problems you are
                trying to escape. Velocity stabilises after four to six sprints — until then, use
                it directionally, not as a conversion factor.
              </p>
            </div>

            <div className="rounded-xl border border-border/40 p-5">
              <p className="mb-1 text-xs font-bold uppercase tracking-widest text-primary">
                Step 4
              </p>
              <p className="mb-2 text-sm font-semibold">
                Communicate the change clearly to stakeholders
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Stakeholders who are used to receiving hour estimates may be uncomfortable with
                story points at first. Explain that the team is transitioning to a more accurate
                forecasting system, that velocity will be shared openly after each sprint, and that
                release date projections will be based on empirical velocity data rather than
                summed hour estimates. Most stakeholders care about delivery dates, not estimation
                units — once they see that story point velocity produces reliable forecasts, the
                transition acceptance follows naturally.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="mb-3 mt-8 text-xl font-semibold">The Bottom Line</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            For the majority of product teams doing sprint-based development, story points are the
            better estimation unit. They produce more honest conversations about complexity, resist
            the conversion of estimates into commitments, and enable more reliable velocity-based
            forecasting. The cognitive overhead of learning the system pays back quickly in reduced
            planning friction and improved forecast accuracy.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Use hours when external obligations genuinely require it — billing, compliance, or
            contractual commitments. In those cases, run hour tracking alongside story point
            planning, and resist the temptation to convert between them.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Whatever you choose, the act of estimating together as a team — discussing stories,
            surfacing assumptions, and reaching shared understanding — is more valuable than the
            number that results. A planning poker session that produces lively debate and surfaces
            hidden complexity is a success even if every estimate turns out to be wrong.
          </p>
          <Link
            href="/new-room"
            className="mt-6 inline-block rounded-md bg-primary px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90"
          >
            Start estimating with your team
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
            href="/sprint-planning"
            className="text-muted-foreground transition-colors hover:text-primary"
          >
            Sprint Planning
          </Link>
          <Link href="/blog/planning-poker-fibonacci" className="text-primary underline-offset-4 hover:underline">
            Why Planning Poker Uses Fibonacci Numbers
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
