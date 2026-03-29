'use client'
import { useEffect } from 'react'
import { quickEscape } from '@/app/components/quick-exit'

/**
 * Intercepts the browser back button on sensitive pages.
 * Pads the history stack on mount, then on popstate triggers quickEscape.
 */
export default function BackExitGuard() {
    useEffect(() => {
        window.history.pushState(null, '', window.location.href)
        const handler = () => {
            window.history.pushState(null, '', window.location.href)
            quickEscape()
        }
        window.addEventListener('popstate', handler)
        return () => window.removeEventListener('popstate', handler)
    }, [])
    return null
}
