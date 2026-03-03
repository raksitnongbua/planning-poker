import HomeComponent from '@/components/Home'

const appSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Corgi Planning Poker',
  url: 'https://www.corgiplanningpoker.com',
  applicationCategory: 'BusinessApplication',
  applicationSubCategory: 'Project Management',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description:
    'Free real-time planning poker tool for agile teams to estimate story points collaboratively. No registration required.',
  screenshot: [
    'https://www.corgiplanningpoker.com/images/corgi-planning-poker-preview.png',
    'https://www.corgiplanningpoker.com/images/corgi-planning-poker-room-preview.png',
  ],
  featureList: [
    'Real-time collaborative voting',
    'Customizable card decks',
    'Story point estimation',
    'No registration required',
    'Invite via room link',
  ],
  inLanguage: 'en-US',
  creator: { '@type': 'Person', name: 'Raksit Nongbua' },
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
