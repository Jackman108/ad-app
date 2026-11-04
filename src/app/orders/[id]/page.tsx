import Link from 'next/link';
import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { toWorkOrderOrgDto } from '@/entities/work-order/model/dto';
import { countUnreadForUser } from '@/features/contact-seller/model/unread';
import { auth } from '@/shared/lib/auth';
import { prisma } from '@/shared/lib/prisma';
import { AppHeader } from '@/shared/ui/AppHeader';
import { ConfirmActions } from './ConfirmActions';
import { submitConfirm, submitRework } from './actions';
import styles from '../orders.module.css';

export const dynamic = 'force-dynamic';

export default async function WorkOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect('/login');

  const { id } = await params;
  const memberships = await prisma.orgMembership.findMany({
    where: { userId: session.user.id },
    select: { organizationId: true },
  });
  const orgIds = new Set(memberships.map((m) => m.organizationId));

  const row = await prisma.workOrder.findFirst({
    where: { id, deletedAt: null },
    include: {
      organization: { select: { id: true, name: true } },
      site: { include: { locality: { select: { id: true, name: true } } } },
      category: { select: { id: true, name: true, slug: true } },
      createdBy: { select: { id: true, name: true } },
      master: { select: { id: true, name: true } },
      images: true,
    },
  });
  if (!row || !orgIds.has(row.organizationId)) notFound();

  const dto = toWorkOrderOrgDto(row);
  const unreadCount = await countUnreadForUser(session.user.id);

  return (
    <main className={styles.main}>
      <AppHeader userName={session.user.name} unreadCount={unreadCount} />
      <p className={styles.back}>
        <Link href="/orders">← К заявкам</Link>
      </p>
      <h1 className={styles.title}>{dto.title}</h1>
      <p className={styles.lead}>
        {dto.status} · {dto.site.name} · {dto.category.name}
      </p>
      <p className={styles.body}>{dto.description}</p>
      <p className={styles.meta}>
        {dto.site.localityName}, {dto.site.addressLine}
        {dto.masterName ? ` · мастер: ${dto.masterName}` : ''}
      </p>

      {dto.beforeKeys.length > 0 ? (
        <section className={styles.photos}>
          <h2 className={styles.photosTitle}>До</h2>
          <div className={styles.photoRow}>
            {dto.beforeKeys.map((key) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={key} className={styles.photo} src={`/api/uploads/${key}`} alt="" />
            ))}
          </div>
        </section>
      ) : null}

      {dto.afterKeys.length > 0 ? (
        <section className={styles.photos}>
          <h2 className={styles.photosTitle}>После</h2>
          <div className={styles.photoRow}>
            {dto.afterKeys.map((key) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={key} className={styles.photo} src={`/api/uploads/${key}`} alt="" />
            ))}
          </div>
        </section>
      ) : null}

      {dto.status === 'AWAITING_CONFIRM' ? (
        <ConfirmActions
          workOrderId={dto.id}
          confirmAction={submitConfirm}
          reworkAction={submitRework}
        />
      ) : null}
    </main>
  );
}
