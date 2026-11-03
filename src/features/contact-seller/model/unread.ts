'use server';

import { prisma } from '@/shared/lib/prisma';

/** Непрочитанные входящие для участника сделки (не свои исходящие). */
export async function countUnreadForUser(userId: string): Promise<number> {
  return prisma.message.count({
    where: {
      readAt: null,
      senderId: { not: userId },
      conversation: {
        OR: [{ buyerId: userId }, { sellerId: userId }],
      },
    },
  });
}

/** Карта conversationId → число непрочитанных (для списка inbox). */
export async function unreadCountsByConversation(
  userId: string,
  conversationIds: string[],
): Promise<Map<string, number>> {
  const map = new Map<string, number>();
  if (conversationIds.length === 0) return map;

  const rows = await prisma.message.groupBy({
    by: ['conversationId'],
    where: {
      conversationId: { in: conversationIds },
      readAt: null,
      senderId: { not: userId },
    },
    _count: { _all: true },
  });

  for (const row of rows) {
    map.set(row.conversationId, row._count._all);
  }
  return map;
}

export async function markConversationRead(conversationId: string, readerId: string) {
  await prisma.message.updateMany({
    where: {
      conversationId,
      senderId: { not: readerId },
      readAt: null,
    },
    data: { readAt: new Date() },
  });
}
