'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { templates } from '../templates'

export default function TemplateFormPage() {
    const params = useParams()
    const templateId = params.templateId as string
    const template = templates.find(t => t.id === templateId)

    const [formData, setFormData] = useState<Record<string, string>>({})
    const [generating, setGenerating] = useState(false)
    const [error, setError] = useState('')

    if (!template) {
        return (
            <div style={{ minHeight: '100vh', background: '#FBF8F4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                    <p style={{ fontFamily: "'Noto Sans SC', sans-serif", fontSize: 16, color: '#8F7E6E', marginBottom: 16 }}>未找到该模板</p>
                    <Link href="/docs-toolkit" style={{ color: '#E8A87C', textDecoration: 'none', fontFamily: "'Noto Sans SC', sans-serif" }}>
                        ← 返回文档工具库
                    </Link>
                </div>
            </div>
        )
    }

    const handleChange = (key: string, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }))
        setError('')
    }

    const handleGenerate = async () => {
        // Validate required fields
        const missing = template.fields.filter(f => f.required && !formData[f.key]?.trim())
        if (missing.length > 0) {
            setError(`请填写以下必填项：${missing.map(f => f.label).join('、')}`)
            return
        }

        setGenerating(true)
        setError('')

        try {
            const res = await fetch('/api/generate-doc', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ templateId: template.id, fields: formData }),
            })

            if (!res.ok) {
                throw new Error('生成文档失败，请重试')
            }

            const blob = await res.blob()
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `${template.name}.docx`
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(url)
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : '生成文档失败，请重试')
        } finally {
            setGenerating(false)
        }
    }

    return (
        <div style={{ minHeight: '100vh', background: '#FBF8F4' }}>
            {/* Header */}
            <header style={{
                padding: '16px 24px',
                borderBottom: '1px solid #E6DDD5',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                background: '#fff',
            }}>
                <Link href="/docs-toolkit" style={{ color: '#E8A87C', textDecoration: 'none', fontFamily: "'Noto Sans SC', sans-serif", fontSize: 14 }}>
                    ← 返回文档工具库
                </Link>
            </header>

            <div style={{ maxWidth: 640, margin: '0 auto', padding: '32px 24px 64px' }}>
                {/* Title */}
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <span style={{ fontSize: 40 }}>{template.icon}</span>
                    <h1 style={{
                        fontFamily: "'Noto Serif SC', serif",
                        fontSize: 24,
                        color: '#3D3028',
                        marginTop: 12,
                        marginBottom: 8,
                    }}>
                        {template.name}
                    </h1>
                    <p style={{
                        fontFamily: "'Noto Sans SC', sans-serif",
                        fontSize: 14,
                        color: '#8F7E6E',
                        lineHeight: 1.6,
                    }}>
                        {template.description}
                    </p>
                </div>

                {/* Form */}
                <div style={{
                    background: '#fff',
                    borderRadius: 12,
                    padding: '28px 24px',
                    border: '1px solid #E6DDD5',
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        {template.fields.map(field => (
                            <div key={field.key}>
                                <label style={{
                                    display: 'block',
                                    fontFamily: "'Noto Sans SC', sans-serif",
                                    fontSize: 14,
                                    color: '#3D3028',
                                    marginBottom: 6,
                                    fontWeight: 500,
                                }}>
                                    {field.label}
                                    {field.required && <span style={{ color: '#E8A87C', marginLeft: 4 }}>*</span>}
                                </label>

                                {field.type === 'textarea' ? (
                                    <textarea
                                        value={formData[field.key] || ''}
                                        onChange={e => handleChange(field.key, e.target.value)}
                                        placeholder={field.placeholder}
                                        rows={4}
                                        style={{
                                            width: '100%',
                                            padding: '10px 12px',
                                            borderRadius: 8,
                                            border: '1px solid #E6DDD5',
                                            fontFamily: "'Noto Sans SC', sans-serif",
                                            fontSize: 14,
                                            color: '#3D3028',
                                            resize: 'vertical',
                                            outline: 'none',
                                            lineHeight: 1.6,
                                            boxSizing: 'border-box',
                                        }}
                                    />
                                ) : field.type === 'select' ? (
                                    <select
                                        value={formData[field.key] || ''}
                                        onChange={e => handleChange(field.key, e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '10px 12px',
                                            borderRadius: 8,
                                            border: '1px solid #E6DDD5',
                                            fontFamily: "'Noto Sans SC', sans-serif",
                                            fontSize: 14,
                                            color: formData[field.key] ? '#3D3028' : '#aaa',
                                            background: '#fff',
                                            outline: 'none',
                                            boxSizing: 'border-box',
                                        }}
                                    >
                                        <option value="">{field.placeholder}</option>
                                        {field.options?.map(opt => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        type={field.type === 'date' ? 'date' : 'text'}
                                        value={formData[field.key] || ''}
                                        onChange={e => handleChange(field.key, e.target.value)}
                                        placeholder={field.placeholder}
                                        style={{
                                            width: '100%',
                                            padding: '10px 12px',
                                            borderRadius: 8,
                                            border: '1px solid #E6DDD5',
                                            fontFamily: "'Noto Sans SC', sans-serif",
                                            fontSize: 14,
                                            color: '#3D3028',
                                            outline: 'none',
                                            boxSizing: 'border-box',
                                        }}
                                    />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Error */}
                    {error && (
                        <p style={{
                            marginTop: 16,
                            fontFamily: "'Noto Sans SC', sans-serif",
                            fontSize: 13,
                            color: '#d9534f',
                            lineHeight: 1.5,
                        }}>
                            {error}
                        </p>
                    )}

                    {/* Generate Button */}
                    <button
                        onClick={handleGenerate}
                        disabled={generating}
                        style={{
                            marginTop: 24,
                            width: '100%',
                            padding: '14px 0',
                            borderRadius: 8,
                            border: 'none',
                            background: generating ? '#ccc' : '#E8A87C',
                            color: '#fff',
                            fontFamily: "'Noto Sans SC', sans-serif",
                            fontSize: 16,
                            fontWeight: 600,
                            cursor: generating ? 'not-allowed' : 'pointer',
                            transition: 'background 0.2s',
                        }}
                    >
                        {generating ? '正在生成...' : '生成并下载文档 (.docx)'}
                    </button>
                </div>

                {/* Privacy Notice */}
                <div style={{
                    marginTop: 24,
                    padding: '14px 18px',
                    background: '#F0F8F4',
                    borderRadius: 8,
                    border: '1px solid #C8E0D4',
                }}>
                    <p style={{
                        fontFamily: "'Noto Sans SC', sans-serif",
                        fontSize: 13,
                        color: '#5A8A6E',
                        lineHeight: 1.7,
                    }}>
                        🔒 隐私保障：您填写的信息仅用于生成文档，生成过程在服务端即时完成，不会存储任何个人数据。
                    </p>
                </div>
            </div>
        </div>
    )
}
