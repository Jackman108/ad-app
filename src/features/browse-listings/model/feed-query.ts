import type { Prisma } from '@prisma/client';
import { collectCategoryIds, type CategoryRow } from '@/entities/category/model/tree';

export type FeedSearchInput = {
  q?: string;
  categoryId?: string;
  regionId?: string;
  localityId?: string;
  priceMin?: string;
  priceMax?: string;
};

function parsePriceMinor(raw: string | undefined): number | undefined {
  if (!raw?.trim()) return undefined;
  const value = Math.round(Number(raw.replace(',', '.').replace(/\s/g, '')) * 100);
  return Number.isFinite(value) ? value : undefined;
}

/** Where для ленты: parent-категория включает детей; region сужает locality. */
export function buildFeedWhere(
  sp: FeedSearchInput,
  categories: CategoryRow[],
): Prisma.ListingWhereInput {
  const priceMin = parsePriceMinor(sp.priceMin);
  const priceMax = parsePriceMinor(sp.priceMax);
  const categoryIds = sp.categoryId ? collectCategoryIds(categories, sp.categoryId) : null;

  return {
    status: 'PUBLISHED',
    deletedAt: null,
    ...(categoryIds ? { categoryId: { in: categoryIds } } : {}),
    ...(sp.localityId
      ? { localityId: sp.localityId }
      : sp.regionId
        ? { locality: { regionId: sp.regionId } }
        : {}),
    ...(sp.q
      ? {
          OR: [
            { title: { contains: sp.q, mode: 'insensitive' as const } },
            { description: { contains: sp.q, mode: 'insensitive' as const } },
          ],
        }
      : {}),
    ...((priceMin != null && Number.isFinite(priceMin)) || (priceMax != null && Number.isFinite(priceMax))
      ? {
          priceMinor: {
            ...(priceMin != null ? { gte: priceMin } : {}),
            ...(priceMax != null ? { lte: priceMax } : {}),
          },
        }
      : {}),
  };
}
