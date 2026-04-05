'use client'
import React, { useEffect, useRef, useState } from 'react'
import type { ChatItem } from '@/types/app'
import type { FeedbackPayload } from '@/utils/feedback-broadcast'
import { getLatestSnapshot, onFeedbackUpdate } from '@/utils/feedback-broadcast'

const SCORE_LABELS: Record<number, string> = {
    1: '非常差',
    2: '较差',
    3: '一般',
    4: '较好',
    5: '非常好',
}

function Stars({ score }: { score: number }) {
    return (
        <span className="inline-flex gap-0.5">
            {[1, 2, 3, 4, 5].map(i => (
                <svg
                    key={i}
                    className={`w-4 h-4 ${i <= score ? 'text-yellow-400' : 'text-gray-300'}`}
                    fill={i <= score ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    strokeWidth={1.5}
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                </svg>
            ))}
        </span>
    )
}

/** Pair a user question with the following AI answer */
interface QAPair {
    questionId: string
    question: string
    questionFiles?: any[]
    answerId: string
    answer: string
    feedback?: { rating: 'like' | 'dislike' | null }
    userReview?: { score: number; comment: string }
    workflowSteps?: string
}

function buildQAPairs(chatList: ChatItem[]): QAPair[] {
    const pairs: QAPair[] = []
    for (let i = 0; i < chatList.length; i++) {
        const item = chatList[i]
        if (item.isOpeningStatement) continue
        if (!item.isAnswer && i + 1 < chatList.length && chatList[i + 1].isAnswer) {
            const answer = chatList[i + 1]
            pairs.push({
                questionId: item.id,
                question: item.content,
                questionFiles: item.message_files,
                answerId: answer.id,
                answer: answer.content,
                feedback: answer.feedback ?? undefined,
                userReview: answer.userReview,
                workflowSteps: answer.workflowProcess?.tracing
                    ?.map((t: any) => t.title ?? t.node_type)
                    .join(' → '),
            })
        }
    }
    return pairs
}

export default function FeedbackPage() {
    const [payload, setPayload] = useState<FeedbackPayload | null>(null)
    const [connected, setConnected] = useState(false)
    const bottomRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        // Load latest snapshot on mount
        const snapshot = getLatestSnapshot()
        if (snapshot) {
            setPayload(snapshot)
            setConnected(true)
        }

        // Listen for real-time updates
        const unsubscribe = onFeedbackUpdate((incoming) => {
            setPayload(incoming)
            setConnected(true)
        })

        return unsubscribe
    }, [])

    // Auto-scroll to bottom on new data
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [payload])

    const pairs = payload ? buildQAPairs(payload.chatList) : []
    const reviewedCount = pairs.filter(p => p.userReview).length
    const avgScore = reviewedCount > 0
        ? (pairs.reduce((sum, p) => sum + (p.userReview?.score ?? 0), 0) / reviewedCount).toFixed(1)
        : '—'

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#FBF8F4' }}>
            {/* Header */}
            <header
                className="sticky top-0 z-30 backdrop-blur-sm border-b"
                style={{ backgroundColor: 'rgba(251,248,244,0.92)', borderColor: '#E6DDD5' }}
            >
                <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <h1
                            className="text-xl font-semibold"
                            style={{ color: '#3D3028', fontFamily: "'Noto Serif SC', serif" }}
                        >
                            实时反馈面板
                        </h1>
                        <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${connected ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
                                }`}
                        >
                            <span
                                className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}
                            />
                            {connected ? '已连接' : '等待聊天页面…'}
                        </span>
                    </div>
                    {payload && (
                        <span className="text-xs" style={{ color: '#8F7E6E' }}>
                            最后更新: {new Date(payload.timestamp).toLocaleTimeString('zh-CN')}
                        </span>
                    )}
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-6">
                {/* Stats bar */}
                {payload && (
                    <div
                        className="grid grid-cols-3 gap-4 mb-6 p-4 rounded-xl border"
                        style={{ backgroundColor: '#FFFDFB', borderColor: '#E6DDD5' }}
                    >
                        <div className="text-center">
                            <div className="text-2xl font-bold" style={{ color: '#3D3028' }}>
                                {payload.conversationName || '新的对话'}
                            </div>
                            <div className="text-xs mt-1" style={{ color: '#8F7E6E' }}>当前对话</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold" style={{ color: '#E8A87C' }}>
                                {pairs.length}
                            </div>
                            <div className="text-xs mt-1" style={{ color: '#8F7E6E' }}>问答轮次</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold flex items-center justify-center gap-1" style={{ color: '#E8A87C' }}>
                                {avgScore}
                                {reviewedCount > 0 && <span className="text-sm font-normal" style={{ color: '#8F7E6E' }}>/ 5</span>}
                            </div>
                            <div className="text-xs mt-1" style={{ color: '#8F7E6E' }}>
                                平均评分（{reviewedCount} 条已评）
                            </div>
                        </div>
                    </div>
                )}

                {/* Empty state */}
                {!payload && (
                    <div className="flex flex-col items-center justify-center py-32 text-center">
                        <svg className="w-16 h-16 mb-4" style={{ color: '#E6DDD5' }} fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                        </svg>
                        <p className="text-lg font-medium" style={{ color: '#8F7E6E' }}>
                            请在另一个标签页中打开聊天页面
                        </p>
                        <p className="text-sm mt-2" style={{ color: '#B3A597' }}>
                            专家的提问、Bot 回答和评分评语将在此实时展示
                        </p>
                    </div>
                )}

                {/* Q&A pairs */}
                <div className="space-y-5">
                    {pairs.map((pair, idx) => (
                        <div
                            key={pair.answerId}
                            className="rounded-xl border overflow-hidden transition-all"
                            style={{ borderColor: pair.userReview ? '#E8A87C' : '#E6DDD5', backgroundColor: '#FFFDFB' }}
                        >
                            {/* Sequence badge */}
                            <div
                                className="px-4 py-2 flex items-center justify-between text-xs"
                                style={{ backgroundColor: '#FAF5EF', borderBottom: '1px solid #E6DDD5', color: '#8F7E6E' }}
                            >
                                <span>第 {idx + 1} 轮</span>
                                {pair.feedback?.rating && (
                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${pair.feedback.rating === 'like' ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'
                                        }`}>
                                        {pair.feedback.rating === 'like' ? '👍 赞同' : '👎 反对'}
                                    </span>
                                )}
                            </div>

                            {/* Question */}
                            <div className="px-4 pt-3 pb-2">
                                <div className="flex items-start gap-2">
                                    <span
                                        className="shrink-0 mt-0.5 inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold text-white"
                                        style={{ backgroundColor: '#E8A87C' }}
                                    >
                                        Q
                                    </span>
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
                                    <span
                                        className="shrink-0 mt-0.5 inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold text-white"
                                        style={{ backgroundColor: '#7CB9A8' }}
                                    >
                                        A
                                    </span>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-xs font-medium mb-1" style={{ color: '#8F7E6E' }}>Bot 回答</div>
                                        <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: '#4A4238' }}>
                                            {pair.answer || (
                                                <span className="italic" style={{ color: '#B3A597' }}>正在回答…</span>
                                            )}
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
                                <div
                                    className="px-4 py-3"
                                    style={{ backgroundColor: '#FFF8F0', borderTop: '1px solid #F5E6D3' }}
                                >
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
            </main>
        </div>
    )
}
