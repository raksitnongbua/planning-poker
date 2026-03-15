import type { Metadata } from 'next'
import Link from 'next/link'
import { getLocale } from 'next-intl/server'

const translations = {
  en: {
    backToBlog: '← Back to Blog',
    publishedBy: 'March 14, 2026 · By Raksit Nongbua',
    title: "Why We Built Corgi Planning Poker (And Why It's Free)",
    intro:
      'Most software is built to solve a problem someone else already has. This one was built to solve a problem I ran into myself — on a Tuesday afternoon, mid-sprint, when the planning poker tool my team had been using for months suddenly asked us to upgrade to continue. Here is how Corgi Planning Poker came to exist.',
    sections: [
      {
        title: 'It Started With Frustration',
        content: [
          'For a long time, my team used free planning poker tools without thinking much about them. They were good enough. We\'d share a link, everyone would join, we\'d vote, reveal, discuss, and move on. It was exactly as lightweight as planning poker is supposed to be.',
          'Then the tools started changing. First it was subtle — a banner here, a prompt there. Then the limitations arrived in earnest: caps on sessions, limits on rooms, voter count restrictions, and locked customisation.',
          'None of these restrictions are surprising from a business model perspective. But they are frustrating from a user perspective. Planning poker is supposed to reduce friction in sprint planning, not introduce new friction of its own. Every time a team hits a paywall mid-session, it undermines the whole point.',
        ],
      },
      {
        title: 'The Decision to Build It Myself',
        content: [
          'I\'m a software engineer. When a tool I rely on starts working against me, my natural instinct is to look at what it would take to replace it. Planning poker is not a technically complex problem: you need a room, a websocket connection, a way to hide votes, and a reveal mechanism.',
          'So I built it. The backend is in Go — chosen for its concurrency model and small memory footprint. The frontend is Next.js. The whole thing runs without requiring an account: a guest identity is assigned automatically, so you can create a room and share the link in under ten seconds.',
          'The constraints I set for myself were simple: no session limits, no room limits, no voter count limits, full control over your card deck and point scale, and permanently free. Not free-with-a-catch. Just free.',
        ],
      },
      {
        title: 'Why a Corgi?',
        content: [
          'I have a corgi at home named Kimi. If you have never spent time around a corgi, the short description is: relentlessly enthusiastic, surprisingly capable, and always making the people around them happier than they were before. That felt like a reasonable set of values for a planning tool.',
          'Kimi has her own Instagram at @kimicorgi_ and has been a source of daily distraction and joy throughout the development of this app. Naming the project after her was the easiest product decision I\'ve made.',
        ],
      },
      {
        title: 'What It Has Become',
        content: [
          'What started as a quick side project for my own team has grown into something I actively maintain and continue improving. Features I\'ve added since the first version include spectator mode, Google sign-in to sync identity across devices, recent room history, a custom deck builder, and round activity history.',
          'The project is open source. The full source code is on GitHub. If you find a bug, open an issue. If you want to improve something, submit a pull request. The project exists to serve the people who use it, and contributions from those people make it better faster than I can alone.',
        ],
      },
      {
        title: 'Why It Will Stay Free',
        content: [
          'The reason I built this was that I was tired of free tools that quietly became not-free. I have no intention of doing the same thing. There are no paid plans, no advertisements, and no data sold to third parties. The app collects only what is necessary to make rooms work.',
          'Hosting costs for a tool at this scale are modest. The project is funded by nothing more than the time I choose to put into it. That\'s a sustainable model for a tool that does one focused thing well.',
        ],
      },
    ],
    startSession: {
      title: 'Try It With Your Team',
      p1: 'If your current planning poker tool has started asking you for a credit card, or if you\'ve never tried it at all, Corgi Planning Poker takes about ten seconds to get started. No account, no trial, no limits.',
      cta: 'Create a free room',
    },
    footerLinks: {
      allArticles: '← All Articles',
      howItWorks: 'How Planning Poker Works',
      whyFibonacci: 'Why Fibonacci?',
      storyPointsVsHours: 'Story Points vs Hours',
    },
    author: {
      bio: 'Raksit is the creator of Corgi Planning Poker and a software engineer who has facilitated planning poker sessions with distributed agile teams. He builds tools to make collaborative estimation faster and less painful.',
      viewGithub: 'View on GitHub',
    },
  },
  th: {
    backToBlog: '← กลับสู่บล็อก',
    publishedBy: '14 มีนาคม 2026 · โดย รักษิต หนองบัว',
    title: 'ทำไมเราถึงสร้าง Corgi Planning Poker (และทำไมมันถึงฟรีตลอดไป)',
    intro:
      'ซอฟต์แวร์ส่วนใหญ่มักถูกสร้างขึ้นเพื่อแก้ปัญหาของคนอื่น แต่เครื่องมือนี้ถูกสร้างขึ้นเพื่อแก้ปัญหาที่ผมเจอด้วยตัวเอง ในบ่ายวันอังคารช่วงกลางสปริ้นท์ เมื่อเครื่องมือที่ทีมผมใช้มานานหลายเดือนจู่ๆ ก็ขอให้เราอัพเกรดเพื่อใช้งานต่อ นี่คือเรื่องราวที่มาของ Corgi Planning Poker',
    sections: [
      {
        title: 'เริ่มต้นจากความหงุดหงิด',
        content: [
          'เป็นเวลานานที่ทีมของผมใช้เครื่องมือ Planning Poker ฟรีที่มีอยู่ทั่วไปโดยไม่ได้คิดอะไรมาก มันทำงานได้ดีพอใช้ เราแชร์ลิงก์ ทุกคนเข้าร่วม ลงคะแนน เปิดผล อภิปราย แล้วก็จบไป มันเรียบง่ายและสะดวกตามที่ Planning Poker ควรจะเป็น',
          'แต่แล้วเครื่องมือเหล่านั้นก็เริ่มเปลี่ยนไป เริ่มจากป้ายโฆษณาเล็กๆ จนกลายเป็นข้อจำกัดที่จริงจัง: จำกัดจำนวนเซสชันต่อเดือน, จำกัดจำนวนห้องที่สร้างได้, จำกัดจำนวนคนที่ลงคะแนนได้ และล็อกฟีเจอร์การปรับแต่งชุดการ์ด',
          'ในแง่ของโมเดลธุรกิจ ข้อจำกัดเหล่านี้ไม่ใช่เรื่องแปลก แต่ในแง่ของผู้ใช้ มันคือความน่ารำคาญ Planning Poker ควรจะช่วยลดอุปสรรคในการวางแผนสปริ้นท์ ไม่ใช่สร้างอุปสรรคใหม่ขึ้นมาเสียเอง ทุกครั้งที่ทีมเจอหน้าต่างเรียกเก็บเงินกลางคัน มันทำลายจุดประสงค์ของการใช้เครื่องมือนั้นไปโดยสิ้นเชิง',
        ],
      },
      {
        title: 'การตัดสินใจลงมือสร้างเอง',
        content: [
          'ในฐานะวิศวกรซอฟต์แวร์ เมื่อเครื่องมือที่ผมใช้เริ่มทำงานขัดใจ สัญชาตญาณแรกคือการดูว่าต้องใช้อะไรบ้างในการสร้างมันขึ้นมาใหม่ โจทย์ของ Planning Poker ไม่ได้ซับซ้อนเกินไปในทางเทคนิค: คุณต้องการห้องประชุม, การเชื่อมต่อแบบ WebSocket, วิธีซ่อนคะแนนจนกว่าจะพร้อม และกลไกการเปิดผล',
          'ผมจึงลงมือสร้างมันขึ้นมา โดยใช้ Go สำหรับ Backend เพราะประสิทธิภาพในการจัดการการเชื่อมต่อจำนวนมาก และใช้ Next.js สำหรับ Frontend ระบบทั้งหมดทำงานได้โดยไม่ต้องสมัครบัญชี: Guest ID จะถูกกำหนดให้โดยอัตโนมัติ เพื่อให้คุณสร้างห้องและแชร์ลิงก์ได้ภายในเวลาไม่ถึงสิบวินาที',
          'ข้อจำกัดที่ผมตั้งไว้ให้ตัวเองนั้นเรียบง่ายมาก: ไม่จำกัดเซสชัน, ไม่จำกัดจำนวนห้อง, ไม่จำกัดจำนวนคนลงคะแนน, ปรับแต่งชุดการ์ดได้เต็มที่ และต้องฟรีตลอดไป แบบไม่มีเงื่อนไขซ่อนเร้น',
        ],
      },
      {
        title: 'ทำไมต้องเป็นคอร์กี้?',
        content: [
          'ผมมีคอร์กี้อยู่ที่บ้านชื่อเจ้า Kimi หากคุณไม่เคยคลุกคลีกับคอร์กี้ คำจำกัดความสั้นๆ คือ: กระตือรือร้นอย่างไม่ลดละ, มีความสามารถอย่างน่าประหลาดใจ และมักจะทำให้คนรอบข้างมีความสุขขึ้นเสมอ ผมรู้สึกว่าสิ่งนี้เป็นคุณค่าที่เหมาะสมสำหรับเครื่องมือในการทำงานร่วมกัน',
          'Kimi มี Instagram ของตัวเองที่ @kimicorgi_ และเป็นแหล่งพักผ่อนสายตาและความสุขในระหว่างการพัฒนาแอปนี้ การตั้งชื่อโปรเจ็กต์ตามชื่อเธอจึงเป็นการตัดสินใจที่ง่ายที่สุดในโปรเจ็กต์นี้เลยครับ',
        ],
      },
      {
        title: 'สิ่งที่มันเป็นในวันนี้',
        content: [
          'จากโปรเจ็กต์เล็กๆ สำหรับใช้ในทีมตัวเอง ได้เติบโตขึ้นเป็นเครื่องมือที่ผมดูแลและพัฒนาอย่างต่อเนื่อง ฟีเจอร์ที่เพิ่มเข้ามาตั้งแต่เวอร์ชันแรกประกอบด้วย โหมดผู้สังเกตการณ์, การซิงค์ข้อมูลผ่าน Google, ประวัติห้องล่าสุด, ระบบสร้างชุดการ์ดเอง และประวัติการลงคะแนนในแต่ละรอบ',
          'โปรเจ็กต์นี้เป็น Open Source ซอร์สโค้ดทั้งหมดอยู่บน GitHub หากคุณเจอ Bug แจ้งปัญหาไว้ได้เลย หรือถ้าอยากช่วยพัฒนา ก็สามารถส่ง Pull Request มาได้ โปรเจ็กต์นี้อยู่ได้เพราะผู้ใช้งาน และความช่วยเหลือจากทุกคนจะทำให้มันดีขึ้นได้เร็วกว่าผมทำคนเดียว',
        ],
      },
      {
        title: 'ทำไมถึงจะฟรีตลอดไป',
        content: [
          'เหตุผลที่ผมสร้างสิ่งนี้คือผมเบื่อเครื่องมือฟรีที่แอบเปลี่ยนเป็นไม่ฟรีในภายหลัง ผมไม่มีความตั้งใจจะทำแบบเดียวกัน เครื่องมือนี้จะไม่มีแผนเสียเงิน ไม่มีโฆษณา และไม่ขายข้อมูลให้ใคร แอปจะเก็บข้อมูลที่จำเป็นต่อการใช้งานห้องเท่านั้น',
          'ค่าใช้จ่ายในการดูแลระบบขนาดนี้ไม่ได้สูงมากจนแบกรับไม่ไหว โปรเจ็กต์นี้ขับเคลื่อนด้วยเวลาที่ผมยินดีสละให้มัน ซึ่งเป็นโมเดลที่ยั่งยืนสำหรับเครื่องมือที่โฟกัสเพียงเรื่องเดียวและทำให้ดีที่สุด',
        ],
      },
    ],
    startSession: {
      title: 'ลองใช้กับทีมของคุณ',
      p1: 'ถ้าเครื่องมือ Planning Poker ที่คุณใช้อยู่เริ่มขอเลขบัตรเครดิต หรือถ้าคุณยังไม่เคยลองใช้เลย Corgi Planning Poker ใช้เวลาเริ่มเพียง 10 วินาที ไม่มีบัญชี ไม่มีทดลองใช้ และไม่มีข้อจำกัดใดๆ',
      cta: 'สร้างห้องประเมินงานฟรี',
    },
    footerLinks: {
      allArticles: '← บทความทั้งหมด',
      howItWorks: 'Planning Poker คืออะไร?',
      whyFibonacci: 'ทำไมต้อง Fibonacci?',
      storyPointsVsHours: 'Story Points vs Hours',
    },
    author: {
      bio: 'รักษิต คือผู้สร้าง Corgi Planning Poker และเป็นวิศวกรซอฟต์แวร์ที่ผ่านประสบการณ์การรันเซสชัน Planning Poker กับทีม Agile ระดับโลก เขาสร้างเครื่องมือนี้เพื่อช่วยให้การประเมินงานเป็นเรื่องสนุกและง่ายขึ้นสำหรับทุกคน',
      viewGithub: 'ดูบน GitHub',
    },
  },
}

export const metadata: Metadata = {
  title: "Why We Built Corgi Planning Poker (And Why It's Free)",
  description:
    "The story behind Corgi Planning Poker — why we built a free, open-source planning poker tool and why it will always stay free with no paywalls.",
  alternates: {
    canonical: 'https://www.corgiplanningpoker.com/blog/why-we-built-corgi-planning-poker',
  },
}

export default async function WhyWeBuiltCorgiPage() {
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
          </section>
        ))}

        <section className="mb-10">
          <h2 className="mb-3 mt-8 text-xl font-semibold">{t.startSession.title}</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">{t.startSession.p1}</p>
          <Link
            href="/new-room"
            className="mt-6 inline-block rounded-md bg-primary px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90"
          >
            {t.startSession.cta}
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
            {t.footerLinks.whyFibonacci}
          </Link>
          <Link
            href="/blog/story-points-vs-hours"
            className="text-muted-foreground transition-colors hover:text-primary"
          >
            {t.footerLinks.storyPointsVsHours}
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
