export type CatNode = { name: string; slug: string; children?: CatNode[] };

/** Дерево категорий MVP+ (лист = allowsListing). */
export const categoryTree: CatNode[] = [
  {
    name: 'Недвижимость',
    slug: 'nedvizhimost',
    children: [
      { name: 'Квартиры', slug: 'kvartiry' },
      { name: 'Дома и дачи', slug: 'doma-dachi' },
      { name: 'Участки', slug: 'uchastki' },
      { name: 'Гаражи и стоянки', slug: 'garazhi' },
      { name: 'Комнаты', slug: 'komnaty' },
    ],
  },
  {
    name: 'Авто и транспорт',
    slug: 'avto',
    children: [
      { name: 'Легковые', slug: 'legkovye' },
      { name: 'Грузовики и автобусы', slug: 'gruzoviki' },
      { name: 'Мото', slug: 'moto' },
      { name: 'Запчасти', slug: 'zapchasti' },
      { name: 'Шины и диски', slug: 'shiny-diski' },
    ],
  },
  {
    name: 'Техника',
    slug: 'tehnika',
    children: [
      { name: 'Телефоны', slug: 'telefony' },
      { name: 'Планшеты и электронные книги', slug: 'planshety' },
      { name: 'Компьютеры', slug: 'kompyutery' },
      { name: 'Ноутбуки', slug: 'noutbuki' },
      { name: 'ТВ и видео', slug: 'tv-video' },
      { name: 'Бытовая техника', slug: 'bytovaya' },
    ],
  },
  {
    name: 'Для дома',
    slug: 'dom',
    children: [
      { name: 'Мебель', slug: 'mebel' },
      { name: 'Посуда', slug: 'posuda' },
      { name: 'Ремонт и стройка', slug: 'remont' },
      { name: 'Сад и огород', slug: 'sad' },
    ],
  },
  {
    name: 'Мода',
    slug: 'moda',
    children: [
      { name: 'Женская одежда', slug: 'zhenskaya' },
      { name: 'Мужская одежда', slug: 'muzhskaya' },
      { name: 'Детская одежда', slug: 'detskaya-odezhda' },
      { name: 'Обувь', slug: 'obuv' },
      { name: 'Аксессуары', slug: 'aksessuary' },
    ],
  },
  {
    name: 'Детям',
    slug: 'detyam',
    children: [
      { name: 'Коляски', slug: 'kolyaski' },
      { name: 'Игрушки', slug: 'igrushki' },
      { name: 'Детская мебель', slug: 'detskaya-mebel' },
    ],
  },
  {
    name: 'Хобби и спорт',
    slug: 'hobbi',
    children: [
      { name: 'Спорттовары', slug: 'sport' },
      { name: 'Велосипеды', slug: 'velosipedy' },
      { name: 'Охота и рыбалка', slug: 'ohota' },
      { name: 'Книги и журналы', slug: 'knigi' },
    ],
  },
  {
    name: 'Животные',
    slug: 'zhivotnye',
    children: [
      { name: 'Собаки', slug: 'sobaki' },
      { name: 'Кошки', slug: 'koshki' },
      { name: 'Другие животные', slug: 'drugie-zhivotnye' },
      { name: 'Товары для животных', slug: 'tovary-zhivotnye' },
    ],
  },
  { name: 'Другое', slug: 'drugoe' },
];
