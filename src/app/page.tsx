import Link from 'next/link';
import { headers } from 'next/headers';
import { Prisma } from '@prisma/client';
import { formatPriceByn, toListingPublic } from '@/entities/listing/model/dto';
import { SignOutButton } from '@/features/auth-ui/ui/SignOutButton';
import { auth } from '@/shared/lib/auth';
import { prisma } from '@/shared/lib/prisma';
import styles from './page.module.css';

export const dynamic = 'force-dynamic';

type Search = { categoryId?: string; localityId?: string; priceMin?: string; priceMax?: string; q?: string };

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  const sp = await searchParams;

  const priceMin = sp.priceMin ? Math.round(Number(sp.priceMin.replace(',', '.')) * 100) : undefined;
  const priceMax = sp.priceMax ? Math.round(Number(sp.priceMax.replace(',', '.')) * 100) : undefined;

  const where: Prisma.ListingWhereInput = {
    status: 'PUBLISHED',
    deletedAt: null,
    ...(sp.categoryId ? { categoryId: sp.categoryId } : {}),
    ...(sp.localityId ? { localityId: sp.localityId } : {}),
    ...(sp.q
      ? {
          OR: [
            { title: { contains: sp.q, mode: 'insensitive' } },
            { description: { contains: sp.q, mode: 'insensitive' } },
          ],
        }
      : {}),
    ...((priceMin != null && Number.isFinite(priceMin)) || (priceMax != null && Number.isFinite(priceMax))
      ? {
          priceMinor: {
            ...(priceMin != null && Number.isFinite(priceMin) ? { gte: priceMin } : {}),
            ...(priceMax != null && Number.isFinite(priceMax) ? { lte: priceMax } : {}),
          },
        }
      : {}),
  };

  const [rows, categories, localities] = await Promise.all([
    prisma.listing.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
      take: 50,
      include: {
        category: true,
        locality: { include: { region: true } },
        seller: true,
        images: true,
      },
    }),
    prisma.category.findMany({
      where: { isActive: true, allowsListing: true },
      orderBy: { name: 'asc' },
      select: { id: true, name: true },
    }),
    prisma.locality.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
      select: { id: true, name: true, region: { select: { name: true } } },
    }),
  ]);
  const listings = rows.map(toListingPublic);

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <p className={styles.brand}>Объявки BY</p>
        <nav className={styles.nav}>
          {session?.user ? (
            <>
              <Link href="/listings/new">Подать</Link>
              <Link href="/my/listings">Мои</Link>
              <Link href="/favorites">Избранное</Link>
              <Link href="/inbox">Сообщения</Link>
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

      <form className={styles.filters} method="get">
        <input
          className={styles.filterInput}
          name="q"
          placeholder="Поиск"
          defaultValue={sp.q ?? ''}
        />
        <select className={styles.filterInput} name="categoryId" defaultValue={sp.categoryId ?? ''}>
          <option value="">Все категории</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <select className={styles.filterInput} name="localityId" defaultValue={sp.localityId ?? ''}>
          <option value="">Все города</option>
          {localities.map((l) => (
            <option key={l.id} value={l.id}>
              {l.region.name} — {l.name}
            </option>
          ))}
        </select>
        <input
          className={styles.filterInput}
          name="priceMin"
          placeholder="Цена от"
          defaultValue={sp.priceMin ?? ''}
          inputMode="decimal"
        />
        <input
          className={styles.filterInput}
          name="priceMax"
          placeholder="Цена до"
          defaultValue={sp.priceMax ?? ''}
          inputMode="decimal"
        />
        <button className={styles.filterBtn} type="submit">
          Найти
        </button>
      </form>

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
