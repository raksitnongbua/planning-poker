import type { Metadata } from 'next'
import Link from 'next/link'
import { getLocale } from 'next-intl/server'

const translations = {
  en: {
    resources: 'Resources',
    blogTitle: 'Corgi Planning Poker Blog',
    blogSubtitle:
      'In-depth guides on planning poker, agile estimation, and scrum best practices — written by practitioners who build and use Corgi Planning Poker. New articles published regularly.',
    aboutTitle: 'About this blog',
    aboutContent:
      'We cover practical agile estimation topics — from the mechanics of planning poker to the psychology behind why Fibonacci scales work. Each article is written to be immediately actionable for scrum masters, product owners, and engineering teams running sprint planning sessions.',
    readArticle: 'Read article →',
    byAuthor: 'By Raksit Nongbua',
    articles: [
      {
        href: '/blog/how-to-make-story-points-effective',
        title: 'How to Make Story Points Effective: Best Practices for Agile Teams',
        description:
          'Learn the essential practices to make story points work: using anchors, focusing on complexity over hours, and involving the whole team.',
        date: 'March 16, 2026',
      },
      {
        href: '/blog/handling-outliers-in-planning-poker',
        title: 'Advanced Planning Poker: Handling Outliers and Deadlocks',
        description:
          'Stuck between a 2 and a 13? Learn advanced facilitation techniques to handle disagreement, break deadlocks, and keep your planning sessions moving.',
        date: 'March 15, 2026',
      },
      {
        href: '/blog/why-we-built-corgi-planning-poker',
        title: "Why We Built Corgi Planning Poker (And Why It's Free)",
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
    ],
  },
  th: {
    resources: 'แหล่งเรียนรู้',
    blogTitle: 'บล็อก Corgi Planning Poker',
    blogSubtitle:
      'คู่มือเจาะลึกการประเมินงานแบบ Agile และแนวทางปฏิบัติของ Scrum — เขียนโดยผู้ใช้งานจริงที่ร่วมสร้าง Corgi Planning Poker อัปเดตบทความใหม่ๆ อย่างต่อเนื่อง',
    aboutTitle: 'เกี่ยวกับบล็อกนี้',
    aboutContent:
      'เรารวบรวมหัวข้อการประเมินงาน Agile ที่นำไปใช้ได้จริง ตั้งแต่กลไกของ Planning Poker ไปจนถึงจิตวิทยาเบื้องหลังลำดับเลข Fibonacci ทุกบทความถูกเขียนขึ้นเพื่อให้ Scrum Master, Product Owner และทีมวิศวกรนำไปปรับใช้ในการวางแผนสปริ้นท์ได้ทันที',
    readArticle: 'อ่านบทความ →',
    byAuthor: 'โดย รักษิต หนองบัว',
    articles: [
      {
        href: '/blog/how-to-make-story-points-effective',
        title: 'วิธีใช้ Story Points ให้มีประสิทธิภาพ: แนวทางปฏิบัติที่ดีที่สุดสำหรับทีม Agile',
        description:
          'รวบรวมแนวทางที่จะทำให้ Story Points เวิร์กสำหรับทีมคุณจริงๆ ตั้งแต่การสร้างงานอ้างอิง ไปจนถึงการเลิกเทียบเป็นชั่วโมง',
        date: '16 มีนาคม 2026',
      },
      {
        href: '/blog/handling-outliers-in-planning-poker',
        title: 'เทคนิค Planning Poker ขั้นสูง: วิธีจัดการเมื่อคะแนนไม่เท่ากันและหาข้อสรุปไม่ได้',
        description:
          'โหวตแล้วคะแนนโดดไปมาหาข้อสรุปไม่ได้ใช่ไหม? เรียนรู้เทคนิคการจัดการความเห็นต่างและวิธีทำลายทางตันเพื่อให้การประชุมเดินหน้าต่อได้',
        date: '15 มีนาคม 2026',
      },
      {
        href: '/blog/why-we-built-corgi-planning-poker',
        title: 'ทำไมเราถึงสร้าง Corgi Planning Poker (และทำไมมันถึงฟรีตลอดไป)',
        description:
          'เรื่องราวที่มาของ Corgi Planning Poker — จากความหงุดหงิดกับเครื่องมือที่ไม่ฟรี สู่การสร้างแอปที่ใช้งานง่ายและไม่มีข้อจำกัดเพื่อทีม Agile ทุกคน',
        date: '14 มีนาคม 2026',
      },
      {
        href: '/blog/how-planning-poker-works',
        title: 'Planning Poker คืออะไร? คู่มือฉบับสมบูรณ์สำหรับทีม Agile',
        description:
          'เรียนรู้กลไกของ Planning Poker ทำไมทีม Scrum ทั่วโลกถึงเลือกใช้ และวิธีจัดเซสชันการประเมินงานให้มีประสิทธิภาพแบบทีละขั้นตอน',
        date: '15 มกราคม 2026',
      },
      {
        href: '/blog/planning-poker-fibonacci',
        title: 'ทำไม Planning Poker ถึงใช้เลข Fibonacci? (และเมื่อไหร่ควรใช้ชุดเลขอื่น)',
        description:
          'เจาะลึกจิตวิทยาเบื้องหลังลำดับเลข Fibonacci ในการประเมินงาน ทำไมความไม่แน่นอนถึงแปรผันตามความซับซ้อน และชุดเลขไหนที่เหมาะกับทีมคุณที่สุด',
        date: '1 กุมภาพันธ์ 2026',
      },
      {
        href: '/blog/story-points-vs-hours',
        title: 'Story Points vs Hours: ทีมของคุณควรใช้อะไรดี?',
        description:
          'การถกเถียงที่เป็นอมตะในวงการ Agile — ควรเลือกใช้แต้มหรือชั่วโมงดี? เจาะลึกข้อดีข้อเสียของแต่ละแนวทาง และวิธีเปลี่ยนผ่านหากทีมต้องการ',
        date: '15 กุมภาพันธ์ 2026',
      },
    ],
  },
}

export const metadata: Metadata = {
  title: 'Blog — Agile Estimation & Planning Poker Guides',
  description:
    'Practical guides on planning poker, story points, sprint planning, and agile estimation. Written for scrum teams who want better estimation practices.',
  alternates: {
    canonical: 'https://www.corgiplanningpoker.com/blog',
  },
}

export default async function BlogPage() {
  const locale = (await getLocale()) as 'en' | 'th'
  const t = translations[locale]

  return (
    <>
      <div className="mb-12">
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
          {t.resources}
        </p>
        <h1 className="text-2xl font-bold tracking-tight">{t.blogTitle}</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t.blogSubtitle}</p>
      </div>

      <div className="mb-8 rounded-xl border border-border/40 bg-muted/20 p-5">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-widest text-muted-foreground/60">
          {t.aboutTitle}
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">{t.aboutContent}</p>
      </div>

      <div className="flex flex-col gap-5">
        {t.articles.map((article) => (
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
            <p className="text-xs text-muted-foreground">{t.byAuthor}</p>
            <Link
              href={article.href}
              className="mt-3 inline-block text-xs font-semibold text-primary transition-opacity hover:opacity-80"
            >
              {t.readArticle}
            </Link>
          </article>
        ))}
      </div>
    </>
  )
}
