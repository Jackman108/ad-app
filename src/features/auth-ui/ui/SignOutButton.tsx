'use client';

import { useRouter } from 'next/navigation';
import { authClient } from '@/shared/lib/auth-client';
import styles from './sign-out.module.css';

export function SignOutButton() {
  const router = useRouter();

  async function onClick() {
    await authClient.signOut();
    router.push('/');
    router.refresh();
  }

  return (
    <button type="button" className={styles.btn} onClick={onClick}>
      Выйти
    </button>
  );
}
