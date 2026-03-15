'use client'

import Link from 'next/link'
import { useLocale } from 'next-intl'

const translations = {
  en: {
    backToBlog: '← Back to Blog',
    publishedBy: 'March 16, 2026 · By Raksit Nongbua',
    title: 'How to Make Story Points Effective: Best Practices for Agile Teams',
    intro:
      'Story points are a powerful tool for agile teams, but they are often misunderstood or misapplied. When done right, they provide a reliable way to forecast velocity and plan sprints without the pressure of absolute time commitments. When done wrong, they become a source of frustration and confusion. This guide covers the best practices to make story points work for your team.',
    sections: [
      {
        title: '1. Establish a Strong Baseline (Anchor Story)',
        content: [
          'The most common mistake is starting without a reference point. To make story points effective, your team needs an "Anchor Story" — a piece of work that everyone understands and agrees on its size.',
          'Find a story that is "medium" in complexity (e.g., a 5 or an 8) that the team has recently completed. Use this as your yardstick. Every new story should be estimated by comparing it to this anchor: "Is this bigger or smaller than our anchor story?"',
        ],
      },
      {
        title: '2. Focus on Effort, Complexity, and Risk',
        content: [
          'A story point is a holistic measure. It should account for three factors:',
          '• Effort: How much work is there to do?',
          '• Complexity: How difficult is the work?',
          '• Risk/Uncertainty: How much do we NOT know about this work?',
          'If a story has low effort but high risk, its point value should increase to reflect that uncertainty.',
        ],
      },
      {
        title: '3. Never Equate Points to Hours',
        content: [
          'The moment you say "1 point = 8 hours," you have lost the benefit of relative sizing. Story points are about volume of work, not duration. Different developers work at different speeds, but the complexity of the task remains the same.',
          'Velocity (the number of points completed per sprint) will naturally bridge the gap between points and time over several cycles.',
        ],
      },
      {
        title: 'The Power of a Stable Velocity: A Success Story',
        content: [
          'Imagine a team that has been using story points for 5 sprints. Their velocity has stabilized at an average of 30 points per sprint. During a planning session, a stakeholder asks: "When will the new dashboard feature be ready?"',
          'Instead of guessing dates and feeling pressured, the team looks at the dashboard backlog, which totals 90 story points. They can confidently answer: "It will be ready in exactly 3 sprints (6 weeks)." because they have the data to back it up.',
          'Benefits of this maturity include:',
          '• Accurate Forecasting: No more missing deadlines or broken promises.',
          '• Scope Management: If a new "urgent" 10-point task is added, the team knows they must remove 10 points of other work to stay on track.',
          '• Sustainable Pace: The team works without burnout because they never commit to more than their proven capacity.',
        ],
      },
      {
        title: 'External Resources & References',
        content: [
          'To deepen your understanding of effective estimation, we recommend these industry-standard resources:',
        ],
        links: [
          { label: 'Mountain Goat Software: Why use Story Points?', href: 'https://www.mountaingoatsoftware.com/blog/what-are-story-points' },
          { label: 'Scrum.org: The Three Pillars of Empirical Process Control', href: 'https://www.scrum.org/resources/blog/three-pillars-empiricism-scrum' },
          { label: 'Agile Alliance: Story Points Definition', href: 'https://www.agilealliance.org/glossary/story-pointing/' }
        ]
      }
    ],
    bottomLine: {
      title: 'Conclusion',
      p1: 'Effective story pointing takes practice and consistency. By using anchors, focusing on complexity over hours, and involving the whole team, you will build a predictable velocity that makes planning a breeze.',
      cta: 'Start estimating with best practices',
    },
    footerLinks: {
      allArticles: '← All Articles',
      outliers: 'Handling Outliers',
      fibonacci: 'Why Fibonacci?',
    },
    author: {
      bio: 'Raksit is the creator of Corgi Planning Poker. He advocates for sustainable agile practices and builds tools that help teams focus on delivering value instead of managing overhead.',
      viewGithub: 'View on GitHub',
    },
  },
  th: {
    backToBlog: '← กลับสู่บล็อก',
    publishedBy: '16 มีนาคม 2026 · โดย รักษิต หนองบัว',
    title: 'วิธีใช้ Story Points ให้มีประสิทธิภาพ: แนวทางปฏิบัติที่ดีที่สุดสำหรับทีม Agile',
    intro:
      'Story Points เป็นเครื่องมือที่ทรงพลังมากสำหรับทีม Agile แต่บ่อยครั้งมักถูกเข้าใจผิดหรือนำไปใช้ผิดวิธี หากใช้อย่างถูกต้อง มันจะเป็นวิธีที่ช่วยให้ทีมพยากรณ์งาน (Forecast) ได้อย่างแม่นยำโดยไม่ต้องกดดันเรื่องเวลาทำงานจริง แต่ถ้าใช้ผิด มันจะกลายเป็นบ่อเกิดของความสับสน คู่มือนี้รวบรวมแนวทางที่จะทำให้ Story Points เวิร์กสำหรับทีมคุณจริงๆ',
    sections: [
      {
        title: '1. สร้าง "งานอ้างอิง" (Anchor Story) ที่แข็งแรง',
        content: [
          'ข้อผิดพลาดที่พบบ่อยที่สุดคือการเริ่มประเมินโดยไม่มีจุดอ้างอิง ทีมของคุณต้องการ "Anchor Story" หรือ "งานครู" ซึ่งเป็นงานที่ทุกคนในทีมเข้าใจตรงกันว่ามีความยากระดับไหน',
          'ลองหางานที่เพิ่งทำเสร็จไปและทุกคนเห็นตรงกันว่ามีความซับซ้อนระดับ "ปานกลาง" (เช่น 5 หรือ 8 แต้ม) ใช้ชิ้นนี้เป็นไม้บรรทัด งานชิ้นใหม่ๆ ทั้งหมดควรถูกประเมินโดยเทียบกับงานชิ้นนี้: "งานนี้ใหญ่กว่าหรือเล็กกว่างานอ้างอิงของเรา?"',
        ],
      },
      {
        title: '2. โฟกัสที่ แรงงาน, ความซับซ้อน และความเสี่ยง',
        content: [
          'Story Point คือการวัดภาพรวม ซึ่งต้องคำนึงถึง 3 ปัจจัยหลัก:',
          '• Effort (แรงงาน): ปริมาณงานที่ต้องทำมีมากแค่ไหน?',
          '• Complexity (ความซับซ้อน): เนื้องานมีความยากหรือซับซ้อนเพียงใด?',
          '• Risk/Uncertainty (ความเสี่ยง): มีสิ่งที่เรา "ไม่รู้" เกี่ยวกับงานนี้มากแค่ไหน?',
          'หากงานชิ้นหนึ่งดูเหมือนจะใช้แรงน้อย แต่มีความไม่แน่นอนสูง (Risk) คะแนนประเมินควรจะสูงขึ้นเพื่อสะท้อนความเสี่ยงนั้น',
        ],
      },
      {
        title: '3. ห้ามเทียบ Story Points เป็นชั่วโมงเด็ดขาด',
        content: [
          'วินาทีที่คุณบอกว่า "1 แต้ม = 8 ชั่วโมง" คุณจะสูญเสียข้อดีของการประเมินแบบสัมพัทธ์ทันที Story Points คือเรื่องของ "ปริมาณงาน" ไม่ใช่ "ระยะเวลา" นักพัฒนาแต่ละคนมีความเร็วต่างกัน แต่ความซับซ้อนของเนื้องานยังคงเท่าเดิม',
          'Velocity (จำนวนแต้มที่ทำเสร็จต่อสปริ้นท์) จะเป็นตัวเชื่อมช่องว่างระหว่าง "แต้ม" และ "เวลา" ให้คุณเองเมื่อผ่านไปหลายๆ รอบสปริ้นท์',
        ],
      },
      {
        title: 'พลังของ Velocity ที่เสถียร: กรณีศึกษาจากสถานการณ์จริง',
        content: [
          'ลองจินตนาการถึงทีมที่ใช้ Story Points ต่อเนื่องมา 5 สปริ้นท์ จนค่า Velocity เริ่มนิ่งอยู่ที่เฉลี่ย 30 แต้มต่อสปริ้นท์ ในระหว่างการประชุม Stakeholder ถามว่า: "ฟีเจอร์ Dashboard ใหม่จะเสร็จเมื่อไหร่?"',
          'แทนที่จะต้องเดาสุ่มวันที่ภายใต้ความกดดัน ทีมเปิดดูรายการงาน Dashboard ที่ประเมินไว้รวม 90 แต้ม พวกเขาสามารถตอบได้อย่างมั่นใจว่า: "จะเสร็จในอีก 3 สปริ้นท์ (6 สัปดาห์) พอดีครับ" เพราะพวกเขามีข้อมูลจริงในอดีตมายืนยัน',
          'ประโยชน์เมื่อทีมเข้าสู่สภาวะนี้คือ:',
          '• การพยากรณ์ที่แม่นยำ: บอกลาปัญหาการส่งงานไม่ทันหรือการผิดคำสัญญา',
          '• การจัดการขอบเขตงาน: หากมีงานด่วนขนาด 10 แต้มแทรกเข้ามา ทีมจะรู้ทันทีว่าต้องเอางานอื่นออก 10 แต้ม เพื่อให้ยังคงแผนเดิมไว้ได้',
          '• การทำงานที่ยั่งยืน: ทีมทำงานได้โดยไม่เกิดภาวะ Burnout เพราะไม่ได้รับงานเกินกำลังที่ทำได้จริง',
        ],
      },
      {
        title: 'แหล่งข้อมูลอ้างอิงเพิ่มเติม',
        content: [
          'เพื่อความเข้าใจที่ลึกซึ้งยิ่งขึ้นเกี่ยวกับการประเมินงาน เราขอแนะนำแหล่งข้อมูลมาตรฐานระดับสากลดังนี้:',
        ],
        links: [
          { label: 'Mountain Goat Software: Story Points คืออะไร? โดย Mike Cohn', href: 'https://www.mountaingoatsoftware.com/blog/what-are-story-points' },
          { label: 'Scrum.org: เสาหลัก 3 ประการของ Scrum', href: 'https://www.scrum.org/resources/blog/three-pillars-empiricism-scrum' },
          { label: 'Agile Alliance: คำนิยามของ Story Pointing', href: 'https://www.agilealliance.org/glossary/story-pointing/' }
        ]
      }
    ],
    bottomLine: {
      title: 'บทสรุป',
      p1: 'การประเมิน Story Points ให้เก่งต้องอาศัยการฝึกฝนและความสม่ำเสมอ การใช้งานอ้างอิง การโฟกัสที่ความซับซ้อนแทนชั่วโมง และการดึงทุกคนในทีมมาร่วมตัดสินใจ จะช่วยให้ทีมของคุณเห็นภาพรวมงานได้ชัดเจนและวางแผนได้แม่นยำขึ้นมากครับ',
      cta: 'เริ่มประเมินงานตามแนวทางที่ดีที่สุด',
    },
    footerLinks: {
      allArticles: '← บทความทั้งหมด',
      outliers: 'การจัดการความเห็นต่าง',
      fibonacci: 'ทำไมต้อง Fibonacci?',
    },
    author: {
      bio: 'รักษิต คือผู้สร้าง Corgi Planning Poker เขาเป็นผู้สนับสนุนแนวทาง Agile ที่ยั่งยืนและสร้างเครื่องมือเพื่อช่วยให้ทีมโฟกัสที่การส่งมอบคุณค่ามากกว่าการจัดการงานเอกสารที่ซับซ้อน',
      viewGithub: 'ดูบน GitHub',
    },
  },
}

export default function EffectiveStoryPointsPage() {
  const locale = useLocale() as 'en' | 'th'
  const t = translations[locale]

  return (
    <>
      <Link
        href="/blog"
        className="mb-8 inline-block text-sm text-muted-foreground transition-colors hover:text-primary"
      >
        {t.backToBlog}
      </Link>

      <article>
        <header className="mb-10">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
            {t.publishedBy}
          </p>
          <h1 className="text-2xl font-bold tracking-tight">{t.title}</h1>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{t.intro}</p>
        </header>

        {t.sections.map((section, idx) => (
          <section key={idx} className="mb-8">
            <h2 className="mb-3 mt-8 text-xl font-semibold">{section.title}</h2>
            {section.content?.map((p, pIdx) => (
              <p key={pIdx} className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {p}
              </p>
            ))}
            {section.links && (
              <ul className="mt-4 flex flex-col gap-3">
                {section.links.map((link, lIdx) => (
                  <li key={lIdx} className="text-sm">
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline-offset-4 hover:underline"
                    >
                      {link.label} ↗
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}

        <section className="mb-10">
          <h2 className="mb-3 mt-8 text-xl font-semibold">{t.bottomLine.title}</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">{t.bottomLine.p1}</p>
          <Link
            href="/new-room"
            className="mt-6 inline-block rounded-md bg-primary px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90"
          >
            {t.bottomLine.cta}
          </Link>
        </section>

        <footer className="mt-12 flex flex-wrap gap-4 border-t border-border/40 pt-8 text-sm">
          <Link href="/blog" className="text-muted-foreground transition-colors hover:text-primary">
            {t.footerLinks.allArticles}
          </Link>
          <Link
            href="/blog/handling-outliers-in-planning-poker"
            className="text-muted-foreground transition-colors hover:text-primary"
          >
            {t.footerLinks.outliers}
          </Link>
          <Link
            href="/blog/planning-poker-fibonacci"
            className="text-muted-foreground transition-colors hover:text-primary"
          >
            {t.footerLinks.fibonacci}
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
            {t.author.bio}{' '}
            <a
              href="https://github.com/raksitnongbua"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline-offset-4 hover:underline"
            >
              {t.author.viewGithub}
            </a>
          </p>
        </div>
      </div>
    </>
  )
}
