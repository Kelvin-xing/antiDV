'use client'
import { useClerk } from '@clerk/nextjs'
import { useCallback, useEffect, useRef, useState } from 'react'

export default function SessionExit() {
  const clerk = useClerk()
  const running = useRef(false)
  const [error, setError] = useState(false)
  const cleanup = useCallback(async () => {
    if (running.current) { return }
    running.current = true
    setError(false)
    try {
      // Server revocation happens first while the credential is still available.
      const response = await fetch('/api/session/clear', {
        method: 'POST',
        credentials: 'include',
        cache: 'no-store',
        signal: AbortSignal.timeout(8000),
      })
      const result = await response.json()
      if (!response.ok || !result.revoked) { throw new Error('Sign-out incomplete') }
      // Clerk also clears its own frontend-domain cookies. Do not reload a provider page afterwards.
      await Promise.race([clerk.signOut(), new Promise<never>((_, reject) => setTimeout(() => reject(new Error('timeout')), 8000))])
      localStorage.clear()
      sessionStorage.clear()
      // Clear cookies that Clerk may have refreshed during SDK sign-out.
      const cleared = await fetch('/api/session/clear', { method: 'POST', credentials: 'include', cache: 'no-store', signal: AbortSignal.timeout(8000) })
      if (!cleared.ok) { throw new Error('Cleanup incomplete') }
      window.location.replace('https://www.weather.com.cn/')
    }
    catch { setError(true) }
    finally { running.current = false }
  }, [clerk])
  useEffect(() => { void cleanup() }, [cleanup])
  return (
    <main className='min-h-screen bg-white p-8 text-gray-800' aria-live='polite'>
      <p>{error ? '连接暂时不可用，退出尚未完全确认。' : '正在退出…'}</p>
      {error && <div className='mt-4 flex gap-6'>
        <button type='button' onClick={() => void cleanup()} className='underline'>重试退出</button>
        <a href='https://www.weather.com.cn/' referrerPolicy='no-referrer' className='underline'>立即离开</a>
      </div>}
    </main>
  )
}
