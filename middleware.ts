import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Ensure HTTPS in production
  if (process.env.NODE_ENV === 'production' && !request.url.startsWith('https')) {
    return NextResponse.redirect(`https://${request.url}`)
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/:path*',
}

