import type { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'
import { getLocale } from 'next-intl/server'

export const metadata: Metadata = {
  title: 'Sprint Planning Poker — Free Online Tool | Corgi Planning Poker',
  description:
    'Use planning poker to run focused, time-boxed sprint planning sessions. Free online tool — no account needed. Works alongside Jira, Linear, GitHub Issues, or any backlog tracker.',
  alternates: {
    canonical: 'https://www.corgiplanningpoker.com/sprint-planning',
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
      name: 'Sprint Planning',
      item: 'https://www.corgiplanningpoker.com/sprint-planning',
    },
  ],
}

const CHECKLIST_ITEMS_EN = [
  'Product backlog groomed and stories ranked by priority',
  'Acceptance criteria written for all candidate stories',
  'Entire development team assembled (developers, QA, design)',
  "Card deck chosen to match your team's estimation convention",
  'Session time-boxed to two hours or less for a two-week sprint',
  'Definition of Done agreed upon and visible to all participants',
  'Product owner available to answer clarifying questions in real time',
]

const CHECKLIST_ITEMS_TH = [
  'Product backlog ถูก groom และ story ถูกจัดเรียงตาม priority แล้ว',
  'Acceptance criteria เขียนไว้ครบสำหรับทุก story ที่จะประมาณ',
  'ทีม development มาพร้อมกันหมด ทั้ง developer, QA, และ design',
  'เลือกชุดการ์ดที่เหมาะกับ convention การประมาณของทีม',
  'กำหนดเวลาประชุมไว้ไม่เกินสองชั่วโมงสำหรับ sprint สองอาทิตย์',
  'Definition of Done ตกลงกันแล้วและทุกคนเห็นได้ชัดเจน',
  'Product owner พร้อมตอบคำถามแบบ real time ตลอดการประชุม',
]

const WHY_PLANNING_POKER_EN = [
  {
    title: 'Prevents anchoring',
    description:
      'Cards are hidden until everyone has committed to a number. No senior estimate is heard before junior team members form their own opinion. This produces more honest, diverse input and surfaces knowledge gaps that a top-down estimate would miss entirely.',
  },
  {
    title: 'Engages the entire team',
    description:
      'Sprint planning is a team ceremony, but in practice it is easy for estimation to be dominated by one or two voices. Planning poker structurally requires every participant to vote. QA engineers, frontend developers, and backend engineers all contribute — and their different perspectives often reveal dependencies that a solo estimate would overlook.',
  },
  {
    title: 'Surfaces knowledge gaps before development starts',
    description:
      'A wide spread of votes — say, a 2 and a 13 on the same story — is not a problem to resolve quickly by averaging. It is a signal that team members have fundamentally different understandings of what the story requires. Resolving that disagreement during sprint planning costs minutes. Discovering it mid-sprint costs days.',
  },
]

const WHY_PLANNING_POKER_TH = [
  {
    title: 'ป้องกัน anchoring',
    description:
      'การ์ดซ่อนอยู่จนกว่าทุกคนจะเลือกตัวเลขของตัวเองก่อนนะ senior จะไม่มีโอกาสบอกตัวเลขก่อนที่ junior จะตัดสินใจเอง ผลลัพธ์คือได้ input ที่ honest และหลากหลายกว่า แถมยังเจอ knowledge gaps ที่การประมาณแบบ top-down จะไม่มีทางเจอเลย',
  },
  {
    title: 'ดึงทุกคนเข้ามามีส่วนร่วม',
    description:
      'sprint planning เป็น ceremony ของทีม แต่ในทางปฏิบัติมักมีคนสองสามคนพูดแทนทั้งทีม planning poker บังคับให้ทุกคนต้องโหวต — QA, frontend, backend ได้ร่วมแสดงความเห็นหมด มุมมองที่ต่างกันมักเผย dependency ที่คนเดียวจะไม่มีทางเห็น',
  },
  {
    title: 'เจอ knowledge gaps ก่อนลงมือทำ',
    description:
      'ถ้าโหวตแล้วได้ 2 กับ 13 บน story เดียวกัน นั่นไม่ใช่ปัญหาที่แค่เฉลี่ยแล้วจบนะ แต่เป็นสัญญาณว่าทีมเข้าใจ story ไม่ตรงกัน แก้ความเข้าใจตอน sprint planning ใช้เวลาแค่ไม่กี่นาที แต่ถ้าไปเจอกลาง sprint อาจเสียเวลาเป็นวันเลย',
  },
]

const SprintPlanningPage = async () => {
  const locale = await getLocale()
  const isThai = locale === 'th'

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
              {isThai ? 'Sprint Planning Poker ฟรี!' : 'Sprint Planning Poker — Free Online Tool'}
            </h1>
            <p className="text-lg leading-relaxed text-muted-foreground">
              {isThai
                ? 'ทำ sprint planning ให้สนุกขึ้น โหวตการ์ดพร้อมกัน ประมาณงานได้เร็วและแม่นยำกว่าเดิม'
                : 'Make sprint planning faster, fairer, and more collaborative. Run planning poker sessions online with your scrum team — no account, no setup, free forever.'}
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
                {isThai ? 'เริ่มเลย →' : 'Start Sprint Planning →'}
              </Link>
            </div>
          </div>
        </section>

        {/* What is Sprint Planning? */}
        <section className="space-y-4">
          <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            <span className="inline-block size-2 rounded-full bg-primary" />
            {isThai ? 'Sprint Planning คืออะไร?' : 'What is Sprint Planning?'}
          </h2>
          <div className="space-y-3 border-l-2 border-primary pl-5">
            <p className="text-sm leading-relaxed text-muted-foreground">
              {isThai
                ? 'Sprint planning คือ ceremony ของ Scrum ที่เปิดตัวทุก sprint เลย ทีมทั้งหมด — product owner, scrum master, และ developer — มาประชุมกันเพื่อกำหนด sprint goal และเลือก backlog items ที่จะทำให้เสร็จใน iteration นั้น สำหรับ sprint สองอาทิตย์ การประชุมนี้ time-box ไว้ไม่เกินแปดชั่วโมง แต่ส่วนใหญ่ทีมใช้เวลาแค่สองถึงสี่ชั่วโมงก็พอแล้วนะ'
                : 'Sprint planning is the Scrum ceremony that kicks off every sprint. The entire scrum team — product owner, scrum master, and developers — meets to define the sprint goal and select the backlog items they will commit to completing in the upcoming iteration. For a two-week sprint, this meeting is time-boxed to a maximum of eight hours, though most teams complete it in two to four.'}
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {isThai
                ? 'การประชุมแบ่งออกเป็นสองส่วนชัดเจนเลย ส่วนแรก product owner จะนำเสนอ backlog items ที่สำคัญที่สุดและอธิบาย outcome ที่ต้องการจาก sprint นั้น ทีมถามคำถามเพื่อทำความเข้าใจ ปรับ acceptance criteria และสร้าง shared understanding ให้พอประมาณแต่ละ story ได้มั่นใจ ส่วนที่สอง ทีมเลือก story ที่ทำได้จริงๆ แล้วแตกออกเป็น task ย่อยๆ'
                : 'The session has two distinct parts. In the first part, the product owner presents the highest-priority backlog items and explains the desired outcomes for the sprint. The team asks clarifying questions, refines acceptance criteria, and builds enough shared understanding of each story to estimate it confidently. In the second part, the team selects the stories they can realistically deliver and decomposes them into individual tasks.'}
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {isThai
                ? 'sprint goal คือประโยคสั้นๆ ที่บอกว่าทีมจะทำอะไรให้เสร็จใน sprint นี้ — ต้องตกลงกันก่อนประชุมจบนะ goal นี้ช่วย focus ทีมตอนมีงานเกิดขึ้นกลาง sprint ถ้าอะไรไม่ได้ช่วย sprint goal ก็ไม่ควรเอาไปแทนที่ story ที่ commit ไว้แล้ว sprint goal ที่ดียังช่วยให้ stakeholder เห็นความคืบหน้าแบบ big picture โดยไม่ต้องไล่ดูทีละ ticket เลย'
                : 'A sprint goal — a concise statement of what the team intends to accomplish — is agreed upon before the meeting ends. The goal provides focus when unexpected work arises mid-sprint: if something is not in service of the sprint goal, it should not displace committed stories. Well-formed sprint goals also give stakeholders a meaningful progress signal without requiring them to track individual tickets.'}
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {isThai
                ? 'capacity planning ก็สำคัญมากเลย ทีมต้องคิดรวมถึงวันลา วันหยุด และงานอื่นที่ไม่ใช่ sprint (เช่น on-call, tech debt, ประชุมประจำ) เพื่อประเมิน availability ที่สมจริง การเลือก story มากกว่าที่ทีมทำได้เป็นหนึ่งในข้อผิดพลาดที่เจอบ่อยที่สุด — planning poker ช่วยป้องกันสิ่งนี้ได้เพราะทุกคนในทีมร่วมตัดสินใจด้วยกัน ไม่ใช่แค่คนเดียวที่ประมาณแบบ optimistic เกินจริง'
                : 'Capacity planning is the other critical input. The team accounts for planned leave, company holidays, and non-sprint work (on-call rotations, tech debt, recurring meetings) to establish realistic availability. Selecting more stories than the team can deliver at full capacity is one of the most common sprint planning failures — and planning poker helps prevent it by grounding commitments in the team\u0027s collective judgment rather than optimistic individual estimates.'}
            </p>
          </div>
        </section>

        {/* Why Use Planning Poker for Sprint Planning? */}
        <section className="space-y-6">
          <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            <span className="inline-block size-2 rounded-full bg-primary" />
            {isThai ? 'ทำไมต้องใช้ Planning Poker สำหรับ Sprint Planning?' : 'Why Use Planning Poker for Sprint Planning?'}
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {(isThai ? WHY_PLANNING_POKER_TH : WHY_PLANNING_POKER_EN).map(({ title, description }) => (
              <div
                key={title}
                className="rounded-xl border border-border/40 bg-secondary p-5 space-y-2 hover:border-primary/30 transition-colors duration-200"
              >
                <h3 className="font-semibold text-sm">{title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            {isThai ? 'อยากรู้เพิ่มเติม อ่านได้เลยที่:' : 'Learn more in our complete guide:'}{' '}
            <Link href="/blog/how-planning-poker-works" className="text-primary underline-offset-4 hover:underline">
              {isThai ? 'Planning Poker ทำงานยังไง — แบบ step by step' : 'How Planning Poker Works — Step by Step'}
            </Link>
          </p>
        </section>

        {/* Sprint Planning Checklist */}
        <section className="space-y-6">
          <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            <span className="inline-block size-2 rounded-full bg-primary" />
            {isThai ? 'Checklist ก่อนเริ่ม Sprint Planning' : 'Sprint Planning Checklist'}
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground max-w-[680px]">
            {isThai
              ? 'เอา checklist นี้ไปใช้ก่อนเริ่มประชุมเลยนะ จะได้มั่นใจว่าทีมพร้อมและประชุมได้ productive ตรงเวลา'
              : 'Use this checklist before your sprint planning session to ensure the team is set up for a productive, time-boxed meeting.'}
          </p>
          <ul className="space-y-3">
            {(isThai ? CHECKLIST_ITEMS_TH : CHECKLIST_ITEMS_EN).map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 rounded-xl border border-border/40 bg-secondary px-4 py-3"
              >
                <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded border border-primary/40 bg-primary/10">
                  <span className="block size-1.5 rounded-sm bg-primary" />
                </span>
                <span className="text-sm leading-relaxed text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Integrates With Your Workflow */}
        <section className="space-y-4">
          <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            <span className="inline-block size-2 rounded-full bg-primary" />
            {isThai ? 'ใช้คู่กับ workflow ที่มีอยู่ได้เลย' : 'Integrates With Your Workflow'}
          </h2>
          <div className="space-y-3 border-l-2 border-primary pl-5">
            <p className="text-sm leading-relaxed text-muted-foreground">
              {isThai
                ? 'Corgi Planning Poker ออกแบบมาให้ใช้ได้กับทุก tool เลย ไม่ว่าทีมจะ track งานด้วย Jira, Linear, GitHub Issues หรือ Notion ก็เปิด Corgi ในอีก browser tab ระหว่างประชุมได้เลย paste ชื่อ story หรือ ID เข้า room description ทีละอัน ประมาณไปเรื่อยๆ แล้วเอาค่า point ที่ตกลงกันไปใส่ issue tracker ของตัวเองได้เลย ไม่ต้อง configure integration ไม่ต้องจัดการ API key และไม่ต้องกลัวว่า tool จะล่มตอน planning session สำคัญ'
                : 'Corgi Planning Poker is tool-agnostic by design. Whether your team tracks work in Jira, Linear, GitHub Issues, or a Notion board, you can run a planning poker session alongside your existing workflow. Open Corgi in a browser tab during your sprint planning meeting, paste story titles or IDs into the room description as you go, estimate them one by one, then carry the agreed point values back into your issue tracker. No integrations to configure, no API keys to manage, and no risk of your estimating tool going down during a critical planning session. When running sprint planning sessions, opening Corgi alongside your backlog tracker and pasting story IDs as room topics keeps the team aligned — the agreed estimate goes straight into your tracker with no context switching.'}
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {isThai
                ? 'สำหรับทีม remote หรือทีมที่ทำงาน async เยอะ ระบบ guest identity ของ Corgi ทำให้ใครก็ตามที่มี room link เข้าร่วมได้เลยทันที — ไม่ว่าจะมาจาก Slack, calendar invite หรือ DM ก็ตาม ไม่มีขั้นตอน onboarding ให้รำคาญ ไม่มีกำแพง "สมัครก่อนนะ" และไม่ต้องติดตั้งอะไรบนมือถือ room link เดิมใช้ได้กับทุก device ทั้ง developer บน laptop และ product manager บนมือถือระหว่างเดินทาง'
                : "For remote and async-heavy teams, Corgi\u0027s guest identity system means anyone with the room link can join immediately — from a Slack notification, a calendar invite, or a direct message. There is no onboarding friction, no \u0022please create an account first\u0022 wall, and no installation on mobile. The same room link works on every device, making it equally accessible for a developer joining from their work laptop and a product manager on a phone during commute planning."}
            </p>
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
                  {isThai ? 'หน้าหลัก' : 'Home'}
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
                <Link href="/story-points-estimator" className="text-sm text-primary underline-offset-4 hover:underline">
                  {isThai ? 'ประมาณ Story Points' : 'Story Points Estimator'}
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

export default SprintPlanningPage
