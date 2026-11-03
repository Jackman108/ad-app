# Карта разработки Ad App (спринты → рабочий MVP)

**Обновлено**: 03.11.2026  
**Цель «готово»:** локально (и желательно на VPS) частник регистрируется, публикует объявление с фото, другой юзер видит ленту/карточку, пишет in-app, видит телефон после входа.

Канон продукта: [strategy-plan-ru.md](strategy-plan-ru.md) · [domain-model-ru.md](domain-model-ru.md) · ADR 0001–0003.

```text
[S0 Foundation]──►[S1 Auth email]──►[S2 Listings CRUD]
                                           │
                                           ▼
[S5 Smoke+Deploy]◄──[S4 In-app deals]◄──[S3 Feed+Images+Filters]
```

---

## S0 — Foundation ✅

| # | Задача | Статус |
| --- | --- | --- |
| S0.1 | Docs, ADR, Cursor rules | ✅ |
| S0.2 | Next + TS + CSS Modules scaffold | ✅ |
| S0.3 | Docker Postgres + Prisma schema MVP | ✅ |
| S0.4 | Сиды Region/Locality/Category РБ | ✅ |
| S0.5 | Главная со статистикой | ✅ |

**Exit:** `next build`, БД, сиды.

---

## S1 — Identity (email) ✅ / 🟡

| # | Задача | Статус |
| --- | --- | --- |
| S1.1 | Better Auth + Prisma session/account | ✅ |
| S1.2 | `/register`, `/login`, сессия на главной | ✅ |
| S1.3 | Sign-out на UI | ⬜ сейчас |
| S1.4 | Reset password (SMTP) | ⏸ внешний SMTP |
| S1.5 | Google / Telegram / phone OTP | ⏸ секреты |

**Exit для движения дальше:** email+пароль работает (уже). OAuth/SMS — параллельно, не блокируют S2.

---

## S2 — Listings CRUD ⬅️ текущий

| # | Задача | Статус |
| --- | --- | --- |
| S2.1 | DTO Public / Contact (без телефона в public) | ✅ |
| S2.2 | Use-case: create+publish (FSM check) | ✅ |
| S2.3 | Форма «Новое объявление» `/listings/new` | ✅ |
| S2.4 | «Мои объявления» + смена статуса (FSM) | ✅ |
| S2.5 | Карточка `/listings/[slug]` (public) | ✅ |
| S2.6 | Guard: только auth создаёт | ✅ |
| S2.7 | Лента published на `/` | ✅ |
| S2.8 | Sign-out | ✅ |

**Exit:** юзер A публикует текст без фото; гость видит карточку **без** телефона.

---

## S3 — Лента, фото, фильтры

| # | Задача | Статус |
| --- | --- | --- |
| S3.1 | Лента `/` (published) | ✅ |
| S3.2 | Фильтры: category, locality, price min/max | ✅ |
| S3.3 | Upload ListingImage (local `uploads/`) | ✅ |
| S3.4 | Обложка на карточке и в ленте | ✅ |
| S3.5 | Поиск по title/description | ✅ |

**Exit:** лента с фильтрами и фото — ✅

---

## S4 — Сделки in-app (рабочее ядро продукта)

| # | Задача | Статус |
| --- | --- | --- |
| S4.1 | Conversation UNIQUE(listing, buyer) | ✅ |
| S4.2 | Message send/list | ✅ |
| S4.3 | Inbox UI + тред `/inbox` | ✅ |
| S4.4 | Телефон автора только для auth | ✅ |
| S4.5 | Report (жалоба) минимум | ✅ |

**Exit:** два юзера переписываются in-app — ✅ (проверь вручную двумя аккаунтами)

---

## S5 — Качество и выкладка

| # | Задача | Статус |
| --- | --- | --- |
| S5.1 | Playwright smoke | ✅ (`yarn test:e2e`) |
| S5.2 | Rate limit | ✅ (auth middleware + server actions) |
| S5.3 | Dockerfile app | ✅ |
| S5.4 | Деплой VPS lendings | 🟡 compose.prod + `/api/health` (домен/nginx — след.) |
| S5.5 | GitHub repo + push | ✅ https://github.com/Jackman108/ad-app |

---

## Вне MVP (не в спринтах до S5)

Notification badge · избранное UI · EAV-атрибуты · платежи · модерация-админка · отдельный хост.

## Блокеры снаружи

SMTP · Google OAuth · Telegram bot · SMS BY — нужны для S1.4–S1.5, **не** для exit S4.
