'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { canTransitionListing } from '@/entities/listing/model/status';
import { prisma } from '@/shared/lib/prisma';
import { saveListingImage } from '@/shared/lib/storage';
import { slugifyTitle } from './slug';

const createSchema = z.object({
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

export async function createAndPublishListing(
  sellerId: string,
  input: unknown,
  imageFile?: File | null,
) {
  const data = createSchema.parse(input);
  const category = await prisma.category.findFirst({
    where: { id: data.categoryId, isActive: true, allowsListing: true },
  });
  if (!category) throw new Error('Категория недоступна');
  const locality = await prisma.locality.findFirst({
    where: { id: data.localityId, isActive: true },
  });
  if (!locality) throw new Error('Населённый пункт недоступен');

  if (!canTransitionListing('DRAFT', 'PUBLISHED')) {
    throw new Error('Недопустимый переход статуса');
  }

  let imageKey: string | null = null;
  if (imageFile && imageFile.size > 0) {
    imageKey = (await saveListingImage(imageFile)).storageKey;
  }

  const listing = await prisma.listing.create({
    data: {
      sellerId,
      categoryId: data.categoryId,
      localityId: data.localityId,
      title: data.title,
      slug: slugifyTitle(data.title),
      description: data.description,
      priceMinor: parsePriceMinor(data.priceByn),
      currency: 'BYN',
      condition: data.condition,
      status: 'PUBLISHED',
      publishedAt: new Date(),
      images: imageKey
        ? { create: [{ storageKey: imageKey, sortOrder: 0 }] }
        : undefined,
    },
  });

  revalidatePath('/');
  revalidatePath('/my/listings');
  revalidatePath(`/listings/${listing.slug}`);
  return listing;
}
