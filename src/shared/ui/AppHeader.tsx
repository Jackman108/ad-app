import Link from 'next/link';
import { SignOutButton } from '@/features/auth-ui/ui/SignOutButton';
import { siteConfig } from '@/shared/config/site';
import styles from './app-header.module.css';

type Props = {
  userName?: string | null;
  unreadCount?: number;
  /** Показывать ссылку диспетчера (User.role === ADMIN). */
  isDispatcher?: boolean;
};

/** Общая шапка продукта (заявки). */
export function AppHeader({ userName, unreadCount = 0, isDispatcher = false }: Props) {
  const authed = Boolean(userName);

  return (
    <header className={styles.header}>
      <Link href="/" className={styles.brand}>
        {siteConfig.name}
      </Link>
      <nav className={styles.nav} aria-label="Основное">
        {authed ? (
          <>
            <Link href="/orders">Заявки</Link>
            <Link href="/orders/new">Новая</Link>
            {isDispatcher ? <Link href="/dispatch">Диспетчер</Link> : null}
            <Link href="/master/orders">Мастер</Link>
            <Link href="/inbox" className={styles.inboxLink}>
              Сообщения
              {unreadCount > 0 ? (
                <span className={styles.badge} aria-label={`Непрочитанных: ${unreadCount}`}>
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              ) : null}
            </Link>
            <span className={styles.user}>{userName}</span>
            <SignOutButton />
          </>
        ) : (
          <>
            <Link href="/login">Войти</Link>
            <Link href="/register">Регистрация</Link>
          </>
        )}
      </nav>
    </header>
  );
}
