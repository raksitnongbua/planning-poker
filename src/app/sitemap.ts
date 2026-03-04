import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://www.corgiplanningpoker.com',
      lastModified: '2026-03-01',
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: 'https://www.corgiplanningpoker.com/new-room',
      lastModified: '2026-03-01',
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: 'https://www.corgiplanningpoker.com/privacy-policy',
      lastModified: '2026-01-01',
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]
}
