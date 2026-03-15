import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://www.corgiplanningpoker.com',
      lastModified: '2026-03-16',
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: 'https://www.corgiplanningpoker.com/new-room',
      lastModified: '2026-03-16',
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: 'https://www.corgiplanningpoker.com/recent-rooms',
      lastModified: '2026-03-16',
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: 'https://www.corgiplanningpoker.com/scrum-poker',
      lastModified: '2026-03-16',
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: 'https://www.corgiplanningpoker.com/agile-estimation',
      lastModified: '2026-03-16',
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: 'https://www.corgiplanningpoker.com/story-points-estimator',
      lastModified: '2026-03-16',
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: 'https://www.corgiplanningpoker.com/sprint-planning',
      lastModified: '2026-03-16',
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: 'https://www.corgiplanningpoker.com/blog',
      lastModified: '2026-03-16',
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: 'https://www.corgiplanningpoker.com/blog/why-we-built-corgi-planning-poker',
      lastModified: '2026-03-16',
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: 'https://www.corgiplanningpoker.com/blog/how-planning-poker-works',
      lastModified: '2026-03-16',
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: 'https://www.corgiplanningpoker.com/blog/planning-poker-fibonacci',
      lastModified: '2026-03-16',
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: 'https://www.corgiplanningpoker.com/blog/story-points-vs-hours',
      lastModified: '2026-03-16',
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: 'https://www.corgiplanningpoker.com/blog/handling-outliers-in-planning-poker',
      lastModified: '2026-03-16',
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: 'https://www.corgiplanningpoker.com/blog/how-to-make-story-points-effective',
      lastModified: '2026-03-16',
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: 'https://www.corgiplanningpoker.com/privacy-policy',
      lastModified: '2026-01-01',
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]
}
