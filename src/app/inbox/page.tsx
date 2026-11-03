import Link from 'next/link';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/shared/lib/auth';
import { prisma } from '@/shared/lib/prisma';
import styles from './page.module.css';

export default async function InboxPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect('/login');

  const conversations = await prisma.conversation.findMany({
    where: {
      OR: [{ buyerId: session.user.id }, { sellerId: session.user.id }],
    },
    orderBy: { lastMessageAt: 'desc' },
    include: {
      listing: { select: { title: true, slug: true } },
      buyer: { select: { name: true } },
      seller: { select: { name: true } },
    },
  });

  return (
    <main className={styles.main}>
      <p className={styles.back}>
        <Link href="/">← Лента</Link>
      </p>
      <h1 className={styles.title}>Сообщения</h1>
      {conversations.length === 0 ? (
        <p className={styles.empty}>Пока нет переписок.</p>
      ) : (
        <ul className={styles.list}>
          {conversations.map((c) => {
            const peer = c.buyerId === session.user.id ? c.seller.name : c.buyer.name;
            return (
              <li key={c.id}>
                <Link href={`/inbox/${c.id}`} className={styles.item}>
                  <strong>{c.listing.title}</strong>
                  <span>
                    с {peer}
                    {c.lastMessageAt
                      ? ` · ${c.lastMessageAt.toLocaleString('ru-BY')}`
                      : ''}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
