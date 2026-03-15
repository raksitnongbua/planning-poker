import type { Metadata } from 'next'
import Link from 'next/link'
import { getLocale } from 'next-intl/server'
import React from 'react'

export const metadata: Metadata = {
  title: 'Story Points Estimator for Agile Teams',
  description:
    'Estimate story points collaboratively in real-time. Free online story points estimator for scrum and agile teams.',
  alternates: {
    canonical: 'https://www.corgiplanningpoker.com/story-points-estimator',
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
      name: 'Story Points Estimator',
      item: 'https://www.corgiplanningpoker.com/story-points-estimator',
    },
  ],
}

const StoryPointsEstimatorPage = async () => {
  const locale = await getLocale()
  const isThai = locale === 'th'

  const SCALES = [
    {
      name: 'Fibonacci',
      values: '1, 2, 3, 5, 8, 13, 21, 34',
      best: isThai
        ? 'ใช้ประมาณ story points ในทีม scrum ส่วนใหญ่เลย ช่องว่างที่ไม่เท่ากันช่วยให้ยอมรับความไม่แน่นอนได้เวลา story ใหญ่ๆ'
        : 'Story point estimation in most scrum teams. The non-linear gaps force acceptance of uncertainty at large sizes.',
    },
    {
      name: 'T-shirt sizes',
      values: 'XS, S, M, L, XL, XXL',
      best: isThai
        ? 'ไซซ์ backlog คร่าวๆ และวางแผน roadmap ช่วงต้น ตอนที่ยังไม่ต้องการตัวเลขละเอียดมากนัก'
        : 'High-level backlog sizing and early-stage roadmap planning where precise point values are not yet needed.',
    },
    {
      name: 'Powers of 2',
      values: '1, 2, 4, 8, 16, 32, 64',
      best: isThai
        ? 'ทีม engineering ที่ชอบตัวเลขเพิ่มเป็นเท่าตัวแบบสะอาดๆ เจอบ่อยในงาน infrastructure และ platform'
        : 'Engineering teams who prefer clean doubling increments. Common in infrastructure and platform work.',
    },
  ]

  const MISTAKES = [
    {
      title: isThai ? 'ประมาณเป็นชั่วโมงแทนที่จะเป็น effort เชิงเปรียบเทียบ' : 'Estimating in hours instead of relative effort',
      description: isThai
        ? 'Story points ตั้งใจออกแบบมาให้ไม่ผูกกับเวลานะ พอทีมแปลง points เป็นชั่วโมงตรงๆ ก็จะเสียประโยชน์ของการ sizing แบบ relative และเริ่ม over-commit ไปเรื่อยๆ เก็บ story points ให้เป็น abstract ไว้เลย — มันวัด complexity และ effort เทียบกับประวัติของทีมเราเอง ไม่ใช่นาฬิกา'
        : "Story points intentionally avoid time commitments. When teams map points directly to hours they lose the benefits of relative sizing and start over-committing. Keep story points abstract — they measure complexity and effort relative to your team's own history, not clock time.",
    },
    {
      title: isThai ? 'ให้คนคนเดียว anchor การถกเถียงทั้งหมด' : 'Letting a single voice anchor the discussion',
      description: isThai
        ? 'ถ้า senior engineer ประกาศตัวเลขก่อนใครเลย ที่เหลือก็จะโน้มเอียงไปตามนั้นเอง ใช้การเปิดพร้อมกันเสมอนะ — ทุกคนเลือกการ์ดในใจแล้วเปิดพร้อมกันเลย นี่คือกฎสำคัญสุดของ planning poker และเหตุผลหลักที่ใช้เครื่องมืออย่าง Corgi แทน spreadsheet ธรรมดา'
        : 'If a senior engineer announces their estimate before everyone else has voted, the rest of the team gravitates toward that number. Always use simultaneous reveal — everyone picks a card privately and votes are shown all at once. This is the defining rule of planning poker and the main reason to use a tool like Corgi instead of a shared spreadsheet.',
    },
    {
      title: isThai ? 'ประมาณ story ที่ใหญ่เกินไปจนไม่สามารถ size ได้แม่นยำ' : 'Estimating stories that are too large to size accurately',
      description: isThai
        ? 'ถ้า story นึงได้ estimates ที่กระจายมากผิดปกติตลอด แสดงว่า story นั้นอาจใหญ่หรือคลุมเครือเกินไปแล้ว การโหวตการ์ด infinity คือสัญญาณดีเลย: story นี้ต้องถูกแบ่งหรือ refine ก่อนถึงจะประมาณได้ พยายามบังคับ consensus กับ story ที่ใหญ่เกินแค่เสียเวลา planning และได้ตัวเลขที่ไม่น่าเชื่อถือ'
        : 'If a story consistently receives wildly divergent estimates, the story is probably too large or too vague. An infinity-card vote is a healthy signal: the story needs to be split or refined before it can be estimated. Trying to force consensus on an oversized story wastes planning time and produces an unreliable number.',
    },
  ]

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
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
              {isThai ? 'คำนวณ Story Points ฟรี!' : 'Story Points Estimator for Agile Teams'}
            </h1>
            <p className="text-lg leading-relaxed text-muted-foreground">
              {isThai
                ? 'ประมาณ story points กับทีมได้ง่ายๆ โหวตพร้อมกัน เรียลไทม์ ไม่ต้องสมัคร'
                : 'Estimate story points collaboratively in real time with your scrum or agile team. Free, instant, and no registration required.'}
            </p>
          </div>
          <div className="relative inline-block">
            <div className="absolute inset-[-4px] animate-pulse rounded-lg bg-primary/40 blur-xl" style={{ animationDuration: '2s' }} />
            <div className="relative overflow-hidden rounded-md">
              <span className="pointer-events-none absolute inset-0 z-10 animate-shine bg-gradient-to-r from-transparent via-white/30 to-transparent" style={{ animationDuration: '3s' }} />
              <Link
                href="/new-room"
                className="relative inline-flex h-11 w-56 items-center justify-center rounded-md bg-primary px-6 text-sm font-semibold text-primary-foreground transition-transform duration-200 hover:scale-[1.03] hover:shadow-lg hover:shadow-primary/40"
              >
                {isThai ? 'เริ่มประมาณเลย →' : 'Estimate Story Points →'}
              </Link>
            </div>
          </div>
        </section>

        {/* What Are Story Points? */}
        <section className="space-y-4">
          <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            <span className="inline-block size-2 rounded-full bg-primary" />
            {isThai ? 'Story Points คืออะไร?' : 'What Are Story Points?'}
          </h2>
          <div className="space-y-3 border-l-2 border-primary pl-5">
            <p className="text-sm leading-relaxed text-muted-foreground">
              {isThai
                ? 'Story points คือหน่วยวัดที่ใช้ใน agile development เพื่อบอกว่า user story หรืองานชิ้นนึงต้องใช้ effort แค่ไหน แทนที่จะนับเป็นชั่วโมง story points เป็นแบบ relative นะ — มันบอกว่างานชิ้นนี้ใหญ่แค่ไหนเมื่อเทียบกับงานที่ทีมเคยทำมาแล้ว แทนที่จะพยากรณ์ว่าจะใช้เวลาเท่าไหร่ตรงๆ'
                : 'Story points are a unit of measure used in agile development to express the estimated effort required to complete a user story, task, or other work item. Unlike estimating in hours, story points are relative — they describe how large a piece of work is compared to other pieces of work your team has already completed, rather than predicting exactly how long the work will take.'}
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {isThai
                ? 'ความแตกต่างนี้สำคัญมากในทางปฏิบัติเลย การประมาณเป็นชั่วโมงสร้าง commitment โดยนัย — ถ้า dev ประมาณงานว่า &quot;สี่ชั่วโมง&quot; แต่ใช้เวลาแปดชั่วโมง ทั้ง dev และ stakeholder ก็จะรู้สึกว่ามีอะไรผิดพลาด Story points หลบกับดักนี้เลย story ที่ประมาณ 5 points กับ story ที่ประมาณ 3 points ควรมีสัดส่วน effort ใกล้เคียงกัน — แต่ไม่มีตัวเลขไหนที่บอกว่าต้องใช้กี่ชั่วโมงทำงาน'
                : 'This distinction matters enormously in practice. Hours-based estimates create an implicit commitment: if a developer estimates a task at &quot;four hours&quot; and it takes eight, both the developer and stakeholders feel that something went wrong. Story points sidestep this trap. A story estimated at 5 points and a story estimated at 3 points should have a roughly similar ratio of effort — but neither number implies a specific number of working hours.'}
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {isThai
                ? 'Story points จับสามมิติพร้อมกันเลย: ปริมาณงาน, complexity (ยากแค่ไหนที่จะ implement ให้ถูกต้อง?), และความไม่แน่นอน (เราเข้าใจสิ่งที่ต้องทำดีแค่ไหน?) story อาจมีปริมาณงานน้อยแต่ complexity สูง — เช่น ต้องแตะ legacy system ที่เปราะบางและไม่มี documentation — ก็ควรได้ point สูงขึ้นเพื่อสะท้อนความยากนั้น ส่วน CRUD endpoint ตรงๆ อาจต้องพิมพ์เยอะแต่ความไม่แน่นอนน้อย ก็ควร size ตามนั้น'
                : 'Story points capture three dimensions at once: the volume of work involved, its complexity (how hard is it to implement correctly?), and uncertainty (how well do we understand what needs to be done?). A story can have a small volume but high complexity — touching a fragile, undocumented legacy system, for example — and should receive a higher point value to reflect that. A straightforward CRUD endpoint might involve a lot of typing but little uncertainty, and should be sized accordingly.'}
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {isThai ? (
                <>
                  เมื่อเวลาผ่านไป ทีมจะสะสม <em>velocity</em> — จำนวน story points เฉลี่ยที่ทำเสร็จต่อ sprint velocity กลายเป็นเครื่องมือ forecast ที่น่าเชื่อถือ: ถ้าทีม average 32 points ต่อ sprint และ backlog ที่เหลือรวม 128 points ก็ประมาณได้ว่าต้องใช้อีกสี่ sprint เพื่อถึงเป้า release ได้เลย ทั้งนี้ทำงานได้ก็ต่อเมื่อการประมาณสม่ำเสมอและซื่อสัตย์ นั่นคือเหตุผลที่ planning poker technique — กับการเปิดการ์ดพร้อมกัน — ออกแบบมาเพื่อปกป้องความน่าเชื่อถือของการประมาณนั่นเอง
                </>
              ) : (
                <>
                  Over time, teams accumulate a <em>velocity</em> — the average number of story points they complete per sprint. Velocity becomes a reliable forecasting tool: if a team averages 32 points per sprint, and the remaining backlog totals 128 points, they can reasonably estimate four more sprints to reach their release goal. This only works when estimates are consistent and honest, which is why the planning poker technique — with its simultaneous card reveal — is designed to protect estimate integrity.
                </>
              )}
            </p>
          </div>
        </section>

        {/* How to Estimate Story Points with Planning Poker */}
        <section className="space-y-4">
          <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            <span className="inline-block size-2 rounded-full bg-primary" />
            {isThai ? 'วิธีประมาณ Story Points ด้วย Planning Poker' : 'How to Estimate Story Points with Planning Poker'}
          </h2>
          <div className="space-y-3 border-l-2 border-primary pl-5">
            <p className="text-sm leading-relaxed text-muted-foreground">
              {isThai
                ? 'facilitator อ่าน user story ออกเสียง — หรือวางไว้ใน description ของห้อง — แล้วตอบคำถาม clarify เบื้องต้น จากนั้นแต่ละคนเลือกการ์ดจาก deck ของตัวเองแบบ private เพื่อแสดง effort estimate พอทุกคนโหวตแล้ว การ์ดทุกใบก็เปิดพร้อมกันเลย'
                : 'The facilitator reads a user story aloud — or pastes it into the shared room description — and answers any immediate clarifying questions. Each participant then privately selects a card from their deck that represents their effort estimate. When everyone has voted, all cards are revealed at the same time.'}
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {isThai
                ? 'ถ้าโหวตทุกคนกระจุกอยู่ในหนึ่งหรือสองค่า ทีมก็ consensus แล้วสามารถใช้ค่า median หรือสูงสุดเป็น estimate ของ story ได้เลย แต่ถ้ากระจายกว้าง — สมมติมีคนโหวต 2 กับคนโหวต 13 — facilitator จะถามทั้งสองฝั่งให้อธิบาย reasoning นี่คือส่วนที่มีคุณค่ามากที่สุดของ process เลยนะ คนที่โหวตต่ำอาจมี implementation ที่ง่ายกว่าในใจ ส่วนคนที่โหวตสูงอาจรู้ถึง dependency หรือ edge case ที่คนอื่นไม่รู้ หลังถกกันแล้วก็โหวตใหม่จนได้ consensus'
                : "If all votes cluster within one or two values, the team has consensus and can accept the median or highest value as the story's estimate. If there is a wide spread — say, one person voted 2 and another voted 13 — the facilitator asks both extremes to explain their reasoning. This discussion is the most valuable part of the process. The low-voter may have a simpler implementation in mind that the high-voter has not considered. The high-voter may know about a dependency or edge case the rest of the team missed. After the discussion, the team votes again until consensus is reached."}
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {isThai
                ? 'ทั้ง process มี time-box นะ story นึงแทบไม่ควรใช้เวลาเกินห้าถึงสิบนาทีในการประมาณ ถ้าถกกันไปเรื่อยๆ โดยไม่ได้ consensus มักเป็นสัญญาณว่าควร table story นั้นไว้ก่อน นัด refinement session แยกกับ product owner แล้วค่อยไปต่อ'
                : 'The entire process is time-boxed. A single story should rarely take more than five to ten minutes to estimate. If discussion keeps escalating without consensus, it is usually a signal to table the story, schedule a separate refinement session with the product owner, and move on.'}
            </p>
          </div>
        </section>

        {/* Story Point Scales */}
        <section className="space-y-6">
          <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            <span className="inline-block size-2 rounded-full bg-primary" />
            {isThai ? 'Scale ของ Story Points' : 'Story Point Scales'}
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {SCALES.map(({ name, values, best }) => (
              <div
                key={name}
                className="rounded-xl border border-border/40 bg-secondary p-5 space-y-3 hover:border-primary/30 transition-colors duration-200"
              >
                <h3 className="font-semibold">{name}</h3>
                <p className="text-xs font-bold tabular-nums text-primary">{values}</p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  <span className="font-medium text-foreground">{isThai ? 'เหมาะกับ: ' : 'Best for: '}</span>
                  {best}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            {isThai ? (
              <>
                อ่านคำอธิบายเชิงลึกว่าทำไม Fibonacci sequence ถึงเวิร์คสำหรับการประมาณได้ที่{' '}
                <Link href="/blog/planning-poker-fibonacci" className="text-primary underline-offset-4 hover:underline">
                  ทำไม Planning Poker ถึงใช้ Fibonacci
                </Link>
                {' '}และถ้าอยากเข้าใจความต่างระหว่าง story points กับชั่วโมง ดูได้ที่{' '}
                <Link href="/blog/story-points-vs-hours" className="text-primary underline-offset-4 hover:underline">
                  Story Points vs Hours
                </Link>
                {' '}เลย
              </>
            ) : (
              <>
                For a deeper explanation of why the Fibonacci sequence works for estimation, read{' '}
                <Link href="/blog/planning-poker-fibonacci" className="text-primary underline-offset-4 hover:underline">
                  Why Planning Poker Uses Fibonacci Numbers
                </Link>
                . To understand the difference between story points and hours, see{' '}
                <Link href="/blog/story-points-vs-hours" className="text-primary underline-offset-4 hover:underline">
                  Story Points vs Hours
                </Link>
                .
              </>
            )}
          </p>
        </section>

        {/* Common Mistakes */}
        <section className="space-y-6">
          <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            <span className="inline-block size-2 rounded-full bg-primary" />
            {isThai ? 'ข้อผิดพลาดที่เจอบ่อยตอนประมาณ Story Points' : 'Common Mistakes When Estimating Story Points'}
          </h2>
          <div className="space-y-4">
            {MISTAKES.map(({ title, description }, i) => (
              <div
                key={title}
                className="flex gap-4 rounded-xl border border-border/40 bg-secondary p-5"
              >
                <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  {i + 1}
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-sm">{title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Internal links */}
        <section className="space-y-4 border-t border-border/40 pt-10">
          <h2 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
            {isThai ? 'ดูเพิ่มเติม' : 'Explore More'}
          </h2>
          <nav aria-label="Related pages">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              <li>
                <Link href="/" className="text-sm text-primary underline-offset-4 hover:underline">
                  {isThai ? 'หน้าแรก' : 'Home'}
                </Link>
              </li>
              <li>
                <Link href="/scrum-poker" className="text-sm text-primary underline-offset-4 hover:underline">
                  {isThai ? 'Scrum Poker ออนไลน์' : 'Scrum Poker Online'}
                </Link>
              </li>
              <li>
                <Link href="/agile-estimation" className="text-sm text-primary underline-offset-4 hover:underline">
                  {isThai ? 'เครื่องมือ Agile Estimation' : 'Agile Estimation Tool'}
                </Link>
              </li>
              <li>
                <Link href="/sprint-planning" className="text-sm text-primary underline-offset-4 hover:underline">
                  {isThai ? 'Sprint Planning Poker' : 'Sprint Planning Poker'}
                </Link>
              </li>
              <li>
                <Link href="/new-room" className="text-sm text-primary underline-offset-4 hover:underline">
                  {isThai ? 'สร้างห้องเลย' : 'Create a Room'}
                </Link>
              </li>
            </ul>
          </nav>
        </section>
      </div>
    </>
  )
}

export default StoryPointsEstimatorPage
