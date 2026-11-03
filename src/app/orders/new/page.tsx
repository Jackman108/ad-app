import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { CreateWorkOrderForm } from '@/features/create-work-order/ui/CreateWorkOrderForm';
import { ensureDemoOrgMembership } from '@/features/create-work-order/model/ensure-demo-membership';
import { countUnreadForUser } from '@/features/contact-seller/model/unread';
import { auth } from '@/shared/lib/auth';
import { prisma } from '@/shared/lib/prisma';
import { AppHeader } from '@/shared/ui/AppHeader';
import { submitNewWorkOrder } from './actions';
import styles from '../orders.module.css';

export default async function NewWorkOrderPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect('/login');

  await ensureDemoOrgMembership(session.user.id);

  const [memberships, categories, unreadCount] = await Promise.all([
    prisma.orgMembership.findMany({
      where: { userId: session.user.id },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
            sites: {
              where: { isActive: true },
              select: { id: true, name: true, organizationId: true, addressLine: true },
              orderBy: { name: 'asc' },
            },
          },
        },
      },
    }),
    prisma.workCategory.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      select: { id: true, name: true, parentId: true, allowsOrder: true },
    }),
    countUnreadForUser(session.user.id),
  ]);

  const organizations = memberships.map((m) => ({
    id: m.organization.id,
    name: m.organization.name,
  }));
  const sites = memberships.flatMap((m) => m.organization.sites);

  return (
    <main className={styles.main}>
      <AppHeader userName={session.user.name} unreadCount={unreadCount} />
      <h1 className={styles.title}>Новая заявка</h1>
      <p className={styles.lead}>Завхоз · фото «до» без перекодирования</p>
      <CreateWorkOrderForm
        organizations={organizations}
        sites={sites}
        categories={categories}
        action={submitNewWorkOrder}
      />
    </main>
  );
}
