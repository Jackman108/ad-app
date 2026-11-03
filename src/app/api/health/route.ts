import { NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ ok: true, service: 'ad-app' });
  } catch {
    return NextResponse.json({ ok: false, service: 'ad-app' }, { status: 503 });
  }
}
