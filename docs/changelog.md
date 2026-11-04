# Changelog

Формат: [Keep a Changelog](https://keepachangelog.com/ru/1.1.0/).
Коммиты — Conventional Commits.

## [Unreleased]

### Changed

- **Zavhoz UX:** RU-лейблы статусов WorkOrder (`workOrderStatusLabel`); `AppHeader` ссылка «Диспетчер» для ADMIN; e2e под русские статусы
- **Пивот продукта:** вместо C2C «Объявки BY» — B2B «Завхоз на аутсорсе» ([ADR 0004](adr/0004-product-pivot-zavhoz.md), [business-model-zavhoz-ru.md](guides/business-model-zavhoz-ru.md)); код объявлений S0–S7 заморожен
- **Z0 Завхоз:** [ADR 0005](adr/0005-zavhoz-domain-model.md), [domain-model-zavhoz-ru.md](guides/domain-model-zavhoz-ru.md), [sprint-map-zavhoz-ru.md](guides/sprint-map-zavhoz-ru.md); VPS можно менять в Z6
- **Z1 Завхоз:** Prisma Organization/Site/WorkOrder(+Image)/MasterProfile/WorkCategory; миграция; FSM+DTO; сиды категорий работ + демо Org/Site
- **Z2 Завхоз:** `/orders`, `/orders/new`, `/orders/[id]`; use-case create+SUBMITTED; фото BEFORE без перекодирования; шапка «Завхоз»
- **Z3 Завхоз:** `/dispatch` (ADMIN) — оценка цены и offer мастеру (FSM)
- **Z4 Завхоз:** `/master/orders` — accept/start/complete+AFTER; architecture-ru под Завхоз
- **Z5 Завхоз:** org confirm → CLOSED / rework → IN_PROGRESS на карточке заявки; e2e — позже
- **Z6 Завхоз:** лендинг `/` + siteConfig; VPS `:3010` выкатан (migrate WorkOrder + seed); e2e smoke под Завхоз; meta description из tagline
- **Z5.3:** Playwright `e2e/zavhoz-core.spec.ts` (org→dispatch→master→confirm) + helpers promoteAdmin/ensureMaster
- S5.4: VPS `/opt/ad-app` на `:3010` — Postgres healthy, migrate+seed, health OK; uploads вне `:ro` (`/data/uploads`); Prisma `binaryTargets` debian; домен abyawki.by отложен
- Quality gates: Husky + commitlint + lint-staged; `npm run check`; Playwright smoke (лента / guest→login / create→карточка); `environment-ru` обновлён
- Аудит 04.11: готовность ~66% soft-launch / ~88% ядро; sprint-map S6–S9 (каталог+гео, фильтры+, горячая лента, UX); конкуренты Kufar/OLX/Avito
- Git: политика commit+push после логического завершения задачи/фичи/fixа (`git-workflow.mdc`, `guides/git-workflow-ru.md`)
- Ядро сделки: `readAt`/unread badge, `ContactPanel`, общий `AppHeader`, e2e deal-core; S8 `bumpedAt` отложен; справочники BY в `prisma/data/` — задел под S6
- S6: сиды категорий/городов BY; cascade Region→Locality; фильтр category tree (parent→children); FeedFilters + ListingTaxonomyFields
- S7: лента — condition, «только с фото» (`images.some`), sort new/price, sticky filters + «Найдено N», pagination; relevant title>description при `q`

### Added

- Scaffold фазы 0: Next.js App Router, Prisma schema/migration, docker Postgres, сиды РБ, пустая лента `/`
- Фаза 1 (частично): Better Auth email+пароль, модели session/account/verification, страницы `/login` `/register`
- `sprint-map-ru.md`: карта S0–S5; S2: лента, `/listings/new`, карточка, DTO без телефона для гостя
- `clean-code-ru.md` + rule `clean-architecture.mdc`; жалобы на объявление (Report)
- `/my/listings`: список объявлений продавца + переходы статуса через FSM
- S5: Playwright smoke (`e2e/`), rate limit на auth API и мутации (объявления/сообщения/жалобы)
- Prod: standalone Dockerfile, `docker-compose.prod.yml`, `/api/health`, `docs/guides/deploy-ru.md`
- Бренд **Объявки BY**; VPS-compose рядом с febcode с mem/cpu limits (`server/ad-app`)
- Планируемый домен **abyawki.by** (be: Аб'яўкі)
- Редактирование объявления владельцем: `/listings/[slug]/edit`
- Избранное: toggle на карточке + `/favorites`; аудит спринтов `sprint-audit-2026-11-03-ru.md`
- Fix inbox: `Pop-AgentInbox` показывает/resume `in_progress` (без потери команд)
- Каркас документации (`docs/`) и Cursor rules (`.cursor/rules/`)
- Анализ окружения и архитектуры
- ADR 0001 (принято): Next.js + Prisma + Postgres + CSS Modules/tokens; деплой на VPS lendings временно
- ADR 0002 (принято): auth email+пароль / phone / Google / Telegram; in-app переписка; телефон только авторизованным; только РБ
- ADR 0003 + `domain-model-ru.md`: канон сущностей (Kufar/OLX/marketplace patterns), MVP/фаза2/анти-модель, FSM Listing
- `strategy-plan-ru.md`: фазы 0–5 и порядок исполнения; phone-inbox loop привязан к чату Ad App
