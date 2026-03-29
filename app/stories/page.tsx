import type { FC } from 'react'
import Link from 'next/link'
import { stories } from './data'

const StoriesPage: FC = () => {
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
                    href="/"
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
                    ← 返回首页
                </Link>
                <div style={{ fontSize: 48, marginBottom: 8 }}>📖</div>
                <h1
                    style={{
                        fontFamily: "'Noto Serif SC', serif",
                        fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                        fontWeight: 700,
                        color: '#3D3028',
                        marginBottom: 12,
                    }}
                >
                    受害者故事
                </h1>
                <p style={{ fontSize: 14, color: '#8F7E6E', maxWidth: 480, margin: '0 auto', lineHeight: 1.8 }}>
                    每一个故事都是真实的力量。她们走过来了，你也可以。
                    <br />
                    <span style={{ fontSize: 12 }}>（以下人物均为化名，故事经过改编以保护隐私）</span>
                </p>
            </div>

            {/* Cards grid */}
            <section style={{ maxWidth: 800, margin: '0 auto', padding: '40px 24px 80px' }}>
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                        gap: 20,
                    }}
                >
                    {stories.map(s => (
                        <Link
                            key={s.id}
                            href={`/stories/${s.id}`}
                            style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                            <div
                                style={{
                                    backgroundColor: '#fff',
                                    border: '1px solid #E6DDD5',
                                    borderRadius: 16,
                                    padding: '28px 20px',
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    transition: 'box-shadow 0.2s, transform 0.2s',
                                }}
                                onMouseEnter={undefined}
                            >
                                <div style={{ fontSize: 48, marginBottom: 12 }}>{s.avatar}</div>
                                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: '#3D3028' }}>
                                    {s.name}
                                </h3>
                                <p style={{ fontSize: 13, color: '#5C4D3E', lineHeight: 1.7 }}>
                                    {s.summary}
                                </p>
                                <span
                                    style={{
                                        display: 'inline-block',
                                        marginTop: 12,
                                        fontSize: 12,
                                        color: '#E8A87C',
                                        fontWeight: 600,
                                    }}
                                >
                                    阅读故事 →
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    )
}

export default StoriesPage
