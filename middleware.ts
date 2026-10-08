import { clerkMiddleware } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// Authentication context only. Every private handler/page also authorizes server-side.
export default clerkMiddleware(async (_auth, request) => {
  const response = NextResponse.next()
  if (/^\/(chat|feedback|v1|api|exit|sign-in|sign-up)(\/|$)/.test(request.nextUrl.pathname)) {
    response.headers.set('Cache-Control', 'no-store, no-transform')
  }
  return response
}, request => ({ authorizedParties: [process.env.FRONTEND_ORIGIN || request.nextUrl.origin] }))

export const config = {
  matcher: ['/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)', '/(api|v1)(.*)'],
}
