'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { prisma } from '@/shared/lib/prisma';

const updateSchema = z.object({
  title: z.string().trim().min(3).max(120),
  description: z.string().trim().min(10).max(8000),
  priceByn: z.string().optional(),
  categoryId: z.string().min(1),
  localityId: z.string().min(1),
  condition: z.enum(['NEW', 'USED', 'FOR_PARTS', 'NOT_APPLICABLE']),
});

function parsePriceMinor(raw: string | undefined): number | null {
  if (!raw || !raw.trim()) return null;
  const normalized = raw.replace(',', '.').replace(/\s/g, '');
  const value = Number(normalized);
  if (!Number.isFinite(value) || value < 0) throw new Error('Некорректная цена');
  return Math.round(value * 100);
}

export async function updateOwnListing(sellerId: string, listingId: string, input: unknown) {
  const data = updateSchema.parse(input);

  const listing = await prisma.listing.findFirst({
    where: { id: listingId, sellerId, deletedAt: null },
  });
  if (!listing) throw new Error('Объявление не найдено');
  if (listing.status === 'ARCHIVED' || listing.status === 'SOLD') {
    throw new Error('Это объявление нельзя редактировать');
  }

  const category = await prisma.category.findFirst({
    where: { id: data.categoryId, isActive: true, allowsListing: true },
  });
  if (!category) throw new Error('Категория недоступна');
  const locality = await prisma.locality.findFirst({
    where: { id: data.localityId, isActive: true },
  });
  if (!locality) throw new Error('Населённый пункт недоступен');

  const updated = await prisma.listing.update({
    where: { id: listing.id },
    data: {
      title: data.title,
      description: data.description,
      priceMinor: parsePriceMinor(data.priceByn),
      categoryId: data.categoryId,
      localityId: data.localityId,
      condition: data.condition,
    },
  });

  revalidatePath('/');
  revalidatePath('/my/listings');
  revalidatePath(`/listings/${updated.slug}`);
  revalidatePath(`/listings/${updated.slug}/edit`);
  return updated;
}
