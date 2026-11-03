import Link from 'next/link';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { formatPriceByn, toListingContact, toListingPublic } from '@/entities/listing/model/dto';
import { WriteSellerForm } from '@/features/contact-seller/ui/WriteSellerForm';
import { ReportForm } from '@/features/report-listing/ui/ReportForm';
import { auth } from '@/shared/lib/auth';
import { prisma } from '@/shared/lib/prisma';
import { writeToSeller } from './message-actions';
import { reportListingAction } from './report-actions';
import styles from './page.module.css';

type Props = { params: Promise<{ slug: string }> };

export default async function ListingPage({ params }: Props) {
  const { slug } = await params;
  const session = await auth.api.getSession({ headers: await headers() });

  const row = await prisma.listing.findFirst({
    where: { slug, deletedAt: null, status: 'PUBLISHED' },
    include: {
      category: true,
      locality: { include: { region: true } },
      seller: true,
      images: true,
    },
  });
  if (!row) notFound();

  const isAuthed = Boolean(session?.user);
  const isOwner = session?.user?.id === row.sellerId;
  const view = isAuthed ? toListingContact(row) : toListingPublic(row);
  const phone = isAuthed ? toListingContact(row).sellerPhoneE164 : null;
  const cover = view.coverKey;
  const write = writeToSeller.bind(null, row.id);
  const report = reportListingAction.bind(null, row.id);

  return (
    <main className={styles.main}>
      <p className={styles.back}>
        <Link href="/">← Лента</Link>
      </p>
      {cover ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img className={styles.cover} src={`/api/uploads/${cover}`} alt="" />
      ) : null}
      <p className={styles.meta}>
        {view.category.name} · {view.locality.regionName}, {view.locality.name}
      </p>
      <h1 className={styles.title}>{view.title}</h1>
      <p className={styles.price}>{formatPriceByn(view.priceMinor)}</p>
      <p className={styles.seller}>Продавец: {view.seller.name}</p>
      {isAuthed ? (
        phone ? (
          <p className={styles.phone}>Телефон: {phone}</p>
        ) : (
          <p className={styles.phoneMuted}>Телефон не подтверждён</p>
        )
      ) : (
        <p className={styles.phoneMuted}>
          <Link href="/login">Войдите</Link>, чтобы увидеть телефон
        </p>
      )}
      <div className={styles.body}>{view.description}</div>
      {isAuthed && !isOwner ? <WriteSellerForm action={write} /> : null}
      {isAuthed && !isOwner ? <ReportForm action={report} slug={row.slug} /> : null}
    </main>
  );
}
