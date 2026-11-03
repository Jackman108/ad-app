'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/shared/lib/prisma';

export async function toggleFavorite(userId: string, listingId: string): Promise<{ favorited: boolean }> {
  const listing = await prisma.listing.findFirst({
    where: { id: listingId, status: 'PUBLISHED', deletedAt: null },
    select: { id: true, slug: true },
  });
  if (!listing) throw new Error('Объявление недоступно');

  const existing = await prisma.favorite.findUnique({
    where: { userId_listingId: { userId, listingId } },
  });

  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } });
    revalidatePath('/');
    revalidatePath('/favorites');
    revalidatePath(`/listings/${listing.slug}`);
    return { favorited: false };
  }

  await prisma.favorite.create({ data: { userId, listingId } });
  revalidatePath('/');
  revalidatePath('/favorites');
  revalidatePath(`/listings/${listing.slug}`);
  return { favorited: true };
}
