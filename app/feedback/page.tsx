import { notFound, redirect } from 'next/navigation'
import { requireActor } from '@/lib/auth/server'
import { AccessError } from '@/lib/auth/policy'
import FeedbackDashboard from '@/app/components/feedback/dashboard'

export const dynamic = 'force-dynamic'
export default async function FeedbackPage() {
  try { await requireActor(true) }
  catch (error) {
    if (error instanceof AccessError && error.status === 401) { redirect('/sign-in') }
    if (error instanceof AccessError && error.status === 403) { notFound() }
    throw error
  }
  return <FeedbackDashboard />
}
