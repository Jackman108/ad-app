'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import styles from './dispatch.module.css';

type Master = { userId: string; name: string };

export function EstimateForm({
  workOrderId,
  action,
}: {
  workOrderId: string;
  action: (fd: FormData) => Promise<{ ok: true } | { ok: false; error: string }>;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className={styles.inlineForm}
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        start(async () => {
          setError(null);
          const res = await action(fd);
          if (!res.ok) setError(res.error);
          else router.refresh();
        });
      }}
    >
      <input type="hidden" name="workOrderId" value={workOrderId} />
      <input
        className={styles.input}
        name="priceByn"
        placeholder="Цена BYN"
        inputMode="decimal"
        required
        aria-label="Цена BYN"
      />
      <button className={styles.btn} type="submit" disabled={pending}>
        Оценить
      </button>
      {error ? <span className={styles.error}>{error}</span> : null}
    </form>
  );
}

export function OfferForm({
  workOrderId,
  masters,
  action,
}: {
  workOrderId: string;
  masters: Master[];
  action: (fd: FormData) => Promise<{ ok: true } | { ok: false; error: string }>;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  if (!masters.length) {
    return <p className={styles.hint}>Нет активных MasterProfile — создайте профиль мастера.</p>;
  }

  return (
    <form
      className={styles.inlineForm}
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        start(async () => {
          setError(null);
          const res = await action(fd);
          if (!res.ok) setError(res.error);
          else router.refresh();
        });
      }}
    >
      <input type="hidden" name="workOrderId" value={workOrderId} />
      <select className={styles.input} name="masterUserId" required defaultValue={masters[0]?.userId}>
        {masters.map((m) => (
          <option key={m.userId} value={m.userId}>
            {m.name}
          </option>
        ))}
      </select>
      <button className={styles.btn} type="submit" disabled={pending}>
        Назначить
      </button>
      {error ? <span className={styles.error}>{error}</span> : null}
    </form>
  );
}
