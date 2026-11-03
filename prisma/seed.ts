import { PrismaClient } from '@prisma/client';
import { categoryTree, type CatNode } from './data/by-categories';
import { localitiesByRegionCode } from './data/by-localities';

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

  console.log('Seed OK: regions, localities (BY), categories tree');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
