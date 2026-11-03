export type WorkCatNode = {
  name: string;
  slug: string;
  children?: WorkCatNode[];
};

/** Категории работ Завхоз (MVP). */
export const workCategoryTree: WorkCatNode[] = [
  {
    name: 'Сантехника',
    slug: 'plumbing',
    children: [
      { name: 'Смесители и сифоны', slug: 'plumbing-faucets' },
      { name: 'Засоры и прочистка', slug: 'plumbing-clogs' },
      { name: 'Унитазы и бачки', slug: 'plumbing-toilets' },
    ],
  },
  {
    name: 'Электрика',
    slug: 'electrical',
    children: [
      { name: 'Розетки и выключатели', slug: 'electrical-outlets' },
      { name: 'Автоматы и щиты', slug: 'electrical-breakers' },
      { name: 'Освещение', slug: 'electrical-lighting' },
    ],
  },
  {
    name: 'Двери и замки',
    slug: 'doors-locks',
    children: [
      { name: 'Регулировка дверей', slug: 'doors-adjust' },
      { name: 'Замки и доводчики', slug: 'doors-locks-fix' },
    ],
  },
  {
    name: 'Мебель и фурнитура',
    slug: 'furniture',
    children: [
      { name: 'Петли и ручки', slug: 'furniture-hinges' },
      { name: 'Сборка/крепёж', slug: 'furniture-fix' },
    ],
  },
  {
    name: 'Отделка и мелочи',
    slug: 'finishing',
    children: [
      { name: 'Плинтусы и наличники', slug: 'finishing-baseboards' },
      { name: 'Стекло и витрины', slug: 'finishing-glass' },
      { name: 'Муж на час (прочее)', slug: 'finishing-handyman' },
    ],
  },
];
