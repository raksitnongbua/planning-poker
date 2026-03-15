import type { Metadata } from 'next'
import Link from 'next/link'
import { getLocale } from 'next-intl/server'

const translations = {
  en: {
    backToBlog: '← Back to Blog',
    publishedBy: 'February 15, 2026 · By Raksit Nongbua',
    title: 'Story Points vs Hours: Which Should Your Team Use?',
    intro:
      'Few debates in agile circles run as long, or get as heated, as the question of story points versus hours. Both sides have well-reasoned arguments and practitioners who swear by their preferred approach. The reality is that neither is universally correct — the right choice depends on your team\'s size, maturity, client relationships, and what you are trying to achieve with estimation in the first place. This article lays out both approaches honestly, including the contexts where each one genuinely shines, so you can make an informed decision rather than following received wisdom.',
    sections: [
      {
        title: 'What Are Story Points?',
        content: [
          'Story points are a unit of measure for the relative effort, complexity, and risk involved in completing a user story. The key word is relative. A 5-point story is not five hours, five days, or any other absolute unit of time. It simply means the team believes this story is roughly five times as much work as a 1-point story, and somewhat less than an 8-point story.',
          'Story points are inherently team-specific. A 5-point story for a senior team of eight engineers is a different absolute quantity of work than a 5-point story for a junior team of three. That is not a bug — it is a feature. Teams track their own velocity (how many points they complete per sprint) and use that baseline to forecast future sprints.',
          'This relative nature has an important practical benefit: story points do not get invalidated by changes in team composition. If a new engineer joins the team, the velocity will naturally adjust over a sprint or two rather than requiring a wholesale re-calibration of every estimate in the backlog.',
        ],
      },
      {
        title: 'What Is Hour-Based Estimation?',
        content: [
          'Hour-based estimation is exactly what it sounds like: each story or task is given an estimate expressed in hours of work. A story might be estimated at eight hours, meaning the team expects it to consume roughly one developer-day of effort.',
          'Hour estimates are absolute and, at least in theory, portable. A story estimated at eight hours should take roughly eight hours regardless of which developer implements it — although in practice this is rarely true, since different developers work at different speeds.',
          'The appeal of hour estimation is its concreteness. Managers, clients, and stakeholders who are used to thinking in time-and-materials terms find hours immediately interpretable. "This feature will take 80 hours" translates directly into resource planning and budget calculations.',
        ],
      },
      {
        title: 'Why Most Agile Teams Prefer Story Points',
        intro:
          'The majority of experienced agile teams settle on story points after experimenting with hours. Here are five reasons why.',
        reasons: [
          {
            title: '1. Hours become commitments; points remain forecasts',
            desc: 'When a developer says "this will take 8 hours," the estimate is heard as a promise. If it takes 12, someone has "gone over estimate." This turns estimation into a performance evaluation. Story points do not carry this baggage because they are not denominated in the same currency as deadlines and salaries.',
          },
          {
            title: '2. Teams are better at relative comparison',
            desc: 'Research shows that humans are far better at comparative judgments than absolute ones. Asking "is this story bigger or smaller than that story?" is a question most developers can answer reliably. Asking "how many hours will this take?" requires a confident prediction about the future that depends on many unknown factors.',
          },
          {
            title: '3. Velocity stabilises faster',
            desc: 'With story points, teams establish a stable velocity within three to five sprints. Hour-based estimates must account for meetings, code reviews, and context switching that is difficult to predict at the story level. Teams using hours often find their "actual hours" routinely exceed estimates by 40–60%.',
          },
          {
            title: '4. Points focus discussion on complexity, not individual speed',
            desc: 'Hour estimates often implicitly estimate for a specific person — "this will take Alice 4 hours but Bob 8 hours." Story points describe the inherent difficulty of the work, which is a property of the story itself regardless of who implements it.',
          },
          {
            title: '5. Re-estimation costs are lower',
            desc: 'Backlogs evolve. When estimates are in story points, a rough initial estimate remains useful because the relative scale is self-calibrating. When estimates are in hours, even minor changes often require a full re-estimate to avoid misleading capacity calculations.',
          },
        ],
      },
      {
        title: 'When Hour Estimation Makes Sense',
        intro:
          'Despite the advantages of story points, there are legitimate contexts where hour estimation is the correct tool.',
        bullets: [
          {
            title: 'Billing clients on time and materials.',
            desc: 'If you invoice based on hours worked, you need to track actual hours. Hour estimates provide a baseline for comparing estimated vs actual time, feeding directly into pricing and client reporting.',
          },
          {
            title: 'Regulatory compliance and audits.',
            desc: 'Some industries — particularly government or healthcare — have audit requirements that mandate time tracking at the task level as compliance artifacts.',
          },
          {
            title: 'SLA contracts with defined response times.',
            desc: 'Service-level agreements that specify resolution within 48 hours require mapping work to calendar time directly.',
          },
          {
            title: 'Very small teams or solo projects.',
            desc: 'A solo developer or a two-person team may find that tracking velocity in story points adds overhead without meaningfully improving forecast accuracy.',
          },
        ],
      },
    ],
    canYouUseBoth: {
      title: 'Can You Use Both?',
      p1: 'Yes — and many mature teams do exactly this, using each metric for the purpose it is best suited to. The key is to keep the two systems separate and avoid creating conversion factors that implicitly tie points back to hours.',
      p2: 'The failure mode to watch for is when teams start calculating an "hours per point" conversion. This recreates all the drawbacks of hour estimation while adding the overhead of story points. If a stakeholder asks "how many hours is a story point?", the answer should be "that varies by sprint" — not a fixed number.',
    },
    transition: {
      title: 'How to Transition From Hours to Story Points',
      steps: [
        {
          title: 'Establish a reference story as your baseline',
          desc: 'Find a recently completed story that represents "medium" effort and designate it as a 5-point reference. All future estimates will be made relative to it.',
        },
        {
          title: 'Run two sprints in parallel estimation mode',
          desc: 'Estimate both in points and hours for the first two sprints. Do not use hours for planning — use them only as a psychological safety net while building confidence.',
        },
        {
          title: 'Resist the temptation to convert early velocity to hours',
          desc: 'Shut down calculations like "each point is 7.6 hours." Velocity stabilises after four to six sprints — until then, use it directionally, not as a conversion factor.',
        },
        {
          title: 'Communicate the change clearly to stakeholders',
          desc: 'Explain that the team is transitioning to a more accurate forecasting system based on empirical velocity data rather than summed hour estimates.',
        },
      ],
    },
    bottomLine: {
      title: 'The Bottom Line',
      p1: 'For the majority of product teams, story points are the better estimation unit. They produce more honest conversations about complexity and enable more reliable forecasting.',
      p2: 'Use hours when external obligations genuinely require it — billing, compliance, or contracts. In those cases, run hour tracking alongside story point planning, but avoid converting between them.',
      p3: 'Whatever you choose, the act of estimating together as a team — discussing stories and reaching shared understanding — is more valuable than the number that results.',
      cta: 'Start estimating with your team',
    },
    footerLinks: {
      allArticles: '← All Articles',
      storyPointsEstimator: 'Story Points Estimator',
      sprintPlanning: 'Sprint Planning',
      fibonacciGuide: 'Why Planning Poker Uses Fibonacci Numbers',
    },
    author: {
      bio: 'Raksit is the creator of Corgi Planning Poker and a software engineer who has facilitated planning poker sessions with distributed agile teams. He builds tools to make collaborative estimation faster and less painful.',
      viewGithub: 'View on GitHub',
    },
  },
  th: {
    backToBlog: '← กลับสู่บล็อก',
    publishedBy: '15 กุมภาพันธ์ 2026 · โดย รักษิต หนองบัว',
    title: 'Story Points vs Hours: ทีมของคุณควรใช้อะไรดี?',
    intro:
      'ในวงการ Agile แทบไม่มีหัวข้อไหนที่จะถูกถกเถียงกันยาวนานและเผ็ดร้อนเท่ากับคำถามที่ว่า "ควรประเมินงานเป็น Story Points หรือชั่วโมงดี?" ทั้งสองฝั่งต่างมีเหตุผลที่น่ารับฟัง ความจริงก็คือไม่มีคำตอบที่ถูกที่สุดสำหรับทุกคน แต่ขึ้นอยู่กับขนาดทีม ความเป็นมืออาชีพ ความสัมพันธ์กับลูกค้า และเป้าหมายของการประเมินงานของคุณ บทความนี้จะเจาะลึกทั้งสองแนวทางเพื่อให้คุณตัดสินใจได้อย่างถูกต้อง',
    sections: [
      {
        title: 'Story Points คืออะไร?',
        content: [
          'Story Points คือหน่วยวัด "ความพยายามสัมพัทธ์" (Relative Effort) ความซับซ้อน และความเสี่ยงในการทำงานให้สำเร็จ คำสำคัญคือ "สัมพัทธ์" งาน 5 แต้มไม่ใช่ 5 ชั่วโมง หรือ 5 วัน แต่มันหมายความว่าทีมเชื่อว่างานนี้ยากกว่างาน 1 แต้มประมาณ 5 เท่า และยากน้อยกว่างาน 8 แต้มเล็กน้อย',
          'Story Points จะขึ้นอยู่กับบริบทของแต่ละทีมโดยเฉพาะ งาน 5 แต้มของทีมอาวุโส 8 คน ย่อมต่างจากงาน 5 แต้มของทีมรุ่นใหม่ 3 คน ซึ่งนี่ไม่ใช่ข้อเสียแต่มันคือ "ฟีเจอร์" เพราะทีมจะติดตาม Velocity (จำนวนแต้มที่ทำเสร็จต่อสปริ้นท์) ของตัวเองและใช้มันเป็นฐานในการคาดการณ์สปริ้นท์ถัดไป',
          'ข้อดีที่สำคัญคือ Story Points จะไม่พังเมื่อมีการเปลี่ยนสมาชิกในทีม หากมีวิศวกรคนใหม่เข้ามา Velocity จะค่อยๆ ปรับตัวตามธรรมชาติในหนึ่งหรือสองสปริ้นท์ โดยไม่ต้องมานั่งปรับจูนคะแนนประเมินใหม่ทั้งหมดใน Backlog',
        ],
      },
      {
        title: 'การประเมินแบบชั่วโมง (Hour-Based) คืออะไร?',
        content: [
          'การประเมินแบบชั่วโมงคือสิ่งที่เราคุ้นเคยกันดี: งานแต่ละชิ้นจะถูกระบุเวลาที่คาดว่าจะใช้จริง เช่น งานนี้ใช้เวลา 8 ชั่วโมง หรือประมาณหนึ่งวันทำงานของนักพัฒนา',
          'ในทางทฤษฎี การประเมินแบบชั่วโมงควรจะนำไปใช้ได้กับทุกคน (Portable) งาน 8 ชั่วโมงควรจะใช้เวลาเท่ากันไม่ว่าใครจะทำ แต่ในทางปฏิบัติมันแทบจะไม่เป็นความจริง เพราะนักพัฒนาแต่ละคนมีความเร็วและความชำนาญในแต่ละส่วนของ Codebase ไม่เท่ากัน',
          'เสน่ห์ของการประเมินเป็นชั่วโมงคือความ "รูปธรรม" ผู้บริหารหรือลูกค้าที่คุ้นเคยกับการคิดค่าจ้างตามเวลาทำงานจะเข้าใจได้ทันทีว่า "ฟีเจอร์นี้ใช้เวลา 80 ชั่วโมง" ซึ่งนำไปคำนวณงบประมาณและวางแผนทรัพยากรได้ง่ายกว่า Story Point',
        ],
      },
      {
        title: 'ทำไมทีม Agile ส่วนใหญ่ถึงชอบ Story Points?',
        intro:
          'ทีม Agile ที่มีประสบการณ์ส่วนใหญ่มักจะลงเอยที่การใช้ Story Points หลังจากได้ทดลองใช้แบบชั่วโมงมาแล้ว นี่คือ 5 เหตุผลสำคัญ',
        reasons: [
          {
            title: '1. ชั่วโมงคือ "คำสัญญา" แต่แต้มคือ "การคาดการณ์"',
            desc: 'เมื่อนักพัฒนาบอกว่า "งานนี้ใช้เวลา 8 ชั่วโมง" คนฟังมักจะถือว่าเป็นคำมั่นสัญญา หากทำจริงใช้ 12 ชั่วโมง จะถูกมองว่า "ประเมินผิด" ทันที สิ่งนี้เปลี่ยนการประเมินงานให้เป็นการประเมินผลงาน (Performance Evaluation) ซึ่งทำให้คนประเมินต้องเผื่อเวลา (Pad estimates) เพื่อป้องกันตัวเอง แต่ Story Points ไม่มีภาระทางใจนี้เพราะมันไม่ใช่หน่วยเงินเดียวกับเงินเดือนหรือกำหนดส่งงาน',
          },
          {
            title: '2. มนุษย์เก่งในการเปรียบเทียบมากกว่าการประเมินค่าคงที่',
            desc: 'งานวิจัยทางจิตวิทยาพบว่ามนุษย์เก่งในการ "เปรียบเทียบ" สิ่งสองสิ่งว่าอันไหนใหญ่กว่ากัน การถามว่า "งานนี้ยากกว่างานที่แล้วไหม?" เป็นคำถามที่นักพัฒนาตอบได้แม่นยำกว่าการถามว่า "งานนี้ต้องใช้กี่ชั่วโมง?" ซึ่งขึ้นอยู่กับปัจจัยที่ควบคุมไม่ได้หลายอย่าง',
          },
          {
            title: '3. Velocity มีความเสถียรกว่าในระยะยาว',
            desc: 'การใช้ Story Points ช่วยให้ทีมเห็น Velocity ที่นิ่งได้ภายใน 3-5 สปริ้นท์ ในขณะที่การประเมินเป็นชั่วโมงมักจะพลาดเรื่องเวลาประชุม การรีวิวโค้ด หรือการสลับบริบทงาน (Context switching) ทีมที่ใช้ชั่วโมงมักพบว่า "เวลาที่ใช้จริง" สูงกว่าที่ประเมินไว้ 40-60% เสมอ',
          },
          {
            title: '4. โฟกัสที่ความซับซ้อน ไม่ใช่ความเร็วของรายบุคคล',
            desc: 'การประเมินเป็นชั่วโมงมักจะเผลอประเมินตามตัวบุคคล เช่น "ถ้าแอนทำใช้ 4 ชม. แต่ถ้าบอมทำใช้ 8 ชม." สิ่งนี้ทำให้การวางแผนยากขึ้น แต่ Story Points วัดความยากของ "ตัวงาน" เอง ไม่ว่าใครจะเป็นคนทำความยากของเนื้องานก็ยังเท่าเดิม',
          },
          {
            title: '5. ต้นทุนการประเมินใหม่ต่ำกว่า',
            desc: 'Backlog มีการเปลี่ยนแปลงตลอดเวลา หากใช้ Story Points คะแนนประเมินคร่าวๆ ในตอนแรกจะยังคงมีประโยชน์แม้จะมีการปรับรายละเอียดงานไปบ้าง แต่ถ้าใช้ชั่วโมง การเปลี่ยนแปลงเพียงเล็กน้อยอาจทำให้ตัวเลขเดิมใช้ไม่ได้เลยและต้องมานั่งประเมินใหม่ทั้งหมด',
          },
        ],
      },
      {
        title: 'เมื่อไหร่ที่การประเมินเป็น "ชั่วโมง" เมคเซนส์กว่า?',
        intro: 'แม้ Story Points จะมีข้อดีมาก แต่ในบางบริบท การประเมินเป็นชั่วโมงก็เป็นเครื่องมือที่ถูกต้องกว่า',
        bullets: [
          {
            title: 'การคิดเงินลูกค้าตามเวลาทำงานจริง (Time & Materials)',
            desc: 'หากคุณต้องส่งใบแจ้งหนี้ตามชั่วโมงทำงาน คุณจำเป็นต้องเก็บสถิติชั่วโมงจริง Story Points ไม่สามารถนำไปใส่ในใบแจ้งหนี้ได้โดยตรง',
          },
          {
            title: 'ข้อกำหนดทางกฎหมายหรือการตรวจสอบ (Compliance)',
            desc: 'บางอุตสาหกรรม เช่น งานภาครัฐหรือการเงิน มีข้อกำหนดให้ต้องลงบันทึกเวลาทำงานในระดับ Task เพื่อการตรวจสอบ (Audit)',
          },
          {
            title: 'สัญญา SLA ที่ระบุเวลาการแก้ไขงานชัดเจน',
            desc: 'หากสัญญาบอกว่า "ต้องแก้ Bug ภายใน 48 ชั่วโมง" ทีมจำเป็นต้องประเมินและวางแผนงานตามเวลาในปฏิทินจริง',
          },
          {
            title: 'ทีมขนาดเล็กมากหรือโปรเจ็กต์คนเดียว',
            desc: 'ถ้าคุณทำงานคนเดียวหรือมีกันแค่สองคน การใช้ Story Points อาจเพิ่มความยุ่งยากเกินความจำเป็น การใช้ชั่วโมงอาจจะง่ายและได้ผลลัพธ์ใกล้เคียงกัน',
          },
        ],
      },
    ],
    canYouUseBoth: {
      title: 'ใช้ทั้งคู่ได้ไหม?',
      p1: 'ได้ครับ — และทีมที่มีวุฒิภาวะหลายทีมก็ทำแบบนั้น โดยใช้แต่ละระบบตามวัตถุประสงค์ของมัน หัวใจสำคัญคือต้องแยกสองระบบนี้ออกจากกัน และห้ามสร้าง "สูตรแปลงแต้มเป็นชั่วโมง" เด็ดขาด',
      p2: 'ความล้มเหลวที่มักจะเกิดคือการที่ทีมเริ่มคำนวณว่า "1 แต้มเท่ากับกี่ชั่วโมง" เพื่อไปคุยกับลูกค้า สิ่งนี้จะทำลายข้อดีของ Story Points ไปทันทีและเพิ่มงานซ้ำซ้อน หาก Stakeholder ถามว่า "1 แต้มคือการทำงานกี่ชั่วโมง?" คำตอบควรจะเป็น "มันแปรผันตามแต่ละสปริ้นท์และปัจจัยอื่นๆ" ไม่ใช่ตัวเลขตายตัว',
    },
    transition: {
      title: 'วิธีเปลี่ยนจากชั่วโมงมาใช้ Story Points',
      steps: [
        {
          title: 'หา "งานอ้างอิง" เพื่อใช้เป็นเกณฑ์',
          desc: 'หางานที่ทำเสร็จไปแล้วที่ทุกคนยอมรับว่ามีความยากระดับ "ปานกลาง" แล้วกำหนดให้เป็น 5 แต้ม งานถัดไปทั้งหมดจะถูกเปรียบเทียบกับงานชิ้นนี้',
        },
        {
          title: 'รันควบคู่กันไปในช่วง 2 สปริ้นท์แรก',
          desc: 'ประเมินทั้งแบบแต้มและชั่วโมงไปก่อน แต่ใช้ชั่วโมงเป็นเพียง "ตาข่ายนิรภัย" ทางจิตใจเท่านั้น เมื่อทีมเริ่มมั่นใจค่อยตัดการประเมินแบบชั่วโมงออกไป',
        },
        {
          title: 'ห้ามแปลง Velocity ในช่วงแรกกลับเป็นชั่วโมง',
          desc: 'อย่ารีบคำนวณว่า "1 แต้ม = 7.6 ชั่วโมง" ในช่วงแรกๆ เพราะข้อมูล Velocity จะยังไม่นิ่งพอ และมันจะทำให้ทีมกลับไปติดหล่มปัญหาเดิมๆ',
        },
        {
          title: 'สื่อสารการเปลี่ยนแปลงกับผู้เกี่ยวข้องให้ชัดเจน',
          desc: 'อธิบายว่าทีมกำลังเปลี่ยนไปใช้ระบบคาดการณ์ที่แม่นยำกว่า ซึ่งอิงจากข้อมูลจริงในอดีต (Empirical data) แทนที่จะเป็นการเดาเวลาล่วงหน้า',
        },
      ],
    },
    bottomLine: {
      title: 'บทสรุป',
      p1: 'สำหรับทีมพัฒนาส่วนใหญ่ Story Points คือเครื่องมือประเมินงานที่ดีกว่า เพราะช่วยให้เกิดการพูดคุยถึงความซับซ้อนของงานอย่างซื่อสัตย์ และช่วยให้การคาดการณ์อนาคตแม่นยำขึ้นในระยะยาว',
      p2: 'ใช้ชั่วโมงเฉพาะเมื่อมีพันธะภายนอกบังคับจริงๆ เช่น เรื่องการคิดเงินหรือข้อกฎหมาย และหากต้องใช้ ให้ใช้มันควบคู่ไปกับ Story Points โดยแยกวัตถุประสงค์ให้ชัดเจน',
      p3: 'ไม่ว่าคุณจะเลือกอะไร สิ่งที่มีค่าที่สุดไม่ใช่ตัวเลข แต่คือ "การที่ทีมได้นั่งคุยรายละเอียดงานด้วยกัน" การทำ Planning Poker ที่ทำให้เห็นจุดยากที่ซ่อนอยู่ถือเป็นความสำเร็จแล้ว แม้ผลการประเมินสุดท้ายจะคลาดเคลื่อนไปบ้างก็ตาม',
      cta: 'เริ่มประเมินงานกับทีมของคุณ',
    },
    footerLinks: {
      allArticles: '← บทความทั้งหมด',
      storyPointsEstimator: 'Story Points Estimator',
      sprintPlanning: 'Sprint Planning',
      fibonacciGuide: 'ทำไมถึงใช้เลข Fibonacci ในการประเมินงาน?',
    },
    author: {
      bio: 'รักษิต คือผู้สร้าง Corgi Planning Poker และเป็นวิศวกรซอฟต์แวร์ที่ผ่านประสบการณ์การรันเซสชัน Planning Poker กับทีม Agile ระดับโลก เขาสร้างเครื่องมือนี้เพื่อช่วยให้การประเมินงานเป็นเรื่องสนุกและง่ายขึ้นสำหรับทุกคน',
      viewGithub: 'ดูบน GitHub',
    },
  },
}

export const metadata: Metadata = {
  title: 'Story Points vs Hours: Which Should Your Team Use?',
  description:
    'Story points vs hours for agile estimation — key differences, when each works best, and why most experienced scrum teams prefer story points for sprint planning.',
  alternates: {
    canonical: 'https://www.corgiplanningpoker.com/blog/story-points-vs-hours',
    languages: {
      en: 'https://www.corgiplanningpoker.com/blog/story-points-vs-hours',
      th: 'https://www.corgiplanningpoker.com/blog/story-points-vs-hours?hl=th',
    },
  },
}

export default async function StoryPointsVsHoursPage() {
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
            {section.reasons && (
              <div className="mt-5 flex flex-col gap-4">
                {section.reasons.map((reason, rIdx) => (
                  <div key={rIdx}>
                    <p className="mb-1 text-sm font-semibold">{reason.title}</p>
                    <p className="text-sm leading-relaxed text-muted-foreground">{reason.desc}</p>
                  </div>
                ))}
              </div>
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
          <h2 className="mb-3 mt-8 text-xl font-semibold">{t.canYouUseBoth.title}</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">{t.canYouUseBoth.p1}</p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{t.canYouUseBoth.p2}</p>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 mt-8 text-xl font-semibold">{t.transition.title}</h2>
          <div className="mt-5 flex flex-col gap-4">
            {t.transition.steps.map((step, idx) => (
              <div key={idx} className="rounded-xl border border-border/40 p-5">
                <p className="mb-1 text-xs font-bold uppercase tracking-widest text-primary">
                  Step {idx + 1}
                </p>
                <p className="mb-2 text-sm font-semibold">{step.title}</p>
                <p className="text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="mb-3 mt-8 text-xl font-semibold">{t.bottomLine.title}</h2>
          {[t.bottomLine.p1, t.bottomLine.p2, t.bottomLine.p3].map((p, idx) => (
            <p key={idx} className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {p}
            </p>
          ))}
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
            href="/story-points-estimator"
            className="text-muted-foreground transition-colors hover:text-primary"
          >
            {t.footerLinks.storyPointsEstimator}
          </Link>
          <Link
            href="/sprint-planning"
            className="text-muted-foreground transition-colors hover:text-primary"
          >
            {t.footerLinks.sprintPlanning}
          </Link>
          <Link
            href="/blog/planning-poker-fibonacci"
            className="text-primary underline-offset-4 hover:underline"
          >
            {t.footerLinks.fibonacciGuide}
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
