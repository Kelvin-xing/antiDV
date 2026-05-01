import type { MetadataRoute } from 'next'

const BASE = 'https://anti-dv.vercel.app'

// Story slugs from app/stories/data.ts
const STORY_SLUGS = ['xiaomei', 'ah-fang', 'lili', 'wang-jie', 'xiao-yu']

// Template slugs from app/docs-toolkit/templates.ts
const TEMPLATE_SLUGS = ['protection-order', 'admonishment-letter', 'police-report-aid']

export default function sitemap(): MetadataRoute.Sitemap {
    const now = new Date()

    const staticPages: MetadataRoute.Sitemap = [
        {
            url: `${BASE}/`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 1.0,
        },
        {
            url: `${BASE}/resources`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        {
            url: `${BASE}/psych-resources`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${BASE}/stories`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${BASE}/docs-toolkit`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.7,
        },
    ]

    const storyPages: MetadataRoute.Sitemap = STORY_SLUGS.map(slug => ({
        url: `${BASE}/stories/${slug}`,
        lastModified: now,
        changeFrequency: 'yearly' as const,
        priority: 0.6,
    }))

    const templatePages: MetadataRoute.Sitemap = TEMPLATE_SLUGS.map(slug => ({
        url: `${BASE}/docs-toolkit/${slug}`,
        lastModified: now,
        changeFrequency: 'yearly' as const,
        priority: 0.6,
    }))

    return [...staticPages, ...storyPages, ...templatePages]
}
