'use client'
import { useEffect } from 'react'

// 快速離開：點擊或按 ESC 即跳離頁面，不留瀏覽記錄
const ESCAPE_URL = 'https://www.weather.com.cn/' // 跳轉到不敏感的天氣網站

function quickEscape() {
  // 清除本頁敏感數據
  try {
    sessionStorage.clear()
    localStorage.removeItem('conversationIdInfo')
    localStorage.removeItem('inputs')
  }
  catch { }
  // replace 不留歷史記錄，讓「返回鍵」也無法回到本頁
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
    <button
      onClick={quickEscape}
      aria-label="快速离开此页面"
      title="快速离开（或按 ESC）"
      style={{
        position: 'fixed',
        top: '12px',
        right: '12px',
        zIndex: 9999,
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
  )
}
