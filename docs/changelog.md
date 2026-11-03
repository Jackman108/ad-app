# Changelog

Формат: [Keep a Changelog](https://keepachangelog.com/ru/1.1.0/).
Коммиты — Conventional Commits.

## [Unreleased]

### Added

- Scaffold фазы 0: Next.js App Router, Prisma schema/migration, docker Postgres, сиды РБ, пустая лента `/`
- Фаза 1 (частично): Better Auth email+пароль, модели session/account/verification, страницы `/login` `/register`
- `sprint-map-ru.md`: карта S0–S5; S2: лента, `/listings/new`, карточка, DTO без телефона для гостя
- Fix inbox: `Pop-AgentInbox` показывает/resume `in_progress` (без потери команд)
- Каркас документации (`docs/`) и Cursor rules (`.cursor/rules/`)
- Анализ окружения и архитектуры
- ADR 0001 (принято): Next.js + Prisma + Postgres + CSS Modules/tokens; деплой на VPS lendings временно
- ADR 0002 (принято): auth email+пароль / phone / Google / Telegram; in-app переписка; телефон только авторизованным; только РБ
- ADR 0003 + `domain-model-ru.md`: канон сущностей (Kufar/OLX/marketplace patterns), MVP/фаза2/анти-модель, FSM Listing
- `strategy-plan-ru.md`: фазы 0–5 и порядок исполнения; phone-inbox loop привязан к чату Ad App
