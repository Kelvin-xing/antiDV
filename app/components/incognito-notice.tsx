'use client'
import { useEffect, useState } from 'react'

const DISMISSED_KEY = 'incognito_notice_dismissed'

/**
 * Dismissible banner suggesting incognito/private browsing mode.
 * Dismissed state persists in sessionStorage for the current tab only.
 */
export default function IncognitoNotice() {
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        try {
            if (!sessionStorage.getItem(DISMISSED_KEY)) setVisible(true)
        }
        catch { setVisible(true) }
    }, [])

    const dismiss = () => {
        try { sessionStorage.setItem(DISMISSED_KEY, '1') }
        catch { }
        setVisible(false)
    }

    if (!visible) return null

    return (
        <div
            role="note"
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
                padding: '10px 16px',
                backgroundColor: 'rgba(124,185,168,0.12)',
                borderBottom: '1px solid rgba(124,185,168,0.3)',
                fontSize: 12,
                color: '#4A6B62',
                lineHeight: 1.5,
            }}
        >
            <span>
                🔒 建议使用<strong>无痕浏览模式</strong>访问本页面，以保护隐私安全。
            </span>
            <button
                onClick={dismiss}
                aria-label="关闭提示"
                style={{
                    flexShrink: 0,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#7CB9A8',
                    fontSize: 16,
                    lineHeight: 1,
                    padding: '0 4px',
                    minHeight: 32,
                    minWidth: 32,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                ✕
            </button>
        </div>
    )
}
