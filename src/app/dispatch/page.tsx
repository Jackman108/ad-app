import Link from 'next/link';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { formatPriceByn } from '@/entities/listing/model/dto';
import { workOrderStatusLabel } from '@/entities/work-order/model/status';
import { countUnreadForUser } from '@/features/contact-seller/model/unread';
import { auth } from '@/shared/lib/auth';
import { prisma } from '@/shared/lib/prisma';
import { AppHeader } from '@/shared/ui/AppHeader';
import { EstimateForm, OfferForm } from './DispatchForms';
import { submitEstimate, submitOffer } from './actions';
import styles from './dispatch.module.css';

export const dynamic = 'force-dynamic';

export default async function DispatchPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect('/login');

  const me = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!me || me.role !== 'ADMIN') redirect('/orders');

  const [queue, masters, unreadCount] = await Promise.all([
    prisma.workOrder.findMany({
      where: {
        deletedAt: null,
        status: { in: ['SUBMITTED', 'ESTIMATED', 'OFFERED'] },
      },
      orderBy: { createdAt: 'asc' },
      take: 50,
      include: {
        site: { select: { name: true, addressLine: true } },
        category: { select: { name: true } },
        organization: { select: { name: true } },
        master: { select: { name: true } },
      },
    }),
    prisma.masterProfile.findMany({
      where: { isActive: true },
      include: { user: { select: { id: true, name: true } } },
      take: 100,
    }),
    countUnreadForUser(session.user.id),
  ]);

  const masterOpts = masters.map((m) => ({ userId: m.user.id, name: m.user.name }));

  return (
    <main className={styles.main}>
      <AppHeader userName={session.user.name} unreadCount={unreadCount} isDispatcher />
      <h1 className={styles.title}>Диспетчер</h1>
      <p className={styles.lead}>Очередь новых / оценённых / предложенных</p>

      {queue.length === 0 ? (
        <p className={styles.meta}>Очередь пуста.</p>
      ) : (
        <ul className={styles.list}>
          {queue.map((o) => (
            <li key={o.id} className={styles.card}>
              <div className={styles.cardHead}>
                <Link href={`/orders/${o.id}`} className={styles.cardTitle}>
                  {o.title}
                </Link>
                <span className={styles.badge}>{workOrderStatusLabel(o.status)}</span>
              </div>
              <p className={styles.cardMeta}>
                {o.organization.name} · {o.site.name} · {o.category.name}
                {o.priceMinor != null ? ` · ${formatPriceByn(o.priceMinor)}` : ''}
                {o.master ? ` · ${o.master.name}` : ''}
              </p>
              {o.status === 'SUBMITTED' ? (
                <EstimateForm workOrderId={o.id} action={submitEstimate} />
              ) : null}
              {o.status === 'ESTIMATED' ? (
                <OfferForm workOrderId={o.id} masters={masterOpts} action={submitOffer} />
              ) : null}
              {o.status === 'OFFERED' ? (
                <p className={styles.hint}>Ждём accept мастера (Z4).</p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
