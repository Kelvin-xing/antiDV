/**
 * Cross-device real-time feedback broadcast.
 * Chat page POSTs data to /api/feedback (server-stored).
 * Admin feedback page polls for updates.
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

/** Safely serialize chatList — strip non-serializable fields */
function safeChatList(chatList: ChatItem[]): any[] {
    try {
        // Test serialization first; if it throws, strip problematic fields
        JSON.stringify(chatList)
        return chatList
    } catch {
        return chatList.map(item => ({
            id: item.id,
            content: item.content,
            isAnswer: item.isAnswer,
            feedback: item.feedback,
            userReview: (item as any).userReview,
            isOpeningStatement: (item as any).isOpeningStatement,
            message_files: item.message_files,
        }))
    }
}

/** Send current chat state to server (called from chat page) */
export function broadcastFeedback(payload: FeedbackPayload) {
    if (typeof window === 'undefined') return

    latestPayload = payload

    // Debounce 500ms — during streaming, chatList updates many times per second
    if (pendingTimer) clearTimeout(pendingTimer)
    pendingTimer = setTimeout(() => {
        try {
            if (!latestPayload) return
            const body = {
                userHash: latestPayload.userHash || localStorage.getItem('xiaoAn_user_hash') || 'anonymous',
                conversationId: latestPayload.conversationId,
                conversationName: latestPayload.conversationName,
                chatList: safeChatList(latestPayload.chatList),
            }
            fetch('/api/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            }).catch(() => { })
            latestPayload = null
        } catch {
            // Serialization or other error — silently ignore
            latestPayload = null
        }
    }, 500)
}

/** Force-flush pending broadcast immediately (e.g. on review submit) */
export function flushFeedback() {
    if (pendingTimer) {
        clearTimeout(pendingTimer)
        pendingTimer = null
    }
    if (!latestPayload) return
    try {
        const body = {
            userHash: latestPayload.userHash || (typeof window !== 'undefined' ? localStorage.getItem('xiaoAn_user_hash') : null) || 'anonymous',
            conversationId: latestPayload.conversationId,
            conversationName: latestPayload.conversationName,
            chatList: safeChatList(latestPayload.chatList),
        }
        fetch('/api/feedback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        }).catch(() => { })
    } catch {
        // ignore
    }
    latestPayload = null
}
