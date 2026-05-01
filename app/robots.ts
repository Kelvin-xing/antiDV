import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const base = 'https://anti-dv.vercel.app'

    return {
        rules: [
            // General crawlers: allow public content, block sensitive routes
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/feedback', '/chat', '/api/'],
            },
            // AI training crawlers: block entirely to protect survivor conversations
            {
                userAgent: 'GPTBot',
                disallow: ['/'],
            },
            {
                userAgent: 'ChatGPT-User',
                disallow: ['/'],
            },
            {
                userAgent: 'ClaudeBot',
                disallow: ['/'],
            },
            {
                userAgent: 'anthropic-ai',
                disallow: ['/'],
            },
            {
                userAgent: 'PerplexityBot',
                disallow: ['/'],
            },
            {
                userAgent: 'Applebot-Extended',
                disallow: ['/'],
            },
            {
                userAgent: 'Google-Extended',
                disallow: ['/'],
            },
            {
                userAgent: 'Bytespider',
                disallow: ['/'],
            },
            {
                userAgent: 'CCBot',
                disallow: ['/'],
            },
        ],
        sitemap: `${base}/sitemap.xml`,
    }
}
