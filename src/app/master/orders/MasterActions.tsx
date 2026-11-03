'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import styles from './master.module.css';

type Action = (fd: FormData) => Promise<{ ok: true } | { ok: false; error: string }>;

function ActionButton({
  workOrderId,
  label,
  action,
}: {
  workOrderId: string;
  label: string;
  action: Action;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className={styles.inline}
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
      <button className={styles.btn} type="submit" disabled={pending}>
        {label}
      </button>
      {error ? <span className={styles.error}>{error}</span> : null}
    </form>
  );
}

export function MasterOrderActions({
  workOrderId,
  status,
  acceptAction,
  startAction,
  completeAction,
}: {
  workOrderId: string;
  status: string;
  acceptAction: Action;
  startAction: Action;
  completeAction: Action;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  if (status === 'OFFERED') {
    return <ActionButton workOrderId={workOrderId} label="Принять" action={acceptAction} />;
  }
  if (status === 'ACCEPTED') {
    return <ActionButton workOrderId={workOrderId} label="В работу" action={startAction} />;
  }
  if (status === 'IN_PROGRESS') {
    return (
      <form
        className={styles.completeForm}
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          start(async () => {
            setError(null);
            const res = await completeAction(fd);
            if (!res.ok) setError(res.error);
            else router.refresh();
          });
        }}
      >
        <input type="hidden" name="workOrderId" value={workOrderId} />
        <label className={styles.label}>
          Фото «после»
          <input
            className={styles.input}
            name="images"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            required
          />
        </label>
        <button className={styles.btn} type="submit" disabled={pending}>
          Сдать на подтверждение
        </button>
        {error ? <span className={styles.error}>{error}</span> : null}
      </form>
    );
  }
  return null;
}
