import type { NextRequest } from 'next/server'
import { requireActor } from '@/lib/auth/server'
import { AccessError, accessResponse, assertSameOrigin } from '@/lib/auth/policy'
import { ownReviews, saveReview } from '@/lib/feedback/repository'
import { validateId, validateReview } from '@/lib/feedback/validation'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export async function GET(request: NextRequest) {
  try {
    const actor = await requireActor()
    const items = await ownReviews(actor, validateId(request.nextUrl.searchParams.get('conversationId')))
    return Response.json({ items }, { headers: { 'Cache-Control': 'no-store' } })
  }
  catch (error) { return accessResponse(error) }
}
export async function POST(request: NextRequest) {
  try {
    assertSameOrigin(request)
    const actor = await requireActor()
    const text = await request.text()
    if (text.length > 8000) { throw new AccessError(413, '评价内容过长') }
    let payload: unknown
    try { payload = JSON.parse(text) }
    catch { throw new AccessError(400, '评价格式无效') }
    const review = await saveReview(actor, validateReview(payload))
    return Response.json(review, { headers: { 'Cache-Control': 'no-store' } })
  }
  catch (error) { return accessResponse(error) }
}
