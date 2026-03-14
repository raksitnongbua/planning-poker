import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Raksit Nongbua — Author | Corgi Planning Poker Blog',
  description:
    'Raksit Nongbua is the creator of Corgi Planning Poker and author of guides on agile estimation, planning poker, and scrum best practices.',
  alternates: {
    canonical: 'https://www.corgiplanningpoker.com/blog/author/raksit-nongbua',
  },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.corgiplanningpoker.com' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://www.corgiplanningpoker.com/blog' },
    { '@type': 'ListItem', position: 3, name: 'Raksit Nongbua', item: 'https://www.corgiplanningpoker.com/blog/author/raksit-nongbua' },
  ],
}

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Raksit Nongbua',
  url: 'https://www.corgiplanningpoker.com/blog/author/raksit-nongbua',
  sameAs: ['https://github.com/raksitnongbua'],
  jobTitle: 'Software Engineer',
  worksFor: {
    '@type': 'Organization',
    name: 'Corgi Planning Poker',
    url: 'https://www.corgiplanningpoker.com',
  },
  knowsAbout: ['Agile estimation', 'Planning poker', 'Scrum', 'Software engineering', 'Next.js', 'Go'],
}

const ARTICLES = [
  {
    title: 'How Planning Poker Works: A Complete Guide for Agile Teams',
    href: '/blog/how-planning-poker-works',
    description: 'A step-by-step breakdown of the planning poker technique, its origins, and how to run an effective session.',
    date: 'January 15, 2026',
  },
  {
    title: 'Why Planning Poker Uses Fibonacci Numbers (And When to Use Other Scales)',
    href: '/blog/planning-poker-fibonacci',
    description: 'The cognitive psychology behind Fibonacci estimation and a practical guide to choosing the right card deck for your team.',
    date: 'February 1, 2026',
  },
  {
    title: 'Story Points vs Hours: Which Should Your Team Use?',
    href: '/blog/story-points-vs-hours',
    description: 'A balanced comparison of relative and absolute estimation approaches, with a guide for teams transitioning between them.',
    date: 'February 15, 2026',
  },
]

export default function AuthorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <div className="space-y-10">
        {/* Back link */}
        <Link href="/blog" className="text-sm text-muted-foreground transition-colors hover:text-primary">
          ← Back to Blog
        </Link>

        {/* Author profile */}
        <div className="flex items-start gap-5">
          <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-primary/20 text-2xl font-bold text-primary">
            R
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">Raksit Nongbua</h1>
            <p className="text-sm text-muted-foreground">Software Engineer · Creator of Corgi Planning Poker</p>
            <div className="flex gap-4">
              <a
                href="https://github.com/raksitnongbua"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary underline-offset-4 hover:underline"
              >
                GitHub
              </a>
              <a
                href="mailto:tan.raksit@gmail.com"
                className="text-sm text-primary underline-offset-4 hover:underline"
              >
                Contact
              </a>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-3 border-l-2 border-primary pl-5">
          <p className="text-sm leading-relaxed text-muted-foreground">
            Raksit is a software engineer and the creator of Corgi Planning Poker — a free,
            open-source online planning poker tool used by agile teams around the world. He
            built Corgi to solve the friction of running planning poker sessions with distributed
            teams: no account creation, no per-seat licensing, no ads, just a shareable link and
            real-time voting.
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            He writes about agile estimation, planning poker technique, and the practical
            realities of running sprint planning with remote teams. His articles focus on
            actionable guidance for scrum masters, product owners, and engineers who run
            estimation sessions regularly.
          </p>
        </div>

        {/* Articles */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Articles</h2>
          <div className="divide-y divide-border overflow-hidden rounded-xl border border-border/40">
            {ARTICLES.map(({ title, href, description, date }) => (
              <Link
                key={href}
                href={href}
                className="group block px-5 py-4 transition-colors hover:bg-primary/5"
              >
                <p className="font-semibold transition-colors group-hover:text-primary">{title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{description}</p>
                <p className="mt-2 text-xs text-muted-foreground/60">{date}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-5 text-center">
          <p className="text-sm text-muted-foreground">
            Corgi Planning Poker is open source.{' '}
            <a
              href="https://github.com/raksitnongbua/planning-poker"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline-offset-4 hover:underline"
            >
              View the source on GitHub
            </a>{' '}
            or{' '}
            <Link href="/new-room" className="text-primary underline-offset-4 hover:underline">
              start a free planning poker room
            </Link>
            .
          </p>
        </div>
      </div>
    </>
  )
}
