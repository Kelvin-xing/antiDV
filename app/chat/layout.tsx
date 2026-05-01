import type { Metadata } from 'next'

// Chat sessions are ephemeral and user-specific — not useful as indexed pages.
export const metadata: Metadata = {
    title: '与小安对话',
    robots: {
        index: false,
        follow: false,
    },
}

export default function ChatLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
