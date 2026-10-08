import { AccessError } from '@/lib/auth/policy'
export interface ReviewInput { conversationId: string, responseId: string, score: number, comment: string }
const idPattern = /^[a-zA-Z0-9_-]{1,128}$/
export function validateId(value: unknown): string {
  if (typeof value !== 'string' || !idPattern.test(value)) { throw new AccessError(400, '记录标识无效') }
  return value
}
export function validateReview(value: unknown): ReviewInput {
  if (!value || typeof value !== 'object') { throw new AccessError(400, '评价格式无效') }
  const data = value as Record<string, unknown>
  if (Object.keys(data).some(key => !['conversationId', 'responseId', 'score', 'comment'].includes(key))) {
    throw new AccessError(400, '评价包含不支持的字段')
  }
  const conversationId = validateId(data.conversationId)
  const responseId = validateId(data.responseId)
  if (typeof data.score !== 'number' || !Number.isInteger(data.score) || data.score < 1 || data.score > 5
    || typeof data.comment !== 'string' || Array.from(data.comment).length > 500) {
    throw new AccessError(400, '请选择 1–5 分，建议最多 500 字')
  }
  return { conversationId, responseId, score: data.score, comment: data.comment.trim() }
}
export function pageOffset(value: string | null): number {
  if (value === null) { return 0 }
  if (!/^\d{1,8}$/.test(value)) { throw new AccessError(400, '分页参数无效') }
  return Number(value)
}
