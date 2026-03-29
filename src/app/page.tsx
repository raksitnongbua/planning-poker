import HomeComponent from '@/components/Home'

const appSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Corgi Planning Poker',
  alternateName: 'Free Online Planning Poker',
  url: 'https://www.corgiplanningpoker.com',
  applicationCategory: 'BusinessApplication',
  applicationSubCategory: 'Project Management',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    availability: 'https://schema.org/OnlineOnly',
  },
  description:
    'Free online planning poker tool for agile teams to estimate story points collaboratively in real-time. Includes Jira integration with ticket queue and story point sync. No registration required.',
  datePublished: '2024-01-01',
  softwareVersion: '2.8.1',
  screenshot: [
    {
      '@type': 'ImageObject',
      url: 'https://www.corgiplanningpoker.com/images/corgi-planning-poker-preview.png',
      caption: 'Corgi Planning Poker homepage',
    },
    {
      '@type': 'ImageObject',
      url: 'https://www.corgiplanningpoker.com/images/corgi-planning-poker-room-preview.png',
      caption: 'Corgi Planning Poker room view',
    },
  ],
  featureList: [
    'Real-time collaborative voting',
    'Customizable card decks (Fibonacci, T-shirt sizes, custom)',
    'Story point estimation',
    'No registration required',
    'Invite via room link',
    'Spectator mode',
    'Google Sign-In for cross-device sync',
    'Jira integration — queue multiple Jira tickets for sequential estimation',
    'Sync final story points back to Jira in one click',
    'Estimate Jira issues as story points or time (days)',
    'Free forever',
  ],
  inLanguage: 'en-US',
  isAccessibleForFree: true,
  creator: {
    '@type': 'Person',
    name: 'Raksit Nongbua',
    email: 'tan.raksit@gmail.com',
  },
  publisher: {
    '@type': 'Organization',
    name: 'Corgi Planning Poker',
    url: 'https://www.corgiplanningpoker.com',
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How many people can join a room?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'There is no hard limit. Rooms work well for teams of 3 to 20 people. For very large groups, consider splitting into smaller estimation sub-teams.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I need to create an account?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No account is required. Every visitor is automatically assigned a unique guest ID so you can create and join rooms instantly. Signing in with Google links that ID to your Google account, which syncs your identity across browsers and devices.',
      },
    },
    {
      '@type': 'Question',
      name: 'What card decks are available?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Four preset decks are built in: Fibonacci (1, 2, 3, 5, 8, 13, 21, 34), T-Shirt (XS, S, M, L, XL, XXL), Powers of 2 (1, 2, 4, 8, 16, 32, 64), and Hours (1, 2, 4, 8, 16, 24, 40). You can also create a fully custom deck.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I watch a session without voting?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. When joining a room you can choose "Watch as spectator" to observe without casting a vote. You can sit down and join the voting at any point during the session.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long does a room last?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Rooms are automatically removed after 30 days of inactivity. As long as your team uses a room at least once a month, it stays available.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is Corgi Planning Poker free?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, completely free. There are no paid plans, no advertisements, and no data is sold.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the difference between story points and hours?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Story points measure relative effort and complexity rather than clock time. A 5-point story is roughly twice as complex as a 2-point story for your team, but the actual hours vary by person. Using story points removes pressure to commit to specific durations and focuses the conversation on scope and risk instead.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does Corgi Planning Poker integrate with Jira?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Connect your Jira account with one click and you can search for issues directly inside the planning poker room. Add multiple Jira tickets to a queue, estimate them one by one with your team, and save the final story point (or time estimate) back to Jira without leaving the room.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does the Jira ticket queue work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'After connecting Jira, open the backlog panel and search for issues from your Jira project. Add up to 200 tickets to the queue. The room automatically moves to the next unestimated ticket after each round, so your team can work through a whole sprint backlog in one session without any manual switching.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I save story points back to Jira automatically?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. After the team agrees on a final score, a "Save to Jira" button appears inline. One click updates the story point field (or time estimate field) on the Jira issue. You can also choose which Jira field to write to — any number field for story points, or the built-in Original Estimate field for time.',
      },
    },
  ],
}

const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Run a Planning Poker Session Online',
  description:
    'Use Corgi Planning Poker to estimate story points with your agile team in real-time. No registration required.',
  totalTime: 'PT5M',
  step: [
    {
      '@type': 'HowToStep',
      position: 1,
      name: 'Create a room',
      text: 'Click "Create Room", give it a name, and choose your card deck. You get a shareable link instantly — no account needed.',
      url: 'https://www.corgiplanningpoker.com/new-room',
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: 'Invite your team',
      text: 'Share the room link with your colleagues. Anyone with the link can join from any browser or device.',
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'Vote and reveal',
      text: 'Each participant picks a card privately. Reveal all cards at once, discuss outliers, and lock in your estimate.',
    },
  ],
}

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <HomeComponent />
    </>
  )
}
