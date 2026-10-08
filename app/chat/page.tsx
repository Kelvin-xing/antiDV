import { redirect } from 'next/navigation'
import Main from '@/app/components'
import { requireActor } from '@/lib/auth/server'
import { AccessError } from '@/lib/auth/policy'

export const dynamic = 'force-dynamic'
export default async function ChatPage() {
  try { await requireActor() }
  catch (error) {
    if (error instanceof AccessError && error.status === 401) { redirect('/sign-in') }
    throw error
  }
  return <Main />
}
