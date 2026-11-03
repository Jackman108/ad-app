# Git-workflow Объявки BY

**Обновлено**: 04.11.2026  
**Правило агента:** `.cursor/rules/git-workflow.mdc`

## Политика

**Пушим после логического завершения** каждой задачи, реализации фичи или фикса — не копим большие пачки «на потом» и не ждём отдельной команды «закоммить», если работа по сути закрыта.

Цель: remote (GitHub) всегда отражает завершённые куски; проще ревью, деплой и продолжение с другого устройства/чата.

## Единица работы

| Триггер | Пример | Действие |
| --- | --- | --- |
| Задача / пункт спринта | S6.5 cascade Region→Locality | commit + push |
| Фича | избранное, bump ленты | commit + push |
| Fix | Prisma binaryTargets на VPS | commit + push |
| Docs/ADR/rules по задаче | аудит + sprint-map S6–S9 | commit + push (можно вместе с кодом или отдельным `docs:`) |

Незавершённый эксперимент, красный `npm run check`, половина миграции без применения — **не** пушить.

## Сообщения коммитов

Conventional Commits (Husky `commit-msg` + `commitlint.config.mjs`):

- `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:`, …
- header ≤ **150** символов; детали — в body при необходимости
- фокус на **почему**, не на списке файлов

## Перед push

1. Нет секретов в индексе (`.env`, ключи)
2. По возможности зелёный `npm run check` (hooks на pre-commit уже гоняют lint-staged + typecheck)
3. `docs/changelog.md` `[Unreleased]` обновлён для этой единицы работы
4. Обычный `git push` (не `--force` на main)

## Remote

- Репо: https://github.com/Jackman108/ad-app
- Ветка по умолчанию — текущая tracking; feature-ветки — по согласованию

## Исключения (нужна явная просьба пользователя)

- `git push --force` / rewrite history на `main`
- `commit --amend` уже запушенного коммита
- Коммит файлов с секретами или огромных бинарников
