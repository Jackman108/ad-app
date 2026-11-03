'use client';

import { useMemo, useState } from 'react';
import type { CategoryRow } from '@/entities/category/model/tree';
import { buildCategoryTree } from '@/entities/category/model/tree';
import styles from './feed-filters.module.css';

type Region = { id: string; name: string };
type Locality = { id: string; name: string; regionId: string };

type Props = {
  categories: CategoryRow[];
  regions: Region[];
  localities: Locality[];
  defaults: {
    q?: string;
    categoryId?: string;
    regionId?: string;
    localityId?: string;
    priceMin?: string;
    priceMax?: string;
  };
};

export function FeedFilters({ categories, regions, localities, defaults }: Props) {
  const tree = useMemo(() => buildCategoryTree(categories), [categories]);
  const [regionId, setRegionId] = useState(defaults.regionId ?? '');
  const filteredLocalities = useMemo(
    () => (regionId ? localities.filter((l) => l.regionId === regionId) : localities),
    [localities, regionId],
  );

  return (
    <form className={styles.filters} method="get">
      <input
        className={styles.input}
        name="q"
        placeholder="Поиск"
        defaultValue={defaults.q ?? ''}
        aria-label="Поиск"
      />
      <select
        className={styles.input}
        name="categoryId"
        defaultValue={defaults.categoryId ?? ''}
        aria-label="Категория"
      >
        <option value="">Все категории</option>
        {tree.map((root) =>
          root.children.length > 0 ? (
            <optgroup key={root.id} label={root.name}>
              <option value={root.id}>Вся «{root.name}»</option>
              {root.children.map((child) => (
                <option key={child.id} value={child.id}>
                  {child.name}
                </option>
              ))}
            </optgroup>
          ) : (
            <option key={root.id} value={root.id}>
              {root.name}
            </option>
          ),
        )}
      </select>
      <select
        className={styles.input}
        name="regionId"
        value={regionId}
        onChange={(e) => setRegionId(e.target.value)}
        aria-label="Область"
      >
        <option value="">Вся Беларусь</option>
        {regions.map((r) => (
          <option key={r.id} value={r.id}>
            {r.name}
          </option>
        ))}
      </select>
      <select
        className={styles.input}
        name="localityId"
        defaultValue={defaults.localityId ?? ''}
        aria-label="Город или район"
        key={regionId || 'all'}
      >
        <option value="">{regionId ? 'Все в области' : 'Все города'}</option>
        {filteredLocalities.map((l) => (
          <option key={l.id} value={l.id}>
            {l.name}
          </option>
        ))}
      </select>
      <input
        className={styles.input}
        name="priceMin"
        placeholder="Цена от"
        defaultValue={defaults.priceMin ?? ''}
        inputMode="decimal"
        aria-label="Цена от"
      />
      <input
        className={styles.input}
        name="priceMax"
        placeholder="Цена до"
        defaultValue={defaults.priceMax ?? ''}
        inputMode="decimal"
        aria-label="Цена до"
      />
      <button className={styles.btn} type="submit">
        Найти
      </button>
    </form>
  );
}
