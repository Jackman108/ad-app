import type { Listing, ListingImage, Locality, Category, User } from '@prisma/client';

export type ListingPublic = {
  id: string;
  slug: string;
  title: string;
  description: string;
  priceMinor: number | null;
  currency: string;
  condition: string;
  status: string;
  publishedAt: Date | null;
  category: { id: string; name: string; slug: string };
  locality: { id: string; name: string; slug: string; regionName: string };
  coverKey: string | null;
  seller: { id: string; name: string };
};

export type ListingContact = ListingPublic & {
  sellerPhoneE164: string | null;
};

type ListingWithRelations = Listing & {
  category: Category;
  locality: Locality & { region: { name: string } };
  seller: User;
  images: ListingImage[];
};

export function toListingPublic(row: ListingWithRelations): ListingPublic {
  const cover = [...row.images].sort((a, b) => a.sortOrder - b.sortOrder)[0];
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    priceMinor: row.priceMinor,
    currency: row.currency,
    condition: row.condition,
    status: row.status,
    publishedAt: row.publishedAt,
    category: { id: row.category.id, name: row.category.name, slug: row.category.slug },
    locality: {
      id: row.locality.id,
      name: row.locality.name,
      slug: row.locality.slug,
      regionName: row.locality.region.name,
    },
    coverKey: cover?.storageKey ?? null,
    seller: { id: row.seller.id, name: row.seller.name },
  };
}

export function toListingContact(row: ListingWithRelations): ListingContact {
  return {
    ...toListingPublic(row),
    sellerPhoneE164: row.seller.phoneVerifiedAt ? row.seller.phoneE164 : null,
  };
}

export function formatPriceByn(priceMinor: number | null): string {
  if (priceMinor == null) return 'Договорная';
  return `${(priceMinor / 100).toLocaleString('ru-BY', { minimumFractionDigits: 0 })} BYN`;
}
