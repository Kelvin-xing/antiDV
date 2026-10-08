import type { NextRequest } from 'next/server'
import { auth, clerkClient } from '@clerk/nextjs/server'
import { assertSameOrigin, accessResponse } from '@/lib/auth/policy'
import { clearedSessionResponse } from '@/lib/auth/clear-session'

export async function POST(request: NextRequest) {
  try { assertSameOrigin(request) }
  catch (error) { return accessResponse(error) }
  let revoked = false
  try {
    const { sessionId } = await auth()
    if (sessionId) {
      const clerk = await clerkClient()
      const session = await clerk.sessions.getSession(sessionId)
      if (session.status === 'active') { await clerk.sessions.revokeSession(sessionId) }
    }
    revoked = true
  }
  catch { /* Clear browser credentials even if Clerk is temporarily unavailable. */ }
  return clearedSessionResponse(request, revoked)
}
