'use client'

import Link from 'next/link'
import { templates } from './templates'

/* Inline SVG doc icon — folded-corner rectangle */
const SvgDocIcon = () => (
    <svg width="24" height="28" viewBox="0 0 24 28" fill="none" stroke="#7A6B5D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-label="文档">
        <path d="M14 1H4a2 2 0 0 0-2 2v22a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9z" />
        <polyline points="14 1 14 9 22 9" />
    </svg>
)

const focusStyle = `
@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; transition: none !important; }
}
a:focus-visible { outline: 2px solid #E8A87C; outline-offset: 2px; }
`

export default function DocsToolkitPage() {
    return (
        <div style={{
            minHeight: '100vh',
            background: '#FBF8F4',
            fontFamily: "'Noto Sans SC', system-ui, sans-serif",
            color: '#3D3028',
        }}>
            <style dangerouslySetInnerHTML={{ __html: focusStyle }} />

            {/* Masthead — dark, consistent with Stories page */}
            <header style={{
                backgroundColor: '#3D3028',
                padding: '48px 24px',
                textAlign: 'center',
            }}>
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
                <h1 style={{
                    fontFamily: "'Noto Serif SC', serif",
                    fontSize: 32,
                    fontWeight: 700,
                    color: '#FBF8F4',
                    marginBottom: 12,
                }}>
                    文档工具库
                </h1>
                <p style={{
                    fontSize: 16,
                    color: '#B5A898',
                    maxWidth: 520,
                    margin: '0 auto 16px',
                    lineHeight: 1.7,
                }}>
                    填写关键信息，即可生成规范文档
                </p>
                <p style={{
                    fontSize: 13,
                    color: '#D4C4B8',
                    maxWidth: 480,
                    margin: '0 auto',
                    lineHeight: 1.6,
                }}>
                    所有信息仅在您的设备上处理，不会上传至服务器
                </p>
            </header>

            {/* Template Rows */}
            <main style={{ padding: '40px 24px 64px', maxWidth: 800, margin: '0 auto' }}>
                {templates.map((t, i) => (
                    <article key={t.id}>
                        {i > 0 && <hr style={{ border: 'none', borderTop: '1px solid #E6DDD5', margin: 0 }} />}
                        <Link
                            href={`/docs-toolkit/${t.id}`}
                            style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'flex-start', gap: 16, padding: '28px 0' }}
                        >
                            <div style={{ flexShrink: 0, paddingTop: 2 }}>
                                <SvgDocIcon />
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <h2 style={{
                                    fontFamily: "'Noto Serif SC', serif",
                                    fontSize: 18,
                                    color: '#3D3028',
                                    marginBottom: 8,
                                }}>
                                    {t.name}
                                </h2>
                                <p style={{
                                    fontSize: 16,
                                    color: '#5C4D3E',
                                    lineHeight: 1.7,
                                    marginBottom: 8,
                                }}>
                                    {t.description}
                                </p>
                                <span style={{
                                    fontSize: 13,
                                    color: '#E8A87C',
                                    fontWeight: 500,
                                    float: 'right',
                                }}>
                                    开始填写 →
                                </span>
                            </div>
                        </Link>
                    </article>
                ))}

                {/* Disclaimer */}
                <div style={{ borderTop: '1px solid #E6DDD5', paddingTop: 24, marginTop: 12 }}>
                    <p style={{
                        fontSize: 16,
                        color: '#7A6B5D',
                        lineHeight: 1.7,
                    }}>
                        <strong>免责声明：</strong>以上模板仅供参考，不构成法律建议。具体法律问题请咨询专业律师或拨打法律援助热线 <strong>12348</strong>。
                    </p>
                </div>
            </main>
        </div>
    )
}
