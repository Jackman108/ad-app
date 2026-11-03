import Link from 'next/link';
import { headers } from 'next/headers';
import { formatPriceByn, toListingPublic } from '@/entities/listing/model/dto';
import { SignOutButton } from '@/features/auth-ui/ui/SignOutButton';
import { auth } from '@/shared/lib/auth';
import { prisma } from '@/shared/lib/prisma';
import styles from './page.module.css';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const session = await auth.api.getSession({ headers: await headers() });

  const rows = await prisma.listing.findMany({
    where: { status: 'PUBLISHED', deletedAt: null },
    orderBy: { publishedAt: 'desc' },
    take: 30,
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
      <header className={styles.header}>
        <p className={styles.brand}>Ad App</p>
        <nav className={styles.nav}>
          {session?.user ? (
            <>
              <Link href="/listings/new">Подать</Link>
              <span className={styles.user}>{session.user.name}</span>
              <SignOutButton />
            </>
          ) : (
            <>
              <Link href="/login">Войти</Link>
              <Link href="/register">Регистрация</Link>
            </>
          )}
        </nav>
      </header>

      <h1 className={styles.title}>Объявления</h1>
      <p className={styles.lead}>Частные лица · Беларусь</p>

      {listings.length === 0 ? (
        <p className={styles.meta}>Пока пусто. {session?.user ? <Link href="/listings/new">Опубликуйте первое</Link> : <Link href="/register">Зарегистрируйтесь</Link>}.</p>
      ) : (
        <ul className={styles.list}>
          {listings.map((item) => (
            <li key={item.id} className={styles.card}>
              <Link href={`/listings/${item.slug}`} className={styles.cardLink}>
                <span className={styles.cardTitle}>{item.title}</span>
                <span className={styles.cardPrice}>{formatPriceByn(item.priceMinor)}</span>
                <span className={styles.cardMeta}>
                  {item.locality.name} · {item.category.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
