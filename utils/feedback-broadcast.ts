/**
 * Cross-device real-time feedback broadcast.
 * Chat page POSTs data to /api/feedback (server-stored + SSE push).
 * Admin feedback page subscribes via SSE for real-time updates.
 */

import type { ChatItem } from '@/types/app'

export interface FeedbackPayload {
  userHash?: string
  conversationId: string
  conversationName: string
  chatList: ChatItem[]
  timestamp: number
}

// Debounce: avoid flooding the server during streaming responses
let pendingTimer: ReturnType<typeof setTimeout> | null = null
let latestPayload: FeedbackPayload | null = null

/** Send current chat state to server (called from chat page) */
export function broadcastFeedback(payload: FeedbackPayload) {
  if (typeof window === 'undefined') return

  latestPayload = payload

  // Debounce 500ms — during streaming, chatList updates many times per second
  if (pendingTimer) clearTimeout(pendingTimer)
  pendingTimer = setTimeout(() => {
    if (!latestPayload) return
    const body = {
      userHash: latestPayload.userHash || localStorage.getItem('xiaoAn_user_hash') || 'anonymous',
      conversationId: latestPayload.conversationId,
      conversationName: latestPayload.conversationName,
      chatList: latestPayload.chatList,
    }
    fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).catch(() => { /* silently ignore network errors */ })
    latestPayload = null
  }, 500)
}

/** Force-flush pending broadcast immediately (e.g. on review submit) */
export function flushFeedback() {
  if (pendingTimer) {
    clearTimeout(pendingTimer)
    pendingTimer = null
  }
  if (!latestPayload) return
  const body = {
    userHash: latestPayload.userHash || (typeof window !== 'undefined' ? localStorage.getItem('xiaoAn_user_hash') : null) || 'anonymous',
    conversationId: latestPayload.conversationId,
    conversationName: latestPayload.conversationName,
    chatList: latestPayload.chatList,
  }
  fetch('/api/feedback', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).catch(() => {})
  latestPayload = null
}
