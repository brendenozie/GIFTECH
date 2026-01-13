import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  // allow EVERYTHING
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
