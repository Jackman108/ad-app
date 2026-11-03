'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { authClient } from '@/shared/lib/auth-client';
import styles from './auth-form.module.css';

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get('name') ?? '');
    const email = String(fd.get('email') ?? '');
    const password = String(fd.get('password') ?? '');

    const { error: err } = await authClient.signUp.email({ name, email, password });
    setPending(false);
    if (err) {
      setError(err.message ?? 'Не удалось зарегистрироваться');
      return;
    }
    router.push('/');
    router.refresh();
  }

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <label className={styles.label}>
        Имя
        <input className={styles.input} name="name" type="text" required autoComplete="name" />
      </label>
      <label className={styles.label}>
        Email
        <input className={styles.input} name="email" type="email" required autoComplete="email" />
      </label>
      <label className={styles.label}>
        Пароль
        <input
          className={styles.input}
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
        />
      </label>
      {error ? <p className={styles.error}>{error}</p> : null}
      <button className={styles.submit} type="submit" disabled={pending}>
        {pending ? 'Создаём…' : 'Создать аккаунт'}
      </button>
      <p className={styles.footer}>
        Уже есть аккаунт? <Link href="/login">Вход</Link>
      </p>
    </form>
  );
}
