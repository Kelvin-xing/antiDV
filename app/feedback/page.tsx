'use client'
import React, { useCallback, useEffect, useRef, useState } from 'react'

/* ────────────────────── Types ────────────────────── */

interface FeedbackEntry {
    id: string
    userHash: string
    conversationId: string
    conversationName: string
    chatList: any[]
    updatedAt: number
}

interface QAPair {
    question: string
    answer: string
    feedback?: { rating: 'like' | 'dislike' | null }
    userReview?: { score: number; comment: string }
    workflowSteps?: string
}

const SCORE_LABELS: Record<number, string> = {
    1: '非常差', 2: '较差', 3: '一般', 4: '较好', 5: '非常好',
}

const POLL_INTERVAL = 3000 // 3 seconds

/* ────────────────────── Helpers ────────────────────── */

function Stars({ score }: { score: number }) {
    return (
        <span className="inline-flex gap-0.5">
            {[1, 2, 3, 4, 5].map(i => (
                <svg key={i} className={`w-4 h-4 ${i <= score ? 'text-yellow-400' : 'text-gray-300'}`}
                    fill={i <= score ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                </svg>
            ))}
        </span>
    )
}

function buildQAPairs(chatList: any[]): QAPair[] {
    const pairs: QAPair[] = []
    for (let i = 0; i < chatList.length; i++) {
        const item = chatList[i]
        if (item.isOpeningStatement) continue
        if (!item.isAnswer && i + 1 < chatList.length && chatList[i + 1].isAnswer) {
            const answer = chatList[i + 1]
            pairs.push({
                question: item.content,
                answer: answer.content,
                feedback: answer.feedback ?? undefined,
                userReview: answer.userReview,
                workflowSteps: answer.workflowProcess?.tracing
                    ?.map((t: any) => t.title ?? t.node_type).join(' → '),
            })
        }
    }
    return pairs
}

function shortHash(hash: string) {
    if (!hash || hash === 'anonymous') return '匿名用户'
    return hash.length > 8 ? hash.slice(0, 8) + '…' : hash
}

/* ────────────────────── Main Page ────────────────────── */

export default function FeedbackAdminPage() {
    const [entries, setEntries] = useState<FeedbackEntry[]>([])
    const [connected, setConnected] = useState(false)
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const [lastUpdate, setLastUpdate] = useState<string>('')
    const bottomRef = useRef<HTMLDivElement>(null)

    const upsertEntries = useCallback((incoming: FeedbackEntry[]) => {
        setEntries(prev => {
            const map = new Map(prev.map(e => [e.id, e]))
            incoming.forEach(e => map.set(e.id, e))
            return Array.from(map.values())
        })
    }, [])

    // Polling loop
    useEffect(() => {
        let active = true
        let sinceTs = 0

        async function poll() {
            try {
                const res = await fetch(`/api/feedback?since=${sinceTs}`)
                if (!res.ok) throw new Error('fetch failed')
                const data = await res.json()
                if (!active) return
                if (data.entries && data.entries.length > 0) {
                    upsertEntries(data.entries)
                    // Update since to the latest updatedAt
                    const maxTs = Math.max(...data.entries.map((e: FeedbackEntry) => e.updatedAt))
                    if (maxTs > sinceTs) sinceTs = maxTs
                }
                setConnected(true)
                setLastUpdate(new Date().toLocaleTimeString('zh-CN'))
            } catch {
                setConnected(false)
            }
        }

        // Initial fetch (get all entries, since=0)
        poll()
        const timer = setInterval(poll, POLL_INTERVAL)
        return () => {
            active = false
            clearInterval(timer)
        }
    }, [upsertEntries])

    // Auto-scroll when selected conversation updates
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [entries, selectedId])

    // Sort: most recently updated first
    const sorted = [...entries].sort((a, b) => b.updatedAt - a.updatedAt)
    const selected = selectedId ? entries.find(e => e.id === selectedId) : sorted[0]
    const selectedPairs = selected ? buildQAPairs(selected.chatList) : []

    // Global stats
    const allPairs = entries.flatMap(e => buildQAPairs(e.chatList))
    const totalReviews = allPairs.filter(p => p.userReview).length
    const avgScore = totalReviews > 0
        ? (allPairs.reduce((s, p) => s + (p.userReview?.score ?? 0), 0) / totalReviews).toFixed(1)
        : '—'

    return (
        <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#FBF8F4' }}>
            {/* Header */}
            <header className="sticky top-0 z-30 backdrop-blur-sm border-b"
                style={{ backgroundColor: 'rgba(251,248,244,0.92)', borderColor: '#E6DDD5' }}>
                <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <h1 className="text-xl font-semibold"
                            style={{ color: '#3D3028', fontFamily: "'Noto Serif SC', serif" }}>
                            管理员反馈面板
                        </h1>
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${connected ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-green-500 animate-pulse' : 'bg-red-400'}`} />
                            {connected ? '已连接' : '正在连接…'}
                        </span>
                        {lastUpdate && (
                            <span className="text-xs" style={{ color: '#B3A597' }}>
                                更新: {lastUpdate}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-6 text-sm" style={{ color: '#8F7E6E' }}>
                        <span>用户会话: <b className="text-base" style={{ color: '#3D3028' }}>{entries.length}</b></span>
                        <span>总问答: <b className="text-base" style={{ color: '#3D3028' }}>{allPairs.length}</b></span>
                        <span>已评价: <b className="text-base" style={{ color: '#E8A87C' }}>{totalReviews}</b></span>
                        <span>均分: <b className="text-base" style={{ color: '#E8A87C' }}>{avgScore}</b></span>
                    </div>
                </div>
            </header>

            {/* Body: sidebar + detail */}
            <div className="flex flex-1 overflow-hidden" style={{ height: 'calc(100vh - 56px)' }}>

                {/* Left: conversation list */}
                <aside className="w-72 shrink-0 border-r overflow-y-auto"
                    style={{ borderColor: '#E6DDD5', backgroundColor: '#FFFDFB' }}>
                    <div className="p-3 text-xs font-medium" style={{ color: '#8F7E6E', borderBottom: '1px solid #E6DDD5' }}>
                        所有会话（{sorted.length}）
                    </div>
                    {sorted.length === 0 && (
                        <div className="p-6 text-center text-sm" style={{ color: '#B3A597' }}>
                            等待用户开始对话…
                        </div>
                    )}
                    {sorted.map(entry => {
                        const pairs = buildQAPairs(entry.chatList)
                        const reviewed = pairs.filter(p => p.userReview).length
                        const isActive = selected?.id === entry.id
                        return (
                            <button key={entry.id}
                                onClick={() => setSelectedId(entry.id)}
                                className={`w-full text-left px-4 py-3 border-b transition-colors ${isActive ? '' : 'hover:bg-gray-50'}`}
                                style={{
                                    borderColor: '#F0EBE5',
                                    backgroundColor: isActive ? '#FFF3E8' : undefined,
                                }}>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium truncate" style={{ color: '#3D3028', maxWidth: '150px' }}>
                                        {entry.conversationName}
                                    </span>
                                    {reviewed > 0 && (
                                        <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ backgroundColor: '#FEF3C7', color: '#D97706' }}>
                                            {reviewed} 评
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center justify-between mt-1">
                                    <span className="text-xs" style={{ color: '#B3A597' }}>
                                        {shortHash(entry.userHash)}
                                    </span>
                                    <span className="text-xs" style={{ color: '#B3A597' }}>
                                        {pairs.length} 轮 · {new Date(entry.updatedAt).toLocaleTimeString('zh-CN')}
                                    </span>
                                </div>
                            </button>
                        )
                    })}
                </aside>

                {/* Right: detail view */}
                <main className="flex-1 overflow-y-auto p-6">
                    {!selected ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <svg className="w-16 h-16 mb-4" style={{ color: '#E6DDD5' }} fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                            </svg>
                            <p className="text-lg font-medium" style={{ color: '#8F7E6E' }}>
                                等待用户开始聊天
                            </p>
                            <p className="text-sm mt-2" style={{ color: '#B3A597' }}>
                                所有用户的提问、Bot 回答和专家评价将在此实时展示
                            </p>
                        </div>
                    ) : (
                        <div className="max-w-3xl mx-auto">
                            {/* Conversation header */}
                            <div className="mb-5 pb-4" style={{ borderBottom: '1px solid #E6DDD5' }}>
                                <h2 className="text-lg font-semibold" style={{ color: '#3D3028', fontFamily: "'Noto Serif SC', serif" }}>
                                    {selected.conversationName}
                                </h2>
                                <div className="flex items-center gap-4 mt-1 text-xs" style={{ color: '#8F7E6E' }}>
                                    <span>用户: {shortHash(selected.userHash)}</span>
                                    <span>会话 ID: {selected.conversationId.slice(0, 12)}…</span>
                                    <span>更新: {new Date(selected.updatedAt).toLocaleString('zh-CN')}</span>
                                </div>
                            </div>

                            {/* Q&A pairs */}
                            <div className="space-y-5">
                                {selectedPairs.map((pair, idx) => (
                                    <div key={idx}
                                        className="rounded-xl border overflow-hidden transition-all"
                                        style={{ borderColor: pair.userReview ? '#E8A87C' : '#E6DDD5', backgroundColor: '#FFFDFB' }}>
                                        {/* Round badge */}
                                        <div className="px-4 py-2 flex items-center justify-between text-xs"
                                            style={{ backgroundColor: '#FAF5EF', borderBottom: '1px solid #E6DDD5', color: '#8F7E6E' }}>
                                            <span>第 {idx + 1} 轮</span>
                                            {pair.feedback?.rating && (
                                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${pair.feedback.rating === 'like' ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'}`}>
                                                    {pair.feedback.rating === 'like' ? '👍 赞同' : '👎 反对'}
                                                </span>
                                            )}
                                        </div>

                                        {/* Question */}
                                        <div className="px-4 pt-3 pb-2">
                                            <div className="flex items-start gap-2">
                                                <span className="shrink-0 mt-0.5 inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold text-white"
                                                    style={{ backgroundColor: '#E8A87C' }}>Q</span>
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-xs font-medium mb-1" style={{ color: '#8F7E6E' }}>专家提问</div>
                                                    <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: '#3D3028' }}>
                                                        {pair.question}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Answer */}
                                        <div className="px-4 pt-2 pb-3" style={{ borderTop: '1px dashed #E6DDD5' }}>
                                            <div className="flex items-start gap-2">
                                                <span className="shrink-0 mt-0.5 inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold text-white"
                                                    style={{ backgroundColor: '#7CB9A8' }}>A</span>
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-xs font-medium mb-1" style={{ color: '#8F7E6E' }}>Bot 回答</div>
                                                    <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: '#4A4238' }}>
                                                        {pair.answer || <span className="italic" style={{ color: '#B3A597' }}>正在回答…</span>}
                                                    </p>
                                                    {pair.workflowSteps && (
                                                        <div className="mt-2 text-xs px-2 py-1 rounded-md inline-block" style={{ backgroundColor: '#F5F0EB', color: '#8F7E6E' }}>
                                                            🔗 {pair.workflowSteps}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Expert review */}
                                        {pair.userReview && (
                                            <div className="px-4 py-3" style={{ backgroundColor: '#FFF8F0', borderTop: '1px solid #F5E6D3' }}>
                                                <div className="flex items-center gap-2 mb-1.5">
                                                    <span className="text-xs font-semibold" style={{ color: '#E8A87C' }}>专家评价</span>
                                                    <Stars score={pair.userReview.score} />
                                                    <span className="text-xs" style={{ color: '#8F7E6E' }}>
                                                        {pair.userReview.score} 分 · {SCORE_LABELS[pair.userReview.score]}
                                                    </span>
                                                </div>
                                                {pair.userReview.comment && (
                                                    <p className="text-sm leading-relaxed pl-0.5" style={{ color: '#4A4238' }}>
                                                        「{pair.userReview.comment}」
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div ref={bottomRef} />
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}
