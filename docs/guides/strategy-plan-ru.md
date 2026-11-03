# Стратегический план Ad App

**Обновлено**: 03.11.2026  
**Статус**: рабочий план после фиксации ADR 0001–0003

## Цель продукта

Площадка объявлений **только для частных лиц в Беларуси**: публикация, поиск, in-app сделки (переписка), контактный телефон после входа. Без увода диалога в мессенджеры.

## Уже принято (не пересматриваем без ADR)

| # | Решение |
| --- | --- |
| Стек | Next.js App Router, TS, FSD, Prisma, Postgres, Yarn 1.22, Node 24 |
| UI | CSS Modules + design tokens |
| Auth | email+пароль, phone OTP, Google, Telegram (Better Auth) |
| Контакт | «Написать» in-app; телефон — только авторизованным |
| Домен | [domain-model-ru.md](domain-model-ru.md) · ADR 0003 |
| Деплой | временно VPS lendings |

## Принципы исполнения

1. **Сначала инварианты домена**, потом UI-красота  
2. **YAGNI** — фаза 2 (платежи, reviews, EAV) не в первой миграции  
3. **Безопасность с дня 1** — DTO Public/Contact/Owner, rate limit, soft delete  
4. **Clean Architecture в монолите** — use-case → порты → Prisma/Auth  
5. Документация и rules обновляются вместе с решениями  

## Фазы

### Фаза 0 — Фундамент (сейчас → scaffold)

- [x] Окружение, ADR стека/auth/домена, Cursor rules  
- [x] Канон сущностей MVP  
- [x] Scaffold: `package.json`, Next, ESLint, docker-compose Postgres, Prisma по domain-model  
- [x] Сиды: Region/Locality РБ, базовое дерево Category  
- [x] `.env.example` (без секретов): DB, Better Auth stubs  

**Критерий готовности:** `next build` ок; Postgres + migrate + seed; пустая лента на `/`.

### Фаза 1 — Identity и профиль

- [x] Better Auth: email+пароль, `/login` `/register`, session на главной  
- [ ] reset link (SMTP)  
- [ ] Google OAuth, Telegram login  
- [ ] Phone OTP (SMS-провайдер BY — выбрать)  
- [ ] Профиль: verified phone, avatar  
- [ ] ACL: гость / user / admin (база сессии есть)  

**Критерий:** вход email+пароль локально; остальные каналы — по секретам.

### Фаза 2 — Объявления (ядро рынка)

- CRUD Listing + FSM (draft→published→…→sold/archived)  
- ListingImage upload (local disk → S3 later)  
- Категории + locality на форме  
- Лента, карточка, фильтры (категория, цена, город)  
- Публичные DTO без телефона  

**Критерий:** частник публикует объявление; гость видит ленту/карточку без телефона.

### Фаза 3 — Сделки внутри приложения

- Conversation UNIQUE(listing, buyer)  
- Message inbox (poll)  
- «Написать» только auth; телефон на карточке только auth  
- Report (жалоба) минимум  

**Критерий:** два тестовых юзера ведут переписку только в UI; сделка не уходит в TG/email.

### Фаза 4 — Качество и деплой

- Playwright smoke: login, create listing, message  
- Rate limits, базовый CSP  
- Docker image → VPS lendings (временно)  
- Мониторинг/логи минимум  

**Критерий:** смоук зелёный; превью на VPS.

### Фаза 5+ (после product-market сигнала)

Notification badge · избранное в UI · жёсткие category attributes · модерация · вынос с shared VPS · платежи/продвижение.

## Порядок ближайших шагов (исполнение)

1. Scaffold репозитория по ADR 0001 + Prisma по ADR 0003  
2. Auth email+пароль (остальные провайдеры следом)  
3. Listing + images + лента  
4. Conversation/Message + политика телефона  
5. Сиды РБ + smoke + деплой  

## Риски

| Риск | Митигация |
| --- | --- |
| SMS/OAuth credentials задерживают auth | Сначала email+пароль; stubs для phone/OAuth |
| Shared VPS шумный | Изолированный compose/сервис; ADR на вынос позже |
| Scope creep (как у Kufar) | Строго MVP-сущности; новое — ADR |
| Inbox с телефона «теряется» | Loop привязан к **этому** чату Ad App |

## Каналы управления

- Этот чат Cursor — основная разработка  
- Phone mesh inbox (`Pop-AgentInbox.ps1`) — короткие команды с телефона, цикл **5 мин** (2 мин давали шум пустых тиков)  
- Docs/ADR — источник правды, не чат-история  

## Открытые внешние зависимости

1. SMS-провайдер РБ  
2. SMTP для reset пароля  
3. Google OAuth client + Telegram bot  
4. Нужен ли notify «новое сообщение» без текста в v1  
