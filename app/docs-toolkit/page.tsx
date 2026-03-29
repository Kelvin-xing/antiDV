'use client'

import Link from 'next/link'
import { templates } from './templates'

export default function DocsToolkitPage() {
    return (
        <div style={{ minHeight: '100vh', background: '#FBF8F4' }}>
            {/* Header */}
            <header style={{
                padding: '16px 24px',
                borderBottom: '1px solid #E6DDD5',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                background: '#fff',
            }}>
                <Link href="/" style={{ color: '#E8A87C', textDecoration: 'none', fontFamily: "'Noto Sans SC', sans-serif", fontSize: 14 }}>
                    ← 返回首页
                </Link>
            </header>

            {/* Hero */}
            <section style={{
                padding: '48px 24px 32px',
                textAlign: 'center',
                background: 'linear-gradient(135deg, #FBF8F4 0%, #f0ebe4 100%)',
            }}>
                <h1 style={{
                    fontFamily: "'Noto Serif SC', serif",
                    fontSize: 28,
                    color: '#3D3028',
                    marginBottom: 12,
                }}>
                    📄 文档工具库
                </h1>
                <p style={{
                    fontFamily: "'Noto Sans SC', sans-serif",
                    fontSize: 15,
                    color: '#8F7E6E',
                    maxWidth: 520,
                    margin: '0 auto',
                    lineHeight: 1.7,
                }}>
                    我们为您准备了常用法律文书模板，只需填写关键信息即可生成规范文档。所有信息仅在您的设备上处理，不会上传至服务器。
                </p>
            </section>

            {/* Template Cards */}
            <section style={{ padding: '24px 24px 64px', maxWidth: 800, margin: '0 auto' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    {templates.map(t => (
                        <Link
                            key={t.id}
                            href={`/docs-toolkit/${t.id}`}
                            style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                            <div style={{
                                background: '#fff',
                                borderRadius: 12,
                                padding: '24px 28px',
                                border: '1px solid #E6DDD5',
                                transition: 'box-shadow 0.2s, transform 0.2s',
                                cursor: 'pointer',
                            }}
                                onMouseEnter={e => {
                                    (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'
                                        ; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'
                                }}
                                onMouseLeave={e => {
                                    (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'
                                        ; (e.currentTarget as HTMLDivElement).style.transform = 'none'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                                    <span style={{ fontSize: 36 }}>{t.icon}</span>
                                    <div style={{ flex: 1 }}>
                                        <h2 style={{
                                            fontFamily: "'Noto Serif SC', serif",
                                            fontSize: 18,
                                            color: '#3D3028',
                                            marginBottom: 8,
                                        }}>
                                            {t.name}
                                        </h2>
                                        <p style={{
                                            fontFamily: "'Noto Sans SC', sans-serif",
                                            fontSize: 14,
                                            color: '#8F7E6E',
                                            lineHeight: 1.6,
                                            marginBottom: 12,
                                        }}>
                                            {t.description}
                                        </p>
                                        <span style={{
                                            fontFamily: "'Noto Sans SC', sans-serif",
                                            fontSize: 13,
                                            color: '#E8A87C',
                                            fontWeight: 500,
                                        }}>
                                            开始填写 →
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Disclaimer */}
                <div style={{
                    marginTop: 32,
                    padding: '16px 20px',
                    background: '#FFF8F0',
                    borderRadius: 8,
                    border: '1px solid #F0DCC8',
                }}>
                    <p style={{
                        fontFamily: "'Noto Sans SC', sans-serif",
                        fontSize: 13,
                        color: '#8F7E6E',
                        lineHeight: 1.7,
                    }}>
                        ⚠️ <strong>免责声明：</strong>以上模板仅供参考，不构成法律建议。具体法律问题请咨询专业律师或拨打法律援助热线 <strong>12348</strong>。
                    </p>
                </div>
            </section>
        </div>
    )
}
