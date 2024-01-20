import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://www.corgiplanningpoker.com',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://www.corgiplanningpoker.com/new-room',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: 'https://www.corgiplanningpoker.com/recent-rooms',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.4,
    },
  ]
}
