'use client'
import React, { useState } from 'react'

interface ReviewModalProps {
    messageId: string
    existingReview?: { score: number; comment: string }
    onSubmit: (messageId: string, review: { score: number; comment: string }) => void
    onClose: () => void
}

const StarIcon: React.FC<{ filled: boolean; onClick: () => void; onHover: () => void }> = ({ filled, onClick, onHover }) => (
    <svg
        className={`w-8 h-8 cursor-pointer transition-colors ${filled ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-300'}`}
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth={1.5}
        viewBox="0 0 24 24"
        onClick={onClick}
        onMouseEnter={onHover}
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
    </svg>
)

const SCORE_LABELS: Record<number, string> = {
    1: '非常差',
    2: '较差',
    3: '一般',
    4: '较好',
    5: '非常好',
}

const ReviewModal: React.FC<ReviewModalProps> = ({ messageId, existingReview, onSubmit, onClose }) => {
    const [score, setScore] = useState(existingReview?.score ?? 0)
    const [hoverScore, setHoverScore] = useState(0)
    const [comment, setComment] = useState(existingReview?.comment ?? '')

    const displayScore = hoverScore || score

    const handleSubmit = () => {
        if (score === 0) return
        onSubmit(messageId, { score, comment: comment.trim() })
        onClose()
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl p-6 w-80 flex flex-col gap-4"
                onClick={e => e.stopPropagation()}
            >
                <h3 className="text-base font-semibold text-gray-800 text-center">评价此回复</h3>

                {/* Stars */}
                <div
                    className="flex gap-1 justify-center"
                    onMouseLeave={() => setHoverScore(0)}
                >
                    {[1, 2, 3, 4, 5].map(i => (
                        <StarIcon
                            key={i}
                            filled={displayScore >= i}
                            onClick={() => setScore(i)}
                            onHover={() => setHoverScore(i)}
                        />
                    ))}
                </div>

                {/* Score label */}
                <p className="text-center text-sm text-gray-500 -mt-2 h-4">
                    {displayScore > 0 ? SCORE_LABELS[displayScore] : ''}
                </p>

                {/* Comment */}
                <textarea
                    className="w-full border border-gray-200 rounded-lg p-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-200"
                    rows={3}
                    placeholder="写下您的评论（选填，最多 500 字）"
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    maxLength={500}
                />

                <div className="flex gap-2 justify-end">
                    <button
                        className="px-4 py-1.5 text-sm text-gray-500 hover:text-gray-700 rounded-lg border border-gray-200 hover:border-gray-300"
                        onClick={onClose}
                    >
                        取消
                    </button>
                    <button
                        className={`px-4 py-1.5 text-sm text-white rounded-lg transition-colors ${score > 0 ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed'}`}
                        onClick={handleSubmit}
                        disabled={score === 0}
                    >
                        提交评价
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ReviewModal
