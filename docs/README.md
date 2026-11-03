# Документация Объявки BY

**Обновлено**: 03.11.2026

Продукт: объявления от частных лиц (РБ). Планируемый host: **abyawki.by**.  
Репо: https://github.com/Jackman108/ad-app

Индекс живых документов. Один источник правды — без копипасты между файлами.

## Текущее состояние

| Область | Статус |
| --- | --- |
| Продукт | **Объявки BY** · MVP РБ |
| Код | S0–S4 ✅ · S5 🟡 (деплой/DNS) |
| Последний аудит | [guides/sprint-audit-2026-11-03-ru.md](guides/sprint-audit-2026-11-03-ru.md) |
| Стек | **Принято** — [ADR 0001](adr/0001-core-stack.md) |
| Auth / контакт | **Принято** — [ADR 0002](adr/0002-auth-and-contact.md) |
| Домен / сущности | **Принято** — [guides/domain-model-ru.md](guides/domain-model-ru.md), [ADR 0003](adr/0003-domain-model.md) |

## Гайды

| Файл | Тема |
| --- | --- |
| [guides/environment-ru.md](guides/environment-ru.md) | Инструменты и локальное окружение |
| [guides/architecture-ru.md](guides/architecture-ru.md) | Архитектура, границы модулей, MVP-скоуп |
| [guides/domain-model-ru.md](guides/domain-model-ru.md) | Сущности, ER, FSM, DTO-безопасность |
| [guides/strategy-plan-ru.md](guides/strategy-plan-ru.md) | Стратегический план фаз 0–5 |
| [guides/sprint-map-ru.md](guides/sprint-map-ru.md) | Карта спринтов S0–S5 |
| [guides/sprint-audit-2026-11-03-ru.md](guides/sprint-audit-2026-11-03-ru.md) | Свежий аудит остатка |
| [guides/clean-code-ru.md](guides/clean-code-ru.md) | Clean Architecture, SOLID, паттерны |
| [guides/deploy-ru.md](guides/deploy-ru.md) | Docker prod + выкладка на VPS |

## ADR

| Файл | Тема |
| --- | --- |
| [adr/README.md](adr/README.md) | Реестр решений |
| [adr/0001-core-stack.md](adr/0001-core-stack.md) | Стек, CSS Modules + tokens, VPS |
| [adr/0002-auth-and-contact.md](adr/0002-auth-and-contact.md) | Email/phone/Google/TG + политика телефона |
| [adr/0003-domain-model.md](adr/0003-domain-model.md) | Домен MVP и границы роста |

## Changelog

| Файл | Тема |
| --- | --- |
| [changelog.md](changelog.md) | История изменений проекта |

## Правила агента

`.cursor/rules/` — `project-overview`, `tech-stack`, `domain-model`, `clean-architecture`, `agent-workflow`.
