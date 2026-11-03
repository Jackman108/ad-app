# Архитектура Ad App

**Обновлено**: 03.11.2026  
Доменные сущности: [domain-model-ru.md](domain-model-ru.md) · [ADR 0003](../adr/0003-domain-model.md).

## Продукт (MVP)

Площадка объявлений **от частных лиц** (регион: **Республика Беларусь**):

1. Регистрация / вход: email, телефон (OTP), Google OAuth, Telegram
2. Создание и редактирование объявления (текст, цена, категория, фото, город РБ)
3. Лента и карточка объявления
4. Поиск / фильтры (категория, цена, город)
5. Контакт: **in-app переписка** («Написать» → тред в приложении); телефон автора — только авторизованным
6. Сделки и договорённости не уводятся в внешние мессенджеры/почту

Вне MVP: платежи, продвижение, realtime (достаточно poll), сложная модерация, native-apps, отдельный хост деплоя, push/email с телом переписки.

## Стиль архитектуры

**Модульный монолит на Next.js App Router** + FSD в `src/`.

Канон стека: [ADR 0001](../adr/0001-core-stack.md) (принято).  
Auth и контакт: [ADR 0002](../adr/0002-auth-and-contact.md) (принято).

## Целевая структура репозитория

```text
ad-app/
├── src/
│   ├── app/                 # Next.js routes (RSC + route handlers)
│   ├── pages-layer/         # композиции экранов (FSD pages)
│   ├── widgets/
│   ├── features/            # create-listing, search, auth-ui, contact-seller, …
│   ├── entities/            # user, listing, category, location, conversation, …
│   └── shared/              # ui (CSS Modules), tokens, lib, config
├── prisma/
├── public/
├── docs/
├── .cursor/rules/
├── docker-compose.yml
├── package.json             # yarn@1.22.22
└── README.md
```

Зависимости только «вниз»: app → pages-layer → widgets → features → entities → shared.

## Доменная модель

Канон (поля, FSM, MVP vs фаза 2, анти-модель): **[domain-model-ru.md](domain-model-ru.md)**.

Кратко MVP: `User`, `Category`, `Region`, `Locality`, `Listing`, `ListingImage`, `Conversation`, `Message`, `Favorite`, `Report` (+ Better Auth).

## Auth, контакт, медиа

- Сессии: Better Auth; email+пароль; политика контакта/переписки — ADR 0002
- Переписка только в приложении; внешние каналы не несут текст сделки
- Медиа: server action → диск (dev) / S3-совместимое (prod); в БД метаданные
- Поиск: Postgres + индексы; внешний search — позже
- UI: CSS Modules + `tokens.css` в `shared`

## Безопасность (минимум)

- Same-origin mutations
- Zod на границах
- Rate limit: OTP, login, create listing, message
- Телефон автора не отдавать гостям (API + UI)
- Секреты только в `.env`

## Деплой

Временно — тот же VPS-контур, что lendings (Docker). Вынос на отдельный хост — новый ADR.

## Документация и процесс

- Решения → `docs/adr/`
- После задач → `docs/changelog.md` `[Unreleased]`
- Rules → `.cursor/rules/` (ссылки, без копипасты гайдов)

## Открытые вопросы (остаток)

1. SMS-провайдер для OTP в РБ
2. SMTP для писем сброса пароля (провайдер)
3. Нужен ли в v1 лёгкий notify «новое сообщение» (без текста) или только badge в приложении
