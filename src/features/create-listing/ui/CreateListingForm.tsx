'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import type { CategoryRow } from '@/entities/category/model/tree';
import { ListingTaxonomyFields } from './ListingTaxonomyFields';
import styles from './create-listing-form.module.css';

export type ListingFormDefaults = {
  title?: string;
  description?: string;
  priceByn?: string;
  categoryId?: string;
  localityId?: string;
  condition?: string;
};

type Props = {
  categories: CategoryRow[];
  regions: { id: string; name: string }[];
  localities: { id: string; name: string; regionId: string }[];
  action: (formData: FormData) => Promise<{ ok: true; slug: string } | { ok: false; error: string }>;
  defaults?: ListingFormDefaults;
  submitLabel?: string;
  pendingLabel?: string;
  showImage?: boolean;
};

export function CreateListingForm({
  categories,
  regions,
  localities,
  action,
  defaults,
  submitLabel = 'Опубликовать',
  pendingLabel = 'Публикуем…',
  showImage = true,
}: Props) {
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
    <form className={styles.form} onSubmit={onSubmit} encType="multipart/form-data">
      <label className={styles.label}>
        Заголовок
        <input
          className={styles.input}
          name="title"
          required
          minLength={3}
          maxLength={120}
          defaultValue={defaults?.title ?? ''}
        />
      </label>
      <label className={styles.label}>
        Описание
        <textarea
          className={styles.textarea}
          name="description"
          required
          minLength={10}
          rows={6}
          defaultValue={defaults?.description ?? ''}
        />
      </label>
      <label className={styles.label}>
        Цена, BYN (пусто = договорная)
        <input
          className={styles.input}
          name="priceByn"
          inputMode="decimal"
          placeholder="например 150"
          defaultValue={defaults?.priceByn ?? ''}
        />
      </label>
      <ListingTaxonomyFields
        categories={categories}
        regions={regions}
        localities={localities}
        defaultCategoryId={defaults?.categoryId}
        defaultLocalityId={defaults?.localityId}
      />
      <label className={styles.label}>
        Состояние
        <select className={styles.input} name="condition" defaultValue={defaults?.condition ?? 'USED'}>
          <option value="NEW">Новое</option>
          <option value="USED">Б/у</option>
          <option value="FOR_PARTS">На запчасти</option>
          <option value="NOT_APPLICABLE">Не применимо</option>
        </select>
      </label>
      {showImage ? (
        <label className={styles.label}>
          Фото (необязательно)
          <input className={styles.input} name="image" type="file" accept="image/jpeg,image/png,image/webp" />
        </label>
      ) : null}
      {error ? <p className={styles.error}>{error}</p> : null}
      <button className={styles.submit} type="submit" disabled={pending}>
        {pending ? pendingLabel : submitLabel}
      </button>
    </form>
  );
}
