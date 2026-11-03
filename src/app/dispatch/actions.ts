'use server';

import { headers } from 'next/headers';
import { estimateWorkOrder } from '@/features/dispatch-work-order/model/estimate-work-order';
import { offerWorkOrderToMaster } from '@/features/dispatch-work-order/model/offer-work-order';
import { auth } from '@/shared/lib/auth';
import { assertRateLimit, clientKeyFromHeaders } from '@/shared/lib/rate-limit';

export async function submitEstimate(formData: FormData) {
  const h = await headers();
  const session = await auth.api.getSession({ headers: h });
  if (!session?.user) return { ok: false as const, error: 'Нужно войти' };
  try {
    assertRateLimit(await clientKeyFromHeaders(h, `dispatch:${session.user.id}`), 30, 60_000);
    await estimateWorkOrder(session.user.id, {
      workOrderId: String(formData.get('workOrderId') ?? ''),
      priceByn: String(formData.get('priceByn') ?? ''),
    });
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: e instanceof Error ? e.message : 'Ошибка' };
  }
}

export async function submitOffer(formData: FormData) {
  const h = await headers();
  const session = await auth.api.getSession({ headers: h });
  if (!session?.user) return { ok: false as const, error: 'Нужно войти' };
  try {
    assertRateLimit(await clientKeyFromHeaders(h, `dispatch:${session.user.id}`), 30, 60_000);
    await offerWorkOrderToMaster(session.user.id, {
      workOrderId: String(formData.get('workOrderId') ?? ''),
      masterUserId: String(formData.get('masterUserId') ?? ''),
    });
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: e instanceof Error ? e.message : 'Ошибка' };
  }
}
