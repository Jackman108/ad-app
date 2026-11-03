'use server';

import { z } from 'zod';
import { prisma } from '@/shared/lib/prisma';

const schema = z.object({
  listingId: z.string().min(1),
  reason: z.enum(['SPAM', 'FRAUD', 'PROHIBITED', 'OTHER']),
  comment: z.string().trim().max(1000).optional(),
});

export async function submitListingReport(reporterId: string, input: unknown) {
  const data = schema.parse(input);
  const listing = await prisma.listing.findFirst({
    where: { id: data.listingId, deletedAt: null },
    select: { id: true, sellerId: true },
  });
  if (!listing) throw new Error('Объявление не найдено');
  if (listing.sellerId === reporterId) throw new Error('Нельзя жаловаться на своё');

  return prisma.report.create({
    data: {
      reporterId,
      listingId: listing.id,
      reportedUserId: listing.sellerId,
      reason: data.reason,
      comment: data.comment || null,
    },
  });
}
