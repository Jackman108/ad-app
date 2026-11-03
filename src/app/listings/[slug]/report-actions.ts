'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { submitListingReport } from '@/features/report-listing/model/submit-report';
import { auth } from '@/shared/lib/auth';

export async function reportListingAction(listingId: string, formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect('/login');

  await submitListingReport(session.user.id, {
    listingId,
    reason: String(formData.get('reason') ?? 'OTHER'),
    comment: String(formData.get('comment') ?? ''),
  });
  redirect(`/listings/${String(formData.get('slug') ?? '')}?reported=1`);
}
