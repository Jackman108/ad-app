'use server';

import { revalidatePath } from 'next/cache';
import { canTransitionListing, type ListingStatus } from '@/entities/listing/model/status';
import { prisma } from '@/shared/lib/prisma';

const actionable = new Set<ListingStatus>([
  'PUBLISHED',
  'RESERVED',
  'SOLD',
  'ARCHIVED',
  'HIDDEN',
]);

export async function transitionOwnListing(
  sellerId: string,
  listingId: string,
  to: ListingStatus,
) {
  if (!actionable.has(to) && to !== 'DRAFT') {
    throw new Error('Недопустимый статус');
  }

  const listing = await prisma.listing.findFirst({
    where: { id: listingId, sellerId, deletedAt: null },
  });
  if (!listing) throw new Error('Объявление не найдено');

  const from = listing.status as ListingStatus;
  if (!canTransitionListing(from, to)) {
    throw new Error(`Нельзя перевести ${from} → ${to}`);
  }

  const updated = await prisma.listing.update({
    where: { id: listing.id },
    data: {
      status: to,
      publishedAt: to === 'PUBLISHED' && !listing.publishedAt ? new Date() : listing.publishedAt,
    },
  });

  revalidatePath('/');
  revalidatePath('/my/listings');
  revalidatePath(`/listings/${updated.slug}`);
  return updated;
}
