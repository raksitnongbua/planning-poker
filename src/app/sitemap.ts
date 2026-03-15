import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.corgiplanningpoker.com'
  const today = '2026-03-16'

  const routes = [
    { url: '', priority: 1, changeFrequency: 'weekly' as const },
    { url: '/new-room', priority: 0.7, changeFrequency: 'monthly' as const },
    { url: '/recent-rooms', priority: 0.5, changeFrequency: 'monthly' as const },
    { url: '/scrum-poker', priority: 0.8, changeFrequency: 'monthly' as const },
    { url: '/agile-estimation', priority: 0.8, changeFrequency: 'monthly' as const },
    { url: '/story-points-estimator', priority: 0.8, changeFrequency: 'monthly' as const },
    { url: '/sprint-planning', priority: 0.8, changeFrequency: 'monthly' as const },
    { url: '/blog', priority: 0.7, changeFrequency: 'weekly' as const },
    {
      url: '/blog/why-we-built-corgi-planning-poker',
      priority: 0.6,
      changeFrequency: 'monthly' as const,
    },
    { url: '/blog/how-planning-poker-works', priority: 0.6, changeFrequency: 'monthly' as const },
    { url: '/blog/planning-poker-fibonacci', priority: 0.6, changeFrequency: 'monthly' as const },
    { url: '/blog/story-points-vs-hours', priority: 0.6, changeFrequency: 'monthly' as const },
    {
      url: '/blog/handling-outliers-in-planning-poker',
      priority: 0.6,
      changeFrequency: 'monthly' as const,
    },
    {
      url: '/blog/how-to-make-story-points-effective',
      priority: 0.6,
      changeFrequency: 'monthly' as const,
    },
    { url: '/privacy-policy', priority: 0.3, changeFrequency: 'yearly' as const },
  ]

  const sitemapEntries: MetadataRoute.Sitemap = []

  routes.forEach((route) => {
    // English version
    sitemapEntries.push({
      url: `${baseUrl}${route.url}`,
      lastModified: route.url === '/privacy-policy' ? '2026-01-01' : today,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })

    // Thai version
    sitemapEntries.push({
      url: `${baseUrl}${route.url}${route.url.includes('?') ? '&' : '?'}hl=th`,
      lastModified: route.url === '/privacy-policy' ? '2026-01-01' : today,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })
  })

  return sitemapEntries
}
