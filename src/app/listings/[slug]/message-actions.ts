'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { startOrGetConversation, sendMessage } from '@/features/contact-seller/model/messaging';
import { auth } from '@/shared/lib/auth';

export async function writeToSeller(listingId: string, formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect('/login');

  const body = String(formData.get('body') ?? '');
  const conversation = await startOrGetConversation(listingId, session.user.id);
  await sendMessage(conversation.id, session.user.id, { body });
  redirect(`/inbox/${conversation.id}`);
}
