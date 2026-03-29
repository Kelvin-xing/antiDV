import type { FC } from 'react'
import Link from 'next/link'
import { stories } from './data'

const focusStyle = `
@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; transition: none !important; }
}
a:focus-visible { outline: 2px solid #E8A87C; outline-offset: 2px; }
`

const StoriesPage: FC = () => {
    return (
        <div
            style={{
                minHeight: '100vh',
                backgroundColor: '#FBF8F4',
                fontFamily: "'Noto Sans SC', system-ui, sans-serif",
                color: '#3D3028',
            }}
        >
            <style dangerouslySetInnerHTML={{ __html: focusStyle }} />

            {/* Masthead */}
            <header
                style={{
                    backgroundColor: '#3D3028',
                    padding: '48px 24px',
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
                        color: '#E8A87C',
                        textDecoration: 'none',
                        marginBottom: 32,
                        minHeight: 44,
                    }}
                >
                    ← 首页
                </Link>
                <h1
                    style={{
                        fontFamily: "'Noto Serif SC', serif",
                        fontSize: 32,
                        fontWeight: 700,
                        color: '#FBF8F4',
                        marginBottom: 12,
                    }}
                >
                    受害者故事
                </h1>
                <p style={{ fontSize: 16, color: '#B5A898', fontStyle: 'italic', marginBottom: 16 }}>
                    每一个故事都是真实的力量
                </p>
                <div style={{ width: 64, height: 1, backgroundColor: '#E8A87C', margin: '0 auto 16px' }} />
                <p style={{ fontSize: 13, color: '#D4C4B8', maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>
                    以下内容涉及家庭暴力经历，如感到不适请随时暂停。
                    <br />
                    <span style={{ fontSize: 12 }}>（所有人物均为化名，故事经过改编以保护隐私）</span>
                </p>
            </header>

            {/* Story List */}
            <main style={{ maxWidth: 800, margin: '0 auto', padding: '48px 24px 80px' }}>
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                        gap: 0,
                    }}
                >
                    {stories.map(s => (
                        <article
                            key={s.id}
                            style={{
                                borderBottom: '1px solid #E6DDD5',
                                padding: '28px 0',
                            }}
                        >
                            <Link
                                href={`/stories/${s.id}`}
                                style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'flex-start', gap: 16 }}
                            >
                                {/* Initials circle */}
                                <div
                                    style={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: '50%',
                                        backgroundColor: '#F5E6D3',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0,
                                    }}
                                >
                                    <span
                                        style={{
                                            fontFamily: "'Noto Serif SC', serif",
                                            fontSize: 20,
                                            fontWeight: 700,
                                            color: '#3D3028',
                                        }}
                                    >
                                        {s.name.charAt(0)}
                                    </span>
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 6, color: '#3D3028' }}>
                                        {s.name}
                                    </h3>
                                    <p style={{ fontSize: 16, color: '#5C4D3E', lineHeight: 1.7, marginBottom: 8 }}>
                                        {s.summary}
                                    </p>
                                    <span style={{ fontSize: 13, color: '#E8A87C', fontWeight: 500 }}>
                                        阅读故事 →
                                    </span>
                                </div>
                            </Link>
                        </article>
                    ))}
                </div>
            </main>
        </div>
    )
}

export default StoriesPage
