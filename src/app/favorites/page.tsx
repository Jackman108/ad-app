import Link from 'next/link';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { formatPriceByn, toListingPublic } from '@/entities/listing/model/dto';
import { countUnreadForUser } from '@/features/contact-seller/model/unread';
import { auth } from '@/shared/lib/auth';
import { prisma } from '@/shared/lib/prisma';
import { AppHeader } from '@/shared/ui/AppHeader';
import styles from '../page.module.css';

export const dynamic = 'force-dynamic';

export default async function FavoritesPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect('/login');

  const unreadCount = await countUnreadForUser(session.user.id);
  const rows = await prisma.favorite.findMany({
    where: { userId: session.user.id, listing: { status: 'PUBLISHED', deletedAt: null } },
    orderBy: { createdAt: 'desc' },
    take: 50,
    include: {
      listing: {
        include: {
          category: true,
          locality: { include: { region: true } },
          seller: true,
          images: true,
        },
      },
    },
  });

  const listings = rows.map((r) => toListingPublic(r.listing));

  return (
    <main className={styles.main}>
      <AppHeader userName={session.user.name} unreadCount={unreadCount} />
      <h1 className={styles.title}>Избранное</h1>
      {listings.length === 0 ? (
        <p className={styles.lead}>Пока пусто — отметь объявления на карточке.</p>
      ) : (
        <ul className={styles.list}>
          {listings.map((item) => (
            <li key={item.id} className={styles.card}>
              <Link href={`/listings/${item.slug}`} className={styles.cardLink}>
                {item.coverKey ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img className={styles.thumb} src={`/api/uploads/${item.coverKey}`} alt="" />
                ) : (
                  <div className={styles.thumbEmpty} />
                )}
                <span className={styles.cardBody}>
                  <span className={styles.cardTitle}>{item.title}</span>
                  <span className={styles.cardPrice}>{formatPriceByn(item.priceMinor)}</span>
                  <span className={styles.cardMeta}>{item.locality.name}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
