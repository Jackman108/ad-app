import { PrismaClient } from '@prisma/client';
import { categoryTree, type CatNode } from './data/by-categories';
import { localitiesByRegionCode } from './data/by-localities';
import { workCategoryTree, type WorkCatNode } from './data/work-categories';

const prisma = new PrismaClient();

const regions = [
  { code: 1, name: 'Брестская область', slug: 'brestskaya' },
  { code: 2, name: 'Гомельская область', slug: 'gomelskaya' },
  { code: 3, name: 'Гродненская область', slug: 'grodnenskaya' },
  { code: 4, name: 'Могилёвская область', slug: 'mogilevskaya' },
  { code: 5, name: 'Минская область', slug: 'minskaya' },
  { code: 6, name: 'Витебская область', slug: 'vitebskaya' },
  { code: 7, name: 'Минск', slug: 'minsk' },
] as const;

async function seedCategory(node: CatNode, parentId: string | null, sortOrder: number) {
  const row = await prisma.category.upsert({
    where: { slug: node.slug },
    update: {
      name: node.name,
      parentId,
      sortOrder,
      allowsListing: !node.children?.length,
      isActive: true,
    },
    create: {
      name: node.name,
      slug: node.slug,
      parentId,
      sortOrder,
      allowsListing: !node.children?.length,
    },
  });

  if (node.children) {
    for (let i = 0; i < node.children.length; i += 1) {
      await seedCategory(node.children[i], row.id, i);
    }
  }
}

async function main() {
  for (const region of regions) {
    const r = await prisma.region.upsert({
      where: { code: region.code },
      update: { name: region.name, slug: region.slug },
      create: { code: region.code, name: region.name, slug: region.slug },
    });

    const localities = localitiesByRegionCode[region.code] ?? [];
    for (let i = 0; i < localities.length; i += 1) {
      const loc = localities[i];
      await prisma.locality.upsert({
        where: { regionId_slug: { regionId: r.id, slug: loc.slug } },
        update: { name: loc.name, sortOrder: i, isActive: true },
        create: {
          regionId: r.id,
          name: loc.name,
          slug: loc.slug,
          sortOrder: i,
        },
      });
    }
  }

  for (let i = 0; i < categoryTree.length; i += 1) {
    await seedCategory(categoryTree[i], null, i);
  }

  async function seedWorkCategory(node: WorkCatNode, parentId: string | null, sortOrder: number) {
    const row = await prisma.workCategory.upsert({
      where: { slug: node.slug },
      update: {
        name: node.name,
        parentId,
        sortOrder,
        allowsOrder: !node.children?.length,
        isActive: true,
      },
      create: {
        name: node.name,
        slug: node.slug,
        parentId,
        sortOrder,
        allowsOrder: !node.children?.length,
      },
    });
    if (node.children) {
      for (let i = 0; i < node.children.length; i += 1) {
        await seedWorkCategory(node.children[i], row.id, i);
      }
    }
  }

  for (let i = 0; i < workCategoryTree.length; i += 1) {
    await seedWorkCategory(workCategoryTree[i], null, i);
  }

  const minsk = await prisma.region.findUnique({ where: { slug: 'minsk' } });
  const locality = minsk
    ? await prisma.locality.findFirst({
        where: { regionId: minsk.id, isActive: true },
        orderBy: { sortOrder: 'asc' },
      })
    : null;

  if (locality) {
    const org = await prisma.organization.upsert({
      where: { id: 'seed-org-demo-zavhoz' },
      update: { name: 'Демо Кофейня BY', isActive: true },
      create: {
        id: 'seed-org-demo-zavhoz',
        name: 'Демо Кофейня BY',
        unp: '100000000',
      },
    });
    await prisma.site.upsert({
      where: { id: 'seed-site-demo-zavhoz' },
      update: {
        name: 'Точка Немига',
        addressLine: 'ул. Немига, 5',
        localityId: locality.id,
        isActive: true,
      },
      create: {
        id: 'seed-site-demo-zavhoz',
        organizationId: org.id,
        localityId: locality.id,
        name: 'Точка Немига',
        addressLine: 'ул. Немига, 5',
      },
    });
  }

  console.log('Seed OK: regions, localities, listing categories, work categories, demo Org/Site');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
