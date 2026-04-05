import type { NextRequest } from 'next/server'
import { neon } from '@neondatabase/serverless'

/* ────────────── Types ────────────── */

export interface FeedbackEntry {
    id: string
    userHash: string
    conversationId: string
    conversationName: string
    chatList: any[]
    updatedAt: number
}

/* ────────────── Auto-create table ────────────── */

let tableReady = false

const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL

if (!databaseUrl) {
    throw new Error('Missing DATABASE_URL or POSTGRES_URL for feedback storage')
}

const sql = neon(databaseUrl)

async function ensureTable() {
    if (tableReady) return
    await sql`
        CREATE TABLE IF NOT EXISTS feedback_entries (
            id             TEXT PRIMARY KEY,
            user_hash      TEXT NOT NULL,
            conversation_id TEXT NOT NULL,
            conversation_name TEXT NOT NULL DEFAULT '新的对话',
            chat_list      JSONB NOT NULL DEFAULT '[]'::jsonb,
            updated_at     BIGINT NOT NULL
        )
    `
    // Index for polling by timestamp
    await sql`
        CREATE INDEX IF NOT EXISTS idx_feedback_updated_at
        ON feedback_entries (updated_at)
    `
    tableReady = true
}

/* ────────────── POST: upsert entry ────────────── */

export async function POST(request: NextRequest) {
    try {
        await ensureTable()

        const body = await request.json()
        const { userHash, conversationId, conversationName, chatList } = body

        if (!conversationId || !chatList) {
            return Response.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const entryId = (userHash || 'anon') + '::' + conversationId
        const now = Date.now()
        const chatListJson = JSON.stringify(chatList)

        await sql`
            INSERT INTO feedback_entries (id, user_hash, conversation_id, conversation_name, chat_list, updated_at)
            VALUES (${entryId}, ${userHash || 'anonymous'}, ${conversationId}, ${conversationName || '新的对话'}, ${chatListJson}::jsonb, ${now})
            ON CONFLICT (id) DO UPDATE SET
                conversation_name = EXCLUDED.conversation_name,
                chat_list         = EXCLUDED.chat_list,
                updated_at        = EXCLUDED.updated_at
        `

        return Response.json({ ok: true })
    } catch (err: any) {
        console.error('[feedback POST]', err)
        return Response.json({ error: err.message }, { status: 500 })
    }
}

/* ────────────── GET: poll entries ────────────── */

export async function GET(request: NextRequest) {
    try {
        await ensureTable()

        const url = new URL(request.url)
        const since = Number(url.searchParams.get('since')) || 0

        const rows = await sql`
            SELECT id, user_hash, conversation_id, conversation_name, chat_list, updated_at
            FROM feedback_entries
            WHERE updated_at > ${since}
            ORDER BY updated_at DESC
        `

        const entries: FeedbackEntry[] = rows.map((r: any) => ({
            id: r.id,
            userHash: r.user_hash,
            conversationId: r.conversation_id,
            conversationName: r.conversation_name,
            chatList: typeof r.chat_list === 'string' ? JSON.parse(r.chat_list) : r.chat_list,
            updatedAt: Number(r.updated_at),
        }))

        // Total count (cheap on small tables)
        const countRows = await sql`SELECT COUNT(*)::int AS total FROM feedback_entries`

        return Response.json({
            entries,
            total: Number((countRows as any[])[0]?.total ?? entries.length),
            timestamp: Date.now(),
        })
    } catch (err: any) {
        console.error('[feedback GET]', err)
        return Response.json({ error: err.message }, { status: 500 })
    }
}
