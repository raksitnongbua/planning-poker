import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Planning Poker Blog — Agile Estimation Guides | Corgi Planning Poker',
  description:
    'In-depth guides on planning poker, agile estimation, and scrum best practices. Written by practitioners who build and use Corgi Planning Poker.',
  alternates: {
    canonical: 'https://www.corgiplanningpoker.com/blog',
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
      name: 'Blog',
      item: 'https://www.corgiplanningpoker.com/blog',
    },
  ],
}

const articles = [
  {
    href: '/blog/why-we-built-corgi-planning-poker',
    title: 'Why We Built Corgi Planning Poker (And Why It\'s Free)',
    description:
      'The origin story behind Corgi Planning Poker — how frustration with paywalled free tools, a love of corgis named Kimi, and a desire to build something genuinely useful led to this app.',
    date: 'March 14, 2026',
  },
  {
    href: '/blog/how-planning-poker-works',
    title: 'How Planning Poker Works: A Complete Guide for Agile Teams',
    description:
      'Learn how planning poker works, why agile teams use it, and how to run an effective estimation session step by step. Covers card decks, simultaneous reveal, and common pitfalls to avoid.',
    date: 'January 15, 2026',
  },
  {
    href: '/blog/planning-poker-fibonacci',
    title: 'Why Planning Poker Uses Fibonacci Numbers (And When to Use Other Scales)',
    description:
      'Understand the psychology behind the Fibonacci sequence in estimation, how uncertainty scales with complexity, and when T-shirt sizes or powers of 2 might serve your team better.',
    date: 'February 1, 2026',
  },
  {
    href: '/blog/story-points-vs-hours',
    title: 'Story Points vs Hours: Which Should Your Team Use?',
    description:
      'The eternal agile debate — story points or hours? Explore the trade-offs of each approach, why most agile teams prefer relative sizing, and how to transition your team if needed.',
    date: 'February 15, 2026',
  },
]

export default function BlogPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="mb-12">
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
          Resources
        </p>
        <h1 className="text-2xl font-bold tracking-tight">Corgi Planning Poker Blog</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          In-depth guides on planning poker, agile estimation, and scrum best practices — written by
          practitioners who build and use Corgi Planning Poker. New articles published regularly.
        </p>
      </div>

      <div className="mb-8 rounded-xl border border-border/40 bg-muted/20 p-5">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-widest text-muted-foreground/60">
          About this blog
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          We cover practical agile estimation topics — from the mechanics of planning poker to the
          psychology behind why Fibonacci scales work. Each article is written to be immediately
          actionable for scrum masters, product owners, and engineering teams running sprint
          planning sessions.
        </p>
      </div>

      <div className="flex flex-col gap-5">
        {articles.map((article) => (
          <article
            key={article.href}
            className="rounded-xl border border-border/40 p-6 transition-colors hover:border-primary/40"
          >
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
              {article.date}
            </p>
            <h2 className="mb-2 text-base font-semibold leading-snug">
              <Link href={article.href} className="transition-colors hover:text-primary">
                {article.title}
              </Link>
            </h2>
            <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
              {article.description}
            </p>
            <p className="text-xs text-muted-foreground">By Raksit Nongbua</p>
            <Link
              href={article.href}
              className="mt-3 inline-block text-xs font-semibold text-primary transition-opacity hover:opacity-80"
            >
              Read article &rarr;
            </Link>
          </article>
        ))}
      </div>
    </>
  )
}
