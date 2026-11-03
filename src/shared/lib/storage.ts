import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { randomBytes } from 'crypto';

const UPLOAD_ROOT = process.env.UPLOAD_DIR
  ? path.resolve(process.env.UPLOAD_DIR)
  : path.join(process.cwd(), 'uploads');

export async function saveListingImage(file: File): Promise<{ storageKey: string }> {
  const bytes = Buffer.from(await file.arrayBuffer());
  if (bytes.length > 5 * 1024 * 1024) {
    throw new Error('Файл больше 5 МБ');
  }
  const type = file.type;
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(type)) {
    throw new Error('Только JPEG/PNG/WebP');
  }
  const ext = type === 'image/png' ? 'png' : type === 'image/webp' ? 'webp' : 'jpg';
  const name = `${Date.now()}-${randomBytes(6).toString('hex')}.${ext}`;
  const dir = path.join(UPLOAD_ROOT, 'listings');
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, name), bytes);
  return { storageKey: `listings/${name}` };
}

export function uploadAbsolutePath(storageKey: string): string {
  return path.join(UPLOAD_ROOT, storageKey);
}
