import Link from 'next/link';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { CreateListingForm } from '@/features/create-listing/ui/CreateListingForm';
import { auth } from '@/shared/lib/auth';
import { prisma } from '@/shared/lib/prisma';
import { submitNewListing } from './actions';
import styles from './page.module.css';

export default async function NewListingPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect('/login');

  const [categories, localities] = await Promise.all([
    prisma.category.findMany({
      where: { isActive: true, allowsListing: true },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      select: { id: true, name: true },
    }),
    prisma.locality.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      select: { id: true, name: true, region: { select: { name: true } } },
    }),
  ]);

  return (
    <main className={styles.main}>
      <p className={styles.back}>
        <Link href="/">← На главную</Link>
      </p>
      <h1 className={styles.title}>Новое объявление</h1>
      <CreateListingForm
        categories={categories}
        localities={localities.map((l) => ({
          id: l.id,
          name: l.name,
          regionName: l.region.name,
        }))}
        action={submitNewListing}
      />
    </main>
  );
}
