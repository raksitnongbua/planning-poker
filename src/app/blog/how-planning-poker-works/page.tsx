import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'How Planning Poker Works: A Complete Guide',
  description:
    'Learn how planning poker works, why agile teams use it, and how to run an effective session with your scrum team.',
  alternates: {
    canonical: 'https://www.corgiplanningpoker.com/blog/how-planning-poker-works',
  },
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'How Planning Poker Works: A Complete Guide for Agile Teams',
  author: { '@type': 'Person', name: 'Raksit Nongbua', url: 'https://github.com/raksitnongbua' },
  publisher: {
    '@type': 'Organization',
    name: 'Corgi Planning Poker',
    url: 'https://www.corgiplanningpoker.com',
  },
  datePublished: '2026-01-15',
  dateModified: '2026-02-10',
  url: 'https://www.corgiplanningpoker.com/blog/how-planning-poker-works',
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
      name: 'How Planning Poker Works',
      item: 'https://www.corgiplanningpoker.com/blog/how-planning-poker-works',
    },
  ],
}

export default function HowPlanningPokerWorksPage() {
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
            January 15, 2026 &middot; By Raksit Nongbua
          </p>
          <h1 className="text-2xl font-bold tracking-tight">
            How Planning Poker Works: A Complete Guide for Agile Teams
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Planning poker is one of the most widely adopted estimation techniques in agile
            software development. On the surface it looks like a simple card game, but its design
            encodes decades of research on group decision-making, cognitive bias, and the psychology
            of uncertainty. If you have ever sat through an estimation meeting that turned into a
            two-hour argument or produced numbers nobody believed, planning poker is the antidote.
            This guide walks through what it is, where it came from, how to run a session, and what
            to watch out for.
          </p>
        </header>

        <section className="mb-8">
          <h2 className="mb-3 mt-8 text-xl font-semibold">The Origins of Planning Poker</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Planning poker was introduced by James Grenning in 2002 in an article titled{' '}
            <em>Planning Poker or How to Avoid Analysis Paralysis while Release Planning</em>. At
            the time, Grenning was looking for a way to make release planning faster and more
            accurate without devolving into the familiar pattern of one or two dominant voices
            setting all the estimates.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            The technique gained wide recognition when Mike Cohn included it in his influential 2005
            book <em>Agile Estimating and Planning</em>. Cohn refined the practice, popularised the
            use of the Fibonacci-inspired card deck, and helped codify planning poker as a standard
            tool in the Scrum practitioner's toolkit. Today it is used by software teams worldwide, from two-person startups to enterprise engineering
            organisations with hundreds of developers.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            The name itself is a deliberate nod to poker. Both games involve hidden information
            revealed simultaneously — and that simultaneous reveal is the single most important
            design choice in the whole technique, as we will explore below.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 mt-8 text-xl font-semibold">
            How a Planning Poker Session Works Step by Step
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Running a planning poker session is straightforward once you understand the rhythm. Here
            is a detailed breakdown of each step.
          </p>

          <div className="mt-5 flex flex-col gap-5">
            <div className="rounded-xl border border-border/40 p-5">
              <p className="mb-1 text-xs font-bold uppercase tracking-widest text-primary">
                Step 1
              </p>
              <p className="mb-2 text-sm font-semibold">Gather the team and the backlog</p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                The product owner, scrum master, and all development team members join the session.
                Everyone needs a set of estimation cards — either physical cards or a digital tool
                like Corgi Planning Poker. The product owner comes prepared with the user stories
                that need to be estimated, ideally with acceptance criteria already written.
              </p>
            </div>

            <div className="rounded-xl border border-border/40 p-5">
              <p className="mb-1 text-xs font-bold uppercase tracking-widest text-primary">
                Step 2
              </p>
              <p className="mb-2 text-sm font-semibold">Read and discuss the story</p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                The product owner reads out the user story and answers clarifying questions. This
                phase is crucial. Estimates are only as accurate as the team's shared understanding
                of the work. Good questions at this stage include: What does "done" look like? Are
                there known technical risks? Does this touch any legacy systems? The goal is not to
                exhaustively design a solution, but to reach a common mental model of the scope.
              </p>
            </div>

            <div className="rounded-xl border border-border/40 p-5">
              <p className="mb-1 text-xs font-bold uppercase tracking-widest text-primary">
                Step 3
              </p>
              <p className="mb-2 text-sm font-semibold">Each estimator privately selects a card</p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Once discussion winds down, every team member independently selects the card they
                think best represents the relative effort for the story. Cards stay face-down (or
                hidden in a digital tool). No one announces their estimate yet. This private
                selection step is where individual judgment forms, free from the influence of
                others.
              </p>
            </div>

            <div className="rounded-xl border border-border/40 p-5">
              <p className="mb-1 text-xs font-bold uppercase tracking-widest text-primary">
                Step 4
              </p>
              <p className="mb-2 text-sm font-semibold">Reveal simultaneously</p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                All estimators flip their cards at the same time. This is the poker moment. When
                all estimates agree or are close, the team picks a value and moves on quickly. When
                estimates diverge significantly — say, a 2 and a 13 on the same story — those
                outliers hold the real information. The person who estimated highest and the person
                who estimated lowest are asked to explain their reasoning.
              </p>
            </div>

            <div className="rounded-xl border border-border/40 p-5">
              <p className="mb-1 text-xs font-bold uppercase tracking-widest text-primary">
                Step 5
              </p>
              <p className="mb-2 text-sm font-semibold">Discuss outliers and re-estimate</p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                After hearing the outlier rationale, the team discusses briefly. The high estimator
                may have spotted a hidden dependency. The low estimator may have a shortcut the
                others hadn't considered. These conversations often surface assumptions that were
                never made explicit. After discussion, the team votes again. This cycle repeats
                until consensus is reached, typically within two or three rounds.
              </p>
            </div>

            <div className="rounded-xl border border-border/40 p-5">
              <p className="mb-1 text-xs font-bold uppercase tracking-widest text-primary">
                Step 6
              </p>
              <p className="mb-2 text-sm font-semibold">Record the estimate and move on</p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Once consensus is reached, record the story point value against the backlog item and
                advance to the next story. A well-run session can estimate 10–15 stories per hour.
                If a single story consumes more than 10 minutes, it is usually a sign the story
                needs to be split or the acceptance criteria need more work — not a reason to keep
                estimating.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 mt-8 text-xl font-semibold">
            Why Simultaneous Card Reveal Matters
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            The simultaneous reveal is not a gimmick. It directly addresses two well-documented
            cognitive biases that plague sequential estimation: anchoring and groupthink.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            <strong className="font-semibold text-foreground">Anchoring bias</strong> occurs when
            the first number stated in a negotiation or discussion acts as a psychological anchor
            that pulls all subsequent estimates toward it. Research by Tversky and Kahneman in 1974
            demonstrated that people adjust insufficiently from an initial anchor even when they
            know it is arbitrary. In a traditional meeting, the first person to say "I think this
            is a 5" effectively sets the range of the whole conversation. Planning poker eliminates
            this by ensuring no estimate is revealed until all estimates are formed.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            <strong className="font-semibold text-foreground">Groupthink</strong> is the tendency
            for teams to converge on a shared view in order to maintain harmony and avoid conflict,
            often at the expense of critical thinking. In estimation, this means junior developers
            defer to the tech lead, or everyone adjusts their view once they see the project manager
            nodding at a particular number. Simultaneous reveal forces every team member to commit
            to an independent judgment before seeing others' views, producing genuinely diverse
            estimates when the story has genuine ambiguity.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            The result is that planning poker surfaces disagreement that would otherwise be
            suppressed. That disagreement is valuable — it reveals different mental models of the
            work, which when reconciled, lead to better estimates and fewer late-sprint surprises.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 mt-8 text-xl font-semibold">Choosing the Right Card Deck</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            The card deck you use shapes how your team thinks about estimation. There is no single
            right answer, but here are the most common options and when each works best.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            <strong className="font-semibold text-foreground">Fibonacci sequence</strong> (1, 2, 3,
            5, 8, 13, 21) is the most popular choice. The gaps between values grow as numbers
            increase, which reflects the reality that large stories carry more uncertainty and that
            false precision in high estimates is misleading. Estimating a story as 19 rather than 21
            implies a level of accuracy that does not exist. See our dedicated article on{' '}
            <Link href="/blog/planning-poker-fibonacci" className="text-primary hover:opacity-80">
              why planning poker uses Fibonacci numbers
            </Link>{' '}
            for a deeper treatment.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            <strong className="font-semibold text-foreground">T-shirt sizes</strong> (XS, S, M, L,
            XL) are useful for early discovery or roadmap-level estimation where a team is trying
            to size epics rather than individual stories. They remove the temptation to equate
            numbers with hours, which is especially helpful when stakeholders are in the room.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            <strong className="font-semibold text-foreground">Powers of 2</strong> (1, 2, 4, 8, 16,
            32) provide even wider gaps than Fibonacci and work well for teams doing rough capacity
            planning across quarters.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Beyond number cards, most decks include a{' '}
            <strong className="font-semibold text-foreground">? card</strong> for "I don't have
            enough information to estimate," an{' '}
            <strong className="font-semibold text-foreground">infinity card</strong> for "this story
            is too large to estimate and needs to be split," and a{' '}
            <strong className="font-semibold text-foreground">coffee cup card</strong> to call for a
            break. These non-numeric cards carry as much information as any number and should be
            treated seriously rather than jokingly.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 mt-8 text-xl font-semibold">
            Common Planning Poker Mistakes (and How to Avoid Them)
          </h2>

          <div className="mt-4 flex flex-col gap-4">
            <div>
              <p className="mb-1 text-sm font-semibold">
                1. Estimating tasks instead of user stories
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Story points measure the complexity and effort of delivering a slice of user value,
                not a technical subtask. When teams break work down to the task level before
                estimating, they lose the ability to use velocity meaningfully. Estimate stories at
                the level where a user can recognise the value delivered.
              </p>
            </div>

            <div>
              <p className="mb-1 text-sm font-semibold">
                2. Letting the product owner dominate the discussion
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                The product owner answers questions and clarifies requirements but should not
                estimate. Their job is to define what, not how much. When product owners express
                opinions about effort ("this should be easy"), they inadvertently anchor the team's
                estimates.
              </p>
            </div>

            <div>
              <p className="mb-1 text-sm font-semibold">3. Equating story points with hours</p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                This is the most common mistake and arguably the most damaging. Story points are
                relative, not absolute. A 5-point story is not "five hours of work." The moment a
                team starts thinking in hours, the estimate becomes a commitment rather than a
                forecast, and the psychological pressure to hit estimates overrides the cognitive
                benefits of relative sizing. For a full treatment of this topic, read our article on{' '}
                <Link href="/blog/story-points-vs-hours" className="text-primary hover:opacity-80">
                  story points vs hours
                </Link>
                .
              </p>
            </div>

            <div>
              <p className="mb-1 text-sm font-semibold">
                4. Skipping stories after the first vote converges
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                When the first round of estimates all agree, teams are tempted to skip discussion
                entirely. Occasionally, unanimous agreement simply means everyone is equally
                uncertain. A quick ten-second gut-check — "does everyone feel genuinely confident
                about this?" — costs almost nothing and catches the stories where false consensus is
                masking hidden risk.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 mt-8 text-xl font-semibold">
            Planning Poker Online vs In-Person
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Planning poker was originally designed for co-located teams with physical card decks.
            Today, the majority of agile teams are distributed or hybrid, and online planning poker
            tools have become the default. Digital tools offer several advantages over physical
            cards that are worth naming explicitly.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            The simultaneous reveal is easier to enforce online. With physical cards, someone can
            peek or reveal early. A well-designed online tool locks all estimates until every
            participant has voted and then reveals them all at once.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Statistics are surfaced automatically. After a reveal, a good tool shows the average,
            the spread, and who voted what — giving the facilitator immediate data about where
            disagreement lies without manual counting.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Remote participants are first-class citizens. In a hybrid meeting where some people are
            in a room and some are on video, physical cards exclude remote participants. An online
            tool treats every participant identically regardless of location.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            History is preserved. Online sessions keep a record of estimates, which is invaluable
            for retrospectives and for comparing estimated vs actual velocity over time.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Corgi shows the vote average, spread, and every individual vote the moment the
            facilitator triggers a reveal — no manual counting, no whiteboard tallying needed.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-3 mt-8 text-xl font-semibold">Start Your Next Session</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Planning poker is effective precisely because it is simple. The rules are easy to learn,
            sessions run fast when facilitated well, and the simultaneous reveal consistently
            surfaces the information a team needs to make good decisions. Whether you are
            onboarding a new team to agile estimation or looking to improve the quality of an
            existing process, a well-run planning poker session is one of the highest-return
            investments you can make in sprint reliability.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Ready to run a session? Corgi Planning Poker is free, requires no account, and your
            room is ready in seconds.
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
            href="/scrum-poker"
            className="text-muted-foreground transition-colors hover:text-primary"
          >
            Scrum Poker
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
