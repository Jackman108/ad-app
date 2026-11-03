import Link from 'next/link';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { formatPriceByn } from '@/entities/listing/model/dto';
import { countUnreadForUser } from '@/features/contact-seller/model/unread';
import { ensureMasterProfile } from '@/features/master-work-order/model/ensure-master-profile';
import { auth } from '@/shared/lib/auth';
import { prisma } from '@/shared/lib/prisma';
import { AppHeader } from '@/shared/ui/AppHeader';
import { MasterOrderActions } from './MasterActions';
import { submitAccept, submitComplete, submitStart } from './actions';
import styles from './master.module.css';

export const dynamic = 'force-dynamic';

export default async function MasterOrdersPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect('/login');

  await ensureMasterProfile(session.user.id);

  const [orders, unreadCount] = await Promise.all([
    prisma.workOrder.findMany({
      where: {
        masterId: session.user.id,
        deletedAt: null,
        status: {
          in: ['OFFERED', 'ACCEPTED', 'IN_PROGRESS', 'AWAITING_CONFIRM', 'CLOSED'],
        },
      },
      orderBy: { updatedAt: 'desc' },
      take: 50,
      include: {
        site: { select: { name: true, addressLine: true } },
        category: { select: { name: true } },
        organization: { select: { name: true } },
      },
    }),
    countUnreadForUser(session.user.id),
  ]);

  return (
    <main className={styles.main}>
      <AppHeader userName={session.user.name} unreadCount={unreadCount} />
      <h1 className={styles.title}>Кабинет мастера</h1>
      <p className={styles.lead}>Назначенные заявки · фото «после» без перекодирования</p>

      {orders.length === 0 ? (
        <p className={styles.meta}>Пока нет назначений. Диспетчер предложит заказ (OFFERED).</p>
      ) : (
        <ul className={styles.list}>
          {orders.map((o) => (
            <li key={o.id} className={styles.card}>
              <div className={styles.cardHead}>
                <Link href={`/orders/${o.id}`} className={styles.cardTitle}>
                  {o.title}
                </Link>
                <span className={styles.badge}>{o.status}</span>
              </div>
              <p className={styles.cardMeta}>
                {o.organization.name} · {o.site.name} · {o.site.addressLine} · {o.category.name}
                {o.priceMinor != null ? ` · ${formatPriceByn(o.priceMinor)}` : ''}
              </p>
              <MasterOrderActions
                workOrderId={o.id}
                status={o.status}
                acceptAction={submitAccept}
                startAction={submitStart}
                completeAction={submitComplete}
              />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
