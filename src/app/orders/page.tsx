import Link from 'next/link';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { workOrderStatusLabel } from '@/entities/work-order/model/status';
import { ensureDemoOrgMembership } from '@/features/create-work-order/model/ensure-demo-membership';
import { countUnreadForUser } from '@/features/contact-seller/model/unread';
import { auth } from '@/shared/lib/auth';
import { prisma } from '@/shared/lib/prisma';
import { AppHeader } from '@/shared/ui/AppHeader';
import styles from './orders.module.css';

export const dynamic = 'force-dynamic';

export default async function OrdersPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect('/login');

  await ensureDemoOrgMembership(session.user.id);

  const memberships = await prisma.orgMembership.findMany({
    where: { userId: session.user.id },
    select: { organizationId: true },
  });
  const orgIds = memberships.map((m) => m.organizationId);

  const [orders, unreadCount, me] = await Promise.all([
    orgIds.length
      ? prisma.workOrder.findMany({
          where: { organizationId: { in: orgIds }, deletedAt: null },
          orderBy: { createdAt: 'desc' },
          take: 50,
          include: {
            site: { select: { name: true } },
            category: { select: { name: true } },
          },
        })
      : Promise.resolve([]),
    countUnreadForUser(session.user.id),
    prisma.user.findUnique({ where: { id: session.user.id }, select: { role: true } }),
  ]);

  return (
    <main className={styles.main}>
      <AppHeader
        userName={session.user.name}
        unreadCount={unreadCount}
        isDispatcher={me?.role === 'ADMIN'}
      />
      <div className={styles.head}>
        <div>
          <h1 className={styles.title}>Заявки</h1>
          <p className={styles.lead}>Завхоз · ваши объекты</p>
        </div>
        <Link className={styles.cta} href="/orders/new">
          Новая заявка
        </Link>
      </div>

      {orders.length === 0 ? (
        <p className={styles.meta}>
          Пока пусто. <Link href="/orders/new">Создайте первую заявку</Link>.
        </p>
      ) : (
        <ul className={styles.list}>
          {orders.map((o) => (
            <li key={o.id} className={styles.card}>
              <Link href={`/orders/${o.id}`} className={styles.cardLink}>
                <span className={styles.cardTitle}>{o.title}</span>
                <span className={styles.cardMeta}>
                  {workOrderStatusLabel(o.status)} · {o.site.name} · {o.category.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
