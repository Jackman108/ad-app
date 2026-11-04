'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import styles from '../orders.module.css';

type Action = (fd: FormData) => Promise<{ ok: true } | { ok: false; error: string }>;

export function ConfirmActions({
  workOrderId,
  confirmAction,
  reworkAction,
}: {
  workOrderId: string;
  confirmAction: Action;
  reworkAction: Action;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function run(action: Action, fd: FormData) {
    start(async () => {
      setError(null);
      const res = await action(fd);
      if (!res.ok) setError(res.error);
      else router.refresh();
    });
  }

  return (
    <div className={styles.confirmBox}>
      <p className={styles.confirmLead}>Мастер сдал работу — подтвердите или верните на доработку.</p>
      <div className={styles.confirmRow}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            run(confirmAction, new FormData(e.currentTarget));
          }}
        >
          <input type="hidden" name="workOrderId" value={workOrderId} />
          <button className={styles.cta} type="submit" disabled={pending}>
            Подтвердить и закрыть
          </button>
        </form>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            run(reworkAction, new FormData(e.currentTarget));
          }}
        >
          <input type="hidden" name="workOrderId" value={workOrderId} />
          <button className={styles.secondaryBtn} type="submit" disabled={pending}>
            На доработку
          </button>
        </form>
      </div>
      {error ? <p className={styles.error}>{error}</p> : null}
    </div>
  );
}
