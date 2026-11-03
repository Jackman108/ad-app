import Link from 'next/link';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  countUnreadForUser,
  unreadCountsByConversation,
} from '@/features/contact-seller/model/unread';
import { auth } from '@/shared/lib/auth';
import { prisma } from '@/shared/lib/prisma';
import { AppHeader } from '@/shared/ui/AppHeader';
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

  const [unreadTotal, unreadMap] = await Promise.all([
    countUnreadForUser(session.user.id),
    unreadCountsByConversation(
      session.user.id,
      conversations.map((c) => c.id),
    ),
  ]);

  return (
    <main className={styles.main}>
      <AppHeader userName={session.user.name} unreadCount={unreadTotal} />
      <p className={styles.back}>
        <Link href="/">← Лента</Link>
      </p>
      <h1 className={styles.title}>Сообщения</h1>
      {conversations.length === 0 ? (
        <p className={styles.empty}>Пока нет переписок. Откройте объявление и нажмите «Отправить».</p>
      ) : (
        <ul className={styles.list}>
          {conversations.map((c) => {
            const peer = c.buyerId === session.user.id ? c.seller.name : c.buyer.name;
            const unread = unreadMap.get(c.id) ?? 0;
            return (
              <li key={c.id}>
                <Link
                  href={`/inbox/${c.id}`}
                  className={unread > 0 ? `${styles.item} ${styles.itemUnread}` : styles.item}
                >
                  <span className={styles.itemTop}>
                    <strong>{c.listing.title}</strong>
                    {unread > 0 ? <span className={styles.dot}>{unread}</span> : null}
                  </span>
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
