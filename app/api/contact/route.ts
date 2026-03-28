import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const DATA_DIR = process.env.DATA_DIR || (process.env.NODE_ENV === 'production' ? '/tmp/adv-contacts' : path.join(process.cwd(), 'data'))
const CONTACTS_FILE = path.join(DATA_DIR, 'contacts.jsonl')
// Simple admin secret — set CONTACT_ADMIN_SECRET env var in production
const ADMIN_SECRET = process.env.CONTACT_ADMIN_SECRET || 'xiao-an-admin'

function ensureFile() {
    if (!fs.existsSync(DATA_DIR)) { fs.mkdirSync(DATA_DIR, { recursive: true }) }
    if (!fs.existsSync(CONTACTS_FILE)) { fs.writeFileSync(CONTACTS_FILE, '') }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { message, name, phone, wechat, email } = body

        if (!message || typeof message !== 'string' || message.trim().length === 0) {
            return NextResponse.json({ error: '留言内容不能为空' }, { status: 400 })
        }
        if (message.trim().length > 2000) {
            return NextResponse.json({ error: '留言内容不超过 2000 字' }, { status: 400 })
        }

        const record = {
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            createdAt: new Date().toISOString(),
            message: message.trim(),
            name: (name || '').trim().slice(0, 50) || null,
            phone: (phone || '').trim().slice(0, 20) || null,
            wechat: (wechat || '').trim().slice(0, 50) || null,
            email: (email || '').trim().slice(0, 100) || null,
        }

        ensureFile()
        fs.appendFileSync(CONTACTS_FILE, JSON.stringify(record) + '\n', 'utf8')

        return NextResponse.json({ success: true, id: record.id })
    }
    catch (err: any) {
        console.error('[contact POST]', err)
        return NextResponse.json({ error: '服务器错误，请稍后再试' }, { status: 500 })
    }
}

export async function GET(request: NextRequest) {
    const secret = request.nextUrl.searchParams.get('secret')
    if (secret !== ADMIN_SECRET) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        ensureFile()
        const raw = fs.readFileSync(CONTACTS_FILE, 'utf8')
        const records = raw
            .split('\n')
            .filter(Boolean)
            .map(line => JSON.parse(line))
            .reverse() // newest first

        return NextResponse.json({ total: records.length, records })
    }
    catch (err: any) {
        console.error('[contact GET]', err)
        return NextResponse.json({ error: '服务器错误' }, { status: 500 })
    }
}
