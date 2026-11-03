'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { sendMessage } from '@/features/contact-seller/model/messaging';
import { auth } from '@/shared/lib/auth';

export async function replyAction(conversationId: string, formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect('/login');
  await sendMessage(conversationId, session.user.id, {
    body: String(formData.get('body') ?? ''),
  });
  redirect(`/inbox/${conversationId}`);
}
