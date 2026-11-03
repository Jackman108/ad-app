'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import type { ListingStatus } from '@/entities/listing/model/status';
import { transitionOwnListing } from '@/features/manage-listing/model/transition-listing';
import { auth } from '@/shared/lib/auth';
import { assertRateLimit, clientKeyFromHeaders } from '@/shared/lib/rate-limit';

export async function changeListingStatus(listingId: string, formData: FormData) {
  const h = await headers();
  const session = await auth.api.getSession({ headers: h });
  if (!session?.user) redirect('/login');

  assertRateLimit(await clientKeyFromHeaders(h, `status:${session.user.id}`), 40, 60_000);

  const to = String(formData.get('to') ?? '') as ListingStatus;
  await transitionOwnListing(session.user.id, listingId, to);
  redirect('/my/listings');
}
