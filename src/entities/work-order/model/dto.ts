import type {
  Locality,
  Organization,
  Site,
  WorkCategory,
  WorkOrder,
  WorkOrderImage,
  User,
} from '@prisma/client';

export type WorkOrderWithRelations = WorkOrder & {
  organization: Pick<Organization, 'id' | 'name'>;
  site: Site & { locality: Pick<Locality, 'id' | 'name'> };
  category: Pick<WorkCategory, 'id' | 'name' | 'slug' | 'basePriceMinor'>;
  createdBy: Pick<User, 'id' | 'name'>;
  master: Pick<User, 'id' | 'name'> | null;
  images: WorkOrderImage[];
};

export type WorkOrderOrgDto = {
  id: string;
  title: string;
  description: string;
  status: string;
  priceMinor: number | null;
  platformFeeBps: number | null;
  currency: string;
  organization: { id: string; name: string };
  site: { id: string; name: string; addressLine: string; localityName: string };
  category: { id: string; name: string; slug: string; basePriceMinor: number | null };
  createdByName: string;
  masterName: string | null;
  beforeKeys: string[];
  afterKeys: string[];
  createdAt: string;
  closedAt: string | null;
};

/** Org / dispatcher view — no phone numbers. */
export function toWorkOrderOrgDto(row: WorkOrderWithRelations): WorkOrderOrgDto {
  const before = row.images
    .filter((i) => i.kind === 'BEFORE')
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((i) => i.storageKey);
  const after = row.images
    .filter((i) => i.kind === 'AFTER')
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((i) => i.storageKey);

  return {
    id: row.id,
    title: row.title,
    description: row.description,
    status: row.status,
    priceMinor: row.priceMinor,
    platformFeeBps: row.platformFeeBps,
    currency: row.currency,
    organization: { id: row.organization.id, name: row.organization.name },
    site: {
      id: row.site.id,
      name: row.site.name,
      addressLine: row.site.addressLine,
      localityName: row.site.locality.name,
    },
    category: {
      id: row.category.id,
      name: row.category.name,
      slug: row.category.slug,
      basePriceMinor: row.category.basePriceMinor,
    },
    createdByName: row.createdBy.name,
    masterName: row.master?.name ?? null,
    beforeKeys: before,
    afterKeys: after,
    createdAt: row.createdAt.toISOString(),
    closedAt: row.closedAt?.toISOString() ?? null,
  };
}
