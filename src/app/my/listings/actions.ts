'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import type { ListingStatus } from '@/entities/listing/model/status';
import { transitionOwnListing } from '@/features/manage-listing/model/transition-listing';
import { auth } from '@/shared/lib/auth';

export async function changeListingStatus(listingId: string, formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect('/login');

  const to = String(formData.get('to') ?? '') as ListingStatus;
  await transitionOwnListing(session.user.id, listingId, to);
  redirect('/my/listings');
}
