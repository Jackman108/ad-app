import Link from 'next/link';
import { SignOutButton } from '@/features/auth-ui/ui/SignOutButton';
import styles from './app-header.module.css';

type Props = {
  userName?: string | null;
  unreadCount?: number;
};

/** Общая шапка: навигация ядра сделки (лента → подать → сообщения). */
export function AppHeader({ userName, unreadCount = 0 }: Props) {
  const authed = Boolean(userName);

  return (
    <header className={styles.header}>
      <Link href="/" className={styles.brand}>
        Объявки BY
      </Link>
      <nav className={styles.nav} aria-label="Основное">
        {authed ? (
          <>
            <Link href="/listings/new">Подать</Link>
            <Link href="/my/listings">Мои</Link>
            <Link href="/favorites">Избранное</Link>
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
