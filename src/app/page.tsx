import Link from 'next/link';
import { headers } from 'next/headers';
import { formatPriceByn, toListingPublic } from '@/entities/listing/model/dto';
import { buildFeedWhere } from '@/features/browse-listings/model/feed-query';
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
};

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  const sp = await searchParams;

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
  const rows = await prisma.listing.findMany({
    where,
    orderBy: { publishedAt: 'desc' },
    take: 50,
    include: {
      category: true,
      locality: { include: { region: true } },
      seller: true,
      images: true,
    },
  });
  const listings = rows.map(toListingPublic);

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
      />

      {listings.length === 0 ? (
        <p className={styles.meta}>
          Ничего не найдено.{' '}
          {session?.user ? <Link href="/listings/new">Опубликуйте</Link> : <Link href="/register">Зарегистрируйтесь</Link>}.
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
    </main>
  );
}
