'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import styles from './create-listing-form.module.css';

type Option = { id: string; name: string };

type Props = {
  categories: Option[];
  localities: { id: string; name: string; regionName: string }[];
  action: (formData: FormData) => Promise<{ ok: true; slug: string } | { ok: false; error: string }>;
};

export function CreateListingForm({ categories, localities, action }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const result = await action(fd);
    setPending(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.push(`/listings/${result.slug}`);
    router.refresh();
  }

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <label className={styles.label}>
        Заголовок
        <input className={styles.input} name="title" required minLength={3} maxLength={120} />
      </label>
      <label className={styles.label}>
        Описание
        <textarea className={styles.textarea} name="description" required minLength={10} rows={6} />
      </label>
      <label className={styles.label}>
        Цена, BYN (пусто = договорная)
        <input className={styles.input} name="priceByn" inputMode="decimal" placeholder="например 150" />
      </label>
      <label className={styles.label}>
        Категория
        <select className={styles.input} name="categoryId" required defaultValue="">
          <option value="" disabled>
            Выберите
          </option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </label>
      <label className={styles.label}>
        Населённый пункт
        <select className={styles.input} name="localityId" required defaultValue="">
          <option value="" disabled>
            Выберите
          </option>
          {localities.map((l) => (
            <option key={l.id} value={l.id}>
              {l.regionName} — {l.name}
            </option>
          ))}
        </select>
      </label>
      <label className={styles.label}>
        Состояние
        <select className={styles.input} name="condition" defaultValue="USED">
          <option value="NEW">Новое</option>
          <option value="USED">Б/у</option>
          <option value="FOR_PARTS">На запчасти</option>
          <option value="NOT_APPLICABLE">Не применимо</option>
        </select>
      </label>
      {error ? <p className={styles.error}>{error}</p> : null}
      <button className={styles.submit} type="submit" disabled={pending}>
        {pending ? 'Публикуем…' : 'Опубликовать'}
      </button>
    </form>
  );
}
