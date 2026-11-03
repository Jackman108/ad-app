# Окружение и инструменты разработки

**Обновлено**: 03.11.2026

## Цель

Минимальный, повторяемый toolchain для fullstack-приложения объявлений: локальная разработка на Windows, удалённые команды с телефона (Tailscale), деплой на VPS (временно без домена).

## Что уже есть на машине (снимок 03.11.2026)

| Инструмент | Версия / факт | Вердикт |
| --- | --- | --- |
| Node.js | `v24.14.1` | Ок — пинить `engines.node` как в лендингах (`>=24.14.1 <25`) |
| npm | `11.11.0` | Есть; lockfile сейчас `package-lock.json` (Yarn — канон `packageManager`) |
| Yarn Classic | `1.22.22` | **Канон** пакета (`packageManager`) |
| pnpm | нет | Не вводить без явной нужды |
| Docker | `29.2.1` | Ок — Postgres (и app на VPS) через Compose |
| Git | `2.50.1` | Ок |
| Python | 3.13 / 3.14 | Не нужен для MVP приложения |
| Cursor / VS Code | установлены | Cursor — основной IDE |

## Рекомендуемый стек инструментов

### Обязательно

1. **Cursor** — код, агент, rules, docs
2. **Node 24 + Yarn 1.22.22** — единый runtime/пакетный менеджер
3. **Docker Desktop** — PostgreSQL локально (`docker compose up -d db` / `npm run db:up`)
4. **Git** — история; remote — по запросу (Origin/GitHub)

### Желательно — подключено

| Инструмент | Зачем | Как |
| --- | --- | --- |
| Prisma Studio | схема и данные без SQL | `npm run db:studio` → http://localhost:5555 |
| MCP Prisma (Cursor) | то же из чата агента | плагин Prisma → один раз `mcp_auth` в Cursor |
| ESLint + `tsc --noEmit` | гейты качества | `npm run check` (= lint + typecheck) |
| Playwright smoke | лента, карточка, создание | `npm run test:e2e` (DB + `.env`; канал `chrome` локально; полный chromium — `test:e2e:install`) |
| Husky + commitlint | Conventional Commits | hooks: `pre-commit` (lint-staged + typecheck), `commit-msg` |

### Не тащить в MVP

- pnpm / Bun как второй менеджер
- отдельный Nest/Express monorepo «на вырост»
- Kubernetes / тяжёлый k8s-локал
- Redis/очереди — только когда появится реальная нагрузка (модерация, почта, превью)

## Локальный контур (целевой)

```text
Windows host
├── Cursor (редактор + агент)
├── npm run dev / yarn dev  → Next.js :3000
├── docker compose          → Postgres :5432
├── npm run db:studio       → Prisma Studio :5555
└── Tailscale               → команды с телефона на тот же workspace
```

Переменные окружения: `.env` (в gitignore) + `.env.example` (без секретов).

### Быстрые команды качества

```bash
npm run check          # eslint (next lint) + tsc --noEmit
npm run test:e2e       # Playwright smoke (e2e/smoke.spec.ts)
npm run db:studio      # GUI по таблицам
```

Коммиты: `feat:`, `fix:`, `docs:`, `chore:`… — header ≤ 150 символов (`commitlint.config.mjs`).  
После логического завершения задачи/фичи/fixа — **commit + push** ([git-workflow-ru.md](git-workflow-ru.md)).

## Согласование с прошлыми проектами

Ориентиры: `lendings/febcode`, `lendings/premier-design` — Node 24, Yarn 1.22, Next App Router, FSD, ADR, `.cursor/rules`, Husky + commitlint.

Ad App — **продукт**, не лендинг: меньше маркетингового шума в docs, больше доменных сущностей (user, listing, category, media).

## Чеклист готовности

- [x] ADR 0001–0003 приняты
- [x] `docker compose` + scaffold (Next, Prisma, лента)
- [x] Quality gates: ESLint, typecheck, Playwright smoke, Husky+commitlint, Prisma Studio
- [ ] SMS-провайдер BY и OAuth credentials — до интеграции auth S1.4–S1.5
- [ ] MCP Prisma: завершить auth плагина в Cursor (по запросу)
