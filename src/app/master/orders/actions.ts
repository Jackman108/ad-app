'use server';

import { headers } from 'next/headers';
import { acceptWorkOrder, startWorkOrder } from '@/features/master-work-order/model/accept-work-order';
import { completeWorkOrderWithAfterPhotos } from '@/features/master-work-order/model/complete-work-order';
import { auth } from '@/shared/lib/auth';
import { assertRateLimit, clientKeyFromHeaders } from '@/shared/lib/rate-limit';

async function requireUser() {
  const h = await headers();
  const session = await auth.api.getSession({ headers: h });
  if (!session?.user) throw new Error('Нужно войти');
  assertRateLimit(await clientKeyFromHeaders(h, `master:${session.user.id}`), 40, 60_000);
  return session.user.id;
}

export async function submitAccept(formData: FormData) {
  try {
    const userId = await requireUser();
    await acceptWorkOrder(userId, String(formData.get('workOrderId') ?? ''));
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: e instanceof Error ? e.message : 'Ошибка' };
  }
}

export async function submitStart(formData: FormData) {
  try {
    const userId = await requireUser();
    await startWorkOrder(userId, String(formData.get('workOrderId') ?? ''));
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: e instanceof Error ? e.message : 'Ошибка' };
  }
}

export async function submitComplete(formData: FormData) {
  try {
    const userId = await requireUser();
    const workOrderId = String(formData.get('workOrderId') ?? '');
    const raw = formData.getAll('images');
    const files = raw.filter((x): x is File => x instanceof File);
    await completeWorkOrderWithAfterPhotos(userId, workOrderId, files);
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: e instanceof Error ? e.message : 'Ошибка' };
  }
}
