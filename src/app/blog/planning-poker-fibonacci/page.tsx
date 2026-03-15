import type { Metadata } from 'next'
import Link from 'next/link'
import { getLocale } from 'next-intl/server'

const translations = {
  en: {
    backToBlog: '← Back to Blog',
    publishedBy: 'February 1, 2026 · By Raksit Nongbua',
    title: 'Why Planning Poker Uses Fibonacci Numbers (And When to Use Other Scales)',
    intro:
      'If you have ever joined a planning poker session for the first time, the card deck looks odd. Why does it jump from 5 to 8, then from 8 to 13? Why not just use 1 through 10? The answer lies in a counterintuitive truth about human estimation: the more effort a task requires, the less precisely we can predict it. The Fibonacci sequence encodes that truth directly into the estimation tool, making it structurally harder for teams to claim false precision on large, uncertain work.',
    sections: [
      {
        title: 'What Is the Fibonacci Sequence?',
        content: [
          'The Fibonacci sequence is a series of numbers where each value is the sum of the two preceding it: 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89 and so on, extending to infinity. It was described by the Italian mathematician Leonardo of Pisa (nicknamed Fibonacci) in his 1202 book Liber Abaci, though the pattern had been documented centuries earlier in Indian mathematics.',
          'The defining characteristic of the sequence is that the ratio between consecutive terms converges on approximately 1.618 — the golden ratio — as the numbers grow. This ratio appears throughout nature in spiral patterns, plant growth, and animal proportions. In planning poker, however, what matters is not the golden ratio but the growing gap between values. As you move up the scale, the distance between adjacent points increases, making it progressively harder to distinguish between consecutive values.',
        ],
      },
      {
        title: 'Why Fibonacci Works for Estimation',
        intro:
          'The core insight is that human estimation accuracy degrades as scope increases. Estimating whether a task takes one hour or two hours is reasonably tractable — you can reason about the specific steps involved. Estimating whether a large feature takes three weeks or four weeks is far less reliable, because at that scale there are too many unknowns, dependencies, and emergent complexities to reason about precisely.',
        bullets: [
          {
            title: 'Uncertainty scales with complexity.',
            desc: 'When you choose between a 1-point story and a 2-point story, the difference is meaningful — you are describing work that is roughly twice as complex. When you are choosing between a 20-point story and a 21-point story, the difference is not meaningful. You cannot actually distinguish between those two effort levels in a piece of work that large. A linear scale from 1 to 21 creates the illusion of precision where none exists.',
          },
          {
            title: 'Fibonacci forces natural grouping.',
            desc: 'When you can only choose 13 or 21 (not 14, 15, 16, 17, 18, 19, or 20), you are forced to make a coarser but more honest judgment: is this story solidly in the medium-large bucket or is it genuinely very large? That binary question is one most teams can answer reliably, whereas choosing from 13 distinct values between 13 and 21 produces meaningless distinctions.',
          },
          {
            title: 'It discourages the precision illusion.',
            desc: 'When a stakeholder sees a story estimated at 7 story points on a linear scale, they often unconsciously think "so about 7 days." The Fibonacci scale disrupts this conversion by making the numbers non-intuitive as time units. It nudges teams and stakeholders back toward thinking in relative terms rather than absolute hours.',
          },
        ],
      },
      {
        title: 'The Modified Planning Poker Fibonacci Scale',
        content: [
          'In practice, planning poker uses a modified Fibonacci sequence rather than the pure mathematical one. The standard planning poker deck looks like this: 1, 2, 3, 5, 8, 13, 21, 34, ?, ∞, ☕',
          'Notice a few things. The sequence starts at 1 rather than 0, because a story of zero effort should not be in the backlog. The 34 card is included as a signal that a story is very large but still theoretically estimable. In many teams, a 34-point story is an automatic trigger to break the story down before the next sprint.',
          'The ? card means "I don\'t have enough information to estimate this story." When multiple team members play the ? card, it is a strong signal that the story needs more refinement before estimation is useful. Playing ? is not a failure — it is the correct response to an under-specified story.',
          'The infinity card means "this story is too large and too uncertain to estimate as a single unit." It is not a number but a request to split. If the whole team plays infinity, the story should go back to the product owner for decomposition.',
          'The coffee cup card is a request for a break. Estimation sessions that run too long without breaks produce declining estimate quality. The coffee cup acknowledges that humans are not estimation machines and that a five-minute break will improve the quality of subsequent estimates.',
        ],
      },
      {
        title: 'When to Use T-Shirt Sizes Instead',
        content: [
          'T-shirt sizes — XS, S, M, L, XL, and sometimes XXL — are an excellent alternative to Fibonacci for specific contexts. They strip away any lingering numerical intuition and make it nearly impossible for anyone to convert sizes into hours, which is their primary advantage.',
          'T-shirt sizing works best during early discovery and roadmap planning, when the team is trying to size epics or themes rather than individual user stories. At that level of abstraction, the precision of a Fibonacci scale is not just unnecessary — it is actively misleading. Saying an epic is "L" is more honest than saying it is "21 story points" when neither estimate will survive contact with actual implementation.',
          'T-shirt sizes are also valuable when non-technical stakeholders are present. Business stakeholders often do not have an intuitive sense of how story points map to effort, but everyone understands what "large" and "small" mean in relative terms. Using t-shirt sizes in mixed-audience sessions reduces the translation overhead and keeps conversation focused on priorities rather than point totals.',
        ],
      },
    ],
    otherScales: {
      powers: {
        title: 'Powers of 2',
        desc: 'The powers-of-2 scale (1, 2, 4, 8, 16, 32) provides even wider gaps between values than Fibonacci and is favoured by teams doing coarse-grained capacity planning across quarters or program increments. Because each step doubles the previous value, the scale forces extremely honest acknowledgement of uncertainty at the high end.',
      },
      hours: {
        title: 'When to Use Hour-Based Estimation',
        desc: 'Hour-based estimation abandons relative sizing entirely and estimates in absolute time units. This is appropriate in some contexts — particularly when billing clients or fixed-price contracts. The significant downside is that hours correlate estimates to individual capacity rather than story complexity.',
      },
    },
    whichScale: {
      title: 'Which Scale Should Your Team Use?',
      p1: 'For most agile teams running sprint-level planning, the modified Fibonacci scale is the right default. It is widely understood and its growing gaps keep estimation honest at every size level.',
      p2: 'Use t-shirt sizes when you are working at the epic or theme level, or when non-technical stakeholders are estimating.',
      p3: 'Use powers of 2 if your team tends to inflate estimates and you want structural pressure to decompose stories more aggressively.',
      p4: 'Use hours only when external constraints require absolute time tracking.',
      p5: 'Whatever scale you choose, consistency matters more than perfection. A team that uses the same scale for six sprints and builds a velocity baseline will produce more reliable forecasts than a team that switches scales frequently.',
    },
    footerLinks: {
      allArticles: '← All Articles',
      storyPointsEstimator: 'Story Points Estimator',
      agileEstimation: 'Agile Estimation',
    },
    author: {
      bio: 'Raksit is the creator of Corgi Planning Poker and a software engineer who has facilitated planning poker sessions with distributed agile teams. He builds tools to make collaborative estimation faster and less painful.',
      viewGithub: 'View on GitHub',
    },
  },
  th: {
    backToBlog: '← กลับสู่บล็อก',
    publishedBy: '1 กุมภาพันธ์ 2026 · โดย รักษิต หนองบัว',
    title: 'ทำไม Planning Poker ถึงใช้เลข Fibonacci? (และเมื่อไหร่ควรใช้ชุดเลขอื่น)',
    intro:
      'หากคุณเคยร่วมเซสชัน Planning Poker เป็นครั้งแรก ชุดการ์ดอาจดูแปลกตา ทำไมมันถึงกระโดดจาก 5 ไป 8 แล้วจาก 8 ไป 13? ทำไมไม่ใช้ 1 ถึง 10? คำตอบอยู่ที่ความจริงที่ขัดกับสัญชาตญาณของการประเมินงาน: ยิ่งงานใหญ่และซับซ้อนมากเท่าไหร่ ความแม่นยำในการคาดเดาก็จะยิ่งน้อยลงเท่านั้น ลำดับเลข Fibonacci ช่วยสะท้อนความจริงนี้ออกมา เพื่อป้องกันไม่ให้ทีมตกหลุมพรางของการพยายามประเมินให้ละเอียดเกินจริงในงานที่มีความไม่แน่นอนสูง',
    sections: [
      {
        title: 'ลำดับเลข Fibonacci คืออะไร?',
        content: [
          'ลำดับเลข Fibonacci คือชุดของตัวเลขที่แต่ละค่าเกิดจากผลรวมของตัวเลขสองตัวก่อนหน้า: 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89 ไปเรื่อยๆ ชุดเลขนี้ถูกอธิบายโดยนักคณิตศาสตร์ชาวอิตาลี Leonardo of Pisa (ฉายา Fibonacci) ในปี 1202 แม้ว่ารูปแบบนี้จะถูกบันทึกไว้หลายศตวรรษก่อนหน้าในคณิตศาสตร์อินเดียก็ตาม',
          'ลักษณะเด่นของลำดับนี้คือ อัตราส่วนระหว่างตัวเลขที่อยู่ติดกันจะเข้าใกล้ 1.618 หรือ "สัดส่วนทองคำ" (Golden Ratio) เมื่อตัวเลขเพิ่มขึ้น เราจะเห็นสัดส่วนนี้ได้ทั่วไปในธรรมชาติ แต่สำหรับการประเมินงาน สิ่งที่สำคัญไม่ใช่สัดส่วนทองคำ แต่คือ "ช่องว่างที่เพิ่มขึ้น" ระหว่างตัวเลข เมื่อตัวเลขสูงขึ้น ระยะห่างจะกว้างขึ้นเรื่อยๆ ทำให้แยกความแตกต่างระหว่างค่าที่ติดกันได้ยากขึ้น',
        ],
      },
      {
        title: 'ทำไม Fibonacci ถึงเวิร์กกับการประเมินงาน?',
        intro:
          'หัวใจสำคัญคือความแม่นยำในการประเมินของมนุษย์จะลดลงเมื่อขอบเขตงานใหญ่ขึ้น การเลือกว่างานหนึ่งใช้เวลา 1 หรือ 2 ชั่วโมงนั้นทำได้ไม่ยากเพราะเราเห็นขั้นตอนชัดเจน แต่การเลือกว่าฟีเจอร์ใหญ่หนึ่งอันจะใช้เวลา 3 หรือ 4 สัปดาห์นั้นเชื่อถือได้ยากกว่ามาก เพราะมีความไม่แน่นอนและความซับซ้อนที่ซ่อนอยู่มากเกินไป',
        bullets: [
          {
            title: 'ความไม่แน่นอนแปรผันตามความซับซ้อน (Uncertainty scales with complexity)',
            desc: 'เมื่อคุณเลือกระหว่างงาน 1 แต้มกับ 2 แต้ม ความแตกต่างนั้นชัดเจนคือมันซับซ้อนกว่ากันเท่าตัว แต่ถ้าคุณต้องเลือกระหว่าง 20 แต้มกับ 21 แต้ม ในความเป็นจริงคุณไม่สามารถแยกความซับซ้อนที่ต่างกันเพียงเล็กน้อยนั้นได้ในงานขนาดใหญ่ขนาดนั้น การใช้มาตรวัดแบบเส้นตรง (Linear) อย่าง 1-20 จึงเป็นการสร้างภาพลวงตาของความแม่นยำที่ไม่มีอยู่จริง',
          },
          {
            title: 'บังคับให้จัดกลุ่มงานตามธรรมชาติ (Natural grouping)',
            desc: 'เมื่อตัวเลือกมีเพียง 13 หรือ 21 (ไม่มี 14, 15... 20) ทีมจะถูกบังคับให้ตัดสินใจแบบกว้างๆ แต่ซื่อสัตย์กับความจริงมากขึ้นว่า งานนี้อยู่ในกลุ่ม "ค่อนข้างใหญ่" หรือ "ใหญ่มาก" ซึ่งเป็นคำถามที่ทีมส่วนใหญ่ตอบได้แม่นยำกว่าการต้องมาระบุเลขละเอียดๆ',
          },
          {
            title: 'ลดภาพลวงตาของความแม่นยำ',
            desc: 'เมื่อคนนอกเห็นคะแนนเป็นเลข 7 บนมาตรวัดแบบปกติ พวกเขามักจะเผลอคิดไปเองว่า "อ๋อ ประมาณ 7 วัน" แต่เลข Fibonacci ช่วยทำลายการเชื่อมโยงนี้ เพราะมันไม่ใช่ตัวเลขที่คนทั่วไปคุ้นเคยในการวัดเวลา ช่วยกระตุ้นให้ทีมและผู้เกี่ยวข้องกลับมาโฟกัสที่ "ความยากง่ายสัมพัทธ์" แทนที่จะเป็นชั่วโมงทำงาน',
          },
        ],
      },
      {
        title: 'ชุดการ์ด Planning Poker แบบปรับปรุง (Modified Fibonacci)',
        content: [
          'ในทางปฏิบัติ Planning Poker มักใช้ชุดเลขที่ปรับปรุงจาก Fibonacci เล็กน้อยเพื่อให้ใช้งานง่าย ชุดการ์ดมาตรฐานมักจะเป็น: 1, 2, 3, 5, 8, 13, 21, 34, ?, ∞, ☕',
          'ข้อสังเกตคือ ชุดเลขจะเริ่มที่ 1 เพราะงานที่ไม่มีความพยายามเลย (0) ไม่ควรอยู่ใน Backlog ส่วนเลข 34 ใส่ไว้เพื่อส่งสัญญาณว่างานนี้ใหญ่มากแต่ยังพอประเมินได้ ซึ่งสำหรับหลายทีม งานระดับ 34 แต้มมักจะเป็นสัญญาณว่าควรแบ่งย่อยงาน (Break down) ก่อนจะเริ่มสปริ้นท์',
          'การ์ด ? หมายถึง "ข้อมูลไม่พอที่จะประเมิน" ซึ่งไม่ใช่เรื่องผิด แต่มันคือการสะท้อนว่างานนี้ต้องการรายละเอียดเพิ่มก่อนจะประเมินได้จริง',
          'การ์ด Infinity (∞) หมายถึง "งานนี้ใหญ่เกินไปและไม่แน่นอนเกินกว่าจะประเมินเป็นชิ้นเดียว" เป็นการร้องขอให้มีการแบ่งย่อยงานนั้นๆ',
          'การ์ดถ้วยกาแฟ หมายถึง "ขอพักเบรก" เพราะการประเมินงานที่นานเกินไปจะทำให้คุณภาพการตัดสินใจลดลง การพักเพียง 5 นาทีจะช่วยให้การประเมินงานที่เหลือดีขึ้นมาก',
        ],
      },
      {
        title: 'เมื่อไหร่ควรใช้ขนาดเสื้อยืด (T-Shirt Sizes) แทน?',
        content: [
          'ขนาดเสื้อยืด (XS, S, M, L, XL) เป็นทางเลือกที่ดีมากในบางบริบท เพราะมันตัดเรื่องตัวเลขออกไปโดยสิ้นเชิง ทำให้แทบจะเป็นไปไม่ได้เลยที่จะเอาไปเทียบกับชั่วโมงทำงาน',
          'T-shirt sizing เวิร์กที่สุดในช่วงการวางแผนระดับ Roadmap หรือ Epic ที่ยังไม่เห็นรายละเอียดงานย่อย ในระดับนี้การระบุเลข Fibonacci จะละเอียดเกินความจำเป็นและอาจชี้นำให้เข้าใจผิด การบอกว่า Epic นี้ขนาด "L" จะดูซื่อสัตย์กว่าการบอกว่ามันคือ "21 แต้ม"',
          'นอกจากนี้ T-shirt sizes ยังมีประโยชน์มากเมื่อต้องประชุมร่วมกับผู้ที่ไม่ได้ทำงานสายเทคนิค (Business Stakeholders) เพราะทุกคนเข้าใจความหมายของ "เล็ก" และ "ใหญ่" ได้ทันทีโดยไม่ต้องแปลความหมายตัวเลข',
        ],
      },
    ],
    otherScales: {
      powers: {
        title: 'เลขยกกำลังของ 2 (Powers of 2)',
        desc: 'ชุดเลข 1, 2, 4, 8, 16, 32 ให้ช่องว่างที่กว้างกว่า Fibonacci เหมาะสำหรับทีมที่ต้องการวางแผนคร่าวๆ ในระดับรายไตรมาส เพราะแต่ละขั้นคือการเพิ่มความพยายามเป็นเท่าตัว บังคับให้ทีมต้องยอมรับความไม่แน่นอนในงานใหญ่ๆ อย่างตรงไปตรงมา',
      },
      hours: {
        title: 'เมื่อไหร่ควรประเมินเป็นชั่วโมง (Hour-based)?',
        desc: 'การประเมินเป็นชั่วโมงจะตัดเรื่องความยากง่ายสัมพัทธ์ออกไปและใช้เวลาจริงแทน ซึ่งเหมาะในบางกรณีเช่น การคิดเงินลูกค้าตามจริงหรือสัญญาจ้างแบบเหมา แต่ข้อเสียคือชั่วโมงการทำงานจะขึ้นอยู่กับความสามารถของแต่ละบุคคล ทำให้การเปรียบเทียบ Velocity ของทีมทำได้ยากกว่า',
      },
    },
    whichScale: {
      title: 'ทีมของคุณควรใช้ชุดเลขไหน?',
      p1: 'สำหรับทีม Agile ส่วนใหญ่ที่รันการวางแผนระดับสปริ้นท์ ชุดเลข Fibonacci คือตัวเลือกเริ่มต้นที่ดีที่สุด เพราะเป็นที่เข้าใจกันสากลและช่วยให้การประเมินมีความซื่อสัตย์ในทุกระดับขนาดงาน',
      p2: 'ใช้ขนาดเสื้อยืดเมื่อต้องวางแผนงานภาพใหญ่ระดับ Epic หรือเมื่อต้องประเมินร่วมกับฝ่ายธุรกิจ',
      p3: 'ใช้เลขยกกำลังของ 2 หากทีมของคุณมีแนวโน้มจะประเมินคะแนนต่ำกว่าความเป็นจริง และต้องการแรงกดดันเชิงโครงสร้างให้แบ่งย่อยงานมากขึ้น',
      p4: 'ใช้ชั่วโมงเฉพาะเมื่อมีข้อจำกัดภายนอกที่บังคับให้ต้องเก็บสถิติเวลาจริงๆ เท่านั้น',
      p5: 'ไม่ว่าคุณจะเลือกชุดเลขไหน ความสม่ำเสมอสำคัญกว่าความสมบูรณ์แบบ ทีมที่ใช้มาตรวัดเดิมต่อเนื่อง 5-6 สปริ้นท์จะเห็น Velocity ที่ชัดเจนและคาดการณ์อนาคตได้แม่นยำกว่าทีมที่เปลี่ยนไปมาบ่อยๆ',
    },
    footerLinks: {
      allArticles: '← บทความทั้งหมด',
      storyPointsEstimator: 'Story Points Estimator',
      agileEstimation: 'Agile Estimation',
    },
    author: {
      bio: 'รักษิต คือผู้สร้าง Corgi Planning Poker และเป็นวิศวกรซอฟต์แวร์ที่ผ่านประสบการณ์การรันเซสชัน Planning Poker กับทีม Agile ระดับโลก เขาสร้างเครื่องมือนี้เพื่อช่วยให้การประเมินงานเป็นเรื่องสนุกและง่ายขึ้นสำหรับทุกคน',
      viewGithub: 'ดูบน GitHub',
    },
  },
}

export const metadata: Metadata = {
  title: 'Why Planning Poker Uses Fibonacci Numbers (And When to Use Other Scales)',
  description:
    'Why agile teams use Fibonacci for planning poker estimates, how it reduces false precision, and when to use T-shirt sizes or Powers of 2 instead.',
  alternates: {
    canonical: 'https://www.corgiplanningpoker.com/blog/planning-poker-fibonacci',
  },
}

export default async function PlanningPokerFibonacciPage() {
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
            {section.intro && (
              <p className="text-sm leading-relaxed text-muted-foreground">{section.intro}</p>
            )}
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

        <section className="mb-8">
          <h2 className="mb-3 mt-8 text-xl font-semibold">{t.otherScales.powers.title}</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">{t.otherScales.powers.desc}</p>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 mt-8 text-xl font-semibold">{t.otherScales.hours.title}</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">{t.otherScales.hours.desc}</p>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 mt-8 text-xl font-semibold">{t.whichScale.title}</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">{t.whichScale.p1}</p>
          {[t.whichScale.p2, t.whichScale.p3, t.whichScale.p4, t.whichScale.p5].map((p, idx) => (
            <p key={idx} className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {p}
            </p>
          ))}
        </section>

        <section className="mb-10">
          <h2 className="mb-3 mt-8 text-xl font-semibold">
            {locale === 'en' ? 'Try Different Scales with Your Team' : 'ลองใช้ชุดเลขต่างๆ กับทีมของคุณ'}
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {locale === 'en'
              ? 'Corgi Planning Poker supports Fibonacci, T-shirt sizes, powers of 2, and custom decks. You can experiment with different scales in different sessions to find what works best for your team\'s context.'
              : 'Corgi Planning Poker รองรับทั้ง Fibonacci, ขนาดเสื้อยืด, เลขยกกำลังของ 2 และชุดการ์ดที่คุณกำหนดเอง คุณสามารถลองใช้ชุดเลขที่ต่างกันในแต่ละเซสชันเพื่อค้นหาว่าอะไรที่เหมาะกับบริบทของทีมคุณที่สุด'}
          </p>
          <Link
            href="/new-room"
            className="mt-6 inline-block rounded-md bg-primary px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90"
          >
            {locale === 'en' ? 'Start a free planning poker room' : 'สร้างห้อง Planning Poker ฟรี'}
          </Link>
        </section>

        <footer className="mt-12 flex flex-wrap gap-4 border-t border-border/40 pt-8 text-sm">
          <Link href="/blog" className="text-muted-foreground transition-colors hover:text-primary">
            {t.footerLinks.allArticles}
          </Link>
          <Link
            href="/story-points-estimator"
            className="text-muted-foreground transition-colors hover:text-primary"
          >
            {t.footerLinks.storyPointsEstimator}
          </Link>
          <Link
            href="/agile-estimation"
            className="text-muted-foreground transition-colors hover:text-primary"
          >
            {t.footerLinks.agileEstimation}
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
