'use client'

import type { FC } from 'react'

interface ErrorBoundaryProps {
    error: Error & { digest?: string }
    reset: () => void
}

const RootError: FC<ErrorBoundaryProps> = ({ error, reset }) => {
    return (
        <html lang="zh-Hans" className="h-full">
            <body
                className="h-full"
                style={{
                    margin: 0,
                    backgroundColor: '#FBF8F4',
                    fontFamily: "'Noto Sans SC', system-ui, sans-serif",
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <div
                    style={{
                        textAlign: 'center',
                        padding: '40px 24px',
                        maxWidth: 480,
                    }}
                >
                    {/* Warm icon */}
                    <div style={{ fontSize: 48, marginBottom: 24 }}>🌿</div>

                    <h1
                        style={{
                            fontSize: 20,
                            fontWeight: 600,
                            color: '#3D2C1E',
                            marginBottom: 12,
                        }}
                    >
                        页面暂时无法加载
                    </h1>

                    <p
                        style={{
                            fontSize: 14,
                            color: '#7A6B5D',
                            lineHeight: 1.7,
                            marginBottom: 32,
                        }}
                    >
                        小安正在努力恢复服务，请稍后再试。
                        {process.env.NODE_ENV === 'development' && error?.message && (
                            <span style={{ display: 'block', marginTop: 8, fontFamily: 'monospace', fontSize: 12, color: '#C0392B' }}>
                                {error.message}
                            </span>
                        )}
                    </p>

                    <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button
                            onClick={reset}
                            style={{
                                padding: '10px 24px',
                                backgroundColor: '#E8A87C',
                                color: '#fff',
                                border: 'none',
                                borderRadius: 8,
                                fontSize: 14,
                                fontWeight: 500,
                                cursor: 'pointer',
                                fontFamily: 'inherit',
                            }}
                        >
                            重新加载
                        </button>

                        <a
                            href="/"
                            style={{
                                padding: '10px 24px',
                                backgroundColor: 'transparent',
                                color: '#7A6B5D',
                                border: '1px solid #D4C5B5',
                                borderRadius: 8,
                                fontSize: 14,
                                fontWeight: 500,
                                textDecoration: 'none',
                                fontFamily: 'inherit',
                            }}
                        >
                            返回首页
                        </a>
                    </div>

                    {/* Emergency hotline — always visible on error */}
                    <p
                        style={{
                            marginTop: 40,
                            fontSize: 13,
                            color: '#9E8E80',
                        }}
                    >
                        如遇紧急情况，请拨打{' '}
                        <a
                            href="tel:110"
                            style={{ color: '#E8A87C', textDecoration: 'none', fontWeight: 600 }}
                        >
                            110
                        </a>
                        {' '}或{' '}
                        <a
                            href="tel:12338"
                            style={{ color: '#E8A87C', textDecoration: 'none', fontWeight: 600 }}
                        >
                            12338
                        </a>
                    </p>
                </div>
            </body>
        </html>
    )
}

export default RootError
