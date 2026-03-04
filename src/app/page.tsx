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
  softwareVersion: '2.0',
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

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
      />
      <HomeComponent />
    </>
  )
}
