# Окружение и инструменты разработки

**Обновлено**: 03.11.2026

## Цель

Минимальный, повторяемый toolchain для fullstack-приложения объявлений: локальная разработка на Windows, удалённые команды с телефона (Tailscale), деплой на VPS позже.

## Что уже есть на машине (снимок 03.11.2026)

| Инструмент | Версия / факт | Вердикт |
| --- | --- | --- |
| Node.js | `v24.14.1` | Ок — пинить `engines.node` как в лендингах (`>=24.14.1 <25`) |
| npm | `11.11.0` | Есть, но **не основной** менеджер |
| Yarn Classic | `1.22.22` | **Канон** пакета (`packageManager`) |
| pnpm | нет | Не вводить без явной нужды |
| Docker | `29.2.1` | Ок — Postgres (и позже app) через Compose |
| Git | `2.50.1` | Ок |
| Python | 3.13 / 3.14 | Не нужен для MVP приложения |
| Cursor / VS Code | установлены | Cursor — основной IDE |

## Рекомендуемый стек инструментов

### Обязательно

1. **Cursor** — код, агент, rules, docs
2. **Node 24 + Yarn 1.22.22** — единый runtime/пакетный менеджер
3. **Docker Desktop** — PostgreSQL локально (`docker compose up -d db`)
4. **Git** — история; remote — по запросу (Origin/GitHub)

### Желательно (после scaffold)

| Инструмент | Зачем |
| --- | --- |
| Prisma Studio / MCP Prisma | схема и данные без SQL-рутины |
| ESLint + TypeScript (`tsc --noEmit`) | гейты качества |
| Playwright (smoke) | критичные сценарии: лента, карточка, создание объявления |
| Husky + commitlint | Conventional Commits, как в лендингах |

### Не тащить в MVP

- pnpm / Bun как второй менеджер
- отдельный Nest/Express monorepo «на вырост»
- Kubernetes / тяжёлый k8s-локал
- Redis/очереди — только когда появится реальная нагрузка (модерация, почта, превью)

## Локальный контур (целевой)

```text
Windows host
├── Cursor (редактор + агент)
├── yarn dev          → Next.js :3000
├── docker compose    → Postgres :5432
└── Tailscale         → команды с телефона на тот же workspace
```

Переменные окружения: `.env` (в gitignore) + `.env.example` (без секретов).

## Согласование с прошлыми проектами

Ориентиры: `lendings/febcode`, `lendings/premier-design` — Node 24, Yarn 1.22, Next App Router, FSD, ADR, `.cursor/rules`.

Ad App — **продукт**, не лендинг: меньше маркетингового шума в docs, больше доменных сущностей (user, listing, category, media). Rule pack и ADR — **урезанный** старт, расширяем по факту решений.

## Чеклист готовности к scaffold

- [x] ADR 0001 принят (стек, CSS Modules + tokens, VPS lendings)
- [x] ADR 0002 принят (email + phone + Google + Telegram; телефон только авторизованным)
- [x] Регион MVP = РБ
- [x] `docker compose` + scaffold кода (Next, Prisma schema, стартовая страница)
- [ ] SMS-провайдер BY и OAuth credentials — до интеграции auth
- [ ] Сиды Region/Locality/Category; Better Auth wire-up
