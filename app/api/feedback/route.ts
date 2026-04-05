import type { NextRequest } from 'next/server'

export interface FeedbackEntry {
    id: string
    userHash: string
    conversationId: string
    conversationName: string
    chatList: any[]
    updatedAt: number
}

const store = new Map<string, FeedbackEntry>()

const TMP_FILE = '/tmp/xiaoAn_feedback.json'

function loadFromTmp() {
    if (store.size > 0) return
    try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const fs = require('fs')
        if (fs.existsSync(TMP_FILE)) {
            const entries: FeedbackEntry[] = JSON.parse(fs.readFileSync(TMP_FILE, 'utf-8'))
            entries.forEach((e: FeedbackEntry) => store.set(e.id, e))
        }
    } catch {
        // /tmp read failed, start fresh
    }
}

function saveToTmp() {
    try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const fs = require('fs')
        const entries = Array.from(store.values())
        fs.writeFileSync(TMP_FILE, JSON.stringify(entries), 'utf-8')
    } catch {
        // /tmp write failed, ignore
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { userHash, conversationId, conversationName, chatList } = body

        if (!conversationId || !chatList) {
            return Response.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const entryId = (userHash || 'anon') + '::' + conversationId
        const entry: FeedbackEntry = {
            id: entryId,
            userHash: userHash || 'anonymous',
            conversationId,
            conversationName: conversationName || '新的对话',
            chatList,
            updatedAt: Date.now(),
        }

        store.set(entryId, entry)
        saveToTmp()

        return Response.json({ ok: true })
    } catch (err: any) {
        return Response.json({ error: err.message }, { status: 500 })
    }
}

export async function GET(request: NextRequest) {
    try {
        loadFromTmp()

        const url = new URL(request.url)
        const since = Number(url.searchParams.get('since')) || 0

        const entries = Array.from(store.values())
            .filter((e: FeedbackEntry) => e.updatedAt > since)
            .sort((a: FeedbackEntry, b: FeedbackEntry) => b.updatedAt - a.updatedAt)

        return Response.json({
            entries,
            total: store.size,
            timestamp: Date.now(),
        })
    } catch (err: any) {
        return Response.json({ error: err.message }, { status: 500 })
    }
}
