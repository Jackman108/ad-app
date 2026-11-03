import { readFile } from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';
import { uploadAbsolutePath } from '@/shared/lib/storage';

export const dynamic = 'force-dynamic';

const MIME: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
};

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ path: string[] }> },
) {
  const parts = (await ctx.params).path ?? [];
  if (parts.length === 0 || parts.some((p) => p === '..' || p.includes('\\') || p.includes('\0'))) {
    return new NextResponse('Bad path', { status: 400 });
  }

  const key = parts.join('/');
  const abs = uploadAbsolutePath(key);
  const root = process.env.UPLOAD_DIR
    ? path.resolve(process.env.UPLOAD_DIR)
    : path.join(process.cwd(), 'uploads');
  const resolved = path.resolve(abs);
  if (!resolved.startsWith(root + path.sep) && resolved !== root) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  try {
    const buf = await readFile(resolved);
    const ext = path.extname(resolved).toLowerCase();
    return new NextResponse(buf, {
      headers: {
        'Content-Type': MIME[ext] ?? 'application/octet-stream',
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch {
    return new NextResponse('Not found', { status: 404 });
  }
}
