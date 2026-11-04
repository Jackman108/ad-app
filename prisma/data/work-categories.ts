export type WorkCatNode = {
  name: string;
  slug: string;
  /** Копейки BYN; только для листьев (allowsOrder). */
  basePriceMinor?: number;
  children?: WorkCatNode[];
};

/** Категории работ Завхоз (MVP) + ориентировочный прайс. */
export const workCategoryTree: WorkCatNode[] = [
  {
    name: 'Сантехника',
    slug: 'plumbing',
    children: [
      { name: 'Смесители и сифоны', slug: 'plumbing-faucets', basePriceMinor: 4500 },
      { name: 'Засоры и прочистка', slug: 'plumbing-clogs', basePriceMinor: 5500 },
      { name: 'Унитазы и бачки', slug: 'plumbing-toilets', basePriceMinor: 7000 },
    ],
  },
  {
    name: 'Электрика',
    slug: 'electrical',
    children: [
      { name: 'Розетки и выключатели', slug: 'electrical-outlets', basePriceMinor: 4000 },
      { name: 'Автоматы и щиты', slug: 'electrical-breakers', basePriceMinor: 8000 },
      { name: 'Освещение', slug: 'electrical-lighting', basePriceMinor: 5000 },
    ],
  },
  {
    name: 'Двери и замки',
    slug: 'doors-locks',
    children: [
      { name: 'Регулировка дверей', slug: 'doors-adjust', basePriceMinor: 3500 },
      { name: 'Замки и доводчики', slug: 'doors-locks-fix', basePriceMinor: 6000 },
    ],
  },
  {
    name: 'Мебель и фурнитура',
    slug: 'furniture',
    children: [
      { name: 'Петли и ручки', slug: 'furniture-hinges', basePriceMinor: 3000 },
      { name: 'Сборка/крепёж', slug: 'furniture-fix', basePriceMinor: 4500 },
    ],
  },
  {
    name: 'Отделка и мелочи',
    slug: 'finishing',
    children: [
      { name: 'Плинтусы и наличники', slug: 'finishing-baseboards', basePriceMinor: 4000 },
      { name: 'Стекло и витрины', slug: 'finishing-glass', basePriceMinor: 6500 },
      { name: 'Муж на час (прочее)', slug: 'finishing-handyman', basePriceMinor: 5000 },
    ],
  },
];
