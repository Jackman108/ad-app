import Link from 'next/link';
import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { auth } from '@/shared/lib/auth';
import { prisma } from '@/shared/lib/prisma';
import { replyAction } from './actions';
import styles from './page.module.css';

type Props = { params: Promise<{ id: string }> };

export default async function ConversationPage({ params }: Props) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect('/login');

  const conversation = await prisma.conversation.findUnique({
    where: { id },
    include: {
      listing: { select: { title: true, slug: true } },
      messages: {
        orderBy: { createdAt: 'asc' },
        include: { sender: { select: { id: true, name: true } } },
      },
    },
  });
  if (!conversation) notFound();
  if (session.user.id !== conversation.buyerId && session.user.id !== conversation.sellerId) {
    notFound();
  }

  const send = replyAction.bind(null, conversation.id);

  return (
    <main className={styles.main}>
      <p className={styles.back}>
        <Link href="/inbox">← Inbox</Link>
      </p>
      <h1 className={styles.title}>
        <Link href={`/listings/${conversation.listing.slug}`}>{conversation.listing.title}</Link>
      </h1>
      <ul className={styles.messages}>
        {conversation.messages.map((m) => (
          <li
            key={m.id}
            className={m.senderId === session.user.id ? styles.mine : styles.theirs}
          >
            <span className={styles.who}>{m.sender.name}</span>
            <p className={styles.body}>{m.body}</p>
          </li>
        ))}
      </ul>
      <form className={styles.form} action={send}>
        <textarea name="body" required rows={3} className={styles.textarea} placeholder="Сообщение…" />
        <button type="submit" className={styles.submit}>
          Отправить
        </button>
      </form>
    </main>
  );
}
