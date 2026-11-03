# Аудит спринтов — 03.11.2026

Продукт: **Объявки BY** · планируемый host **abyawki.by** · репо https://github.com/Jackman108/ad-app

## Сводка

| Спринт | Статус | Комментарий |
| --- | --- | --- |
| S0 Foundation | ✅ | Docs, Next, Prisma, сиды РБ |
| S1 Auth email | ✅ / ⏸ | Email+пароль+sign-out ✅; SMTP/OAuth/OTP ⏸ |
| S2 Listings CRUD | ✅ | Create/publish, my+FSM+edit, карточка, лента |
| S3 Feed+Images+Filters | ✅ | Фильтры, upload, обложка, поиск |
| S4 In-app deals | ✅ | Conversation/Message, inbox, телефон auth, Report |
| S5 Smoke+Deploy | 🟡 | Playwright+rate limit+Dockerfile+GitHub ✅; **VPS/DNS 🟡** |

**MVP-ядро (S0–S4) закрыто по коду.** Остаток — выкладка и внешние секреты.

## Открытый backlog (приоритет)

1. **S5.4** — поднять на mesh-VPS `/opt/ad-app` с лимитами; временно без `.by`; после покупки **abyawki.by** — DNS+TLS+Caddy/nginx.
2. **S5.1 runtime** — `npm i -D @playwright/test` + `test:e2e:install` (сеть к registry часто рвётся).
3. **Docker image** — дождаться/добить `docker compose … build` (npm ci в образе медленный).
4. **Ручной смоук** двумя аккаунтами: лента → карточка → «Написать» → inbox; телефон только после входа.
5. **S1.4–S1.5** — SMTP, Google, Telegram, phone OTP (блокеры снаружи).

## Вне MVP (осознанно позже)

Избранное UI · notification badge · EAV-атрибуты · модерация-админка · платежи · отдельный хост.

## Риски

| Риск | Митигация |
| --- | --- |
| Shared VPS + соседи (febcode) | mem/cpu limits в `server/ad-app/docker-compose.yml` |
| Домен не куплен | временный host/IP; канон имени уже `abyawki.by` |
| Секреты auth | не коммитить; `.env` / VPS secrets |

## Качество кода (коротко)

- Слои FSD: `app` → `features` → `entities` → `shared` — соблюдаются для мутаций.
- FSM статусов Listing — через use-case.
- Public DTO без телефона — ок.
- Rate limit — middleware auth + actions.
