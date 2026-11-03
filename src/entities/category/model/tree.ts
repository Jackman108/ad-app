export type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  allowsListing: boolean;
  sortOrder: number;
};

export type CategoryTreeNode = CategoryRow & { children: CategoryTreeNode[] };

/** Плоский список → дерево (корни parentId=null). */
export function buildCategoryTree(rows: CategoryRow[]): CategoryTreeNode[] {
  const byId = new Map<string, CategoryTreeNode>();
  for (const row of rows) {
    byId.set(row.id, { ...row, children: [] });
  }
  const roots: CategoryTreeNode[] = [];
  for (const node of byId.values()) {
    if (node.parentId && byId.has(node.parentId)) {
      byId.get(node.parentId)!.children.push(node);
    } else {
      roots.push(node);
    }
  }
  const sortRec = (nodes: CategoryTreeNode[]) => {
    nodes.sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name, 'ru'));
    for (const n of nodes) sortRec(n.children);
  };
  sortRec(roots);
  return roots;
}

/** Id выбранной категории + все потомки (для фильтра ленты). */
export function collectCategoryIds(rows: CategoryRow[], selectedId: string): string[] {
  const childrenOf = new Map<string, string[]>();
  for (const row of rows) {
    if (!row.parentId) continue;
    const list = childrenOf.get(row.parentId) ?? [];
    list.push(row.id);
    childrenOf.set(row.parentId, list);
  }
  const out: string[] = [];
  const stack = [selectedId];
  while (stack.length) {
    const id = stack.pop()!;
    out.push(id);
    const kids = childrenOf.get(id);
    if (kids) stack.push(...kids);
  }
  return out;
}

export function listingCategories(rows: CategoryRow[]): CategoryRow[] {
  return rows.filter((r) => r.allowsListing);
}
