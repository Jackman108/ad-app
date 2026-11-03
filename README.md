# Ad App

Приложение для **публикации объявлений от частных лиц** (MVP: Республика Беларусь).

Рабочая папка: `C:\Users\user\Documents\ad app project`

## Статус

Стек/auth/домен зафиксированы (ADR 0001–0003). **Scaffold фазы 0:** Next.js + Prisma + Postgres (Docker), стартовая страница, git init.

## Стек (кратко)

Next.js App Router · TypeScript · FSD · Prisma · PostgreSQL · Better Auth · CSS Modules + tokens · Yarn 1.22 · Docker → VPS lendings (временно).

## Документация

| Документ | Содержание |
| --- | --- |
| [docs/README.md](docs/README.md) | Индекс |
| [docs/guides/architecture-ru.md](docs/guides/architecture-ru.md) | Архитектура MVP |
| [docs/adr/0001-core-stack.md](docs/adr/0001-core-stack.md) | Стек и UI |
| [docs/adr/0002-auth-and-contact.md](docs/adr/0002-auth-and-contact.md) | Auth и контакт |
| [docs/guides/domain-model-ru.md](docs/guides/domain-model-ru.md) | Сущности / схема домена |

## MVP

- Только Беларусь
- Вход: email+пароль, телефон (OTP), Google, Telegram
- Объявления: создание, лента, карточка, фильтры по городам РБ
- Контакт: in-app переписка; телефон автора — только после входа

