import Link from 'next/link';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { formatPriceByn } from '@/entities/listing/model/dto';
import { canTransitionListing, type ListingStatus } from '@/entities/listing/model/status';
import { auth } from '@/shared/lib/auth';
import { prisma } from '@/shared/lib/prisma';
import { changeListingStatus } from './actions';
import styles from './page.module.css';

export const dynamic = 'force-dynamic';

const statusLabel: Record<string, string> = {
  DRAFT: 'Черновик',
  PUBLISHED: 'Опубликовано',
  RESERVED: 'Зарезервировано',
  SOLD: 'Продано',
  ARCHIVED: 'В архиве',
  HIDDEN: 'Скрыто',
};

const actionLabel: Partial<Record<ListingStatus, string>> = {
  PUBLISHED: 'Опубликовать',
  RESERVED: 'Резерв',
  SOLD: 'Продано',
  ARCHIVED: 'В архив',
  HIDDEN: 'Скрыть',
};

function nextActions(from: ListingStatus): ListingStatus[] {
  return (['PUBLISHED', 'RESERVED', 'SOLD', 'ARCHIVED', 'HIDDEN'] as ListingStatus[]).filter((to) =>
    canTransitionListing(from, to),
  );
}

export default async function MyListingsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect('/login');

  const rows = await prisma.listing.findMany({
    where: { sellerId: session.user.id, deletedAt: null },
    orderBy: [{ updatedAt: 'desc' }],
    take: 100,
    include: {
      category: { select: { name: true } },
      locality: { select: { name: true } },
    },
  });

  return (
    <main className={styles.main}>
      <p className={styles.back}>
        <Link href="/">← На главную</Link>
        {' · '}
        <Link href="/listings/new">Подать</Link>
      </p>
      <h1 className={styles.title}>Мои объявления</h1>
      <p className={styles.lead}>Статусы меняются только по правилам FSM.</p>

      {rows.length === 0 ? (
        <p className={styles.empty}>
          Пока пусто. <Link href="/listings/new">Создать объявление</Link>
        </p>
      ) : (
        <ul className={styles.list}>
          {rows.map((row) => {
            const from = row.status as ListingStatus;
            const actions = nextActions(from);
            const change = changeListingStatus.bind(null, row.id);
            return (
              <li key={row.id} className={styles.card}>
                <div className={styles.head}>
                  <div>
                    <p className={styles.name}>
                      <Link href={`/listings/${row.slug}`}>{row.title}</Link>
                    </p>
                    <p className={styles.meta}>
                      {formatPriceByn(row.priceMinor)} · {row.category.name} · {row.locality.name}
                    </p>
                  </div>
                  <span className={styles.badge}>{statusLabel[row.status] ?? row.status}</span>
                </div>
                <div className={styles.actions}>
                  <Link className={styles.primary} href={`/listings/${row.slug}`}>
                    Открыть
                  </Link>
                  {actions.map((to) => (
                    <form key={to} action={change}>
                      <input type="hidden" name="to" value={to} />
                      <button type="submit">{actionLabel[to] ?? to}</button>
                    </form>
                  ))}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
