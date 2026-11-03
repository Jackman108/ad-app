'use server';

import { headers } from 'next/headers';
import { updateOwnListing } from '@/features/manage-listing/model/update-listing';
import { auth } from '@/shared/lib/auth';
import { assertRateLimit, clientKeyFromHeaders } from '@/shared/lib/rate-limit';

export async function submitListingEdit(listingId: string, formData: FormData) {
  const h = await headers();
  const session = await auth.api.getSession({ headers: h });
  if (!session?.user) {
    return { ok: false as const, error: 'Нужно войти' };
  }

  try {
    assertRateLimit(await clientKeyFromHeaders(h, `edit:${session.user.id}`), 20, 60_000);
    const updated = await updateOwnListing(session.user.id, listingId, {
      title: String(formData.get('title') ?? ''),
      description: String(formData.get('description') ?? ''),
      priceByn: String(formData.get('priceByn') ?? ''),
      categoryId: String(formData.get('categoryId') ?? ''),
      localityId: String(formData.get('localityId') ?? ''),
      condition: String(formData.get('condition') ?? 'USED'),
    });
    return { ok: true as const, slug: updated.slug };
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Ошибка сохранения';
    return { ok: false as const, error: message };
  }
}
