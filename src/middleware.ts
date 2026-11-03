import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

function limited(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const cur = buckets.get(key);
  if (!cur || now >= cur.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }
  if (cur.count >= limit) return true;
  cur.count += 1;
  return false;
}

/** Protect auth API from brute-force on a single node. */
export function middleware(req: NextRequest) {
  if (req.method !== 'POST') return NextResponse.next();

  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'local';

  if (limited(`auth:${ip}`, 30, 60_000)) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429, headers: { 'Retry-After': '60' } },
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/auth/:path*'],
};
