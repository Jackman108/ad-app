# ADR 0001 — Базовый стек Ad App

**Обновлено**: 03.11.2026

## Статус

Принято.

## Контекст

Нужно приложение объявлений от частных лиц с CRUD, поиском, фото и auth. Репозиторий пустой. На машине: Node 24, Yarn 1.22, Docker. В портфеле уже есть Next.js + FSD + ADR (лендинги) и опыт Nest+Prisma — для MVP выгоднее один fullstack-контур.

Владелец подтвердил регион MVP = РБ и временный деплой на тот же VPS, что lendings. UI: выбран вариант CSS Modules + design tokens (см. ниже). Auth-провайдеры — [ADR 0002](0002-auth-and-contact.md).

## Решение

| Слой | Выбор |
| --- | --- |
| Runtime | Node.js `>=24.14.1 <25` |
| Пакеты | Yarn Classic `1.22.22` |
| App | Next.js (App Router) + TypeScript |
| Структура | FSD под `src/` |
| БД | PostgreSQL (Docker Compose локально) |
| ORM | Prisma |
| Валидация | Zod |
| Auth | Better Auth + провайдеры из ADR 0002 |
| Стили | **CSS Modules + design tokens** (`shared/ui` + `tokens.css`) |
| Тесты | Vitest по мере нужды + Playwright smoke |
| Деплой | Docker → **тот же VPS, что lendings** (временно; вынос — отдельный ADR) |

### Почему CSS Modules + tokens, а не Tailwind 4

- Совпадает с каноном premier-design после отказа от Panda/Tailwind — меньше дрейфа правил между репо.
- Продукт с брендом и «не-AI» UI: токены и модули лучше держат типографику/атмосферу, чем utility-first по умолчанию.
- Формы и лента объявлений не требуют Tailwind ради скорости на старте; UI-kit в `shared/ui` переиспользуется точечно.
- Один стандарт стилей — без смеси Tailwind + Modules.

Явно отложить: отдельный Nest-бэкенд, Redis, очереди, отдельный search-engine, monorepo packages, отдельный хост деплоя.

## Последствия

Плюсы: быстрый fullstack-цикл, привычный FSD, контролируемый визуал.

Минусы: больше ручной работы над UI-kit, чем с Tailwind; Telegram/phone auth усложняют MVP (ADR 0002).

## Проверка готовности

- [x] Статус «Принято»
- [x] UI зафиксирован
- [x] Auth-направление в ADR 0002
- [ ] Scaffold `package.json` + `prisma` + `docker-compose`
