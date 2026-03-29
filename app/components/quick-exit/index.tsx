'use client'
import { useEffect } from 'react'

// 快速離開：點擊或按 ESC 即跳離頁面，不留瀏覽記錄
const ESCAPE_URL = 'https://www.weather.com.cn/'
const USER_HASH_KEY = 'xiaoAn_user_hash'

export function quickEscape() {
  try {
    // Preserve identity hash so user can still recover their history later
    const savedHash = localStorage.getItem(USER_HASH_KEY)
    sessionStorage.clear()
    localStorage.clear()
    if (savedHash) localStorage.setItem(USER_HASH_KEY, savedHash)
  }
  catch { }
  // Pad history stack so browser back button skips past this page
  try {
    for (let i = 0; i < 5; i++)
      window.history.pushState(null, '', window.location.href)
  }
  catch { }
  window.location.replace(ESCAPE_URL)
}

export default function QuickExit() {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { quickEscape() }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          .quick-exit-btn { position: fixed; top: 12px; right: 12px; z-index: 9999; }
          @media (max-width: 640px) { .quick-exit-btn { right: auto !important; left: 12px !important; } }
        `,
      }} />
      <button
        className="quick-exit-btn"
        onClick={quickEscape}
        aria-label="快速离开此页面"
        title="快速离开（或按 ESC）"
        style={{
          backgroundColor: '#E8A87C',
          color: '#fff',
          border: 'none',
          borderRadius: '20px',
          padding: '6px 14px',
          fontSize: '13px',
          fontWeight: 700,
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
          letterSpacing: '0.03em',
          transition: 'background-color 0.15s',
          fontFamily: '\'Noto Sans SC\', sans-serif',
        }}
        onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#D98B5A')}
        onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#E8A87C')}
      >
        快速离开 ✕
      </button>
    </>
  )
}
