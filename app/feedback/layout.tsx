import type { Metadata } from 'next'

// Admin panel — must never be indexed. Protected by middleware.ts.
export const metadata: Metadata = {
    title: '管理员面板',
    robots: {
        index: false,
        follow: false,
    },
}

export default function FeedbackLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
