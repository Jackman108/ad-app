'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { prisma } from '@/shared/lib/prisma';

const messageSchema = z.object({
  body: z.string().trim().min(1).max(4000),
});

export async function startOrGetConversation(listingId: string, buyerId: string) {
  const listing = await prisma.listing.findFirst({
    where: { id: listingId, status: 'PUBLISHED', deletedAt: null },
  });
  if (!listing) throw new Error('Объявление не найдено');
  if (listing.sellerId === buyerId) throw new Error('Нельзя писать самому себе');

  const existing = await prisma.conversation.findUnique({
    where: { listingId_buyerId: { listingId, buyerId } },
  });
  if (existing) return existing;

  return prisma.conversation.create({
    data: {
      listingId,
      buyerId,
      sellerId: listing.sellerId,
    },
  });
}

export async function sendMessage(conversationId: string, senderId: string, raw: unknown) {
  const { body } = messageSchema.parse(raw);
  const conversation = await prisma.conversation.findUnique({ where: { id: conversationId } });
  if (!conversation) throw new Error('Диалог не найден');
  if (senderId !== conversation.buyerId && senderId !== conversation.sellerId) {
    throw new Error('Нет доступа');
  }

  const message = await prisma.message.create({
    data: { conversationId, senderId, body },
  });
  await prisma.conversation.update({
    where: { id: conversationId },
    data: { lastMessageAt: new Date() },
  });

  revalidatePath('/inbox');
  revalidatePath(`/inbox/${conversationId}`);
  return message;
}
