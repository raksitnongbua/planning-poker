import type { Metadata } from 'next'
import Link from 'next/link'
import { getLocale } from 'next-intl/server'

export const metadata: Metadata = {
  title: 'Free Scrum Poker Online',
  description: 'Run free scrum poker sessions online with your agile team. Real-time voting, Fibonacci cards, no registration required. Start in under 30 seconds.',
  alternates: {
    canonical: 'https://www.corgiplanningpoker.com/scrum-poker',
  },
  keywords: 'scrum poker, scrum poker online, planning poker, free scrum poker, online scrum poker, agile estimation',
}

const translations = {
  en: {
    breadcrumb: { home: 'Home', current: 'Scrum Poker Online' },
    hero: {
      title: 'Free Scrum Poker Online',
      subtitle: 'Run fast, focused scrum poker sessions with your agile team — real-time voting, Fibonacci cards, and zero friction. No account needed.',
      cta: 'Start Scrum Poker →'
    },
    whatIs: {
      title: 'What is Scrum Poker?',
      p1: 'Scrum poker — also called planning poker — is a consensus-based agile estimation technique used during sprint planning and backlog refinement. Each team member privately selects a card representing their effort estimate for a user story or task, then all cards are revealed simultaneously. This simultaneous reveal is the key mechanic: it prevents anchoring, the cognitive bias where the first number heard in a meeting pulls everyone else’s estimate toward it.',
      p2: 'The terms "scrum poker" and "planning poker" are used interchangeably across the industry. Strictly speaking, planning poker is the name coined by James Grenning in 2002 and later popularised by Mike Cohn in Agile Estimating and Planning. "Scrum poker" emerged as a colloquial shorthand because the technique is most commonly used inside Scrum ceremonies — specifically sprint planning and backlog grooming. Both terms refer to exactly the same practice.',
      p3: 'Card values almost always follow a Fibonacci-like sequence: 1, 2, 3, 5, 8, 13, 21. The increasing gaps between values reflect a fundamental truth about estimation — the larger a piece of work is, the less precisely we can estimate it. Using Fibonacci numbers forces the team to accept that distinction and avoid false precision on large stories. Many teams also include special cards: a "?" for "I have no idea", a coffee cup for "I need a break", and an infinity symbol for "this story is too large to estimate and must be split".',
      p4: 'Online scrum poker tools like Corgi Planning Poker replicate the physical card experience in a virtual environment — essential for remote and hybrid teams who cannot sit around a shared table. Everyone on the team picks their card privately, the facilitator triggers a reveal, and the results are shown to all participants simultaneously, preserving the anti-anchoring benefit of the original technique.'
    },
    howTo: {
      title: 'How to Run a Scrum Poker Session',
      subtitle: 'A simple, iterative workflow designed to build shared understanding and surface hidden risks.',
      steps: [
        { step: '1', title: 'Create a room', desc: 'Give your session a name, choose a card deck, and launch your room in seconds. No account required.' },
        { step: '2', title: 'Invite your team', desc: 'Share the link with your scrum team. Anyone with the link can join from any browser or device, including phones and tablets.' },
        { step: '3', title: 'Vote and reveal', desc: 'Each player selects a card privately. Reveal all votes at once to surface outliers, spark discussion, and lock in a consensus estimate.' }
      ]
    },
    whyCorgi: {
      title: 'Why Corgi for Scrum Poker?',
      subtitle: 'Designed to eliminate friction and keep your team focused on what matters: the conversation.',
      features: [
        { title: 'Real-time sync', desc: 'Votes update live across every screen the moment a card is selected — no page refresh needed.' },
        { title: 'No registration', desc: 'Start a session in under 30 seconds. Every visitor is auto-assigned a guest identity so nothing blocks your planning flow.' },
        { title: 'Free forever', desc: 'No subscription, no trial period, no credit card. Corgi Planning Poker is completely free with no paid tiers.' },
        { title: 'Custom decks', desc: 'Use the default Fibonacci deck, T-shirt sizes, Powers of 2, or create a fully custom card set for your team.' }
      ]
    },
    explore: {
      title: 'Explore More',
      links: { home: 'Home', agile: 'Agile Estimation Tool', story: 'Story Points Estimator', sprint: 'Sprint Planning Poker', create: 'Create a Room' }
    }
  },
  th: {
    breadcrumb: { home: 'หน้าหลัก', current: 'Scrum Poker ออนไลน์' },
    hero: {
      title: 'สครัมโป๊กเกอร์ออนไลน์ ใช้งานฟรี!',
      subtitle: 'เริ่มต้นเซสชันสครัมโป๊กเกอร์กับทีม Agile ของคุณได้ง่ายๆ — ลงคะแนนแบบเรียลไทม์ เลือกใช้การ์ด Fibonacci และเริ่มงานได้ทันทีโดยไม่ต้องสร้างบัญชี',
      cta: 'เริ่มใช้งานฟรี →'
    },
    whatIs: {
      title: 'Scrum Poker คืออะไร?',
      p1: 'Scrum Poker หรือที่เรียกกันว่า Planning Poker คือเทคนิคการประเมินงานแบบ Agile ที่ทีม Scrum นิยมใช้ในช่วงการวางแผนสปริ้นท์ (Sprint Planning) สมาชิกแต่ละคนจะเลือกการ์ดแสดงค่าประมาณของตัวเองแบบลับๆ แล้วเปิดพร้อมกันเพื่อลดผลกระทบจากการชี้นำความคิด (Anchoring Bias) ที่มักเกิดขึ้นเมื่อมีคนพูดตัวเลขออกมาเป็นคนแรก',
      p2: 'คำว่า "Scrum Poker" และ "Planning Poker" มักถูกใช้แทนกันได้ในวงการ โดย Planning Poker เป็นชื่อดั้งเดิมที่ James Grenning คิดค้นขึ้นในปี 2002 ส่วนชื่อ "Scrum Poker" กลายเป็นชื่อเรียกติดปากเพราะเทคนิคนี้ถูกนำมาใช้บ่อยที่สุดในกระบวนการของ Scrum นั่นเอง',
      p3: 'ในการประเมินงาน ทีมมักใช้ชุดการ์ด Fibonacci (1, 2, 3, 5, 8, 13, 21) เพื่อสะท้อนถึงความไม่แน่นอนของงานที่เพิ่มขึ้นตามขนาดของงาน และลดการถกเถียงในรายละเอียดที่เล็กเกินไป นอกจากนี้ยังมีการ์ดพิเศษอย่าง "?" สำหรับกรณีที่มีข้อมูลไม่เพียงพอ หรือ "∞" สำหรับงานที่ใหญ่เกินกว่าจะประเมินได้',
      p4: 'เครื่องมืออย่าง Corgi Planning Poker ช่วยให้ทีมสามารถทำเซสชันนี้ได้ผ่านระบบออนไลน์ ซึ่งเหมาะมากสำหรับทีมที่ทำงานแบบ Remote หรือ Hybrid โดยทุกคนยังคงได้รับประสบการณ์การลงคะแนนแบบลับๆ และเปิดผลพร้อมกันเหมือนนั่งอยู่ในห้องประชุมเดียวกัน'
    },
    howTo: {
      title: 'วิธีการจัดเซสชัน Scrum Poker',
      subtitle: 'ขั้นตอนการประเมินงานที่เรียบง่ายแต่ทรงพลัง เพื่อให้ทีมเห็นขอบเขตงานตรงกัน',
      steps: [
        { step: '1', title: 'สร้างห้องประเมิน', desc: 'ตั้งชื่อห้อง เลือกชุดการ์ดที่ต้องการ แล้วสร้างห้องเสร็จภายในไม่กี่วินาที ไม่ต้องลงทะเบียน' },
        { step: '2', title: 'เชิญทีมของคุณ', desc: 'แชร์ลิงก์ให้ทีมของคุณ ทุกคนสามารถเข้าร่วมได้ทันทีผ่านเบราว์เซอร์จากทุกอุปกรณ์' },
        { step: '3', title: 'ลงคะแนนและเปิดผล', desc: 'สมาชิกแต่ละคนเลือกการ์ดแบบลับๆ แล้วเปิดพร้อมกันเพื่ออภิปรายความเห็นที่แตกต่างและสรุปผลร่วมกัน' }
      ]
    },
    whyCorgi: {
      title: 'ทำไมต้องเลือก Corgi Planning Poker?',
      subtitle: 'เครื่องมือที่ถูกออกแบบมาเพื่อลดความยุ่งยากและโฟกัสที่การทำงานร่วมกันอย่างแท้จริง',
      features: [
        { title: 'อัปเดตแบบเรียลไทม์', desc: 'ทุกการลงคะแนนจะแสดงผลบนหน้าจอของทุกคนทันทีโดยไม่ต้องรีเฟรช' },
        { title: 'ไม่ต้องลงทะเบียน', desc: 'เริ่มการประเมินได้ในเวลาไม่ถึง 30 วินาที ระบบจะกำหนดตัวตนชั่วคราวให้คุณโดยอัตโนมัติ' },
        { title: 'ใช้งานฟรีตลอดไป', desc: 'ไม่มีค่าสมาชิก ไม่มีการทดลองใช้ และไม่มีข้อจำกัดจำนวนห้องหรือผู้ใช้งาน' },
        { title: 'ปรับแต่งชุดการ์ดได้เอง', desc: 'เลือกใช้ Fibonacci, T-shirt sizes หรือสร้างชุดการ์ดที่เหมาะกับทีมของคุณได้เอง' }
      ]
    },
    explore: {
      title: 'สำรวจเพิ่มเติม',
      links: { home: 'หน้าหลัก', agile: 'เครื่องมือ Agile Estimation', story: 'คำนวณ Story Points', sprint: 'Sprint Planning Poker', create: 'สร้างห้องเลย' }
    }
  }
}

export default async function ScrumPokerPage() {
  const locale = (await getLocale()) as 'en' | 'th'
  const t = translations[locale]

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: t.breadcrumb.home,
        item: 'https://www.corgiplanningpoker.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: t.breadcrumb.current,
        item: 'https://www.corgiplanningpoker.com/scrum-poker',
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="mx-auto max-w-[1100px] px-4 py-16 space-y-20">
        {/* Hero */}
        <section className="space-y-6">
          <div className="space-y-4 max-w-[680px]">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">{t.hero.title}</h1>
            <p className="text-lg leading-relaxed text-muted-foreground">{t.hero.subtitle}</p>
          </div>
          <div className="relative inline-block">
            <div className="absolute inset-[-4px] animate-pulse rounded-lg bg-primary/40 blur-xl" style={{ animationDuration: '2s' }} />
            <div className="relative overflow-hidden rounded-md">
              <span className="pointer-events-none absolute inset-0 z-10 animate-shine bg-gradient-to-r from-transparent via-white/30 to-transparent" style={{ animationDuration: '3s' }} />
              <Link
                href="/new-room"
                className="relative inline-flex h-11 w-52 items-center justify-center rounded-md bg-primary px-6 text-sm font-semibold text-primary-foreground transition-transform duration-200 hover:scale-[1.03] hover:shadow-lg hover:shadow-primary/40"
              >
                {t.hero.cta}
              </Link>
            </div>
          </div>
        </section>

        {/* What is Scrum Poker? */}
        <section className="space-y-4">
          <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            <span className="inline-block size-2 rounded-full bg-primary" />
            {t.whatIs.title}
          </h2>
          <div className="space-y-3 border-l-2 border-primary pl-5">
            <p className="text-sm leading-relaxed text-muted-foreground">{t.whatIs.p1}</p>
            <p className="text-sm leading-relaxed text-muted-foreground">{t.whatIs.p2}</p>
            <p className="text-sm leading-relaxed text-muted-foreground">{t.whatIs.p3}</p>
            <p className="text-sm leading-relaxed text-muted-foreground">{t.whatIs.p4}</p>
          </div>
        </section>

        {/* How to play */}
        <section className="space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">{t.howTo.title}</h2>
            <p className="text-sm text-muted-foreground max-w-[600px]">{t.howTo.subtitle}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="absolute top-1/2 left-0 w-full h-px bg-border/40 -z-10 hidden md:block" />
            {t.howTo.steps.map((item) => (
              <div key={item.step} className="space-y-4 bg-background px-2">
                <div className="flex items-center gap-3">
                  <span className="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground shadow-lg shadow-primary/20">
                    {item.step}
                  </span>
                  <h3 className="font-semibold">{item.title}</h3>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Features Grid */}
        <section className="space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">{t.whyCorgi.title}</h2>
            <p className="text-sm text-muted-foreground max-w-[600px]">{t.whyCorgi.subtitle}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.whyCorgi.features.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-xl border border-border/40 p-6 transition-all duration-200 hover:border-primary/40 hover:bg-muted/10"
              >
                <h3 className="mb-2 font-semibold transition-colors group-hover:text-primary">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Explore More */}
        <section className="pt-10 border-t border-border/40">
          <h2 className="mb-6 text-sm font-semibold uppercase tracking-widest text-muted-foreground/60">
            {t.explore.title}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/" className="text-sm text-muted-foreground transition-colors hover:text-primary">
              {t.explore.links.home}
            </Link>
            <Link href="/agile-estimation" className="text-sm text-muted-foreground transition-colors hover:text-primary">
              {t.explore.links.agile}
            </Link>
            <Link href="/story-points-estimator" className="text-sm text-muted-foreground transition-colors hover:text-primary">
              {t.explore.links.story}
            </Link>
            <Link href="/sprint-planning" className="text-sm text-muted-foreground transition-colors hover:text-primary">
              {t.explore.links.sprint}
            </Link>
            <Link href="/new-room" className="text-sm font-semibold text-primary transition-opacity hover:opacity-80">
              {t.explore.links.create}
            </Link>
          </div>
        </section>
      </div>
    </>
  )
}
