import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: { template: '%s | Corgi Planning Poker Blog', default: 'Blog | Corgi Planning Poker' },
  description:
    'Planning poker tips, agile estimation guides, and scrum best practices from the Corgi Planning Poker team.',
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-[800px] px-4 py-16">{children}</div>
}
