'use client';

import { useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import styles from './create-work-order-form.module.css';

type Org = { id: string; name: string };
type Site = { id: string; name: string; organizationId: string; addressLine: string };
type Cat = {
  id: string;
  name: string;
  parentId: string | null;
  allowsOrder: boolean;
};

type Props = {
  organizations: Org[];
  sites: Site[];
  categories: Cat[];
  action: (formData: FormData) => Promise<{ ok: true; id: string } | { ok: false; error: string }>;
};

export function CreateWorkOrderForm({ organizations, sites, categories, action }: Props) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [organizationId, setOrganizationId] = useState(organizations[0]?.id ?? '');

  const filteredSites = useMemo(
    () => sites.filter((s) => s.organizationId === organizationId),
    [sites, organizationId],
  );

  const roots = categories.filter((c) => !c.parentId);
  const childrenOf = (parentId: string) =>
    categories.filter((c) => c.parentId === parentId && c.allowsOrder);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    start(async () => {
      setError(null);
      const res = await action(fd);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      router.push(`/orders/${res.id}`);
    });
  }

  if (!organizations.length) {
    return (
      <p className={styles.hint}>
        Нет организации. Выполните seed БД или попросите диспетчера добавить вас в Org.
      </p>
    );
  }

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <label className={styles.label}>
        Организация
        <select
          className={styles.input}
          name="organizationId"
          value={organizationId}
          onChange={(e) => setOrganizationId(e.target.value)}
          required
        >
          {organizations.map((o) => (
            <option key={o.id} value={o.id}>
              {o.name}
            </option>
          ))}
        </select>
      </label>
      <label className={styles.label}>
        Объект
        <select
          className={styles.input}
          name="siteId"
          required
          key={organizationId}
          defaultValue={filteredSites[0]?.id ?? ''}
        >
          {filteredSites.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} — {s.addressLine}
            </option>
          ))}
        </select>
      </label>
      <label className={styles.label}>
        Категория работ
        <select className={styles.input} name="categoryId" required defaultValue="">
          <option value="" disabled>
            Выберите
          </option>
          {roots.map((root) => {
            const kids = childrenOf(root.id);
            if (kids.length === 0 && root.allowsOrder) {
              return (
                <option key={root.id} value={root.id}>
                  {root.name}
                </option>
              );
            }
            return (
              <optgroup key={root.id} label={root.name}>
                {kids.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </optgroup>
            );
          })}
        </select>
      </label>
      <label className={styles.label}>
        Заголовок
        <input className={styles.input} name="title" required minLength={3} maxLength={160} />
      </label>
      <label className={styles.label}>
        Описание проблемы
        <textarea
          className={styles.textarea}
          name="description"
          required
          minLength={10}
          rows={5}
        />
      </label>
      <label className={styles.label}>
        Фото «до» (желательно)
        <input className={styles.input} name="image" type="file" accept="image/jpeg,image/png,image/webp" />
      </label>
      {error ? <p className={styles.error}>{error}</p> : null}
      <button className={styles.submit} type="submit" disabled={pending}>
        {pending ? 'Отправка…' : 'Создать заявку'}
      </button>
    </form>
  );
}
