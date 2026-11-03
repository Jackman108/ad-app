'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { submitListingReport } from '@/features/report-listing/model/submit-report';
import { auth } from '@/shared/lib/auth';
import { assertRateLimit, clientKeyFromHeaders } from '@/shared/lib/rate-limit';

export async function reportListingAction(listingId: string, formData: FormData) {
  const h = await headers();
  const session = await auth.api.getSession({ headers: h });
  if (!session?.user) redirect('/login');

  assertRateLimit(await clientKeyFromHeaders(h, `report:${session.user.id}`), 5, 60_000);

  await submitListingReport(session.user.id, {
    listingId,
    reason: String(formData.get('reason') ?? 'OTHER'),
    comment: String(formData.get('comment') ?? ''),
  });
  redirect(`/listings/${String(formData.get('slug') ?? '')}?reported=1`);
}
