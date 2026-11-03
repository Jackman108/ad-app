type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

/** In-memory sliding window. OK for single-node MVP (VPS). */
export function takeRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): { ok: true } | { ok: false; retryAfterSec: number } {
  const now = Date.now();
  const cur = buckets.get(key);
  if (!cur || now >= cur.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true };
  }
  if (cur.count >= limit) {
    return { ok: false, retryAfterSec: Math.max(1, Math.ceil((cur.resetAt - now) / 1000)) };
  }
  cur.count += 1;
  return { ok: true };
}

export function assertRateLimit(key: string, limit: number, windowMs: number): void {
  const result = takeRateLimit(key, limit, windowMs);
  if (!result.ok) {
    throw new Error(`Слишком много запросов. Подождите ~${result.retryAfterSec} с`);
  }
}

export async function clientKeyFromHeaders(h: Headers, prefix: string): Promise<string> {
  const fwd = h.get('x-forwarded-for')?.split(',')[0]?.trim();
  const ip = fwd || h.get('x-real-ip') || 'local';
  return `${prefix}:${ip}`;
}
