import type { Metadata } from 'next'
import Link from 'next/link'
import { getLocale } from 'next-intl/server'

const translations = {
  en: {
    backToBlog: '← Back to Blog',
    publishedBy: 'January 15, 2026 · By Raksit Nongbua',
    title: 'How Planning Poker Works: A Complete Guide for Agile Teams',
    intro:
      'Planning poker is one of the most widely adopted estimation techniques in agile software development. On the surface it looks like a simple card game, but its design encodes decades of research on group decision-making, cognitive bias, and the psychology of uncertainty. If you have ever sat through an estimation meeting that turned into a two-hour argument or produced numbers nobody believed, planning poker is the antidote. This guide walks through what it is, where it came from, how to run a session, and what to watch out for.',
    sections: [
      {
        title: 'The Origins of Planning Poker',
        content: [
          'Planning poker was introduced by James Grenning in 2002 in an article titled Planning Poker or How to Avoid Analysis Paralysis while Release Planning. At the time, Grenning was looking for a way to make release planning faster and more accurate without devolving into the familiar pattern of one or two dominant voices setting all the estimates.',
          'The technique gained wide recognition when Mike Cohn included it in his influential 2005 book Agile Estimating and Planning. Cohn refined the practice, popularised the use of the Fibonacci-inspired card deck, and helped codify planning poker as a standard tool in the Scrum practitioner\'s toolkit. Today it is used by software teams worldwide, from two-person startups to enterprise engineering organisations with hundreds of developers.',
          'The name itself is a deliberate nod to poker. Both games involve hidden information revealed simultaneously — and that simultaneous reveal is the single most important design choice in the whole technique, as we will explore below.',
        ],
      },
      {
        title: 'How a Planning Poker Session Works Step by Step',
        intro:
          'Running a planning poker session is straightforward once you understand the rhythm. Here is a detailed breakdown of each step.',
        steps: [
          {
            title: 'Gather the team and the backlog',
            desc: 'The product owner, scrum master, and all development team members join the session. Everyone needs a set of estimation cards — either physical cards or a digital tool like Corgi Planning Poker. The product owner comes prepared with the user stories that need to be estimated, ideally with acceptance criteria already written.',
          },
          {
            title: 'Read and discuss the story',
            desc: 'The product owner reads out the user story and answers clarifying questions. This phase is crucial. Estimates are only as accurate as the team\'s shared understanding of the work. Good questions at this stage include: What does "done" look like? Are there known technical risks? Does this touch any legacy systems? The goal is not to exhaustively design a solution, but to reach a common mental model of the scope.',
          },
          {
            title: 'Each estimator privately selects a card',
            desc: 'Once discussion winds down, every team member independently selects the card they think best represents the relative effort for the story. Cards stay face-down (or hidden in a digital tool). No one announces their estimate yet. This private selection step is where individual judgment forms, free from the influence of others.',
          },
          {
            title: 'Reveal simultaneously',
            desc: 'All estimators flip their cards at the same time. This is the poker moment. When all estimates agree or are close, the team picks a value and moves on quickly. When estimates diverge significantly — say, a 2 and a 13 on the same story — those outliers hold the real information. The person who estimated highest and the person who estimated lowest are asked to explain their reasoning.',
          },
          {
            title: 'Discuss outliers and re-estimate',
            desc: 'After hearing the outlier rationale, the team discusses briefly. The high estimator may have spotted a hidden dependency. The low estimator may have a shortcut the others hadn\'t considered. These conversations often surface assumptions that were never made explicit. After discussion, the team votes again. This cycle repeats until consensus is reached, typically within two or three rounds.',
          },
          {
            title: 'Record the estimate and move on',
            desc: 'Once consensus is reached, record the story point value against the backlog item and advance to the next story. A well-run session can estimate 10–15 stories per hour. If a single story consumes more than 10 minutes, it is usually a sign the story needs to be split or the acceptance criteria need more work — not a reason to keep estimating.',
          },
        ],
      },
    ],
    whySimultaneous: {
      title: 'Why Simultaneous Card Reveal Matters',
      intro:
        'The simultaneous reveal is not a gimmick. It directly addresses two well-documented cognitive biases that plague sequential estimation: anchoring and groupthink.',
      anchoring:
        'Anchoring bias occurs when the first number stated in a negotiation or discussion acts as a psychological anchor that pulls all subsequent estimates toward it. Research by Tversky and Kahneman in 1974 demonstrated that people adjust insufficiently from an initial anchor even when they know it is arbitrary. In a traditional meeting, the first person to say "I think this is a 5" effectively sets the range of the whole conversation. Planning poker eliminates this by ensuring no estimate is revealed until all estimates are formed.',
      groupthink:
        'Groupthink is the tendency for teams to converge on a shared view in order to maintain harmony and avoid conflict, often at the expense of critical thinking. In estimation, this means junior developers defer to the tech lead, or everyone adjusts their view once they see the project manager nodding at a particular number. Simultaneous reveal forces every team member to commit to an independent judgment before seeing others\' views, producing genuinely diverse estimates when the story has genuine ambiguity.',
      result:
        'The result is that planning poker surfaces disagreement that would otherwise be suppressed. That disagreement is valuable — it reveals different mental models of the work, which when reconciled, lead to better estimates and fewer late-sprint surprises.',
    },
    choosingDeck: {
      title: 'Choosing the Right Card Deck',
      intro:
        'The card deck you use shapes how your team thinks about estimation. There is no single right answer, but here are the most common options and when each works best.',
      fibonacci:
        'Fibonacci sequence (1, 2, 3, 5, 8, 13, 21) is the most popular choice. The gaps between values grow as numbers increase, which reflects the reality that large stories carry more uncertainty and that false precision in high estimates is misleading. Estimating a story as 19 rather than 21 implies a level of accuracy that does not exist.',
      tshirt:
        'T-shirt sizes (XS, S, M, L, XL) are useful for early discovery or roadmap-level estimation where a team is trying to size epics rather than individual stories. They remove the temptation to equate numbers with hours, which is especially helpful when stakeholders are in the room.',
      powers:
        'Powers of 2 (1, 2, 4, 8, 16, 32) provide even wider gaps than Fibonacci and work well for teams doing rough capacity planning across quarters.',
      nonNumeric:
        'Beyond number cards, most decks include a ? card for "I don\'t have enough information to estimate," an infinity card for "this story is too large to estimate and needs to be split," and a coffee cup card to call for a break. These non-numeric cards carry as much information as any number and should be treated seriously rather than jokingly.',
    },
    commonMistakes: {
      title: 'Common Planning Poker Mistakes (and How to Avoid Them)',
      list: [
        {
          title: '1. Estimating tasks instead of user stories',
          desc: 'Story points measure the complexity and effort of delivering a slice of user value, not a technical subtask. When teams break work down to the task level before estimating, they lose the ability to use velocity meaningfully. Estimate stories at the level where a user can recognise the value delivered.',
        },
        {
          title: '2. Letting the product owner dominate the discussion',
          desc: 'The product owner answers questions and clarifies requirements but should not estimate. Their job is to define what, not how much. When product owners express opinions about effort ("this should be easy"), they inadvertently anchor the team\'s estimates.',
        },
        {
          title: '3. Equating story points with hours',
          desc: 'This is the most common mistake and arguably the most damaging. Story points are relative, not absolute. A 5-point story is not "five hours of work." The moment a team starts thinking in hours, the estimate becomes a commitment rather than a forecast, and the psychological pressure to hit estimates overrides the cognitive benefits of relative sizing.',
        },
        {
          title: '4. Skipping stories after the first vote converges',
          desc: 'When the first round of estimates all agree, teams are tempted to skip discussion entirely. Occasionally, unanimous agreement simply means everyone is equally uncertain. A quick ten-second gut-check — "does everyone feel genuinely confident about this?" — costs almost nothing and catches the stories where false consensus is masking hidden risk.',
        },
      ],
    },
    onlineVsPerson: {
      title: 'Planning Poker Online vs In-Person',
      p1: 'Planning poker was originally designed for co-located teams with physical card decks. Today, the majority of agile teams are distributed or hybrid, and online planning poker tools have become the default. Digital tools offer several advantages over physical cards that are worth naming explicitly.',
      p2: 'The simultaneous reveal is easier to enforce online. With physical cards, someone can peek or reveal early. A well-designed online tool locks all estimates until every participant has voted and then reveals them all at once.',
      p3: 'Statistics are surfaced automatically. After a reveal, a good tool shows the average, the spread, and who voted what — giving the facilitator immediate data about where disagreement lies without manual counting.',
      p4: 'Remote participants are first-class citizens. In a hybrid meeting where some people are in a room and some are on video, physical cards exclude remote participants. An online tool treats every participant identically regardless of location.',
      p5: 'History is preserved. Online sessions keep a record of estimates, which is invaluable for retrospectives and for comparing estimated vs actual velocity over time.',
      p6: 'Corgi shows the vote average, spread, and every individual vote the moment the facilitator triggers a reveal — no manual counting, no whiteboard tallying needed.',
    },
    startSession: {
      title: 'Start Your Next Session',
      p1: 'Planning poker is effective precisely because it is simple. The rules are easy to learn, sessions run fast when facilitated well, and the simultaneous reveal consistently surfaces the information a team needs to make good decisions. Whether you are onboarding a new team to agile estimation or looking to improve the quality of an existing process, a well-run planning poker session is one of the highest-return investments you can make in sprint reliability.',
      p2: 'Ready to run a session? Corgi Planning Poker is free, requires no account, and your room is ready in seconds.',
      cta: 'Start a free planning poker room',
    },
    footerLinks: {
      allArticles: '← All Articles',
      scrumPoker: 'Scrum Poker',
      agileEstimation: 'Agile Estimation',
    },
    author: {
      bio: 'Raksit is the creator of Corgi Planning Poker and a software engineer who has facilitated planning poker sessions with distributed agile teams. He builds tools to make collaborative estimation faster and less painful.',
      viewGithub: 'View on GitHub',
    },
  },
  th: {
    backToBlog: '← กลับสู่บล็อก',
    publishedBy: '15 มกราคม 2026 · โดย รักษิต หนองบัว',
    title: 'Planning Poker คืออะไร? คู่มือฉบับสมบูรณ์สำหรับทีม Agile',
    intro:
      'Planning Poker เป็นหนึ่งในเทคนิคการประเมินงานที่ได้รับความนิยมมากที่สุดในการพัฒนาซอฟต์แวร์แบบ Agile แม้ภายนอกจะดูเหมือนเกมไพ่ธรรมดาๆ แต่เบื้องหลังกลับถูกออกแบบมาโดยอ้างอิงจากงานวิจัยด้านการตัดสินใจของกลุ่ม (Group Decision-making) และการลดอคติทางความคิด (Cognitive Bias) หากคุณเคยผ่านการประชุมประเมินงานที่กลายเป็นการโต้เถียงกันนานนับชั่วโมง หรือได้ตัวเลขที่ไม่มีใครเชื่อถือ Planning Poker คือคำตอบที่จะช่วยคุณได้ คู่มือนี้จะพาคุณไปรู้จักกับที่มา วิธีการรันเซสชัน และสิ่งที่ต้องระวัง',
    sections: [
      {
        title: 'ที่มาของ Planning Poker',
        content: [
          'Planning Poker ถูกริเริ่มโดย James Grenning ในปี 2002 ผ่านบทความเรื่อง "Planning Poker or How to Avoid Analysis Paralysis while Release Planning" ในขณะนั้น Grenning กำลังมองหาวิธีที่จะทำให้การวางแผนการส่งมอบงาน (Release Planning) รวดเร็วและแม่นยำยิ่งขึ้น โดยไม่ต้องการให้เกิดรูปแบบเดิมๆ ที่มีคนเพียงคนเดียวหรือสองคนเป็นคนกำหนดตัวเลขการประเมินทั้งหมด',
          'เทคนิคนี้ได้รับการยอมรับอย่างกว้างขวางเมื่อ Mike Cohn บรรจุลงในหนังสือ "Agile Estimating and Planning" (2005) ที่มีอิทธิพลอย่างมาก Cohn ได้ขัดเกลากระบวนการให้น่าสนใจยิ่งขึ้นโดยการนำชุดการ์ดเลข Fibonacci มาใช้ และช่วยผลักดันให้ Planning Poker กลายเป็นมาตรฐานสำคัญในชุดเครื่องมือสำหรับผู้ปฏิบัติงาน Scrum ทั่วโลก',
          'ชื่อของมันได้รับแรงบันดาลใจมาจากเกมโป๊กเกอร์อย่างตั้งใจ ทั้งสองเกมมีกลไกที่เหมือนกันคือ "ข้อมูลที่ซ่อนอยู่จะถูกเปิดเผยพร้อมกัน" — ซึ่งการเปิดผลพร้อมกันนี้เป็นหัวใจสำคัญที่สุดของเทคนิคนี้ ดังที่เราจะได้เจาะลึกต่อไป',
        ],
      },
      {
        title: 'ขั้นตอนการจัดเซสชัน Planning Poker แบบทีละขั้นตอน',
        intro:
          'การจัดเซสชัน Planning Poker นั้นทำได้ง่ายเมื่อคุณเข้าใจจังหวะการทำงาน นี่คือรายละเอียดของแต่ละขั้นตอน',
        steps: [
          {
            title: '1. เตรียมทีมและ Backlog',
            desc: 'Product Owner, Scrum Master และสมาชิกทีมพัฒนาเข้าร่วมเซสชัน ทุกคนต้องมีชุดการ์ดประเมิน (จะเป็นการ์ดกระดาษหรือเครื่องมือดิจิทัลอย่าง Corgi Planning Poker ก็ได้) โดย Product Owner จะเตรียม User Stories ที่ต้องการประเมิน ซึ่งควรมีเงื่อนไขการรับมอบงาน (Acceptance Criteria) ที่ชัดเจนพร้อมอยู่แล้ว',
          },
          {
            title: '2. อ่านและอภิปราย Story',
            desc: 'Product Owner อ่านรายละเอียดของ User Story และตอบคำถามเพื่อให้ทีมเข้าใจตรงกัน ขั้นตอนนี้สำคัญมาก เพราะความแม่นยำของการประเมินขึ้นอยู่กับความเข้าใจร่วมกันในขอบเขตงาน ตัวอย่างคำถามที่ดีเช่น "คำว่าเสร็จ (Done) ของงานนี้คืออะไร?" "มีความเสี่ยงทางเทคนิคที่รู้อยู่แล้วไหม?" เป้าหมายคือการสร้างภาพจำลองของงานในใจที่ตรงกัน ไม่ใช่การออกแบบวิธีแก้งานทั้งหมด',
          },
          {
            title: '3. สมาชิกแต่ละคนเลือกการ์ดแบบลับๆ',
            desc: 'เมื่อการอภิปรายเสร็จสิ้น สมาชิกแต่ละคนจะเลือกการ์ดที่ตนคิดว่าเหมาะสมกับความยากง่ายของงานนั้นที่สุด โดยยังไม่ให้ใครเห็น ขั้นตอนนี้ช่วยให้แต่ละคนได้ใช้ดุลยพินิจของตนเองอย่างเต็มที่ โดยไม่ถูกโน้มน้าวจากความคิดเห็นของคนอื่น',
          },
          {
            title: '4. เปิดผลพร้อมกัน',
            desc: 'เมื่อทุกคนพร้อมแล้วจึงเปิดการ์ดพร้อมกัน หากคะแนนทุกคนตรงกันหรือใกล้เคียงกัน ทีมสามารถสรุปค่าและย้ายไปยังงานถัดไปได้อย่างรวดเร็ว แต่หากคะแนนต่างกันมาก (เช่น คนหนึ่งให้ 2 อีกคนให้ 13) คนที่ให้คะแนนสูงสุดและต่ำสุดจะต้องอธิบายเหตุผลของตน',
          },
          {
            title: '5. อภิปรายผลต่างและประเมินใหม่',
            desc: 'หลังฟังเหตุผล ทีมจะพูดคุยกันสั้นๆ คนที่ให้คะแนนสูงอาจเห็นจุดยากที่คนอื่นมองข้าม หรือคนที่ให้คะแนนต่ำอาจมีวิธีแก้ปัญหาที่ง่ายกว่าที่คนอื่นคิด หลังจากอภิปรายแล้วให้ทีมลงคะแนนใหม่อีกครั้ง ทำซ้ำจนกว่าจะได้ข้อสรุป (Consensus) ซึ่งมักจะใช้เวลาเพียง 2-3 รอบเท่านั้น',
          },
          {
            title: '6. บันทึกผลและเริ่มงานถัดไป',
            desc: 'เมื่อได้ข้อสรุปแล้ว ให้บันทึก Story Point ลงใน Backlog และเริ่มงานชิ้นถัดไป เซสชันที่ดีควรประเมินงานได้ 10-15 Stories ต่อชั่วโมง หากงานชิ้นใดใช้เวลาประเมินนานกว่า 10 นาที แสดงว่างานนั้นอาจต้องถูกแบ่งย่อยลงไปอีก หรือเงื่อนไขการรับมอบงานยังไม่ชัดเจนพอ',
          },
        ],
      },
    ],
    whySimultaneous: {
      title: 'ทำไมการ "เปิดผลพร้อมกัน" ถึงสำคัญ?',
      intro:
        'การเปิดการ์ดพร้อมกันไม่ใช่แค่ลูกเล่น แต่มันถูกออกแบบมาเพื่อแก้ปัญหาอคติทางความคิด (Cognitive Biases) ที่มักเกิดขึ้นในการประเมินงานแบบเดิมๆ',
      anchoring:
        'Anchoring bias (อคติจากการยึดติด) เกิดขึ้นเมื่อตัวเลขแรกที่ถูกพูดออกมาในที่ประชุม กลายเป็นจุดยึดเหนี่ยวที่ดึงคะแนนของคนอื่นให้คล้อยตาม งานวิจัยพบว่าคนเรามักจะปรับแก้ความคิดจากจุดยึดเหนี่ยวแรกได้ไม่ดีนัก แม้จะรู้ว่าตัวเลขนั้นอาจจะไม่ถูกต้องก็ตาม Planning Poker แก้ปัญหานี้โดยบังคับให้ทุกคนต้องสรุปความคิดของตนเองก่อนที่จะเห็นคะแนนของคนอื่น',
      groupthink:
        'Groupthink (การคิดตามกลุ่ม) คือแนวโน้มที่สมาชิกในทีมจะยอมคล้อยตามความเห็นส่วนใหญ่เพื่อหลีกเลี่ยงความขัดแย้ง เช่น สมาชิกที่ยังไม่มีประสบการณ์อาจจะเออออตาม Tech Lead การเปิดผลพร้อมกันบังคับให้ทุกคนต้องยืนยันความคิดของตัวเอง ทำให้เกิดความหลากหลายของข้อมูลและเปิดโอกาสให้คนเห็นต่างได้แสดงเหตุผลออกมา',
      result:
        'ผลที่ได้คือ Planning Poker จะช่วยดึงข้อมูลที่ซ่อนอยู่ออกมาผ่านความเห็นต่าง ซึ่งเมื่อนำมารวมกันจะช่วยให้การประเมินแม่นยำขึ้นและลดโอกาสเกิดเหตุการณ์ไม่คาดฝันในช่วงท้ายสปริ้นท์',
    },
    choosingDeck: {
      title: 'การเลือกชุดการ์ดที่เหมาะสม',
      intro:
        'ชุดการ์ดที่คุณเลือกจะมีผลต่อวิธีที่ทีมคิดเกี่ยวกับการประเมิน นี่คือตัวเลือกที่นิยมใช้กันมากที่สุด',
      fibonacci:
        'ชุดเลข Fibonacci (1, 2, 3, 5, 8, 13, 21) เป็นตัวเลือกที่ได้รับความนิยมสูงสุด ช่องว่างระหว่างตัวเลขจะกว้างขึ้นเมื่อค่าเพิ่มขึ้น สะท้อนถึงความเป็นจริงที่ว่างานชิ้นใหญ่จะมีความไม่แน่นอนสูงกว่า และการพยายามประเมินให้ละเอียดเกินไป (เช่น 19 แทนที่จะเป็น 21) นั้นไม่มีความหมายในทางปฏิบัติ',
      tshirt:
        'ขนาดเสื้อยืด (XS, S, M, L, XL) เหมาะสำหรับการประเมินระดับ Roadmap หรือช่วงเริ่มต้นที่ยังไม่เห็นรายละเอียดงานมากนัก ช่วยลดความพยายามที่จะเอาตัวเลขไปเทียบกับชั่วโมงการทำงานได้ดี',
      powers:
        'เลขยกกำลังของ 2 (1, 2, 4, 8, 16, 32) ให้ช่องว่างที่กว้างกว่า Fibonacci เหมาะสำหรับทีมที่ต้องการวางแผนคร่าวๆ ในระดับรายไตรมาส',
      nonNumeric:
        'นอกจากตัวเลขแล้ว ส่วนใหญ่มักจะมีการ์ดพิเศษอย่าง ? (ข้อมูลไม่พอประเมิน), ∞ (งานใหญ่เกินไปต้องแบ่งย่อย), และถ้วยกาแฟ (ขอพักเบรก) การ์ดเหล่านี้มีข้อมูลสำคัญไม่แพ้ตัวเลขและควรได้รับการพิจารณาอย่างจริงจัง',
    },
    commonMistakes: {
      title: 'ข้อผิดพลาดที่พบบ่อย (และวิธีป้องกัน)',
      list: [
        {
          title: '1. ประเมิน Task ย่อยแทน User Story',
          desc: 'Story Point ควรวัดความซับซ้อนของการส่งมอบ "คุณค่า" ให้ผู้ใช้ ไม่ใช่ขั้นตอนการทำงานทางเทคนิค การประเมินในระดับที่ผู้ใช้เข้าใจจะช่วยให้ Velocity ของทีมมีความหมายมากขึ้นในระยะยาว',
        },
        {
          title: '2. ให้ Product Owner เป็นคนประเมินหรือชี้นำ',
          desc: 'Product Owner มีหน้าที่ตอบคำถามและเคลียร์ขอบเขตงาน แต่ไม่ควรเป็นคนประเมินหรือแสดงความเห็นเรื่องความยากง่าย เพราะคำพูดอย่าง "งานนี้ก็น่าจะง่ายนะ" จะกลายเป็นจุดยึดเหนี่ยวที่โน้มน้าวคะแนนของทีมโดยไม่ตั้งใจ',
        },
        {
          title: '3. การนำ Story Point ไปเทียบกับชั่วโมงทำงาน',
          desc: 'นี่คือข้อผิดพลาดที่พบบ่อยและร้ายแรงที่สุด Story Point คือการวัดความยากง่ายสัมพัทธ์ (Relative Effort) ไม่ใช่เวลาทำงานจริง เพราะเวลาของแต่ละคนไม่เท่ากัน การพยายามคิดเป็นชั่วโมงจะทำให้ทีมรู้สึกถูกกดดันและทำลายความเชื่อมั่นในระบบ Story Point',
        },
        {
          title: '4. ข้ามการอภิปรายเมื่อทุกคนให้คะแนนตรงกันในรอบแรก',
          desc: 'ในบางครั้ง การที่ทุกคนให้คะแนนตรงกันอาจหมายถึงทุกคนมีความไม่แน่ใจเท่าๆ กัน การเสียเวลาเพียง 10 วินาทีเพื่อถามย้ำว่า "ทุกคนมั่นใจจริงๆ ใช่ไหม?" จะช่วยจับความเสี่ยงที่อาจซ่อนอยู่ใต้ความเห็นพ้องต้องกันปลอมๆ ได้',
        },
      ],
    },
    onlineVsPerson: {
      title: 'Planning Poker ออนไลน์ vs เจอหน้ากันจริง',
      p1: 'เดิมที Planning Poker ถูกออกแบบมาให้ใช้การ์ดกระดาษ แต่ปัจจุบันทีมส่วนใหญ่ทำงานแบบ Distributed หรือ Hybrid เครื่องมือออนไลน์จึงกลายเป็นมาตรฐานใหม่ ซึ่งมีข้อดีหลายประการที่เหนือกว่าการใช้การ์ดกระดาษ',
      p2: 'การเปิดผลพร้อมกันทำได้ง่ายกว่า: ในเครื่องมือดิจิทัล ระบบจะล็อกการเลือกไว้และเปิดเผยพร้อมกันทั้งหมด ป้องกันการแอบดูหรือเปิดผลก่อนเวลา',
      p3: 'แสดงผลสถิติทันที: เครื่องมือที่ดีจะคำนวณค่าเฉลี่ยและกระจายของคะแนนให้ทันที ช่วยให้ผู้ดำเนินรายการเห็นจุดที่ต้องพูดคุยได้รวดเร็วโดยไม่ต้องนับคะแนนเอง',
      p4: 'รองรับทีม Remote: การใช้เครื่องมือออนไลน์ทำให้ทุกคนไม่ว่าจะอยู่ที่ไหนก็มีส่วนร่วมได้อย่างเท่าเทียมกัน ไม่เหมือนการใช้การ์ดจริงที่คนในห้องประชุมจะได้เปรียบกว่าคนทางบ้าน',
      p5: 'เก็บบันทึกประวัติ: การประเมินออนไลน์จะเก็บบันทึกไว้เสมอ ซึ่งมีประโยชน์มากสำหรับการทำ Retrospective หรือการเปรียบเทียบ Velocity ของทีมในระยะยาว',
      p6: 'Corgi แสดงค่าเฉลี่ยและรายละเอียดคะแนนทันทีที่เปิดการ์ด — ไม่ต้องมานั่งบวกเลขหรือขีดเขียนกระดานให้เสียเวลา',
    },
    startSession: {
      title: 'เริ่มการประเมินงานชิ้นถัดไปของคุณ',
      p1: 'Planning Poker ได้ผลดีเพราะมันเรียบง่าย กฎเกณฑ์เรียนรู้ได้เร็ว และการเปิดผลพร้อมกันช่วยดึงข้อมูลที่ทีมต้องการเพื่อการตัดสินใจที่ดีที่สุด ไม่ว่าคุณจะเพิ่งเริ่มใช้ Agile หรือต้องการปรับปรุงกระบวนการเดิม การจัดเซสชัน Planning Poker ที่ดีคือหนึ่งในการลงทุนที่คุ้มค่าที่สุดเพื่อความสำเร็จของโปรเจ็กต์',
      p2: 'พร้อมรันเซสชันหรือยัง? Corgi Planning Poker ใช้งานฟรี ไม่ต้องมีบัญชี และสร้างห้องเสร็จภายในไม่กี่วินาที',
      cta: 'สร้างห้อง Planning Poker ฟรี',
    },
    footerLinks: {
      allArticles: '← บทความทั้งหมด',
      scrumPoker: 'Scrum Poker',
      agileEstimation: 'Agile Estimation',
    },
    author: {
      bio: 'รักษิต คือผู้สร้าง Corgi Planning Poker และเป็นวิศวกรซอฟต์แวร์ที่ผ่านประสบการณ์การรันเซสชัน Planning Poker กับทีม Agile ระดับโลก เขาสร้างเครื่องมือนี้เพื่อช่วยให้การประเมินงานเป็นเรื่องสนุกและง่ายขึ้นสำหรับทุกคน',
      viewGithub: 'ดูบน GitHub',
    },
  },
}

export const metadata: Metadata = {
  title: 'How Planning Poker Works: A Complete Guide for Agile Teams',
  description:
    'A complete guide to planning poker for agile teams. Learn the rules, card deck options, common mistakes, and how to run effective estimation sessions.',
  alternates: {
    canonical: 'https://www.corgiplanningpoker.com/blog/how-planning-poker-works',
  },
}

export default async function HowPlanningPokerWorksPage() {
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
            {section.steps && (
              <div className="mt-5 flex flex-col gap-5">
                {section.steps.map((step, sIdx) => (
                  <div key={sIdx} className="rounded-xl border border-border/40 p-5">
                    <p className="mb-2 text-sm font-semibold">{step.title}</p>
                    <p className="text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        ))}

        <section className="mb-8">
          <h2 className="mb-3 mt-8 text-xl font-semibold">{t.whySimultaneous.title}</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">{t.whySimultaneous.intro}</p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            <strong className="font-semibold text-foreground">Anchoring bias</strong>{' '}
            {t.whySimultaneous.anchoring}
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            <strong className="font-semibold text-foreground">Groupthink</strong>{' '}
            {t.whySimultaneous.groupthink}
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            {t.whySimultaneous.result}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 mt-8 text-xl font-semibold">{t.choosingDeck.title}</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">{t.choosingDeck.intro}</p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            <strong className="font-semibold text-foreground">Fibonacci</strong>{' '}
            {t.choosingDeck.fibonacci}
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            <strong className="font-semibold text-foreground">T-shirt sizes</strong>{' '}
            {t.choosingDeck.tshirt}
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            <strong className="font-semibold text-foreground">Powers of 2</strong>{' '}
            {t.choosingDeck.powers}
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            {t.choosingDeck.nonNumeric}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 mt-8 text-xl font-semibold">{t.commonMistakes.title}</h2>
          <div className="mt-4 flex flex-col gap-4">
            {t.commonMistakes.list.map((item, idx) => (
              <div key={idx}>
                <p className="mb-1 text-sm font-semibold">{item.title}</p>
                <p className="text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 mt-8 text-xl font-semibold">{t.onlineVsPerson.title}</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">{t.onlineVsPerson.p1}</p>
          {[t.onlineVsPerson.p2, t.onlineVsPerson.p3, t.onlineVsPerson.p4, t.onlineVsPerson.p5].map(
            (p, idx) => (
              <p key={idx} className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {p}
              </p>
            )
          )}
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            {t.onlineVsPerson.p6}
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-3 mt-8 text-xl font-semibold">{t.startSession.title}</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">{t.startSession.p1}</p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{t.startSession.p2}</p>
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
            href="/scrum-poker"
            className="text-muted-foreground transition-colors hover:text-primary"
          >
            {t.footerLinks.scrumPoker}
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
