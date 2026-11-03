import Link from 'next/link';
import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { CreateListingForm } from '@/features/create-listing/ui/CreateListingForm';
import { countUnreadForUser } from '@/features/contact-seller/model/unread';
import { auth } from '@/shared/lib/auth';
import { prisma } from '@/shared/lib/prisma';
import { AppHeader } from '@/shared/ui/AppHeader';
import { submitListingEdit } from './actions';
import styles from '../../new/page.module.css';

export const dynamic = 'force-dynamic';

export default async function EditListingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect('/login');

  const listing = await prisma.listing.findFirst({
    where: { slug, sellerId: session.user.id, deletedAt: null },
  });
  if (!listing) notFound();
  if (listing.status === 'ARCHIVED' || listing.status === 'SOLD') {
    redirect('/my/listings');
  }

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

  const action = submitListingEdit.bind(null, listing.id);
  const priceByn =
    listing.priceMinor == null ? '' : (listing.priceMinor / 100).toString().replace('.', ',');

  return (
    <main className={styles.main}>
      <AppHeader userName={session.user.name} unreadCount={unreadCount} />
      <p className={styles.back}>
        <Link href="/my/listings">← Мои объявления</Link>
        {' · '}
        <Link href={`/listings/${listing.slug}`}>Карточка</Link>
      </p>
      <h1 className={styles.title}>Редактировать</h1>
      <CreateListingForm
        categories={categories}
        regions={regions}
        localities={localities}
        action={action}
        defaults={{
          title: listing.title,
          description: listing.description,
          priceByn,
          categoryId: listing.categoryId,
          localityId: listing.localityId,
          condition: listing.condition,
        }}
        submitLabel="Сохранить"
        pendingLabel="Сохраняем…"
        showImage={false}
      />
    </main>
  );
}
