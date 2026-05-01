import type { Metadata } from 'next'

export const metadata: Metadata = {
    alternates: {
        canonical: 'https://anti-dv.vercel.app/stories',
    },
    title: '受害者故事',
    description:
        '真实的家暴幸存者故事——她们曾和你一样，最终走出了困境。每一个故事都是真实的力量。',
    openGraph: {
        title: '受害者故事 — 小安反家暴助手',
        description:
            '阅读走出困境的真实故事，你并不孤单。',
        url: 'https://anti-dv.vercel.app/stories',
    },
}

export default function StoriesLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
