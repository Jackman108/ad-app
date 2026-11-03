'use server';

import { headers } from 'next/headers';
import { createAndPublishListing } from '@/features/create-listing/model/create-listing';
import { auth } from '@/shared/lib/auth';
import { assertRateLimit, clientKeyFromHeaders } from '@/shared/lib/rate-limit';

export async function submitNewListing(formData: FormData) {
  const h = await headers();
  const session = await auth.api.getSession({ headers: h });
  if (!session?.user) {
    return { ok: false as const, error: 'Нужно войти' };
  }

  try {
    assertRateLimit(await clientKeyFromHeaders(h, `listing:${session.user.id}`), 10, 60_000);
    const image = formData.get('image');
    const imageFile = image instanceof File ? image : null;
    const listing = await createAndPublishListing(
      session.user.id,
      {
        title: String(formData.get('title') ?? ''),
        description: String(formData.get('description') ?? ''),
        priceByn: String(formData.get('priceByn') ?? ''),
        categoryId: String(formData.get('categoryId') ?? ''),
        localityId: String(formData.get('localityId') ?? ''),
        condition: String(formData.get('condition') ?? 'USED'),
      },
      imageFile,
    );
    return { ok: true as const, slug: listing.slug };
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Ошибка сохранения';
    return { ok: false as const, error: message };
  }
}
