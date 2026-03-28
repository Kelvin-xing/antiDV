'use client'
import React, { useState } from 'react'
import type { FC } from 'react'
import { useUserHash } from '@/hooks/use-user-hash'

interface UserHashPanelProps {
    onClose: () => void
}

const UserHashPanel: FC<UserHashPanelProps> = ({ onClose }) => {
    const { currentHash, generateHash, setHash, clearHash } = useUserHash()
    const [inputValue, setInputValue] = useState('')
    const [inputError, setInputError] = useState('')
    const [copied, setCopied] = useState(false)
    const [showNewWarning, setShowNewWarning] = useState(false)

    const handleCopy = async () => {
        if (!currentHash) { return }
        await navigator.clipboard.writeText(currentHash)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleGenerate = () => {
        if (currentHash) {
            setShowNewWarning(true)
        }
        else {
            generateHash()
        }
    }

    const handleConfirmGenerate = () => {
        generateHash()
        setShowNewWarning(false)
    }

    const handleSetHash = () => {
        setInputError('')
        const ok = setHash(inputValue)
        if (!ok) {
            setInputError('格式不正确，请输入完整的 UUID（例如：xxxxxxxx-xxxx-4xxx-xxxx-xxxxxxxxxxxx）')
            return
        }
        setInputValue('')
        window.location.reload()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
            <div
                className="relative w-full max-w-md rounded-2xl p-6 shadow-xl"
                style={{ backgroundColor: '#FBF8F4', border: '1px solid #E6DDD5' }}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-lg font-semibold" style={{ color: '#3D2C1E' }}>
                        🔑 我的身份识别码
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-xl leading-none"
                        style={{ color: '#B5A898' }}
                    >
                        ✕
                    </button>
                </div>

                {/* Privacy notice */}
                <p className="text-xs mb-5 leading-relaxed" style={{ color: '#8C7B6E' }}>
                    小安不需要你的姓名或任何个人资料。这个识别码是你和聊天记录之间唯一的连结——请妥善保存，换设备时可凭此找回记录。
                </p>

                {/* Current hash display */}
                <div className="mb-4">
                    <div className="text-xs font-medium mb-1" style={{ color: '#5C4D3E' }}>你的识别码</div>
                    {currentHash
                        ? (
                            <div className="flex items-center gap-2">
                                <div
                                    className="flex-1 rounded-lg px-3 py-2 text-xs font-mono break-all"
                                    style={{ backgroundColor: '#F2EDE8', color: '#3D2C1E', border: '1px solid #E6DDD5' }}
                                >
                                    {currentHash}
                                </div>
                                <button
                                    onClick={handleCopy}
                                    className="flex-shrink-0 px-3 py-2 rounded-lg text-xs font-medium transition-colors"
                                    style={{ backgroundColor: copied ? '#7CB9A8' : '#E8A87C', color: '#fff' }}
                                >
                                    {copied ? '已复制 ✓' : '复制'}
                                </button>
                            </div>
                        )
                        : (
                            <div
                                className="rounded-lg px-3 py-2 text-xs"
                                style={{ backgroundColor: '#F2EDE8', color: '#B5A898' }}
                            >
                                尚未生成识别码
                            </div>
                        )}
                </div>

                {/* Generate new hash */}
                {showNewWarning
                    ? (
                        <div
                            className="rounded-lg p-3 mb-4 text-xs"
                            style={{ backgroundColor: '#FFF3CD', border: '1px solid #FFCC80', color: '#7B5800' }}
                        >
                            <p className="font-medium mb-2">⚠️ 确定要生成新识别码？</p>
                            <p className="mb-3">旧识别码对应的聊天记录将无法通过新识别码找回（你可以改输入旧识别码来恢复）。</p>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleConfirmGenerate}
                                    className="px-3 py-1 rounded-md text-white text-xs"
                                    style={{ backgroundColor: '#E8734A' }}
                                >
                                    确定生成
                                </button>
                                <button
                                    onClick={() => setShowNewWarning(false)}
                                    className="px-3 py-1 rounded-md text-xs"
                                    style={{ backgroundColor: '#E6DDD5', color: '#5C4D3E' }}
                                >
                                    取消
                                </button>
                            </div>
                        </div>
                    )
                    : (
                        <button
                            onClick={handleGenerate}
                            className="w-full py-2 rounded-lg text-sm font-medium mb-4 transition-colors"
                            style={{ backgroundColor: '#E8A87C', color: '#fff' }}
                        >
                            {currentHash ? '重新生成识别码' : '生成我的识别码'}
                        </button>
                    )}

                {/* Input existing hash */}
                <div className="border-t pt-4" style={{ borderColor: '#E6DDD5' }}>
                    <div className="text-xs font-medium mb-2" style={{ color: '#5C4D3E' }}>换设备？输入已有识别码</div>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={e => setInputValue(e.target.value)}
                            placeholder="粘贴你的识别码..."
                            className="flex-1 rounded-lg px-3 py-2 text-xs outline-none"
                            style={{ backgroundColor: '#F2EDE8', border: '1px solid #E6DDD5', color: '#3D2C1E' }}
                        />
                        <button
                            onClick={handleSetHash}
                            disabled={!inputValue.trim()}
                            className="px-3 py-2 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
                            style={{ backgroundColor: '#7CB9A8', color: '#fff' }}
                        >
                            确认
                        </button>
                    </div>
                    {inputError && (
                        <p className="text-xs mt-1" style={{ color: '#E8734A' }}>{inputError}</p>
                    )}
                </div>

                {/* Clear */}
                {currentHash && (
                    <button
                        onClick={() => { clearHash(); onClose() }}
                        className="w-full mt-4 py-1.5 rounded-lg text-xs transition-colors"
                        style={{ color: '#B5A898' }}
                    >
                        清除识别码（切换为匿名模式）
                    </button>
                )}
            </div>
        </div>
    )
}

export default UserHashPanel
