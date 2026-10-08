import type { NextRequest } from 'next/server'
import { requireActor } from '@/lib/auth/server'
import { accessResponse } from '@/lib/auth/policy'
import { adminConversations } from '@/lib/feedback/repository'
import { pageOffset, validateId } from '@/lib/feedback/validation'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export async function GET(request: NextRequest) {
  try {
    const actor = await requireActor(true)
    const id = request.nextUrl.searchParams.get('conversationId')
    const data = await adminConversations(actor, pageOffset(request.nextUrl.searchParams.get('offset')), id === null ? undefined : validateId(id))
    return Response.json(data, { headers: { 'Cache-Control': 'no-store' } })
  }
  catch (error) { return accessResponse(error) }
}
// The old client-supplied transcript write endpoint is intentionally retired.
