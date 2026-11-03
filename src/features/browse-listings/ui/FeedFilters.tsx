'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { CategoryRow } from '@/entities/category/model/tree';
import { buildCategoryTree } from '@/entities/category/model/tree';
import styles from './feed-filters.module.css';

type Region = { id: string; name: string };
type Locality = { id: string; name: string; regionId: string };

type Defaults = {
  q?: string;
  categoryId?: string;
  regionId?: string;
  localityId?: string;
  priceMin?: string;
  priceMax?: string;
  condition?: string;
  hasPhoto?: string;
  sort?: string;
};

type Props = {
  categories: CategoryRow[];
  regions: Region[];
  localities: Locality[];
  defaults: Defaults;
  totalCount: number;
};

function hasActiveFilters(d: Defaults): boolean {
  return Boolean(
    d.q ||
      d.categoryId ||
      d.regionId ||
      d.localityId ||
      d.priceMin ||
      d.priceMax ||
      d.condition ||
      d.hasPhoto === '1' ||
      d.hasPhoto === 'true' ||
      (d.sort && d.sort !== 'new'),
  );
}

export function FeedFilters({ categories, regions, localities, defaults, totalCount }: Props) {
  const tree = useMemo(() => buildCategoryTree(categories), [categories]);
  const [regionId, setRegionId] = useState(defaults.regionId ?? '');
  const filteredLocalities = useMemo(
    () => (regionId ? localities.filter((l) => l.regionId === regionId) : localities),
    [localities, regionId],
  );
  const active = hasActiveFilters(defaults);

  return (
    <div className={styles.wrap}>
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
        <select
          className={styles.input}
          name="condition"
          defaultValue={defaults.condition ?? ''}
          aria-label="Состояние"
        >
          <option value="">Любое состояние</option>
          <option value="NEW">Новое</option>
          <option value="USED">Б/у</option>
          <option value="FOR_PARTS">На запчасти</option>
          <option value="NOT_APPLICABLE">Не применимо</option>
        </select>
        <select
          className={styles.input}
          name="sort"
          defaultValue={defaults.sort ?? 'new'}
          aria-label="Сортировка"
        >
          <option value="new">Сначала новые</option>
          <option value="priceAsc">Цена ↑</option>
          <option value="priceDesc">Цена ↓</option>
        </select>
        <label className={styles.check}>
          <input
            type="checkbox"
            name="hasPhoto"
            value="1"
            defaultChecked={defaults.hasPhoto === '1' || defaults.hasPhoto === 'true'}
          />
          Только с фото
        </label>
        <div className={styles.actions}>
          <button className={styles.btn} type="submit">
            Найти
          </button>
          {active ? (
            <Link className={styles.reset} href="/">
              Сбросить
            </Link>
          ) : null}
        </div>
      </form>
      <p className={styles.count} data-testid="feed-count">
        Найдено {totalCount}
      </p>
    </div>
  );
}
