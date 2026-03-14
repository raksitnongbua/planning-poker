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
    'Free online planning poker tool for agile teams to estimate story points collaboratively in real-time. No registration required.',
  datePublished: '2024-01-01',
  softwareVersion: '2.1',
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
