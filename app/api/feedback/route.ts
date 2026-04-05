import type { NextRequest } from 'next/server'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'

/**
 * Server-side feedback store + SSE endpoint.
 * - POST: chat page pushes conversation snapshots here
 * - GET:  admin page subscribes via Server-Sent Events
 */

export interface FeedbackEntry {
    /** Unique per user+conversation */
    id: string
    userHash: string
    conversationId: string
    conversationName: string
    chatList: any[]
    updatedAt: number
}

// --------------- Persistence (JSON file) ---------------
const DATA_DIR = join(process.cwd(), '.feedback-data')
const DATA_FILE = join(DATA_DIR, 'entries.json')

function ensureDir() {
    if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true })
}

function readAll(): FeedbackEntry[] {
    ensureDir()
    if (!existsSync(DATA_FILE)) return []
    try {
        return JSON.parse(readFileSync(DATA_FILE, 'utf-8'))
    } catch {
        return []
    }
}

function writeAll(entries: FeedbackEntry[]) {
    ensureDir()
    writeFileSync(DATA_FILE, JSON.stringify(entries, null, 2), 'utf-8')
}

// --------------- SSE subscriber list ---------------
type Subscriber = (data: string) => void
const subscribers = new Set<Subscriber>()

function notifySubscribers(entry: FeedbackEntry) {
    const payload = `data: ${JSON.stringify(entry)}\n\n`
    subscribers.forEach(fn => {
        try { fn(payload) } catch { /* subscriber disconnected */ }
    })
}

// --------------- POST: receive updates from chat page ---------------
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { userHash, conversationId, conversationName, chatList } = body

        if (!conversationId || !chatList) {
            return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 })
        }

        const entryId = `${userHash || 'anon'}::${conversationId}`
        const entry: FeedbackEntry = {
            id: entryId,
            userHash: userHash || 'anonymous',
            conversationId,
            conversationName: conversationName || '新的对话',
            chatList,
            updatedAt: Date.now(),
        }

        // Upsert into store
        const entries = readAll()
        const idx = entries.findIndex(e => e.id === entryId)
        if (idx >= 0) {
            entries[idx] = entry
        } else {
            entries.push(entry)
        }
        writeAll(entries)

        // Push to SSE subscribers
        notifySubscribers(entry)

        return new Response(JSON.stringify({ ok: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        })
    } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 })
    }
}

// --------------- GET: SSE stream OR full snapshot ---------------
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const mode = searchParams.get('mode')

    // Full snapshot (initial load)
    if (mode === 'snapshot') {
        const entries = readAll()
        return new Response(JSON.stringify(entries), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        })
    }

    // SSE stream
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
        start(controller) {
            // Send current snapshot as first event
            const entries = readAll()
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'snapshot', entries })}\n\n`))

            // Register subscriber
            const subscriber: Subscriber = (payload) => {
                try {
                    controller.enqueue(encoder.encode(payload))
                } catch {
                    subscribers.delete(subscriber)
                }
            }
            subscribers.add(subscriber)

            // Keep-alive ping every 15s
            const keepAlive = setInterval(() => {
                try {
                    controller.enqueue(encoder.encode(': ping\n\n'))
                } catch {
                    clearInterval(keepAlive)
                    subscribers.delete(subscriber)
                }
            }, 15000)

            // Cleanup on abort
            request.signal.addEventListener('abort', () => {
                clearInterval(keepAlive)
                subscribers.delete(subscriber)
                try { controller.close() } catch { /* already closed */ }
            })
        },
    })

    return new Response(stream, {
        status: 200,
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache, no-transform',
            'Connection': 'keep-alive',
            'X-Accel-Buffering': 'no',
        },
    })
}
