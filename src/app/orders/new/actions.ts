'use server';

import { headers } from 'next/headers';
import { createAndSubmitWorkOrder } from '@/features/create-work-order/model/create-work-order';
import { auth } from '@/shared/lib/auth';
import { assertRateLimit, clientKeyFromHeaders } from '@/shared/lib/rate-limit';

export async function submitNewWorkOrder(formData: FormData) {
  const h = await headers();
  const session = await auth.api.getSession({ headers: h });
  if (!session?.user) {
    return { ok: false as const, error: 'Нужно войти' };
  }

  try {
    assertRateLimit(await clientKeyFromHeaders(h, `order:${session.user.id}`), 15, 60_000);
    const image = formData.get('image');
    const imageFile = image instanceof File ? image : null;
    const order = await createAndSubmitWorkOrder(
      session.user.id,
      {
        organizationId: String(formData.get('organizationId') ?? ''),
        siteId: String(formData.get('siteId') ?? ''),
        categoryId: String(formData.get('categoryId') ?? ''),
        title: String(formData.get('title') ?? ''),
        description: String(formData.get('description') ?? ''),
      },
      imageFile,
    );
    return { ok: true as const, id: order.id };
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Ошибка сохранения';
    return { ok: false as const, error: message };
  }
}
