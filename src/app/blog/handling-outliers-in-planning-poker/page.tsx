import type { Metadata } from 'next'
import Link from 'next/link'
import { getLocale } from 'next-intl/server'

const translations = {
  en: {
    backToBlog: '← Back to Blog',
    publishedBy: 'March 15, 2026 · By Raksit Nongbua',
    title: 'Advanced Planning Poker: Handling Outliers and Deadlocks',
    intro:
      'The goal of planning poker is consensus, but what happens when the team is stuck? When one person sees a 2 and another sees a 13, or when three rounds of voting produce no movement, the session can feel like a waste of time. This guide explores advanced facilitation techniques to handle outliers, break deadlocks, and keep your planning sessions productive.',
    sections: [
      {
        title: 'The Value of the Outlier',
        content: [
          'First, it is important to reframe how the team views disagreement. A wide gap in estimates is not a failure of the process — it is the process working exactly as intended. The gap is a signal that information is asymmetric. Someone knows something the others do not.',
          'Instead of viewing an outlier as a "problem to be fixed," view it as a "source of hidden requirements." The goal of the discussion is not to pressure the outlier to change their mind, but to surface the assumptions that led to their number.',
        ],
      },
      {
        title: 'Techniques for Handling Disagreement',
        bullets: [
          {
            title: 'The "High-Low" Discussion',
            desc: 'The standard approach: ask the person with the highest estimate and the person with the lowest estimate to explain their reasoning. Pro-tip: let the low estimator speak first. They often have a simple solution in mind that others overlooked. Then let the high estimator explain the risks or complexities they spotted.',
          },
          {
            title: 'Identify "Hidden Work"',
            desc: 'Often, a high estimate comes from a team member including work that others assumed was out of scope (e.g., unit tests, documentation, refactoring). Ask: "What is included in your 8 that might not be in their 3?" This clarifies the Definition of Done in real-time.',
          },
          {
            title: 'The Three-Round Limit',
            desc: 'If the team cannot reach consensus after three rounds of voting and discussion, you have hit a deadlock. Continuing to vote usually produces frustration rather than accuracy. It is time to use a deadlock-breaking strategy.',
          },
        ],
      },
      {
        title: 'How to Break a Deadlock',
        content: [
          'When you are stuck, choose one of these three paths:',
          '1. Pick the higher estimate: If the gap is small (e.g., between 5 and 8) and time is running out, default to the higher number. It is safer to over-estimate complexity than to under-estimate it.',
          '2. Split the story: A deadlock is often a sign that the story is too large or contains too many unknowns. Stop estimating, split the story into two smaller pieces, and estimate those instead.',
          '3. Assign a "Spike": If the team genuinely does not have enough information to choose a number, do not guess. Create a "Spike" (a time-boxed research task) for the next sprint to gather the necessary data, and defer the estimation of the story until the spike is complete.',
        ],
      },
    ],
    bottomLine: {
      title: 'Conclusion',
      p1: 'Disagreement in planning poker is where the real value lies. By handling outliers with curiosity rather than pressure, and having a clear strategy for breaking deadlocks, you ensure that your estimation sessions remain a tool for shared understanding, not just a source of numbers.',
      cta: 'Run an advanced session now',
    },
    footerLinks: {
      allArticles: '← All Articles',
      howItWorks: 'How Planning Poker Works',
      fibonacci: 'Why Fibonacci?',
    },
    author: {
      bio: 'Raksit is the creator of Corgi Planning Poker and a software engineer who has facilitated hundreds of planning sessions. He builds tools to make team collaboration more effective and less painful.',
      viewGithub: 'View on GitHub',
    },
  },
  th: {
    backToBlog: '← กลับสู่บล็อก',
    publishedBy: '15 มีนาคม 2026 · โดย รักษิต หนองบัว',
    title: 'เทคนิค Planning Poker ขั้นสูง: วิธีจัดการเมื่อคะแนนไม่เท่ากันและหาข้อสรุปไม่ได้',
    intro:
      'เป้าหมายของ Planning Poker คือการหาข้อสรุปที่ทุกคนเห็นพ้องร่วมกัน (Consensus) แต่จะเกิดอะไรขึ้นถ้าทีมติดหล่ม? เมื่อคนหนึ่งให้ 2 แต่อีกคนให้ 13 หรือเมื่อโหวตไปสามรอบแล้วคะแนนก็ยังไม่ขยับ เซสชันนั้นอาจเริ่มดูเหมือนการเสียเวลา คู่มือนี้จะพาคุณไปดูเทคนิคการจัดการความเห็นต่าง วิธีทำลายทางตัน และรักษาประสิทธิภาพของการประชุมให้ยังคงยอดเยี่ยมอยู่เสมอ',
    sections: [
      {
        title: 'คุณค่าของ "คนที่เห็นต่าง" (The Outlier)',
        content: [
          'ก่อนอื่น ทีมต้องปรับมุมมองที่มีต่อความเห็นต่างเสียก่อน ช่องว่างของคะแนนที่กว้างมากไม่ใช่ความล้มเหลวของกระบวนการ แต่มันคือการที่กระบวนการกำลังทำงานได้ตรงตามวัตถุประสงค์ที่สุด ช่องว่างนั้นคือสัญญาณที่บอกว่า "ข้อมูลในทีมมีไม่เท่ากัน" ใครบางคนกำลังรู้ในสิ่งที่คนอื่นไม่รู้',
          'แทนที่จะมองว่าคนที่ให้คะแนนโดดออกมาคือ "ตัวปัญหาที่ต้องแก้ไข" ให้มองว่าเขาคือ "แหล่งข้อมูลที่ซ่อนอยู่" เป้าหมายของการคุยไม่ใช่การกดดันให้เขาเปลี่ยนใจ แต่เป็นการดึงเอาข้อสมมติฐาน (Assumptions) ที่ทำให้เขาเลือกเลขนั้นออกมาให้ทุกคนเห็น',
        ],
      },
      {
        title: 'เทคนิคการจัดการความเห็นต่าง',
        bullets: [
          {
            title: 'การอภิปรายแบบ "สูงสุด-ต่ำสุด"',
            desc: 'แนวทางมาตรฐานคือให้คนที่ให้คะแนนสูงสุดและต่ำสุดอธิบายเหตุผล เทคนิคเพิ่มเติมคือ: ลองให้คนให้คะแนนต่ำพูดก่อน เพราะเขามักจะมีวิธีแก้ปัญหาที่ง่ายกว่าที่คนอื่นคิดไว้ จากนั้นค่อยให้คนให้คะแนนสูงอธิบายความเสี่ยงหรือความซับซ้อนที่เขาสังเกตเห็น',
          },
          {
            title: 'ระบุ "งานที่ซ่อนอยู่" (Hidden Work)',
            desc: 'บ่อยครั้งที่คะแนนสูงมาจากสมาชิกที่รวมเอางานที่คนอื่นคิดว่าอยู่นอกขอบเขต (เช่น Unit Test, การทำเอกสาร หรือการรีแฟคเตอร์) ลองถามว่า "ในเลข 8 ของคุณ มีอะไรที่อาจจะไม่มีอยู่ในเลข 3 ของเพื่อนบ้าง?" วิธีนี้จะช่วยเคลียร์ Definition of Done ให้ชัดเจนขึ้นทันที',
          },
          {
            title: 'กฎการโหวต 3 รอบ',
            desc: 'หากทีมยังหาข้อสรุปไม่ได้หลังจากโหวตและอภิปรายไปแล้ว 3 รอบ แสดงว่าคุณกำลังเจอ "ทางตัน" (Deadlock) การฝืนโหวตต่อไปมักจะสร้างความรำคาญใจมากกว่าความแม่นยำ ถึงเวลาต้องใช้กลยุทธ์ทำลายทางตันแล้ว',
          },
        ],
      },
      {
        title: 'วิธีทำลายทางตัน (Deadlock Breaking)',
        content: [
          'เมื่อทีมหาข้อสรุปไม่ได้ ให้เลือกเดินใน 3 เส้นทางนี้:',
          '1. เลือกค่าที่สูงกว่า: หากช่องว่างแคบ (เช่น ระหว่าง 5 กับ 8) และเวลาเหลือน้อย ให้เลือกตัวเลขที่มากกว่าไว้ก่อน การประเมินความซับซ้อนเผื่อไว้ปลอดภัยกว่าการประเมินต่ำเกินไปเสมอ',
          '2. แบ่งย่อย Story: ทางตันมักเป็นสัญญาณว่า Story นั้นใหญ่เกินไปหรือมีความไม่แน่นอนสูงเกินไป ให้หยุดประเมินแล้วแบ่งงานชิ้นนั้นออกเป็น 2 ส่วนที่เล็กลง แล้วค่อยประเมินใหม่ทีละส่วน',
          '3. สร้าง "Spike": หากทีมไม่มีข้อมูลเพียงพอจริงๆ อย่าใช้วิธีเดา ให้สร้าง Task พิเศษที่เรียกว่า "Spike" (งานวิจัยที่จำกัดเวลา) ในสปริ้นท์หน้าเพื่อหาข้อมูลที่จำเป็น และเลื่อนการประเมิน Story นี้ออกไปจนกว่าจะได้ผลสรุปจาก Spike',
        ],
      },
    ],
    bottomLine: {
      title: 'บทสรุป',
      p1: 'ความเห็นต่างใน Planning Poker คือจุดที่สร้างมูลค่ามากที่สุด การจัดการคนที่เห็นต่างด้วยความสงสัยใคร่รู้แทนการกดดัน และการมีกลยุทธ์ที่ชัดเจนในการทำลายทางตัน จะช่วยให้การประเมินงานของคุณเป็นเครื่องมือที่สร้างความเข้าใจตรงกัน ไม่ใช่แค่การปั่นตัวเลขออกมาส่งเดช',
      cta: 'เริ่มเซสชันประเมินงานแบบมือโปร',
    },
    footerLinks: {
      allArticles: '← บทความทั้งหมด',
      howItWorks: 'Planning Poker คืออะไร?',
      fibonacci: 'ทำไมต้อง Fibonacci?',
    },
    author: {
      bio: 'รักษิต คือผู้สร้าง Corgi Planning Poker และวิศวกรซอฟต์แวร์ที่ผ่านการนำเซสชันประเมินงานมาหลายร้อยครั้ง เขาสร้างเครื่องมือนี้เพื่อให้การทำงานร่วมกันในทีมมีประสิทธิภาพและลดความยุ่งยากให้มากที่สุด',
      viewGithub: 'ดูบน GitHub',
    },
  },
}

export const metadata: Metadata = {
  title: 'Handling Outliers in Planning Poker: Techniques for Reaching Consensus',
  description:
    'Practical techniques for handling outlier votes and deadlocks in planning poker. The high-low discussion, hidden work, three-round limit, and more.',
  alternates: {
    canonical: 'https://www.corgiplanningpoker.com/blog/handling-outliers-in-planning-poker',
  },
}

export default async function HandlingOutliersPage() {
  const locale = (await getLocale()) as 'en' | 'th'
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
            {section.bullets && (
              <div className="mt-4 flex flex-col gap-4">
                {section.bullets.map((bullet, bIdx) => (
                  <p key={bIdx} className="text-sm leading-relaxed text-muted-foreground">
                    <strong className="font-semibold text-foreground">{bullet.title}</strong>{' '}
                    {bullet.desc}
                  </p>
                ))}
              </div>
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
            href="/blog/how-planning-poker-works"
            className="text-muted-foreground transition-colors hover:text-primary"
          >
            {t.footerLinks.howItWorks}
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
