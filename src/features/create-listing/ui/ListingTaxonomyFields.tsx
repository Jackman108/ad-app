'use client';

import { useMemo, useState } from 'react';
import type { CategoryRow } from '@/entities/category/model/tree';
import { buildCategoryTree } from '@/entities/category/model/tree';
import styles from './create-listing-form.module.css';

type Region = { id: string; name: string };
type Locality = { id: string; name: string; regionId: string };

type Props = {
  categories: CategoryRow[];
  regions: Region[];
  localities: Locality[];
  defaultCategoryId?: string;
  defaultLocalityId?: string;
};

/** Cascade: категория (лист) + область → населённый пункт. */
export function ListingTaxonomyFields({
  categories,
  regions,
  localities,
  defaultCategoryId = '',
  defaultLocalityId = '',
}: Props) {
  const tree = useMemo(() => buildCategoryTree(categories), [categories]);
  const leaves = useMemo(() => categories.filter((c) => c.allowsListing), [categories]);

  const defaultLocality = localities.find((l) => l.id === defaultLocalityId);
  const [regionId, setRegionId] = useState(defaultLocality?.regionId ?? '');
  const filtered = useMemo(
    () => (regionId ? localities.filter((l) => l.regionId === regionId) : []),
    [localities, regionId],
  );

  return (
    <>
      <label className={styles.label}>
        Категория
        <select className={styles.input} name="categoryId" required defaultValue={defaultCategoryId}>
          <option value="" disabled>
            Выберите
          </option>
          {tree.map((root) =>
            root.children.length > 0 ? (
              <optgroup key={root.id} label={root.name}>
                {root.children
                  .filter((c) => c.allowsListing || leaves.some((l) => l.id === c.id))
                  .map((child) => (
                    <option key={child.id} value={child.id}>
                      {child.name}
                    </option>
                  ))}
              </optgroup>
            ) : root.allowsListing ? (
              <option key={root.id} value={root.id}>
                {root.name}
              </option>
            ) : null,
          )}
        </select>
      </label>
      <label className={styles.label}>
        Область
        <select
          className={styles.input}
          value={regionId}
          onChange={(e) => setRegionId(e.target.value)}
          required
          data-testid="listing-region"
        >
          <option value="" disabled>
            Выберите
          </option>
          {regions.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>
      </label>
      <label className={styles.label}>
        Населённый пункт
        <select
          className={styles.input}
          name="localityId"
          required
          defaultValue={defaultLocalityId}
          disabled={!regionId}
          key={regionId || 'none'}
          data-testid="listing-locality"
        >
          <option value="" disabled>
            {regionId ? 'Выберите' : 'Сначала выберите регион'}
          </option>
          {filtered.map((l) => (
            <option key={l.id} value={l.id}>
              {l.name}
            </option>
          ))}
        </select>
      </label>
    </>
  );
}
