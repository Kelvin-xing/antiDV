'use client'
import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'

interface ScrollRevealProps {
    children: ReactNode
    delay?: string
    className?: string
    style?: CSSProperties
}

/**
 * Wraps children in a div that fades + slides in when it enters the viewport.
 * Uses IntersectionObserver; falls back gracefully when not available.
 */
export default function ScrollReveal({ children, delay, className, style }: ScrollRevealProps) {
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const el = ref.current
        if (!el || typeof IntersectionObserver === 'undefined') return

        const obs = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    el.style.opacity = '1'
                    el.style.transform = 'translateY(0)'
                    obs.disconnect()
                }
            },
            { threshold: 0.1 },
        )
        obs.observe(el)
        return () => obs.disconnect()
    }, [])

    return (
        <div
            ref={ref}
            className={className}
            style={{
                opacity: 0,
                transform: 'translateY(16px)',
                transition: `opacity 0.5s ease${delay ? ` ${delay}` : ''}, transform 0.5s ease${delay ? ` ${delay}` : ''}`,
                ...style,
            }}
        >
            {children}
        </div>
    )
}
