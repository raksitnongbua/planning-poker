import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://corgi-planning-poker.vercel.app',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://corgi-planning-poker.vercel.app/recent-rooms',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.4,
    },
  ]
}
