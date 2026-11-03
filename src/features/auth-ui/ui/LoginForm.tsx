'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { authClient } from '@/shared/lib/auth-client';
import styles from './auth-form.module.css';

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get('email') ?? '');
    const password = String(fd.get('password') ?? '');

    const { error: err } = await authClient.signIn.email({ email, password });
    setPending(false);
    if (err) {
      setError(err.message ?? 'Не удалось войти');
      return;
    }
    router.push('/');
    router.refresh();
  }

  return (
    <form className={styles.form} onSubmit={onSubmit}>
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
          autoComplete="current-password"
        />
      </label>
      {error ? <p className={styles.error}>{error}</p> : null}
      <button className={styles.submit} type="submit" disabled={pending}>
        {pending ? 'Входим…' : 'Войти'}
      </button>
      <p className={styles.footer}>
        Нет аккаунта? <Link href="/register">Регистрация</Link>
      </p>
    </form>
  );
}
