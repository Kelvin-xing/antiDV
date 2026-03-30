'use client'
import { useCallback, useEffect, useRef, useState } from 'react'

const ESCAPE_URL = 'https://www.weather.com.cn/'
const USER_HASH_KEY = 'xiaoAn_user_hash'

export function quickEscape() {
  try {
    const savedHash = localStorage.getItem(USER_HASH_KEY)
    sessionStorage.clear()
    localStorage.clear()
    if (savedHash) localStorage.setItem(USER_HASH_KEY, savedHash)
  }
  catch { }
  try {
    for (let i = 0; i < 5; i++)
      window.history.pushState(null, '', window.location.href)
  }
  catch { }
  window.location.replace(ESCAPE_URL)
}

export default function QuickExit() {
  // null = use default CSS position (top-right); once dragged, track in px
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const dragRef = useRef<{
    startX: number
    startY: number
    btnX: number
    btnY: number
    moved: boolean
  } | null>(null)
  const btnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') quickEscape() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const startDrag = (clientX: number, clientY: number) => {
    const btn = btnRef.current
    if (!btn) return
    const rect = btn.getBoundingClientRect()
    dragRef.current = { startX: clientX, startY: clientY, btnX: rect.left, btnY: rect.top, moved: false }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    startDrag(e.clientX, e.clientY)
    const onMove = (ev: MouseEvent) => {
      if (!dragRef.current) return
      const dx = ev.clientX - dragRef.current.startX
      const dy = ev.clientY - dragRef.current.startY
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) dragRef.current.moved = true
      if (dragRef.current.moved) {
        const x = Math.max(0, Math.min(window.innerWidth - 120, dragRef.current.btnX + dx))
        const y = Math.max(0, Math.min(window.innerHeight - 40, dragRef.current.btnY + dy))
        setPos({ x, y })
      }
    }
    const onUp = () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
    }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0]
    startDrag(t.clientX, t.clientY)
    const onMove = (ev: TouchEvent) => {
      if (!dragRef.current) return
      const touch = ev.touches[0]
      const dx = touch.clientX - dragRef.current.startX
      const dy = touch.clientY - dragRef.current.startY
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) dragRef.current.moved = true
      if (dragRef.current.moved) {
        ev.preventDefault()
        const x = Math.max(0, Math.min(window.innerWidth - 120, dragRef.current.btnX + dx))
        const y = Math.max(0, Math.min(window.innerHeight - 40, dragRef.current.btnY + dy))
        setPos({ x, y })
      }
    }
    const onEnd = () => {
      document.removeEventListener('touchmove', onMove)
      document.removeEventListener('touchend', onEnd)
    }
    document.addEventListener('touchmove', onMove, { passive: false })
    document.addEventListener('touchend', onEnd)
  }

  const handleClick = () => {
    if (dragRef.current?.moved) return
    quickEscape()
  }

  const posStyle = pos
    ? { left: pos.x, top: pos.y, right: 'auto' as const, bottom: 'auto' as const }
    : { top: 12, right: 12 }

  return (
    <button
      ref={btnRef}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onClick={handleClick}
      aria-label="快速离开此页面"
      title="快速离开（可拖动，或按 ESC）"
      style={{
        position: 'fixed',
        zIndex: 9999,
        cursor: 'grab',
        backgroundColor: '#E8A87C',
        color: '#fff',
        border: 'none',
        borderRadius: isMobile ? '50%' : '20px',
        padding: isMobile ? '0' : '6px 14px',
        width: isMobile ? '32px' : undefined,
        height: isMobile ? '32px' : undefined,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: isMobile ? '15px' : '13px',
        fontWeight: 700,
        boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
        letterSpacing: '0.03em',
        transition: 'background-color 0.15s',
        fontFamily: "'Noto Sans SC', sans-serif",
        userSelect: 'none',
        WebkitUserSelect: 'none',
        touchAction: 'none',
        ...posStyle,
      }}
      onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#D98B5A')}
      onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#E8A87C')}
    >
      {isMobile ? '✕' : '快速离开'}
    </button>
  )
}
