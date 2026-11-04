'use server';

import { headers } from 'next/headers';
import {
  confirmWorkOrder,
  requestWorkOrderRework,
} from '@/features/confirm-work-order/model/confirm-work-order';
import { auth } from '@/shared/lib/auth';
import { assertRateLimit, clientKeyFromHeaders } from '@/shared/lib/rate-limit';

export async function submitConfirm(formData: FormData) {
  const h = await headers();
  const session = await auth.api.getSession({ headers: h });
  if (!session?.user) return { ok: false as const, error: 'Нужно войти' };
  try {
    assertRateLimit(await clientKeyFromHeaders(h, `confirm:${session.user.id}`), 20, 60_000);
    await confirmWorkOrder(session.user.id, String(formData.get('workOrderId') ?? ''));
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: e instanceof Error ? e.message : 'Ошибка' };
  }
}

export async function submitRework(formData: FormData) {
  const h = await headers();
  const session = await auth.api.getSession({ headers: h });
  if (!session?.user) return { ok: false as const, error: 'Нужно войти' };
  try {
    assertRateLimit(await clientKeyFromHeaders(h, `confirm:${session.user.id}`), 20, 60_000);
    await requestWorkOrderRework(session.user.id, String(formData.get('workOrderId') ?? ''));
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: e instanceof Error ? e.message : 'Ошибка' };
  }
}
