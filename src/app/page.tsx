import Link from 'next/link';
import { headers } from 'next/headers';
import { formatPriceByn, toListingPublic } from '@/entities/listing/model/dto';
import {
  FEED_PAGE_SIZE,
  buildFeedOrderBy,
  buildFeedWhere,
  parseFeedPage,
  rankListingsByQuery,
} from '@/features/browse-listings/model/feed-query';
import { FeedFilters } from '@/features/browse-listings/ui/FeedFilters';
import { countUnreadForUser } from '@/features/contact-seller/model/unread';
import { auth } from '@/shared/lib/auth';
import { prisma } from '@/shared/lib/prisma';
import { AppHeader } from '@/shared/ui/AppHeader';
import styles from './page.module.css';

export const dynamic = 'force-dynamic';

type Search = {
  categoryId?: string;
  regionId?: string;
  localityId?: string;
  priceMin?: string;
  priceMax?: string;
  q?: string;
  condition?: string;
  hasPhoto?: string;
  sort?: string;
  page?: string;
};

function buildPageHref(sp: Search, page: number): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(sp)) {
    if (key === 'page') continue;
    if (value) params.set(key, value);
  }
  if (page > 1) params.set('page', String(page));
  const qs = params.toString();
  return qs ? `/?${qs}` : '/';
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  const sp = await searchParams;
  const page = parseFeedPage(sp.page);
  const skip = (page - 1) * FEED_PAGE_SIZE;

  const [categories, regions, localities, unreadCount] = await Promise.all([
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      select: {
        id: true,
        name: true,
        slug: true,
        parentId: true,
        allowsListing: true,
        sortOrder: true,
      },
    }),
    prisma.region.findMany({
      orderBy: { code: 'asc' },
      select: { id: true, name: true },
    }),
    prisma.locality.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      select: { id: true, name: true, regionId: true },
    }),
    session?.user ? countUnreadForUser(session.user.id) : Promise.resolve(0),
  ]);

  const where = buildFeedWhere(sp, categories);
  const orderBy = buildFeedOrderBy(sp);

  const [totalCount, rows] = await Promise.all([
    prisma.listing.count({ where }),
    prisma.listing.findMany({
      where,
      orderBy,
      skip,
      take: FEED_PAGE_SIZE,
      include: {
        category: true,
        locality: { include: { region: true } },
        seller: true,
        images: true,
      },
    }),
  ]);

  const ranked = rankListingsByQuery(rows, sp.q, sp.sort);
  const listings = ranked.map(toListingPublic);
  const totalPages = Math.max(1, Math.ceil(totalCount / FEED_PAGE_SIZE));

  return (
    <main className={styles.main}>
      <AppHeader userName={session?.user?.name} unreadCount={unreadCount} />

      <h1 className={styles.title}>Объявления</h1>
      <p className={styles.lead}>Частные лица · Беларусь</p>

      <FeedFilters
        categories={categories}
        regions={regions}
        localities={localities}
        defaults={sp}
        totalCount={totalCount}
      />

      {listings.length === 0 ? (
        <p className={styles.meta}>
          Ничего не найдено.{' '}
          {session?.user ? (
            <Link href="/listings/new">Опубликуйте</Link>
          ) : (
            <Link href="/register">Зарегистрируйтесь</Link>
          )}
          .
        </p>
      ) : (
        <ul className={styles.list}>
          {listings.map((item) => (
            <li key={item.id} className={styles.card}>
              <Link href={`/listings/${item.slug}`} className={styles.cardLink}>
                {item.coverKey ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img className={styles.thumb} src={`/api/uploads/${item.coverKey}`} alt="" />
                ) : (
                  <span className={styles.thumbEmpty} />
                )}
                <span className={styles.cardBody}>
                  <span className={styles.cardTitle}>{item.title}</span>
                  <span className={styles.cardPrice}>{formatPriceByn(item.priceMinor)}</span>
                  <span className={styles.cardMeta}>
                    {item.locality.name} · {item.category.name}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {totalPages > 1 ? (
        <nav className={styles.pager} aria-label="Страницы">
          {page > 1 ? (
            <Link className={styles.pagerLink} href={buildPageHref(sp, page - 1)}>
              ← Назад
            </Link>
          ) : (
            <span className={styles.pagerMuted}>← Назад</span>
          )}
          <span className={styles.pagerMeta}>
            {page} / {totalPages}
          </span>
          {page < totalPages ? (
            <Link className={styles.pagerLink} href={buildPageHref(sp, page + 1)}>
              Вперёд →
            </Link>
          ) : (
            <span className={styles.pagerMuted}>Вперёд →</span>
          )}
        </nav>
      ) : null}
    </main>
  );
}
