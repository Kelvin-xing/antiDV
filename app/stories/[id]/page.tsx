import type { FC } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { stories } from '../data'

interface Props {
    params: Promise<{ id: string }>
}

const StoryDetailPage: FC<Props> = async ({ params }) => {
    const { id } = await params
    const story = stories.find(s => s.id === id)
    if (!story) notFound()

    return (
        <div
            style={{
                minHeight: '100vh',
                backgroundColor: '#FBF8F4',
                fontFamily: "'Noto Sans SC', system-ui, sans-serif",
                color: '#4A4238',
            }}
        >
            {/* Header */}
            <div
                style={{
                    background: 'linear-gradient(160deg, #F5E6D3 0%, #FBF8F4 60%)',
                    padding: '40px 24px 32px',
                    textAlign: 'center',
                }}
            >
                <Link
                    href="/stories"
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        fontSize: 14,
                        color: '#8F7E6E',
                        textDecoration: 'none',
                        marginBottom: 24,
                    }}
                >
                    ← 返回故事列表
                </Link>
                <div style={{ fontSize: 56, marginBottom: 8 }}>{story.avatar}</div>
                <h1
                    style={{
                        fontFamily: "'Noto Serif SC', serif",
                        fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                        fontWeight: 700,
                        color: '#3D3028',
                        marginBottom: 8,
                    }}
                >
                    {story.name}的故事
                </h1>
                <p style={{ fontSize: 14, color: '#E8A87C', fontWeight: 600 }}>
                    {story.summary}
                </p>
            </div>

            {/* Story body */}
            <section style={{ maxWidth: 640, margin: '0 auto', padding: '40px 24px 80px' }}>
                <div
                    style={{
                        backgroundColor: '#fff',
                        border: '1px solid #E6DDD5',
                        borderRadius: 16,
                        padding: '32px 28px',
                    }}
                >
                    {story.fullStory.map((para, i) => (
                        <p
                            key={i}
                            style={{
                                fontSize: 15,
                                lineHeight: 2,
                                color: '#4A4238',
                                marginBottom: i < story.fullStory.length - 1 ? 20 : 0,
                                textIndent: '2em',
                            }}
                        >
                            {para}
                        </p>
                    ))}
                </div>

                {/* Encouragement */}
                <div
                    style={{
                        marginTop: 32,
                        padding: '20px 24px',
                        backgroundColor: '#EEF7F5',
                        border: '1px solid #CCE9E3',
                        borderRadius: 12,
                        textAlign: 'center',
                    }}
                >
                    <p style={{ fontSize: 14, color: '#2C6B5E', lineHeight: 1.8 }}>
                        💚 如果你也正在经历类似的困境，请记住：你不是一个人。
                        <br />
                        拨打 <strong style={{ color: '#E8A87C' }}>110</strong>（报警）或{' '}
                        <strong style={{ color: '#7CB9A8' }}>12338</strong>（妇女热线）获取帮助，
                        或 <Link href="/chat" style={{ color: '#E8A87C', fontWeight: 600 }}>和小安聊聊</Link>。
                    </p>
                </div>

                <div style={{ textAlign: 'center', marginTop: 28 }}>
                    <Link
                        href="/stories"
                        style={{
                            display: 'inline-block',
                            padding: '10px 28px',
                            border: '2px solid #E8A87C',
                            borderRadius: 24,
                            color: '#E8A87C',
                            fontWeight: 600,
                            fontSize: 14,
                            textDecoration: 'none',
                        }}
                    >
                        ← 查看更多故事
                    </Link>
                </div>
            </section>
        </div>
    )
}

export default StoryDetailPage
