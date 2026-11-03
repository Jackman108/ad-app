'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { toggleFavorite } from '@/features/favorites/model/toggle-favorite';
import { auth } from '@/shared/lib/auth';
import { assertRateLimit, clientKeyFromHeaders } from '@/shared/lib/rate-limit';

export async function toggleFavoriteAction(listingId: string, slug: string) {
  const h = await headers();
  const session = await auth.api.getSession({ headers: h });
  if (!session?.user) redirect('/login');

  assertRateLimit(await clientKeyFromHeaders(h, `fav:${session.user.id}`), 40, 60_000);
  await toggleFavorite(session.user.id, listingId);
  redirect(`/listings/${slug}`);
}
