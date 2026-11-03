import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { CreateListingForm } from '@/features/create-listing/ui/CreateListingForm';
import { countUnreadForUser } from '@/features/contact-seller/model/unread';
import { auth } from '@/shared/lib/auth';
import { prisma } from '@/shared/lib/prisma';
import { AppHeader } from '@/shared/ui/AppHeader';
import { submitNewListing } from './actions';
import styles from './page.module.css';

export default async function NewListingPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect('/login');

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
    countUnreadForUser(session.user.id),
  ]);

  return (
    <main className={styles.main}>
      <AppHeader userName={session.user.name} unreadCount={unreadCount} />
      <h1 className={styles.title}>Новое объявление</h1>
      <CreateListingForm
        categories={categories}
        regions={regions}
        localities={localities}
        action={submitNewListing}
      />
    </main>
  );
}
