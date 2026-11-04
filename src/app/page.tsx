import Link from 'next/link';
import { headers } from 'next/headers';
import { countUnreadForUser } from '@/features/contact-seller/model/unread';
import { siteConfig } from '@/shared/config/site';
import { auth } from '@/shared/lib/auth';
import { AppHeader } from '@/shared/ui/AppHeader';
import styles from './home.module.css';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const unreadCount = session?.user ? await countUnreadForUser(session.user.id) : 0;

  return (
    <main className={styles.main}>
      <AppHeader userName={session?.user?.name} unreadCount={unreadCount} />

      <section className={styles.hero} aria-labelledby="brand">
        <p className={styles.eyebrow}>Беларусь · B2B</p>
        <h1 id="brand" className={styles.brand}>
          {siteConfig.name}
        </h1>
        <p className={styles.tagline}>{siteConfig.tagline}</p>
        <p className={styles.support}>
          Одна заявка вместо пяти подрядчиков: сантехника, электрика, двери — с фото «до/после» и
          безналом для точки.
        </p>
        <div className={styles.cta}>
          {session?.user ? (
            <>
              <Link className={styles.primary} href="/orders/new">
                Создать заявку
              </Link>
              <Link className={styles.secondary} href="/orders">
                Мои заявки
              </Link>
            </>
          ) : (
            <>
              <Link className={styles.primary} href="/register">
                Начать
              </Link>
              <Link className={styles.secondary} href="/login">
                Войти
              </Link>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
