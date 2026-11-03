import type { ListingCondition, Prisma } from '@prisma/client';
import { collectCategoryIds, type CategoryRow } from '@/entities/category/model/tree';

export const FEED_PAGE_SIZE = 24;

export type FeedSort = 'new' | 'priceAsc' | 'priceDesc';

export type FeedSearchInput = {
  q?: string;
  categoryId?: string;
  regionId?: string;
  localityId?: string;
  priceMin?: string;
  priceMax?: string;
  condition?: string;
  /** '1' | 'true' — только объявления с ListingImage */
  hasPhoto?: string;
  sort?: string;
  page?: string;
};

const CONDITIONS = new Set(['NEW', 'USED', 'FOR_PARTS', 'NOT_APPLICABLE']);

function parsePriceMinor(raw: string | undefined): number | undefined {
  if (!raw?.trim()) return undefined;
  const value = Math.round(Number(raw.replace(',', '.').replace(/\s/g, '')) * 100);
  return Number.isFinite(value) ? value : undefined;
}

export function parseFeedSort(raw: string | undefined): FeedSort {
  if (raw === 'priceAsc' || raw === 'priceDesc' || raw === 'new') return raw;
  return 'new';
}

export function parseFeedPage(raw: string | undefined): number {
  const n = Number(raw);
  if (!Number.isFinite(n) || n < 1) return 1;
  return Math.floor(n);
}

/** Where для ленты: parent-категория включает детей; region сужает locality. */
export function buildFeedWhere(
  sp: FeedSearchInput,
  categories: CategoryRow[],
): Prisma.ListingWhereInput {
  const priceMin = parsePriceMinor(sp.priceMin);
  const priceMax = parsePriceMinor(sp.priceMax);
  const categoryIds = sp.categoryId ? collectCategoryIds(categories, sp.categoryId) : null;
  const condition =
    sp.condition && CONDITIONS.has(sp.condition) ? (sp.condition as ListingCondition) : undefined;
  const hasPhoto = sp.hasPhoto === '1' || sp.hasPhoto === 'true';

  return {
    status: 'PUBLISHED',
    deletedAt: null,
    ...(categoryIds ? { categoryId: { in: categoryIds } } : {}),
    ...(sp.localityId
      ? { localityId: sp.localityId }
      : sp.regionId
        ? { locality: { regionId: sp.regionId } }
        : {}),
    ...(condition ? { condition } : {}),
    ...(hasPhoto ? { images: { some: {} } } : {}),
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

export function buildFeedOrderBy(sp: FeedSearchInput): Prisma.ListingOrderByWithRelationInput[] {
  const sort = parseFeedSort(sp.sort);
  if (sort === 'priceAsc') {
    return [{ priceMinor: 'asc' }, { publishedAt: 'desc' }];
  }
  if (sort === 'priceDesc') {
    return [{ priceMinor: 'desc' }, { publishedAt: 'desc' }];
  }
  return [{ publishedAt: 'desc' }];
}

/** Relevant при q + sort=new: title-match выше description (без search engine). */
export function rankListingsByQuery<T extends { title: string; description: string }>(
  rows: T[],
  q: string | undefined,
  sortRaw: string | undefined,
): T[] {
  const needle = q?.trim().toLowerCase();
  if (!needle || parseFeedSort(sortRaw) !== 'new') return rows;
  return [...rows].sort((a, b) => {
    const aTitle = a.title.toLowerCase().includes(needle) ? 0 : 1;
    const bTitle = b.title.toLowerCase().includes(needle) ? 0 : 1;
    if (aTitle !== bTitle) return aTitle - bTitle;
    const aDesc = a.description.toLowerCase().includes(needle) ? 0 : 1;
    const bDesc = b.description.toLowerCase().includes(needle) ? 0 : 1;
    return aDesc - bDesc;
  });
}
