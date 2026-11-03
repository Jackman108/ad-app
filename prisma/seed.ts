import { PrismaClient } from '@prisma/client';

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

/** Ключевые города/районы для MVP (не полный справочник Kufar). */
const localitiesByRegion: Record<number, { name: string; slug: string }[]> = {
  1: [
    { name: 'Брест', slug: 'brest' },
    { name: 'Барановичи', slug: 'baranovichi' },
    { name: 'Пинск', slug: 'pinsk' },
  ],
  2: [
    { name: 'Гомель', slug: 'gomel' },
    { name: 'Мозырь', slug: 'mozyr' },
    { name: 'Жлобин', slug: 'zhlobin' },
  ],
  3: [
    { name: 'Гродно', slug: 'grodno' },
    { name: 'Лида', slug: 'lida' },
    { name: 'Слоним', slug: 'slonim' },
  ],
  4: [
    { name: 'Могилёв', slug: 'mogilev' },
    { name: 'Бобруйск', slug: 'bobruisk' },
    { name: 'Орша', slug: 'orsha-mogilev' },
  ],
  5: [
    { name: 'Борисов', slug: 'borisov' },
    { name: 'Солигорск', slug: 'soligorsk' },
    { name: 'Молодечно', slug: 'molodechno' },
  ],
  6: [
    { name: 'Витебск', slug: 'vitebsk' },
    { name: 'Орша', slug: 'orsha' },
    { name: 'Полоцк', slug: 'polotsk' },
  ],
  7: [
    { name: 'Центральный', slug: 'centralny' },
    { name: 'Советский', slug: 'sovetsky' },
    { name: 'Первомайский', slug: 'pervomaysky' },
    { name: 'Партизанский', slug: 'partizansky' },
    { name: 'Заводской', slug: 'zavodskoy' },
    { name: 'Ленинский', slug: 'leninsky' },
    { name: 'Октябрьский', slug: 'oktyabrsky' },
    { name: 'Московский', slug: 'moskovsky' },
    { name: 'Фрунзенский', slug: 'frunzensky' },
  ],
};

type CatNode = { name: string; slug: string; children?: CatNode[] };

const categoryTree: CatNode[] = [
  {
    name: 'Недвижимость',
    slug: 'nedvizhimost',
    children: [
      { name: 'Квартиры', slug: 'kvartiry' },
      { name: 'Дома и дачи', slug: 'doma-dachi' },
      { name: 'Участки', slug: 'uchastki' },
    ],
  },
  {
    name: 'Авто и транспорт',
    slug: 'avto',
    children: [
      { name: 'Легковые', slug: 'legkovye' },
      { name: 'Запчасти', slug: 'zapchasti' },
      { name: 'Шины и диски', slug: 'shiny-diski' },
    ],
  },
  {
    name: 'Техника',
    slug: 'tehnika',
    children: [
      { name: 'Телефоны', slug: 'telefony' },
      { name: 'Компьютеры', slug: 'kompyutery' },
      { name: 'Бытовая техника', slug: 'bytovaya' },
    ],
  },
  {
    name: 'Для дома',
    slug: 'dom',
    children: [
      { name: 'Мебель', slug: 'mebel' },
      { name: 'Посуда', slug: 'posuda' },
    ],
  },
  {
    name: 'Мода',
    slug: 'moda',
    children: [
      { name: 'Женская одежда', slug: 'zhenskaya' },
      { name: 'Мужская одежда', slug: 'muzhskaya' },
    ],
  },
  { name: 'Другое', slug: 'drugoe' },
];

async function seedCategory(node: CatNode, parentId: string | null, sortOrder: number) {
  const row = await prisma.category.upsert({
    where: { slug: node.slug },
    update: {
      name: node.name,
      parentId,
      sortOrder,
      allowsListing: !node.children?.length,
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

    const localities = localitiesByRegion[region.code] ?? [];
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

  console.log('Seed OK: regions, localities, categories');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
