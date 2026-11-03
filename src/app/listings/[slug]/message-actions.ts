'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { startOrGetConversation, sendMessage } from '@/features/contact-seller/model/messaging';
import { auth } from '@/shared/lib/auth';
import { assertRateLimit, clientKeyFromHeaders } from '@/shared/lib/rate-limit';

export async function writeToSeller(listingId: string, formData: FormData) {
  const h = await headers();
  const session = await auth.api.getSession({ headers: h });
  if (!session?.user) redirect('/login');

  assertRateLimit(await clientKeyFromHeaders(h, `msg:${session.user.id}`), 30, 60_000);

  const body = String(formData.get('body') ?? '');
  const conversation = await startOrGetConversation(listingId, session.user.id);
  await sendMessage(conversation.id, session.user.id, { body });
  redirect(`/inbox/${conversation.id}`);
}
