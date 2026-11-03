/** Listing FSM — transitions only via use-cases (ADR 0003). */
export const listingStatuses = [
  'DRAFT',
  'PUBLISHED',
  'RESERVED',
  'SOLD',
  'ARCHIVED',
  'HIDDEN',
] as const;

export type ListingStatus = (typeof listingStatuses)[number];

const allowed: Record<ListingStatus, ListingStatus[]> = {
  DRAFT: ['PUBLISHED', 'ARCHIVED'],
  PUBLISHED: ['RESERVED', 'SOLD', 'ARCHIVED', 'HIDDEN'],
  RESERVED: ['PUBLISHED', 'SOLD', 'ARCHIVED'],
  SOLD: ['ARCHIVED'],
  ARCHIVED: [],
  HIDDEN: ['PUBLISHED', 'ARCHIVED'],
};

export function canTransitionListing(from: ListingStatus, to: ListingStatus): boolean {
  return allowed[from].includes(to);
}
